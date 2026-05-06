'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  Download01,
  FilterLines,
  Loading01,
  Pencil01,
  Plus,
  Trash01,
  Type01,
  XClose,
} from '@untitledui-pro/icons/line';
import { useBrandFonts } from '@/hooks/useBrandFonts';
import type { BrandFont, BrandFontMetadata, FontWeight, FontFormat } from '@/lib/supabase/types';
import { Button } from '@/components/ds/buttons/button';
import { Input } from '@/components/base/base/input/input';
import { Select } from '@/components/base/base/select/select';
import type { SelectItemType } from '@/components/base/base/select/select';
import { ConfirmDialog } from './BrandHubSettingsModal';
import { BrandAssetUploadModal } from './BrandAssetUploadModal';
import { devProps } from '@/lib/utils/dev-props';

// ============================================
// TYPES & CONSTANTS
// ============================================

type FontUsage = 'display' | 'body' | 'accent';
type SortColumn = 'family' | 'weight' | 'usage' | 'format';
type SortDirection = 'asc' | 'desc';
type FilterUsage = 'all' | FontUsage;
type FilterFormat = 'all' | 'woff2' | 'woff' | 'ttf' | 'otf';

interface StaticFont {
  id: string;
  name: string;
  family: string;
  usage: FontUsage;
  weight: FontWeight;
  format: FontFormat;
  path: string;
}

interface EditingFont {
  name: string;
  fontFamily: string;
  fontWeight: FontWeight;
  usage: FontUsage;
}

/**
 * Static system fonts are brand-specific — passed via props to avoid
 * hardcoding any single brand's fonts for all tenants.
 * The consuming page provides these from its brand context.
 */
const DEFAULT_STATIC_FONTS: StaticFont[] = [];

const WEIGHT_ITEMS: SelectItemType[] = [
  { id: '100', label: 'Thin', supportingText: '100' },
  { id: '200', label: 'Extra Light', supportingText: '200' },
  { id: '300', label: 'Light', supportingText: '300' },
  { id: '400', label: 'Regular', supportingText: '400' },
  { id: '500', label: 'Medium', supportingText: '500' },
  { id: '600', label: 'Semi Bold', supportingText: '600' },
  { id: '700', label: 'Bold', supportingText: '700' },
  { id: '800', label: 'Extra Bold', supportingText: '800' },
  { id: '900', label: 'Black', supportingText: '900' },
];

const USAGE_ITEMS: SelectItemType[] = [
  { id: 'display', label: 'Display', supportingText: 'Headlines & titles' },
  { id: 'body', label: 'Body', supportingText: 'Paragraphs & UI' },
  { id: 'accent', label: 'Accent', supportingText: 'Decorative text' },
];

// ============================================
// HELPERS
// ============================================

/** Convert numeric weight to readable label */
function weightLabel(weight: string): string {
  const map: Record<string, string> = {
    '100': 'Thin',
    '200': 'ExtraLight',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'SemiBold',
    '700': 'Bold',
    '800': 'ExtraBold',
    '900': 'Black',
  };
  return map[weight] ?? weight;
}

/** Get usage badge color classes */
function getUsageColor(usage: string): string {
  switch (usage) {
    case 'display':
      return 'bg-bg-brand-primary text-fg-brand-primary';
    case 'body':
      return 'bg-bg-tertiary text-fg-secondary';
    case 'accent':
      return 'bg-bg-tertiary text-fg-tertiary';
    default:
      return 'bg-bg-tertiary text-fg-secondary';
  }
}


// ============================================
// FONT PREVIEW CELL
// ============================================

interface FontPreviewCellProps {
  /** For static fonts, use the pre-loaded font family name */
  fontFamily: string;
  fontWeight: string;
  /** For dynamic fonts, use the preview-{id} font-family injected via @font-face */
  previewFontFamily?: string;
  /** Whether the font has a valid URL for loading */
  hasValidUrl: boolean;
}

function FontPreviewCell({ fontFamily, fontWeight, previewFontFamily, hasValidUrl }: FontPreviewCellProps) {
  return (
    <div
      {...devProps('FontPreviewCell')}
      className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-primary flex items-center justify-center overflow-hidden"
    >
      {hasValidUrl || !previewFontFamily ? (
        <span
          style={{
            fontFamily: previewFontFamily ? `"${previewFontFamily}"` : fontFamily,
            fontWeight: parseInt(fontWeight),
          }}
          className="text-2xl text-fg-primary leading-none"
        >
          Aa
        </span>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-lg text-fg-tertiary leading-none">Aa</span>
          <AlertTriangle className="w-2.5 h-2.5 text-fg-warning-primary" />
        </div>
      )}
    </div>
  );
}

// ============================================
// SORTABLE TABLE HEADER CELL
// ============================================

