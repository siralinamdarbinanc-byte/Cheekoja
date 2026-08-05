import React, { useState } from 'react';
import {
  BookOpen,
  X,
  CheckCircle,
  CaretLeft,
  Stack,
  Database,
  MagnifyingGlass,
  MapPin,
  DeviceMobile,
  ShieldCheck,
  Lightning
} from '@phosphor-icons/react';

interface DesignDocViewerProps {
  onClose: () => void;
}

export const DesignDocViewer: React.FC<DesignDocViewerProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  const sections = [
    {
      id: 1,
      title: '۱- تحلیل کامل محصول (Product Analysis)',
      icon: Lightning,
      content: `
### فلسفه اصلی "چی کجا"
چی کجا یک موتور جستجوی محلی زنده، ساده و فوق‌العاده سریع برای پیدا کردن کالاها، خدمات و کسب‌وکارهای ایران است.
هدف بنیادی: **پیدا کردن نزدیک‌ترین فروشگاه/خدمت‌رسان مناسب در کمتر از ۱۰ ثانیه**، برقراری تماس مستقیم و مسیریابی بدون اتلاف وقت.

#### مرزهای محصول (آنچه چی کجا نیست):
- **گوگل مپس / نشان / بلد نیست**: نقشه صرفاً ابزار کمکی تصویری است؛ تمرکز روی جستجوی صنف و کالای محلی است.
- **فروشگاه اینترنتی یا مارکت‌پلیس نیست**: درگاه پرداخت، سبد خرید، انبارداری و ثبت سفارش ندارد.
- **سیستم اتوماسیون مغازه نیست**: فاکتور زدن، حسابداری و مدیریت مشتریان ندارد.

#### ارزش خلق‌شده برای کاربر:
- عدم نیاز به بریدن خیابان‌ها یا جستجوهای بی‌نتیجه در اینستاگرام و گروه‌ها.
- اطلاع آنی از باز یا بسته بودن مغازه در همان لحظه.
      `
    },
    {
      id: 2,
      title: '۲- تحلیل بازار (Market Analysis)',
      icon: Stack,
      content: `
### اندازه بازار و پتانسیل کسب‌وکار در ایران
در ایران بیش از **۳ میلیون کسب‌وکار صنفی و محلی** وجود دارد (تاسیساتی، تعمیرگاهی، یدکی، پزشکی، مبل، سوپرمارکت و ...).
اکثر این کسب‌وکارها وب‌سایت یا فروشگاه آنلاین ندارند و صرفاً بر اساس مراجعه حضوری و تماس تلفنی مشتری جذب می‌کنند.

#### رفتار کاربران ایرانی:
- زمانی که قطعه‌ای مانند "پمپ کولر" یا "لنت پژو" خراب می‌شود، نیاز کاربر لحظه‌ای (Urgent) است.
- کاربر نمی‌تواند ۲ روز منتظر پست آنلاین بماند؛ باید همین الان مغازه باز محلی را پیدا کند.
      `
    },
    {
      id: 3,
      title: '۳- بررسی رقبا (Competitor Analysis)',
      icon: ShieldCheck,
      content: `
| ویژگی | Google Maps | بلد / نشان | دیوار / شیپور | **چی کجا (CheKoja)** |
| :--- | :--- | :--- | :--- | :--- |
| **جستجوی دقیق کالا** | ضعیف (فقط اسم مکان) | متوسط | فقط آگهی دست دوم | **عالی (تخصصی کالا/خدمت)** |
| **وضعیت زنده باز/بسته** | نامطمئن | تقریبی | ندارد | **دقیق + محاسبه زنده زمانی** |
| **تماس سریع زیر ۱۰ ثانیه** | نیاز به چند کلیک | نیاز به چند کلیک | چت یا شماره مخفی | **کلیک مستقیم روی شماره** |
| **سادگی برای صاحب مغازه** | پیچیده / تحریم | ثبت سخت | آگهی منقضی شونده | **پنل ۱ دقیقه‌ای فوق ساده** |
      `
    },
    {
      id: 4,
      title: '۴- پرسونای مخاطب (User Personas)',
      icon: DeviceMobile,
      content: `
#### پرسونای اول: خریدار اضطراری (کامران - ۳۵ ساله)
- **سناریو**: کولر خانه در گرما از کار افتاده و نیاز به "پمپ کولر" دارد.
- **خواسته**: پیدا کردن نزدیک‌ترین مغازه تاسیساتی باز، گرفتن شماره تلفن و حرکت با مسیریاب.

#### پرسونای دوم: صاحب کسب‌وکار محلی (استاد رضا - ۵۰ ساله - مکانیک/صافکار)
- **سناریو**: مغازه صافکاری PDR دارد، وقت برای سیستم‌های پیچیده کامپیوتر ندارد.
- **خواسته**: ثبت مغازه در ۱ دقیقه، روشن/خاموش کردن وضعیت "امروز باز هستم" با یک دکمه.
      `
    },
    {
      id: 5,
      title: '۵- مسیر کاربر (User Journey)',
      icon: CaretLeft,
      content: `
1. **ورود به سایت/PWA**: بارگذاری صفحه اصلی در زیر ۱ ثانیه.
2. **جستجوی کالا/خدمت**: تایپ "پمپ کولر" یا انتخاب چیپ داغ.
3. **مشاهده نتایج رتبه‌بندی شده**:
   - تفکیک بر اساس نزدیک‌ترین فاصله (مثلاً ۳۵۰ متر).
   - نشانگر سبز 🟢 "باز است - تا ساعت ۲۱".
4. **اقدام نهایی (Call to Action)**:
   - کلیک روی دکمه سبز "تماس مستقیم".
   - یا کلیک روی "مسیریابی" (انتخاب نشان، بلد یا گوگل مپس).
      `
    },
    {
      id: 6,
      title: '۶- ساختار صفحات (Page Architecture)',
      icon: Stack,
      content: `
- **صفحه اصلی (Single View Dashboard)**:
  - هدر هوشمند + انتخاب شهر + تم تاریک/روشن.
  - باکس جستجوی فوق سریع + چیپ‌های داغ.
  - گرید دسته‌بندی‌های اصلی و زیردسته‌ها.
  - تب سوئیچ: "نمایش لیستی" vs "نمایش روی نقشه".
- **کارت و مدال جزییات کسب‌وکار**:
  - تصاویر، ساعات کاری روزهای هفته، آدرس و کلمات کلیدی.
- **پنل مدیریت صاحب کسب‌وکار (Modal View)**:
  - ویرایش اطلاعات + تغییر وضعیت فوری + اعلانات هوشمند.
      `
    },
    {
      id: 7,
      title: '۷- معماری سیستم (Modular Monolith)',
      icon: Database,
      content: `
معماری پروژه به صورت **Modular Monolith** جهت جلوگیری از Over-Engineering طراحی شده است:

\`\`\`
[ Client / PWA (React + Tailwind) ]
              │
              ▼
[ Core Application Layer (Next.js / Express API) ]
   ├── Search & Index Module
   ├── Distance & GIS Engine (Haversine/PostGIS)
   ├── Business Status Calculator (Live Schedule)
   └── Notification Engine
              │
              ▼
[ Database Layer: PostgreSQL + PostGIS ]
\`\`\`
      `
    },
    {
      id: 8,
      title: '۸- طراحی دیتابیس (Database Schema)',
      icon: Database,
      content: `
\`\`\`sql
-- جدول اصلی کسب‌وکارها
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    activity_title VARCHAR(255) NOT NULL,
    category_id VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    address TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL, -- PostGIS Lat/Lng
    working_hours JSONB NOT NULL, -- {"open": "08:00", "close": "21:00"}
    working_days JSONB NOT NULL, -- ["شنبه", "یکشنبه", ...]
    today_override VARCHAR(20), -- 'open', 'closed', NULL
    short_description TEXT,
    images JSONB DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    completeness_score INT DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایندکس فضایی و متنی برای جستجوی میلی‌ثانیه‌ای
CREATE INDEX idx_businesses_location ON businesses USING GIST (location);
CREATE INDEX idx_businesses_tags ON businesses USING GIN (tags);
\`\`\`
      `
    },
    {
      id: 9,
      title: '۹- طراحی API (REST API Endpoints)',
      icon: MagnifyingGlass,
      content: `
- \`GET /api/v1/search?q=پمپ+کولر&lat=35.6892&lng=51.3890&openOnly=true&radius=5\`
  - خروجی: لیست کسب‌وکارهای رتبه‌بندی شده همراه با محاسبه فاصله و وضعیت زنده.
- \`GET /api/v1/businesses/:id\`
  - خروجی: جزییات کامل یک کسب‌وکار.
- \`PATCH /api/v1/businesses/:id/status\`
  - تغییر وضعیت فوری ("امروز باز هستم" / "امروز تعطیل هستم").
- \`PUT /api/v1/businesses/:id\`
  - ویرایش پروفایل توسط صاحب کسب‌وکار.
      `
    },
    {
      id: 10,
      title: '۱۰- طراحی پنل کسب‌وکار (Business Panel Design)',
      icon: DeviceMobile,
      content: `
پنل صاحب مغازه بدون هیچ منوی اضافه یا مفاهیم سخت طراحی شده است:
- یک دکمه بزرگ "تغییر وضعیت فوری امروز" (امروز باز هستم / امروز تعطیل هستم).
- فرم ویرایش نام، تلفن، آدرس و ساعات کاری.
- دریافت اعلان‌های یادآوری ("۵ دقیقه دیگر فروشگاه شما باز می‌شود").
      `
    },
    {
      id: 11,
      title: '۱۱- طراحی نقشه (Map Integration Design)',
      icon: MapPin,
      content: `
استفاده از **Leaflet + OpenStreetMap** به همراه تایلهای بهینه‌سازی شده:
- مارکر آبی متحرک برای موقعیت کاربر.
- پین‌های سبز رنگ برای مغازه‌های باز و پین‌های قرمز/خاکستری برای مغازه‌های بسته.
- پاپ‌آپ فارسی با دکمه‌های مستقیم "تماس" و "مشاهده جزییات".
      `
    },
    {
      id: 12,
      title: '۱۲- طراحی سیستم جستجو (Search Architecture)',
      icon: MagnifyingGlass,
      content: `
موتور جستجو متون عنوان فعالیت، کلمات کلیدی (#پمپ_کولر، #لنت_پژو، #فوم_مبل)، نام صنف و دسته‌بندی را تطبیق می‌دهد.
حتی اگر کاربر عبارت غیردقیق تایپ کند، سیستم با جستجوی چندبخشی (Fuzzy Keyword Matching) نتایج مربوطه را برمی‌گرداند.
      `
    },
    {
      id: 13,
      title: '۱۳- الگوریتم رتبه‌بندی (Ranking Algorithm)',
      icon: Lightning,
      content: `
ترتیب نمایش نتایج بر اساس فرمول وزن‌دهی زیر است:

$$ \\text{Score} = (W_1 \\times \\text{DistanceScore}) + (W_2 \\times \\text{IsOpen}) + (W_3 \\times \\text{CompletenessScore}) $$

1. **فاصله (محدوده اولویت)**: کسب‌وکارهای نزدیک‌تر در صدر قرار می‌گیرند.
2. **وضعیت باز بودن**: کسب‌وکارهایی که هم‌اکنون باز هستند اولویت بالاتر دارند.
3. **کامل بودن اطلاعات**: عکس، شماره همراه، و توضیحات شانس دیده شدن را افزایش می‌دهد.
      `
    },
    {
      id: 14,
      title: '۱۴- Wireframe صفحات (Wireframe Specs)',
      icon: Stack,
      content: `
- **هدر**: لوگوی چی کجا + دکمه موقعیت من + تغییر تم + پنل کسب‌وکار.
- **باکس جستجو**: اینپوت بزرگ + چیپ‌های جستجوی داغ + فیلتر فاصله + دکمه فقط بازها.
- **کارت‌های کسب‌وکار**: تگ سبز/قرمز باز و بسته + فاصله دقیق (متر) + دکمه سبز "تماس مستقیم" + دکمه "مسیریابی".
      `
    },
    {
      id: 15,
      title: '۱۵- ساختار پوشه‌های پروژه (Folder Structure)',
      icon: Stack,
      content: `
\`\`\`
/src
  ├── components/          # اجزای رابط کاربر (Header, SearchBar, BusinessCard, MapView, ...)
  ├── data/                # داده‌های اولیه و دسته‌بندی‌های اصناف ایران
  ├── utils/               # الگوریتم‌های محاسبه فاصله (Haversine)، وضعیت باز/بسته، رتبه‌بندی
  ├── types.ts             # تعاریف تایپ‌های TypeScript
  ├── App.tsx              # کامپوننت اصلی برنامه
  └── main.tsx             # نقطه ورود
\`\`\`
      `
    },
    {
      id: 16,
      title: '۱۶- نقشه راه توسعه (Development Roadmap)',
      icon: CheckCircle,
      content: `
- **فاز ۱ (هم‌اکنون - MVP)**: جستجوی سریع کالا/خدمت، محاسبه هوشمند وضعیت باز/بسته، تماس مستقیم، مسیریابی و پنل ساده صاحبان کسب‌وکار.
- **فاز ۲**: ورود با پیامک (OTP) برای صاحبان کسب‌وکار و تایید هویت کد پستی.
- **فاز ۳**: اضافه کردن امتیازدهی و نظرات خریداران محلی.
      `
    }
  ];

  const current = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in dir-rtl">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen size={22} weight="regular" className="text-amber-400" />
            <div>
              <h2 className="text-base font-extrabold">سند جامع طراحی و معماری محصول (چی کجا)</h2>
              <p className="text-xs text-slate-400">طراحی شده توسط تیم Founder، PM، UX/UI، Architect و DevOps</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors active:scale-90"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Content Split Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Menu */}
          <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950/80 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800 overflow-y-auto p-3 shrink-0 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3 py-1.5">
              ۱۶ سرفصل طراحی محصول:
            </div>
            {sections.map((sec) => {
              const isSelected = sec.id === activeSection;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-right px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  {isSelected && <CaretLeft size={16} weight="bold" className="shrink-0 mr-1" />}
                </button>
              );
            })}
          </div>

          {/* Section Detail Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-amber-500 font-black text-xl">#</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {current.title}
              </h3>
            </div>

            <div className="prose dark:prose-invert prose-xs max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
              {current.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
