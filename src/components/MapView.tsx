import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Compass } from '@phosphor-icons/react';
import { RankedBusiness } from '../utils/ranking';
import { UserLocation } from '../types';
import { formatDistanceText } from '../utils/distance';

interface MapViewProps {
  businesses: RankedBusiness[];
  userLocation: UserLocation;
  onSelectBusiness: (business: RankedBusiness) => void;
  onRequestLocation: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  businesses,
  userLocation,
  onSelectBusiness,
  onRequestLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([userLocation.lat, userLocation.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Pan
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. User Location Blue Circle Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white shadow-lg"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(markersGroup)
      .bindPopup('<div class="font-bold text-center">شما اینجا هستید</div>');

    // 2. Business Markers
    businesses.forEach((item) => {
      const { business, distanceMeters, computedStatus } = item;
      const isOpen = computedStatus.isOpen;

      const markerBg = isOpen ? 'bg-emerald-500' : 'bg-rose-500';

      const customIcon = L.divIcon({
        className: 'custom-business-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="px-2 py-1 rounded-xl ${markerBg} text-white font-extrabold text-[11px] shadow-lg border-2 border-white flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-white"></span>
              <span>${business.name.slice(0, 15)}...</span>
            </div>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });

      const marker = L.marker([business.lat, business.lng], { icon: customIcon }).addTo(
        markersGroup
      );

      // Popup Content
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1 text-right';
      popupDiv.innerHTML = `
        <div class="font-extrabold text-sm mb-0.5 text-slate-900">${business.name}</div>
        <div class="text-xs text-slate-600 mb-1">${business.activityTitle}</div>
        <div class="flex items-center justify-between text-[11px] mb-2 border-t pt-1">
          <span class="font-bold ${isOpen ? 'text-emerald-600' : 'text-rose-600'}">${computedStatus.statusText}</span>
          <span class="text-slate-500 font-semibold">${formatDistanceText(distanceMeters)}</span>
        </div>
        <div class="flex items-center gap-1">
          <button id="btn-detail-${business.id}" class="flex-1 py-1.5 px-2 bg-amber-500 text-white rounded-lg font-bold text-xs shadow-xs text-center">مشاهده جزییات</button>
          <a href="tel:${business.phone}" class="py-1.5 px-2 bg-emerald-500 text-white rounded-lg font-bold text-xs text-center">تماس</a>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-detail-${business.id}`);
        if (btn) {
          btn.onclick = () => onSelectBusiness(item);
        }
      });
    });

    // Fit bounds if businesses exist
    if (businesses.length > 0) {
      const groupBounds = L.featureGroup([
        L.marker([userLocation.lat, userLocation.lng]),
        ...businesses.map((b) => L.marker([b.business.lat, b.business.lng])),
      ]).getBounds();
      map.fitBounds(groupBounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [businesses, userLocation]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14);
    }
    onRequestLocation();
  };

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Re-center Control Button */}
      <button
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-20 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-2.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
      >
        <Compass size={18} weight="regular" className="text-amber-500" />
        <span>موقعیت من</span>
      </button>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-700 dark:text-slate-300">باز است</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-700 dark:text-slate-300">بسته است</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span className="text-slate-700 dark:text-slate-300">موقعیت شما</span>
        </div>
      </div>
    </div>
  );
};
