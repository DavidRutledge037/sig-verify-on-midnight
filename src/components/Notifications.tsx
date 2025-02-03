import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export const Notifications: React.FC = () => {
    const { notifications, removeNotification } = useNotifications();

    return (
        <div className="notifications">
            {notifications.map(notification => (
                <div 
                    key={notification.id} 
                    className={`notification ${notification.type}`}
                >
                    <span>{notification.message}</span>
                    <button onClick={() => removeNotification(notification.id)}>
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}; 