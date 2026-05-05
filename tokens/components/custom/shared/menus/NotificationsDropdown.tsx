'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { AlertCircle, Bell01, CheckCircle, InfoCircle as Info, Settings01, CheckDone01 as CheckCheck } from '@untitledui-pro/icons/line';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  allTriggerRefs?: React.RefObject<HTMLButtonElement | null>[];
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock notifications - in real app, this would come from an API
const mockNotifications: Notification[] = [
  // Empty for now to show empty state
];

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
};

const typeColors = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

export function NotificationsDropdown({ isOpen, onClose, triggerRef, allTriggerRefs }: NotificationsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // Don't close if clicking any header trigger button (lets toggle handlers manage switching)
        const refs = allTriggerRefs || [triggerRef];
        const clickedTrigger = refs.some(ref => ref.current?.contains(target));
        if (!clickedTrigger) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef, allTriggerRefs]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            ref={dropdownRef}
            {...devProps('NotificationsDropdown')}
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full right-0 mt-5
              w-80
              bg-bg-secondary
              rounded-lg
              border border-border-secondary
              shadow-lg
              z-[200]
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 min-h-[52px] border-b border-border-secondary">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-fg-primary">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="
                  px-1.5 py-0.5
                  bg-aperol
                  text-white text-[10px] font-medium
                  rounded-full
                ">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    // Mark all as read
                  }}
                  className="
                    p-1.5 rounded-md
                    text-fg-tertiary hover:text-fg-primary
                    hover:bg-bg-tertiary
                    transition-colors
                  "
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  // Open notification settings
                  onClose();
                }}
                className="
                  p-1.5 rounded-md
                  text-fg-tertiary hover:text-fg-primary
                  hover:bg-bg-tertiary
                  transition-colors
                "
                title="Notification settings"
              >
                <Settings01 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="py-1">
                {notifications.map((notification) => {
                  const Icon = typeIcons[notification.type];
                  const colorClass = typeColors[notification.type];
                  
                  return (
                    <button
                      key={notification.id}
                      className={`
                        w-full flex items-start gap-3
                        px-4 py-3
                        text-left
                        hover:bg-bg-tertiary
                        transition-colors
                        ${!notification.read ? 'bg-bg-tertiary' : ''}
                      `}
                    >
                      <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-base font-medium text-fg-primary line-clamp-1">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-aperol flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-fg-tertiary line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-fg-quaternary mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              // Empty State
              <div className="py-12 px-4 text-center">
                <div className="
                  w-12 h-12 mx-auto mb-3
                  rounded-full
                  bg-bg-tertiary
                  flex items-center justify-center
                ">
                  <Bell01 className="w-5 h-5 text-fg-quaternary" />
                </div>
                <p className="text-base text-fg-secondary">No new notifications</p>
                <p className="text-sm text-fg-tertiary mt-1">
                  We&apos;ll let you know when something arrives
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border-secondary">
              <button
                onClick={() => {
                  // View all notifications
                  onClose();
                }}
                className="
                  w-full px-4 py-2.5
                  text-base text-fg-brand-primary
                  hover:bg-bg-tertiary
                  transition-colors
                  font-medium
                "
              >
                View all notifications
              </button>
            </div>
          )}
          </motion.div>
      )}
    </AnimatePresence>
  );
}

