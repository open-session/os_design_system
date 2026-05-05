'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClockRewind,
  Loading01,
  RefreshCcw01,
  Type01,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import {
  getColorHistory,
  saveColorSnapshot,
  type ColorSnapshot,
} from '@/lib/supabase/brand-theme-history-service';
import type { BrandThemeColors } from '@/lib/supabase/types';
import { getCsrfHeaders } from '@/hooks/useCsrf';

// ============================================
// UTILITIES
// ============================================

/**
 * Returns a human-readable relative time string for an ISO timestamp.
 * e.g. "Just now", "5m ago", "3h ago", "2d ago"
 */
function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Returns an absolute date string.
 * e.g. "Feb 22, 2026 at 3:41 PM"
 */
function absoluteTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ============================================
// PROPS
// ============================================

interface ColorVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: string;
  /** Called after a successful revert with the reverted colors */
  onReverted: (colors: BrandThemeColors) => void;
}

// ============================================
// COMPONENT
// ============================================

/**
 * ColorVersionHistory
 *
 * Modal panel showing past color snapshots for a brand theme.
 * Each entry shows relative + absolute timestamps, a swatch strip of
 * the first 5 core colors, and a Revert button with inline confirmation.
 */
export function ColorVersionHistory({
  isOpen,
  onClose,
  themeId,
  onReverted,
}: ColorVersionHistoryProps) {
  const [snapshots, setSnapshots] = useState<ColorSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingRevertId, setPendingRevertId] = useState<string | null>(null);
  const [reverting, setReverting] = useState(false);
  const [revertError, setRevertError] = useState<string | null>(null);
  const [revertSuccess, setRevertSuccess] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!themeId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const history = await getColorHistory(themeId, 20);
      setSnapshots(history);
    } catch {
      setLoadError('Could not load history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [themeId]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    } else {
      // Reset state when closing
      setPendingRevertId(null);
      setRevertError(null);
      setRevertSuccess(false);
    }
  }, [isOpen, loadHistory]);

  const handleRevert = useCallback(
    async (snapshot: ColorSnapshot) => {
      setReverting(true);
      setRevertError(null);

      try {
        // Apply the snapshot via PATCH
        const response = await fetch('/api/brand-themes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
          credentials: 'include',
          body: JSON.stringify({
            id: themeId,
            colors: snapshot.colorsSnapshot,
          }),
        });

        if (!response.ok) {
          throw new Error(`PATCH failed with status ${response.status}`);
        }

        // Capture a new snapshot of the reverted state (non-blocking)
        saveColorSnapshot(themeId, snapshot.colorsSnapshot).catch((err) => {
          console.error('[history] Failed to save post-revert snapshot:', err);
        });

        // Notify parent to update live colors and trigger cascade
        onReverted(snapshot.colorsSnapshot);

        setRevertSuccess(true);
        setPendingRevertId(null);

        // Reload history to show the new snapshot entry
        await loadHistory();

        // Auto-close after brief success indication
        setTimeout(() => {
          setRevertSuccess(false);
          onClose();
        }, 1200);
      } catch {
        setRevertError('Could not revert. Please try again.');
      } finally {
        setReverting(false);
      }
    },
    [themeId, onReverted, onClose, loadHistory]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            {...devProps('ColorVersionHistory')}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[8%] mx-auto max-w-lg max-h-[80vh] rounded-2xl overflow-hidden z-50 bg-bg-primary border border-border-secondary shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-secondary shrink-0">
              <div>
                <h2 className="text-lg font-display font-bold text-fg-primary">
                  Color History
                </h2>
                <p className="text-sm text-fg-tertiary">
                  Browse and revert to previous color configurations
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-lg hover:bg-bg-tertiary text-fg-tertiary hover:text-fg-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Close"
              >
                <XClose className="w-5 h-5" />
              </button>
            </div>

            {/* Success banner */}
            <AnimatePresence>
              {revertSuccess && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 py-2.5 bg-green-500/10 border-b border-green-500/20 text-sm text-green-600 dark:text-green-400 shrink-0"
                >
                  Colors reverted successfully.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Revert error banner */}
            <AnimatePresence>
              {revertError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 py-2.5 bg-red-500/10 border-b border-red-500/20 text-sm text-red-500 shrink-0"
                >
                  {revertError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-fg-tertiary">
                  <Loading01 className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-sm">Loading history…</span>
                </div>
              ) : loadError ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-red-500 mb-3">{loadError}</p>
                  <button
                    onClick={loadHistory}
                    className="text-sm text-fg-brand-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : snapshots.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-fg-tertiary leading-relaxed">
                    No color history yet. Make a change and save to start
                    tracking versions.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-secondary">
                  {snapshots.map((snapshot) => (
                    <SnapshotRow
                      key={snapshot.id}
                      snapshot={snapshot}
                      isPendingRevert={pendingRevertId === snapshot.id}
                      isReverting={reverting && pendingRevertId === snapshot.id}
                      onRequestRevert={() => setPendingRevertId(snapshot.id)}
                      onConfirmRevert={() => handleRevert(snapshot)}
                      onCancelRevert={() => setPendingRevertId(null)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// SNAPSHOT ROW
// ============================================

interface SnapshotRowProps {
  snapshot: ColorSnapshot;
  isPendingRevert: boolean;
  isReverting: boolean;
  onRequestRevert: () => void;
  onConfirmRevert: () => void;
  onCancelRevert: () => void;
}

function SnapshotRow({
  snapshot,
  isPendingRevert,
  isReverting,
  onRequestRevert,
  onConfirmRevert,
  onCancelRevert,
}: SnapshotRowProps) {
  const coreColors = snapshot.colorsSnapshot?.core ?? [];

  return (
    <div
      {...devProps('SnapshotRow')}
      className="flex items-center justify-between py-3 gap-3"
    >
      {/* Timestamps */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-fg-primary">
          {relativeTime(snapshot.createdAt)}
        </p>
        <p className="text-xs text-fg-tertiary">
          {absoluteTime(snapshot.createdAt)}
        </p>
      </div>

      {/* Swatch strip — first 5 core colors */}
      <div className="flex gap-0.5 shrink-0">
        {coreColors.slice(0, 5).map((c) => (
          <div
            key={c.slug}
            className="w-4 h-4 rounded-full border border-border-secondary"
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="shrink-0">
        {isPendingRevert ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-fg-tertiary text-xs whitespace-nowrap">
              Revert to this?
            </span>
            <button
              onClick={onConfirmRevert}
              disabled={isReverting}
              className="text-xs text-fg-brand-primary hover:underline disabled:opacity-50"
            >
              {isReverting ? (
                <Loading01 className="w-3.5 h-3.5 animate-spin inline" />
              ) : (
                'Yes'
              )}
            </button>
            <button
              onClick={onCancelRevert}
              disabled={isReverting}
              className="text-xs text-fg-tertiary hover:text-fg-primary disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onRequestRevert}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary border border-border-secondary transition-colors"
            title="Revert to this version"
          >
            <RefreshCcw01 className="w-3.5 h-3.5" />
            Revert
          </button>
        )}
      </div>
    </div>
  );
}
