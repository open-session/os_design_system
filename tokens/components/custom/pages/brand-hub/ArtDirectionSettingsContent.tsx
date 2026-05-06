'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ChevronDown,
  Download01,
  Image01 as ImageIcon,
  Loading01,
  Pencil01,
  Plus,
  Trash01,
  Upload01,
  XClose,
} from '@untitledui-pro/icons/line';
import { useBrandArtDirection } from '@/hooks/useBrandArtDirection';
import type { BrandArtImage, BrandArtImageMetadata, ArtDirectionCategory } from '@/lib/supabase/types';
import { ART_DIRECTION_CATEGORIES } from '@/lib/supabase/brand-art-service';
import { ConfirmDialog } from './BrandHubSettingsModal';
import { Select } from '@/components/base/base/select/select';
import type { SelectItemType } from '@/components/base/base/select/select';
import { Button } from '@/components/ds/buttons/button';
import { devProps } from '@/lib/utils/dev-props';

// ============================================
// STATIC ART DIRECTION IMAGES (Pre-populated brand assets)
// ============================================

interface StaticArtImage {
  id: string;
  name: string;
  category: ArtDirectionCategory;
  tags: string[];
  path: string;
  format: 'png' | 'jpg' | 'webp';
}

// Default brand slug — must be set via NEXT_PUBLIC_DEFAULT_BRAND_SLUG env var.
// Falls back to 'open-session' to avoid malformed double-slash storage URLs.
const DEFAULT_BRAND_SLUG = process.env.NEXT_PUBLIC_DEFAULT_BRAND_SLUG || 'open-session';

