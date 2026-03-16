"use client";

import { useNotification, NotificationData } from "./NotificationContext";

// Icon components
function SuccessIcon() {
  return (
    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function getIcon(type: NotificationData["type"]) {
  switch (type) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    case "info":
      return <InfoIcon />;
    case "warning":
      return <WarningIcon />;
    case "order":
      return <MegaphoneIcon />;
    default:
      return <InfoIcon />;
  }
}

function getTitleColor(type: NotificationData["type"]) {
  switch (type) {
    case "success":
      return "text-emerald-600";
    case "error":
      return "text-red-600";
    case "info":
      return "text-blue-600";
    case "warning":
      return "text-amber-600";
    case "order":
      return "text-primary";
    default:
      return "text-slate-700";
  }
}

interface SingleNotificationProps {
  notification: NotificationData;
  onClose: () => void;
}

function SingleNotification({ notification, onClose }: SingleNotificationProps) {
  const { type, title, message, details, actionLabel, onAction } = notification;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {getIcon(type)}
          <h3 className={`font-semibold text-lg ${getTitleColor(type)}`}>
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Three dots menu indicator */}
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          </div>
          <button
            onClick={onClose}
            className="ml-2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {message && (
          <p className="text-sm text-slate-600 mb-4">{message}</p>
        )}
        
        {/* Details list */}
        {details && Object.keys(details).length > 0 && (
          <div className="space-y-2">
            {Object.entries(details).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm text-slate-500">{key}:</span>
                <span className="text-sm font-semibold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {(actionLabel || onAction) && (
        <div className="px-5 pb-5">
          <button
            onClick={() => {
              onAction?.();
              onClose();
            }}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/30"
          >
            {actionLabel || "View Details"}
          </button>
        </div>
      )}
    </div>
  );
}

export function NotificationContainer() {
  const { notifications, hideNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full">
      {notifications.map((notification) => (
        <SingleNotification
          key={notification.id}
          notification={notification}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </div>
  );
}
