'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  ClockRewind as HistoryIcon,
  CpuChip01 as BrainCog,
  FaceId as ScanFace,
  Folder,
  FolderPlus,
  Home01 as Home,
  LayoutGrid01 as LayoutGrid,
  LayoutLeft as SidebarIcon,
  Plus,
} from '@untitledui-pro/icons/line';

// Navigation item types
interface NavSubItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems: NavSubItem[];
}
import { MobileHeader } from './MobileHeader';
import { TopHeader } from './TopHeader';
import { Breadcrumbs } from './Breadcrumbs';
import { useChatContext } from '@/lib/chat-context';
import { useMobileMenu } from '@/lib/mobile-menu-context';
import { useSidebar, SidebarMode, SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from '@/lib/sidebar-context';
import { useSpaces } from '@/hooks/useSpaces';
import { NavigationDrawer } from './NavigationDrawer';
import { MobileAccountPanel } from '@/components/custom/shared/navigation/MobileAccountPanel';
import { MobileNotificationsPanel } from '@/components/custom/shared/navigation/MobileNotificationsPanel';
import { MobileHelpPanel } from '@/components/custom/shared/navigation/MobileHelpPanel';
import { MobileFullScreenMenu } from '@/components/custom/shared/navigation/MobileFullScreenMenu';
import { devProps } from '@/lib/utils/dev-props';

// Flyout timing constants
const FLYOUT_HOVER_DELAY = 500; // Time before closing when mouse leaves (ms)

// Navigation structure with subitems
// Note: Brand and Brain sub-items have no icons (text-only for cleaner look)
const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    subItems: []
  },
  {
    label: 'Brand',
    href: '/brand-hub',
    icon: ScanFace,
    subItems: [
      { label: 'Logo', href: '/brand-hub/logo' },
      { label: 'Colors', href: '/brand-hub/colors' },
      { label: 'Typography', href: '/brand-hub/fonts' },
      { label: 'Art Direction', href: '/brand-hub/art-direction' },
      { label: 'Textures', href: '/brand-hub/textures' },
      { label: 'Guidelines', href: '/brand-hub/guidelines' },
    ]
  },
  {
    label: 'Brain',
    href: '/brain',
    icon: BrainCog,
    subItems: [
      { label: 'Brand Identity', href: '/brain/brand-identity' },
      { label: 'Writing Styles', href: '/brain/writing-styles' },
      { label: 'Design System', href: '/brain/design-system' },
      { label: 'Plugins', href: '/brain/plugins' },
      { label: 'Skills', href: '/brain/skills' },
      { label: 'Agents', href: '/brain/agents' },
      { label: 'Commands', href: '/brain/commands' },
    ]
  },
  {
    label: 'Spaces',
    href: '/spaces',
    icon: LayoutGrid,
    subItems: [] // Dynamic - populated from useSpaces
  },
];

// Helper to determine which section should be expanded based on pathname
function getActiveSectionFromPathname(pathname: string): string | null {
  if (pathname.startsWith('/brand-hub')) return 'Brand';
  if (pathname.startsWith('/brain')) return 'Brain';
  if (pathname.startsWith('/spaces')) return 'Spaces';
  if (pathname === '/') return 'Home';
  return null;
}

// Persist user-collapsed section preferences
const COLLAPSED_SECTIONS_KEY = 'sidebar-collapsed-sections';

function getStoredCollapsedSections(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(COLLAPSED_SECTIONS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCollapsedSections(sections: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COLLAPSED_SECTIONS_KEY, JSON.stringify([...sections]));
  } catch {}
}

