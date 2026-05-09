'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Folder,
  LayersTwo01,
  Loading01,
  SwitchHorizontal01,
  User01,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { chatService } from '@/lib/supabase/chat-service';
import type { Project } from '@/lib/supabase/projects-service';
import type { SpaceOption } from '@/lib/chat-context';

// ============================================================
// Types
// ============================================================

type Destination =
  | { type: 'personal' }
  | { type: 'project'; project: Project }
  | { type: 'space'; space: SpaceOption };

interface MoveToContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  chatTitle: string;
  // Current context of the chat being moved
  currentProjectId?: string | null;
  currentSpaceSlug?: string | null;
  // Available destinations
  projects: Project[];
  spaces: SpaceOption[];
  // Called after a successful move so the parent can refresh
  onMoveSuccess: () => void;
}

// ============================================================
// Helpers
// ============================================================

function isSameDestination(
  dest: Destination,
  currentProjectId?: string | null,
  currentSpaceSlug?: string | null
): boolean {
  if (dest.type === 'personal') {
    return !currentProjectId && !currentSpaceSlug;
  }
  if (dest.type === 'project') {
    return dest.project.id === currentProjectId && !currentSpaceSlug;
  }
  if (dest.type === 'space') {
    return dest.space.slug === currentSpaceSlug && !currentProjectId;
  }
  return false;
}

function requiresConfirmation(
  dest: Destination,
  currentSpaceSlug?: string | null
): boolean {
  // Confirmation needed when moving to a space (visibility expands) or away from a space
  const isCurrentlyInSpace = !!currentSpaceSlug;
  const isMovingToSpace = dest.type === 'space';
  return isMovingToSpace || isCurrentlyInSpace;
}

// ============================================================
// Section header sub-component
// ============================================================

function SectionHeader({ label }: { label: string }) {
  return (
    <p {...devProps('SectionHeader')} className="text-xs font-medium text-fg-tertiary uppercase tracking-wide px-4 pt-3 pb-1">
      {label}
    </p>
  );
}

// ============================================================
// Main component
// ============================================================

