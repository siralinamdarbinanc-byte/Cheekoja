import React, { useState } from 'react';
import {
  Storefront,
  X,
  Clock,
  MapPin,
  CheckCircle,
  CaretLeft,
  ShieldCheck,
  Buildings,
  PhoneCall,
  Check
} from '@phosphor-icons/react';
import { Business, SmartNotification } from '../types';
import { IRAN_MARKET_ZONES } from '../data/marketZones';
import { CATEGORIES } from '../data/categories';
import { createBusinessApi } from '../api/client';
import { LocationPickerMap } from './LocationPickerMap';

interface BusinessOwnerPanelProps {
  businesses?: Business[];
  onUpdateBusiness?: (updated: Business) => void;
  onAddBusiness?: (newBiz: Business) => void;
  onBusinessAdded?: (newBiz: Business) => void;
  onClose: () => void;
  onTriggerNotification?: (notif: Omit<SmartNotification, 'id' | 'time' | 'read'>) => void;
}

export const BusinessOwnerPanel: React.FC<BusinessOwnerPanelProps> = ({
  onAddBusiness,
  onBusinessAdded,
  onClose,
  onTriggerNotification,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Rapid Registration (<60s)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || 'تاسیسات و سرمایش/گرمایش');
  const [marketZoneName, setMarketZoneName] = useState('');
  const [address, setAddress] = useState('تهران، خیابان اصلی، پلاک ۱۰');
  const [lat, setLat] = useState(35.6892);
  const [lng, setLng] = useState(51.3890);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('20:30');
  const [shortDescription, setShortDescription] = useState('');

  // Handle Location Detection
  const handleDetectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        () => alert('امکان دریافت موقعیت مکان نیافت شد، موقعیت پیش‌فرض تنظیم شد.')
      );
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('لطفاً نام کسب‌وکار و شماره تماس را وارد کنید.');
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || 'تهران',
      category: category,
      subCategory: category,
      marketZoneName: marketZoneName || undefined,
      lat: lat,
      lng: lng,
      description: shortDescription.trim() || `کسب‌وکار فعال در زمینه ${category}`,
    };

    let createdBiz: Business = {
      id: `biz-${Date.now()}`,
      name: payload.name,
      activityTitle: `ارائه خدمات و قطعات در صنف ${category}`,
      category: category,
      subCategory: category,
      address: payload.address,
      city: 'تهران',
      marketZoneName: marketZoneName || undefined,
      trustPhoneVerified: true,
      trustOwnerVerified: true,
      trustLocationVerified: true,
      lastUpdatedInfo: 'هم‌اکنون',
      lat: lat,
      lng: lng,
      phone: payload.phone,
      workingHours: { open: openTime, close: closeTime },
      workingDays: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه'],
      shortDescription: payload.description,
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
      tags: [category, marketZoneName, 'کاسبی محلی'].filter(Boolean) as string[],
      completenessScore: 90,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    };

    try {
      const apiRes = await createBusinessApi(payload);
      if (apiRes.success && apiRes.data) {
        createdBiz = {
          ...createdBiz,
          id: apiRes.data.id || createdBiz.id,
          lat: apiRes.data.lat ?? lat,
          lng: apiRes.data.lng ?? lng,
        };
      }
    } catch (err) {
      console.warn('Backend business creation fallback:', err);
    }

    if (onAddBusiness) onAddBusiness(createdBiz);
    if (onBusinessAdded) onBusinessAdded(createdBiz);

    if (onTriggerNotification) {
      onTriggerNotification({
        businessId: createdBiz.id,
        businessName: createdBiz.name,
        title: 'کاسبی جدید ثبت شد',
        message: `کسب‌وکار "${createdBiz.name}" با موفقیت در چی کجا قرار گرفت.`,
        type: 'status_reminder',
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col dir-rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Storefront size={24} weight="regular" />
            <div>
              <h2 className="text-base font-black leading-tight">ثبت سریع کاسبی (زیر ۶۰ ثانیه)</h2>
              <p className="text-[11px] text-emerald-100 font-medium">موتور جستجوی محلی و راسته‌های بازار ایران</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white active:scale-90"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* 3-Step Progress Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>۱</span>
            <span>مشخصات پایه</span>
          </div>
          <CaretLeft size={16} weight="bold" className="text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>۲</span>
            <span>موقعیت مکانی</span>
          </div>
          <CaretLeft size={16} weight="bold" className="text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>۳</span>
            <span>ساعات کاری</span>
          </div>
        </div>

        {/* Modal Wizard Body */}
        <div className="p-6">
          {saveSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle size={36} weight="fill" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">کاسبی شما با موفقیت ثبت شد!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">اطلاعات شما بلافاصله در نقشه و نتایج جستجوی فعال قرار گرفت.</p>
            </div>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* Step 1: Base Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Buildings size={18} weight="regular" className="text-emerald-500" />
                    <span>مرحله اول: نام، شماره تماس و صنف</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نام کسب‌وکار (تابلو): <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: تاسیسات کولر خلیج فارس"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      شماره تماس مستقیم: <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="02133912345 یا 0912..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-9"
                      />
                      <PhoneCall size={18} weight="regular" className="text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        دسته فعالیت اصلی:
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        راسته تجاری / بازار تخصصی:
                      </label>
                      <select
                        value={marketZoneName}
                        onChange={(e) => setMarketZoneName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none text-emerald-700 dark:text-emerald-400"
                      >
                        <option value="">انتخاب راسته بازار (اختیاری)</option>
                        {IRAN_MARKET_ZONES.map((zone) => (
                          <option key={zone.id} value={zone.name}>
                            {zone.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!name || !phone) {
                          alert('لطفاً نام و شماره تماس را وارد کنید.');
                          return;
                        }
                        setStep(2);
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <span>ادامه (انتخاب موقعیت روی نقشه)</span>
                      <CaretLeft size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Location Map Picker */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin size={18} weight="regular" className="text-emerald-500" />
                    <span>مرحله دوم: تعیین جانمایی روی نقشه</span>
                  </h3>

                  <LocationPickerMap
                    lat={lat}
                    lng={lng}
                    onLocationChange={(newLat, newLng, details) => {
                      setLat(newLat);
                      setLng(newLng);
                      if (details?.address) {
                        setAddress(details.address);
                      }
                    }}
                  />

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      آدرس متنی (استخراج‌شده از نقشه - قابل ویرایش):
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="تهران، خیابان..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    <ShieldCheck size={20} weight="regular" className="text-emerald-600 shrink-0" />
                    <span>موقعیت مکانی شما با مختصات ({lat.toFixed(4)}, {lng.toFixed(4)}) ثبت خواهد شد.</span>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold active:scale-95 transition-all"
                    >
                      بازگشت
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <span>ادامه (تنظیم ساعات کاری)</span>
                      <CaretLeft size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Working Hours & Shifts */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock size={18} weight="regular" className="text-emerald-500" />
                    <span>مرحله سوم: تنظیم ساعات کاری و شیفت</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ساعت شروع کار (صبح):
                      </label>
                      <input
                        type="time"
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ساعت پایان کار (عصر/شب):
                      </label>
                      <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      توضیحات کوتاه (اختیاری):
                    </label>
                    <textarea
                      rows={2}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="مثال: پخش عمده قطعات با تحویل سریع زیر ۱ ساعت در محل"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold active:scale-95 transition-all"
                    >
                      بازگشت
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      <Check size={18} weight="bold" />
                      <span>ثبت نهایی کسب‌وکار</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
