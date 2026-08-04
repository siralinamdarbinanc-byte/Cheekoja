import React from 'react';
import {
  PhoneCall,
  NavigationArrow,
  BookmarkSimple,
  ShareNetwork,
  MapPin,
  Star,
  SealCheck,
  CaretLeft,
  Clock,
  Buildings
} from '@phosphor-icons/react';
import { RankedBusiness } from '../utils/ranking';
import { formatDistanceText } from '../utils/distance';
import { CategoryIcon, StatusIcon } from './IconSystem';

interface BusinessCardProps {
  rankedBusiness: RankedBusiness;
  onSelect: () => void;
  onDirections?: (e: React.MouseEvent) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  rankedBusiness,
  onSelect,
  onDirections,
}) => {
  const { business, distanceMeters, computedStatus, score } = rankedBusiness;
  const isOpen = computedStatus.isOpen;

  // Handle Share CTA
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: business.name,
          text: `${business.name} - ${business.activityTitle} در چیکجا`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('لینک کاسبی در حافظه موقت کپی شد.');
    }
  };

  return (
    <div
      onClick={onSelect}
      className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden"
    >
      {/* Top Status Badges Row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <CategoryIcon categoryKey={business.category} size={18} />
            <span>{business.category}</span>
          </span>

          {/* Open/Closed Dynamic Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${
              isOpen
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            }`}
          >
            <StatusIcon statusType={isOpen ? 'open' : 'closed'} size={18} />
            <span>{computedStatus.statusText}</span>
          </span>

          {/* Iranian Market Zone (راسته بازار) Badge if exists */}
          {(business.marketZoneName || business.marketZone) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-300/60 dark:border-amber-800">
              <Buildings size={14} weight="regular" className="text-amber-600" />
              <span>راسته: {business.marketZoneName || business.marketZone?.name}</span>
            </span>
          )}
        </div>

        {/* Distance Indicator */}
        <div className="text-left">
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-xl">
            <MapPin size={14} weight="regular" className="text-emerald-500" />
            <span>{formatDistanceText(distanceMeters)}</span>
          </span>
        </div>
      </div>

      {/* Main Info Block */}
      <div className="flex gap-3.5 items-start my-2">
        {/* Thumbnail Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200/60 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300">
          <img
            src={business.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'}
            alt={business.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {business.trustOwnerVerified && (
            <div
              className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-lg shadow-sm"
              title="مالک تایید شده چیکجا"
            >
              <SealCheck size={14} weight="bold" />
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {business.name}
            </h2>
            <div className="flex items-center gap-1 text-amber-500 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
              <Star size={14} weight="fill" />
              <span className="text-xs font-extrabold font-mono">{business.rating || 4.8}</span>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
            {business.activityTitle}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {business.shortDescription}
          </p>

          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock size={14} weight="regular" className="text-slate-400 shrink-0" />
            <span>ساعت کاری: {business.workingHours.open} الی {business.workingHours.close}</span>
          </div>
        </div>
      </div>

      {/* Tags Row */}
      {business.tags && business.tags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar my-2.5 pt-1">
          {business.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-[10px] font-medium whitespace-nowrap"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          {/* Call CTA */}
          <a
            href={`tel:${business.phone}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-xs shadow-emerald-600/20"
          >
            <PhoneCall size={16} weight="regular" />
            <span>تماس</span>
          </a>

          {/* Directions CTA */}
          {onDirections && (
            <button
              onClick={onDirections}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              <NavigationArrow size={16} weight="regular" className="text-emerald-500" />
              <span>مسیریابی</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-90"
            title="اشتراک‌گذاری"
          >
            <ShareNetwork size={18} weight="regular" />
          </button>

          {/* Bookmark Button */}
          <button
            className="p-2 text-slate-400 hover:text-amber-500 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors active:scale-90"
            title="ذخیره کاسبی"
          >
            <BookmarkSimple size={18} weight="regular" />
          </button>

          {/* Details Chevron */}
          <div className="p-1.5 text-slate-400 group-hover:text-emerald-500 transition-colors mr-1">
            <CaretLeft size={18} weight="bold" />
          </div>
        </div>
      </div>
    </div>
  );
};
