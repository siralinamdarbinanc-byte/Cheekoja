import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 700);

    const timer2 = setTimeout(() => {
      setHidden(true);
      if (onFinish) onFinish();
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-300 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        {/* Animated Brand Logo Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-black text-4xl shadow-2xl shadow-emerald-500/40 animate-pulse">
            چ
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>چیکجا</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            موتور هوشمند جستجوی محلی کالا و خدمات
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
