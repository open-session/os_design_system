'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Folder, HelpCircle, Home01 as Home, LayoutGrid01 as LayoutGrid, LinkExternal01, Plus, Users01, FaceId as ScanFace, CpuChip01 as BrainCog, ClockRewind as HistoryIcon } from '@untitledui-pro/icons/line';
import { useMobileMenu } from '@/lib/mobile-menu-context';
import { useChatContext } from '@/lib/chat-context';
import { LanguageSelector } from '@/components/custom/shared/selectors/LanguageSelector';
import { devProps } from '@/lib/utils/dev-props';
import { BrandSelector } from '@/components/custom/shared/selectors/BrandSelector';

// Simple navigation items - no sub-items for mobile
const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Brand', href: '/brand-hub', icon: ScanFace },
  { label: 'Brain', href: '/brain', icon: BrainCog },
  { label: 'Spaces', href: '/spaces', icon: LayoutGrid },
];

// Animation variants - smooth slide and fade
const menuVariants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0] as [number, number, number, number],
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      delay: 0.05,
      staggerChildren: 0.04
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  }
};

export function MobileFullScreenMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileMenuOpen, closeMobileMenu, openPanel } = useMobileMenu();
  const { triggerChatReset, chatHistory, projects } = useChatContext();

  const handleNewChat = useCallback(() => {
    triggerChatReset();
    closeMobileMenu();
    if (pathname !== '/chat') {
      router.push('/chat');
    }
  }, [triggerChatReset, closeMobileMenu, pathname, router]);

  const handleNavClick = useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  const handleHomeClick = useCallback(() => {
    if (pathname === '/') {
      triggerChatReset();
    }
    closeMobileMenu();
  }, [pathname, triggerChatReset, closeMobileMenu]);

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  if (!isMobileMenuOpen) return null;

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          {...devProps('MobileFullScreenMenu')}
          className="fixed inset-x-0 top-14 bottom-0 z-[45] bg-bg-primary lg:hidden flex flex-col"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Scrollable Content - Menu slides in below header */}
          <motion.div 
            className="flex-1 overflow-y-auto"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Workspace / Org Switcher */}
            <motion.div variants={itemVariants} className="px-4 pt-4 pb-2">
              <p className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-2 px-1">
                Workspace
              </p>
              <BrandSelector className="w-full" variant="inline" />
            </motion.div>

            {/* Navigation Section */}
            <motion.div variants={itemVariants} className="px-4 py-4">
              <p className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-3 px-1">
                Navigate
              </p>
              <nav className="space-y-1">
                {/* New Chat - Primary Action */}
                <button
                  onClick={handleNewChat}
                  className="
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
                    bg-bg-tertiary hover:bg-bg-quaternary
                    active:bg-bg-quaternary
                    text-fg-primary font-medium 
                    border border-border-secondary
                    transition-all
                  "
                >
                  <Plus className="w-5 h-5 text-fg-brand-primary" />
                  <span>New Chat</span>
                </button>

                {/* Main Nav Items */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={item.href === '/' ? handleHomeClick : handleNavClick}
                      className={`
                        flex items-center gap-3 px-4 py-3.5 rounded-xl
                        transition-colors
                        ${isActive 
                          ? 'bg-bg-tertiary text-fg-brand-primary' 
                          : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-fg-brand-primary' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="my-2 border-t border-border-secondary" />

                {/* Projects */}
                <Link
                  href="/projects"
                  onClick={handleNavClick}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl
                    transition-colors
                    ${isItemActive('/projects')
                      ? 'bg-bg-tertiary text-fg-brand-primary' 
                      : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                    }
                  `}
                >
                  <Folder className={`w-5 h-5 flex-shrink-0 ${isItemActive('/projects') ? 'text-fg-brand-primary' : ''}`} />
                  <span className="font-medium">Projects</span>
                  {projects.length > 0 && (
                    <span className="text-fg-quaternary text-sm">({projects.length})</span>
                  )}
                </Link>

                {/* Recent Chats */}
                <Link
                  href="/chats"
                  onClick={handleNavClick}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl
                    transition-colors
                    ${isItemActive('/chats')
                      ? 'bg-bg-tertiary text-fg-brand-primary' 
                      : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
                    }
                  `}
                >
                  <HistoryIcon className={`w-5 h-5 flex-shrink-0 ${isItemActive('/chats') ? 'text-fg-brand-primary' : ''}`} />
                  <span className="font-medium">Recent Chats</span>
                  {chatHistory.length > 0 && (
                    <span className="text-fg-quaternary text-sm">({chatHistory.length})</span>
                  )}
                </Link>
              </nav>
            </motion.div>

            {/* Settings Section */}
            <motion.div variants={itemVariants} className="px-4 py-4 border-t border-border-secondary">
              <p className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-3 px-1">
                Settings
              </p>
              <div className="space-y-1">
                {/* Account - First */}
                <button 
                  onClick={() => openPanel('account')}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-fg-secondary hover:bg-bg-tertiary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-charcoal to-black border border-border-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[8px] font-mono">A</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Account</p>
                      <p className="text-fg-tertiary text-xs">Manage settings</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-fg-quaternary" />
                </button>

                {/* People & Members - Org management */}
                <Link
                  href="/settings/people"
                  onClick={handleNavClick}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users01 className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">People</p>
                      <p className="text-fg-tertiary text-xs">Manage members & roles</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-fg-quaternary" />
                </Link>

                {/* Help - Second */}
                <button
                  onClick={() => openPanel('help')}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">Help</p>
                      <p className="text-fg-tertiary text-xs">Get support & resources</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-fg-quaternary" />
                </button>

                {/* Language Selector */}
                <LanguageSelector variant="mobile" />
              </div>
            </motion.div>

            {/* Footer Links */}
            <motion.div variants={itemVariants} className="px-4 py-4 border-t border-border-secondary mt-auto">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <Link
                  href="/legal/privacy"
                  className="text-xs text-fg-tertiary hover:text-fg-secondary transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-fg-quaternary">·</span>
                <Link
                  href="/legal/terms"
                  className="text-xs text-fg-tertiary hover:text-fg-secondary transition-colors"
                >
                  Terms of Service
                </Link>
                <span className="text-fg-quaternary">·</span>
                <a 
                  href="https://opensession.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-fg-tertiary hover:text-fg-secondary transition-colors inline-flex items-center gap-1"
                >
                  opensession.co
                  <LinkExternal01 className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
