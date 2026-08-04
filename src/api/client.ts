import { ApiResponse, Business, Category, SmartNotification } from '../types';

const API_BASE = '/api/v1';

export async function fetchHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('API Health error:', err);
    return false;
  }
}

export async function searchBusinessesApi(params: {
  query?: string;
  category?: string;
  subCategory?: string;
  lat?: number;
  lng?: number;
  maxDistanceKm?: number;
  openOnly?: boolean;
  sortBy?: string;
}): Promise<Business[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.category) queryParams.append('category', params.category);
    if (params.subCategory) queryParams.append('subCategory', params.subCategory);
    if (params.lat) queryParams.append('lat', params.lat.toString());
    if (params.lng) queryParams.append('lng', params.lng.toString());
    if (params.maxDistanceKm) queryParams.append('maxDistanceKm', params.maxDistanceKm.toString());
    if (params.openOnly) queryParams.append('openOnly', 'true');
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE}/search?${queryParams.toString()}`);
    const json: ApiResponse<any[]> = await res.json();
    if (json.success && json.data) {
      return json.data.map((b) => ({
        id: b.id,
        name: b.name,
        activityTitle: b.description || b.name,
        category: b.category,
        subCategory: b.subCategory,
        address: b.address,
        city: 'تهران',
        lat: b.lat,
        lng: b.lng,
        phone: b.phone,
        workingHours: {
          open: b.shifts?.[0]?.openTime || '08:00',
          close: b.shifts?.[0]?.closeTime || '21:00',
        },
        workingDays: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه'],
        shortDescription: b.description || '',
        images: b.images || [],
        tags: b.keywords ? b.keywords.map((k: any) => k.keyword) : [],
        completenessScore: 92,
        rating: b.rating || 4.8,
        createdAt: b.createdAt || new Date().toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error('Error searching businesses:', err);
    return [];
  }
}

export async function requestOtpApi(phoneNumber: string): Promise<{ success: boolean; message: string; testOtpCode?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'خطا در ارتباط با سرور' };
  }
}

export async function verifyOtpApi(phoneNumber: string, code: string): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, code }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'خطا در تایید کد' };
  }
}

export async function claimBusinessApi(businessId: string, ownerId: string, ownerName: string) {
  try {
    const res = await fetch(`${API_BASE}/businesses/${businessId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerId, ownerName }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'خطا در ثبت مالکیت' };
  }
}

export async function createBusinessApi(payload: any) {
  try {
    const res = await fetch(`${API_BASE}/businesses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'خطا در ثبت کسب‌وکار' };
  }
}

export async function fetchNotificationsApi(): Promise<SmartNotification[]> {
  try {
    const res = await fetch(`${API_BASE}/notifications`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return [];
  }
}
