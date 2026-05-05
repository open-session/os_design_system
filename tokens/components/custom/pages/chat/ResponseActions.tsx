'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Check,
  Copy01,
  Globe01,
  Hexagon01,
  RefreshCw01,
  Rss01,
  ThumbsDown,
  ThumbsUp,
} from '@untitledui-pro/icons/line';
import { SourceInfo } from './AnswerView';
import { BrandResourceCardProps } from './BrandResourceCard';
import { SourcesDrawer } from './SourcesDrawer';
import {
  submitFeedback,
  removeFeedback,
  getFeedback,
  type FeedbackType,
} from '@/lib/supabase/feedback-service';
import { devProps } from '@/lib/utils/dev-props';

interface ResponseActionsProps {
  sources?: SourceInfo[];
  resourceCards?: BrandResourceCardProps[];
  content?: string;
  query?: string;
  messageId?: string;
  chatId?: string;
  onRegenerate?: () => void;
  showSources?: boolean;
  modelUsed?: string;
}

// Custom Tooltip component
function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div {...devProps('Tooltip')} className="relative group/tooltip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-secondary border border-border-primary rounded text-xs text-fg-primary whitespace-nowrap opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all pointer-events-none z-50 shadow-lg">
        {label}
      </div>
    </div>
  );
}

export function ResponseActions({
  sources = [],
  resourceCards = [],
  content = '',
  query = '',
  messageId,
  chatId,
  onRegenerate,
  showSources = false,
  modelUsed,
}: ResponseActionsProps) {
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSourcesDrawer, setShowSourcesDrawer] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Load existing feedback on mount
  useEffect(() => {
    if (messageId) {
      getFeedback(messageId).then(existingFeedback => {
        if (existingFeedback) {
          setFeedback(existingFeedback);
        }
      });
    }
  }, [messageId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFeedback = useCallback(async (type: FeedbackType) => {
    if (isSubmittingFeedback) return;
    
    setIsSubmittingFeedback(true);
    
    try {
      if (feedback === type) {
        // Toggle off - remove feedback
        if (messageId) {
          await removeFeedback(messageId);
        }
        setFeedback(null);
      } else {
        // Set new feedback
        const newFeedback = await submitFeedback({
          messageId: messageId || `msg_${Date.now()}`,
          chatId,
          feedbackType: type,
          query,
          responseContent: content.slice(0, 1000), // Store first 1000 chars for context
          modelUsed,
        });
        
        if (newFeedback) {
          setFeedback(type);
        }
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  }, [feedback, messageId, chatId, query, content, modelUsed, isSubmittingFeedback]);

  // Separate sources by type
  const { discoverSources, webSources } = useMemo(() => {
    const discover: SourceInfo[] = [];
    const web: SourceInfo[] = [];
    
    sources.forEach(source => {
      if (source.type === 'discover') {
        discover.push(source);
      } else {
        web.push(source);
      }
    });
    
    return { discoverSources: discover, webSources: web };
  }, [sources]);

  const hasDiscoverSources = discoverSources.length > 0;
  const hasWebSources = webSources.length > 0;
  const hasBrandResources = resourceCards.length > 0;
  const totalSourcesCount = sources.length + resourceCards.length;
  const hasAnySourcesData = hasDiscoverSources || hasWebSources || hasBrandResources;

  return (
    <>
      <div {...devProps('ResponseActions')} className="flex flex-wrap items-center justify-between gap-2 py-3 mt-4">
        {/* Left side - Sources/Citations */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {/* Sources button - only interactive when sources exist */}
          {hasAnySourcesData ? (
            <button
              onClick={() => setShowSourcesDrawer(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-bg-secondary hover:bg-bg-secondary-hover border border-border-secondary transition-colors group"
            >
              {/* Stacked source icons - show up to 4 icons representing different source types */}
              <div className="flex -space-x-1">
                {/* Show discover source icons first (cyan) */}
                {discoverSources.slice(0, hasWebSources || hasBrandResources ? 1 : 2).map((source, idx) => (
                  <div
                    key={`action-discover-${idx}-${source.id || source.url}`}
                    className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center"
                  >
                    <Rss01 className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                ))}
                {/* Show web source favicons */}
                {webSources.slice(0, hasDiscoverSources ? 1 : (hasBrandResources ? 2 : 3)).map((source, idx) => (
                  <div
                    key={`action-web-${idx}-${source.id || source.url}`}
                    className="w-5 h-5 rounded-full bg-bg-primary border border-border-primary flex items-center justify-center"
                  >
                    {source.favicon ? (
                      <img src={source.favicon} alt="" className="w-3 h-3 rounded" />
                    ) : (
                      <Globe01 className="w-2.5 h-2.5 text-fg-tertiary" />
                    )}
                  </div>
                ))}
                {/* Show brand icon if we have brand resources */}
                {hasBrandResources && (
                  <div className="w-5 h-5 rounded-full bg-bg-brand-primary border border-border-brand/30 flex items-center justify-center">
                    <Hexagon01 className="w-2.5 h-2.5 text-fg-brand-primary" />
                  </div>
                )}
              </div>
              <span className="text-[13px] text-fg-tertiary group-hover:text-fg-primary transition-colors">
                {totalSourcesCount} {totalSourcesCount === 1 ? 'source' : 'sources'}
              </span>
            </button>
          ) : (
            /* Disabled icon when no sources - just the icon, no button styling */
            <Tooltip label="No related links">
              <div className="p-2">
                <Globe01 className="w-4 h-4 text-fg-tertiary/50" />
              </div>
            </Tooltip>
          )}
        </div>

        {/* Right side - Regenerate, Feedback, Copy */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Regenerate */}
          <Tooltip label="Regenerate">
            <button
              onClick={onRegenerate}
              className="p-2 text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <RefreshCw01 className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Divider */}
          <div className="w-px h-4 bg-border-primary mx-1" />

          {/* Like */}
          <Tooltip label="Good response">
            <button
              onClick={() => handleFeedback('like')}
              disabled={isSubmittingFeedback}
              className={`
                p-2 rounded-lg transition-colors
                ${isSubmittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}
                ${
                  feedback === 'like'
                    ? 'text-fg-brand-primary bg-bg-brand-primary'
                    : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary'
                }
              `}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Dislike */}
          <Tooltip label="Poor response">
            <button
              onClick={() => handleFeedback('dislike')}
              disabled={isSubmittingFeedback}
              className={`
                p-2 rounded-lg transition-colors
                ${isSubmittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}
                ${
                  feedback === 'dislike'
                    ? 'text-fg-error-primary bg-bg-error-primary'
                    : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary'
                }
              `}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Divider */}
          <div className="w-px h-4 bg-border-primary mx-1" />

          {/* Copy */}
          <Tooltip label={copied ? 'Copied!' : 'Copy'}>
            <button
              onClick={handleCopy}
              className="p-2 text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-fg-success-primary" />
              ) : (
                <Copy01 className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Sources Drawer */}
      <SourcesDrawer
        isOpen={showSourcesDrawer}
        onClose={() => setShowSourcesDrawer(false)}
        sources={sources}
        resourceCards={resourceCards}
        query={query}
      />
    </>
  );
}
