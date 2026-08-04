import React, { useState } from 'react';
import {
  PhoneCall,
  NavigationArrow,
  ShareNetwork,
  BookmarkSimple,
  X,
  MapPin,
  Clock,
  Star,
  SealCheck,
  Buildings,
  ShieldCheck,
  CalendarCheck,
  Storefront,
  Check
} from '@phosphor-icons/react';
import { Business } from '../types';
import { computeBusinessStatus } from '../utils/businessStatus';
import { CategoryIcon, StatusIcon } from './IconSystem';

interface BusinessModalProps {
  business: Business;
  onClose: () => void;
  onDirections?: (b: Business) => void;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  business,
  onClose,
  onDirections,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'verified'>('info');

  const computedStatus = computeBusinessStatus(business);
  const isOpen = computedStatus.isOpen;

  const copyPhoneNumber = (phoneStr: string) => {
    navigator.clipboard.writeText(phoneStr);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `${business.name} - ${business.activityTitle} در چیکجا`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyPhoneNumber(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col dir-rtl">
        {/* Header Bar */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-100 dark:bg-slate-800 shrink-0">
          <img
            src={business.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          {/* Close & Share Action Overlay */}
          <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/90 transition-all backdrop-blur-md active:scale-90"
              title="بستن"
            >
              <X size={20} weight="bold" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/90 transition-all backdrop-blur-md active:scale-90"
                title="اشتراک‌گذاری"
              >
                <ShareNetwork size={20} weight="regular" />
              </button>
              <button
                className="p-2.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/90 transition-all backdrop-blur-md active:scale-90"
                title="ذخیره"
              >
                <BookmarkSimple size={20} weight="regular" />
              </button>
            </div>
          </div>

          {/* Bottom Banner Title */}
          <div className="absolute bottom-4 right-4 left-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <CategoryIcon categoryKey={business.category} size={14} className="text-white" />
                <span>{business.category}</span>
              </span>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${
                  isOpen ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                <StatusIcon statusType={isOpen ? 'open' : 'closed'} size={14} />
                <span>{computedStatus.statusText}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{business.name}</h2>
            <p className="text-xs text-slate-300 font-bold mt-0.5">{business.activityTitle}</p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            اطلاعات اصلی
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'hours'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            ساعت کاری و روزها
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'verified'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            اصالت و تاییدیه
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 space-y-4 flex-1">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Iranian Market Zone Banner */}
              {(business.marketZoneName || business.marketZone) && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Buildings size={20} weight="regular" className="text-amber-600 shrink-0" />
                  <div>
                    <strong className="font-bold ml-1">استقرار در راسته بازار:</strong>
                    <span>{business.marketZoneName || business.marketZone?.name}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">درباره این کاسبی:</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {business.shortDescription}
                </p>
              </div>

              {/* Address */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-start gap-2.5">
                <MapPin size={20} weight="regular" className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-bold text-slate-900 dark:text-white block">آدرس دقیق:</strong>
                  <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{business.address}</span>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <PhoneCall size={20} weight="regular" className="text-emerald-500" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">تلفن تماس:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono font-bold mt-0.5 block dir-ltr">
                      {business.phone}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copyPhoneNumber(business.phone)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-[11px] transition-all border border-slate-200 dark:border-slate-600 active:scale-95"
                >
                  {copiedPhone ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check size={14} weight="bold" /> کپی شد
                    </span>
                  ) : (
                    'کپی شماره'
                  )}
                </button>
              </div>

              {/* Keywords & Tags */}
              {business.tags && business.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5">کلمات کلیدی صنف:</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {business.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock size={16} weight="regular" className="text-emerald-500" />
                    ساعت کاری استاندارد:
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {business.workingHours.open} الی {business.workingHours.close}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <CalendarCheck size={16} weight="regular" className="text-emerald-500" />
                    روزهای کاری هفته:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {business.workingDays.join(' ، ')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <StatusIcon statusType={isOpen ? 'open' : 'closed'} size={18} />
                <span>{computedStatus.detailText || 'بر اساس ساعات کاری ثبت شده در سامانه چیکجا'}</span>
              </div>
            </div>
          )}

          {activeTab === 'verified' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center gap-3">
                <SealCheck size={24} weight="fill" className="text-emerald-500 shrink-0" />
                <div>
                  <strong className="font-bold text-slate-900 dark:text-white block">تایید شماره تلفن ثابت و همراه</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 block">
                    شماره تماس مستقیم توسط کارشناسان چیکجا استعلام و تایید گردیده است.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center gap-3">
                <ShieldCheck size={24} weight="fill" className="text-cyan-500 shrink-0" />
                <div>
                  <strong className="font-bold text-slate-900 dark:text-white block">احراز هویت مالک کسب‌وکار</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 block">
                    جواز کسب یا مدارک معتبر صنف توسط سیستم بررسی شده است.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center gap-3">
                <Storefront size={24} weight="regular" className="text-amber-500 shrink-0" />
                <div>
                  <strong className="font-bold text-slate-900 dark:text-white block">موقعیت مکانی ثبت شده</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 block">
                    مختصات جغرافیایی مغازه در نقشه چیکجا جانمایی و پایش گردیده است.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <a
            href={`tel:${business.phone}`}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <PhoneCall size={18} weight="regular" />
            <span>تماس تلفنی مستقیم</span>
          </a>

          {onDirections && (
            <button
              onClick={() => onDirections(business)}
              className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <NavigationArrow size={18} weight="regular" className="text-emerald-400 dark:text-emerald-600" />
              <span>مسیریابی هوشمند</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
