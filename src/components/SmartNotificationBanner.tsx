import React from 'react';
import { BellRinging, X } from '@phosphor-icons/react';
import { SmartNotification } from '../types';

interface SmartNotificationBannerProps {
  notifications: SmartNotification[];
  onDismiss?: (id: string) => void;
  onOpenOwnerPanel?: () => void;
  onSelectBusiness?: (id: string) => void;
}

export const SmartNotificationBanner: React.FC<SmartNotificationBannerProps> = ({
  notifications,
  onDismiss,
  onOpenOwnerPanel,
  onSelectBusiness,
}) => {
  const unreadNotifs = notifications.filter((n) => !n.read);

  if (unreadNotifs.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-700 text-white py-2.5 px-4 sm:px-6 rounded-2xl shadow-md relative z-30 mb-4 transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onSelectBusiness && onSelectBusiness(unreadNotifs[0].businessId)}
        >
          <div className="p-1.5 rounded-xl bg-white/20 animate-bounce">
            <BellRinging size={18} weight="regular" />
          </div>
          <div>
            <strong className="font-extrabold ml-1">{unreadNotifs[0].title}:</strong>
            <span>{unreadNotifs[0].message}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenOwnerPanel && (
            <button
              onClick={onOpenOwnerPanel}
              className="px-3 py-1 rounded-xl bg-white text-emerald-950 font-extrabold text-[11px] hover:bg-emerald-50 transition-all shadow-xs active:scale-95"
            >
              مدیریت در پنل
            </button>
          )}

          {onDismiss && (
            <button
              onClick={() => onDismiss(unreadNotifs[0].id)}
              className="p-1 rounded-lg hover:bg-white/20 text-emerald-100 transition-colors active:scale-90"
              title="بستن"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
