import React, { createContext, useContext, useState } from 'react';

interface Notification {
    type: 'success' | 'error' | 'info';
    message: string;
}

interface NotificationContextType {
    showNotification: (type: Notification['type'], message: string) => void;
    notification: Notification | null;
    clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = (type: Notification['type'], message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const clearNotification = () => setNotification(null);

    return (
        <NotificationContext.Provider value={{ showNotification, notification, clearNotification }}>
            {children}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}; 