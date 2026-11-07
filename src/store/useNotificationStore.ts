import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType =
  | 'new_match'
  | 'deadline_7d'
  | 'deadline_3d'
  | 'deadline_1d'
  | 'documents_incomplete'
  | 'deadline_extended'
  | 'scholarship_expired'
  | 'profile_tip'
  | 'application_reminder';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  scholarshipId?: string;
  actionLabel?: string;
  actionRoute?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'deadline_3d',
    title: 'Urgent: Central Sector Scholarship Deadline',
    message: 'The Ministry of Education scholarship closes in 3 days. Your documents are verified.',
    timestamp: 'Today, 11:30 AM',
    isRead: false,
    scholarshipId: 'csss-moe-2026',
    actionLabel: 'Apply Now',
    actionRoute: '/explore?highlight=csss-moe-2026'
  },
  {
    id: 'notif-2',
    type: 'new_match',
    title: 'New Scheme Released: AICTE Pragati Scholarship',
    message: 'New technical degree scholarship matching your engineering profile was published.',
    timestamp: 'Today, 9:15 AM',
    isRead: false,
    scholarshipId: 'aicte-pragati-2026',
    actionLabel: 'Check Criteria',
    actionRoute: '/explore?highlight=aicte-pragati-2026'
  },
  {
    id: 'notif-3',
    type: 'documents_incomplete',
    title: 'Action Required: Income Certificate Pending',
    message: 'Upload your verified income certificate to unlock 3 eligible state schemes.',
    timestamp: 'Yesterday',
    isRead: false,
    actionLabel: 'Complete Checklist',
    actionRoute: '/documents'
  },
  {
    id: 'notif-4',
    type: 'deadline_7d',
    title: 'Uttarakhand State Merit Closes in 7 Days',
    message: 'State higher education directorate verification deadline approaching.',
    timestamp: '2 days ago',
    isRead: true,
    scholarshipId: 'uk-merit-2026',
    actionLabel: 'View Details',
    actionRoute: '/explore?highlight=uk-merit-2026'
  }
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      unreadCount: 3,

      addNotification: (notif) => {
        const item: NotificationItem = {
          ...notif,
          id: `notif-${Date.now()}`,
          timestamp: 'Just now',
          isRead: false
        };
        const updated = [item, ...get().notifications];
        set({
          notifications: updated,
          unreadCount: updated.filter((n) => !n.isRead).length
        });
      },

      markAsRead: (id) => {
        const updated = get().notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        set({
          notifications: updated,
          unreadCount: updated.filter((n) => !n.isRead).length
        });
      },

      markAllAsRead: () => {
        const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
        set({
          notifications: updated,
          unreadCount: 0
        });
      },

      deleteNotification: (id) => {
        const updated = get().notifications.filter((n) => n.id !== id);
        set({
          notifications: updated,
          unreadCount: updated.filter((n) => !n.isRead).length
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      }
    }),
    {
      name: 'grantly_notifications_storage'
    }
  )
);
