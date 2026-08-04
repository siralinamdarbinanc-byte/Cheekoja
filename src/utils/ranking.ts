import { Business, SearchFilters, UserLocation, ComputedStatus } from '../types';
import { calculateDistanceMeters } from './distance';
import { computeBusinessStatus } from './businessStatus';
import { getExpandedSearchTerms } from './synonyms';

export interface RankedBusiness {
  business: Business;
  distanceMeters: number;
  distanceKm: number;
  isOpen: boolean;
  computedStatus: ComputedStatus;
  status: ComputedStatus;
  recommendationReasons: string[];
  relevanceScore?: number;
}

export function filterAndRankBusinesses(
  businesses: Business[],
  filters: SearchFilters,
  userLocation: UserLocation,
  now: Date = new Date()
): RankedBusiness[] {
  const queryTrimmed = filters.query.trim().toLowerCase();
  const searchTerms = queryTrimmed ? getExpandedSearchTerms(queryTrimmed) : [];

  // 1. Calculate distance, status & recommendation reasons for all
  const mapped: RankedBusiness[] = businesses.map((b) => {
    const distMeters = calculateDistanceMeters(userLocation.lat, userLocation.lng, b.lat, b.lng);
    const computed = computeBusinessStatus(b, now);

    const reasons: string[] = [];
    if (computed.isOpen) {
      reasons.push('هم‌اکنون باز است');
    }
    if (distMeters < 1000) {
      const distFormatted = distMeters < 100 ? `${Math.round(distMeters)} متر` : `${(distMeters / 1000).toFixed(1)} کیلومتر`;
      reasons.push(`فاصله نزدیک (${distFormatted})`);
    }
    if (b.marketZoneName || b.marketZone?.name) {
      reasons.push(`واقع در ${b.marketZoneName || b.marketZone?.name}`);
    } else if (b.neighborhood) {
      reasons.push(`در محدوده ${b.neighborhood}`);
    }
    if (b.trustPhoneVerified || b.trustOwnerVerified) {
      reasons.push('اطلاعات تماس تاییدشده');
    }

    // Compute search match relevance score with synonyms
    let relevanceScore = 0;
    if (searchTerms.length > 0) {
      searchTerms.forEach((term) => {
        if (b.name.toLowerCase().includes(term)) relevanceScore += 10;
        if (b.activityTitle.toLowerCase().includes(term)) relevanceScore += 8;
        if (b.category.toLowerCase().includes(term)) relevanceScore += 6;
        if (b.subCategory.toLowerCase().includes(term)) relevanceScore += 5;
        if (b.shortDescription.toLowerCase().includes(term)) relevanceScore += 3;
        if (b.address.toLowerCase().includes(term)) relevanceScore += 2;
        if (b.tags && b.tags.some((t) => t.toLowerCase().includes(term))) relevanceScore += 4;
      });
    }

    return {
      business: b,
      distanceMeters: distMeters,
      distanceKm: distMeters / 1000,
      isOpen: computed.isOpen,
      computedStatus: computed,
      status: computed,
      recommendationReasons: reasons,
      relevanceScore,
    };
  });

  // 2. Filter by search query, category, openOnly, maxDistance
  const filtered = mapped.filter((item) => {
    const b = item.business;

    // Filter by Open Only
    if (filters.openOnly && !item.isOpen) {
      return false;
    }

    // Filter by Max Distance (if specified > 0)
    if (filters.maxDistanceKm > 0 && item.distanceMeters > filters.maxDistanceKm * 1000) {
      return false;
    }

    // Filter by Category
    if (filters.category && filters.category !== 'all') {
      if (b.category !== filters.category && b.subCategory !== filters.category) {
        return false;
      }
    }

    // Filter by SubCategory
    if (filters.subCategory && filters.subCategory !== 'all') {
      if (b.subCategory !== filters.subCategory) {
        return false;
      }
    }

    // Filter by Search Query
    if (queryTrimmed) {
      if (!item.relevanceScore || item.relevanceScore === 0) {
        return false;
      }
    }

    return true;
  });

  // 3. Sort according to Ranking Algorithm
  filtered.sort((a, b) => {
    if (filters.sortBy === 'distance') {
      if (a.distanceMeters !== b.distanceMeters) {
        return a.distanceMeters - b.distanceMeters;
      }
      return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    }

    if (filters.sortBy === 'openStatus') {
      if (a.isOpen !== b.isOpen) {
        return a.isOpen ? -1 : 1;
      }
      return a.distanceMeters - b.distanceMeters;
    }

    if (filters.sortBy === 'completeness' || filters.sortBy === 'rating') {
      if (a.business.completenessScore !== b.business.completenessScore) {
        return b.business.completenessScore - a.business.completenessScore;
      }
      return a.distanceMeters - b.distanceMeters;
    }

    // Default sorting (Relevance + Distance balance):
    if (queryTrimmed && Math.abs((b.relevanceScore || 0) - (a.relevanceScore || 0)) > 5) {
      return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    }

    if (a.isOpen !== b.isOpen) {
      return a.isOpen ? -1 : 1;
    }

    return a.distanceMeters - b.distanceMeters;
  });

  return filtered;
}
