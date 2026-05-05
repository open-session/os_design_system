'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Link01 as LinkIcon, XClose } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface ProjectInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

export function ProjectInstructionsModal({
  isOpen,
  onClose,
  projectName,
  initialContent,
  onSave,
}: ProjectInstructionsModalProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
        // Place cursor at end
        textareaRef.current?.setSelectionRange(content.length, content.length);
      }, 100);
    }
  }, [isOpen, content.length]);

  // Reset content when modal opens with new initial content
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave(content);
      onClose();
    } catch (error) {
      console.error('Error saving instructions:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // Allow Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  // Don't render on server
  if (typeof window === 'undefined') return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 z-[9999]"
            onClick={onClose}
          />

          {/* Centering container - uses flexbox, not transforms */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              {...devProps('ProjectInstructionsModal')}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="
                w-full max-w-2xl
                max-h-[calc(100vh-64px)]
                bg-bg-secondary
                border border-border-primary
                rounded-xl
                shadow-2xl
                flex flex-col
                overflow-hidden
                pointer-events-auto
              "
              onKeyDown={handleKeyDown}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-secondary flex-shrink-0">
                <h2 className="text-lg font-semibold text-fg-primary">
                  Set project instructions
                </h2>
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="
                    p-2 rounded-lg
                    text-fg-tertiary
                    hover:text-fg-primary
                    hover:bg-bg-tertiary
                    transition-colors
                    disabled:opacity-50
                  "
                >
                  <XClose className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Description */}
                <p className="text-sm text-fg-secondary mb-4">
                  Provide Claude with relevant instructions and information for chats within{' '}
                  <span className="font-medium text-fg-primary">{projectName}</span>.
                  This will work alongside{' '}
                  <button className="
                    inline-flex items-center gap-1
                    text-fg-brand-primary
                    hover:underline
                  ">
                    user preferences
                    <LinkIcon className="w-3 h-3" />
                  </button>
                  {' '}and the selected style in a chat.
                </p>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Break down large tasks and ask clarifying questions when needed."
                  disabled={isSaving}
                  className="
                    w-full h-64
                    px-4 py-3
                    bg-bg-primary
                    border border-border-secondary
                    rounded-lg
                    text-sm text-fg-primary
                    placeholder:text-fg-quaternary
                    focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
                    transition-all
                    resize-none
                    disabled:opacity-50
                  "
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-secondary bg-bg-tertiary flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="
                    px-4 py-2
                    text-sm font-medium
                    text-fg-secondary
                    hover:text-fg-primary
                    hover:bg-bg-tertiary
                    rounded-lg
                    transition-colors
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="
                    px-4 py-2
                    text-sm font-medium
                    bg-bg-brand-solid
                    text-white
                    rounded-lg
                    hover:bg-bg-brand-solid/90
                    transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isSaving ? 'Saving...' : 'Save instructions'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Render using portal to document.body
  return createPortal(modalContent, document.body);
}
