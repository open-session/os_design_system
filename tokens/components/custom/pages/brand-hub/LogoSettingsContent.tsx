'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Download01,
  Edit01,
  Image01 as ImageIcon,
  Loading01,
  Plus,
  Trash01,
  XClose,
} from '@untitledui-pro/icons/line';
import { useBrandLogos, DEFAULT_LOGO_TYPES, DEFAULT_VARIANTS, DEFAULT_CATEGORIES } from '@/hooks/useBrandLogos';
import { Button } from '@/components/base/base/buttons/button';
import { Select } from '@/components/base/base/select/select';
import type { SelectItemType } from '@/components/base/base/select/select';
import { devProps } from '@/lib/utils/dev-props';
import { BrandAssetUploadModal } from './BrandAssetUploadModal';
import type { BrandLogo, BrandLogoMetadata, BrandLogoVariant, BrandLogoType, BrandLogoCategory } from '@/lib/supabase/types';

// ============================================
// TYPES
// ============================================

type SortColumn = 'name' | 'category' | 'type';
type SortDirection = 'asc' | 'desc';
type FilterCategory = 'all' | 'main' | 'accessory';

interface LogoSettingsContentProps {
  /** Optional callback when the user requests to close the settings view */
  onRequestClose?: () => void;
  /** Brand slug used to build storage URLs for static system logos. Resolved from env var. */
  brandSlug?: string;
}

// ============================================
// STATIC SYSTEM LOGOS (Pre-populated from brand assets)
// ============================================

interface StaticLogo {
  id: string;
  name: string;
  category: 'main' | 'accessory';
  logoType: string;
  variants: { variant: string; path: string }[];
}

// Default brand slug — must be set via NEXT_PUBLIC_DEFAULT_BRAND_SLUG env var.
// Falls back to 'open-session' to avoid malformed double-slash storage URLs.
const DEFAULT_BRAND_SLUG = process.env.NEXT_PUBLIC_DEFAULT_BRAND_SLUG || 'open-session';

