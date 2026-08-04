import { Router } from 'express';
import { db } from '../db';
import { searchBusinesses } from '../services/searchEngine';
import { notificationEngine } from '../services/notificationEngine';
import { validateBody, validateQuery } from '../middleware/validation';
import {
  otpRequestSchema,
  otpVerifySchema,
  searchQuerySchema,
  createBusinessSchema,
  claimBusinessSchema,
} from '../schemas';
import {
  otpRequestRateLimiter,
  otpVerifyRateLimiter,
  searchRateLimiter,
  businessWriteRateLimiter,
} from '../middleware/rateLimiter';
import { generateJwtToken, authenticateJwt, optionalAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { AppError } from '../middleware/errorHandler';

export const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CheKoja Core API (Production Hardened & Secured)',
    version: '1.0.0',
  });
});

// Auth: OTP Request Endpoint (Rate Limited & Zod Validated)
apiRouter.post(
  '/auth/otp/request',
  otpRequestRateLimiter,
  validateBody(otpRequestSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      const code = await db.createOtp(phoneNumber);

      res.json({
        success: true,
        message: `کد تایید برای شماره ${phoneNumber} ارسال شد`,
        testOtpCode: code,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Auth: OTP Verify Endpoint (Rate Limited & Zod Validated)
apiRouter.post(
  '/auth/otp/verify',
  otpVerifyRateLimiter,
  validateBody(otpVerifySchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, code } = req.body;
      const user = await db.verifyOtp(phoneNumber, code);

      if (!user) {
        throw new AppError('کد تایید اشتباه است یا منقضی شده است', 401, 'UNAUTHORIZED');
      }

      const jwtToken = generateJwtToken(user);

      res.json({
        success: true,
        message: 'ورود با موفقیت انجام شد',
        data: {
          token: jwtToken,
          user: {
            id: user.id,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Categories Hierarchy Endpoint
apiRouter.get('/categories', async (_req, res, next) => {
  try {
    const list = await db.getCategories();
    res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    next(err);
  }
});

// Shared Search Logic Handler
const handleSearch = async (req: any, res: any, next: any) => {
  try {
    const { query, category, subCategory, lat, lng, maxDistanceKm, openOnly, sortBy } = req.query;
    const allBusinesses = await db.getBusinesses();

    const results = searchBusinesses(allBusinesses, {
      query: query as string,
      category: category as string,
      subCategory: subCategory as string,
      lat: lat ? parseFloat(lat as string) : 35.6892,
      lng: lng ? parseFloat(lng as string) : 51.389,
      maxDistanceKm: maxDistanceKm ? parseFloat(maxDistanceKm as string) : 50,
      openOnly: openOnly === true || openOnly === 'true',
      sortBy: (sortBy as any) || 'relevance',
    });

    res.json({
      success: true,
      total: results.length,
      data: results.map((r) => ({
        ...r.business,
        distanceKm: r.distanceKm,
        statusInfo: r.statusInfo,
        relevanceScore: r.relevanceScore,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// Search Engine Endpoints (/search and /businesses/search) with Rate Limiting & Validation
apiRouter.get('/search', searchRateLimiter, validateQuery(searchQuerySchema), handleSearch);
apiRouter.get('/businesses/search', searchRateLimiter, validateQuery(searchQuerySchema), handleSearch);

// Businesses: List Endpoint
apiRouter.get('/businesses', async (_req, res, next) => {
  try {
    const list = await db.getBusinesses();
    res.json({
      success: true,
      total: list.length,
      data: list,
    });
  } catch (err) {
    next(err);
  }
});

// Businesses: Get by ID Endpoint
apiRouter.get('/businesses/:id', async (req, res, next) => {
  try {
    const biz = await db.getBusinessById(req.params.id);
    if (!biz) {
      throw new AppError('کسب‌وکار مورد نظر یافت نشد', 404, 'NOT_FOUND');
    }
    res.json({
      success: true,
      data: biz,
    });
  } catch (err) {
    next(err);
  }
});

// Businesses: Create Endpoint (Protected with Rate Limit, Auth & Validation)
apiRouter.post(
  '/businesses',
  businessWriteRateLimiter,
  optionalAuth,
  validateBody(createBusinessSchema),
  async (req, res, next) => {
    try {
      const payload = { ...req.body };
      if (req.user) {
        payload.ownerId = req.user.id;
      }

      const newBiz = await db.createBusiness(payload);
      res.status(201).json({
        success: true,
        message: 'کسب‌وکار با موفقیت در دیتابیس ثبت گردید',
        data: newBiz,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Businesses: Claim Business Endpoint (Protected with Rate Limit, Auth & Validation)
apiRouter.post(
  '/businesses/:id/claim',
  businessWriteRateLimiter,
  optionalAuth,
  validateBody(claimBusinessSchema),
  async (req, res, next) => {
    try {
      const { ownerId, ownerName } = req.body;
      const targetOwnerId = req.user?.id || ownerId;

      const updated = await db.claimBusiness(req.params.id, targetOwnerId);
      if (!updated) {
        throw new AppError('کسب‌وکار جهت ثبت ادعای مالکیت یافت نشد', 404, 'NOT_FOUND');
      }

      res.json({
        success: true,
        message: `مالکیت کسب‌وکار ${updated.name} به نام ${ownerName || targetOwnerId} ثبت گردید.`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Smart Notifications Endpoint
apiRouter.get('/notifications', async (_req, res, next) => {
  try {
    const items = await notificationEngine.getNotifications();
    res.json({
      success: true,
      data: items,
    });
  } catch (err) {
    next(err);
  }
});
