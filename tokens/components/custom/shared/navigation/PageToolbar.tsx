'use client';

import { useState, useRef, useEffect, type FC, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClockRewind,
  DotsVertical,
  Edit01,
  HelpCircle,
  Link01,
  Maximize01,
  PlusCircle,
  Settings01,
  UserPlus01,
} from '@untitledui-pro/icons/line';
import { Avatar } from '@/components/base/base/avatar/avatar';
import { Tooltip, TooltipTrigger } from '@/components/base';
import { devProps } from '@/lib/utils/dev-props';

/* ─── Date formatting ─── */

function formatEditedDate(dateStr?: string | null): string {
  if (!dateStr) return 'Not yet edited';

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Edited just now';
  if (diffHours < 24) return `Edited ${diffHours}h ago`;
  if (diffDays < 7) return `Edited ${diffDays}d ago`;

  return `Edited ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

/* ─── Menu item ─── */

export interface MenuItemDef {
  icon: FC<{ className?: string }>;
  label: string;
  addon?: string;
  onAction?: () => void;
  /** If true, item is non-interactive (e.g. timestamp display) */
  inert?: boolean;
  /** aria-expanded value for toggle-style menu items (e.g. Settings) */
  ariaExpanded?: boolean;
  /** aria-controls value pointing to the controlled panel id */
  ariaControls?: string;
}

function MenuItem({ icon: Icon, label, addon, onAction, inert, ariaExpanded, ariaControls }: MenuItemDef) {
  const isActive = ariaExpanded === true;

  const content = (
    <div className={`flex items-center rounded-md px-2.5 py-2 transition duration-micro ease-motion-out group-hover:bg-bg-primary_hover ${isActive ? 'bg-bg-primary_hover' : ''}`}>
      <Icon aria-hidden className={`mr-2 size-4 shrink-0 stroke-[2.25px] ${isActive ? 'text-fg-secondary' : 'text-fg-quaternary'}`} />
      <span className={`grow truncate text-sm ${inert ? 'font-normal' : 'font-semibold'} ${isActive ? 'text-fg-primary' : 'text-fg-secondary'} group-hover:text-fg-secondary_hover`}>
        {label}
      </span>
      {addon && (
        <span className="ml-3 shrink-0 rounded px-1 py-px text-xs font-medium text-fg-quaternary ring-1 ring-inset ring-border-secondary">
          {addon}
        </span>
      )}
    </div>
  );

  if (inert) {
    return <div {...devProps('MenuItem')} className="group px-1.5 py-px">{content}</div>;
  }

  return (
    <button
      {...devProps('MenuItem')}
      onClick={onAction}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className="group w-full cursor-pointer px-1.5 py-px text-left outline-hidden"
    >
      {content}
    </button>
  );
}

function MenuSeparator() {
  return <div {...devProps('MenuSeparator')} className="my-1 h-px w-full bg-border-secondary" />;
}

/* ─── PageToolbar ─── */

interface PageToolbarProps {
  /** Callback for the "Add" / plus button. If omitted, plus button is still shown as placeholder. */
  onAddClick?: () => void;
  /** Tooltip label for the add button (defaults to "Add") */
  addLabel?: string;
  /** Callback wired to the "Settings" item in the dots menu */
  onSettingsClick?: () => void;
  /**
   * Whether the settings panel is currently open. Used to render an active
   * visual state on the Settings menu item and the correct aria-expanded value.
   */
  isSettingsOpen?: boolean;
  /**
   * The id of the settings panel element — forwarded as aria-controls on the
   * Settings toggle button.
   */
  settingsPanelId?: string;
  /** ISO date string for "last edited" display */
  updatedAt?: string | null;
  /** Custom menu items for the dots menu. Defaults to placeholder items. */
  menuItems?: (MenuItemDef | 'separator')[];
  /** Show the "Edited X ago" label (default true) */
  showEditedDate?: boolean;
  /** Show the avatar group (default true) */
  showAvatars?: boolean;
  /** Extra content rendered before the add button (e.g. InfoPopover) */
  leading?: ReactNode;
}

export function PageToolbar({
  onAddClick,
  addLabel = 'Add',
  onSettingsClick,
  isSettingsOpen,
  settingsPanelId,
  updatedAt,
  menuItems: customMenuItems,
  showEditedDate = true,
  showAvatars = true,
  leading,
}: PageToolbarProps) {
  const editedLabel = formatEditedDate(updatedAt);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close on escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const defaultMenuItems: (MenuItemDef | 'separator')[] = [
    { icon: ClockRewind, label: editedLabel, inert: true },
    'separator',
    { icon: Link01, label: 'Copy Link', addon: '⌘L' },
    { icon: Maximize01, label: 'Full Width', addon: '⌘K→T' },
    'separator',
    {
      icon: Settings01,
      label: 'Settings',
      addon: '⌘S',
      onAction: () => { onSettingsClick?.(); setIsMenuOpen(false); },
      ariaExpanded: isSettingsOpen,
      ariaControls: settingsPanelId,
    },
    { icon: Edit01, label: 'Edit Page' },
    { icon: ClockRewind, label: 'Version History' },
    'separator',
    { icon: HelpCircle, label: 'Page Types', addon: '?' },
    { icon: UserPlus01, label: 'Invite colleagues', addon: '⌘I' },
  ];

  const menuItems = customMenuItems ?? defaultMenuItems;

  return (
    <div {...devProps('PageToolbar')} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* Edited date — hidden on mobile, shown on md+ */}
      {showEditedDate && (
        <span className="text-sm text-fg-tertiary whitespace-nowrap hidden md:inline mr-1">
          {editedLabel}
        </span>
      )}

      {/* Avatar group */}
      {showAvatars && (
        <div className="flex items-center -space-x-2 mr-1">
          <Avatar size="xs" src="/avatars/avatar-2.jpg" alt="Team member" className="opacity-50" contrastBorder />
          <Avatar size="xs" src="/avatars/avatar-1.jpg" alt="Team member" contrastBorder />
        </div>
      )}

      {/* Leading slot (e.g. InfoPopover) */}
      {leading}

      {/* Add button */}
      <Tooltip title={addLabel}>
        <TooltipTrigger
          onPress={onAddClick}
          className="flex items-center justify-center w-9 h-9 rounded-md text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-all duration-quick"
        >
          <PlusCircle className="w-[18px] h-[18px]" />
        </TooltipTrigger>
      </Tooltip>

      {/* Dots menu */}
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label="Open menu"
          className={`flex items-center justify-center w-9 h-9 rounded-md text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-all duration-quick ${
            isMenuOpen ? 'bg-bg-tertiary text-fg-primary' : ''
          }`}
        >
          <DotsVertical className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              {...devProps('PageToolbarDotsMenu')}
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="
                absolute top-full right-0 mt-2
                w-64
                bg-bg-secondary
                rounded-lg
                border border-border-secondary
                shadow-lg
                z-[200]
                overflow-hidden
                py-1
                origin-top-right
              "
            >
              {menuItems.map((item, i) =>
                item === 'separator' ? (
                  <MenuSeparator key={`sep-${i}`} />
                ) : (
                  <MenuItem key={item.label} {...item} />
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
