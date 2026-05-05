'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  ClockFastForward,
  ClockRewind,
  Code01,
  GitBranch01,
  RefreshCcw01,
  User01,
  XClose,
} from '@untitledui-pro/icons/line';
// UUI fallback: History → ClockFastForward, GitBranch → GitBranch01, Diff → Code01
import type { BrandDocumentVersion } from '@/lib/supabase/types';
import { devProps } from '@/lib/utils/dev-props';

interface VersionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  currentContent: string;
  onRestore: (versionNumber: number) => Promise<void>;
}

export function VersionHistoryPanel({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  currentContent,
  onRestore,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<BrandDocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<BrandDocumentVersion | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  // Fetch version history
  useEffect(() => {
    if (isOpen && documentId) {
      fetchVersions();
    }
  }, [isOpen, documentId]);

  const fetchVersions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/brain/versions?documentId=${documentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch version history');
      }
      const data = await response.json();
      setVersions(data);
      
      // Auto-select latest version
      if (data.length > 0 && !selectedVersion) {
        setSelectedVersion(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    
    setIsRestoring(true);
    setError(null);

    try {
      await onRestore(selectedVersion.versionNumber);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore version');
    } finally {
      setIsRestoring(false);
    }
  };

  const toggleVersionExpand = (versionId: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(versionId)) {
        next.delete(versionId);
      } else {
        next.add(versionId);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(dateString);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          {...devProps('VersionHistoryPanel')}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-bg-primary border border-border-primary shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
            <div>
              <h2 className="text-lg font-display font-semibold text-fg-primary">
                Version History
              </h2>
              <p className="text-sm text-fg-tertiary">{documentTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <XClose className="w-5 h-5 text-fg-tertiary" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Version List */}
            <div className="w-80 border-r border-border-primary flex flex-col">
              <div className="p-4 border-b border-border-primary">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-fg-secondary">
                    {versions.length} version{versions.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setShowDiff(!showDiff)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      showDiff
                        ? 'bg-bg-brand-subtle text-fg-brand-primary'
                        : 'text-fg-tertiary hover:text-fg-secondary hover:bg-bg-secondary'
                    }`}
                  >
                    <Code01 className="w-3.5 h-3.5" />
                    Show Diff
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12 text-fg-tertiary">
                    <span className="animate-spin mr-2">⟳</span>
                    Loading...
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <AlertCircle className="w-8 h-8 text-fg-error-primary mb-2" />
                    <p className="text-sm text-fg-error-primary">{error}</p>
                  </div>
                ) : versions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <GitBranch01 className="w-8 h-8 text-fg-tertiary mb-2" />
                    <p className="text-sm text-fg-tertiary">No version history yet</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {versions.map((version, index) => (
                      <VersionItem
                        key={version.id}
                        version={version}
                        isSelected={selectedVersion?.id === version.id}
                        isLatest={index === 0}
                        isExpanded={expandedVersions.has(version.id)}
                        onSelect={() => setSelectedVersion(version)}
                        onToggleExpand={() => toggleVersionExpand(version.id)}
                        getRelativeTime={getRelativeTime}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Version Preview */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedVersion ? (
                <>
                  <div className="p-4 border-b border-border-primary flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-fg-primary">
                          Version {selectedVersion.versionNumber}
                        </span>
                        {versions[0]?.id === selectedVersion.id && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-bg-success-subtle text-fg-success-primary">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-fg-tertiary mt-0.5">
                        {formatDate(selectedVersion.createdAt)}
                        {selectedVersion.changeSummary && ` • ${selectedVersion.changeSummary}`}
                      </p>
                    </div>
                    {versions[0]?.id !== selectedVersion.id && (
                      <button
                        onClick={handleRestore}
                        disabled={isRestoring}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-brand-solid text-fg-white hover:bg-bg-brand-solid-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        {isRestoring ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <RefreshCcw01 className="w-3.5 h-3.5" />
                        )}
                        Restore This Version
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-auto custom-scrollbar p-4">
                    {showDiff && versions[0]?.id !== selectedVersion.id ? (
                      <DiffView
                        oldContent={selectedVersion.content}
                        newContent={currentContent}
                      />
                    ) : (
                      <pre className="text-sm font-mono text-fg-secondary whitespace-pre-wrap">
                        {selectedVersion.content}
                      </pre>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-fg-tertiary">
                  Select a version to preview
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Version list item component
interface VersionItemProps {
  version: BrandDocumentVersion;
  isSelected: boolean;
  isLatest: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  getRelativeTime: (date: string) => string;
}

function VersionItem({
  version,
  isSelected,
  isLatest,
  isExpanded,
  onSelect,
  onToggleExpand,
  getRelativeTime,
}: VersionItemProps) {
  return (
    <div
      {...devProps('VersionItem')}
      className={`mb-1 rounded-lg overflow-hidden transition-colors ${
        isSelected
          ? 'bg-bg-brand-subtle border border-border-brand'
          : 'hover:bg-bg-secondary border border-transparent'
      }`}
    >
      <button
        onClick={onSelect}
        className="w-full p-3 text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isLatest 
                ? 'bg-fg-success-primary' 
                : 'bg-fg-tertiary'
            }`} />
            <span className="text-sm font-medium text-fg-primary">
              v{version.versionNumber}
            </span>
            {isLatest && (
              <Check className="w-3.5 h-3.5 text-fg-success-primary" />
            )}
          </div>
          <span className="text-xs text-fg-tertiary">
            {getRelativeTime(version.createdAt)}
          </span>
        </div>

        {version.changeSummary && (
          <p className="text-xs text-fg-secondary mt-1.5 ml-4 line-clamp-2">
            {version.changeSummary}
          </p>
        )}

        {version.createdBy && (
          <div className="flex items-center gap-1 mt-1.5 ml-4 text-xs text-fg-tertiary">
            <User01 className="w-3 h-3" />
            {version.createdBy}
          </div>
        )}
      </button>

      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="w-full px-3 pb-2 flex items-center gap-1 text-xs text-fg-tertiary hover:text-fg-secondary"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          {isExpanded ? 'Hide details' : 'Show details'}
        </button>
      )}

      {isSelected && isExpanded && (
        <div className="px-3 pb-3">
          <div className="p-2 rounded bg-bg-tertiary text-xs">
            <div className="flex items-center gap-2 text-fg-tertiary">
              <Clock className="w-3 h-3" />
              <span>{new Date(version.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-fg-tertiary mt-1">
              <span className="text-fg-quaternary">
                {version.content.length.toLocaleString()} characters
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple diff view component
interface DiffViewProps {
  oldContent: string;
  newContent: string;
}

function DiffView({ oldContent, newContent }: DiffViewProps) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  
  // Simple line-by-line diff
  const maxLines = Math.max(oldLines.length, newLines.length);
  const diffLines: Array<{ type: 'same' | 'added' | 'removed' | 'changed'; old?: string; new?: string }> = [];

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === newLine) {
      diffLines.push({ type: 'same', old: oldLine, new: newLine });
    } else if (oldLine === undefined) {
      diffLines.push({ type: 'added', new: newLine });
    } else if (newLine === undefined) {
      diffLines.push({ type: 'removed', old: oldLine });
    } else {
      diffLines.push({ type: 'changed', old: oldLine, new: newLine });
    }
  }

  return (
    <div {...devProps('DiffView')} className="text-sm font-mono">
      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40" />
          <span className="text-fg-tertiary">Removed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/40" />
          <span className="text-fg-tertiary">Added</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/40" />
          <span className="text-fg-tertiary">Changed</span>
        </div>
      </div>

      <div className="space-y-0.5">
        {diffLines.map((line, index) => (
          <div key={index}>
            {line.type === 'same' && (
              <div className="py-0.5 px-2 text-fg-tertiary">
                {line.old || ' '}
              </div>
            )}
            {line.type === 'removed' && (
              <div className="py-0.5 px-2 bg-red-500/10 text-red-400 border-l-2 border-red-500">
                - {line.old}
              </div>
            )}
            {line.type === 'added' && (
              <div className="py-0.5 px-2 bg-green-500/10 text-green-400 border-l-2 border-green-500">
                + {line.new}
              </div>
            )}
            {line.type === 'changed' && (
              <>
                <div className="py-0.5 px-2 bg-red-500/10 text-red-400 border-l-2 border-red-500">
                  - {line.old}
                </div>
                <div className="py-0.5 px-2 bg-green-500/10 text-green-400 border-l-2 border-green-500">
                  + {line.new}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VersionHistoryPanel;

