'use client';

import React from 'react';
import { Link01 } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface ResourceCardProps {
  title: string;
  description?: string;
  /** Icon element to render — can be any React node (SVG, img, etc.) */
  iconElement?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

/**
 * ResourceCard — compact card for a brand resource with title, description, and icon.
 * Matches Brand Hub card aesthetic (bg-bg-primary, border-border-secondary, rounded-xl).
 */
export function ResourceCard({
  title,
  description,
  iconElement,
  href,
  onClick,
}: ResourceCardProps) {
  const inner = (
    <>
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-secondary group-hover:bg-bg-tertiary transition-colors">
        {iconElement ?? <Link01 className="w-5 h-5 text-fg-secondary" />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1 mt-3">
        <h3 className="truncate text-sm font-semibold text-fg-primary">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-fg-tertiary">
            {description}
          </p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a
        {...devProps('ResourceCard')}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col rounded-xl border border-border-secondary bg-bg-primary p-4 transition-colors hover:bg-bg-secondary hover:border-border-primary"
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      {...devProps('ResourceCard')}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`group flex flex-col rounded-xl border border-border-secondary bg-bg-primary p-4 transition-colors hover:bg-bg-secondary hover:border-border-primary${onClick ? ' cursor-pointer' : ''}`}
    >
      {inner}
    </div>
  );
}
