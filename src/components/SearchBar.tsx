import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlass,
  NavigationArrow,
  Clock,
  MapPin,
  X,
  Sparkle,
  Star,
  TrendUp,
  Funnel
} from '@phosphor-icons/react';
import { SearchFilters, UserLocation } from '../types';
import { CATEGORIES } from '../data/categories';
import { PERSIAN_SYNONYMS } from '../utils/synonyms';
import { CategoryIcon } from './IconSystem';

interface SearchBarProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  userLocation: UserLocation;
  onDetectLocation: () => void;
  isLocating?: boolean;
}

const POPULAR_SEARCH_CHIPS = [
  { label: 'الکتریکی و کولر', query: 'الکتریکی' },
  { label: 'کافه و قهوه', query: 'کافه' },
  { label: 'نانوایی سنگک', query: 'نانوایی' },
  { label: 'داروخانه شبانه‌روزی', query: 'داروخانه' },
  { label: 'تعویض روغن', query: 'تعویض روغن' },
  { label: 'کلیدسازی', query: 'کلیدسازی' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  setFilters,
  userLocation,
  onDetectLocation,
  isLocating = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const distanceOptions = [1, 3, 5, 10, 20];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, query: val }));

    if (!val || val.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const queryTrimmed = val.trim().toLowerCase();
    const matches = new Set<string>();

    CATEGORIES.forEach((cat) => {
      if (cat.name.includes(queryTrimmed)) matches.add(cat.name);
      cat.subCategories.forEach((sub) => {
        if (sub.includes(queryTrimmed)) matches.add(sub);
      });
    });

    Object.keys(PERSIAN_SYNONYMS).forEach((key) => {
      if (key.includes(queryTrimmed)) {
        matches.add(key);
        PERSIAN_SYNONYMS[key].slice(0, 2).forEach((syn) => matches.add(syn));
      }
    });

    const resultList = Array.from(matches).slice(0, 6);
    setSuggestions(resultList);
    setShowSuggestions(resultList.length > 0);
  };

  const selectSuggestion = (text: string) => {
    setFilters((prev) => ({ ...prev, query: text }));
    setShowSuggestions(false);
  };

  const clearQuery = () => {
    setFilters((prev) => ({ ...prev, query: '' }));
    setShowSuggestions(false);
  };

  const toggleOpenOnly = () => {
    setFilters((prev) => ({ ...prev, openOnly: !prev.openOnly }));
  };

  const selectCategory = (catName: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catName ? '' : catName,
      subCategory: '',
    }));
  };

  const toggleSortByRating = () => {
    setFilters((prev) => ({
      ...prev,
      sortBy: prev.sortBy === 'rating' ? 'relevance' : 'rating',
    }));
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 transition-all py-3 px-4 shadow-xs">
      <div className="max-w-4xl mx-auto flex flex-col gap-3" ref={containerRef}>
        {/* Search Input Box */}
        <div className="relative flex flex-col">
          <div className="relative flex items-center group">
            <div className="absolute right-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <MagnifyingGlass size={20} weight="regular" />
            </div>
            <input
              type="text"
              value={filters.query}
              onChange={handleQueryChange}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="جستجوی سریع صنف، کالا یا خدمات (مثلاً: الکتریکی، کولر، کافه)..."
              className="w-full pl-28 pr-11 py-3.5 bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 text-sm font-medium shadow-inner"
            />

            {/* Action buttons inside search box */}
            <div className="absolute left-2 flex items-center gap-1">
              {filters.query && (
                <button
                  onClick={clearQuery}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors active:scale-90"
                  title="پاک‌کردن"
                >
                  <X size={18} weight="bold" />
                </button>
              )}

              {/* Near Me Location Button */}
              <button
                onClick={onDetectLocation}
                disabled={isLocating}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                  userLocation.address !== 'تهران (مرکز)'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                }`}
                title="شناسایی موقعیت مکانی شما"
              >
                <NavigationArrow size={16} weight="regular" className={isLocating ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">نزدیک من</span>
              </button>
            </div>
          </div>

          {/* Auto-suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden animate-fade-in">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                <Sparkle size={14} weight="regular" className="text-amber-500" />
                <span>پیشنهادهای هوشمند چی کجا:</span>
              </div>
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSuggestion(sug)}
                  className="w-full text-right px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700/80 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MagnifyingGlass size={16} weight="regular" className="text-slate-400" />
                    <span>{sug}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md font-bold">
                    جستجو
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-bold whitespace-nowrap">
            <TrendUp size={14} weight="regular" className="text-emerald-500" />
            محبوب:
          </span>
          {POPULAR_SEARCH_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => selectSuggestion(chip.query)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors border border-slate-200/50 dark:border-slate-700/50 active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Quick Filter Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Open Now Toggle */}
            <button
              onClick={toggleOpenOnly}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-bold active:scale-95 ${
                filters.openOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              <Clock size={16} weight="regular" />
              <span>🟢 همین الان باز</span>
            </button>

            {/* Popular / Rating Toggle */}
            <button
              onClick={toggleSortByRating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-bold active:scale-95 ${
                filters.sortBy === 'rating'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <Star size={16} weight="regular" className="text-amber-400 fill-amber-400" />
              <span>محبوب‌ترین‌ها</span>
            </button>

            {/* Distance Radius Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <MapPin size={16} weight="regular" className="text-emerald-500 mr-1" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">شعاع:</span>
              {distanceOptions.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setFilters((prev) => ({ ...prev, maxDistanceKm: dist }))}
                  className={`px-2 py-0.5 rounded-lg transition-all font-mono text-[11px] ${
                    filters.maxDistanceKm === dist
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {dist}km
                </button>
              ))}
            </div>
          </div>

          {/* Location String */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Funnel size={14} weight="regular" className="text-slate-400" />
            <span>مبدا:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{userLocation.address}</span>
          </div>
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, category: '', subCategory: '' }))}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all active:scale-95 ${
              filters.category === ''
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            همه اصناف
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-medium border transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <CategoryIcon categoryKey={cat.name} size={18} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
