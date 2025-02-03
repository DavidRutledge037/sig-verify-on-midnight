import { create } from 'zustand';

export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timeout?: number;
}

interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
}

type SetState = (
    partial: NotificationStore | Partial<NotificationStore> | ((state: NotificationStore) => NotificationStore | Partial<NotificationStore>),
    replace?: boolean
) => void;

export const useNotifications = create<NotificationStore>((set: SetState) => ({
    notifications: [],
    addNotification: (notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString();
        set((state: NotificationStore) => ({
            notifications: [...state.notifications, { ...notification, id }]
        }));

        if (notification.timeout) {
            setTimeout(() => {
                set((state: NotificationStore) => ({
                    notifications: state.notifications.filter((n: Notification) => n.id !== id)
                }));
            }, notification.timeout);
        }
    },
    removeNotification: (id: string) => {
        set((state: NotificationStore) => ({
            notifications: state.notifications.filter((n: Notification) => n.id !== id)
        }));
    }
})); 