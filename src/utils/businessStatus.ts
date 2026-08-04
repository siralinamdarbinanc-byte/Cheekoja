import { Business, ComputedStatus, DayOfWeek } from '../types';
import { toPersianDigits } from './distance';

const PERSIAN_DAYS: DayOfWeek[] = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
  'شنبه',
];

export function getCurrentPersianDay(date: Date = new Date()): DayOfWeek {
  const dayIndex = date.getDay(); // 0 is Sunday
  return PERSIAN_DAYS[dayIndex];
}

export function computeBusinessStatus(
  business: Business,
  currentTime: Date = new Date()
): ComputedStatus {
  // Check manual status override first
  if (business.todayManualOverride === 'closed') {
    return {
      isOpen: false,
      statusText: 'بسته است',
      badgeColor: 'rose',
      detailText: 'امروز به دستور صاحب کسب‌وکار تعطیل است',
    };
  }

  if (business.todayManualOverride === 'open') {
    return {
      isOpen: true,
      statusText: 'باز است',
      badgeColor: 'emerald',
      detailText: 'امروز به صورت فوق‌العاده باز است',
    };
  }

  const todayName = getCurrentPersianDay(currentTime);
  const isWorkingDay = business.workingDays.includes(todayName);

  if (!isWorkingDay) {
    return {
      isOpen: false,
      statusText: 'تعطیل است',
      badgeColor: 'rose',
      detailText: `امروز (${todayName}) روز کاری کسب‌وکار نیست`,
    };
  }

  const schedule = business.todayCustomHours || business.workingHours;
  
  // 24-hour open check
  if (schedule.open === '00:00' && (schedule.close === '23:59' || schedule.close === '24:00')) {
    return {
      isOpen: true,
      statusText: 'شبانه‌روزی باز است',
      badgeColor: 'emerald',
      detailText: 'خدمات ۲۴ ساعته',
    };
  }

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const [openHour, openMin] = schedule.open.split(':').map(Number);
  const [closeHour, closeMin] = schedule.close.split(':').map(Number);

  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const closingTimePersian = toPersianDigits(schedule.close);
    return {
      isOpen: true,
      statusText: 'باز است',
      badgeColor: 'emerald',
      detailText: `باز تا ساعت ${closingTimePersian}`,
    };
  } else if (currentMinutes < openMinutes) {
    const openingTimePersian = toPersianDigits(schedule.open);
    return {
      isOpen: false,
      statusText: 'بسته است',
      badgeColor: 'amber',
      detailText: `امروز ساعت ${openingTimePersian} باز می‌شود`,
    };
  } else {
    const openingTimePersian = toPersianDigits(schedule.open);
    return {
      isOpen: false,
      statusText: 'بسته است',
      badgeColor: 'rose',
      detailText: `فردا ساعت ${openingTimePersian} باز می‌شود`,
    };
  }
}
