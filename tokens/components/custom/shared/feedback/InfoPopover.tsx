'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InfoCircle } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface InfoPopoverProps {
  title: string;
  description: string;
}

export function InfoPopover({ title, description }: InfoPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div {...devProps('InfoPopover')} className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Learn more"
        className={`flex items-center justify-center w-9 h-9 rounded-md text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-all duration-quick cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-fg-brand-primary ${
          isOpen ? 'bg-bg-tertiary text-fg-primary' : ''
        }`}
      >
        <InfoCircle className="w-[18px] h-[18px]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full right-0 mt-2
              w-72
              bg-bg-secondary
              rounded-lg
              border border-border-secondary
              shadow-lg
              z-[200]
              p-4
              origin-top-right
            "
          >
            <p className="text-sm font-medium text-fg-primary mb-1">{title}</p>
            <p className="text-xs text-fg-secondary leading-relaxed">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
