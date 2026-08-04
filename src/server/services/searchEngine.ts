import { DBBusiness, DBShift } from '../db';

export interface SearchQueryParams {
  query?: string;
  category?: string;
  subCategory?: string;
  lat?: number;
  lng?: number;
  maxDistanceKm?: number;
  openOnly?: boolean;
  sortBy?: 'distance' | 'openStatus' | 'relevance';
}

export interface BusinessStatusInfo {
  isOpen: boolean;
  statusText: string;
  badgeColor: 'emerald' | 'rose' | 'amber';
  detailText: string;
}

/**
 * Spatial Haversine distance calculation (simulating PostGIS ST_Distance)
 */
export function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates whether business is open right now considering multi-shift daily schedules
 */
export function getShiftStatus(shifts: DBShift[], referenceDate: Date = new Date()): BusinessStatusInfo {
  if (!shifts || shifts.length === 0) {
    return {
      isOpen: true,
      statusText: 'باز است',
      badgeColor: 'emerald',
      detailText: 'ساعات کاری ثبت نشده',
    };
  }

  // Map JS day (0 = Sun, 1 = Mon ... 6 = Sat) to Persian Calendar day index (0 = Sat, 1 = Sun, 2 = Mon ... 6 = Fri)
  const jsDay = referenceDate.getDay();
  const dayOfWeek = jsDay === 6 ? 0 : jsDay + 1; // 6(Sat) -> 0, 0(Sun) -> 1, ...

  const currentHours = referenceDate.getHours();
  const currentMinutes = referenceDate.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  const todaysShifts = shifts.filter((s) => s.dayOfWeek === dayOfWeek);

  if (todaysShifts.length === 0 || todaysShifts.every((s) => s.isClosed)) {
    return {
      isOpen: false,
      statusText: 'بسته است',
      badgeColor: 'rose',
      detailText: 'امروز تعطیل است',
    };
  }

  // Check if current time falls into any shift interval
  for (const shift of todaysShifts) {
    if (shift.isClosed) continue;
    const [openH, openM] = shift.openTime.split(':').map(Number);
    const [closeH, closeM] = shift.closeTime.split(':').map(Number);

    const openTimeVal = openH * 60 + openM;
    const closeTimeVal = closeH * 60 + closeM;

    if (currentTimeVal >= openTimeVal && currentTimeVal <= closeTimeVal) {
      return {
        isOpen: true,
        statusText: 'باز است',
        badgeColor: 'emerald',
        detailText: `باز تا ساعت ${shift.closeTime} (${shift.shiftLabel || 'شیفت فعلی'})`,
      };
    }
  }

  // Find next shift today
  const upcomingShift = todaysShifts.find((s) => {
    if (s.isClosed) return false;
    const [openH, openM] = s.openTime.split(':').map(Number);
    return openH * 60 + openM > currentTimeVal;
  });

  if (upcomingShift) {
    return {
      isOpen: false,
      statusText: 'بسته است',
      badgeColor: 'amber',
      detailText: `بازگشایی در ساعت ${upcomingShift.openTime} (${upcomingShift.shiftLabel || 'شیفت بعدی'})`,
    };
  }

  return {
    isOpen: false,
    statusText: 'بسته است',
    badgeColor: 'rose',
    detailText: 'ساعات کاری امروز پایان یافته است',
  };
}

/**
 * Trigram-like fuzzy match algorithm matching Business Keywords & metadata
 */
export function calculateFuzzyRelevance(query: string, business: DBBusiness): number {
  if (!query || query.trim() === '') return 1.0;

  const cleanQuery = query.toLowerCase().trim();
  const tokens = cleanQuery.split(/\s+/);

  let score = 0;

  tokens.forEach((token) => {
    // 1. Exact match in name
    if (business.name.toLowerCase().includes(token)) score += 5.0;

    // 2. Exact match in BusinessKeywords with weight
    business.keywords.forEach((kw) => {
      if (kw.keyword.toLowerCase().includes(token)) {
        score += 3.0 * (kw.weight || 1.0);
      }
    });

    // 3. Category match
    if (business.category.toLowerCase().includes(token) || business.subCategory.toLowerCase().includes(token)) {
      score += 2.5;
    }

    // 4. Description & Address match
    if (business.description.toLowerCase().includes(token)) score += 1.5;
    if (business.address.toLowerCase().includes(token)) score += 1.0;
  });

  return score;
}

/**
 * Executes full search algorithm combining spatial distance, fuzzy trigram score & shift status
 */
export function searchBusinesses(allBusinesses: DBBusiness[], params: SearchQueryParams) {
  const {
    query = '',
    category = '',
    subCategory = '',
    lat = 35.6892,
    lng = 51.389,
    maxDistanceKm = 50,
    openOnly = false,
    sortBy = 'relevance',
  } = params;

  let results = allBusinesses.map((b) => {
    const distanceKm = calculateDistanceKm(lat, lng, b.lat, b.lng);
    const statusInfo = getShiftStatus(b.shifts);
    const relevanceScore = calculateFuzzyRelevance(query, b);

    // Ranking formula: Distance component + Relevance component + Open status bonus
    const distanceScore = 1 / (1 + distanceKm / 5);
    const openBonus = statusInfo.isOpen ? 2.0 : 0.0;
    const finalRankScore = relevanceScore * 0.5 + distanceScore * 3.0 + openBonus;

    return {
      business: b,
      distanceKm,
      statusInfo,
      relevanceScore,
      finalRankScore,
    };
  });

  // Filters
  if (category) {
    results = results.filter((r) => r.business.category === category);
  }

  if (subCategory) {
    results = results.filter((r) => r.business.subCategory === subCategory);
  }

  if (query && query.trim() !== '') {
    results = results.filter((r) => r.relevanceScore > 0);
  }

  if (maxDistanceKm) {
    results = results.filter((r) => r.distanceKm <= maxDistanceKm);
  }

  if (openOnly) {
    results = results.filter((r) => r.statusInfo.isOpen);
  }

  // Sorting
  if (sortBy === 'distance') {
    results.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'openStatus') {
    results.sort((a, b) => (b.statusInfo.isOpen ? 1 : 0) - (a.statusInfo.isOpen ? 1 : 0));
  } else {
    results.sort((a, b) => b.finalRankScore - a.finalRankScore);
  }

  return results;
}
