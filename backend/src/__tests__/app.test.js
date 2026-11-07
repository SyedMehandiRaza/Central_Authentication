import { commonMessages, ERROR_CODES } from '@app/shared';
import express from 'express';
import request from 'supertest';
import { createApp } from '../app.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../utils/AppError.js';

function appThatThrows(error) {
  const app = express();
  app.get('/', () => {
    throw error;
  });
  app.use(errorHandler);
  return app;
}

describe('app', () => {
  test('GET /api/health reports ok', async () => {
    const res = await request(createApp()).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { status: 'ok' } });
  });

  test('sets security headers', async () => {
    const res = await request(createApp()).get('/api/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  test('allows only configured CORS origins', async () => {
    const allowed = await request(createApp())
      .get('/api/health')
      .set('Origin', 'http://allowed.test');
    const denied = await request(createApp()).get('/api/health').set('Origin', 'http://evil.test');

    expect(allowed.headers['access-control-allow-origin']).toBe('http://allowed.test');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  test('unknown routes return the 404 contract', async () => {
    const res = await request(createApp()).get('/api/nope');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: { code: ERROR_CODES.NOT_FOUND, message: commonMessages.notFound },
    });
  });

  test('malformed JSON returns 400 without parser details', async () => {
    const res = await request(createApp())
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{bad');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: ERROR_CODES.BAD_REQUEST,
      message: commonMessages.badRequest,
    });
  });

  test('an oversized body returns 413', async () => {
    const res = await request(createApp())
      .post('/api/health')
      .send({ value: 'x'.repeat(101 * 1024) });

    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe(ERROR_CODES.PAYLOAD_TOO_LARGE);
  });
});

describe('errorHandler', () => {
  test('hides the details of unexpected errors', async () => {
    const res = await request(appThatThrows(new Error('secret SQL detail'))).get('/');

    expect(res.status).toBe(500);
    expect(res.body.error).toEqual({
      code: ERROR_CODES.INTERNAL_ERROR,
      message: commonMessages.internalError,
    });
    expect(res.text).not.toContain('secret SQL detail');
  });

  test('maps an unmapped unique-constraint error to 409', async () => {
    const error = Object.assign(new Error('Duplicate entry'), {
      name: 'SequelizeUniqueConstraintError',
    });

    const res = await request(appThatThrows(error)).get('/');

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe(commonMessages.conflict);
  });

  test('sends an AppError with its fields', async () => {
    const fields = { email: ['Taken'] };
    const res = await request(
      appThatThrows(new AppError(ERROR_CODES.VALIDATION_ERROR, { fields })),
    ).get('/');

    expect(res.status).toBe(422);
    expect(res.body.error.fields).toEqual(fields);
  });
});
