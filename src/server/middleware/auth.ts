import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { db } from '../db';
import { AuthUser } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'chekoja-production-secret-key-2026';

export function generateJwtToken(user: { id: string; phoneNumber: string; role: string; fullName?: string | null }): string {
  return jwt.sign(
    {
      id: user.id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName || null,
      role: user.role || 'USER',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function verifyTokenPayload(token: string): Promise<AuthUser | null> {
  if (!token) return null;

  // 1. Support legacy dev token format: token-{userId}-{timestamp}
  if (token.startsWith('token-')) {
    const parts = token.split('-');
    const userId = parts[1];
    if (userId) {
      // Lookup user in DB to obtain up-to-date role and details
      const dbUser = await db.getUserById(userId);
      if (dbUser) {
        return {
          id: dbUser.id,
          phoneNumber: dbUser.phoneNumber,
          fullName: dbUser.fullName,
          role: dbUser.role || 'USER',
        };
      }
      return {
        id: userId,
        phoneNumber: '09120000000',
        fullName: 'کاربر احرازشده',
        role: 'USER',
      };
    }
  }

  // 2. Standard Signed JWT Verification
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && decoded.id) {
      return {
        id: decoded.id,
        phoneNumber: decoded.phoneNumber || '',
        fullName: decoded.fullName || null,
        role: decoded.role || 'USER',
      };
    }
  } catch (err) {
    return null;
  }

  return null;
}

export async function authenticateJwt(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('جهت دسترسی به این بخش، احراز هویت و ورود الزامی است.', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.substring(7).trim();
  const user = await verifyTokenPayload(token);

  if (!user) {
    return next(new AppError('توکن احراز هویت نامعتبر یا منقضی شده است.', 401, 'UNAUTHORIZED'));
  }

  req.user = user;
  next();
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const user = await verifyTokenPayload(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}
