'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash01,
  Edit02,
  Check,
  XClose,
  Image01,
  Loading01,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from '@untitledui-pro/icons/line';
import { Select } from '@/components/base/base/select/select';
import { SelectItem } from '@/components/base/base/select/select-item';
import { Button } from '@/components/base/base/buttons/button';
import { devProps } from '@/lib/utils/dev-props';
import { useBrandTextures } from '@/hooks/useBrandTextures';
import { BrandAssetUploadModal } from './BrandAssetUploadModal';
import { ConfirmDialog } from './BrandHubSettingsModal';
import type { BrandTexture, TextureVariant } from '@/lib/supabase/brand-textures-service';

// ============================================
// CONSTANTS
// ============================================

const VARIANT_OPTIONS: { id: TextureVariant; label: string }[] = [
  { id: 'sonic-line', label: 'Sonic Line' },
  { id: 'ascii', label: 'ASCII' },
  { id: 'halftone', label: 'Halftone' },
  { id: 'recycled-card', label: 'Recycled Card' },
];

type SortField = 'name' | 'category' | 'date';
type SortDirection = 'asc' | 'desc';

// ============================================
// HELPERS
// ============================================

/**
 * Maps a TextureVariant value to its human-readable label
 */
function variantLabel(variant: string): string {
  const map: Record<string, string> = {
    'sonic-line': 'Sonic Line',
    ascii: 'ASCII',
    halftone: 'Halftone',
    'recycled-card': 'Recycled Card',
    unknown: 'Unknown',
  };
  return map[variant] ?? variant;
}

/**
 * Formats a date string to a short human-readable date
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Gets the file format from a texture's mime type or filename
 */
function getFormat(texture: BrandTexture): string {
  if (texture.mimeType) {
    const parts = texture.mimeType.split('/');
    return parts[1]?.toUpperCase() || '';
  }
  if (texture.filename) {
    return texture.filename.split('.').pop()?.toUpperCase() || '';
  }
  return '';
}

// ============================================
// SUB-COMPONENTS
// ============================================
// ConfirmDialog imported from BrandHubSettingsModal (shared)