function getImageUrl(filename: string, brandSlug: string = DEFAULT_BRAND_SLUG): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/brand-assets/${brandSlug}/images/${filename}`;
}

function buildStaticArtImages(brandSlug: string = DEFAULT_BRAND_SLUG): StaticArtImage[] {
  const url = (filename: string) => getImageUrl(filename, brandSlug);
  return [
    // Auto category
    { id: 'auto-audi-quattro', name: 'Audi Quattro Urban Portrait', category: 'Auto', tags: ['urban', 'night', 'precision'], path: url('auto-audi-quattro-urban-portrait.png'), format: 'png' },
    { id: 'auto-bmw-garage', name: 'BMW Convertible Garage Night', category: 'Auto', tags: ['garage', 'night', 'elegance'], path: url('auto-bmw-convertible-garage-night.png'), format: 'png' },
    { id: 'auto-porsche-desert', name: 'Desert Porsche Sunset Drift', category: 'Auto', tags: ['desert', 'sunset', 'speed'], path: url('auto-desert-porsche-sunset-drift.png'), format: 'png' },
    { id: 'auto-night-drive', name: 'Night Drive Motion Blur', category: 'Auto', tags: ['night', 'motion', 'speed'], path: url('auto-night-drive-motion-blur.png'), format: 'png' },
    // Lifestyle category
    { id: 'lifestyle-street-style', name: 'Confident Street Style', category: 'Lifestyle', tags: ['urban', 'fashion', 'confidence'], path: url('lifestyle-confident-street-style.png'), format: 'png' },
    { id: 'lifestyle-editorial', name: 'Editorial Look Urban', category: 'Lifestyle', tags: ['editorial', 'fashion', 'urban'], path: url('lifestyle-editorial-look-urban.png'), format: 'png' },
    { id: 'lifestyle-modern', name: 'Modern Aesthetic Pose', category: 'Lifestyle', tags: ['modern', 'aesthetic', 'bold'], path: url('lifestyle-modern-aesthetic-pose.png'), format: 'png' },
    // Move category
    { id: 'move-dance-flow', name: 'Abstract Dance Flow', category: 'Move', tags: ['dance', 'flow', 'energy'], path: url('move-abstract-dance-flow.png'), format: 'png' },
    { id: 'move-athletic', name: 'Athletic Motion Energy', category: 'Move', tags: ['athletic', 'motion', 'energy'], path: url('move-athletic-motion-energy.png'), format: 'png' },
    { id: 'move-kinetic', name: 'Kinetic Energy Motion', category: 'Move', tags: ['kinetic', 'energy', 'momentum'], path: url('move-kinetic-energy-motion.png'), format: 'png' },
    // Escape category
    { id: 'escape-astronaut', name: 'Astronaut Sparkle Floating', category: 'Escape', tags: ['surreal', 'dreams', 'wonder'], path: url('escape-astronaut-sparkle-floating.png'), format: 'png' },
    { id: 'escape-cliffside', name: 'Cliffside Workspace Ocean View', category: 'Escape', tags: ['remote', 'freedom', 'adventure'], path: url('escape-cliffside-workspace-ocean-view.png'), format: 'png' },
    { id: 'escape-desert', name: 'Desert Silhouette Wanderer', category: 'Escape', tags: ['desert', 'freedom', 'remote'], path: url('escape-desert-silhouette-wanderer.png'), format: 'png' },
    // Work category
    { id: 'work-presentation', name: 'Business Presentation', category: 'Work', tags: ['leadership', 'collaboration', 'purpose'], path: url('work-business-presentation.png'), format: 'png' },
    { id: 'work-collaboration', name: 'Professional Collaboration', category: 'Work', tags: ['collaboration', 'innovation', 'growth'], path: url('work-professional-collaboration.png'), format: 'png' },
    { id: 'work-meeting', name: 'Team Meeting Discussion', category: 'Work', tags: ['collaboration', 'focus', 'purpose'], path: url('work-team-meeting-discussion.png'), format: 'png' },
    // Feel category
    { id: 'feel-abstract', name: 'Abstract Figure Warm Tones', category: 'Feel', tags: ['abstract', 'warmth', 'intimacy'], path: url('feel-abstract-figure-warm-tones.png'), format: 'png' },
    { id: 'feel-ethereal', name: 'Ethereal Portrait Softness', category: 'Feel', tags: ['softness', 'poetic', 'intimacy'], path: url('feel-ethereal-portrait-softness.png'), format: 'png' },
    { id: 'feel-flowing', name: 'Flowing Fabric Grace', category: 'Feel', tags: ['texture', 'grace', 'poetic'], path: url('feel-flowing-fabric-grace.png'), format: 'png' },
  ];
}

/** @deprecated Use buildStaticArtImages(brandSlug) for multi-tenant correctness */
const STATIC_ART_IMAGES: StaticArtImage[] = buildStaticArtImages();

const STATIC_IMAGE_IDS = new Set(STATIC_ART_IMAGES.map((img) => img.id));

// ============================================
// CATEGORY FILTER BAR
// ============================================

type FilterCategory = 'All' | ArtDirectionCategory;
const ALL_FILTER_CATEGORIES: FilterCategory[] = ['All', ...ART_DIRECTION_CATEGORIES.map((c) => c.id)];

// ============================================
// SORT OPTIONS
// ============================================

type SortKey = 'name' | 'category' | 'date';
type SortDir = 'asc' | 'desc';

// ============================================
// FULL IMAGE PREVIEW MODAL
// ============================================

interface ImagePreviewModalProps {
  url: string;
  name: string;
  onClose: () => void;
}

function ImagePreviewModal({ url, name, onClose }: ImagePreviewModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        {...devProps('ImagePreviewModal')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[70]"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of ${name}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-8 pointer-events-none"
      >
        <div className="relative pointer-events-auto">
          <Button
            color="tertiary"
            size="sm"
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 !p-1.5 !rounded-full bg-white/20 hover:bg-white/30 [&_svg]:!size-4 text-white"
            aria-label="Close preview"
          >
            <XClose />
          </Button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={name}
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// TAG INPUT (chip-style)
// ============================================

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  return (
    <div {...devProps('TagInput')} className="flex flex-wrap gap-1 p-1 border border-border-primary rounded-lg min-w-[120px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-0.5 bg-bg-tertiary rounded text-xs text-fg-secondary"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="hover:text-fg-primary transition-colors"
            aria-label={`Remove tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
          }
          if (e.key === 'Backspace' && !input && tags.length) {
            onChange(tags.slice(0, -1));
          }
        }}
        placeholder="Add tag..."
        className="outline-hidden bg-transparent text-xs text-fg-primary min-w-[60px]"
      />
    </div>
  );
}

// ============================================
// CATEGORY SELECT (UUI)
// ============================================

