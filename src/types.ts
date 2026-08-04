export type DayOfWeek = 'شنبه' | 'یکشنبه' | 'دوشنبه' | 'سه‌شنبه' | 'چهارشنبه' | 'پنج‌شنبه' | 'جمعه';

export interface WorkingHours {
  open: string; // e.g., "08:00"
  close: string; // e.g., "21:00"
}

export interface MarketZone {
  id: string;
  name: string; // e.g. "راسته ابزار و سیستم‌های برودتی سعدی"
  slug: string;
  city: string;
  specialty: string; // e.g. "قطعات برودتی، پمپ و برق صنعتی"
  description?: string;
  lat?: number;
  lng?: number;
}

export interface Business {
  id: string;
  name: string;
  activityTitle: string; // e.g., "فروشگاه لوازم کولر و تاسیسات"
  category: string;
  subCategory: string;
  address: string;
  city: string;
  neighborhood?: string;
  lat: number;
  lng: number;
  phone: string;
  secondaryPhone?: string;
  workingHours: WorkingHours;
  workingDays: DayOfWeek[];
  todayManualOverride?: 'open' | 'closed' | 'custom_hours';
  todayCustomHours?: WorkingHours;
  shortDescription: string;
  images: string[];
  tags: string[]; // Keywords like "پمپ کولر", "لنت پژو", "فوم مبل"
  completenessScore: number; // 0 - 100
  rating: number; // e.g. 4.8
  createdAt: string;

  // Trust Verification System (2026 Badges)
  trustPhoneVerified?: boolean;
  trustOwnerVerified?: boolean;
  trustLocationVerified?: boolean;
  lastUpdatedInfo?: string; // e.g. "امروز" or "۲ روز پیش"

  // Iranian Market Zone (راسته بازار)
  marketZone?: MarketZone;
  marketZoneName?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  icon?: string;
  subCategories: string[];
  popularKeywords: string[];
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  neighborhood?: string;
  address?: string;
  isCustom?: boolean;
}

export interface SearchFilters {
  query: string;
  category: string;
  subCategory: string;
  openOnly: boolean;
  maxDistanceKm: number; // e.g. 10
  sortBy: 'distance' | 'openStatus' | 'completeness' | 'relevance' | 'rating';
}

export interface SmartNotification {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'opening_soon' | 'closed' | 'status_reminder';
}

export interface ComputedStatus {
  isOpen: boolean;
  statusText: string; // e.g. "باز است" or "بسته است"
  badgeColor: 'emerald' | 'rose' | 'amber';
  detailText: string; // e.g. "باز تا ساعت ۲۱:۰۰" or "فردا ساعت ۰۸:۰۰ باز می‌شود"
}

export type UserRole = 'USER' | 'BUSINESS_OWNER' | 'ADMIN';

export interface Shift {
  id?: string;
  dayOfWeek: number; // 0 = Saturday, ..., 6 = Friday
  openTime: string; // "08:00"
  closeTime: string; // "13:30"
  shiftLabel?: string; // "شیفت صبح" / "شیفت عصر"
  isClosed?: boolean;
}

export interface BusinessKeyword {
  id?: string;
  keyword: string;
  weight: number;
}

export interface User {
  id: string;
  phoneNumber: string;
  fullName?: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}
