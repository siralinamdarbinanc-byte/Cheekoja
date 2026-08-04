import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cooling-heating',
    name: 'تاسیسات و سرمایش/گرمایش',
    iconName: 'Fan',
    icon: 'HVACFan',
    subCategories: ['لوازم کولر آبی و گازی', 'پکیج و شوفاژ', 'پمپ و آبرسانی', 'تاسیسات لوله‌کشی'],
    popularKeywords: ['پمپ کولر', 'تسمه کولر', 'پوشال', 'موتور موتوژن', 'رادیاتور', 'پکیج ایران شرق']
  },
  {
    id: 'automotive',
    name: 'خودرو، تعمیرگاه و لوازم یدکی',
    iconName: 'Car',
    icon: 'Car',
    subCategories: ['تعمیرگاه مکانیکی', 'لوازم یدکی خودرو', 'صافکاری PDR', 'تراشکاری و جوشکاری', 'آپاراتی و تعویض روغنی'],
    popularKeywords: ['لنت پژو', 'صافکاری PDR', 'تراشکاری', 'جوشکاری', 'دیسک و صفحه', 'تعویض روغن']
  },
  {
    id: 'cafe-restaurant',
    name: 'کافه، رستوران و غذا',
    iconName: 'Coffee',
    icon: 'Coffee',
    subCategories: ['کافه و قهوه تخصصی', 'رستوران و چلوکبابی', 'فست فود و پیتزا', 'اغذیه و ساندویچی'],
    popularKeywords: ['قهوه دمی', 'اسپرسو', 'کباب کوبیده', 'پیتزا ایتالیایی', 'ساندویچ ویژه']
  },
  {
    id: 'medical-pharmacy',
    name: 'پزشکی، داروخانه و سلامت',
    iconName: 'Cross',
    icon: 'FirstAid',
    subCategories: ['داروخانه شبانه‌روزی', 'درمانگاه و بیمارستان', 'دندانپزشکی', 'تجهیزات پزشکی'],
    popularKeywords: ['داروخانه شبانه‌روزی', 'کلینیک شبانه‌روزی', 'تجهیزات ارتوپدی', 'داروخانه اکسیژن']
  },
  {
    id: 'building-hardware',
    name: 'ابزار، برق و ساختمان',
    iconName: 'Wrench',
    icon: 'Wrench',
    subCategories: ['ابزارفروشی و یراق', 'الکتریکی و سیم‌کشی', 'مصالح ساختمانی', 'رنگ و ابزار نقاشی'],
    popularKeywords: ['جوشکاری', 'پمپ آب', 'دریل و فرز', 'سیم و کابل', 'کلید و پریز']
  },
  {
    id: 'grocery-food',
    name: 'سوپرمارکت، نانوایی و مواد غذایی',
    iconName: 'ShoppingBag',
    icon: 'ShoppingCart',
    subCategories: ['سوپرمارکت و پروتئینی', 'نانوایی سنگک و لواش', 'شیرینی‌سرا و قنادی', 'میوه و سبزیجات'],
    popularKeywords: ['سوپرمارکت شبانه‌روزی', 'نان سنگک', 'گوشت و مرغ', 'عطاری']
  },
  {
    id: 'home-furniture',
    name: 'مبل، دکوراسیون و مبلمان',
    iconName: 'Armchair',
    icon: 'Armchair',
    subCategories: ['تعمیرات و رویه‌کوبی مبل', 'تولید مبل و سرویس خواب', 'فروش ابر و اسفنج', 'کابینت و دکوراسیون'],
    popularKeywords: ['فوم مبل', 'اسفنج ۳۰ کیلویی', 'رویه‌کوبی مبل', 'پارچه مبلی', 'ام‌دی‌اف']
  },
  {
    id: 'clothing-fashion',
    name: 'پوشاک، خیاطی و آرایشگاه',
    iconName: 'Shirt',
    icon: 'Scissors',
    subCategories: ['پوشاک زنانه و مردانه', 'خیاطی و تعمیرات لباس', 'آرایشگاه و سالن زیبایی', 'کفش و کیف'],
    popularKeywords: ['خیاطی سریع', 'تعمیرات لباس', 'کت و شلوار', 'کفش چرم']
  },
  {
    id: 'digital-repair',
    name: 'موبایل و خدمات دیجیتال',
    iconName: 'Smartphone',
    icon: 'DeviceMobile',
    subCategories: ['تعمیرات موبایل', 'لوازم جانبی', 'کامپیوتر و لپ‌تاپ', 'خدمات چاپ و کافی‌نت'],
    popularKeywords: ['تعمیر ال‌سی‌دی', 'باتری آیفون', 'کافی‌نت فوری', 'لوازم جانبی']
  }
];

export const QUICK_SEARCH_CHIPS = [
  'پمپ کولر',
  'تعویض روغن',
  'کافه و قهوه',
  'فوم مبل',
  'داروخانه شبانه‌روزی',
  'صافکاری PDR',
  'تراشکاری',
  'نان سنگک',
  'کلیدسازی',
  'خیاطی'
];