interface SortableHeaderProps {
  label: string;
  column: SortColumn;
  currentSort: SortColumn;
  currentDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string;
}

function SortableHeader({ label, column, currentSort, currentDirection, onSort, className = '' }: SortableHeaderProps) {
  const isActive = currentSort === column;

  return (
    <th
      {...devProps('SortableHeader')}
      className={`py-2.5 px-2 sm:px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider cursor-pointer select-none hover:text-fg-primary transition-colors ${className}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive ? (
          currentDirection === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-fg-brand-primary" />
          ) : (
            <ArrowDown className="w-3 h-3 text-fg-brand-primary" />
          )
        ) : (
          <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-30" />
        )}
      </div>
    </th>
  );
}

// ============================================
// FILTER DROPDOWN
// ============================================

interface FilterDropdownProps {
  filterUsage: FilterUsage;
  filterFormat: FilterFormat;
  onUsageChange: (usage: FilterUsage) => void;
  onFormatChange: (format: FilterFormat) => void;
  hasActiveFilters: boolean;
}

function FilterDropdown({ filterUsage, filterFormat, onUsageChange, onFormatChange, hasActiveFilters }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div {...devProps('FilterDropdown')} ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
          hasActiveFilters
            ? 'border-border-brand bg-bg-brand-primary text-fg-brand-primary'
            : 'border-border-primary bg-bg-secondary text-fg-tertiary hover:bg-bg-tertiary'
        }`}
      >
        <FilterLines className="w-3.5 h-3.5" />
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-bg-brand-solid" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-1 z-[100] w-52 rounded-lg border border-border-primary bg-bg-primary shadow-xl overflow-hidden"
          >
            {/* Usage filter */}
            <div className="px-3 pt-3 pb-1">
              <span className="text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">Usage</span>
            </div>
            {(['all', 'display', 'body', 'accent'] as FilterUsage[]).map((usage) => (
              <button
                key={usage}
                onClick={() => onUsageChange(usage)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-bg-secondary transition-colors text-left ${
                  filterUsage === usage ? 'bg-bg-secondary' : ''
                }`}
              >
                <span className={usage === 'all' ? 'text-fg-primary' : `px-1.5 py-0.5 rounded text-[10px] font-medium ${getUsageColor(usage)}`}>
                  {usage === 'all' ? 'All' : usage.charAt(0).toUpperCase() + usage.slice(1)}
                </span>
                {filterUsage === usage && <Check className="w-3 h-3 ml-auto text-fg-brand-primary" />}
              </button>
            ))}

            <div className="border-t border-border-secondary my-1" />

            {/* Format filter */}
            <div className="px-3 pt-1 pb-1">
              <span className="text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">Format</span>
            </div>
            {(['all', 'woff2', 'woff', 'ttf', 'otf'] as FilterFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => onFormatChange(fmt)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-bg-secondary transition-colors text-left ${
                  filterFormat === fmt ? 'bg-bg-secondary' : ''
                }`}
              >
                <span className={fmt === 'all' ? 'text-fg-primary' : 'font-mono text-[10px] text-fg-secondary uppercase'}>
                  {fmt === 'all' ? 'All' : fmt.toUpperCase()}
                </span>
                {filterFormat === fmt && <Check className="w-3 h-3 ml-auto text-fg-brand-primary" />}
              </button>
            ))}

            {/* Clear filters */}
            {hasActiveFilters && (
              <>
                <div className="border-t border-border-secondary my-1" />
                <button
                  onClick={() => {
                    onUsageChange('all');
                    onFormatChange('all');
                  }}
                  className="w-full px-3 py-2 text-xs text-fg-error-primary hover:bg-bg-secondary transition-colors text-left"
                >
                  Clear filters
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// BREAKPOINT TYPES & PREDEFINED ROWS
// ============================================

type Breakpoint = 'desktop' | 'presentation' | 'tablet' | 'mobile';

const BREAKPOINT_LABELS: Record<Breakpoint, string> = {
  desktop: 'Desktop',
  presentation: 'Presentation',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

interface TypeRow {
  id: string;
  role: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: number;
  previewText: string;
  breakpoints: Record<Breakpoint, number>; // font size in px
}

/** Auto-generate non-desktop breakpoints from desktop sizes */
function autoGenerateBreakpoints(rows: TypeRow[]): TypeRow[] {
  return rows.map((row) => ({
    ...row,
    breakpoints: {
      desktop: row.breakpoints.desktop,
      presentation: Math.round(row.breakpoints.desktop * 1.3),
      tablet: Math.round(row.breakpoints.desktop * 0.9),
      mobile: Math.max(12, Math.round(row.breakpoints.desktop * 0.8)),
    },
  }));
}

const DEFAULT_PREVIEW_TEXT = 'The quick brown fox jumps over the lazy dog';

const DEFAULT_TYPE_ROWS: TypeRow[] = [
  { id: 'display-1', role: 'Display 1', fontFamily: 'sans-serif', fontWeight: '700', lineHeight: 1.1, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 72, presentation: 94, tablet: 65, mobile: 58 } },
  { id: 'display-2', role: 'Display 2', fontFamily: 'sans-serif', fontWeight: '700', lineHeight: 1.1, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 56, presentation: 73, tablet: 50, mobile: 45 } },
  { id: 'display-3', role: 'Display 3', fontFamily: 'sans-serif', fontWeight: '700', lineHeight: 1.1, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 48, presentation: 62, tablet: 43, mobile: 38 } },
  { id: 'h1', role: 'H1', fontFamily: 'sans-serif', fontWeight: '700', lineHeight: 1.2, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 40, presentation: 52, tablet: 36, mobile: 32 } },
  { id: 'h2', role: 'H2', fontFamily: 'sans-serif', fontWeight: '700', lineHeight: 1.2, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 32, presentation: 42, tablet: 29, mobile: 26 } },
  { id: 'h3', role: 'H3', fontFamily: 'sans-serif', fontWeight: '600', lineHeight: 1.3, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 24, presentation: 31, tablet: 22, mobile: 19 } },
  { id: 'h4', role: 'H4', fontFamily: 'sans-serif', fontWeight: '600', lineHeight: 1.3, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 20, presentation: 26, tablet: 18, mobile: 16 } },
  { id: 'subheading-1', role: 'Subheading 1', fontFamily: 'sans-serif', fontWeight: '700', lineHeight: 1.4, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 18, presentation: 23, tablet: 16, mobile: 14 } },
  { id: 'subheading-2', role: 'Subheading 2', fontFamily: 'sans-serif', fontWeight: '700', lineHeight: 1.4, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 14, presentation: 18, tablet: 13, mobile: 12 } },
  { id: 'text-1', role: 'Text 1', fontFamily: 'sans-serif', fontWeight: '400', lineHeight: 1.6, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 18, presentation: 20, tablet: 16, mobile: 16 } },
  { id: 'text-2', role: 'Text 2', fontFamily: 'sans-serif', fontWeight: '400', lineHeight: 1.6, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 16, presentation: 18, tablet: 14, mobile: 14 } },
  { id: 'caption', role: 'Caption', fontFamily: 'sans-serif', fontWeight: '400', lineHeight: 1.5, previewText: DEFAULT_PREVIEW_TEXT, breakpoints: { desktop: 12, presentation: 14, tablet: 12, mobile: 12 } },
];

