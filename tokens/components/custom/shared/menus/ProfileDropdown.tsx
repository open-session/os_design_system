'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Rss01, Settings01, LogOut01 as LogOut } from '@untitledui-pro/icons/line';
import { ThemeCompactToggle } from '@/components/custom/shared/branding/ThemeCompactToggle';
import { LanguageSelector } from '@/components/custom/shared/selectors/LanguageSelector';
import { useAuth } from '@/lib/auth';
import { ViewerBadge } from '@/components/custom/shared/runtime/ViewerBadge';
import { devProps } from '@/lib/utils/dev-props';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  allTriggerRefs?: React.RefObject<HTMLButtonElement | null>[];
}

export function ProfileDropdown({ isOpen, onClose, triggerRef, allTriggerRefs }: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations('profileDropdown');

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
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

  // Get user data from auth context
  const { user, profile, signOut, isLoading, isSigningOut } = useAuth();

  // Display name: prefer profile displayName, then user email prefix, fallback to 'User'
  const displayName = profile?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            {...devProps('ProfileDropdown')}
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full right-0 mt-5
              w-56
              bg-bg-secondary
              rounded-lg
              border border-border-secondary
              shadow-lg
              z-[200]
              overflow-hidden
            "
          >
            {/* User Info */}
            <div className="px-4 min-h-[52px] flex flex-col justify-center border-b border-border-secondary">
              <div className="flex items-center gap-2">
                <p className="text-base font-medium text-fg-primary">
                  {displayName}
                </p>
                <ViewerBadge className="text-[10px] px-1.5 py-0.5" />
              </div>
              <p className="text-xs text-fg-tertiary mt-0.5">
                {displayEmail}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1 border-b border-border-secondary">
              <button
                onClick={() => {
                  router.push('/account');
                  onClose();
                }}
                className="
                  w-full flex items-center gap-3
                  px-4 py-2
                  text-left
                  hover:bg-bg-tertiary
                  transition-colors
                "
              >
                <Settings01 className="w-4 h-4 text-fg-tertiary" />
                <span className="text-base text-fg-secondary">{t('settings')}</span>
              </button>
              <button
                onClick={() => {
                  // Navigate to updates page (external documentation)
                  window.open('https://opensession.co/updates', '_blank');
                  onClose();
                }}
                className="
                  w-full flex items-center gap-3
                  px-4 py-2
                  text-left
                  hover:bg-bg-tertiary
                  transition-colors
                "
              >
                <Rss01 className="w-4 h-4 text-fg-tertiary" />
                <span className="text-base text-fg-secondary">{t('updates')}</span>
              </button>
            </div>

            {/* Language Section */}
            <div className="border-b border-border-secondary">
              <LanguageSelector variant="dropdown" />
            </div>

            {/* Theme Section - Compact single row */}
            <div className="px-4 py-2.5 border-b border-border-secondary">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-tertiary">{t('theme')}</span>
                <ThemeCompactToggle />
              </div>
            </div>

            {/* Log Out */}
            <div className="py-1">
              <button
                onClick={async () => {
                  onClose();
                  await signOut();
                }}
                disabled={isLoading || isSigningOut}
                className="
                  w-full flex items-center gap-3
                  px-4 py-2
                  text-left
                  hover:bg-bg-tertiary
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isSigningOut ? (
                  <>
                    <div className="w-4 h-4 border border-border-secondary border-t-fg-brand-primary rounded-full animate-spin" />
                    <span className="text-base text-fg-secondary">{t('loggingOut')}</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 text-fg-tertiary" />
                    <span className="text-base text-fg-secondary">{t('logOut')}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
