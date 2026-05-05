'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Hexagon01, Image01 as ImageIcon, Copy01, Check, ArrowRight } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

export interface BrandSourceInfo {
  id: string;
  name: string;
  type: 'brand-doc' | 'asset';
  title: string;
  path: string;
  snippet?: string;
  thumbnail?: string;
  href?: string; // Page link for navigation
  tab?: string;  // Tab/filter to select on the page
}

interface BrandSourcePopoverProps {
  sources: BrandSourceInfo[];
  position?: 'above' | 'below';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function BrandSourcePopover({ sources, position = 'above', onMouseEnter, onMouseLeave }: BrandSourcePopoverProps) {
  if (sources.length === 0) return null;

  const positionClasses = position === 'above' 
    ? 'bottom-full mb-2' 
    : 'top-full mt-2';

  // Using span-based elements to avoid hydration errors when rendered inside <p> tags
  return (
    <span
      {...devProps('BrandSourcePopover')}
      className={`absolute left-0 ${positionClasses} w-72 bg-bg-secondary rounded-xl shadow-2xl z-50 overflow-hidden block`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <span className="px-3 py-2.5 flex items-center gap-2 bg-bg-tertiary">
        <Hexagon01 className="w-3.5 h-3.5 text-fg-quaternary opacity-50" />
        <span className="text-[11px] font-medium text-fg-quaternary opacity-60 uppercase tracking-wider">
          Brand Context
        </span>
        <span className="text-[10px] text-fg-quaternary opacity-40 ml-auto">
          {sources.length}
        </span>
      </span>

      {/* Sources list */}
      <span className="max-h-64 overflow-y-auto block p-1.5">
        {sources.map((source, idx) => (
          <BrandSourceItem key={`brand-popover-${idx}-${source.id || source.path}`} source={source} />
        ))}
      </span>
    </span>
  );
}

function BrandSourceItem({ source }: { source: BrandSourceInfo }) {
  const [copied, setCopied] = useState(false);
  const isAsset = source.type === 'asset';
  const isImage = source.path.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i);

  const handleCopyPath = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(source.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span {...devProps('BrandSourceItem')} className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-bg-tertiary transition-all duration-200 group cursor-pointer">
      {/* Icon or Thumbnail */}
      <span className="flex-shrink-0">
        {isAsset && isImage && source.thumbnail ? (
          <span className="w-8 h-8 rounded-lg overflow-hidden bg-bg-tertiary block">
            <Image
              src={source.thumbnail}
              alt={source.title}
              width={32}
              height={32}
              className="w-full h-full object-contain"
              unoptimized
            />
          </span>
        ) : isAsset && isImage ? (
          <span className="w-8 h-8 rounded-lg overflow-hidden bg-bg-tertiary block">
            <Image
              src={source.path}
              alt={source.title}
              width={32}
              height={32}
              className="w-full h-full object-contain"
              unoptimized
            />
          </span>
        ) : isAsset ? (
          <span className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-fg-quaternary opacity-60" />
          </span>
        ) : (
          <span className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center">
            <Hexagon01 className="w-4 h-4 text-fg-quaternary opacity-60" />
          </span>
        )}
      </span>

      {/* Content */}
      <span className="flex-1 min-w-0 flex flex-col pt-0.5">
        <span className="text-[13px] font-medium text-fg-primary group-hover:text-fg-primary transition-colors line-clamp-1">
          {source.title || source.name}
        </span>
        <span className="text-[11px] text-fg-quaternary opacity-50 mt-0.5">
          Internal knowledge
        </span>
      </span>

      {/* Actions */}
      <span className="flex-shrink-0 flex items-center">
        {isAsset ? (
          <button
            onClick={handleCopyPath}
            className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-bg-tertiary transition-all"
            title="Copy path"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-fg-success-primary" />
            ) : (
              <Copy01 className="w-3.5 h-3.5 text-fg-quaternary opacity-50" />
            )}
          </button>
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-fg-quaternary group-hover:opacity-100 opacity-0 transition-all" />
        )}
      </span>
    </span>
  );
}
