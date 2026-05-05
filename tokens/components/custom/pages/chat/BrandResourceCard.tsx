'use client';

import React from 'react';
import Link from 'next/link';
import { Type01, BookOpen01, Camera01, Fingerprint01, Image01, PenTool01, MessageCircle01, Hexagon01, MessageSquare01, LayersTwo01, File01, LinkExternal01, SearchLg } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

// Map icon names to components (Lucide names -> UUI components)
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Hexagon: Hexagon01,
  SearchLg: SearchLg,
  Type: Type01,
  BookOpen: BookOpen01,
  Camera: Camera01,
  Fingerprint: Fingerprint01,
  MessageSquare: MessageSquare01,
  PenTool: PenTool01,
  MessageCircle: MessageCircle01,
  Layers: LayersTwo01,
  Image: Image01,
  Shapes: Hexagon01,
};

export interface BrandResourceCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  thumbnail?: string;
}

export function BrandResourceCard({
  title,
  href,
  icon,
}: BrandResourceCardProps) {
  const IconComponent = ICON_MAP[icon] || Hexagon01;

  return (
    <Link
      {...devProps('BrandResourceCard')}
      href={href}
      className="
        group inline-flex items-center gap-1.5
        px-3 py-1.5
        rounded-full
        bg-bg-brand-primary hover:bg-bg-brand-primary-alt
        border border-border-secondary hover:border-border-primary
        transition-colors
      "
    >
      <IconComponent className="w-3.5 h-3.5 text-fg-brand-primary flex-shrink-0" />
      <span className="text-xs text-fg-brand-primary font-medium whitespace-nowrap">
        {title}
      </span>
      <LinkExternal01 className="w-3 h-3 text-fg-brand-primary opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </Link>
  );
}

// Container for multiple resource cards - pill-style layout that wraps
export interface BrandResourceCardsProps {
  cards: BrandResourceCardProps[];
}

export function BrandResourceCards({ cards }: BrandResourceCardsProps) {
  if (cards.length === 0) return null;

  return (
    <div {...devProps('BrandResourceCards')} className="mt-6">
      <p className="text-xs text-fg-tertiary uppercase tracking-wider font-medium mb-3">
        Related Resources
      </p>
      <div className="flex flex-wrap gap-2">
        {cards.map((card, idx) => (
          <BrandResourceCard key={`${card.href}-${idx}`} {...card} />
        ))}
      </div>
    </div>
  );
}