// ============================================
// TYPE HIERARCHY ROW
// ============================================

interface TypeHierarchyRowProps {
  row: TypeRow;
  breakpoint: Breakpoint;
  onPreviewTextChange: (id: string, text: string) => void;
}

function TypeHierarchyRow({ row, breakpoint, onPreviewTextChange }: TypeHierarchyRowProps) {
  const fontSize = row.breakpoints[breakpoint];
  // Cap preview font size to avoid layout blowout
  const previewFontSize = Math.min(fontSize, 48);

  return (
    <tr {...devProps('TypeHierarchyRow')} className="group border-b border-border-secondary hover:bg-bg-secondary transition-colors">
      {/* Role */}
      <td className="py-3 px-3 w-[110px] align-top">
        <span className="text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">{row.role}</span>
      </td>

      {/* Preview */}
      <td className="py-3 px-3 align-top">
        <div
          className="w-full min-h-[40px] text-fg-primary leading-tight"
          style={{
            fontFamily: `"${row.fontFamily}", sans-serif`,
            fontSize: `${previewFontSize}px`,
            fontWeight: row.fontWeight,
            lineHeight: row.lineHeight,
          }}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onPreviewTextChange(row.id, e.currentTarget.textContent || DEFAULT_PREVIEW_TEXT)}
            className="focus:outline-hidden cursor-text"
          >
            {row.previewText}
          </span>
        </div>
      </td>

      {/* Specs */}
      <td className="py-3 px-3 w-[140px] align-top hidden sm:table-cell">
        <div className="space-y-1 text-[10px] text-fg-tertiary font-mono">
          <div>{fontSize}px / {row.fontWeight}</div>
          <div>lh {row.lineHeight}</div>
        </div>
      </td>

      {/* Family */}
      <td className="py-3 px-3 w-[160px] align-top hidden md:table-cell">
        <span className="text-[10px] text-fg-tertiary truncate block">{row.fontFamily}</span>
      </td>
    </tr>
  );
}

// ============================================
// TYPE HIERARCHY TABLE (with breakpoint tabs)
// ============================================

