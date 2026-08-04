import React from 'react';
import { MagnifyingGlass, MapPin, Plus, BellRinging } from '@phosphor-icons/react';

interface BottomNavProps {
  activeTab: 'search' | 'map' | 'add' | 'notifications';
  setActiveTab: (tab: 'search' | 'map' | 'add' | 'notifications') => void;
  unreadCount?: number;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadCount = 0,
  onOpenAddModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 md:hidden px-3 py-2 transition-all">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Search & List */}
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
            activeTab === 'search'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MagnifyingGlass size={20} weight={activeTab === 'search' ? 'bold' : 'regular'} />
          <span className="text-[11px]">جستجو</span>
        </button>

        {/* Tab 2: Map View */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
            activeTab === 'map'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MapPin size={20} weight={activeTab === 'map' ? 'bold' : 'regular'} />
          <span className="text-[11px]">نقشه</span>
        </button>

        {/* Tab 3: Add Business CTA */}
        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center gap-1 px-3 py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
        >
          <div className="bg-emerald-600 text-white p-2 rounded-2xl shadow-md shadow-emerald-600/20 active:scale-90 transition-transform">
            <Plus size={20} weight="bold" />
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">ثبت کاسبی</span>
        </button>

        {/* Tab 4: Notifications */}
        <button
          onClick={() => setActiveTab('notifications')}
          className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
            activeTab === 'notifications'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <BellRinging size={20} weight={activeTab === 'notifications' ? 'bold' : 'regular'} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">اعلان‌ها</span>
        </button>
      </div>
    </nav>
  );
};