export function MoveToContextModal({
  isOpen,
  onClose,
  chatId,
  chatTitle,
  currentProjectId,
  currentSpaceSlug,
  projects,
  spaces,
  onMoveSuccess,
}: MoveToContextModalProps) {
  // 'select' = destination list, 'confirm' = space visibility confirmation
  const [view, setView] = useState<'select' | 'confirm'>('select');
  const [pendingDestination, setPendingDestination] = useState<Destination | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset internal state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setView('select');
      setPendingDestination(null);
      setIsSaving(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'confirm') {
          setView('select');
          setPendingDestination(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, view, onClose]);

  const handleSelectDestination = (dest: Destination) => {
    // No-op if selecting current destination
    if (isSameDestination(dest, currentProjectId, currentSpaceSlug)) return;

    setErrorMessage(null);

    if (requiresConfirmation(dest, currentSpaceSlug)) {
      setPendingDestination(dest);
      setView('confirm');
    } else {
      // Personal ↔ project — commit immediately
      void executeMove(dest);
    }
  };

  const executeMove = async (dest: Destination) => {
    setIsSaving(true);
    setErrorMessage(null);

    let projectId: string | null = null;
    let spaceId: string | null = null;

    if (dest.type === 'project') {
      projectId = dest.project.id;
    } else if (dest.type === 'space') {
      spaceId = dest.space.id;
    }
    // personal: both remain null

    const success = await chatService.transferChatContext(chatId, { projectId, spaceId });

    setIsSaving(false);

    if (success) {
      onMoveSuccess();
      onClose();
    } else {
      setErrorMessage('Failed to move the chat. Please try again.');
    }
  };

  const handleConfirm = () => {
    if (!pendingDestination) return;
    void executeMove(pendingDestination);
  };

  const handleCancelConfirm = () => {
    setView('select');
    setPendingDestination(null);
  };

  // Build confirmation message copy
  const confirmationText = (): { body: string; action: string } => {
    if (!pendingDestination) return { body: '', action: 'Move' };

    if (pendingDestination.type === 'space') {
      return {
        body: `Moving this chat to "${pendingDestination.space.title}" will make it visible to all space members.`,
        action: `Move to ${pendingDestination.space.title}`,
      };
    }

    // Moving away from a space
    const spaceName = spaces.find((s) => s.slug === currentSpaceSlug)?.title ?? 'this space';

    if (pendingDestination.type === 'personal') {
      return {
        body: `This chat will no longer be visible to ${spaceName} members.`,
        action: 'Move to Personal',
      };
    }

    return {
      body: `This chat will no longer be visible to ${spaceName} members.`,
      action: `Move to ${pendingDestination.project.name}`,
    };
  };

  // Don't render on server
  if (typeof window === 'undefined') return null;

  const { body: confirmBody, action: confirmAction } = confirmationText();

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
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={isSaving ? undefined : onClose}
          />

          {/* Centering container */}
          <div
            {...devProps('MoveToContextModal')}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm max-h-[calc(100vh-64px)] bg-bg-secondary border border-border-primary rounded-xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-secondary flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center">
                    <SwitchHorizontal01 className="w-4 h-4 text-fg-brand-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-fg-primary">Move to...</h2>
                    <p className="text-xs text-fg-tertiary truncate max-w-[180px]">{chatTitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="p-1.5 rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors disabled:opacity-50"
                >
                  <XClose className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto relative">
                {/* Loading overlay */}
                {isSaving && (
                  <div className="absolute inset-0 bg-bg-secondary/80 flex items-center justify-center z-10">
                    <Loading01 className="w-6 h-6 text-fg-brand-primary animate-spin" />
                  </div>
                )}

                {/* Error message */}
                {errorMessage && (
                  <div className="mx-4 mt-3 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg">
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  </div>
                )}

                {/* ---- SELECT VIEW ---- */}
                {view === 'select' && (
                  <>
                    {/* Personal */}
                    <SectionHeader label="Personal" />
                    <DestinationRow
                      icon={<User01 className="w-4 h-4 text-fg-tertiary" />}
                      label="Personal"
                      isCurrent={isSameDestination({ type: 'personal' }, currentProjectId, currentSpaceSlug)}
                      disabled={isSaving}
                      onClick={() => handleSelectDestination({ type: 'personal' })}
                    />

                    {/* Projects */}
                    <SectionHeader label="Projects" />
                    {projects.length === 0 ? (
                      <p className="text-xs text-fg-quaternary px-4 pb-3">No projects yet.</p>
                    ) : (
                      projects.map((project) => {
                        const isCurrent = isSameDestination({ type: 'project', project }, currentProjectId, currentSpaceSlug);
                        return (
                          <DestinationRow
                            key={project.id}
                            icon={
                              project.color ? (
                                <span
                                  className="w-3.5 h-3.5 rounded-sm flex-shrink-0 block"
                                  style={{ backgroundColor: project.color }}
                                />
                              ) : (
                                <Folder className="w-4 h-4 text-fg-tertiary" />
                              )
                            }
                            label={project.name}
                            isCurrent={isCurrent}
                            disabled={isSaving}
                            onClick={() => handleSelectDestination({ type: 'project', project })}
                          />
                        );
                      })
                    )}

                    {/* Spaces */}
                    <SectionHeader label="Spaces" />
                    {spaces.length === 0 ? (
                      <p className="text-xs text-fg-quaternary px-4 pb-3">No spaces yet.</p>
                    ) : (
                      spaces.map((space) => {
                        const isCurrent = isSameDestination({ type: 'space', space }, currentProjectId, currentSpaceSlug);
                        return (
                          <DestinationRow
                            key={space.id}
                            icon={
                              space.icon ? (
                                <span className="text-base leading-none">{space.icon}</span>
                              ) : (
                                <LayersTwo01 className="w-4 h-4 text-fg-tertiary" />
                              )
                            }
                            label={space.title}
                            isCurrent={isCurrent}
                            disabled={isSaving}
                            onClick={() => handleSelectDestination({ type: 'space', space })}
                          />
                        );
                      })
                    )}

                    {/* Bottom padding */}
                    <div className="pb-2" />
                  </>
                )}

                {/* ---- CONFIRM VIEW ---- */}
                {view === 'confirm' && (
                  <div className="px-5 py-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-fg-primary leading-relaxed">{confirmBody}</p>
                      <p className="text-sm text-fg-secondary">Continue?</p>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={handleCancelConfirm}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium bg-bg-brand-solid text-white rounded-lg hover:bg-bg-brand-solid-hover disabled:opacity-50 transition-colors"
                      >
                        {isSaving ? (
                          <span className="flex items-center gap-2">
                            <Loading01 className="w-4 h-4 animate-spin" />
                            Moving...
                          </span>
                        ) : (
                          confirmAction
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

// ============================================================
// DestinationRow sub-component
// ============================================================

interface DestinationRowProps {
  icon: React.ReactNode;
  label: string;
  isCurrent: boolean;
  disabled: boolean;
  onClick: () => void;
}

function DestinationRow({ icon, label, isCurrent, disabled, onClick }: DestinationRowProps) {
  return (
    <button
      {...devProps('DestinationRow')}
      type="button"
      onClick={onClick}
      disabled={disabled || isCurrent}
      className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors duration-quick disabled:cursor-default ${
        isCurrent
          ? 'bg-bg-brand-primary text-fg-brand-primary'
          : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary disabled:opacity-50'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon}
        <span className="text-sm truncate">{label}</span>
      </div>
      {isCurrent && <Check className="w-4 h-4 text-fg-brand-primary flex-shrink-0" />}
    </button>
  );
}
