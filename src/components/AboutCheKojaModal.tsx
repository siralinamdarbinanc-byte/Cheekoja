import React, { useState } from 'react';
import {
  X,
  Info,
  Heart,
  Gift,
  QrCode,
  Copy,
  Check,
  EnvelopeSimple,
  PaperPlaneTilt,
  GithubLogo,
  Globe,
  Sparkle,
  ShieldCheck,
  CheckCircle,
  WifiHigh,
  Code,
  ArrowSquareOut
} from '@phosphor-icons/react';

interface AboutCheKojaModalProps {
  onClose: () => void;
}

export const AboutCheKojaModal: React.FC<AboutCheKojaModalProps> = ({ onClose }) => {
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  // Placeholder Payment & Developer Info (Editable by Owner)
  const paymentDetails = {
    cardNumber: '6037 - 9979 - 0000 - 0000',
    iban: 'IR82 0170 0000 0000 0000 0000 00',
    accountName: 'نام و نام خانوادگی توسعه‌دهنده',
    paymentUrl: 'https://zarinp.al/chekoja-donate',
  };

  const appMeta = {
    appVersion: 'v2.4.0 (2026 Production Edition)',
    pwaVersion: 'v1.3.0 (Offline Enabled)',
    buildDate: 'مرداد ۱۴۰۵ - August 2026',
    githubRepo: 'https://github.com/chekoja/chekoja-app',
    serverStatus: 'متصل به پایگاه داده زنده (۲۰۰ OK)',
  };

  const developerLinks = {
    email: 'contact@chekoja.ir',
    telegram: 'https://t.me/chekoja_official',
    github: 'https://github.com/chekoja',
    website: 'https://chekoja.ir',
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in dir-rtl">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Info size={20} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>درباره چیکجا</span>
                <Sparkle size={14} weight="fill" className="text-amber-400" />
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                شناسنامه، اهداف و حمایت مالی از توسعه مستقل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors active:scale-90"
            title="بستن"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* SECTION 1: What is CheKoja? */}
          <section className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200/70 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
              <Info size={20} weight="regular" />
              <h3>چیکجا چیست؟</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              چیکجا یک پروژه مستقل و رایگان است که با هدف کمک به دیده شدن کسب‌وکارهای محلی و آسان‌تر شدن پیدا کردن خدمات و کالاهای مورد نیاز مردم ساخته شده است.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              هدف این پروژه ایجاد ارتباط مستقیم میان مردم و صاحبان کسب‌وکار است؛ بدون پیچیدگی‌های غیرضروری و با تمرکز بر سرعت، سادگی و دسترسی آسان.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle size={16} weight="fill" className="text-emerald-500" />
              <span>این پروژه کاملاً رایگان است و برنامه‌ای برای دریافت هزینه از کاربران عادی ندارد.</span>
            </div>
          </section>

          {/* SECTION 2: Why CheKoja was built */}
          <section className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200/70 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
              <Sparkle size={20} weight="regular" />
              <h3>چرا چیکجا ساخته شد؟</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              ایده اصلی چیکجا از یک نیاز واقعی شکل گرفت.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              بسیاری از کسب‌وکارهای کوچک دیده نمی‌شوند و کاربران نیز برای پیدا کردن خدمات مورد نیاز خود زمان زیادی صرف می‌کنند.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              چیکجا تلاش می‌کند این فاصله را کمتر کند و پیدا کردن کسب‌وکارهای محلی را سریع‌تر و ساده‌تر کند.
            </p>
          </section>

          {/* SECTION 3: Always Free Card */}
          <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden space-y-2">
            <div className="absolute -left-6 -bottom-6 opacity-10 text-white">
              <Gift size={140} weight="regular" />
            </div>
            <div className="relative z-10 flex items-center gap-2 font-black text-sm text-emerald-100">
              <Gift size={22} weight="regular" className="text-amber-300" />
              <h3 className="text-white text-base">رایگان خواهد ماند</h3>
            </div>
            <p className="relative z-10 text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
              استفاده از چیکجا برای کاربران همیشه رایگان خواهد بود.
            </p>
            <p className="relative z-10 text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              اگر در آینده امکانات جدیدی اضافه شود، تلاش ما این است که هسته اصلی برنامه همچنان رایگان باقی بماند.
            </p>
          </section>

          {/* SECTION 4: Donate Card */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Heart size={20} weight="fill" className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">حمایت مالی (Donate)</h3>
                  <p className="text-[11px] text-slate-400">حمایت اختیاری جهت توسعه، پرداخت سرورها و بهبود امکانات</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full">
                کاملاً اختیاری
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              اگر چیکجا برای شما مفید بوده و دوست دارید در توسعه آن سهیم باشید، می‌توانید به صورت کاملاً اختیاری از پروژه حمایت کنید. هیچ قابلیتی از برنامه وابسته به پرداخت نخواهد بود.
            </p>

            {/* Account & Card Details Grid */}
            <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
              {/* Account Owner */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">نام صاحب حساب:</span>
                <span className="font-bold text-slate-100">{paymentDetails.accountName}</span>
              </div>

              {/* Card Number */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
                <div className="text-xs">
                  <span className="text-slate-400 block sm:inline font-medium ml-2">شماره کارت:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm tracking-wider dir-ltr inline-block">
                    {paymentDetails.cardNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentDetails.cardNumber, setCopiedCard)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  {copiedCard ? (
                    <>
                      <Check size={16} weight="bold" />
                      <span>کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} weight="regular" />
                      <span>کپی شماره کارت</span>
                    </>
                  )}
                </button>
              </div>

              {/* IBAN */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
                <div className="text-xs">
                  <span className="text-slate-400 block sm:inline font-medium ml-2">شماره شبا:</span>
                  <span className="font-mono font-bold text-slate-200 text-xs tracking-wider dir-ltr inline-block">
                    {paymentDetails.iban}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentDetails.iban, setCopiedIban)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  {copiedIban ? (
                    <>
                      <Check size={16} weight="bold" />
                      <span>کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} weight="regular" />
                      <span>کپی شبا</span>
                    </>
                  )}
                </button>
              </div>

              {/* QR Code Placeholder & Future Payment Link */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <QrCode size={20} weight="regular" className="text-amber-400" />
                  <span>امکان پرداخت از درگاه آنلاین در آینده:</span>
                </div>
                <a
                  href={paymentDetails.paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
                >
                  <span>لینک درگاه</span>
                  <ArrowSquareOut size={14} weight="regular" />
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 5: App Version & Build Meta */}
          <section className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-black text-sm">
              <Code size={20} weight="regular" className="text-emerald-500" />
              <h3>نسخه برنامه و مشخصات فنی</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">نسخه اپلیکیشن:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{appMeta.appVersion}</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">نسخه PWA:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{appMeta.pwaVersion}</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">تاریخ Build:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{appMeta.buildDate}</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">وضعیت اتصال سرور:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <WifiHigh size={16} weight="bold" className="text-emerald-500 animate-pulse" />
                  زنده (پایگاه ۲00)
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 6: Developer Contact Links */}
          <section className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-black text-sm">
              <PaperPlaneTilt size={20} weight="regular" className="text-emerald-500" />
              <h3>ارتباط با توسعه‌دهنده</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {/* Email */}
              <a
                href={`mailto:${developerLinks.email}`}
                className="p-3 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95 font-bold"
              >
                <EnvelopeSimple size={20} weight="regular" className="text-rose-500" />
                <span className="text-[11px]">ایمیل مستقیم</span>
              </a>

              {/* Telegram */}
              <a
                href={developerLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95 font-bold"
              >
                <PaperPlaneTilt size={20} weight="regular" className="text-cyan-500" />
                <span className="text-[11px]">تلگرام</span>
              </a>

              {/* GitHub */}
              <a
                href={developerLinks.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95 font-bold"
              >
                <GithubLogo size={20} weight="regular" className="text-slate-800 dark:text-slate-200" />
                <span className="text-[11px]">گیت‌هاب</span>
              </a>

              {/* Website */}
              <a
                href={developerLinks.website}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95 font-bold"
              >
                <Globe size={20} weight="regular" className="text-emerald-500" />
                <span className="text-[11px]">وب‌سایت</span>
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          سامانه مستقل جستجوی محلی اصناف و خدمات «چیکجا» — با افتخار رایگان برای تمام مردم ایران
        </div>
      </div>
    </div>
  );
};
