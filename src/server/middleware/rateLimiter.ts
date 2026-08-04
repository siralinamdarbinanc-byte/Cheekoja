import rateLimit from 'express-rate-limit';

export const otpRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP request calls per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'تعداد درخواست‌های کد تایید شما بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر تلاش کنید.',
    });
  },
});

export const otpVerifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 verify attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'تعداد تلاش‌های تایید کد بیش از حد مجاز است. لطفاً چند دقیقه بعد مجدداً تلاش کنید.',
    });
  },
});

export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // Limit each IP to 120 search queries per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'تعداد درخواست‌های جستجوی شما بیش از حد مجاز در دقیقه است.',
    });
  },
});

export const businessWriteRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25, // Limit each IP to 25 business creation / claim requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'تعداد درخواست‌های ثبت یا ویرایش کسب‌وکار بیش از حد مجاز است.',
    });
  },
});
