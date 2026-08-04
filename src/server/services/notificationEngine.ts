import { db } from '../db';
import { getShiftStatus } from './searchEngine';

export interface SmartNotificationItem {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'opening_soon' | 'closed' | 'status_reminder';
}

class NotificationEngine {
  private notifications: SmartNotificationItem[] = [];

  public async generateSmartAlerts(): Promise<SmartNotificationItem[]> {
    try {
      const businesses = await db.getBusinesses();
      const now = new Date();
      const alertList: SmartNotificationItem[] = [];

      businesses.forEach((b) => {
        const status = getShiftStatus(b.shifts, now);
        
        // Check if business has shift opening in < 45 mins
        if (!status.isOpen && status.detailText.includes('بازگشایی در ساعت')) {
          alertList.push({
            id: `notif-${b.id}-open`,
            businessId: b.id,
            businessName: b.name,
            title: '⚡ هشدار بازگشایی هوشمند',
            message: `${b.name} به زودی باز می‌شود (${status.detailText}).`,
            time: 'هم‌اکنون',
            read: false,
            type: 'opening_soon',
          });
        } else if (status.isOpen) {
          alertList.push({
            id: `notif-${b.id}-status`,
            businessId: b.id,
            businessName: b.name,
            title: '✅ وضعیت کاسبی فعال',
            message: `${b.name} هم‌اکنون ${status.detailText}`,
            time: '۱۰ دقیقه پیش',
            read: true,
            type: 'status_reminder',
          });
        }
      });

      this.notifications = alertList;
      return this.notifications;
    } catch {
      return this.notifications;
    }
  }

  public async getNotifications(): Promise<SmartNotificationItem[]> {
    return this.generateSmartAlerts();
  }

  public markAsRead(id: string) {
    const item = this.notifications.find((n) => n.id === id);
    if (item) item.read = true;
  }
}

export const notificationEngine = new NotificationEngine();
