/**
 * Calculates distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

/**
 * Formats distance in meters to readable human Persian text (e.g. "۴۵۰ متر", "۲.۳ کیلومتر")
 */
export function formatDistanceText(meters: number): string {
  if (meters < 1000) {
    return `${toPersianDigits(meters)} متر`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${toPersianDigits(km)} کیلومتر`;
}
