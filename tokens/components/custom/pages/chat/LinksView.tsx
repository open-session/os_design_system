'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { LinkExternal01, Globe01, Hexagon01, Rss01, SearchLg, ChevronDown, XClose, Package, Link01 as LinkIcon, ArrowUp as ArrowUpAZ, ArrowDown as ArrowDownZA } from '@untitledui-pro/icons/line';
import { SourceInfo, ParsedAssetType } from './AnswerView';
import { BrandResourceCardProps } from './BrandResourceCard';
import { getAssetTypeLabel, getAssetPagePath } from '@/lib/brand-knowledge/asset-data';
import { devProps } from '@/lib/utils/dev-props';

interface LinksViewProps {
  query: string;
  sources: SourceInfo[];
  resourceCards?: BrandResourceCardProps[];
  /** Asset types from parsed asset tags in the response */
  assetTypes?: ParsedAssetType[];
}

// Filter types - now includes assets
type FilterType = 'all' | 'brand' | 'web' | 'news' | 'assets';
type SortOrder = 'asc' | 'desc';

// Asset link data for unified links
interface AssetLinkData {
  type: ParsedAssetType;
  label: string;
  href: string;
}

// Unified link item for filtering/sorting
interface UnifiedLink {
  id: string;
  title: string;
  domain: string;
  url: string;
  favicon?: string;
  type: FilterType;
  isInternal: boolean;
  originalData: SourceInfo | BrandResourceCardProps | AssetLinkData;
}

// Category display names and colors
const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  'design-ux': { label: 'Design & UX', color: 'text-blue-400' },
  'branding': { label: 'Branding', color: 'text-purple-400' },
  'ai-creative': { label: 'AI & Creative', color: 'text-emerald-400' },
  'social-trends': { label: 'Social Trends', color: 'text-pink-400' },
  'general-tech': { label: 'Tech', color: 'text-sky-400' },
  'startup-business': { label: 'Business', color: 'text-amber-400' },
};

// Filter pill configuration - now includes assets
const FILTER_CONFIG: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: LinkIcon },
  { id: 'brand', label: 'Brand', icon: Hexagon01 },
  { id: 'web', label: 'Web', icon: Globe01 },
  { id: 'news', label: 'News', icon: Rss01 },
  { id: 'assets', label: 'Assets', icon: Package },
];