function getLogoUrl(filename: string, brandSlug: string = DEFAULT_BRAND_SLUG): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/brand-assets/${brandSlug}/logos/${filename}`;
}

function buildStaticSystemLogos(brandSlug: string = DEFAULT_BRAND_SLUG): StaticLogo[] {
  return [
    {
      id: 'brandmark',
      name: 'Brandmark',
      category: 'main',
      logoType: 'brandmark',
      variants: [
        { variant: 'vanilla', path: getLogoUrl('brandmark-vanilla.svg', brandSlug) },
        { variant: 'glass', path: getLogoUrl('brandmark-glass.svg', brandSlug) },
        { variant: 'charcoal', path: getLogoUrl('brandmark-charcoal.svg', brandSlug) },
      ],
    },
    {
      id: 'combo',
      name: 'Combo',
      category: 'main',
      logoType: 'combo',
      variants: [
        { variant: 'vanilla', path: getLogoUrl('logo_main_combo_vanilla.svg', brandSlug) },
        { variant: 'glass', path: getLogoUrl('logo_main_combo_glass.svg', brandSlug) },
        { variant: 'charcoal', path: getLogoUrl('logo_main_combo_charcoal.svg', brandSlug) },
      ],
    },
    {
      id: 'stacked',
      name: 'Stacked',
      category: 'main',
      logoType: 'stacked',
      variants: [
        { variant: 'vanilla', path: getLogoUrl('stacked-vanilla.svg', brandSlug) },
        { variant: 'glass', path: getLogoUrl('stacked-glass.svg', brandSlug) },
        { variant: 'charcoal', path: getLogoUrl('stacked-charcoal.svg', brandSlug) },
      ],
    },
    {
      id: 'horizontal',
      name: 'Horizontal',
      category: 'main',
      logoType: 'horizontal',
      variants: [
        { variant: 'vanilla', path: getLogoUrl('horizontal-vanilla.svg', brandSlug) },
        { variant: 'glass', path: getLogoUrl('horizontal-glass.svg', brandSlug) },
        { variant: 'charcoal', path: getLogoUrl('horizontal-charcoal.svg', brandSlug) },
      ],
    },
    {
      id: 'core',
      name: 'Monogram',
      category: 'accessory',
      logoType: 'core',
      variants: [
        { variant: 'vanilla', path: getLogoUrl('core.svg', brandSlug) },
        { variant: 'glass', path: getLogoUrl('core-glass.svg', brandSlug) },
        { variant: 'charcoal', path: getLogoUrl('core-charcoal.svg', brandSlug) },
      ],
    },
    {
      id: 'outline',
      name: 'Outline',
      category: 'accessory',
      logoType: 'outline',
      variants: [
        { variant: 'vanilla', path: getLogoUrl('outline.svg', brandSlug) },
        { variant: 'glass', path: getLogoUrl('outline-glass.svg', brandSlug) },
        { variant: 'charcoal', path: getLogoUrl('outline-charcoal.svg', brandSlug) },
      ],
    },
    {
      id: 'filled',
      name: 'Filled',
      category: 'accessory',
      logoType: 'filled',
      variants: [
        { variant: 'vanilla', path: getLogoUrl('filled.svg', brandSlug) },
        { variant: 'glass', path: getLogoUrl('filled-glass.svg', brandSlug) },
        { variant: 'charcoal', path: getLogoUrl('filled-charcoal.svg', brandSlug) },
      ],
    },
  ];
}

/** @deprecated Use buildStaticSystemLogos(brandSlug) for multi-tenant correctness */
export const STATIC_SYSTEM_LOGOS: StaticLogo[] = buildStaticSystemLogos();

// ============================================
// CUSTOM SELECT WITH "ADD NEW" OPTION
// ============================================

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean;
  formatLabel?: (value: string) => string;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  formatLabel = (v: string) => v.charAt(0).toUpperCase() + v.slice(1),
}: CustomSelectProps) {
  const items: SelectItemType[] = useMemo(
    () => options.map((opt) => ({ id: opt, label: formatLabel(opt) })),
    [options, formatLabel]
  );

  return (
    <div {...devProps('CustomSelect')}>
      <Select
        aria-label={placeholder}
        placeholder={placeholder}
        size="sm"
        items={items}
        selectedKey={value || undefined}
        onSelectionChange={(key) => {
          if (key !== null) onChange(key as string);
        }}
      >
        {(item: SelectItemType) => (
          <Select.Item key={item.id} id={item.id} label={item.label} />
        )}
      </Select>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatLabel(value: string): string {
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================
// CATEGORY BADGE COMPONENT
// ============================================

function CategoryBadge({ category }: { category: string }) {
  const isMain = category === 'main';
  return (
    <span
      {...devProps('CategoryBadge')}
      className={`inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded ${
        isMain
          ? 'bg-bg-brand-section text-fg-brand-primary'
          : 'bg-bg-tertiary text-fg-secondary'
      }`}
    >
      {formatLabel(category)}
    </span>
  );
}

// ============================================
// SORTABLE COLUMN HEADER
// ============================================

interface SortableHeaderProps {
  label: string;
  column: SortColumn;
  currentSort: SortColumn;
  currentDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string;
}

function SortableHeader({ label, column, currentSort, currentDirection, onSort, className }: SortableHeaderProps) {
  const isActive = currentSort === column;
  return (
    <th
      {...devProps('SortableHeader')}
      className={`py-2.5 px-2 sm:px-3 text-left text-[10px] font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-fg-secondary transition-colors ${
        isActive ? 'text-fg-primary' : 'text-fg-tertiary'
      } ${className || ''}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive && (
          currentDirection === 'asc'
            ? <ArrowUp className="w-3 h-3" />
            : <ArrowDown className="w-3 h-3" />
        )}
      </div>
    </th>
  );
}

// ============================================
// STATIC SYSTEM LOGO ROW
// ============================================

interface StaticLogoRowProps {
  logo: StaticLogo;
  onDownload: (path: string, name: string) => void;
}

