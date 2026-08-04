import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm animate-pulse flex flex-col md:flex-row gap-4">
      {/* Image / Avatar Skeleton */}
      <div className="w-full md:w-36 h-36 bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0" />

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mb-1" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
          <div className="flex gap-2">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
