import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('جهت دسترسی به این بخش، احراز هویت الزامی است.', 401, 'UNAUTHORIZED'));
    }

    const userRole = (req.user.role || 'USER').toUpperCase();

    // ADMIN role has override access for all endpoints
    if (userRole === 'ADMIN') {
      return next();
    }

    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole)) {
      return next(
        new AppError('سطح دسترسی شما برای انجام این عملیات کافی نیست.', 403, 'FORBIDDEN', {
          requiredRoles: allowedRoles,
          userRole: userRole,
        })
      );
    }

    next();
  };
}
