'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell01,
  HelpCircle,
  Home01,
  Link01,
  SearchLg,
} from '@untitledui-pro/icons/line';
import { Brandmark } from '@/components/custom/shared/branding/Brandmark';
import { SearchModal } from '@/components/custom/shared/overlays/SearchModal';
import { HelpDropdown } from '@/components/custom/shared/menus/HelpDropdown';
import { NotificationsDropdown } from '@/components/custom/shared/menus/NotificationsDropdown';
import { ProfileDropdown } from '@/components/custom/shared/menus/ProfileDropdown';
import { devProps } from '@/lib/utils/dev-props';

interface TopHeaderProps {
  children?: React.ReactNode; // For breadcrumbs
}

export function TopHeader({ children }: TopHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const helpTriggerRef = useRef<HTMLButtonElement>(null);
  const notificationsTriggerRef = useRef<HTMLButtonElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

  const anyDropdownOpen = isHelpOpen || isNotificationsOpen || isProfileOpen;
  const allTriggerRefs = useMemo(() => [helpTriggerRef, notificationsTriggerRef, profileTriggerRef], []);

  // Close all dropdowns when one opens
  const closeAllDropdowns = () => {
    setIsHelpOpen(false);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHelpClick = () => {
    closeAllDropdowns();
    setIsHelpOpen(!isHelpOpen);
  };

  const handleNotificationsClick = () => {
    closeAllDropdowns();
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleProfileClick = () => {
    closeAllDropdowns();
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <>
      <header {...devProps('TopHeader')} className="fixed top-0 left-0 right-0 z-[160] h-14 bg-bg-secondary border-b border-border-secondary">
        <div className="flex items-center justify-between h-full pr-3">
          {/* Left Section: Brand Icon + Breadcrumbs */}
          <div className="flex items-center">
            {/* Brandmark container - matches sidebar rail exactly (56px width, centered content) */}
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <Link
                href="/"
                className="
                  flex items-center justify-center
                  w-9 h-9
                  rounded-md
                  hover:bg-bg-tertiary
                  transition-all duration-quick
                "
                title="Home"
              >
                <Brandmark size={20} />
              </Link>
            </div>
            
            {/* Breadcrumbs slot */}
            {children && (
              <div className="flex items-center">
                {children}
              </div>
            )}
          </div>

          {/* Right Section: Utility Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search - Supabase style search box */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="
                hidden sm:flex items-center gap-1.5
                pl-2.5 pr-2 py-1
                rounded-md
                bg-bg-tertiary/50
                border border-border-secondary
                text-fg-quaternary
                hover:bg-bg-tertiary hover:border-border-primary hover:text-fg-tertiary
                transition-all duration-quick
                text-sm
                h-8
              "
              title="Search (⌘K)"
            >
              <SearchLg className="w-4 h-4" />
              <span className="text-left">Search...</span>
              <kbd className="hidden md:inline-flex items-center px-1 py-0.5 text-[9px] font-mono bg-bg-secondary/80 rounded text-fg-quaternary ml-1">
                ⌘K
              </kbd>
            </button>
            {/* Mobile search icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="
                sm:hidden flex items-center justify-center
                w-9 h-9
                rounded-md
                text-fg-tertiary hover:text-fg-primary
                hover:bg-bg-tertiary
                transition-all duration-quick
              "
              title="Search"
            >
              <SearchLg className="w-[18px] h-[18px]" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                ref={notificationsTriggerRef}
                onClick={handleNotificationsClick}
                className={`
                  relative flex items-center justify-center
                  w-9 h-9
                  rounded-md
                  text-fg-tertiary hover:text-fg-primary
                  hover:bg-bg-tertiary
                  transition-all duration-quick
                  ${isNotificationsOpen ? 'bg-bg-tertiary text-fg-primary' : ''}
                `}
                title="Notifications"
              >
                <Bell01 className="w-[18px] h-[18px]" />
              </button>
              <NotificationsDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                triggerRef={notificationsTriggerRef}
                allTriggerRefs={allTriggerRefs}
              />
            </div>

            {/* Help Center */}
            <div className="relative">
              <button
                ref={helpTriggerRef}
                onClick={handleHelpClick}
                className={`
                  flex items-center justify-center
                  w-9 h-9
                  rounded-md
                  text-fg-tertiary hover:text-fg-primary
                  hover:bg-bg-tertiary
                  transition-all duration-quick
                  ${isHelpOpen ? 'bg-bg-tertiary text-fg-primary' : ''}
                `}
                title="Help"
              >
                <HelpCircle className="w-[18px] h-[18px]" />
              </button>
              <HelpDropdown
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                triggerRef={helpTriggerRef}
                allTriggerRefs={allTriggerRefs}
              />
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                ref={profileTriggerRef}
                onClick={handleProfileClick}
                className={`
                  flex items-center justify-center
                  w-9 h-9
                  rounded-md
                  hover:bg-bg-tertiary
                  transition-all duration-quick
                  ${isProfileOpen ? 'bg-bg-tertiary' : ''}
                `}
                title="Profile"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-charcoal to-black border border-border-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-mono">A</span>
                </div>
              </button>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                triggerRef={profileTriggerRef}
                allTriggerRefs={allTriggerRefs}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Shared backdrop blur overlay for all header dropdowns */}
      <AnimatePresence>
        {anyDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="
              fixed inset-0
              top-14 left-14
              backdrop-blur-sm
              bg-black/5
              z-[150]
              pointer-events-none
            "
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
