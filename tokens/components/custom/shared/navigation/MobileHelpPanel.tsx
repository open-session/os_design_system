'use client';

import { motion } from 'motion/react';
import { ArrowLeft, BookOpen01 as BookOpen, ChevronRight, Heart, LinkExternal01, File01 as FileText, PlayCircle, LifeBuoy01 as LifeBuoy } from '@untitledui-pro/icons/line';
import { useMobileMenu } from '@/lib/mobile-menu-context';
import { devProps } from '@/lib/utils/dev-props';

const helpMenuItems = [
  {
    id: 'blogs',
    label: 'Blogs',
    description: 'Latest industry news and guides',
    icon: FileText,
    external: false,
  },
  {
    id: 'customer-stories',
    label: 'Customer Stories',
    description: 'How customers use our platform',
    icon: Heart,
    external: false,
  },
  {
    id: 'video-tutorials',
    label: 'Video Tutorials',
    description: 'Get up and running quickly',
    icon: PlayCircle,
    external: true,
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'In-depth articles and guides',
    icon: BookOpen,
    external: true,
  },
  {
    id: 'help-support',
    label: 'Help and Support',
    description: 'Our team is here to help',
    icon: LifeBuoy,
    external: false,
  },
];

export function MobileHelpPanel() {
  const { activePanel, closePanel, closeAll } = useMobileMenu();
  
  const isOpen = activePanel === 'help';

  if (!isOpen) return null;

  return (
    <motion.div
      {...devProps('MobileHelpPanel')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 top-14 z-[70] bg-bg-primary lg:hidden overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-secondary bg-bg-secondary">
        <button
          onClick={closePanel}
          className="
            flex items-center justify-center
            w-10 h-10 -ml-2
            rounded-lg
            text-fg-tertiary hover:text-fg-primary
            hover:bg-bg-tertiary
            transition-colors
          "
          aria-label="Back to menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-fg-primary">Need help?</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Menu Items */}
        <div className="px-4 py-4">
          <div className="bg-bg-secondary rounded-xl border border-border-secondary overflow-hidden">
            {helpMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    // Handle navigation - in real app, this would navigate or open external link
                    closeAll();
                  }}
                  className={`
                    w-full flex items-center gap-3
                    px-4 py-3.5
                    text-left
                    hover:bg-bg-tertiary
                    active:bg-bg-quaternary
                    transition-colors
                    ${index !== helpMenuItems.length - 1 ? 'border-b border-border-secondary' : ''}
                  `}
                >
                  <div className="
                    w-10 h-10 rounded-lg
                    bg-bg-tertiary
                    border border-border-secondary
                    flex items-center justify-center
                    flex-shrink-0
                  ">
                    <Icon className="w-5 h-5 text-fg-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-fg-tertiary truncate">
                      {item.description}
                    </p>
                  </div>
                  {item.external ? (
                    <LinkExternal01 className="w-4 h-4 text-fg-quaternary flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-fg-quaternary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="px-4 pb-8">
          <button
            onClick={() => {
              // Handle contact - in real app, open contact form or email
              closeAll();
            }}
            className="
              w-full flex items-center justify-center
              px-4 py-3
              bg-bg-secondary
              hover:bg-bg-brand-primary
              active:bg-bg-brand-primary
              text-fg-brand-primary
              text-sm font-medium
              rounded-lg
              border border-border-brand
              transition-colors
            "
          >
            Contact us
          </button>
        </div>
      </div>
    </motion.div>
  );
}

