import React from 'react';
import { CATEGORIES } from '../data/categories';
import { Category } from '../types';
import {
  Fan,
  Car,
  Armchair,
  Cross,
  Wrench,
  ShoppingBag,
  Shirt,
  Smartphone,
  ChevronDown,
  ChevronUp,
  LayoutGrid
} from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: string;
  selectedSubCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubCategory: (subCatName: string) => void;
}

// Icon mapper helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Fan':
      return <Fan className="w-5 h-5 text-amber-500" />;
    case 'Car':
      return <Car className="w-5 h-5 text-blue-500" />;
    case 'Armchair':
      return <Armchair className="w-5 h-5 text-orange-500" />;
    case 'Cross':
      return <Cross className="w-5 h-5 text-emerald-500" />;
    case 'Wrench':
      return <Wrench className="w-5 h-5 text-purple-500" />;
    case 'ShoppingBag':
      return <ShoppingBag className="w-5 h-5 text-rose-500" />;
    case 'Shirt':
      return <Shirt className="w-5 h-5 text-indigo-500" />;
    case 'Smartphone':
      return <Smartphone className="w-5 h-5 text-teal-500" />;
    default:
      return <LayoutGrid className="w-5 h-5 text-amber-500" />;
  }
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  selectedSubCategory,
  onSelectCategory,
  onSelectSubCategory,
}) => {
  const [expandedCatId, setExpandedCatId] = React.useState<string | null>(null);

  const toggleExpand = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCatId(expandedCatId === catId ? null : catId);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            دسته بندی‌های اصلی:
          </span>

          {(selectedCategory || selectedSubCategory) && (
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectSubCategory('all');
              }}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
            >
              پاک کردن فیلتر دسته
            </button>
          )}
        </div>

        {/* Categories Horizontal Scroll Grid */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {/* All Categories Option */}
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectSubCategory('all');
              setExpandedCatId(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap text-xs font-bold border ${
              selectedCategory === 'all' || !selectedCategory
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>همه دسته‌ها</span>
          </button>

          {CATEGORIES.map((cat: Category) => {
            const isSelected = selectedCategory === cat.name;
            const isExpanded = expandedCatId === cat.id;

            return (
              <div key={cat.id} className="relative flex-shrink-0">
                <div
                  onClick={() => {
                    if (isSelected) {
                      onSelectCategory('all');
                      onSelectSubCategory('all');
                    } else {
                      onSelectCategory(cat.name);
                      onSelectSubCategory('all');
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all border text-xs font-semibold ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-200/60 dark:bg-slate-700'}`}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span>{cat.name}</span>

                  <button
                    onClick={(e) => toggleExpand(cat.id, e)}
                    className="p-1 hover:bg-black/10 rounded-md transition-colors mr-0.5"
                    title="نمایش زیردسته‌ها"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Subcategories Dropdown Drawer */}
                {isExpanded && (
                  <div className="absolute top-full right-0 mt-1.5 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2.5 py-1">
                      زیردسته‌های {cat.name}:
                    </div>
                    {cat.subCategories.map((subCat) => {
                      const isSubSelected = selectedSubCategory === subCat;
                      return (
                        <button
                          key={subCat}
                          onClick={() => {
                            onSelectCategory(cat.name);
                            onSelectSubCategory(subCat);
                            setExpandedCatId(null);
                          }}
                          className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isSubSelected
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          {subCat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
