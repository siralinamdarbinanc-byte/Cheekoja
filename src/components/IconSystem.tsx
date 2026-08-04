import React from 'react';
import {
  Wrench,
  Coffee,
  ForkKnife,
  FirstAid,
  Hospital,
  ShoppingCart,
  Scissors,
  Armchair,
  Fan,
  Lightning,
  Drop,
  Car,
  Stethoscope,
  Buildings,
  Briefcase,
  DeviceMobile,
  GearSix,
  PhoneCall,
  NavigationArrow,
  BookmarkSimple,
  ShareNetwork,
  BellRinging,
  CheckCircle,
  XCircle,
  Timer,
  ShieldCheck,
  House,
  MagnifyingGlass,
  MapPin,
  Sparkle,
  Compass,
  ArrowRight,
  CaretLeft,
  CalendarCheck,
  Clock,
  SealCheck,
  Storefront,
  PencilSimple,
  Trash,
  Plus,
  Check,
  X,
  Buildings as MarketZoneIcon
} from '@phosphor-icons/react';

export type IconSize = 18 | 20 | 24 | 32;

interface IconProps {
  size?: IconSize;
  className?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}

/**
 * 1. CUSTOM SVG ICONS FOR PERSIAN LOCALISED GUILDS & STATUS BADGES
 */

