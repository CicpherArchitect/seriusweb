import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';
import prisma from '../lib/prisma.js';

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(new AppError('API key is required', 401));
  }

  try {
    const user = await prisma.user.findFirst({
      where: { apiKey: apiKey as string }
    });

    if (!user) {
      return next(new AppError('Invalid API key', 401));
    }

    req.user = {
      userId: user.id,
      role: user.role
    };

    next();
  } catch (error) {
    next(error);
  }
};