function StaticLogoRow({ logo, onDownload }: StaticLogoRowProps) {
  const previewPath = logo.variants[0]?.path || '';
  const variantCount = logo.variants.length;

  return (
    <tr {...devProps('StaticLogoRow')} className="group border-b border-border-secondary hover:bg-bg-tertiary transition-colors">
      {/* Preview */}
      <td className="py-2 px-2 sm:px-3 w-[50px] sm:w-[60px]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-charcoal border border-border-primary flex items-center justify-center overflow-hidden">
          <img
            src={previewPath}
            alt={logo.name}
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
          />
        </div>
      </td>

      {/* Name */}
      <td className="py-2 px-2 sm:px-3 w-[100px] sm:w-[140px] md:w-[180px]">
        <span className="text-xs sm:text-sm font-medium text-fg-primary truncate block">
          {logo.name}
        </span>
      </td>

      {/* Category */}
      <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
        <CategoryBadge category={logo.category} />
      </td>

      {/* Type */}
      <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
        <span className="text-[10px] sm:text-xs text-fg-secondary">
          {formatLabel(logo.logoType)}
        </span>
      </td>

      {/* Variant - hidden on mobile */}
      <td className="py-2 px-2 sm:px-3 w-[70px] sm:w-[90px] hidden sm:table-cell">
        <span className="text-[10px] sm:text-xs text-fg-tertiary">
          {variantCount} variant{variantCount !== 1 ? 's' : ''}
        </span>
      </td>

      {/* Format - hidden on mobile and tablet */}
      <td className="py-2 px-2 sm:px-3 w-[50px] sm:w-[60px] hidden md:table-cell">
        <span className="text-[10px] font-mono text-fg-muted uppercase">
          svg
        </span>
      </td>

      {/* Actions */}
      <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
        <div className="flex items-center justify-end gap-1">
          <span className="text-[9px] text-fg-muted px-1.5 py-0.5 rounded bg-bg-tertiary">
            System
          </span>
          <Button
            color="tertiary"
            size="sm"
            onClick={() => onDownload(previewPath, `${logo.id}-vanilla.svg`)}
            className="!p-1 sm:!p-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all [&_svg]:!size-3 sm:[&_svg]:!size-3.5"
            aria-label="Download"
          >
            <Download01 />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ============================================
// DYNAMIC LOGO ROW (with edit mode)
// ============================================

interface DynamicLogoRowProps {
  logo: BrandLogo;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (updates: { name: string; category: BrandLogoCategory; logoType: string; variant: string }) => void;
  onDownload: (logo: BrandLogo) => void;
  onDelete: (logo: BrandLogo) => void;
  availableTypes: string[];
  availableVariants: string[];
  isSaving: boolean;
  canDelete: boolean;
}

function DynamicLogoRow({
  logo,
  isEditing,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDownload,
  onDelete,
  availableTypes,
  availableVariants,
  isSaving,
  canDelete,
}: DynamicLogoRowProps) {
  const meta = logo.metadata as BrandLogoMetadata;
  const category = meta.logoCategory || (meta.isAccessory ? 'accessory' : 'main');
  const logoType = meta.logoType || 'other';
  const variant = logo.variant || meta.variant || 'default';

  // Edit state
  const [editName, setEditName] = useState(logo.name);
  const [editCategory, setEditCategory] = useState<BrandLogoCategory>(category as BrandLogoCategory);
  const [editLogoType, setEditLogoType] = useState(logoType);
  const [editVariant, setEditVariant] = useState(variant);

  // Reset edit state when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditName(logo.name);
      setEditCategory(category as BrandLogoCategory);
      setEditLogoType(logoType);
      setEditVariant(variant);
    }
  }, [isEditing, logo.name, category, logoType, variant]);

  const handleSave = () => {
    onSaveEdit({
      name: editName,
      category: editCategory,
      logoType: editLogoType,
      variant: editVariant,
    });
  };

  if (isEditing) {
    return (
      <tr {...devProps('DynamicLogoRow')} className="border-b border-border-brand bg-bg-brand-section">
        {/* Preview */}
        <td className="py-2 px-2 sm:px-3 w-[50px] sm:w-[60px]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-bg-tertiary border border-border-primary flex items-center justify-center overflow-hidden">
            {logo.publicUrl ? (
              <img src={logo.publicUrl} alt={logo.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            ) : (
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-fg-muted" />
            )}
          </div>
        </td>

        {/* Name (editable) */}
        <td className="py-2 px-2 sm:px-3 w-[100px] sm:w-[140px] md:w-[180px]">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-2 py-1 text-xs sm:text-sm rounded border border-border-brand bg-bg-primary text-fg-primary focus:outline-hidden"
          />
        </td>

        {/* Category (editable) */}
        <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
          <CustomSelect
            value={editCategory}
            onChange={(v) => setEditCategory(v as BrandLogoCategory)}
            options={DEFAULT_CATEGORIES}
            formatLabel={formatLabel}
            allowCustom={false}
          />
        </td>

        {/* Type (editable) */}
        <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
          <CustomSelect
            value={editLogoType}
            onChange={setEditLogoType}
            options={availableTypes}
            formatLabel={formatLabel}
            allowCustom={true}
          />
        </td>

        {/* Variant (editable) - hidden on mobile */}
        <td className="py-2 px-2 sm:px-3 w-[70px] sm:w-[90px] hidden sm:table-cell">
          <CustomSelect
            value={editVariant}
            onChange={setEditVariant}
            options={availableVariants}
            formatLabel={formatLabel}
            allowCustom={true}
          />
        </td>

        {/* Format */}
        <td className="py-2 px-2 sm:px-3 w-[50px] sm:w-[60px] hidden md:table-cell">
          <span className="text-[10px] font-mono text-fg-muted uppercase">
            {logo.mimeType?.split('/')[1] || 'svg'}
          </span>
        </td>

        {/* Actions (save / cancel) */}
        <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <Button
              color="primary"
              size="sm"
              onClick={handleSave}
              isDisabled={isSaving || !editName.trim()}
              className="!p-1 sm:!p-1.5 [&_svg]:!size-3 sm:[&_svg]:!size-3.5"
              aria-label="Save changes"
            >
              {isSaving ? (
                <Loading01 className="animate-spin" />
              ) : (
                <Check />
              )}
            </Button>
            <Button
              color="tertiary"
              size="sm"
              onClick={onCancelEdit}
              className="!p-1 sm:!p-1.5 [&_svg]:!size-3 sm:[&_svg]:!size-3.5"
              aria-label="Cancel"
            >
              <XClose />
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr {...devProps('DynamicLogoRow')} className="group border-b border-border-secondary hover:bg-bg-tertiary transition-colors">
      {/* Preview */}
      <td className="py-2 px-2 sm:px-3 w-[50px] sm:w-[60px]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-bg-tertiary border border-border-primary flex items-center justify-center overflow-hidden">
          {logo.publicUrl ? (
            <img src={logo.publicUrl} alt={logo.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
          ) : (
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-fg-muted" />
          )}
        </div>
      </td>

      {/* Name */}
      <td className="py-2 px-2 sm:px-3 w-[100px] sm:w-[140px] md:w-[180px]">
        <span className="text-xs sm:text-sm font-medium text-fg-primary truncate block">
          {logo.name}
        </span>
      </td>

      {/* Category */}
      <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
        <CategoryBadge category={category} />
      </td>

      {/* Type */}
      <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
        <span className="text-[10px] sm:text-xs text-fg-secondary">
          {formatLabel(logoType)}
        </span>
      </td>

      {/* Variant - hidden on mobile */}
      <td className="py-2 px-2 sm:px-3 w-[70px] sm:w-[90px] hidden sm:table-cell">
        <span className="text-[10px] sm:text-xs text-fg-tertiary truncate block" title={formatLabel(variant)}>
          {formatLabel(variant)}
        </span>
      </td>

      {/* Format - hidden on mobile and tablet */}
      <td className="py-2 px-2 sm:px-3 w-[50px] sm:w-[60px] hidden md:table-cell">
        <span className="text-[10px] font-mono text-fg-muted uppercase">
          {logo.mimeType?.split('/')[1] || 'svg'}
        </span>
      </td>

      {/* Actions */}
      <td className="py-2 px-2 sm:px-3 w-[80px] sm:w-[100px]">
        <div className="flex items-center justify-end gap-0.5">
          <Button
            color="tertiary"
            size="sm"
            onClick={onEdit}
            className="!p-1 sm:!p-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all [&_svg]:!size-3 sm:[&_svg]:!size-3.5"
            aria-label="Edit"
          >
            <Edit01 />
          </Button>
          <Button
            color="tertiary"
            size="sm"
            onClick={() => onDownload(logo)}
            className="!p-1 sm:!p-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all [&_svg]:!size-3 sm:[&_svg]:!size-3.5"
            aria-label="Download"
          >
            <Download01 />
          </Button>
          {canDelete && (
            <Button
              color="tertiary"
              size="sm"
              onClick={() => onDelete(logo)}
              className="!p-1 sm:!p-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all text-fg-error-primary [&_svg]:!size-3 sm:[&_svg]:!size-3.5"
              aria-label="Delete"
            >
              <Trash01 />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Inline logo management table content.
 * Extracted from LogoSettingsTableModal for use with BrandHubLayout settingsContent prop.
 * Provides sort, filter, row-level editing, upload trigger, and system logo protection.
 */
export function LogoSettingsContent({ onRequestClose, brandSlug }: LogoSettingsContentProps) {
  const {
    logos,
    isLoading,
    editLogo,
    removeLogo,
    uploadLogoFile,
    refresh,
    availableTypes,
    availableVariants,
    canDeleteLogo,
  } = useBrandLogos();

  // Build static logos with the correct brand slug for storage URL paths
  const staticSystemLogos = useMemo(
    () => buildStaticSystemLogos(brandSlug),
    [brandSlug]
  );

  // Sort state
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter state
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Handle sort column click
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

  // Sort and filter static logos
  const processedStaticLogos = useMemo(() => {
    let filtered = [...staticSystemLogos];

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(l => l.category === filterCategory);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(l => l.logoType === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortColumn) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
        case 'type':
          cmp = a.logoType.localeCompare(b.logoType);
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [staticSystemLogos, filterCategory, filterType, sortColumn, sortDirection]);

  // Sort and filter dynamic logos
  const processedDynamicLogos = useMemo(() => {
    let filtered = [...logos];

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(l => {
        const meta = l.metadata as BrandLogoMetadata;
        const cat = meta.logoCategory || (meta.isAccessory ? 'accessory' : 'main');
        return cat === filterCategory;
      });
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(l => {
        const meta = l.metadata as BrandLogoMetadata;
        return meta.logoType === filterType;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const metaA = a.metadata as BrandLogoMetadata;
      const metaB = b.metadata as BrandLogoMetadata;
      let cmp = 0;
      switch (sortColumn) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'category': {
          const catA = metaA.logoCategory || (metaA.isAccessory ? 'accessory' : 'main');
          const catB = metaB.logoCategory || (metaB.isAccessory ? 'accessory' : 'main');
          cmp = catA.localeCompare(catB);
          break;
        }
        case 'type': {
          const typeA = metaA.logoType || 'other';
          const typeB = metaB.logoType || 'other';
          cmp = typeA.localeCompare(typeB);
          break;
        }
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [logos, filterCategory, filterType, sortColumn, sortDirection]);

  const totalCount = staticSystemLogos.length + logos.length;

  // Download handlers
  const handleDownloadLogo = useCallback((logo: BrandLogo) => {
    if (logo.publicUrl) {
      const link = document.createElement('a');
      link.href = logo.publicUrl;
      link.download = logo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handleDownloadStaticLogo = useCallback((path: string, filename: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Edit handler
  const handleSaveEdit = useCallback(async (
    logoId: string,
    updates: { name: string; category: BrandLogoCategory; logoType: string; variant: string }
  ) => {
    setIsSaving(true);
    setError(null);
    try {
      const metadata: BrandLogoMetadata = {
        logoCategory: updates.category,
        logoType: updates.logoType as BrandLogoType,
        variant: updates.variant as BrandLogoVariant,
        isAccessory: updates.category === 'accessory',
      };
      await editLogo(logoId, {
        name: updates.name,
        variant: updates.variant,
        metadata,
      });
      setEditingId(null);
    } catch (err) {
      console.error('Error saving logo edit:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [editLogo]);

  // Delete handler
  const handleDeleteLogo = useCallback(async (logo: BrandLogo) => {
    if (!confirm(`Delete "${logo.name}"? This action cannot be undone.`)) return;
    setError(null);
    try {
      await removeLogo(logo.id);
    } catch (err) {
      console.error('Error deleting logo:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete logo');
    }
  }, [removeLogo]);

  // Upload handler passed to BrandAssetUploadModal
  const handleUpload = useCallback(
    async (file: File, metadata: Record<string, unknown>): Promise<unknown> => {
      const name = (metadata.name as string) || file.name;
      const logoMetadata: BrandLogoMetadata = {
        logoCategory: (metadata.category as BrandLogoCategory) || 'main',
        logoType: (metadata.logoType as BrandLogoType) || 'other',
        variant: (metadata.variant as BrandLogoVariant) || 'default',
        isAccessory: (metadata.category as string) === 'accessory',
      };
      return uploadLogoFile(file, name, logoMetadata);
    },
    [uploadLogoFile]
  );

  // Collect unique types for filter dropdown
  const allTypeOptions = useMemo(() => {
    const types = new Set<string>();
    staticSystemLogos.forEach(l => types.add(l.logoType));
    logos.forEach(l => {
      const meta = l.metadata as BrandLogoMetadata;
      if (meta.logoType) types.add(meta.logoType);
    });
    return ['all', ...Array.from(types)];
  }, [staticSystemLogos, logos]);

  return (
    <div {...devProps('LogoSettingsContent')} className="w-full">
      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-bg-error-primary border border-border-error text-fg-error-primary text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button color="tertiary" size="sm" onClick={() => setError(null)} className="!p-1 [&_svg]:!size-3.5" aria-label="Dismiss error">
            <XClose />
          </Button>
        </div>
      )}

      {/* Table Card Shell */}
      <div className="overflow-hidden rounded-xl bg-bg-primary shadow-xs ring-1 ring-border-secondary">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border-secondary px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-fg-primary">Manage Logos</h2>
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-bg-brand-section text-fg-brand-primary">
                {totalCount} logo{totalCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
              className="px-2 py-1.5 text-xs rounded-lg border border-border-primary bg-bg-secondary text-fg-primary focus:outline-hidden focus:border-border-brand"
            >
              <option value="all">All categories</option>
              <option value="main">Main</option>
              <option value="accessory">Accessory</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2 py-1.5 text-xs rounded-lg border border-border-primary bg-bg-secondary text-fg-primary focus:outline-hidden focus:border-border-brand hidden sm:block"
            >
              {allTypeOptions.map(t => (
                <option key={t} value={t}>
                  {t === 'all' ? 'All types' : formatLabel(t)}
                </option>
              ))}
            </select>

            {/* Add Logo Button */}
            <Button
              color="secondary"
              size="sm"
              iconLeading={Plus}
              onClick={() => setIsUploadOpen(true)}
              aria-label="Add new logo"
            />
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loading01 className="w-5 h-5 animate-spin text-fg-brand-primary" />
            <span className="text-fg-tertiary">Loading logos...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="sticky top-0 bg-bg-primary border-b border-border-secondary z-10">
                <tr>
                  <th className="py-2.5 px-2 sm:px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[50px] sm:w-[60px]">
                    {/* Preview - no sort */}
                  </th>
                  <SortableHeader
                    label="Name"
                    column="name"
                    currentSort={sortColumn}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[100px] sm:w-[140px] md:w-[180px]"
                  />
                  <SortableHeader
                    label="Category"
                    column="category"
                    currentSort={sortColumn}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[80px] sm:w-[100px]"
                  />
                  <SortableHeader
                    label="Type"
                    column="type"
                    currentSort={sortColumn}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[80px] sm:w-[100px]"
                  />
                  <th className="py-2.5 px-2 sm:px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[70px] sm:w-[90px] hidden sm:table-cell">
                    Variant
                  </th>
                  <th className="py-2.5 px-2 sm:px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[50px] sm:w-[60px] hidden md:table-cell">
                    Format
                  </th>
                  <th className="py-2.5 px-2 sm:px-3 text-right text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[80px] sm:w-[100px]">
                    {/* Actions */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Static system logos */}
                {processedStaticLogos.map((logo) => (
                  <StaticLogoRow
                    key={`static-${logo.id}`}
                    logo={logo}
                    onDownload={handleDownloadStaticLogo}
                  />
                ))}

                {/* Dynamic user-added logos */}
                {processedDynamicLogos.map((logo) => (
                  <DynamicLogoRow
                    key={logo.id}
                    logo={logo}
                    isEditing={editingId === logo.id}
                    onEdit={() => setEditingId(logo.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSaveEdit={(updates) => handleSaveEdit(logo.id, updates)}
                    onDownload={handleDownloadLogo}
                    onDelete={handleDeleteLogo}
                    availableTypes={availableTypes}
                    availableVariants={availableVariants}
                    isSaving={isSaving}
                    canDelete={canDeleteLogo(logo)}
                  />
                ))}

                {/* Empty state for dynamic logos */}
                {processedDynamicLogos.length === 0 && processedStaticLogos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 text-fg-muted" />
                        <p className="text-sm text-fg-tertiary">No logos match your filters.</p>
                        <Button
                          color="link-color"
                          size="sm"
                          onClick={() => {
                            setFilterCategory('all');
                            setFilterType('all');
                          }}
                          className="!text-xs"
                        >
                          Clear filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border-secondary bg-bg-tertiary">
          <p className="text-[10px] sm:text-xs text-fg-muted">
            <span className="hidden sm:inline">Upload SVG for best quality. PNG and JPEG are also accepted. System logos cannot be deleted.</span>
            <span className="sm:hidden">Use + to add new logos. System logos are protected.</span>
          </p>
        </div>
      </div>

      {/* Upload modal */}
      <BrandAssetUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        assetType="logo"
        uploadFn={handleUpload}
        onUploadComplete={() => { setIsUploadOpen(false); refresh(); }}
      />
    </div>
  );
}
