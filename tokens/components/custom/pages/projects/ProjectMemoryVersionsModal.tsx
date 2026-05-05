'use client';

import { useState, useEffect } from 'react';
import { ModalOverlay, Modal, Dialog } from 'react-aria-components';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Edit01,
  RefreshCcw01,
  Trash01,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { projectsService } from '@/lib/supabase/projects-service';
import type { ProjectMemoryVersion } from '@/lib/supabase/projects-service';

interface ProjectMemoryVersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryId: string;
  memoryKey: string;
  onDeleted: () => void;
}

type ChangeType = 'Created' | 'Edited' | 'Reverted';

function getChangeType(index: number, total: number): ChangeType {
  if (index === total - 1) return 'Created';
  // The service records a version on revert — we infer "Reverted" heuristically
  // (no explicit type in DB), so we call everything after the first "Edited"
  return 'Edited';
}

interface VersionRowProps {
  version: ProjectMemoryVersion;
  index: number;
  total: number;
  isCurrent: boolean;
  isReverting: boolean;
  onRevert: (versionId: string) => void;
}

function VersionRow({ version, index, total, isCurrent, isReverting, onRevert }: VersionRowProps) {
  const changeType = getChangeType(index, total);
  const badgeClasses: Record<ChangeType, string> = {
    Created: 'bg-bg-success-secondary text-fg-success-primary',
    Edited: 'bg-bg-secondary text-fg-tertiary',
    Reverted: 'bg-bg-warning-secondary text-fg-warning-primary',
  };

  return (
    <div
      {...devProps('VersionRow')}
      className={`p-3 rounded-lg border transition-colors ${isCurrent ? 'border-border-primary bg-bg-primary' : 'border-border-secondary bg-bg-primary'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${badgeClasses[changeType]}`}>
              {isCurrent ? 'Current' : changeType}
            </span>
            <span className="text-[10px] text-fg-quaternary">
              {new Date(version.created_at ?? '').toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-fg-secondary leading-relaxed line-clamp-3">{version.value}</p>
        </div>
        {!isCurrent && (
          <button
            onClick={() => onRevert(version.id)}
            disabled={isReverting}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-fg-brand-primary hover:bg-bg-tertiary transition-colors disabled:opacity-50"
          >
            <RefreshCcw01 className="w-3 h-3" />
            Revert
          </button>
        )}
      </div>
    </div>
  );
}

export function ProjectMemoryVersionsModal({
  isOpen,
  onClose,
  memoryId,
  memoryKey,
  onDeleted,
}: ProjectMemoryVersionsModalProps) {
  const [versions, setVersions] = useState<ProjectMemoryVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit state: null = not editing, string = textarea value
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Revert state
  const [isReverting, setIsReverting] = useState(false);
  const [revertError, setRevertError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !memoryId) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await projectsService.getMemoryVersions(memoryId);
        if (!cancelled) setVersions(data);
      } catch {
        if (!cancelled) setError('Failed to load version history.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isOpen, memoryId]);

  const handleRevert = async (versionId: string) => {
    setIsReverting(true);
    setRevertError(null);
    try {
      const updated = await projectsService.revertMemoryToVersion(memoryId, versionId);
      if (!updated) throw new Error('Revert failed');
      // Refresh versions
      const refreshed = await projectsService.getMemoryVersions(memoryId);
      setVersions(refreshed);
    } catch {
      setRevertError('Failed to revert. Please try again.');
    } finally {
      setIsReverting(false);
    }
  };

  const handleEdit = async () => {
    if (editingValue === null) return;
    setSaveError(null);
    setIsSaving(true);
    try {
      const updated = await projectsService.updateMemoryEntry(memoryId, editingValue.trim());
      if (!updated) throw new Error('Save failed');
      setEditingValue(null);
      const refreshed = await projectsService.getMemoryVersions(memoryId);
      setVersions(refreshed);
    } catch {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      const ok = await projectsService.deleteMemoryEntry(memoryId);
      if (!ok) throw new Error('Delete failed');
      onDeleted();
      onClose();
    } catch {
      setDeleteError('Failed to delete. Please try again.');
      setIsDeleting(false);
    }
  };

  const currentVersion = versions[0] ?? null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <Modal className="bg-bg-secondary border border-border-secondary rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col overflow-hidden">
        <Dialog className="flex flex-col h-full outline-hidden" {...devProps('ProjectMemoryVersionsModal')}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-secondary flex-shrink-0">
            <div>
              <h2 className="text-base font-semibold text-fg-primary">Version history</h2>
              <p className="text-xs text-fg-tertiary mt-0.5">Editing: {memoryKey}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors"
              aria-label="Close"
            >
              <XClose className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {isLoading && (
              <div className="text-center py-8">
                <p className="text-sm text-fg-tertiary">Loading versions...</p>
              </div>
            )}

            {!isLoading && error && (
              <div className="text-center py-8">
                <p className="text-sm text-fg-error-primary">{error}</p>
              </div>
            )}

            {!isLoading && !error && versions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-fg-tertiary">No history yet.</p>
              </div>
            )}

            {!isLoading && !error && versions.length > 0 && (
              <>
                {/* Current version with inline edit */}
                {currentVersion && (
                  <div className="p-3 rounded-lg border border-border-primary bg-bg-primary">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-success-secondary text-fg-success-primary">
                        Current
                      </span>
                      <span className="text-[10px] text-fg-quaternary">
                        {new Date(currentVersion.created_at ?? '').toLocaleString()}
                      </span>
                    </div>

                    <AnimatePresence mode="wait">
                      {editingValue !== null ? (
                        <motion.div
                          key="editing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <textarea
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            rows={4}
                            disabled={isSaving}
                            className="w-full px-3 py-2 rounded-md bg-bg-secondary border border-border-secondary text-xs text-fg-primary focus:outline-hidden focus:ring-1 focus:ring-fg-brand-primary focus:border-fg-brand-primary resize-none disabled:opacity-50"
                            autoFocus
                          />
                          {saveError && (
                            <p className="text-[11px] text-fg-error-primary mt-1">{saveError}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 justify-end">
                            <button
                              onClick={() => { setEditingValue(null); setSaveError(null); }}
                              disabled={isSaving}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors disabled:opacity-50"
                            >
                              <XClose className="w-3 h-3" />
                              Cancel
                            </button>
                            <button
                              onClick={handleEdit}
                              disabled={!editingValue.trim() || isSaving}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-fg-brand-primary text-white hover:bg-fg-brand-secondary transition-colors disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="display"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                          className="flex items-start justify-between gap-3"
                        >
                          <p className="text-xs text-fg-secondary leading-relaxed line-clamp-3 flex-1">
                            {currentVersion.value}
                          </p>
                          <button
                            onClick={() => setEditingValue(currentVersion.value)}
                            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors"
                          >
                            <Edit01 className="w-3 h-3" />
                            Edit
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Past versions */}
                {versions.slice(1).map((version, idx) => (
                  <VersionRow
                    key={version.id}
                    version={version}
                    index={idx + 1}
                    total={versions.length}
                    isCurrent={false}
                    isReverting={isReverting}
                    onRevert={handleRevert}
                  />
                ))}

                {revertError && (
                  <p className="text-xs text-fg-error-primary text-center">{revertError}</p>
                )}
              </>
            )}
          </div>

          {/* Footer — Delete entry */}
          <div className="flex-shrink-0 px-5 py-3 border-t border-border-secondary">
            <AnimatePresence mode="wait">
              {confirmDelete ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-xs text-fg-primary">Delete this memory entry permanently?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setConfirmDelete(false); setDeleteError(null); }}
                      disabled={isDeleting}
                      className="text-xs text-fg-tertiary hover:text-fg-primary px-2 py-1 rounded-md hover:bg-bg-tertiary transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-xs text-fg-error-primary hover:text-red-600 px-2 py-1 rounded-md hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm delete'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="delete-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {deleteError && (
                    <p className="text-[11px] text-fg-error-primary mb-2">{deleteError}</p>
                  )}
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 text-xs text-fg-error-primary hover:text-red-600 transition-colors"
                  >
                    <Trash01 className="w-3.5 h-3.5" />
                    Delete entry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
