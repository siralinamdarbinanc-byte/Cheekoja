import { Request, Response, NextFunction } from 'express';

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logLevel = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';

    console.log(
      `[${new Date().toISOString()}] [${logLevel}] ${method} ${originalUrl} ${statusCode} - ${duration}ms (IP: ${ip || req.socket.remoteAddress})`
    );
  });

  next();
}
