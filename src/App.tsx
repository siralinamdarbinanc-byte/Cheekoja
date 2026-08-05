import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { BusinessCard } from './components/BusinessCard';
import { SkeletonCard } from './components/SkeletonCard';
import { BusinessModal } from './components/BusinessModal';
import { BusinessOwnerPanel } from './components/BusinessOwnerPanel';
import { SmartNotificationBanner } from './components/SmartNotificationBanner';
import { DesignDocViewer } from './components/DesignDocViewer';
import { AboutCheKojaModal } from './components/AboutCheKojaModal';
import { BottomNav } from './components/BottomNav';
import { SEO } from './components/SEO';
import { SplashScreen } from './components/SplashScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { useTheme } from './components/ThemeProvider';

import { INITIAL_BUSINESSES } from './data/mockBusinesses';
import { Business, SearchFilters, UserLocation, SmartNotification } from './types';
import { filterAndRankBusinesses, RankedBusiness } from './utils/ranking';
import { searchBusinessesApi, fetchNotificationsApi } from './api/client';
import { Storefront, MagnifyingGlass, HardDrives } from '@phosphor-icons/react';

// Lazy load MapView for optimal bundle splitting and fast initial page render
const MapView = lazy(() => import('./components/MapView').then((mod) => ({ default: mod.MapView })));