// Custom Persian Cooling / HVAC Fan SVG
export const CustomHVACFanIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-300 hover:rotate-180 ${className}`}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9C10.5 6 10 3 13 3C15 3 15 5 12 9Z" />
    <path d="M12 15C13.5 18 14 21 11 21C9 21 9 19 12 15Z" />
    <path d="M15 12C18 13.5 21 14 21 11C21 9 19 9 15 12Z" />
    <path d="M9 12C6 10.5 3 10 3 13C3 15 5 15 9 12Z" />
    <circle cx="12" cy="12" r="9" strokeDasharray="2 2" opacity="0.4" />
  </svg>
);

// Custom Sangak Bakery & Wheat Ear SVG
export const CustomBakeryBreadIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 14C4 8.47715 8.47715 4 14 4C17.5 4 20 6.5 20 10C20 16 16 20 10 20C6.5 20 4 17.5 4 14Z" />
    <path d="M8 9L15 16" strokeDasharray="2 2" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
    <circle cx="13" cy="10" r="1" fill="currentColor" />
  </svg>
);

// Custom Persian Market Zone (راسته بازار) Icon
export const CustomMarketZoneIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 21H21" />
    <path d="M4 21V10L12 4L20 10V21" />
    <path d="M9 21V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V21" />
    <path d="M7 10H17" />
  </svg>
);

// Custom Verified Owner Shield Star Badge Icon
export const CustomOwnerBadgeIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2L4 5V11C4 16.523 7.41 21.362 12 22C16.59 21.362 20 16.523 20 11V5L12 2Z" />
    <path d="M9 12L11 14L15 9.5" strokeWidth="2" />
  </svg>
);

// Custom Plumbing Pipe & Water Drop SVG
export const CustomPlumbingPipeIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2V12" />
    <path d="M12 12C12 15.3137 14.6863 18 18 18H21" />
    <path d="M12 12C12 15.3137 9.31371 18 6 18H3" />
    <circle cx="12" cy="5" r="2" />
  </svg>
);

/**
 * 2. CATEGORY ICON MAPPER
 */
export const CategoryIcon: React.FC<{
  categoryKey: string;
  size?: IconSize;
  className?: string;
}> = ({ categoryKey, size = 20, className = '' }) => {
  const normalized = categoryKey.toLowerCase();

  if (normalized.includes('تاسیسات') || normalized.includes('سرمایش') || normalized.includes('کولر')) {
    return <CustomHVACFanIcon size={size} className={`text-cyan-500 ${className}`} />;
  }
  if (normalized.includes('خودرو') || normalized.includes('مکانیکی') || normalized.includes('تعمیرگاه')) {
    return <Car size={size} weight="regular" className={`text-amber-500 ${className}`} />;
  }
  if (normalized.includes('یدکی') || normalized.includes('قطعات')) {
    return <GearSix size={size} weight="regular" className={`text-orange-500 ${className}`} />;
  }
  if (normalized.includes('مبل') || normalized.includes('چوب') || normalized.includes('دکوراسیون')) {
    return <Armchair size={size} weight="regular" className={`text-emerald-600 ${className}`} />;
  }
  if (normalized.includes('پزشکی') || normalized.includes('سلامت') || normalized.includes('درمان')) {
    return <Stethoscope size={size} weight="regular" className={`text-rose-500 ${className}`} />;
  }
  if (normalized.includes('داروخانه') || normalized.includes('دارو')) {
    return <FirstAid size={size} weight="regular" className={`text-emerald-500 ${className}`} />;
  }
  if (normalized.includes('ابزار') || normalized.includes('ساختمان') || normalized.includes('یراق')) {
    return <Wrench size={size} weight="regular" className={`text-blue-500 ${className}`} />;
  }
  if (normalized.includes('سوپر') || normalized.includes('غذایی') || normalized.includes('مواد')) {
    return <ShoppingCart size={size} weight="regular" className={`text-teal-500 ${className}`} />;
  }
  if (normalized.includes('نان') || normalized.includes('قنادی')) {
    return <CustomBakeryBreadIcon size={size} className={`text-amber-600 ${className}`} />;
  }
  if (normalized.includes('پوشاک') || normalized.includes('خیاطی')) {
    return <Scissors size={size} weight="regular" className={`text-purple-500 ${className}`} />;
  }
  if (normalized.includes('موبایل') || normalized.includes('دیجیتال') || normalized.includes('کامپیوتر')) {
    return <DeviceMobile size={size} weight="regular" className={`text-indigo-500 ${className}`} />;
  }
  if (normalized.includes('کافه') || normalized.includes('قهوه')) {
    return <Coffee size={size} weight="regular" className={`text-amber-700 ${className}`} />;
  }
  if (normalized.includes('رستوران') || normalized.includes('غذا')) {
    return <ForkKnife size={size} weight="regular" className={`text-red-500 ${className}`} />;
  }
  if (normalized.includes('برق') || normalized.includes('الکتریکی')) {
    return <Lightning size={size} weight="regular" className={`text-yellow-500 ${className}`} />;
  }
  if (normalized.includes('لوله') || normalized.includes('آبرسانی')) {
    return <CustomPlumbingPipeIcon size={size} className={`text-blue-600 ${className}`} />;
  }

  // Fallback
  return <Storefront size={size} weight="regular" className={`text-slate-500 ${className}`} />;
};

/**
 * 3. STATUS ICONS MAPPER
 */
export const StatusIcon: React.FC<{
  statusType: 'open' | 'closed' | 'opening_soon' | 'verified_phone' | 'verified_owner' | 'market_zone';
  size?: IconSize;
  className?: string;
}> = ({ statusType, size = 18, className = '' }) => {
  switch (statusType) {
    case 'open':
      return <CheckCircle size={size} weight="bold" className={`text-emerald-500 animate-pulse ${className}`} />;
    case 'closed':
      return <XCircle size={size} weight="bold" className={`text-rose-500 ${className}`} />;
    case 'opening_soon':
      return <Timer size={size} weight="bold" className={`text-amber-500 ${className}`} />;
    case 'verified_owner':
      return <CustomOwnerBadgeIcon size={size} className={`text-cyan-500 ${className}`} />;
    case 'verified_phone':
      return <SealCheck size={size} weight="bold" className={`text-emerald-500 ${className}`} />;
    case 'market_zone':
      return <CustomMarketZoneIcon size={size} className={`text-amber-600 ${className}`} />;
    default:
      return null;
  }
};

/**
 * EXPORT RE-USABLE MODERN STROKE ICONS FROM PHOSPHOR / SYSTEM
 */
export {
  House,
  MagnifyingGlass,
  MapPin,
  Sparkle,
  Compass,
  ArrowRight,
  CaretLeft,
  CalendarCheck,
  Clock,
  SealCheck,
  Storefront,
  PencilSimple,
  Trash,
  Plus,
  Check,
  X,
  PhoneCall,
  NavigationArrow,
  BookmarkSimple,
  ShareNetwork,
  BellRinging,
  ShieldCheck,
};
