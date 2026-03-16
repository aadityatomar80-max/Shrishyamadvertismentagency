"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type NotificationType = "success" | "error" | "info" | "warning" | "order";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  details?: Record<string, string>;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface NotificationContextValue {
  notifications: NotificationData[];
  showNotification: (notification: Omit<NotificationData, "id">) => void;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = useCallback(
    (notification: Omit<NotificationData, "id">) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification = { ...notification, id };
      
      setNotifications((prev) => [...prev, newNotification]);

      // Auto-hide after duration (default 5 seconds, 0 = never auto-hide)
      const duration = notification.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          hideNotification(id);
        }, duration);
      }
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification must be used within NotificationProvider"
    );
  }
  return ctx;
}
