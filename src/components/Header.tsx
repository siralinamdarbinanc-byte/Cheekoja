import React from 'react';
import { Sun, Moon, Plus, Question, Storefront, Sparkle, Info } from '@phosphor-icons/react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAddModal: () => void;
  onOpenDesignDoc?: () => void;
  onOpenAboutModal?: () => void;
  unreadNotifsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenAddModal,
  onOpenDesignDoc,
  onOpenAboutModal,
}) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 font-black text-xl group-hover:scale-105 transition-transform duration-200">
            چ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>چیکجا</span>
                <Sparkle size={16} weight="duotone" className="text-emerald-500 animate-pulse" />
              </h1>
              <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-800 flex items-center gap-1">
                <Storefront size={12} weight="regular" />
                جستجوی محلی اصناف
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              موتور هوشمند جستجوی محلی کالا، خدمات و راسته‌های بازار
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Add Business CTA */}
          <button
            onClick={onOpenAddModal}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all duration-200"
          >
            <Plus size={18} weight="bold" />
            <span>ثبت کاسبی رایگان</span>
          </button>

          {/* About CheKoja Trigger */}
          {onOpenAboutModal && (
            <button
              onClick={onOpenAboutModal}
              className="px-3 py-2 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-2xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-extrabold"
              title="درباره چیکجا"
            >
              <Info size={18} weight="bold" className="text-emerald-500" />
              <span className="hidden sm:inline">درباره چیکجا</span>
            </button>
          )}

          {/* Design Doc Modal Trigger */}
          {onOpenDesignDoc && (
            <button
              onClick={onOpenDesignDoc}
              className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-2xl transition-all duration-200 active:scale-95"
              title="مستندات و راهنما"
            >
              <Question size={20} weight="regular" />
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-2xl transition-all duration-200 active:scale-95"
            title={darkMode ? 'تم روشن' : 'تم تاریک'}
          >
            {darkMode ? (
              <Sun size={20} weight="regular" className="text-amber-400" />
            ) : (
              <Moon size={20} weight="regular" className="text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
