import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../env';

const publicPaths = ['/auth/login'];

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'OPTIONS' || publicPaths.includes(req.path)) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.auth.jwtSecret);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
