'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DotLoaderOnly, ThinkingDotFlow } from '@/components/custom/shared/loaders/dot-flow';
import { Globe01 } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface InlineStreamingDisplayProps {
  /** Whether the response is still streaming */
  isStreaming: boolean;
  /** Whether any text content has arrived yet */
  hasContent: boolean;
}

/**
 * InlineStreamingDisplay
 *
 * Shows the fun word-flow animation while the assistant is loading a response
 * before any text arrives. Once text is streaming, this component renders nothing;
 * the trailing-dot animation is handled by StreamingTrailIndicator.
 */
// eslint-disable-next-line bos-local/require-dev-props
export function InlineStreamingDisplay({
  isStreaming,
  hasContent,
}: InlineStreamingDisplayProps) {
  const showWordAnimation = isStreaming && !hasContent;

  if (!showWordAnimation) return null;

  return (
    <div className="py-2">
      <ThinkingDotFlow />
    </div>
  );
}

/**
 * StreamingSourcesCounter
 *
 * Shows the "Finding sources..." counter during streaming.
 * Should be rendered AFTER the canvas preview bubble in ChatContent.
 */
export function StreamingSourcesCounter({
  isStreaming,
  sourcesCount,
}: {
  isStreaming: boolean;
  sourcesCount: number;
}) {
  return (
    <AnimatePresence>
      {isStreaming && sourcesCount > 0 && (
        <motion.div
          {...devProps('StreamingSourcesCounter')}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border-secondary">
            <Globe01 className="w-3.5 h-3.5 text-fg-tertiary" />
            <span className="text-[13px] text-fg-tertiary">
              Finding sources...{' '}
              <motion.span
                key={sourcesCount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-fg-primary font-medium"
              >
                {sourcesCount}
              </motion.span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * StreamingTrailIndicator
 *
 * A separate component for the trailing dot animation that shows
 * AFTER content while text is streaming. This should be rendered
 * BELOW the response content, not above it.
 */
export function StreamingTrailIndicator({
  isStreaming,
  hasContent,
}: {
  isStreaming: boolean;
  hasContent: boolean;
}) {
  if (!isStreaming || !hasContent) return null;

  return (
    <div {...devProps('StreamingTrailIndicator')} className="py-2">
      <DotLoaderOnly />
    </div>
  );
}

/**
 * Compact version for minimal UI
 */
// eslint-disable-next-line bos-local/require-dev-props
export function InlineStreamingIndicator({
  isStreaming,
}: {
  isStreaming: boolean;
}) {
  if (!isStreaming) return null;

  return <DotLoaderOnly className="scale-75" />;
}

export default InlineStreamingDisplay;