interface TypeHierarchyTableProps {
  fonts: BrandFont[];
}

function TypeHierarchyTable({ fonts }: TypeHierarchyTableProps) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  const [showAutoConfirm, setShowAutoConfirm] = useState(false);

  // Derive font families from the uploaded fonts prop.
  // Display-role fonts are used for headings; body-role fonts for text rows.
  // Falls back to DEFAULT_TYPE_ROWS values when no matching font is uploaded.
  const derivedRows = useMemo<TypeRow[]>(() => {
    const displayFont = fonts.find((f) => f.metadata?.usage === 'display')?.metadata?.fontFamily;
    const bodyFont = fonts.find((f) => f.metadata?.usage === 'body')?.metadata?.fontFamily;
    const accentFont = fonts.find((f) => f.metadata?.usage === 'accent')?.metadata?.fontFamily;

    if (!displayFont && !bodyFont && !accentFont) return DEFAULT_TYPE_ROWS;

    return DEFAULT_TYPE_ROWS.map((row) => {
      const isHeading = ['display-1', 'display-2', 'display-3', 'h1', 'h2', 'h3', 'h4'].includes(row.id);
      const isAccent = row.id.startsWith('subheading');
      if (isAccent && accentFont) return { ...row, fontFamily: accentFont };
      if (isHeading && displayFont) return { ...row, fontFamily: displayFont };
      if (!isHeading && !isAccent && bodyFont) return { ...row, fontFamily: bodyFont };
      return row;
    });
  }, [fonts]);

  const [rows, setRows] = useState<TypeRow[]>(derivedRows);

  // Re-sync rows when derived font families change (e.g., a new font is uploaded).
  useEffect(() => {
    setRows(derivedRows);
  }, [derivedRows]);

  const handlePreviewTextChange = useCallback((id: string, text: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, previewText: text } : r));
  }, []);

  const handleAutoGenerate = useCallback(() => {
    setRows(prev => autoGenerateBreakpoints(prev));
    setShowAutoConfirm(false);
  }, []);

  return (
    <div {...devProps('TypeHierarchyTable')} className="rounded-xl border border-border-secondary bg-bg-primary overflow-hidden mb-4">
      {/* Header with breakpoint tabs */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-secondary bg-bg-secondary">
        <h3 className="text-sm font-semibold text-fg-primary">Type Hierarchy</h3>

        <div className="flex items-center gap-2">
          {/* Breakpoint tabs */}
          <div className="flex items-center gap-0.5 p-0.5 bg-bg-primary rounded-lg border border-border-primary">
            {(Object.keys(BREAKPOINT_LABELS) as Breakpoint[]).map((bp) => (
              <button
                key={bp}
                onClick={() => setBreakpoint(bp)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  breakpoint === bp
                    ? 'bg-bg-secondary text-fg-primary shadow-sm'
                    : 'text-fg-tertiary hover:text-fg-secondary'
                }`}
              >
                {BREAKPOINT_LABELS[bp]}
              </button>
            ))}
          </div>

          {/* Auto-generate button — only useful for non-desktop tabs */}
          {breakpoint !== 'desktop' && (
            <div className="relative">
              {showAutoConfirm ? (
                <div className="flex items-center gap-1">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={handleAutoGenerate}
                  >
                    Confirm
                  </Button>
                  <Button
                    color="tertiary"
                    size="sm"
                    onClick={() => setShowAutoConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  color="tertiary"
                  size="sm"
                  onClick={() => setShowAutoConfirm(true)}
                  title="Auto-generate sizes from Desktop values"
                >
                  Auto-generate
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Auto-generate notice */}
      {showAutoConfirm && (
        <div className="px-4 py-2 bg-bg-warning-primary border-b border-border-warning text-xs text-fg-warning-primary">
          This will overwrite all {BREAKPOINT_LABELS[breakpoint]} sizes with values proportionally scaled from Desktop. Continue?
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-bg-primary border-b border-border-secondary z-10">
            <tr>
              <th className="py-2 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[110px]">Role</th>
              <th className="py-2 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">
                Preview
                <span className="ml-2 font-normal text-fg-muted normal-case tracking-normal">(click to edit text)</span>
              </th>
              <th className="py-2 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[140px] hidden sm:table-cell">Specs</th>
              <th className="py-2 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[160px] hidden md:table-cell">Family</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <TypeHierarchyRow
                key={row.id}
                row={row}
                breakpoint={breakpoint}
                onPreviewTextChange={handlePreviewTextChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Inline typography/font management table content.
 * Displays static system fonts and dynamic user-uploaded fonts with
 * live font preview via CSS @font-face injection.
 *
 * Designed to be passed as `settingsContent` to BrandHubLayout,
 * replacing the old TypographySettingsTableModal overlay.
 */
interface TypographySettingsContentProps {
  /** Brand-specific static system fonts. Defaults to empty — pass from brand context. */
  staticFonts?: StaticFont[];
}

export function TypographySettingsContent({ staticFonts = DEFAULT_STATIC_FONTS }: TypographySettingsContentProps = {}) {
  const {
    fonts,
    isLoading,
    editFont,
    removeFont,
    uploadFontFile,
    refresh,
  } = useBrandFonts();

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditingFont | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sort state
  const [sortColumn, setSortColumn] = useState<SortColumn>('family');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter state
  const [filterUsage, setFilterUsage] = useState<FilterUsage>('all');
  const [filterFormat, setFilterFormat] = useState<FilterFormat>('all');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // ----------------------------------------
  // @font-face injection for dynamic fonts
  // ----------------------------------------
  useEffect(() => {
    const injected = new Set<string>();
    const styleRules: string[] = [];

    fonts.forEach((font) => {
      const meta = font.metadata as BrandFontMetadata;
      const family = meta.fontFamily;
      const weight = meta.fontWeight || '400';
      const key = `${font.id}`;
      const url = font.publicUrl;

      if (!injected.has(key) && url) {
        injected.add(key);
        const format =
          meta.fontFormat === 'woff2'
            ? 'woff2'
            : meta.fontFormat === 'woff'
              ? 'woff'
              : meta.fontFormat === 'ttf'
                ? 'truetype'
                : 'opentype';
        styleRules.push(
          `@font-face { font-family: "preview-${font.id}"; src: url("${url}") format("${format}"); font-weight: ${weight}; font-display: swap; }`
        );
      }
    });

    if (styleRules.length > 0) {
      const style = document.createElement('style');
      style.id = 'brand-font-previews';
      document.getElementById('brand-font-previews')?.remove();
      style.textContent = styleRules.join('\n');
      document.head.appendChild(style);
    }

    return () => {
      document.getElementById('brand-font-previews')?.remove();
    };
  }, [fonts]);

  // ----------------------------------------
  // Editing handlers
  // ----------------------------------------
  const handleStartEdit = useCallback((font: BrandFont) => {
    const meta = font.metadata as BrandFontMetadata;
    setEditingId(font.id);
    setEditValues({
      name: font.name,
      fontFamily: meta.fontFamily || font.name,
      fontWeight: meta.fontWeight || '400',
      usage: (meta.usage as FontUsage) || 'body',
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValues(null);
  }, []);

  const handleUpdateField = useCallback(<K extends keyof EditingFont>(
    field: K,
    value: EditingFont[K]
  ) => {
    setEditValues(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingId || !editValues) return;

    setIsSaving(true);
    setError(null);
    try {
      await editFont(editingId, {
        name: editValues.name,
        metadata: {
          fontFamily: editValues.fontFamily,
          fontWeight: editValues.fontWeight,
          usage: editValues.usage,
        },
      });
      setEditingId(null);
      setEditValues(null);
    } catch (err) {
      console.error('Error saving font:', err);
      setError(err instanceof Error ? err.message : 'Failed to save font');
    } finally {
      setIsSaving(false);
    }
  }, [editingId, editValues, editFont]);

  const handleDelete = useCallback(async (id: string) => {
    setIsSaving(true);
    setError(null);
    try {
      await removeFont(id);
    } catch (err) {
      console.error('Error deleting font:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete font');
    } finally {
      setIsSaving(false);
    }
  }, [removeFont]);

  const handleDownloadFont = useCallback((font: BrandFont) => {
    if (font.publicUrl) {
      const link = document.createElement('a');
      link.href = font.publicUrl;
      link.download = font.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handleDownloadStaticFont = useCallback((path: string, filename: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Upload handler passed to BrandAssetUploadModal
  const handleUpload = useCallback(
    async (file: File, metadata: Record<string, unknown>): Promise<unknown> => {
      const name = (metadata.name as string) || file.name;
      const fontMeta: BrandFontMetadata = {
        fontFamily: (metadata.fontFamily as string) || name,
        fontWeight: ((metadata.fontWeight as string) || '400') as FontWeight,
        fontFormat: ((metadata.fontFormat as string) || 'woff2') as FontFormat,
        usage: (metadata.usage as string) || 'body',
      };
      return uploadFontFile(file, name, fontMeta);
    },
    [uploadFontFile]
  );

  // ----------------------------------------
  // Sort handler
  // ----------------------------------------
  const handleSort = useCallback((column: SortColumn) => {
    setSortColumn(prev => {
      if (prev === column) {
        setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
        return column;
      }
      setSortDirection('asc');
      return column;
    });
  }, []);

  // ----------------------------------------
  // Build unified row list (static + dynamic)
  // ----------------------------------------
  type UnifiedFont =
    | { type: 'static'; font: StaticFont }
    | { type: 'dynamic'; font: BrandFont };

  const filteredAndSortedFonts = useMemo(() => {
    // Build unified list
    const unified: UnifiedFont[] = [];

    // Static fonts
    staticFonts.forEach(f => {
      unified.push({ type: 'static', font: f });
    });

    // Dynamic fonts
    fonts.forEach(f => {
      unified.push({ type: 'dynamic', font: f });
    });

    // Extract sort/filter fields
    const getFields = (item: UnifiedFont) => {
      if (item.type === 'static') {
        return {
          family: item.font.family,
          weight: item.font.weight,
          usage: item.font.usage,
          format: item.font.format,
        };
      }
      const meta = item.font.metadata as BrandFontMetadata;
      return {
        family: meta.fontFamily || item.font.name,
        weight: meta.fontWeight || '400',
        usage: (meta.usage as FontUsage) || 'body',
        format: meta.fontFormat || 'woff2',
      };
    };

    // Filter
    let filtered = unified;

    if (filterUsage !== 'all') {
      filtered = filtered.filter(item => getFields(item).usage === filterUsage);
    }

    if (filterFormat !== 'all') {
      filtered = filtered.filter(item => getFields(item).format === filterFormat);
    }

    // Sort
    filtered.sort((a, b) => {
      const aFields = getFields(a);
      const bFields = getFields(b);
      let cmp = 0;

      switch (sortColumn) {
        case 'family':
          cmp = aFields.family.localeCompare(bFields.family);
          break;
        case 'weight':
          cmp = parseInt(aFields.weight) - parseInt(bFields.weight);
          break;
        case 'usage': {
          const order = ['display', 'body', 'accent'];
          cmp = order.indexOf(aFields.usage) - order.indexOf(bFields.usage);
          break;
        }
        case 'format':
          cmp = aFields.format.localeCompare(bFields.format);
          break;
      }

      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [fonts, sortColumn, sortDirection, filterUsage, filterFormat]);

  const hasActiveFilters = filterUsage !== 'all' || filterFormat !== 'all';
  const totalFontCount = staticFonts.length + fonts.length;

  // ----------------------------------------
  // Render
  // ----------------------------------------

  if (isLoading) {
    return (
      <div {...devProps('TypographySettingsContent')}>
        <div className="rounded-xl border border-border-secondary bg-bg-primary overflow-hidden mb-4">
          <div className="flex items-center justify-center py-16 gap-3">
            <Loading01 className="w-5 h-5 animate-spin text-fg-brand-primary" />
            <span className="text-fg-tertiary text-sm">Loading fonts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div {...devProps('TypographySettingsContent')}>
      {/* Type Hierarchy section with breakpoint tabs */}
      <TypeHierarchyTable fonts={fonts} />

      {/* Font Management table */}
      <div className="rounded-xl border border-border-secondary bg-bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border-secondary">
        <div>
          <h3 className="text-sm font-semibold text-fg-primary">
            Font Management
          </h3>
          <p className="text-xs text-fg-tertiary mt-0.5">
            {totalFontCount} font{totalFontCount !== 1 ? 's' : ''} in your typography system
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter dropdown */}
          <FilterDropdown
            filterUsage={filterUsage}
            filterFormat={filterFormat}
            onUsageChange={setFilterUsage}
            onFormatChange={setFilterFormat}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Add font button */}
          <motion.button
            onClick={() => setIsUploadOpen(true)}
            className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-brand-primary border border-border-primary hover:border-border-brand transition-colors group"
            title="Upload new font"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4 text-fg-tertiary group-hover:text-fg-brand-primary transition-colors" />
          </motion.button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 sm:mx-5 mt-3 px-4 py-3 rounded-lg bg-bg-error-primary border border-border-error text-fg-error-primary text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button color="tertiary" size="sm" onClick={() => setError(null)} className="!p-1 [&_svg]:!size-3.5" aria-label="Dismiss error">
            <XClose />
          </Button>
        </div>
      )}

      {/* Table */}
      {filteredAndSortedFonts.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Type01 className="w-8 h-8 text-fg-tertiary mb-3" />
          <p className="text-sm text-fg-secondary mb-1">
            {hasActiveFilters ? 'No fonts match the current filters.' : 'No fonts uploaded yet.'}
          </p>
          <p className="text-xs text-fg-tertiary">
            {hasActiveFilters ? 'Try adjusting your filters.' : 'Click + to upload your first font file.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead className="sticky top-0 bg-bg-primary border-b border-border-secondary z-10">
              <tr>
                {/* Preview column - not sortable */}
                <th className="py-2.5 px-2 sm:px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[48px]">
                  Preview
                </th>
                {/* Name - not a sort column but always shown */}
                <th className="py-2.5 px-2 sm:px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[140px] md:w-[200px]">
                  Name
                </th>
                <SortableHeader
                  label="Usage"
                  column="usage"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[90px]"
                />
                <SortableHeader
                  label="Weight"
                  column="weight"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[80px] hidden sm:table-cell"
                />
                <SortableHeader
                  label="Format"
                  column="format"
                  currentSort={sortColumn}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[80px] hidden md:table-cell"
                />
                <th className="py-2.5 px-2 sm:px-3 text-right text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[60px]">
                  {/* Actions */}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedFonts.map((item) => {
                if (item.type === 'static') {
                  return (
                    <StaticFontRowInline
                      key={`static-${item.font.id}`}
                      font={item.font}
                      onDownload={handleDownloadStaticFont}
                    />
                  );
                }
                return (
                  <DynamicFontRowInline
                    key={item.font.id}
                    font={item.font}
                    isEditing={editingId === item.font.id}
                    editValues={editingId === item.font.id ? editValues : null}
                    onStartEdit={() => handleStartEdit(item.font)}
                    onCancelEdit={handleCancelEdit}
                    onUpdateField={handleUpdateField}
                    onSave={handleSaveEdit}
                    onDelete={() => handleDelete(item.font.id)}
                    onDownload={handleDownloadFont}
                    isSaving={isSaving}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 sm:px-5 py-3 border-t border-border-secondary bg-bg-secondary">
        <p className="text-[10px] sm:text-xs text-fg-muted">
          <span className="hidden sm:inline">Supported formats: WOFF2, WOFF, TTF, OTF. System fonts cannot be deleted.</span>
          <span className="sm:hidden">WOFF2, WOFF, TTF, OTF supported.</span>
        </p>
      </div>

      {/* Upload modal */}
      <BrandAssetUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        assetType="font"
        uploadFn={handleUpload}
        onUploadComplete={() => { setIsUploadOpen(false); refresh(); }}
      />
      </div>
      {/* end font management table */}
    </div>
  );
}

// ============================================
// STATIC FONT ROW (Inline variant)
// ============================================

interface StaticFontRowInlineProps {
  font: StaticFont;
  onDownload: (path: string, name: string) => void;
}

function StaticFontRowInline({ font, onDownload }: StaticFontRowInlineProps) {
  const nameFormatted = `${font.family} ${weightLabel(font.weight)}`;

  return (
    <tr {...devProps('StaticFontRowInline')} className="group border-b border-border-secondary hover:bg-bg-secondary transition-colors">
      {/* Preview - rendered in the actual pre-loaded font */}
      <td className="py-2 px-2 sm:px-3 w-[48px]">
        <FontPreviewCell
          fontFamily={font.family}
          fontWeight={font.weight}
          hasValidUrl={true}
        />
      </td>

      {/* Name */}
      <td className="py-2 px-2 sm:px-3">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-fg-primary truncate">
            {nameFormatted}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-bg-tertiary text-fg-muted flex-shrink-0">
            System
          </span>
        </div>
      </td>

      {/* Usage */}
      <td className="py-2 px-2 sm:px-3">
        <span className={`inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded capitalize ${getUsageColor(font.usage)}`}>
          {font.usage}
        </span>
      </td>

      {/* Weight */}
      <td className="py-2 px-2 sm:px-3 hidden sm:table-cell">
        <span className="text-[10px] sm:text-xs text-fg-tertiary">
          {font.weight} · {weightLabel(font.weight)}
        </span>
      </td>

      {/* Format */}
      <td className="py-2 px-2 sm:px-3 hidden md:table-cell">
        <span className="text-[10px] font-mono text-fg-muted uppercase">
          {font.format}
        </span>
      </td>

      {/* Actions - only download for system fonts */}
      <td className="py-2 px-2 sm:px-3">
        <div className="flex items-center justify-end">
          <Button
            color="tertiary"
            size="sm"
            iconLeading={Download01}
            onClick={() => onDownload(font.path, `${font.id}.${font.format}`)}
            aria-label="Download"
            className="sm:opacity-0 sm:group-hover:opacity-100 transition-all"
          />
        </div>
      </td>
    </tr>
  );
}

// ============================================
// DYNAMIC FONT ROW (Inline variant)
// ============================================

interface DynamicFontRowInlineProps {
  font: BrandFont;
  isEditing: boolean;
  editValues: EditingFont | null;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onUpdateField: <K extends keyof EditingFont>(field: K, value: EditingFont[K]) => void;
  onSave: () => void;
  onDelete: () => void;
  onDownload: (font: BrandFont) => void;
  isSaving: boolean;
}

function DynamicFontRowInline({
  font,
  isEditing,
  editValues,
  onStartEdit,
  onCancelEdit,
  onUpdateField,
  onSave,
  onDelete,
  onDownload,
  isSaving,
}: DynamicFontRowInlineProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const meta = font.metadata as BrandFontMetadata;
  const fontWeight = meta.fontWeight || '400';
  const fontFamily = meta.fontFamily || font.name;
  const usage = (meta.usage as FontUsage) || 'body';
  const format = meta.fontFormat || 'woff2';
  const hasValidUrl = !!font.publicUrl;
  const previewFontFamily = `preview-${font.id}`;
  const nameFormatted = `${fontFamily} ${weightLabel(fontWeight)}`;

  return (
    <>
      <tr {...devProps('DynamicFontRowInline')} className={`group border-b border-border-secondary hover:bg-bg-secondary transition-colors ${
        isEditing ? 'bg-bg-secondary' : ''
      }`}>
        {/* Preview - rendered via @font-face injection */}
        <td className="py-2 px-2 sm:px-3 w-[48px]">
          <FontPreviewCell
            fontFamily={fontFamily}
            fontWeight={isEditing && editValues ? editValues.fontWeight : fontWeight}
            previewFontFamily={previewFontFamily}
            hasValidUrl={hasValidUrl}
          />
        </td>

        {/* Name */}
        <td className="py-2 px-2 sm:px-3">
          {isEditing && editValues ? (
            <div className="flex flex-col gap-1">
              <Input
                aria-label="Display name"
                value={editValues.name}
                onChange={(v) => onUpdateField('name', v)}
                placeholder="Display name"
                size="sm"
              />
              <Input
                aria-label="Font family"
                value={editValues.fontFamily}
                onChange={(v) => onUpdateField('fontFamily', v)}
                placeholder="Font family"
                size="sm"
              />
            </div>
          ) : (
            <span className="text-xs sm:text-sm font-medium text-fg-primary truncate block">
              {nameFormatted}
            </span>
          )}
        </td>

        {/* Usage */}
        <td className="py-2 px-2 sm:px-3">
          {isEditing && editValues ? (
            <Select
              aria-label="Font usage"
              placeholder="Usage"
              size="sm"
              items={USAGE_ITEMS}
              selectedKey={editValues.usage}
              onSelectionChange={(key) => {
                if (key !== null) onUpdateField('usage', key as FontUsage);
              }}
            >
              {(item: SelectItemType) => (
                <Select.Item
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  supportingText={item.supportingText}
                />
              )}
            </Select>
          ) : (
            <span className={`inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded capitalize ${getUsageColor(usage)}`}>
              {usage}
            </span>
          )}
        </td>

        {/* Weight */}
        <td className="py-2 px-2 sm:px-3 hidden sm:table-cell">
          {isEditing && editValues ? (
            <Select
              aria-label="Font weight"
              placeholder="Weight"
              size="sm"
              items={WEIGHT_ITEMS}
              selectedKey={editValues.fontWeight}
              onSelectionChange={(key) => {
                if (key !== null) onUpdateField('fontWeight', key as FontWeight);
              }}
            >
              {(item: SelectItemType) => (
                <Select.Item
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  supportingText={item.supportingText}
                />
              )}
            </Select>
          ) : (
            <span className="text-[10px] sm:text-xs text-fg-tertiary">
              {fontWeight} · {weightLabel(fontWeight)}
            </span>
          )}
        </td>

        {/* Format */}
        <td className="py-2 px-2 sm:px-3 hidden md:table-cell">
          <span className="text-[10px] font-mono text-fg-muted uppercase">
            {format}
          </span>
        </td>

        {/* Actions */}
        <td className="py-2 px-2 sm:px-3">
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            {isEditing ? (
              <>
                <Button
                  color="primary"
                  size="sm"
                  iconLeading={Check}
                  isLoading={isSaving}
                  onClick={onSave}
                  aria-label="Save"
                />
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={XClose}
                  onClick={onCancelEdit}
                  aria-label="Cancel"
                />
              </>
            ) : (
              <>
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={Download01}
                  onClick={() => onDownload(font)}
                  aria-label="Download"
                  className="sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                />
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={Pencil01}
                  onClick={onStartEdit}
                  aria-label="Edit"
                  className="sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                />
                <Button
                  color="tertiary-destructive"
                  size="sm"
                  iconLeading={Trash01}
                  onClick={() => setShowDeleteConfirm(true)}
                  aria-label="Delete"
                  className="sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                />
              </>
            )}
          </div>
        </td>
      </tr>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteConfirm(false);
        }}
        title="Delete Font"
        message={`Are you sure you want to delete "${font.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}

