import 'express';

export interface AuthUser {
  id: string;
  phoneNumber: string;
  fullName?: string | null;
  role: 'USER' | 'BUSINESS_OWNER' | 'ADMIN' | string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
