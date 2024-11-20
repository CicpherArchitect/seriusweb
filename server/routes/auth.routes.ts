import { Router } from 'express';
import { login, register, refreshToken } from '../controllers/auth.controller.js';
import { validateSchema } from '../middleware/validateSchema.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

export const authRouter = Router();

authRouter.post('/login', validateSchema(loginSchema), login);
authRouter.post('/register', validateSchema(registerSchema), register);
authRouter.post('/refresh-token', refreshToken);