/** Full-size image preview overlay */
function TexturePreviewModal({
  texture,
  onClose,
}: {
  texture: BrandTexture;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      {...devProps('TexturePreviewModal')}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${texture.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-30"
        aria-label="Close preview"
      >
        <XClose className="w-6 h-6 text-white" />
      </button>

      <motion.div
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {texture.publicUrl ? (
          <img
            src={texture.publicUrl}
            alt={texture.name}
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
          />
        ) : (
          <div className="w-full h-64 rounded-lg bg-bg-tertiary flex items-center justify-center">
            <Image01 className="w-12 h-12 text-fg-muted" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-950/80 to-transparent rounded-b-lg">
          <h3 className="text-base font-medium text-white">{texture.name}</h3>
          <p className="text-sm text-white/70">{variantLabel(texture.variant || 'unknown')}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Sort header button for the table */
function SortableHeader({
  label,
  field,
  currentSort,
  direction,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSort: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort === field;

  return (
    <button
      {...devProps('SortableHeader')}
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-fg-tertiary hover:text-fg-primary transition-colors group"
    >
      {label}
      <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
        {isActive && direction === 'asc' ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </span>
    </button>
  );
}

/** Inline editable row for a texture */
function TextureRow({
  texture,
  onPreview,
  onEdit,
  onDelete,
}: {
  texture: BrandTexture;
  onPreview: (texture: BrandTexture) => void;
  onEdit: (id: string, updates: { name?: string; variant?: TextureVariant }) => Promise<BrandTexture>;
  onDelete: (texture: BrandTexture) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(texture.name);
  const [editVariant, setEditVariant] = useState<TextureVariant>(
    (texture.variant as TextureVariant) || 'unknown'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onEdit(texture.id, {
        name: editName !== texture.name ? editName : undefined,
        variant: editVariant !== texture.variant ? editVariant : undefined,
      });
      setIsEditing(false);
    } catch {
      // Error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditName(texture.name);
    setEditVariant((texture.variant as TextureVariant) || 'unknown');
    setIsEditing(false);
  };

  const format = getFormat(texture);

  return (
    <tr
      {...devProps('TextureRow')}
      className="border-b border-border-primary hover:bg-bg-secondary/50 transition-colors group"
    >
      {/* Thumbnail */}
      <td className="px-4 py-3" style={{ width: 56 }}>
        <button
          onClick={() => onPreview(texture)}
          className="w-10 h-10 rounded-lg overflow-hidden bg-bg-tertiary flex items-center justify-center hover:ring-1 hover:ring-border-brand transition-all flex-shrink-0"
          aria-label={`Preview ${texture.name}`}
          title="Click to preview"
        >
          {texture.publicUrl && !imgError ? (
            <img
              src={texture.publicUrl}
              alt={texture.name}
              className="w-10 h-10 object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Image01 className="w-5 h-5 text-fg-muted" />
          )}
        </button>
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-2 py-1 rounded-lg bg-bg-secondary border border-border-brand focus:ring-1 focus:ring-brand outline-hidden text-sm text-fg-primary transition-colors"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <span className="text-sm font-medium text-fg-primary">{texture.name}</span>
        )}
      </td>

      {/* Category / Variant */}
      <td className="px-4 py-3" style={{ width: 140 }}>
        {isEditing ? (
          <Select
            size="sm"
            items={VARIANT_OPTIONS}
            placeholder="Select category"
            selectedKey={editVariant}
            onSelectionChange={(key) => setEditVariant(key as TextureVariant)}
            aria-label="Texture category"
          >
            {(item) => (
              <SelectItem key={item.id} id={item.id} label={item.label} />
            )}
          </Select>
        ) : (
          <span className="text-sm text-fg-secondary">
            {variantLabel(texture.variant || 'unknown')}
          </span>
        )}
      </td>

      {/* Format */}
      <td className="px-4 py-3 hidden md:table-cell" style={{ width: 70 }}>
        {format && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-bg-tertiary text-xs font-medium text-fg-tertiary">
            {format}
          </span>
        )}
      </td>

      {/* Date */}
      <td className="px-4 py-3 hidden md:table-cell" style={{ width: 110 }}>
        <span className="text-sm text-fg-tertiary">{formatDate(texture.createdAt)}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3" style={{ width: 80 }}>
        <div className="flex items-center gap-1 justify-end">
          {isEditing ? (
            <>
              <Button
                color="secondary"
                size="sm"
                iconLeading={isSaving ? Loading01 : Check}
                onClick={handleSave}
                isDisabled={isSaving}
                aria-label="Save changes"
                title="Save"
              />
              <Button
                color="tertiary"
                size="sm"
                iconLeading={XClose}
                onClick={handleCancel}
                isDisabled={isSaving}
                aria-label="Cancel editing"
                title="Cancel"
              />
            </>
          ) : (
            <>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={Edit02}
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100"
                aria-label={`Edit ${texture.name}`}
                title="Edit"
              />
              <Button
                color="tertiary-destructive"
                size="sm"
                iconLeading={Trash01}
                onClick={() => onDelete(texture)}
                className="opacity-0 group-hover:opacity-100"
                aria-label={`Delete ${texture.name}`}
                title="Delete"
              />
            </>
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
 * Inline textures management table for Brand Hub settings panel.
 * Renders a sortable table of textures with CRUD operations.
 */
export function TexturesSettingsContent() {
  const { textures, isLoading, error, refresh, uploadTexture, editTexture, removeTexture } =
    useBrandTextures();

  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [previewTexture, setPreviewTexture] = useState<BrandTexture | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BrandTexture | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Sort handler
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField]
  );

  // Sorted textures
  const sortedTextures = [...textures].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'category') {
      comparison = (a.variant || '').localeCompare(b.variant || '');
    } else if (sortField === 'date') {
      comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Date sort: newest first by default, so invert for asc direction
      return sortDirection === 'asc' ? -comparison : comparison;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Delete confirmation handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await removeTexture(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting texture:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Upload handler passed to BrandAssetUploadModal
  const handleUpload = useCallback(
    async (file: File, metadata: Record<string, unknown>): Promise<unknown> => {
      const name = (metadata.name as string) || file.name;
      const category = (metadata.category as string) || 'unknown';
      // Map category label to TextureVariant id
      const variantMap: Record<string, TextureVariant> = {
        'Sonic Line': 'sonic-line',
        'sonic-line': 'sonic-line',
        'ASCII': 'ascii',
        'ascii': 'ascii',
        'Halftone': 'halftone',
        'halftone': 'halftone',
        'Recycled Card': 'recycled-card',
        'recycled-card': 'recycled-card',
      };
      const variant: TextureVariant = variantMap[category] || 'unknown';
      return uploadTexture(file, name, variant);
    },
    [uploadTexture]
  );

  // Loading state
  if (isLoading) {
    return (
      <div {...devProps('TexturesSettingsContent')} className="flex items-center justify-center py-16">
        <Loading01 className="w-5 h-5 animate-spin text-fg-tertiary" />
        <span className="ml-2 text-sm text-fg-tertiary">Loading textures...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div {...devProps('TexturesSettingsContent')} className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle className="w-8 h-8 text-fg-error-primary" />
        <p className="text-sm text-fg-error-primary">Failed to load textures</p>
        <Button
          color="secondary"
          size="sm"
          onClick={refresh}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div {...devProps('TexturesSettingsContent')} className="w-full">
      {/* Header row with "+" button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-fg-primary">Textures</h2>
          <p className="text-sm text-fg-tertiary mt-0.5">
            {textures.length} {textures.length === 1 ? 'texture' : 'textures'} in your library
          </p>
        </div>
        <Button
          color="secondary"
          size="sm"
          iconLeading={Plus}
          onClick={() => setUploadOpen(true)}
          aria-label="Upload texture"
          title="Upload new texture"
        >
          Add Texture
        </Button>
      </div>

      {/* Table */}
      {textures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border-secondary rounded-xl">
          <Image01 className="w-10 h-10 text-fg-muted mb-3" />
          <p className="text-sm font-medium text-fg-secondary">No textures yet.</p>
          <p className="text-sm text-fg-tertiary mt-1">Click + to upload your first texture.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-border-secondary">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary bg-bg-secondary">
                <th className="px-4 py-3 text-left" style={{ width: 56 }}>
                  <span className="text-xs font-medium text-fg-tertiary">Preview</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortableHeader
                    label="Name"
                    field="name"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-4 py-3 text-left" style={{ width: 140 }}>
                  <SortableHeader
                    label="Category"
                    field="category"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell" style={{ width: 70 }}>
                  <span className="text-xs font-medium text-fg-tertiary">Format</span>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell" style={{ width: 110 }}>
                  <SortableHeader
                    label="Date"
                    field="date"
                    currentSort={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-4 py-3" style={{ width: 80 }}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTextures.map((texture) => (
                <TextureRow
                  key={texture.id}
                  texture={texture}
                  onPreview={setPreviewTexture}
                  onEdit={editTexture}
                  onDelete={setDeleteTarget}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full preview modal */}
      <AnimatePresence>
        {previewTexture && (
          <TexturePreviewModal
            texture={previewTexture}
            onClose={() => setPreviewTexture(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation — uses shared ConfirmDialog from BrandHubSettingsModal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete texture"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Upload modal */}
      <BrandAssetUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        assetType="texture"
        uploadFn={handleUpload}
        onUploadComplete={() => refresh()}
      />
    </div>
  );
}