const CATEGORY_SELECT_ITEMS: SelectItemType[] = ART_DIRECTION_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.title,
}));

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function CategorySelect({ value, onChange, disabled }: CategorySelectProps) {
  return (
    <div {...devProps('CategorySelect')}>
      <Select
        aria-label="Category"
        placeholder="Category"
        size="sm"
        items={CATEGORY_SELECT_ITEMS}
        selectedKey={value}
        onSelectionChange={(key) => {
          if (key !== null) onChange(key as string);
        }}
        isDisabled={disabled}
      >
        {(item: SelectItemType) => (
          <Select.Item key={item.id} id={item.id} label={item.label} />
        )}
      </Select>
    </div>
  );
}

// ============================================
// STATIC IMAGE ROW
// ============================================

interface StaticImageRowProps {
  image: StaticArtImage;
  onPreview: (url: string, name: string) => void;
  onDownload: (path: string, name: string) => void;
}

function StaticImageRow({ image, onPreview, onDownload }: StaticImageRowProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <tr {...devProps('StaticImageRow')} className="group border-b border-border-secondary hover:bg-bg-tertiary transition-colors">
      {/* Thumbnail */}
      <td className="py-2 px-2 sm:px-3">
        <button
          type="button"
          onClick={() => onPreview(image.path, image.name)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-bg-tertiary border border-border-primary flex items-center justify-center overflow-hidden flex-shrink-0 hover:ring-1 hover:ring-border-brand transition-all"
          title="Click to preview"
        >
          {imgError ? (
            <ImageIcon className="w-4 h-4 text-fg-muted" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.path}
              alt={image.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </button>
      </td>

      {/* Name */}
      <td className="py-2 px-2 sm:px-3">
        <span className="text-xs sm:text-sm font-medium text-fg-primary truncate block max-w-[120px] sm:max-w-none">
          {image.name}
        </span>
      </td>

      {/* Category */}
      <td className="py-2 px-2 sm:px-3">
        <span className="inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded bg-bg-tertiary text-fg-secondary">
          {image.category}
        </span>
      </td>

      {/* Tags */}
      <td className="py-2 px-2 sm:px-3 hidden sm:table-cell">
        <div className="flex flex-wrap gap-1">
          {image.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-bg-tertiary rounded text-[9px] text-fg-muted">
              {tag}
            </span>
          ))}
          {image.tags.length > 3 && (
            <span className="px-1.5 py-0.5 bg-bg-tertiary rounded text-[9px] text-fg-muted">
              +{image.tags.length - 3}
            </span>
          )}
        </div>
      </td>

      {/* Format */}
      <td className="py-2 px-2 sm:px-3 hidden md:table-cell">
        <span className="text-[10px] font-mono text-fg-muted uppercase">{image.format}</span>
      </td>

      {/* Date */}
      <td className="py-2 px-2 sm:px-3 hidden md:table-cell">
        <span className="text-[10px] text-fg-muted">Static</span>
      </td>

      {/* Actions */}
      <td className="py-2 px-2 sm:px-3">
        <div className="flex items-center justify-end gap-0.5">
          <Button
            color="tertiary"
            size="sm"
            iconLeading={Download01}
            onClick={() => onDownload(image.path, `${image.id}.${image.format}`)}
            className="sm:opacity-0 sm:group-hover:opacity-100"
            title="Download"
          />
          {/* Static images cannot be deleted */}
          <span
            className="p-1 sm:p-1.5 rounded-lg text-fg-quaternary cursor-not-allowed sm:opacity-0 sm:group-hover:opacity-100"
            title="Static images cannot be deleted"
          >
            <Trash01 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </span>
        </div>
      </td>
    </tr>
  );
}

// ============================================
// DYNAMIC IMAGE ROW
// ============================================

interface EditingValues {
  name: string;
  category: ArtDirectionCategory;
  tags: string[];
}

interface DynamicImageRowProps {
  image: BrandArtImage;
  isEditing: boolean;
  editValues: EditingValues | null;
  onPreview: (url: string, name: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onUpdateField: <K extends keyof EditingValues>(field: K, value: EditingValues[K]) => void;
  onSave: () => void;
  onDelete: () => void;
  isSaving: boolean;
}

function DynamicImageRow({
  image,
  isEditing,
  editValues,
  onPreview,
  onStartEdit,
  onCancelEdit,
  onUpdateField,
  onSave,
  onDelete,
  isSaving,
}: DynamicImageRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imgError, setImgError] = useState(false);

