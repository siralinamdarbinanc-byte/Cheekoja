import { z } from 'zod';

// Iranian Mobile Number Schema (09xxxxxxxxx)
export const iranMobileSchema = z
  .string({ message: 'شماره تلفن همراه الزامی است' })
  .trim()
  .regex(/^09\d{9}$/, { message: 'شماره تلفن همراه معتبر نیست (مثال: 09121234567)' });

// OTP Request Schema
export const otpRequestSchema = z.object({
  phoneNumber: iranMobileSchema,
});

// OTP Verify Schema
export const otpVerifySchema = z.object({
  phoneNumber: iranMobileSchema,
  code: z
    .string({ message: 'کد تایید الزامی است' })
    .trim()
    .length(6, { message: 'کد تایید باید دقیقا ۶ رقم باشد' }),
});

// Search Query Schema
export const searchQuerySchema = z.object({
  query: z.string().trim().optional(),
  category: z.string().trim().optional(),
  subCategory: z.string().trim().optional(),
  lat: z.coerce.number().min(-90, 'مختصات عرض جغرافیایی نامعتبر است').max(90, 'مختصات عرض جغرافیایی نامعتبر است').optional(),
  lng: z.coerce.number().min(-180, 'مختصات طول جغرافیایی نامعتبر است').max(180, 'مختصات طول جغرافیایی نامعتبر است').optional(),
  maxDistanceKm: z.coerce.number().positive('فاصله باید عددی مثبت باشد').max(1000, 'حداکثر فاصله ۱۰۰۰ کیلومتر است').optional(),
  openOnly: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  sortBy: z.enum(['relevance', 'distance', 'rating', 'newest'], { message: 'نحوه مرتب‌سازی نامعتبر است' }).optional(),
});

// Create Business Schema
export const createBusinessSchema = z.object({
  name: z
    .string({ message: 'نام کسب‌وکار الزامی است' })
    .trim()
    .min(2, { message: 'نام کسب‌وکار باید حداقل ۲ کاراکتر باشد' })
    .max(100, { message: 'نام کسب‌وکار نمی‌تواند بیش از ۱۰۰ کاراکتر باشد' }),
  description: z.string().trim().max(1000, { message: 'توضیحات نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد' }).optional(),
  address: z
    .string({ message: 'آدرس الزامی است' })
    .trim()
    .min(5, { message: 'آدرس باید حداقل ۵ کاراکتر باشد' }),
  phone: z
    .string({ message: 'شماره تماس الزامی است' })
    .trim()
    .min(7, { message: 'شماره تماس معتبر نیست' })
    .max(15, { message: 'شماره تماس طولانی‌تر از حد مجاز است' }),
  category: z.string().trim().optional(),
  subCategory: z.string().trim().optional(),
  marketZoneName: z.string().trim().optional(),
  lat: z.number().min(-90).max(90).optional().default(35.6892),
  lng: z.number().min(-180).max(180).optional().default(51.389),
  images: z.array(z.string().url({ message: 'لینک تصویر معتبر نیست' })).optional(),
});

// Claim Business Schema
export const claimBusinessSchema = z.object({
  ownerId: z.string({ message: 'شناسه مالک الزامی است' }).trim().min(1, { message: 'شناسه مالک معتبر نیست' }),
  ownerName: z.string().trim().optional(),
});
