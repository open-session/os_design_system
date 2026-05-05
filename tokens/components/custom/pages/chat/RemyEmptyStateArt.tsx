'use client';

import { motion } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';

/**
 * Decorative illustration for the drawer's empty state.
 *
 * Three concentric circles + an off-center orb sit over a plus-mark field,
 * riffing on the homepage's existing visual language. All strokes and fills
 * pull from CSS variables so the art theme-swaps with the app.
 *
 * Purely presentational — aria-hidden. The heading underneath carries the
 * semantic meaning.
 */
export function RemyEmptyStateArt() {
  return (
    <motion.svg
      {...devProps('RemyEmptyStateArt')}
      aria-hidden
      viewBox="0 0 160 100"
      width="140"
      height="88"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Soft backdrop halo — very low opacity brand wash */}
      <defs>
        <radialGradient id="remy-halo" cx="55%" cy="55%" r="55%">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.22" />
          <stop offset="70%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="remy-orb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-brand-400)" />
          <stop offset="60%" stopColor="var(--color-brand-600)" />
          <stop offset="100%" stopColor="var(--color-brand-800)" />
        </linearGradient>
      </defs>

      {/* Halo wash */}
      <ellipse cx="88" cy="50" rx="70" ry="40" fill="url(#remy-halo)" />

      {/* Plus-mark field — echoes PlusesTexture from the homepage */}
      <g stroke="var(--border-secondary)" strokeWidth="0.75" opacity="0.55">
        {Array.from({ length: 6 }).flatMap((_, r) =>
          Array.from({ length: 10 }).map((__, c) => {
            const cx = 10 + c * 15;
            const cy = 12 + r * 15;
            return (
              <g key={`${r}-${c}`}>
                <line x1={cx - 1.5} y1={cy} x2={cx + 1.5} y2={cy} />
                <line x1={cx} y1={cy - 1.5} x2={cx} y2={cy + 1.5} />
              </g>
            );
          }),
        )}
      </g>

      {/* Concentric rings around the orb — subtle, brand-tinted */}
      <g fill="none" stroke="var(--color-brand-500)" strokeWidth="0.8" opacity="0.35">
        <circle cx="88" cy="50" r="18" />
        <circle cx="88" cy="50" r="26" opacity="0.22" />
        <circle cx="88" cy="50" r="34" opacity="0.12" />
      </g>

      {/* The orb itself */}
      <circle cx="88" cy="50" r="10" fill="url(#remy-orb)" />
      <circle cx="85" cy="47" r="2.5" fill="var(--color-vanilla)" opacity="0.75" />
    </motion.svg>
  );
}
