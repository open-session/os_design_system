'use client';

import React from 'react';
import { Globe01, Image01, LinkExternal01 } from '@untitledui-pro/icons/line';
import Image from 'next/image';
import { SourceInfo } from './AnswerView';
import { devProps } from '@/lib/utils/dev-props';

interface SourcePopoverProps {
  sources: SourceInfo[];
  position?: 'above' | 'below';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function SourcePopover({ sources, position = 'above', onMouseEnter, onMouseLeave }: SourcePopoverProps) {
  if (sources.length === 0) return null;

  const positionClasses = position === 'above' 
    ? 'bottom-full mb-2' 
    : 'top-full mt-2';

  // Using span-based elements to avoid hydration errors when rendered inside <p> tags
  return (
    <span
      {...devProps('SourcePopover')}
      className={`absolute left-0 ${positionClasses} w-72 bg-bg-secondary rounded-xl shadow-2xl z-50 overflow-hidden block`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <span className="px-3 py-2.5 flex items-center gap-2 bg-bg-tertiary">
        <Globe01 className="w-3.5 h-3.5 text-fg-quaternary opacity-50" />
        <span className="text-[11px] font-medium text-fg-quaternary opacity-60 uppercase tracking-wider">
          Citations
        </span>
        <span className="text-[10px] text-fg-quaternary opacity-40 ml-auto">
          {sources.length}
        </span>
      </span>

      {/* Sources list */}
      <span className="max-h-64 overflow-y-auto block p-1.5">
        {sources.map((source, idx) => (
          <SourceItem key={`popover-${idx}-${source.id || source.url}`} source={source} />
        ))}
      </span>
    </span>
  );
}

function SourceItem({ source }: { source: SourceInfo }) {
  // Get a display title - prefer extracted title, fallback to site name
  const displayTitle = source.title && source.title !== source.name 
    ? source.title 
    : `Article from ${source.name}`;
  
  return (
    <a
      {...devProps('SourceItem')}
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-bg-tertiary transition-all duration-standard group"
    >
      {/* Favicon */}
      <span className="flex-shrink-0">
        <span className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center overflow-hidden">
          {source.favicon ? (
            <Image
              src={source.favicon}
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 rounded"
              unoptimized
            />
          ) : (
            <Globe01 className="w-4 h-4 text-fg-quaternary opacity-50" />
          )}
        </span>
      </span>

      {/* Content */}
      <span className="flex-1 min-w-0 flex flex-col pt-0.5">
        <span className="text-[13px] font-medium text-fg-primary group-hover:text-fg-brand-primary transition-colors line-clamp-2">
          {displayTitle}
        </span>
        {/* Show snippet if available */}
        {source.snippet && (
          <span className="text-[11px] text-fg-tertiary opacity-60 mt-0.5 line-clamp-1">
            {source.snippet}
          </span>
        )}
        <span className="text-[10px] text-fg-quaternary opacity-50 mt-0.5 truncate">
          {source.name}
        </span>
      </span>

      {/* External link icon */}
      <LinkExternal01 className="w-3.5 h-3.5 text-fg-quaternary group-hover:opacity-100 opacity-0 transition-all flex-shrink-0 mt-1" />
    </a>
  );
}