// Sidebar control component (Supabase-style)
function SidebarControl({ isExpanded }: { isExpanded: boolean }) {
  const { sidebarMode, setSidebarMode } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ bottom: 0, left: 0 });
  const controlRef = useRef<HTMLDivElement>(null);

  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen && controlRef.current) {
      const rect = controlRef.current.getBoundingClientRect();
      setDropdownPosition({
        bottom: window.innerHeight - rect.top + 4,
        left: isExpanded ? rect.left : rect.right + 8,
      });
    }
  }, [isOpen, isExpanded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const options: { mode: SidebarMode; label: string; description: string }[] = [
    { mode: 'hover', label: 'Expand', description: 'Opens drawer on hover' },
    { mode: 'collapsed', label: 'Collapsed', description: 'Icons only, flyout on hover' },
    { mode: 'expanded', label: 'Pinned', description: 'Always show full sidebar' },
  ];

  return (
    <div {...devProps('SidebarControl')} ref={controlRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-2
          px-2 py-2
          text-fg-tertiary hover:text-fg-primary
          hover:bg-bg-tertiary
          transition-colors duration-150
          rounded-md
          ${isExpanded ? 'justify-start' : 'justify-center'}
        `}
        title="Sidebar control"
        aria-label="Sidebar control"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <SidebarIcon className="w-4 h-4 flex-shrink-0" />
        {isExpanded && (
          <span className="text-xs whitespace-nowrap">Sidebar</span>
        )}
      </button>

      {/* Dropdown - using fixed positioning to ensure visibility */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="fixed w-48 bg-bg-secondary rounded-lg border border-border-secondary shadow-xl z-[9999] overflow-hidden"
            style={{
              bottom: `${dropdownPosition.bottom}px`,
              left: `${dropdownPosition.left}px`,
            }}
            role="menu"
            aria-label="Sidebar mode options"
          >
            <div className="px-3 py-2 border-b border-border-secondary">
              <span className="text-xs text-fg-tertiary">Sidebar mode</span>
            </div>
            <div className="py-1">
              {options.map((option) => {
                const isSelected = sidebarMode === option.mode;
                return (
                  <button
                    key={option.mode}
                    onClick={() => {
                      setSidebarMode(option.mode);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-2
                      px-3 py-2
                      text-left
                      hover:bg-bg-tertiary
                      transition-colors duration-100
                      ${isSelected ? 'text-fg-primary' : 'text-fg-secondary'}
                    `}
                    role="menuitem"
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-fg-brand-primary" />
                    )}
                    {!isSelected && <span className="w-1.5 h-1.5" />}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{option.label}</span>
                      <span className="text-[10px] text-fg-quaternary">{option.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Recent Chats flyout for collapsed mode
function RecentChatsFlyout({
  isOpen,
  anchorRect,
  onClose,
  onMouseEnter,
  onMouseLeave,
  closeMode = 'hover',
}: {
  isOpen: boolean;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  closeMode?: 'click' | 'hover';
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { chatHistory, loadSession } = useChatContext();

  if (!anchorRect) return null;

  const iconCenter = anchorRect.top + anchorRect.height / 2;
  const flyoutTop = Math.max(iconCenter - 20, 60);

  // Dynamic exit animation based on close mode
  const exitAnimation = closeMode === 'click'
    ? { opacity: 0, transition: { duration: 0.1, ease: 'linear' as const } }
    : { opacity: 0, x: -4, scale: 0.98, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] } };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          data-flyout
          initial={{ opacity: 0, x: -4, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={exitAnimation}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="fixed z-[60] w-[272px] bg-bg-secondary border border-border-secondary rounded-lg shadow-xl overflow-hidden"
          style={{
            left: SIDEBAR_WIDTH_COLLAPSED + 8,
            top: flyoutTop,
          }}
          {...devProps('RecentChatsFlyout')}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          role="menu"
          aria-label="Recent chats menu"
        >
          <Link
            href="/chats"
            onClick={onClose}
            className="px-3 py-2.5 border-b border-border-secondary flex items-center justify-between group hover:bg-bg-tertiary transition-colors"
          >
            <span className="text-base font-medium text-fg-primary">Chats</span>
            <ArrowRight className="w-3.5 h-3.5 text-fg-quaternary group-hover:text-fg-brand-primary transition-colors" />
          </Link>
          <div className="py-2 max-h-[300px] overflow-y-auto">
            {chatHistory.length > 0 ? (
              chatHistory.slice(0, 8).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    loadSession(chat.id);
                    if (pathname !== '/chat') {
                      router.push('/chat');
                    }
                    onClose();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors text-left"
                  role="menuitem"
                >
                  <span className="truncate">{chat.title}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-fg-quaternary">No recent chats</p>
            )}
            {chatHistory.length > 8 && (
              <Link
                href="/chats"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 mt-1 text-sm text-fg-brand-primary hover:bg-bg-tertiary transition-colors border-t border-border-secondary"
              >
                View all {chatHistory.length} chats
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Projects flyout for collapsed mode
function ProjectsFlyout({
  isOpen,
  anchorRect,
  onClose,
  onMouseEnter,
  onMouseLeave,
  closeMode = 'hover',
}: {
  isOpen: boolean;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  closeMode?: 'click' | 'hover';
}) {
  const { projects } = useChatContext();

  if (!anchorRect) return null;

  const iconCenter = anchorRect.top + anchorRect.height / 2;
  const flyoutTop = Math.max(iconCenter - 20, 60);

  // Dynamic exit animation based on close mode
  const exitAnimation = closeMode === 'click'
    ? { opacity: 0, transition: { duration: 0.1, ease: 'linear' as const } }
    : { opacity: 0, x: -4, scale: 0.98, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] } };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          data-flyout
          initial={{ opacity: 0, x: -4, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={exitAnimation}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="fixed z-[60] w-[272px] bg-bg-secondary border border-border-secondary rounded-lg shadow-xl overflow-hidden"
          style={{
            left: SIDEBAR_WIDTH_COLLAPSED + 8,
            top: flyoutTop,
          }}
          {...devProps('ProjectsFlyout')}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          role="menu"
          aria-label="Projects menu"
        >
          <Link
            href="/projects"
            onClick={onClose}
            className="px-3 py-2.5 border-b border-border-secondary flex items-center justify-between group hover:bg-bg-tertiary transition-colors"
          >
            <span className="text-base font-medium text-fg-primary">Projects</span>
            <ArrowRight className="w-3.5 h-3.5 text-fg-quaternary group-hover:text-fg-brand-primary transition-colors" />
          </Link>
          <div className="py-2 max-h-[300px] overflow-y-auto">
            {projects.length > 0 ? (
              projects.slice(0, 8).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  onClick={onClose}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors text-left"
                  role="menuitem"
                >
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: project.color ?? undefined }}
                  />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-fg-quaternary">No projects yet</p>
            )}
            {projects.length > 8 && (
              <Link
                href="/projects"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 mt-1 text-sm text-fg-brand-primary hover:bg-bg-tertiary transition-colors border-t border-border-secondary"
              >
                View all {projects.length} projects
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Flyout drawer for collapsed mode (small tooltip-style flyout on hover)
function CollapsedFlyout({
  item,
  isOpen,
  anchorRect,
  onClose,
  onMouseEnter,
  onMouseLeave,
  closeMode = 'hover',
}: {
  item: typeof navItems[0] | null;
  isOpen: boolean;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  closeMode?: 'click' | 'hover';
}) {
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { spaces: userSpaces } = useSpaces();
  const { chatHistory, loadSession, projects } = useChatContext();

  if (!item || !anchorRect) return null;

  // Calculate flyout position - vertically centered with icon button
  // Icon is 40px tall, flyout title row is ~40px, so align centers
  const iconCenter = anchorRect.top + anchorRect.height / 2;
  const flyoutTop = Math.max(iconCenter - 20, 60); // 20px is half of header height

  // Dynamic exit animation based on close mode
  const exitAnimation = closeMode === 'click'
    ? { opacity: 0, transition: { duration: 0.1, ease: 'linear' as const } }
    : { opacity: 0, x: -4, scale: 0.98, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] } };

  // Special content for Home
  if (item.label === 'Home') {
    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={drawerRef}
            {...devProps('CollapsedFlyout')}
            data-flyout
            initial={{ opacity: 0, x: -4, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={exitAnimation}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed z-[60] w-[272px] bg-bg-secondary border border-border-secondary rounded-lg shadow-xl overflow-hidden"
            style={{
              left: SIDEBAR_WIDTH_COLLAPSED + 8,
              top: flyoutTop,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="menu"
            aria-label="Home menu"
          >
            <Link 
              href="/"
              className="px-3 py-2.5 border-b border-border-secondary flex items-center justify-between group hover:bg-bg-tertiary transition-colors"
            >
              <span className="text-base font-medium text-fg-primary">Home</span>
              <ArrowRight className="w-3.5 h-3.5 text-fg-quaternary group-hover:text-fg-brand-primary transition-colors" />
            </Link>
            <div className="py-2 max-h-[300px] overflow-y-auto">
              {/* Projects section */}
              {projects.length > 0 && (
                <>
                  <div className="px-3 py-1 text-[10px] text-fg-quaternary uppercase tracking-wider font-medium">Projects</div>
                  {projects.slice(0, 3).map((project) => (
                    <button
                      key={project.id}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors text-left"
                      role="menuitem"
                    >
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: project.color ?? undefined }}
                      />
                      <span className="truncate">{project.name}</span>
                    </button>
                  ))}
                  <div className="my-1.5 mx-3 border-t border-border-secondary" />
                </>
              )}
              {/* Recent chats section */}
              <div className="px-3 py-1 text-[10px] text-fg-quaternary uppercase tracking-wider font-medium">Recent chats</div>
              {chatHistory.length > 0 ? (
                chatHistory.slice(0, 5).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      loadSession(chat.id);
                      if (pathname !== '/chat') {
                        router.push('/chat');
                      }
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors text-left"
                    role="menuitem"
                  >
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-fg-quaternary">No recent chats</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Special content for Spaces
  if (item.label === 'Spaces') {
    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={drawerRef}
            {...devProps('CollapsedFlyout')}
            data-flyout
            initial={{ opacity: 0, x: -4, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={exitAnimation}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed z-[60] w-[272px] bg-bg-secondary border border-border-secondary rounded-lg shadow-xl overflow-hidden"
            style={{
              left: SIDEBAR_WIDTH_COLLAPSED + 8,
              top: flyoutTop,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="menu"
            aria-label="Spaces menu"
          >
            <Link 
              href="/spaces"
              className="px-3 py-2.5 border-b border-border-secondary flex items-center justify-between group hover:bg-bg-tertiary transition-colors"
            >
              <span className="text-base font-medium text-fg-primary">Spaces</span>
              <ArrowRight className="w-3.5 h-3.5 text-fg-quaternary group-hover:text-fg-brand-primary transition-colors" />
            </Link>
            <div className="py-2 max-h-[300px] overflow-y-auto">
              <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors">
                <FolderPlus className="w-3.5 h-3.5 text-fg-quaternary" />
                <span>Create new Space</span>
              </button>
              {userSpaces.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border-secondary">
                  <div className="px-3 py-1 text-[10px] text-fg-quaternary uppercase tracking-wider font-medium">My Spaces</div>
                  {userSpaces.map((space) => (
                    <Link
                      key={space.id}
                      href={`/spaces/${space.slug}`}
                      onClick={onClose}
                      className={`
                        w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors
                        ${pathname === `/spaces/${space.slug}` 
                          ? 'text-fg-brand-primary bg-bg-brand-primary' 
                          : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                        }
                      `}
                      role="menuitem"
                    >
                      <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{space.title}</span>
                    </Link>
                  ))}
                </div>
              )}
              {userSpaces.length === 0 && (
                <p className="px-3 py-2 text-xs text-fg-quaternary">No spaces yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Standard subItems flyout for Brand/Brain
  if (item.subItems && item.subItems.length > 0) {
    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={drawerRef}
            {...devProps('CollapsedFlyout')}
            data-flyout
            initial={{ opacity: 0, x: -4, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={exitAnimation}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed z-[60] w-[272px] bg-bg-secondary border border-border-secondary rounded-lg shadow-xl overflow-hidden"
            style={{
              left: SIDEBAR_WIDTH_COLLAPSED + 8,
              top: flyoutTop,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="menu"
            aria-label={`${item.label} menu`}
          >
            <Link 
              href={item.href}
              onClick={onClose}
              className="px-3 py-2.5 border-b border-border-secondary flex items-center justify-between group hover:bg-bg-tertiary transition-colors"
            >
              <span className="text-base font-medium text-fg-primary">{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-fg-quaternary group-hover:text-fg-brand-primary transition-colors" />
            </Link>
            <div className="py-2">
              {item.subItems.map((subItem) => {
                const SubIcon = 'icon' in subItem ? subItem.icon : null;
                const isActive = pathname === subItem.href;
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    onClick={onClose}
                    className={`
                      w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors
                      ${isActive
                        ? 'text-fg-brand-primary bg-bg-brand-primary'
                        : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                      }
                    `}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {SubIcon && <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                    <span>{subItem.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
  const { sidebarMode, setIsSidebarHovered, sidebarWidth } = useSidebar();
  const [hoveredItem, setHoveredItem] = useState<typeof navItems[0] | null>(null);
  const [hoveredAnchorRect, setHoveredAnchorRect] = useState<DOMRect | null>(null);
  const [isFlyoutHovered, setIsFlyoutHovered] = useState(false);
  // Unified flyout state for collapsed mode - only one flyout open at a time
  type FlyoutType = 'recentChats' | 'projects' | null;
  type FlyoutCloseMode = 'click' | 'hover';
  const [activeFlyout, setActiveFlyout] = useState<FlyoutType>(null);
  const [flyoutAnchorRect, setFlyoutAnchorRect] = useState<DOMRect | null>(null);
  const [isFlyoutContentHovered, setIsFlyoutContentHovered] = useState(false);
  const [flyoutCloseMode, setFlyoutCloseMode] = useState<FlyoutCloseMode>('hover');
  const flyoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // For hover mode - NavigationDrawer
  const [drawerItem, setDrawerItem] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const railRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { chatHistory, triggerChatReset, loadSession, projects } = useChatContext();
  const router = useRouter();
  const { spaces: userSpaces, isLoaded: spacesLoaded } = useSpaces();
  

  // Track sections the user has explicitly collapsed (survives navigation)
  const userCollapsedSectionsRef = useRef<Set<string>>(getStoredCollapsedSections());

  // For expanded mode: only expand the section containing the current page
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const activeSection = getActiveSectionFromPathname(pathname);
    const userCollapsed = getStoredCollapsedSections();
    return (activeSection && !userCollapsed.has(activeSection)) ? [activeSection] : [];
  });

  // Update expanded sections when pathname changes (respects user collapse preferences)
  useEffect(() => {
    const activeSection = getActiveSectionFromPathname(pathname);
    if (activeSection
        && !expandedSections.includes(activeSection)
        && !userCollapsedSectionsRef.current.has(activeSection)) {
      setExpandedSections(prev => [...prev, activeSection]);
    }
  }, [pathname]);

  // Click-outside handler for collapsed flyouts - closes immediately
  useEffect(() => {
    if (sidebarMode !== 'collapsed') return;
    if (!hoveredItem && activeFlyout === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is inside any flyout
      const flyoutElements = document.querySelectorAll('[data-flyout]');
      let isInsideFlyout = false;
      flyoutElements.forEach(el => {
        if (el.contains(target)) isInsideFlyout = true;
      });

      // Check if click is inside the sidebar rail
      const isInsideRail = railRef.current?.contains(target);

      if (!isInsideFlyout && !isInsideRail) {
        // Clear any pending timeouts
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        if (flyoutTimeoutRef.current) {
          clearTimeout(flyoutTimeoutRef.current);
          flyoutTimeoutRef.current = null;
        }

        // Set click mode for instant close animation
        setFlyoutCloseMode('click');

        // Close all flyouts
        setHoveredItem(null);
        setHoveredAnchorRect(null);
        setIsFlyoutHovered(false);
        setActiveFlyout(null);
        setFlyoutAnchorRect(null);
        setIsFlyoutContentHovered(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarMode, hoveredItem, activeFlyout]);

  const handleNewChat = useCallback(() => {
    triggerChatReset();
    closeMobileMenu();
  }, [triggerChatReset, closeMobileMenu]);

  const handleHomeClick = useCallback(() => {
    if (pathname === '/') {
      triggerChatReset();
    }
    closeMobileMenu();
  }, [pathname, triggerChatReset, closeMobileMenu]);

  const toggleSection = (label: string) => {
    setExpandedSections(prev => {
      if (prev.includes(label)) {
        userCollapsedSectionsRef.current.add(label);
        saveCollapsedSections(userCollapsedSectionsRef.current);
        return prev.filter(l => l !== label);
      } else {
        userCollapsedSectionsRef.current.delete(label);
        saveCollapsedSections(userCollapsedSectionsRef.current);
        return [...prev, label];
      }
    });
  };

  // Collapsed mode uses small flyout, hover mode uses full NavigationDrawer
  const shouldShowFlyout = sidebarMode === 'collapsed';
  const shouldShowDrawer = sidebarMode === 'hover';

  const handleMouseEnterItem = (item: typeof navItems[0], event: React.MouseEvent) => {
    // For collapsed mode - use flyout
    if (shouldShowFlyout) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setHoveredAnchorRect(rect);
      setHoveredItem(item);
      setFlyoutCloseMode('hover'); // Reset close mode when opening
    }

    // For hover mode - use NavigationDrawer
    if (shouldShowDrawer) {
      setDrawerItem(item.label);
      setIsDrawerOpen(true);
    }
  };

  const handleMouseLeaveItem = () => {
    if (shouldShowFlyout) {
      // Delay before closing - gives user time to reach flyout
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isFlyoutHovered) {
          setFlyoutCloseMode('hover');
          setHoveredItem(null);
          setHoveredAnchorRect(null);
        }
      }, FLYOUT_HOVER_DELAY);
    }
    // Note: NavigationDrawer handles its own mouse leave behavior
  };

  const handleFlyoutMouseEnter = () => {
    setIsFlyoutHovered(true);
    // Cancel any pending close
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleFlyoutMouseLeave = () => {
    setIsFlyoutHovered(false);
    // Delay before closing - user can easily re-enter
    hoverTimeoutRef.current = setTimeout(() => {
      setFlyoutCloseMode('hover');
      setHoveredItem(null);
      setHoveredAnchorRect(null);
    }, FLYOUT_HOVER_DELAY);
  };

  const handleFlyoutClose = () => {
    setHoveredItem(null);
    setHoveredAnchorRect(null);
    setIsFlyoutHovered(false);
  };

  // Unified flyout handlers for collapsed mode - mutually exclusive
  // Also handles drawer mode for Recent Chats and Projects
  const openFlyout = (type: FlyoutType, event: React.MouseEvent) => {
    // For collapsed mode - use flyout
    if (shouldShowFlyout) {
      // Clear any pending timeout
      if (flyoutTimeoutRef.current) {
        clearTimeout(flyoutTimeoutRef.current);
        flyoutTimeoutRef.current = null;
      }

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setFlyoutAnchorRect(rect);
      setActiveFlyout(type);
      setFlyoutCloseMode('hover'); // Reset close mode when opening
    }

    // For hover mode - use NavigationDrawer
    if (shouldShowDrawer && type) {
      // Map flyout type to drawer item name
      const drawerItemName = type === 'recentChats' ? 'RecentChats' : 'Projects';
      setDrawerItem(drawerItemName);
      setIsDrawerOpen(true);
    }
  };

  const handleFlyoutItemMouseLeave = () => {
    if (shouldShowFlyout) {
      flyoutTimeoutRef.current = setTimeout(() => {
        if (!isFlyoutContentHovered) {
          setFlyoutCloseMode('hover');
          setActiveFlyout(null);
          setFlyoutAnchorRect(null);
        }
      }, FLYOUT_HOVER_DELAY);
    }
    // Note: NavigationDrawer handles its own mouse leave behavior
  };

  const handleFlyoutContentMouseEnter = () => {
    setIsFlyoutContentHovered(true);
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
      flyoutTimeoutRef.current = null;
    }
  };

  const handleFlyoutContentMouseLeave = () => {
    setIsFlyoutContentHovered(false);
    flyoutTimeoutRef.current = setTimeout(() => {
      setFlyoutCloseMode('hover');
      setActiveFlyout(null);
      setFlyoutAnchorRect(null);
    }, FLYOUT_HOVER_DELAY);
  };

  const closeFlyout = () => {
    setActiveFlyout(null);
    setFlyoutAnchorRect(null);
    setIsFlyoutContentHovered(false);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setDrawerItem(null);
  };

  // Determine if expanded mode
  const isExpandedMode = sidebarMode === 'expanded';

  // Check if any nav item or its subitems are active
  const isItemActive = (item: typeof navItems[0]) => {
    if (pathname === item.href) return true;
    if (item.href !== '/' && pathname.startsWith(item.href)) return true;
    return item.subItems?.some(sub => pathname === sub.href);
  };

  return (
    <>
      {/* Desktop Top Header */}
      <div {...devProps('Sidebar')} className="hidden lg:block">
        <TopHeader>
          <Breadcrumbs />
        </TopHeader>
      </div>

      {/* Mobile Header */}
      <MobileHeader onBrandClick={handleHomeClick} />

      {/* Desktop Navigation Sidebar */}
      <aside
        ref={railRef}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => {
          setIsSidebarHovered(false);
          if (shouldShowFlyout && !isFlyoutHovered) {
            handleMouseLeaveItem();
          }
        }}
        className="hidden lg:flex fixed top-14 left-0 z-[200] bg-bg-secondary border-r border-border-secondary flex-col h-[calc(100vh-56px)] transition-all duration-200 ease-out"
        style={{ width: sidebarWidth }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Navigation Items */}
        <nav className={`flex flex-col ${isExpandedMode ? 'gap-1 px-3 pt-2.5' : 'gap-1.5 items-center px-1.5 pt-3'}`}>
          {/* New Chat Button */}
          <Link
            href="/chat"
            onClick={handleNewChat}
            className={`
              flex items-center gap-2
              transition-colors duration-150
              group
              text-fg-tertiary hover:text-fg-primary
              ${isExpandedMode
                ? 'w-full py-3 px-3 bg-bg-tertiary hover:bg-bg-quaternary rounded-lg border border-border-secondary'
                : ''
              }
            `}
            title="New Chat"
            aria-label="Start new chat"
          >
            <div className={`
              flex items-center justify-center rounded-lg transition-all duration-150
              ${isExpandedMode
                ? ''
                : 'w-11 h-11 bg-bg-tertiary group-hover:bg-bg-quaternary border border-border-secondary'
              }
            `}>
              <Plus className="w-5 h-5 text-fg-brand-primary" />
            </div>
            {isExpandedMode && (
              <span className="text-sm font-medium">New Chat</span>
            )}
          </Link>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSectionExpanded = expandedSections.includes(item.label);
            const isOnMainPage = pathname === item.href;
            
            return (
              <div key={item.href} className="w-full">
                {/* Main nav item */}
                <div
                  className="relative"
                  onMouseEnter={(e) => handleMouseEnterItem(item, e)}
                  onMouseLeave={handleMouseLeaveItem}
                >
                  {isExpandedMode ? (
                    // Expanded/Pinned mode - unified row with consistent styling
                    <div className="flex flex-col">
                      <div
                        className={`
                          flex items-center pr-1.5 rounded-md transition-colors duration-150
                          ${isActive || isOnMainPage
                            ? 'bg-bg-brand-primary text-fg-brand-primary'
                            : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                          }
                        `}
                      >
                        {/* Main link - toggles section when already on this page */}
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            if (isActive || isOnMainPage) {
                              e.preventDefault();
                              toggleSection(item.label);
                            } else if (item.href === '/') {
                              handleHomeClick();
                            } else {
                              closeMobileMenu();
                            }
                          }}
                          className="flex-1 flex items-center gap-2.5 px-3 py-3"
                          aria-current={isOnMainPage ? 'page' : undefined}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="text-base font-medium">{item.label}</span>
                        </Link>
                        
                        {/* Toggle button for sections with sub-items */}
                        {(hasSubItems || item.label === 'Spaces' || item.label === 'Home') && (
                          <button
                            onClick={() => toggleSection(item.label)}
                            className="p-2 rounded-md transition-colors duration-150 hover:bg-bg-quaternary"
                            aria-expanded={isSectionExpanded}
                            aria-label={`${isSectionExpanded ? 'Collapse' : 'Expand'} ${item.label} section`}
                          >
                            <motion.div
                              animate={{ rotate: isSectionExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </motion.div>
                          </button>
                        )}
                      </div>
                      
                      {/* Sub-items for expanded mode */}
                      <AnimatePresence>
                        {isSectionExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-5 py-1.5 space-y-1">
                              {/* Home - show projects and recent chats */}
                              {item.label === 'Home' && (
                                <>
                                  {/* Projects */}
                                  {projects.length > 0 && (
                                    <>
                                      <div className="px-2 py-1 text-[10px] text-fg-quaternary uppercase tracking-wider font-medium">Projects</div>
                                      {projects.slice(0, 3).map((project) => (
                                        <button
                                          key={project.id}
                                          className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-md text-sm text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors text-left"
                                        >
                                          <div
                                            className="w-3 h-3 rounded-sm flex-shrink-0"
                                            style={{ backgroundColor: project.color ?? undefined }}
                                          />
                                          <span className="truncate">{project.name}</span>
                                        </button>
                                      ))}
                                      <div className="my-1.5 mx-2 border-t border-border-secondary" />
                                    </>
                                  )}
                                  {/* Recent chats */}
                                  <div className="px-2 py-1 text-[10px] text-fg-quaternary uppercase tracking-wider font-medium">Recent chats</div>
                                  {chatHistory.slice(0, 4).map((chat) => (
                                    <button
                                      key={chat.id}
                                      onClick={() => {
                                        loadSession(chat.id);
                                        if (pathname !== '/chat') {
                                          router.push('/chat');
                                        }
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-md text-sm text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors text-left"
                                    >
                                      <span className="truncate">{chat.title}</span>
                                    </button>
                                  ))}
                                  {chatHistory.length === 0 ? (
                                    <p className="px-2.5 py-2 text-xs text-fg-quaternary">No recent chats</p>
                                  ) : (
                                    <Link
                                      href="/chats"
                                      className="w-full flex items-center gap-1 px-2.5 py-2.5 rounded-md text-sm text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors"
                                    >
                                      See all
                                    </Link>
                                  )}
                                </>
                              )}
                              
                              {/* Spaces - show user spaces */}
                              {item.label === 'Spaces' && (
                                <>
                                  <button className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-md text-sm text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors">
                                    <FolderPlus className="w-4 h-4" />
                                    <span>Create new Space</span>
                                  </button>
                                  {spacesLoaded && userSpaces.map((space) => (
                                    <Link
                                      key={space.id}
                                      href={`/spaces/${space.slug}`}
                                      className={`
                                        w-full flex items-center gap-2 px-2.5 py-2.5 rounded-md text-sm transition-colors
                                        ${pathname === `/spaces/${space.slug}`
                                          ? 'text-fg-brand-primary bg-bg-brand-primary'
                                          : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary'
                                        }
                                      `}
                                    >
                                      <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                                      <span className="truncate">{space.title}</span>
                                    </Link>
                                  ))}
                                  {spacesLoaded && userSpaces.length === 0 && (
                                    <p className="px-2.5 py-2.5 text-sm text-fg-quaternary">No spaces yet</p>
                                  )}
                                </>
                              )}
                              
                              {/* Regular sub-items */}
                              {item.subItems?.map((subItem) => {
                                const SubIcon = 'icon' in subItem ? subItem.icon : null;
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={`
                                      w-full flex items-center gap-2 px-2.5 py-2.5 rounded-md text-sm transition-colors
                                      ${isSubActive
                                        ? 'text-fg-brand-primary bg-bg-brand-primary'
                                        : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary'
                                      }
                                    `}
                                    aria-current={isSubActive ? 'page' : undefined}
                                  >
                                    {SubIcon && <SubIcon className="w-4 h-4 flex-shrink-0" />}
                                    <span>{subItem.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Collapsed/Hover mode - clean icon buttons
                    (() => {
                      const isDrawerActive = shouldShowDrawer && isDrawerOpen && drawerItem === item.label;
                      const showHighlight = isActive || isDrawerActive;
                      
                      return (
                        <Link
                          data-nav-item={item.label}
                          href={item.href}
                          onClick={item.href === '/' ? handleHomeClick : closeMobileMenu}
                          className={`
                            flex items-center justify-center
                            w-11 h-11 mx-auto rounded-lg
                            transition-colors duration-150
                            ${showHighlight
                              ? 'text-fg-brand-primary bg-bg-brand-primary'
                              : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary'
                            }
                          `}
                          title={item.label}
                          aria-label={item.label}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <Icon className="w-5 h-5" />
                        </Link>
                      );
                    })()
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Separator before Projects and Chats */}
        <div className={`${isExpandedMode ? 'mx-3 my-2.5' : 'mx-2 my-2'} border-t border-border-secondary`} />

        {/* Projects and Recent Chats Group */}
        <div className={`flex flex-col ${isExpandedMode ? 'px-3 pb-2.5 gap-1.5' : 'items-center pb-1.5 gap-1.5'}`}>
          {/* Projects Link */}
          <div 
            className={`flex flex-col ${isExpandedMode ? '' : 'justify-center'}`}
            onMouseEnter={(e) => !isExpandedMode && openFlyout('projects', e)}
            onMouseLeave={() => !isExpandedMode && handleFlyoutItemMouseLeave()}
          >
            {(() => {
              const isProjectsActive = pathname.startsWith('/projects');
              const isProjectsExpanded = expandedSections.includes('Projects');
              
              if (isExpandedMode) {
                return (
                  <div className="flex flex-col">
                    <div className={`
                      flex items-center pr-1.5 rounded-md transition-colors duration-150
                      ${isProjectsActive
                        ? 'bg-bg-brand-primary text-fg-brand-primary'
                        : 'text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-primary'
                      }
                    `}>
                      <Link
                        href="/projects"
                        onClick={(e) => {
                          if (isProjectsActive) {
                            e.preventDefault();
                            toggleSection('Projects');
                          }
                        }}
                        className="flex-1 flex items-center gap-2.5 px-3 py-3"
                      >
                        <Folder className="w-5 h-5" />
                        <span className="text-base flex-1">Projects</span>
                        {projects.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-quaternary text-fg-tertiary">
                            {projects.length}
                          </span>
                        )}
                      </Link>
                      {projects.length > 0 && (
                        <button
                          onClick={() => toggleSection('Projects')}
                          className="p-2 rounded-md transition-colors duration-150 hover:bg-bg-quaternary"
                        >
                          <motion.div animate={{ rotate: isProjectsExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-3 h-3" />
                          </motion.div>
                        </button>
                      )}
                    </div>
                    
                    {/* Expandable projects list */}
                    <AnimatePresence>
                      {isProjectsExpanded && projects.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-5 py-1.5 space-y-1">
                            {projects.slice(0, 5).map((project) => (
                              <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-md text-sm text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors"
                              >
                                <div
                                  className="w-3 h-3 rounded-sm flex-shrink-0"
                                  style={{ backgroundColor: project.color ?? undefined }}
                                />
                                <span className="truncate">{project.name}</span>
                              </Link>
                            ))}
                            {projects.length > 5 && (
                              <Link
                                href="/projects"
                                className="w-full flex items-center gap-1 px-2.5 py-2.5 rounded-md text-sm text-fg-brand-primary hover:bg-bg-tertiary transition-colors"
                              >
                                View all {projects.length}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              // Collapsed mode
              return (
                <Link
                  href="/projects"
                  className={`
                    flex items-center justify-center
                    w-11 h-11 mx-auto rounded-lg
                    transition-colors duration-150
                    ${isProjectsActive
                      ? 'text-fg-brand-primary bg-bg-brand-primary'
                      : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary'
                    }
                  `}
                  title="Projects"
                >
                  <Folder className="w-5 h-5" />
                </Link>
              );
            })()}
          </div>

          {/* Recent Chats Link */}
          <div 
            className={`flex flex-col ${isExpandedMode ? '' : 'justify-center'}`}
            onMouseEnter={(e) => !isExpandedMode && openFlyout('recentChats', e)}
            onMouseLeave={() => !isExpandedMode && handleFlyoutItemMouseLeave()}
          >
            {(() => {
              const isRecentChatsActive = pathname === '/chats';
              const isRecentChatsExpanded = expandedSections.includes('RecentChats');
              
              if (isExpandedMode) {
                return (
                  <div className="flex flex-col">
                    <div className={`
                      flex items-center pr-1.5 rounded-md transition-colors duration-150
                      ${isRecentChatsActive
                        ? 'bg-bg-brand-primary text-fg-brand-primary'
                        : 'text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-primary'
                      }
                    `}>
                      <Link
                        href="/chats"
                        onClick={(e) => {
                          if (isRecentChatsActive) {
                            e.preventDefault();
                            toggleSection('RecentChats');
                          }
                        }}
                        className="flex-1 flex items-center gap-2.5 px-3 py-3"
                      >
                        <HistoryIcon className="w-5 h-5" />
                        <span className="text-base flex-1">Chats</span>
                        {chatHistory.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-quaternary text-fg-tertiary">
                            {chatHistory.length}
                          </span>
                        )}
                      </Link>
                      {chatHistory.length > 0 && (
                        <button
                          onClick={() => toggleSection('RecentChats')}
                          className="p-2 rounded-md transition-colors duration-150 hover:bg-bg-quaternary"
                        >
                          <motion.div animate={{ rotate: isRecentChatsExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-3 h-3" />
                          </motion.div>
                        </button>
                      )}
                    </div>
                    
                    {/* Expandable recent chats list */}
                    <AnimatePresence>
                      {isRecentChatsExpanded && chatHistory.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-5 py-1.5 space-y-1">
                            {chatHistory.slice(0, 5).map((chat) => (
                              <button
                                key={chat.id}
                                onClick={() => {
                                  loadSession(chat.id);
                                  if (pathname !== '/chat') router.push('/chat');
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-md text-sm text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors text-left"
                              >
                                <span className="truncate">{chat.title}</span>
                              </button>
                            ))}
                            {chatHistory.length > 5 && (
                              <Link
                                href="/chats"
                                className="w-full flex items-center gap-1 px-2.5 py-2.5 rounded-md text-sm text-fg-brand-primary hover:bg-bg-tertiary transition-colors"
                              >
                                View all {chatHistory.length}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              // Collapsed mode
              return (
                <Link
                  href="/chats"
                  className={`
                    flex items-center justify-center
                    w-11 h-11 mx-auto rounded-lg
                    transition-colors duration-150
                    ${isRecentChatsActive
                      ? 'text-fg-brand-primary bg-bg-brand-primary'
                      : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary'
                    }
                  `}
                  title="Chats"
                >
                  <HistoryIcon className="w-5 h-5" />
                </Link>
              );
            })()}
          </div>
        </div>

        <div className="flex-1" />

        {/* Bottom Section */}
        <div className={`flex flex-col border-t border-border-secondary py-3 gap-1 ${isExpandedMode ? 'px-3' : 'items-center px-1.5'}`}>
          <SidebarControl isExpanded={isExpandedMode} />
        </div>
      </aside>

      {/* Collapsed mode flyouts - mutually exclusive */}
      {shouldShowFlyout && (
        <>
          {/* Hover bridge - invisible zone between nav item and flyout to prevent accidental closes */}
          {hoveredItem && hoveredAnchorRect && activeFlyout === null && (
            <div
              className="fixed z-[59] bg-transparent"
              style={{
                left: SIDEBAR_WIDTH_COLLAPSED,
                top: hoveredAnchorRect.top - 8,
                width: 16,
                height: hoveredAnchorRect.height + 16,
              }}
              onMouseEnter={handleFlyoutMouseEnter}
            />
          )}
          {/* Hover bridge for Projects/Chats flyouts */}
          {activeFlyout && flyoutAnchorRect && (
            <div
              className="fixed z-[59] bg-transparent"
              style={{
                left: SIDEBAR_WIDTH_COLLAPSED,
                top: flyoutAnchorRect.top - 8,
                width: 16,
                height: flyoutAnchorRect.height + 16,
              }}
              onMouseEnter={handleFlyoutContentMouseEnter}
            />
          )}
          <CollapsedFlyout
            item={hoveredItem}
            isOpen={hoveredItem !== null && activeFlyout === null}
            anchorRect={hoveredAnchorRect}
            onClose={handleFlyoutClose}
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
            closeMode={flyoutCloseMode}
          />
          <RecentChatsFlyout
            isOpen={activeFlyout === 'recentChats'}
            anchorRect={flyoutAnchorRect}
            onClose={closeFlyout}
            onMouseEnter={handleFlyoutContentMouseEnter}
            onMouseLeave={handleFlyoutContentMouseLeave}
            closeMode={flyoutCloseMode}
          />
          <ProjectsFlyout
            isOpen={activeFlyout === 'projects'}
            anchorRect={flyoutAnchorRect}
            onClose={closeFlyout}
            onMouseEnter={handleFlyoutContentMouseEnter}
            onMouseLeave={handleFlyoutContentMouseLeave}
            closeMode={flyoutCloseMode}
          />
        </>
      )}

      {/* Hover mode - full NavigationDrawer */}
      {shouldShowDrawer && (
        <NavigationDrawer
          isOpen={isDrawerOpen}
          item={drawerItem}
          onClose={handleDrawerClose}
          railRef={railRef}
        />
      )}

      {/* Mobile Full-Screen Menu */}
      <MobileFullScreenMenu />

      {/* Mobile Full-Screen Panels */}
      <MobileAccountPanel />
      <MobileNotificationsPanel />
      <MobileHelpPanel />
    </>
  );
}
