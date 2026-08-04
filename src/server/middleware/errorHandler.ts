import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: any;

  constructor(message: string, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedDetails = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: formattedDetails[0]?.message || 'اطلاعات ورودی نامعتبر است',
      details: formattedDetails,
    });
  }

  // 2. Custom App Error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.errorCode,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // 3. Syntax / JSON Parsing Error
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'قالب درخواست JSON ارسال‌شده نامعتبر است',
    });
  }

  // 4. Fallback Internal Server Error
  console.error(`[ERROR] ${req.method} ${req.url}:`, err);

  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'خطای غیرمنتظره سرور رخ داده است' : err.message || 'خطای داخلی سرور',
  });
}
