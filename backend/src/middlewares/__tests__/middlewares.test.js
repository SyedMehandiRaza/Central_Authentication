import { commonMessages, ERROR_CODES } from '@app/shared';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { z } from 'zod';
import { signAccessToken, signRefreshToken } from '../../utils/jwt.js';
import { authenticate, authorize } from '../authenticate.js';
import { errorHandler } from '../errorHandler.js';
import { createAuthRateLimiter } from '../rateLimiter.js';
import { validate } from '../validate.js';

function buildApp(...handlers) {
  const app = express();
  app.use(express.json());
  app.post('/', ...handlers, (req, res) => res.json({ validated: req.validated, user: req.user }));
  app.use(errorHandler);
  return app;
}

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

describe('validate', () => {
  // Fixture for the middleware only. Real schemas and messages live in shared/.
  const app = buildApp(
    validate({
      body: z.strictObject({
        email: z.email({ error: 'email message' }),
        profile: z.object({ name: z.string({ error: 'name message' }) }).optional(),
      }),
    }),
  );

  test('puts parsed data on req.validated', async () => {
    const res = await request(app).post('/').send({ email: 'a@b.co' });

    expect(res.status).toBe(200);
    expect(res.body.validated).toEqual({ body: { email: 'a@b.co' } });
  });

  test('returns 422 with messages by dotted field path', async () => {
    const res = await request(app).post('/').send({ email: 'nope', profile: {} });

    expect(res.status).toBe(422);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: commonMessages.invalidInput,
        fields: { email: ['email message'], 'profile.name': ['name message'] },
      },
    });
  });

  test('treats a missing body as empty so required-field messages are returned', async () => {
    const res = await request(app).post('/');

    expect(res.status).toBe(422);
    expect(res.body.error.fields).toEqual({ email: ['email message'] });
  });

  test('rejects unknown keys with the shared message, including __proto__', async () => {
    const res = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('{"email":"a@b.co","__proto__":1,"isAdmin":true}');

    expect(res.status).toBe(422);
    expect(res.text).toContain(`"__proto__":["${commonMessages.unknownField}"]`);
    expect(res.body.error.fields.isAdmin).toEqual([commonMessages.unknownField]);
  });
});

describe('authenticate', () => {
  const app = buildApp(authenticate);

  test('accepts a valid access token and sets req.user', async () => {
    const token = signAccessToken({ userId: 7, roles: ['admin'] });

    const res = await request(app).post('/').set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({ id: '7', roles: ['admin'] });
  });

  test.each([
    ['no header', {}],
    ['the wrong scheme', { Authorization: 'Basic abc' }],
    ['a malformed token', bearer('not-a-token')],
  ])('rejects %s with 401', async (_name, headers) => {
    const res = await request(app).post('/').set(headers);

    expect(res.status).toBe(401);
    expect(res.body.error).toEqual({
      code: ERROR_CODES.UNAUTHORIZED,
      message: commonMessages.unauthorized,
    });
  });

  test('rejects an expired access token', async () => {
    const token = jwt.sign({}, process.env.JWT_ACCESS_SECRET, { expiresIn: -1, subject: '7' });

    const res = await request(app).post('/').set(bearer(token));

    expect(res.status).toBe(401);
  });

  test('rejects a refresh token used as an access token', async () => {
    const { token } = signRefreshToken({ userId: 7 });

    const res = await request(app).post('/').set(bearer(token));

    expect(res.status).toBe(401);
  });

  test('rejects an unsigned token', async () => {
    const token = jwt.sign({ roles: ['admin'] }, '', { algorithm: 'none', subject: '7' });

    const res = await request(app).post('/').set(bearer(token));

    expect(res.status).toBe(401);
  });
});

describe('authorize', () => {
  const app = buildApp(authenticate, authorize('admin'));

  test('allows a user with an allowed role', async () => {
    const token = signAccessToken({ userId: 1, roles: ['admin'] });

    expect((await request(app).post('/').set(bearer(token))).status).toBe(200);
  });

  test('rejects a user without one with 403', async () => {
    const token = signAccessToken({ userId: 1, roles: ['member'] });

    const res = await request(app).post('/').set(bearer(token));

    expect(res.status).toBe(403);
    expect(res.body.error.message).toBe(commonMessages.forbidden);
  });

  test('rejects with 401 when authenticate did not run', async () => {
    const res = await request(buildApp(authorize('admin'))).post('/');

    expect(res.status).toBe(401);
  });
});

describe('createAuthRateLimiter', () => {
  test('returns the 429 contract over the limit', async () => {
    const app = buildApp(createAuthRateLimiter({ limit: 1 }));

    await request(app).post('/');
    const res = await request(app).post('/');

    expect(res.status).toBe(429);
    expect(res.body.error).toEqual({
      code: ERROR_CODES.RATE_LIMITED,
      message: commonMessages.rateLimited,
    });
  });
});
