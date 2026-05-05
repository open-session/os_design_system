'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  LayersTwo01,
  Loading01,
  Plus,
  XClose,
} from '@untitledui-pro/icons/line';
import { useChatContext, type SpaceOption } from '@/lib/chat-context';
import { devProps } from '@/lib/utils/dev-props';

interface AddToSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  chatTitle?: string;
}

export function AddToSpaceModal({
  isOpen,
  onClose,
  chatId,
  chatTitle,
}: AddToSpaceModalProps) {
  const { spaces, loadSpaces, createSpace, assignChatToSpace } = useChatContext();
  const [selectedSpace, setSelectedSpace] = useState<SpaceOption | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load spaces when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSpaces();
    }
  }, [isOpen, loadSpaces]);

  // Focus input when creating
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) return;

    setIsLoading(true);
    try {
      const space = createSpace(newSpaceName.trim());
      if (space) {
        setSelectedSpace(space);
        setNewSpaceName('');
        setIsCreating(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSpace) return;

    setIsSaving(true);
    try {
      await assignChatToSpace(chatId, selectedSpace.slug);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateSpace();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewSpaceName('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div {...devProps('AddToSpaceModal')} className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-md mx-4 bg-bg-secondary rounded-xl border border-border-primary shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-brand-primary flex items-center justify-center">
                  <LayersTwo01 className="w-5 h-5 text-fg-brand-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-fg-primary">
                    Add to Space
                  </h2>
                  {chatTitle && (
                    <p className="text-xs text-fg-tertiary truncate max-w-[200px]">
                      {chatTitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg-tertiary text-fg-tertiary hover:text-fg-primary transition-colors"
              >
                <XClose className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-sm text-fg-secondary mb-4">
                Select a space to add this conversation to:
              </p>

              {/* Space list */}
              <div className="space-y-1 max-h-64 overflow-y-auto mb-4">
                {spaces.length === 0 && !isCreating && (
                  <div className="py-8 text-center">
                    <LayersTwo01 className="w-8 h-8 mx-auto mb-2 text-fg-quaternary" />
                    <p className="text-sm text-fg-tertiary">No spaces yet</p>
                    <p className="text-xs text-fg-quaternary mt-1">
                      Create your first space below
                    </p>
                  </div>
                )}

                {spaces.map((space) => {
                  const isSelected = selectedSpace?.id === space.id;
                  return (
                    <button
                      key={space.id}
                      onClick={() => setSelectedSpace(space)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                        text-left transition-colors
                        ${isSelected
                          ? 'bg-bg-brand-primary text-fg-brand-primary'
                          : 'hover:bg-bg-tertiary text-fg-primary'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        {space.icon ? (
                          <span className="text-base">{space.icon}</span>
                        ) : (
                          <LayersTwo01 className="w-4 h-4 text-fg-tertiary" />
                        )}
                        <span className="text-sm font-medium">{space.title}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  );
                })}

                {/* Create new space */}
                {isCreating ? (
                  <div className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Space name..."
                        className="flex-1 px-3 py-2 text-sm bg-bg-tertiary border border-border-primary rounded-lg text-fg-primary placeholder:text-fg-quaternary focus:outline-hidden focus:border-border-brand-solid"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleCreateSpace}
                        disabled={!newSpaceName.trim() || isLoading}
                        className="p-2 rounded-lg text-fg-brand-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <Loading01 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setNewSpaceName('');
                        }}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-primary"
                      >
                        <XClose className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Create new space</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border-primary bg-bg-tertiary">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedSpace || isSaving}
                className="px-4 py-2 text-sm font-medium bg-bg-brand-solid text-fg-white rounded-lg hover:bg-bg-brand-solid-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Adding...' : 'Add to Space'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