export default function App() {
  // Theme State from ThemeProvider
  const { darkMode, setDarkMode } = useTheme();

  // 1. App Core State
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedForDirections, setSelectedForDirections] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. Navigation & UI State
  const [mobileTab, setMobileTab] = useState<'search' | 'map' | 'add' | 'notifications'>('search');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDesignDocOpen, setIsDesignDocOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);

  // Search Filters State
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    subCategory: '',
    maxDistanceKm: 10,
    openOnly: false,
    sortBy: 'relevance',
  });

  // User Location State (Default: Tehran Center)
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: 35.6892,
    lng: 51.389,
    city: 'تهران',
    address: 'تهران (مرکز)',
  });

  // Load initial data from REST Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const notifs = await fetchNotificationsApi();
        if (isMounted && notifs.length > 0) {
          setNotifications(notifs);
        }

        const apiBiz = await searchBusinessesApi({
          query: filters.query,
          category: filters.category,
          maxDistanceKm: filters.maxDistanceKm,
          openOnly: filters.openOnly,
          lat: userLocation.lat,
          lng: userLocation.lng,
        });

        if (isMounted && apiBiz.length > 0) {
          setBusinesses(apiBiz);
        }
      } catch (err) {
        console.warn('API fetch fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [filters.query, filters.category, filters.maxDistanceKm, filters.openOnly, userLocation]);

  // "Near Me" Geolocation Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('مرورگر شما از قابلیت دریافت موقعیت مکانی پشتیبانی نمی‌کند.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        let formattedAddr = 'موقعیت زنده شما';
        let userCity = 'تهران';

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&accept-language=fa`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              userCity = data.address.city || data.address.town || data.address.village || 'تهران';
              const neighborhood =
                data.address.neighbourhood || data.address.suburb || data.address.road || '';
              formattedAddr = neighborhood
                ? `${userCity}، ${neighborhood}`
                : data.display_name?.slice(0, 35) || userCity;
            }
          }
        } catch (e) {
          console.warn('Reverse geocode error:', e);
        }

        setUserLocation({
          lat: userLat,
          lng: userLng,
          city: userCity,
          address: formattedAddr,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        alert('امکان دریافت دقیق موقعیت مکانی وجود نداشت. موقعیت پیش‌فرض تهران تنظیم است.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Rank and filter businesses based on spatial distance and shift schedule
  const rankedBusinesses: RankedBusiness[] = useMemo(() => {
    return filterAndRankBusinesses(businesses, filters, userLocation);
  }, [businesses, filters, userLocation]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-16 md:pb-0">
      {/* Startup Splash Screen */}
      <SplashScreen />

      {/* Dynamic Local SEO & Structured Data */}
      <SEO searchQuery={filters.query} category={filters.category} />

      {/* PWA Offline Alert & Install Banner */}
      <OfflineBanner />

      {/* 1. Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenDesignDoc={() => setIsDesignDocOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        unreadNotifsCount={notifications.filter((n) => !n.read).length}
      />

      {/* 2. Live API & System Status Banner */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 py-1.5 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">پایگاه داده زنده چی کجا</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <HardDrives size={14} weight="regular" className="text-cyan-400 inline" /> سرویس جستجوی زنده اصناف
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="text-amber-400 hover:underline text-[11px] font-bold"
            >
              درباره چی کجا
            </button>
            <span className="text-slate-700">|</span>
            <a
              href="/api/v1/health"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              GET /api/v1/health →
            </a>
          </div>
        </div>
      </div>

      {/* 3. Central Hero Search Bar */}
      <SearchBar
        filters={filters}
        setFilters={setFilters}
        userLocation={userLocation}
        onDetectLocation={handleDetectLocation}
        isLocating={isLocating}
      />

      {/* 4. Smart Notifications Banner */}
      {notifications.length > 0 && mobileTab === 'notifications' && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <SmartNotificationBanner
            notifications={notifications}
            onSelectBusiness={(id) => {
              const b = businesses.find((x) => x.id === id);
              if (b) setSelectedBusiness(b);
            }}
          />
        </div>
      )}

      {/* 5. Main Split View Content (Map + List Layout) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* List Column */}
        <div
          className={`md:col-span-7 lg:col-span-8 flex flex-col gap-4 ${
            mobileTab === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Results Summary Header */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Storefront size={18} weight="regular" className="text-emerald-500" />
              <span>{rankedBusinesses.length} کاسبی نزدیک شما در چی کجا یافت شد</span>
            </div>
            {filters.openOnly && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300/60">
                🟢 فقط باز
              </span>
            )}
          </div>

          {/* Skeleton Shimmer Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : rankedBusinesses.length === 0 ? (
            /* Professional Empty State */
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 text-center border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center space-y-4 my-6">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                <MagnifyingGlass size={32} weight="regular" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">نتیجه‌ای در چی کجا یافت نشد</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  هیچ کاسبی متناسب با عبارت "{filters.query}" یا شعاع {filters.maxDistanceKm} کیلومتر پیدا نشد.
                </p>
              </div>
              <button
                onClick={() =>
                  setFilters({
                    query: '',
                    category: '',
                    subCategory: '',
                    maxDistanceKm: 50,
                    openOnly: false,
                    sortBy: 'relevance',
                  })
                }
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                پاک‌کردن فیلترها و نمایش همه کسب‌وکارها
              </button>
            </div>
          ) : (
            /* Business Cards Feed */
            <div className="space-y-3">
              {rankedBusinesses.map((item) => (
                <BusinessCard
                  key={item.business.id}
                  rankedBusiness={item}
                  onSelect={() => setSelectedBusiness(item.business)}
                  onDirections={(e) => {
                    e.stopPropagation();
                    setSelectedForDirections(item.business);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Interactive Map Column */}
        <div
          className={`md:col-span-5 lg:col-span-4 md:sticky md:top-24 md:h-[calc(100vh-120px)] ${
            mobileTab === 'search' ? 'hidden md:block' : 'block h-[70vh]'
          }`}
        >
          <div className="h-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800">
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 animate-pulse">
                  <Storefront size={36} weight="regular" className="mb-2" />
                  <span className="text-xs font-bold">در حال بارگذاری نقشه تعاملی چی کجا...</span>
                </div>
              }
            >
              <MapView
                businesses={rankedBusinesses}
                userLocation={userLocation}
                onSelectBusiness={(rb) => setSelectedBusiness(rb.business)}
                onRequestLocation={handleDetectLocation}
              />
            </Suspense>
          </div>
        </div>
      </main>

      {/* 6. Modals & Drawers */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          onDirections={(b) => {
            setSelectedForDirections(b);
            setSelectedBusiness(null);
            setMobileTab('map');
          }}
        />
      )}

      {isAddModalOpen && (
        <BusinessOwnerPanel
          businesses={businesses}
          onClose={() => setIsAddModalOpen(false)}
          onBusinessAdded={(newBiz) => {
            setBusinesses((prev) => [newBiz, ...prev]);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {isDesignDocOpen && <DesignDocViewer onClose={() => setIsDesignDocOpen(false)} />}

      {isAboutModalOpen && <AboutCheKojaModal onClose={() => setIsAboutModalOpen(false)} />}

      {/* 7. Mobile Bottom Navigation */}
      <BottomNav
        activeTab={mobileTab}
        setActiveTab={setMobileTab}
        unreadCount={notifications.filter((n) => !n.read).length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />
    </div>
  );
}
