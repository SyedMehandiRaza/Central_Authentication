import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => sendSuccess(res, { status: 'ok' }));

// Mount module routers here: `apiRouter.use('/auth', authRouter);`