  const meta = image.metadata as BrandArtImageMetadata;
  const category = meta.artCategory || 'Auto';
  const tags = meta.tags || [];
  const format = image.mimeType?.split('/')[1] || 'image';
  const dateStr = image.createdAt
    ? new Date(image.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <>
      <tr
        {...devProps('DynamicImageRow')}
        className={`group border-b border-border-secondary hover:bg-bg-tertiary transition-colors ${
          isEditing ? 'bg-bg-secondary' : ''
        }`}
      >
        {/* Thumbnail */}
        <td className="py-2 px-2 sm:px-3">
          <button
            type="button"
            onClick={() => image.publicUrl && onPreview(image.publicUrl, image.name)}
            disabled={!image.publicUrl}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-bg-tertiary border border-border-primary flex items-center justify-center overflow-hidden flex-shrink-0 hover:ring-1 hover:ring-border-brand transition-all disabled:cursor-default disabled:hover:ring-0"
            title={image.publicUrl ? 'Click to preview' : undefined}
          >
            {imgError || !image.publicUrl ? (
              <ImageIcon className="w-4 h-4 text-fg-muted" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.publicUrl}
                alt={image.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </button>
        </td>

        {/* Name */}
        <td className="py-2 px-2 sm:px-3">
          {isEditing && editValues ? (
            <input
              type="text"
              value={editValues.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
              className="w-full px-2 py-1 text-xs sm:text-sm rounded border border-border-brand bg-bg-primary text-fg-primary focus:outline-hidden focus:border-border-brand"
            />
          ) : (
            <span className="text-xs sm:text-sm font-medium text-fg-primary truncate block max-w-[120px] sm:max-w-none">
              {image.name}
            </span>
          )}
        </td>

        {/* Category */}
        <td className="py-2 px-2 sm:px-3">
          {isEditing && editValues ? (
            <CategorySelect
              value={editValues.category}
              onChange={(val) => onUpdateField('category', val as ArtDirectionCategory)}
            />
          ) : (
            <span className="inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded bg-bg-tertiary text-fg-secondary">
              {category}
            </span>
          )}
        </td>

        {/* Tags */}
        <td className="py-2 px-2 sm:px-3 hidden sm:table-cell">
          {isEditing && editValues ? (
            <TagInput
              tags={editValues.tags}
              onChange={(newTags) => onUpdateField('tags', newTags)}
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {tags.length > 0 ? (
                <>
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-bg-tertiary rounded text-[9px] text-fg-muted">
                      {tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-bg-tertiary rounded text-[9px] text-fg-muted">
                      +{tags.length - 3}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-fg-muted">—</span>
              )}
            </div>
          )}
        </td>

        {/* Format */}
        <td className="py-2 px-2 sm:px-3 hidden md:table-cell">
          <span className="text-[10px] font-mono text-fg-muted uppercase">{format}</span>
        </td>

        {/* Date */}
        <td className="py-2 px-2 sm:px-3 hidden md:table-cell">
          <span className="text-[10px] text-fg-muted">{dateStr}</span>
        </td>

        {/* Actions */}
        <td className="py-2 px-2 sm:px-3">
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            {isEditing ? (
              <>
                <Button
                  color="secondary"
                  size="sm"
                  iconLeading={isSaving ? Loading01 : Check}
                  onClick={onSave}
                  isDisabled={isSaving}
                  title="Save"
                />
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={XClose}
                  onClick={onCancelEdit}
                  title="Cancel"
                />
              </>
            ) : (
              <>
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={Pencil01}
                  onClick={onStartEdit}
                  className="sm:opacity-0 sm:group-hover:opacity-100"
                  title="Edit"
                />
                <Button
                  color="tertiary-destructive"
                  size="sm"
                  iconLeading={Trash01}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="sm:opacity-0 sm:group-hover:opacity-100"
                  title="Delete"
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
        title="Delete Image"
        message={`Are you sure you want to delete "${image.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}

// ============================================
// ADD IMAGE ROW (inline upload)
// ============================================

interface AddImageRowProps {
  onAdd: (file: File, name: string, category: ArtDirectionCategory, tags: string[]) => Promise<void>;
  onCancel: () => void;
  isAdding: boolean;
}

function AddImageRow({ onAdd, onCancel, isAdding }: AddImageRowProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ArtDirectionCategory>('Auto');
  const [tags, setTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    if (!name) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
      const cleanName = nameWithoutExt.replace(/[-_]/g, ' ');
      setName(cleanName);
      // Auto-detect category from filename
      const lower = nameWithoutExt.toLowerCase();
      if (lower.includes('auto') || lower.includes('car') || lower.includes('porsche') || lower.includes('bmw') || lower.includes('audi')) {
        setCategory('Auto');
      } else if (lower.includes('lifestyle') || lower.includes('fashion') || lower.includes('street')) {
        setCategory('Lifestyle');
      } else if (lower.includes('move') || lower.includes('dance') || lower.includes('athletic') || lower.includes('motion')) {
        setCategory('Move');
      } else if (lower.includes('escape') || lower.includes('travel') || lower.includes('adventure')) {
        setCategory('Escape');
      } else if (lower.includes('work') || lower.includes('office') || lower.includes('business')) {
        setCategory('Work');
      } else if (lower.includes('feel') || lower.includes('abstract') || lower.includes('texture')) {
        setCategory('Feel');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type.startsWith('image/')) processFile(dropped);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const handleSubmit = async () => {
    if (!file || !name.trim()) return;
    await onAdd(file, name.trim(), category, tags);
  };

  const isValid = file && name.trim();

  return (
    <tr {...devProps('AddImageRow')} className="border-b border-border-brand bg-bg-brand-solid/5">
      {/* File Upload */}
      <td className="py-2 sm:py-3 px-2 sm:px-3">
        <label
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center cursor-pointer border border-dashed transition-colors overflow-hidden flex-shrink-0 ${
            isDragging
              ? 'border-border-brand bg-bg-brand-primary'
              : file
                ? 'border-border-brand bg-bg-secondary'
                : 'border-border-primary bg-bg-secondary hover:border-border-brand'
          }`}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Upload01 className="w-4 h-4 sm:w-5 sm:h-5 text-fg-tertiary" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </td>

      {/* Name */}
      <td className="py-2 sm:py-3 px-2 sm:px-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Image name"
          autoFocus
          className="w-full px-2 py-1 text-xs sm:text-sm rounded border border-border-brand bg-bg-primary text-fg-primary focus:outline-hidden"
        />
      </td>

      {/* Category */}
      <td className="py-2 sm:py-3 px-2 sm:px-3">
        <CategorySelect value={category} onChange={(val) => setCategory(val as ArtDirectionCategory)} />
      </td>

      {/* Tags */}
      <td className="py-2 sm:py-3 px-2 sm:px-3 hidden sm:table-cell">
        <TagInput tags={tags} onChange={setTags} />
      </td>

      {/* Format */}
      <td className="py-2 sm:py-3 px-2 sm:px-3 hidden md:table-cell">
        <span className="text-[10px] font-mono text-fg-muted uppercase">
          {file ? file.type.split('/')[1] : '—'}
        </span>
      </td>

      {/* Date */}
      <td className="py-2 sm:py-3 px-2 sm:px-3 hidden md:table-cell">
        <span className="text-[10px] text-fg-muted">New</span>
      </td>

      {/* Actions */}
      <td className="py-2 sm:py-3 px-2 sm:px-3">
        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          <Button
            color="secondary"
            size="sm"
            iconLeading={isAdding ? Loading01 : Check}
            onClick={handleSubmit}
            isDisabled={isAdding || !isValid}
            title="Add image"
          />
          <Button
            color="tertiary"
            size="sm"
            iconLeading={XClose}
            onClick={onCancel}
            title="Cancel"
          />
        </div>
      </td>
    </tr>
  );
}

// ============================================
// SORT BUTTON HELPER
// ============================================

interface SortButtonProps {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
}

function SortButton({ label, sortKey, currentSort, currentDir, onSort }: SortButtonProps) {
  const isActive = currentSort === sortKey;
  return (
    <button
      {...devProps('SortButton')}
      type="button"
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${
        isActive ? 'text-fg-brand-primary' : 'text-fg-tertiary hover:text-fg-primary'
      }`}
    >
      {label}
      {isActive && (
        <ChevronDown
          className={`w-3 h-3 transition-transform ${currentDir === 'asc' ? 'rotate-180' : ''}`}
        />
      )}
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export interface ArtDirectionSettingsContentProps {
  /** Optional: called when the panel should be dismissed (e.g., by a parent close button) */
  onClose?: () => void;
  /** Brand slug used to build storage URLs for static art direction images. Defaults to env var or 'open-session'. */
  brandSlug?: string;
}

export function ArtDirectionSettingsContent({ onClose, brandSlug }: ArtDirectionSettingsContentProps) {
  const { images, isLoading, uploadImageFile, editImage, removeImage } = useBrandArtDirection();

  // Preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');

  // Filter & sort
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Add / edit state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditingValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Build combined rows: static + dynamic, using brandSlug for correct storage paths
  const staticRows = buildStaticArtImages(brandSlug);
  const dynamicRows = images;

  // Filter
  const filteredStatic = filterCategory === 'All'
    ? staticRows
    : staticRows.filter((img) => img.category === filterCategory);

  const filteredDynamic = filterCategory === 'All'
    ? dynamicRows
    : dynamicRows.filter((img) => {
        const meta = img.metadata as BrandArtImageMetadata;
        const cat = meta.artCategory || (img.variant as ArtDirectionCategory | undefined);
        return cat === filterCategory;
      });

  // Sort dynamic rows (static rows use natural order)
  const sortedDynamic = [...filteredDynamic].sort((a, b) => {
    let aVal = '';
    let bVal = '';

    if (sortKey === 'name') {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (sortKey === 'category') {
      const aMeta = a.metadata as BrandArtImageMetadata;
      const bMeta = b.metadata as BrandArtImageMetadata;
      aVal = (aMeta.artCategory || '').toLowerCase();
      bVal = (bMeta.artCategory || '').toLowerCase();
    } else if (sortKey === 'date') {
      aVal = a.createdAt || '';
      bVal = b.createdAt || '';
    }

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedStatic = [...filteredStatic].sort((a, b) => {
    if (sortKey === 'name') {
      const cmp = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      return sortDir === 'asc' ? cmp : -cmp;
    }
    if (sortKey === 'category') {
      const cmp = a.category.toLowerCase().localeCompare(b.category.toLowerCase());
      return sortDir === 'asc' ? cmp : -cmp;
    }
    // date: static images have no date, keep natural order
    return 0;
  });

  const totalCount = filteredStatic.length + sortedDynamic.length;

  // Handlers
  const handlePreview = (url: string, name: string) => {
    setPreviewUrl(url);
    setPreviewName(name);
  };

  const handleDownloadStatic = async (path: string, filename: string) => {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setError('Download failed');
    }
  };

  const handleStartEdit = useCallback((image: BrandArtImage) => {
    const meta = image.metadata as BrandArtImageMetadata;
    setEditingId(image.id);
    setEditValues({
      name: image.name,
      category: meta.artCategory || 'Auto',
      tags: meta.tags || [],
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValues(null);
  }, []);

  const handleUpdateField = useCallback(<K extends keyof EditingValues>(field: K, value: EditingValues[K]) => {
    setEditValues((prev) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleSave = useCallback(async (image: BrandArtImage) => {
    if (!editValues) return;
    setIsSaving(true);
    setError(null);
    try {
      const meta = image.metadata as BrandArtImageMetadata;
      await editImage(image.id, {
        name: editValues.name,
        variant: editValues.category.toLowerCase(),
        metadata: {
          ...meta,
          artCategory: editValues.category,
          tags: editValues.tags,
        },
      });
      setEditingId(null);
      setEditValues(null);
    } catch {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [editValues, editImage]);

  const handleDelete = useCallback(async (image: BrandArtImage) => {
    // Safety: never delete static images
    if (STATIC_IMAGE_IDS.has(image.id)) return;
    setError(null);
    try {
      await removeImage(image.id);
    } catch {
      setError('Failed to delete image');
    }
  }, [removeImage]);

  const handleAdd = useCallback(async (
    file: File,
    name: string,
    category: ArtDirectionCategory,
    tags: string[]
  ) => {
    setIsAdding(true);
    setError(null);
    try {
      await uploadImageFile(file, name, {
        artCategory: category,
        tags,
        altText: name,
      });
      setIsAddingNew(false);
    } catch {
      setError('Failed to upload image');
    } finally {
      setIsAdding(false);
    }
  }, [uploadImageFile]);

  return (
    <div {...devProps('ArtDirectionSettingsContent')} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-secondary">
        <div>
          <h2 className="text-sm font-semibold text-fg-primary">Art Direction Images</h2>
          <p className="text-xs text-fg-tertiary mt-0.5">
            {totalCount} image{totalCount !== 1 ? 's' : ''} across all categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Add button */}
          <Button
            color="secondary"
            size="sm"
            iconLeading={Plus}
            onClick={() => setIsAddingNew(true)}
            isDisabled={isAddingNew}
            title="Upload new image"
          >
            Add image
          </Button>
          {/* Close button (optional) */}
          {onClose && (
            <Button
              color="tertiary"
              size="sm"
              iconLeading={XClose}
              onClick={onClose}
              title="Close"
            />
          )}
        </div>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-bg-error-primary border-b border-border-error"
          >
            <p className="text-xs text-fg-error-primary">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter Bar */}
      <div className="flex gap-2 px-4 py-3 border-b border-border-secondary overflow-x-auto">
        {ALL_FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-bg-brand-solid text-white'
                : 'bg-bg-tertiary text-fg-secondary hover:bg-bg-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-secondary">
              <th className="py-2 px-2 sm:px-3 w-14 sm:w-16" />
              <th className="py-2 px-2 sm:px-3">
                <SortButton label="Name" sortKey="name" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              </th>
              <th className="py-2 px-2 sm:px-3">
                <SortButton label="Category" sortKey="category" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              </th>
              <th className="py-2 px-2 sm:px-3 hidden sm:table-cell">
                <span className="text-[10px] font-medium uppercase tracking-wider text-fg-tertiary">Tags</span>
              </th>
              <th className="py-2 px-2 sm:px-3 hidden md:table-cell">
                <span className="text-[10px] font-medium uppercase tracking-wider text-fg-tertiary">Format</span>
              </th>
              <th className="py-2 px-2 sm:px-3 hidden md:table-cell">
                <SortButton label="Date" sortKey="date" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              </th>
              <th className="py-2 px-2 sm:px-3 w-20 sm:w-24" />
            </tr>
          </thead>
          <tbody>
            {/* Add new row (at top) */}
            {isAddingNew && (
              <AddImageRow
                onAdd={handleAdd}
                onCancel={() => setIsAddingNew(false)}
                isAdding={isAdding}
              />
            )}

            {/* Loading state */}
            {isLoading && (
              <tr>
                <td colSpan={7} className="py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-fg-tertiary">
                    <Loading01 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading images...</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Static image rows */}
            {!isLoading && sortedStatic.map((image) => (
              <StaticImageRow
                key={image.id}
                image={image}
                onPreview={handlePreview}
                onDownload={handleDownloadStatic}
              />
            ))}

            {/* Dynamic image rows */}
            {!isLoading && sortedDynamic.map((image) => (
              <DynamicImageRow
                key={image.id}
                image={image}
                isEditing={editingId === image.id}
                editValues={editingId === image.id ? editValues : null}
                onPreview={handlePreview}
                onStartEdit={() => handleStartEdit(image)}
                onCancelEdit={handleCancelEdit}
                onUpdateField={handleUpdateField}
                onSave={() => handleSave(image)}
                onDelete={() => handleDelete(image)}
                isSaving={isSaving}
              />
            ))}

            {/* Empty state */}
            {!isLoading && totalCount === 0 && !isAddingNew && (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ImageIcon className="w-8 h-8 text-fg-muted" />
                    <p className="text-sm text-fg-tertiary">
                      No art direction images yet.{' '}
                      <Button
                        color="link-color"
                        size="sm"
                        onClick={() => setIsAddingNew(true)}
                        className="!text-xs !inline"
                      >
                        Click + to upload your first image.
                      </Button>
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Full Image Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <ImagePreviewModal
            url={previewUrl}
            name={previewName}
            onClose={() => setPreviewUrl(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
