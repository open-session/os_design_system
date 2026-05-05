'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { DotIcon } from '@/components/custom/shared/loaders/dot-icon';

interface HelpDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  allTriggerRefs?: React.RefObject<HTMLButtonElement | null>[];
}

const helpMenuItems = [
  {
    id: 'blogs',
    label: 'Blogs',
    animationKey: 'blogs',
    description: 'Latest industry news and guides',
  },
  {
    id: 'customer-stories',
    label: 'Customer Stories',
    animationKey: 'customer-stories',
    description: 'How customers use our platform',
  },
  {
    id: 'video-tutorials',
    label: 'Video Tutorials',
    animationKey: 'video-tutorials',
    description: 'Get up and running quickly',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    animationKey: 'documentation',
    description: 'In-depth articles and guides',
  },
  {
    id: 'help-support',
    label: 'Help and Support',
    animationKey: 'help-support',
    description: 'Our team is here to help',
  },
];

function HelpMenuItem({
  item,
  onClose,
}: {
  item: (typeof helpMenuItems)[number];
  onClose: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      {...devProps('HelpMenuItem')}
      onClick={() => {
        onClose();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        w-full flex items-center gap-3
        px-4 py-3
        text-left
        hover:bg-bg-tertiary
        transition-colors
      "
    >
      <DotIcon animationKey={item.animationKey} isHovered={isHovered} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-fg-primary">{item.label}</span>
        <span className="text-xs text-fg-tertiary">{item.description}</span>
      </div>
    </button>
  );
}

export function HelpDropdown({ isOpen, onClose, triggerRef, allTriggerRefs }: HelpDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            ref={dropdownRef}
            {...devProps('HelpDropdown')}
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
                  Need help?
                </h3>
              </div>
            </div>

          {/* Menu Items */}
          <div className="py-1">
            {helpMenuItems.map((item) => (
              <HelpMenuItem key={item.id} item={item} onClose={onClose} />
            ))}
          </div>

          {/* Contact Section */}
          <div className="border-t border-border-secondary px-4 py-3">
            <button
              onClick={() => {
                // Handle contact link - in real app, open contact form or email
                onClose();
              }}
              className="
                w-full flex items-center justify-center
                px-4 py-2.5
                bg-bg-secondary
                hover:bg-bg-brand-primary
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
          </motion.div>
      )}
    </AnimatePresence>
  );
}