// Extract domain from URL
function getDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// Compact Link Card Component
// eslint-disable-next-line bos-local/require-dev-props
function LinkCard({ link }: { link: UnifiedLink }) {
  const Icon = link.type === 'brand' 
    ? Hexagon01 
    : link.type === 'news' 
    ? Rss01 
    : link.type === 'assets'
    ? Package
    : Globe01;
  const iconColor = link.type === 'brand' || link.type === 'assets'
    ? 'text-fg-brand-primary' 
    : 'text-fg-quaternary';

  const CardWrapper = link.isInternal ? Link : 'a';
  const linkProps = link.isInternal 
    ? { href: link.url }
    : { href: link.url, target: '_blank', rel: 'noopener noreferrer' };

  return (
    <CardWrapper
      {...linkProps}
      className="group flex flex-col gap-1.5 p-3 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-tertiary hover:border-border-secondary transition-all duration-150 cursor-pointer min-h-[72px]"
      title={link.title}
    >
      {/* Top row: Favicon + Domain */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {link.favicon ? (
            <img
              src={link.favicon}
              alt=""
              className="w-4 h-4 rounded-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : null}
          <Icon className={`w-4 h-4 ${iconColor} ${link.favicon ? 'hidden' : ''}`} />
        </div>
        <span className="text-[10px] text-fg-quaternary truncate flex-1">
          {link.domain}
        </span>
        <LinkExternal01 className="w-3 h-3 text-fg-quinary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      
      {/* Title */}
      <h3 className="text-[12px] leading-tight text-fg-secondary group-hover:text-fg-primary transition-colors line-clamp-2">
        {link.title}
      </h3>
    </CardWrapper>
  );
}

// Filter Toolbar Component
function FilterToolbar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortOrder,
  onSortChange,
  counts,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  counts: Record<FilterType, number>;
}) {
  return (
    <div {...devProps('FilterToolbar')} className="sticky top-0 z-10 bg-bg-primary pb-4 space-y-3">
      {/* Search Input */}
      <div className="relative">
        <SearchLg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-quaternary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search links..."
          className="w-full pl-9 pr-8 py-2 text-[13px] bg-bg-secondary border border-border-secondary rounded-lg text-fg-primary placeholder:text-fg-placeholder focus:outline-hidden focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-bg-tertiary transition-colors"
          >
            <XClose className="w-3.5 h-3.5 text-fg-quaternary" />
          </button>
        )}
      </div>

      {/* Filter Pills + Sort */}
      <div className="flex items-center justify-between gap-3">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_CONFIG.map((filter) => {
            const isActive = activeFilter === filter.id;
            const count = counts[filter.id];
            const Icon = filter.icon;
            
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                disabled={count === 0 && filter.id !== 'all'}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-bg-brand-primary text-fg-brand-primary border border-border-brand' 
                    : 'bg-bg-secondary text-fg-tertiary border border-transparent hover:bg-bg-tertiary hover:text-fg-secondary'
                  }
                  ${count === 0 && filter.id !== 'all' ? 'opacity-40 cursor-not-allowed' : ''}
                `}
              >
                <Icon className="w-3 h-3" />
                <span>{filter.label}</span>
                <span className={`text-[10px] ${isActive ? 'text-fg-brand-primary/70' : 'text-fg-quaternary'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <button
          onClick={() => onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-bg-secondary text-fg-tertiary hover:bg-bg-tertiary hover:text-fg-secondary transition-all duration-150 border border-transparent"
          title={sortOrder === 'asc' ? 'Sorted A to Z' : 'Sorted Z to A'}
        >
          {sortOrder === 'asc' ? (
            <ArrowUpAZ className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownZA className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ 
  hasFilters, 
  searchQuery,
  onClearFilters,
  fallbackQuery 
}: { 
  hasFilters: boolean;
  searchQuery: string;
  onClearFilters: () => void;
  fallbackQuery: string;
}) {
  const encodedQuery = encodeURIComponent(fallbackQuery || 'related topics');

  if (hasFilters) {
    return (
      <div {...devProps('EmptyState')} className="py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center mx-auto mb-4">
          <SearchLg className="w-5 h-5 text-fg-quaternary" />
        </div>
        <h3 className="text-[14px] font-medium text-fg-primary mb-1.5">
          No matches found
        </h3>
        <p className="text-[12px] text-fg-tertiary mb-4 max-w-[240px] mx-auto">
          {searchQuery 
            ? `No links match "${searchQuery}"`
            : 'No links match the current filter'}
        </p>
        <button
          onClick={onClearFilters}
          className="text-[12px] text-fg-brand-primary hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div {...devProps('EmptyState')} className="py-12">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-bg-secondary flex items-center justify-center mx-auto mb-5">
          <SearchLg className="w-6 h-6 text-fg-tertiary/50" />
        </div>
        <h3 className="text-[15px] font-medium text-fg-primary mb-2">
          No sources available
        </h3>
        <p className="text-[13px] text-fg-tertiary/70 mb-6 max-w-[280px] mx-auto">
          This response was generated from AI knowledge. Explore more on the web:
        </p>
        <div className="space-y-2 max-w-sm mx-auto">
          <a
            href={`https://www.google.com/search?q=${encodedQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-bg-secondary hover:bg-bg-secondary-hover transition-all duration-200 group"
          >
            <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
            <span className="text-[13px] text-fg-primary group-hover:text-fg-brand-primary transition-colors flex-1 text-left font-medium">
              Search on Google
            </span>
            <LinkExternal01 className="w-4 h-4 text-fg-tertiary/40 group-hover:text-fg-brand-primary transition-colors" />
          </a>
          <a
            href={`https://www.perplexity.ai/search?q=${encodedQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-bg-secondary hover:bg-bg-secondary-hover transition-all duration-200 group"
          >
            <Globe01 className="w-4 h-4 text-fg-tertiary/60" />
            <span className="text-[13px] text-fg-primary group-hover:text-fg-brand-primary transition-colors flex-1 text-left font-medium">
              Search on Perplexity
            </span>
            <LinkExternal01 className="w-4 h-4 text-fg-tertiary/40 group-hover:text-fg-brand-primary transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function LinksView({ query, sources, resourceCards = [], assetTypes = [] }: LinksViewProps) {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Convert all sources to unified format for easier filtering/sorting
  const unifiedLinks = useMemo(() => {
    const links: UnifiedLink[] = [];

    // Add brand resources
    resourceCards.forEach((card, idx) => {
      links.push({
        id: `brand-${idx}`,
        title: card.title,
        domain: 'Brand Hub',
        url: card.href,
        favicon: undefined,
        type: 'brand',
        isInternal: true,
        originalData: card,
      });
    });

    // Add sources
    sources.forEach((source, idx) => {
      const isNews = source.type === 'discover';
      links.push({
        id: source.id || `source-${idx}`,
        title: source.title || source.name,
        domain: getDomain(source.url),
        url: source.url,
        favicon: source.favicon,
        type: isNews ? 'news' : 'web',
        isInternal: false,
        originalData: source,
      });
    });

    // Add asset types as links to their BrandHub pages
    assetTypes.forEach((assetType) => {
      const label = getAssetTypeLabel(assetType);
      const href = getAssetPagePath(assetType);
      links.push({
        id: `asset-${assetType}`,
        title: label,
        domain: 'Brand Hub',
        url: href,
        favicon: undefined,
        type: 'assets',
        isInternal: true,
        originalData: {
          type: assetType,
          label,
          href,
        } as AssetLinkData,
      });
    });

    return links;
  }, [sources, resourceCards, assetTypes]);

  // Calculate counts for each filter type
  const counts = useMemo(() => {
    const result: Record<FilterType, number> = {
      all: unifiedLinks.length,
      brand: 0,
      web: 0,
      news: 0,
      assets: 0,
    };

    unifiedLinks.forEach((link) => {
      result[link.type]++;
    });

    return result;
  }, [unifiedLinks]);

  // Filter and sort links
  const filteredLinks = useMemo(() => {
    let result = [...unifiedLinks];

    // Apply type filter
    if (activeFilter !== 'all') {
      result = result.filter((link) => link.type === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (link) =>
          link.title.toLowerCase().includes(query) ||
          link.domain.toLowerCase().includes(query)
      );
    }

    // Apply sort
    result.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [unifiedLinks, activeFilter, searchQuery, sortOrder]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('all');
  }, []);

  const hasFilters = searchQuery.trim() !== '' || activeFilter !== 'all';
  const hasAnySources = unifiedLinks.length > 0;

  // If no sources at all, show empty state without toolbar
  if (!hasAnySources) {
    return (
      <EmptyState
        hasFilters={false}
        searchQuery=""
        onClearFilters={handleClearFilters}
        fallbackQuery={query}
      />
    );
  }

  return (
    <div {...devProps('LinksView')} className="py-4">
      {/* Header with count */}
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="w-4 h-4 text-fg-quaternary" />
        <span className="text-sm text-fg-quaternary">
          {unifiedLinks.length} source{unifiedLinks.length !== 1 ? 's' : ''} referenced
        </span>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        counts={counts}
      />

      {/* Results count when filtered */}
      {hasFilters && filteredLinks.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-fg-tertiary">
            Showing {filteredLinks.length} of {unifiedLinks.length} links
          </span>
          <button
            onClick={handleClearFilters}
            className="text-[11px] text-fg-brand-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Grid of cards */}
      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <EmptyState
          hasFilters={hasFilters}
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
          fallbackQuery={query}
        />
      )}
    </div>
  );
}
