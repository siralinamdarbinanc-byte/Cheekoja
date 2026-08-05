import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { NavigationArrow, MagnifyingGlass, MapPin, Spinner, Check, Compass } from '@phosphor-icons/react';
import { toPersianDigits } from '../utils/distance';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onLocationChange: (
    lat: number,
    lng: number,
    details?: { address: string; city?: string; neighborhood?: string }
  ) => void;
  initialAddress?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  onLocationChange,
  initialAddress = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Reverse Geocode Helper (Nominatim OpenStreetMap)
  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fa`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const addrObj = data.address;
          const province = addrObj.state || addrObj.province || '';
          const city = addrObj.city || addrObj.town || addrObj.village || addrObj.county || 'تهران';
          const neighborhood =
            addrObj.neighbourhood || addrObj.suburb || addrObj.residential || addrObj.quarter || '';
          const road = addrObj.road || addrObj.pedestrian || addrObj.street || '';

          const parts = [province, city, neighborhood, road].filter(Boolean);
          const formattedAddress = parts.join('، ') || data.display_name?.slice(0, 60) || 'موقعیت انتخاب‌شده';

          onLocationChange(latitude, longitude, {
            address: formattedAddress,
            city,
            neighborhood,
          });
        } else {
          onLocationChange(latitude, longitude);
        }
      } else {
        onLocationChange(latitude, longitude);
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      onLocationChange(latitude, longitude);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = lat || 35.6892;
      const initialLng = lng || 51.389;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([initialLat, initialLng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom Pin Icon for Location Picker
      const pinIcon = L.divIcon({
        className: 'custom-location-picker-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-emerald-500/30 animate-ping absolute"></div>
            <div class="w-8 h-8 rounded-full bg-emerald-600 ring-4 ring-white shadow-2xl flex items-center justify-center text-white font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75,80,132,83.4,134.4a8,8,0,0,0,9.2,0C136,236,216,179,216,104A88.1,88.1,0,0,0,128,16Zm0,112a24,24,0,1,1,24-24A24.1,24.1,0,0,1,128,128Z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      // Handle Marker Drag
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        map.panTo(position);
        reverseGeocode(position.lat, position.lng);
      });

      // Handle Map Click
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        marker.setLatLng([clickLat, clickLng]);
        reverseGeocode(clickLat, clickLng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Invalidate size after mount to ensure correct canvas rendering inside modal
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position if lat/lng prop changes externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
      }
    }
  }, [lat, lng]);

  // Handle Detect Current User Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('مرورگر شما از دریافت موقعیت مکانی پشتیبانی نمی‌کند.');
      return;
    }

    setIsLocating(true);
    setSearchError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([userLat, userLng], 16, { duration: 1.2 });
          markerRef.current.setLatLng([userLat, userLng]);
        }

        reverseGeocode(userLat, userLng);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Location detection failed:', err);
        setIsLocating(false);
        setSearchError('دسترسی به موقعیت مکانی انجام نشد. می‌توانید با جستجو یا کلیک روی نقشه انتخاب کنید.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Handle Address Search on Map (Forward Geocoding)
  const handleAddressSearch = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');

    try {
      const queryWithContext = searchQuery.includes('ایران') || searchQuery.includes('تهران')
        ? searchQuery
        : `${searchQuery}، ایران`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryWithContext)}&accept-language=fa&limit=1`
      );

      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const found = results[0];
          const newLat = parseFloat(found.lat);
          const newLng = parseFloat(found.lon);

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([newLat, newLng], 16, { duration: 1.2 });
            markerRef.current.setLatLng([newLat, newLng]);
          }

          reverseGeocode(newLat, newLng);
        } else {
          setSearchError('آدرسی با این عبارت یافت نشد. لطفاً نقطه را روی نقشه انتخاب کنید.');
        }
      } else {
        setSearchError('خطا در جستجوی آدرس.');
      }
    } catch (err) {
      console.warn('Search geocode error:', err);
      setSearchError('امکان برقراری ارتباط با سرویس نقشه وجود نداشت.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Top Map Toolbar: Search & Current Location Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddressSearch(e);
              }
            }}
            placeholder="جستجوی خیابان یا محله (مثلاً: خیابان سعدی تهران)..."
            className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <MagnifyingGlass size={16} className="text-slate-400 absolute right-3 top-2.5" />
          <button
            type="button"
            onClick={handleAddressSearch}
            disabled={isSearching}
            className="absolute left-1.5 top-1 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1"
          >
            {isSearching ? <Spinner size={14} className="animate-spin" /> : <span>جستجو</span>}
          </button>
        </div>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shrink-0"
          title="استفاده از GPS دستگاه"
        >
          <NavigationArrow size={16} weight="fill" className={isLocating ? 'animate-spin text-emerald-500' : 'text-emerald-500'} />
          <span>استفاده از موقعیت فعلی من</span>
        </button>
      </div>

      {searchError && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium px-1">
          {searchError}
        </p>
      )}

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-inner group">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Instruction Badge Overlay */}
        <div className="absolute top-2 left-2 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
          <MapPin size={14} weight="fill" className="text-emerald-400" />
          <span>روی نقشه کلیک کنید یا نشانه را بکشید (Drag)</span>
        </div>

        {/* Coordinates Display Pill */}
        <div className="absolute bottom-2 right-2 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-1.5">
          {isGeocoding ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Spinner size={12} className="animate-spin" />
              در حال دریافت آدرس...
            </span>
          ) : (
            <span>
              {toPersianDigits(lat.toFixed(5))} , {toPersianDigits(lng.toFixed(5))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
