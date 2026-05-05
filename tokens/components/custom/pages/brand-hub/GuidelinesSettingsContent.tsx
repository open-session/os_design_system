'use client';

import React, { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit01,
  File01,
  Link01 as LinkIcon,
  LinkExternal01,
  Loading01,
  Plus,
  Star01,
  Trash01,
  Upload01,
  XClose,
} from '@untitledui-pro/icons/line';
import { useBrandGuidelines } from '@/hooks/useBrandGuidelines';
import type { BrandGuideline, BrandGuidelineType } from '@/lib/supabase/types';
import { isValidFigmaUrl } from '@/lib/supabase/brand-guidelines-service';
import { Button } from '@/components/base/base/buttons/button';
import { ConfirmDialog, StatusBadge } from './BrandHubSettingsModal';
import { devProps } from '@/lib/utils/dev-props';

// ============================================
// TYPE CONFIGURATION
// ============================================

const TYPE_BADGE_CONFIG: Record<string, { bgClass: string; textClass: string; label: string }> = {
  figma: {
    bgClass: 'bg-bg-brand-primary',
    textClass: 'text-fg-brand-primary',
    label: 'Figma',
  },
  pdf: {
    bgClass: 'bg-bg-error-primary',
    textClass: 'text-fg-error-primary',
    label: 'PDF',
  },
  pptx: {
    bgClass: 'bg-bg-warning-primary',
    textClass: 'text-fg-warning-primary',
    label: 'PPTX',
  },
  ppt: {
    bgClass: 'bg-bg-warning-primary',
    textClass: 'text-fg-warning-primary',
    label: 'PPT',
  },
  link: {
    bgClass: 'bg-bg-secondary',
    textClass: 'text-fg-secondary',
    label: 'Link',
  },
  notion: {
    bgClass: 'bg-bg-secondary',
    textClass: 'text-fg-secondary',
    label: 'Notion',
  },
  'google-doc': {
    bgClass: 'bg-bg-brand-primary',
    textClass: 'text-fg-brand-primary',
    label: 'Google Doc',
  },
};

const CATEGORY_OPTIONS = [
  { value: 'brand-identity', label: 'Brand Identity' },
  { value: 'messaging', label: 'Messaging' },
  { value: 'art-direction', label: 'Art Direction' },
  { value: 'ai-guidance', label: 'AI Guidance' },
  { value: 'design-system', label: 'Design System' },
  { value: 'other', label: 'Other' },
];

// ============================================
// SORT TYPES
// ============================================

type SortField = 'title' | 'type' | 'date';
type SortDir = 'asc' | 'desc';

// ============================================
// TYPE BADGE COMPONENT
// ============================================

function TypeBadge({ type }: { type: BrandGuidelineType | string }) {
  const config = TYPE_BADGE_CONFIG[type] ?? TYPE_BADGE_CONFIG.link;
  return (
    <span
      {...devProps('TypeBadge')}
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${config.bgClass} ${config.textClass}`}
    >
      {config.label}
    </span>
  );
}

// ============================================
// TYPE ICON COMPONENT
// ============================================

function TypeIcon({ type }: { type: BrandGuidelineType | string }) {
  if (type === 'figma')
    return <LinkExternal01 {...devProps('TypeIcon')} className="w-4 h-4 text-fg-tertiary" />;
  if (type === 'link' || type === 'notion' || type === 'google-doc')
    return <LinkIcon {...devProps('TypeIcon')} className="w-4 h-4 text-fg-tertiary" />;
  return <File01 {...devProps('TypeIcon')} className="w-4 h-4 text-fg-tertiary" />;
}

// ============================================
// SORT HEADER BUTTON
// ============================================

interface SortButtonProps {
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onClick: (field: SortField) => void;
  children: React.ReactNode;
}

function SortButton({ field, currentField, currentDir, onClick, children }: SortButtonProps) {
  const isActive = currentField === field;
  return (
    <button
      {...devProps('SortButton')}
      onClick={() => onClick(field)}
      className="inline-flex items-center gap-1 text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider hover:text-fg-primary transition-colors"
    >
      {children}
      {isActive ? (
        currentDir === 'asc' ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )
      ) : (
        <ChevronDown className="w-3 h-3 opacity-30" />
      )}
    </button>
  );
}

// ============================================
// GUIDELINE ROW (view mode)
// ============================================

interface GuidelineRowProps {
  guideline: BrandGuideline;
  index: number;
  total: number;
  onEdit: (guideline: BrandGuideline) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isReordering: boolean;
}

function GuidelineRow({ guideline, index, total, onEdit, onDelete, onSetPrimary, onMoveUp, onMoveDown, isReordering }: GuidelineRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const hasUrl = !!guideline.url || !!guideline.embedUrl;
  const displayUrl = guideline.url || guideline.embedUrl;
  const isLink =
    guideline.guidelineType === 'figma' ||
    guideline.guidelineType === 'link' ||
    guideline.guidelineType === 'notion' ||
    guideline.guidelineType === 'google-doc';

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCategory = (cat: string | null | undefined) => {
    if (!cat) return 'Uncategorized';
    return cat
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <tr
      {...devProps('GuidelineRow')}
      className="group border-b border-border-secondary hover:bg-bg-tertiary transition-colors"
    >
      {/* Type */}
      <td className="py-2.5 px-3 w-[80px]">
        <div className="flex items-center gap-1.5">
          <TypeIcon type={guideline.guidelineType} />
          <TypeBadge type={guideline.guidelineType} />
        </div>
      </td>

      {/* Title */}
      <td className="py-2.5 px-3">
        {isLink && hasUrl && displayUrl ? (
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-fg-primary hover:text-fg-brand-primary hover:underline inline-flex items-center gap-1"
          >
            {guideline.title}
            <LinkExternal01 className="inline w-3 h-3 ml-0.5 text-fg-tertiary" />
          </a>
        ) : (
          <span className="text-sm font-medium text-fg-primary">{guideline.title}</span>
        )}
        {guideline.description && (
          <p className="text-xs text-fg-tertiary mt-0.5 line-clamp-1">{guideline.description}</p>
        )}
      </td>

      {/* Category - hidden sm */}
      <td className="py-2.5 px-3 w-[120px] hidden sm:table-cell">
        <span className="text-xs text-fg-secondary">{formatCategory(guideline.category)}</span>
      </td>

      {/* Status */}
      <td className="py-2.5 px-3 w-[80px]">
        {guideline.isPrimary && <StatusBadge status="success" label="Primary" />}
      </td>

      {/* Date - hidden md */}
      <td className="py-2.5 px-3 w-[100px] hidden md:table-cell">
        <span className="text-xs text-fg-tertiary">{formatDate(guideline.createdAt)}</span>
      </td>

      {/* Actions */}
      <td className="py-2.5 px-3 w-[100px]">
        <div className="relative flex items-center justify-end gap-0.5">
          {/* Reorder buttons */}
          {total > 1 && (
            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onMoveUp(index)}
                disabled={index === 0 || isReordering}
                className="p-0.5 rounded hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Move up"
              >
                <ChevronUp className="w-3 h-3 text-fg-tertiary" />
              </button>
              <button
                onClick={() => onMoveDown(index)}
                disabled={index === total - 1 || isReordering}
                className="p-0.5 rounded hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Move down"
              >
                <ChevronDown className="w-3 h-3 text-fg-tertiary" />
              </button>
            </div>
          )}
          <Button
            color="tertiary"
            size="sm"
            onClick={() => setMenuOpen((v) => !v)}
            className="!p-1.5 opacity-0 group-hover:opacity-100 transition-all [&_svg]:!size-4"
            aria-label="Actions"
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </Button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl bg-bg-primary border border-border-primary shadow-lg py-1"
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(guideline);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-fg-primary hover:bg-bg-secondary transition-colors"
                  >
                    <Edit01 className="w-4 h-4 text-fg-tertiary" />
                    Edit
                  </button>
                  {!guideline.isPrimary && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onSetPrimary(guideline.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-fg-primary hover:bg-bg-secondary transition-colors"
                    >
                      <Star01 className="w-4 h-4 text-fg-tertiary" />
                      Set as Primary
                    </button>
                  )}
                  <div className="border-t border-border-secondary my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(guideline.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-fg-error-primary hover:bg-bg-secondary transition-colors"
                  >
                    <Trash01 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </td>
    </tr>
  );
}

// ============================================
// GUIDELINE EDIT ROW
// ============================================

interface EditRowProps {
  guideline: BrandGuideline;
  onSave: (id: string, updates: { title: string; description: string; category: string }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

function GuidelineEditRow({ guideline, onSave, onCancel, isSaving }: EditRowProps) {
  const [title, setTitle] = useState(guideline.title);
  const [description, setDescription] = useState(guideline.description || '');
  const [category, setCategory] = useState(guideline.category || 'brand-identity');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(guideline.id, { title: title.trim(), description, category });
  };

  return (
    <tr
      {...devProps('GuidelineEditRow')}
      className="border-b border-border-brand bg-bg-brand-primary/5"
    >
      {/* Type (read-only) */}
      <td className="py-2.5 px-3 w-[80px]">
        <div className="flex items-center gap-1.5">
          <TypeIcon type={guideline.guidelineType} />
          <TypeBadge type={guideline.guidelineType} />
        </div>
      </td>

      {/* Title + description editable */}
      <td className="py-2.5 px-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          autoFocus
          className="w-full px-2 py-1 text-sm rounded border border-border-brand bg-bg-primary text-fg-primary focus:outline-hidden mb-1"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-2 py-1 text-xs rounded border border-border-primary bg-bg-primary text-fg-secondary focus:outline-hidden"
        />
      </td>

      {/* Category editable - hidden sm */}
      <td className="py-2.5 px-3 w-[120px] hidden sm:table-cell">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-2 py-1 text-xs rounded border border-border-primary bg-bg-primary text-fg-primary focus:outline-hidden"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>

      {/* Status */}
      <td className="py-2.5 px-3 w-[80px]">
        {guideline.isPrimary && <StatusBadge status="success" label="Primary" />}
      </td>

      {/* Date - hidden md */}
      <td className="py-2.5 px-3 w-[100px] hidden md:table-cell" />

      {/* Save/Cancel actions */}
      <td className="py-2.5 px-3 w-[60px]">
        <div className="flex items-center justify-end gap-1">
          <Button
            color="primary"
            size="sm"
            onClick={handleSave}
            isDisabled={isSaving || !title.trim()}
            className="!p-1.5 [&_svg]:!size-3.5"
            aria-label="Save"
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
            onClick={onCancel}
            className="!p-1.5 [&_svg]:!size-3.5"
            aria-label="Cancel"
          >
            <XClose />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ============================================
// ADD GUIDELINE DIALOG
// ============================================

interface AddGuidelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddGuidelineFormData) => Promise<void>;
  isAdding: boolean;
}

interface AddGuidelineFormData {
  addType: 'figma' | 'upload' | 'link';
  title: string;
  url: string;
  description: string;
  category: string;
  file: File | null;
}

function AddGuidelineDialog({ isOpen, onClose, onAdd, isAdding }: AddGuidelineDialogProps) {
  const [addType, setAddType] = useState<'figma' | 'upload' | 'link'>('figma');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('brand-identity');
  const [file, setFile] = useState<File | null>(null);
  const [urlError, setUrlError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setAddType('figma');
    setTitle('');
    setUrl('');
    setDescription('');
    setCategory('brand-identity');
    setFile(null);
    setUrlError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileSelect = useCallback(
    (f: File | null) => {
      if (!f) return;
      setFile(f);
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    },
    [title]
  );

  const validateUrl = useCallback(() => {
    if (addType === 'figma' && url && !isValidFigmaUrl(url)) {
      setUrlError('Please enter a valid Figma URL (figma.com/file/... or figma.com/proto/...)');
      return false;
    }
    setUrlError('');
    return true;
  }, [addType, url]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if ((addType === 'figma' || addType === 'link') && !url) return;
    if (addType === 'figma' && !validateUrl()) return;
    if (addType === 'upload' && !file) return;

    await onAdd({ addType, title: title.trim(), url, description, category, file });
    reset();
  };

  const canSubmit =
    title.trim() &&
    ((addType === 'figma' && url) ||
      (addType === 'link' && url) ||
      (addType === 'upload' && file));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              {...devProps('AddGuidelineDialog')}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl bg-bg-primary border border-border-primary shadow-2xl pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border-primary">
                <h3 className="text-lg font-display font-bold text-fg-primary">Add Guideline</h3>
                <Button
                  color="tertiary"
                  size="sm"
                  onClick={handleClose}
                  className="!p-2 [&_svg]:!size-4"
                  aria-label="Close"
                >
                  <XClose />
                </Button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Type tabs */}
                <div className="flex gap-1.5 p-1 bg-bg-secondary rounded-xl">
                  {(
                    [
                      { value: 'figma', icon: LinkExternal01, label: 'Figma' },
                      { value: 'upload', icon: Upload01, label: 'Upload' },
                      { value: 'link', icon: LinkIcon, label: 'Link' },
                    ] as const
                  ).map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setAddType(value)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        addType === value
                          ? 'bg-bg-primary text-fg-primary shadow-sm'
                          : 'text-fg-tertiary hover:text-fg-secondary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">
                    Title <span className="text-fg-error-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Brand Guidelines 2024"
                    autoFocus
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border-primary bg-bg-secondary text-fg-primary focus:outline-hidden focus:border-border-brand"
                  />
                </div>

                {/* URL (figma or link) */}
                {(addType === 'figma' || addType === 'link') && (
                  <div>
                    <label className="block text-xs font-medium text-fg-secondary mb-1">
                      {addType === 'figma' ? 'Figma URL' : 'URL'} <span className="text-fg-error-primary">*</span>
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        if (urlError) setUrlError('');
                      }}
                      onBlur={validateUrl}
                      placeholder={addType === 'figma' ? 'https://figma.com/proto/...' : 'https://...'}
                      className={`w-full px-3 py-2 text-sm rounded-lg border bg-bg-secondary text-fg-primary focus:outline-hidden focus:border-border-brand ${
                        urlError ? 'border-error' : 'border-border-primary'
                      }`}
                    />
                    {urlError && <p className="text-xs text-fg-error-primary mt-1">{urlError}</p>}
                  </div>
                )}

                {/* File upload */}
                {addType === 'upload' && (
                  <div>
                    <label className="block text-xs font-medium text-fg-secondary mb-1">
                      Document <span className="text-fg-error-primary">*</span>
                    </label>
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const f = e.dataTransfer.files[0];
                        if (f) handleFileSelect(f);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative rounded-xl border border-dashed transition-all cursor-pointer p-4 text-center ${
                        isDragging
                          ? 'border-border-brand bg-bg-brand-primary'
                          : file
                          ? 'border-border-brand bg-bg-secondary'
                          : 'border-border-primary hover:border-fg-tertiary hover:bg-bg-tertiary'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.pptx,.ppt"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-2">
                          <File01 className="w-4 h-4 text-fg-brand-primary" />
                          <span className="text-sm text-fg-primary">{file.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload01 className="w-5 h-5 text-fg-tertiary" />
                          <p className="text-sm text-fg-tertiary">Drop PDF or PowerPoint here</p>
                          <p className="text-xs text-fg-muted">Supported: PDF, PPTX, PPT</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border-primary bg-bg-secondary text-fg-primary focus:outline-hidden focus:border-border-brand resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-fg-secondary mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border-primary bg-bg-secondary text-fg-primary focus:outline-hidden focus:border-border-brand"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border-primary">
                <Button
                  color="secondary"
                  size="md"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  size="md"
                  onClick={handleSubmit}
                  isDisabled={isAdding || !canSubmit}
                  isLoading={isAdding}
                  showTextWhileLoading
                >
                  {isAdding ? 'Adding...' : 'Add Guideline'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * GuidelinesSettingsContent — Inline table view for managing brand guidelines.
 * Shows type badges, row-level editing, primary status, and sort controls.
 */
export function GuidelinesSettingsContent() {
  const {
    guidelines,
    isLoading,
    addGuideline,
    addFigmaGuideline,
    editGuideline,
    removeGuideline,
    uploadGuidelineFile,
    setAsPrimary,
    reorder,
  } = useBrandGuidelines();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Sort state — when user reorders, disable sort so manual order is preserved
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [manualOrder, setManualOrder] = useState<string[] | null>(null);

  const handleSortClick = (field: SortField) => {
    // Sort click clears manual order
    setManualOrder(null);
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Sort guidelines — if manual order set, use it; otherwise use sort
  const sortedGuidelines = manualOrder
    ? manualOrder
        .map((id) => guidelines.find((g) => g.id === id))
        .filter((g): g is BrandGuideline => !!g)
    : [...guidelines].sort((a, b) => {
        let cmp = 0;
        if (sortField === 'title') {
          cmp = a.title.localeCompare(b.title);
        } else if (sortField === 'type') {
          cmp = a.guidelineType.localeCompare(b.guidelineType);
        } else {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          cmp = dateA - dateB;
        }
        return sortDir === 'asc' ? cmp : -cmp;
      });

  // Reorder handlers
  const handleMoveUp = useCallback(
    async (index: number) => {
      if (index === 0) return;
      const previousIds = sortedGuidelines.map((g) => g.id);
      const newOrder = [...sortedGuidelines];
      const temp = newOrder[index - 1];
      newOrder[index - 1] = newOrder[index];
      newOrder[index] = temp;
      const newIds = newOrder.map((g) => g.id);
      setManualOrder(newIds);
      setIsReordering(true);
      try {
        await reorder(newIds);
      } catch (err) {
        console.error('Error reordering guidelines:', err);
        setManualOrder(previousIds);
      } finally {
        setIsReordering(false);
      }
    },
    [sortedGuidelines, reorder]
  );

  const handleMoveDown = useCallback(
    async (index: number) => {
      if (index === sortedGuidelines.length - 1) return;
      const previousIds = sortedGuidelines.map((g) => g.id);
      const newOrder = [...sortedGuidelines];
      const temp = newOrder[index + 1];
      newOrder[index + 1] = newOrder[index];
      newOrder[index] = temp;
      const newIds = newOrder.map((g) => g.id);
      setManualOrder(newIds);
      setIsReordering(true);
      try {
        await reorder(newIds);
      } catch (err) {
        console.error('Error reordering guidelines:', err);
        setManualOrder(previousIds);
      } finally {
        setIsReordering(false);
      }
    },
    [sortedGuidelines, reorder]
  );

  // Save row edits
  const handleSaveEdit = useCallback(
    async (id: string, updates: { title: string; description: string; category: string }) => {
      setIsSaving(true);
      try {
        await editGuideline(id, {
          title: updates.title,
          description: updates.description || undefined,
          category: updates.category || undefined,
        });
        setEditingId(null);
      } catch (err) {
        console.error('Error saving guideline edit:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [editGuideline]
  );

  // Delete
  const handleDelete = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      try {
        await removeGuideline(id);
        setDeleteConfirmId(null);
      } catch (err) {
        console.error('Error deleting guideline:', err);
      } finally {
        setIsDeleting(false);
      }
    },
    [removeGuideline]
  );

  // Set primary
  const handleSetPrimary = useCallback(
    async (id: string) => {
      try {
        await setAsPrimary(id);
      } catch (err) {
        console.error('Error setting primary guideline:', err);
      }
    },
    [setAsPrimary]
  );

  // Add guideline
  const handleAdd = useCallback(
    async (data: AddGuidelineFormData) => {
      setIsAdding(true);
      try {
        if (data.addType === 'figma' && data.url) {
          await addFigmaGuideline(data.url, {
            title: data.title,
            description: data.description || undefined,
            category: data.category || undefined,
          });
        } else if (data.addType === 'upload' && data.file) {
          await uploadGuidelineFile(data.file, {
            title: data.title,
            description: data.description || undefined,
            category: data.category || undefined,
          });
        } else if (data.addType === 'link' && data.url) {
          await addGuideline({
            title: data.title,
            guideline_type: 'link',
            url: data.url,
            description: data.description || undefined,
            category: data.category || undefined,
          });
        }
        setIsAddOpen(false);
      } catch (err) {
        console.error('Error adding guideline:', err);
      } finally {
        setIsAdding(false);
      }
    },
    [addGuideline, addFigmaGuideline, uploadGuidelineFile]
  );

  return (
    <div {...devProps('GuidelinesSettingsContent')} className="w-full">
      {/* Table header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-fg-primary">Manage Guidelines</h2>
          <p className="text-sm text-fg-tertiary mt-0.5">
            {guidelines.length} guideline{guidelines.length !== 1 ? 's' : ''} in your brand library
          </p>
        </div>
        <Button
          color="secondary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          iconLeading={Plus}
        >
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border-secondary overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loading01 className="w-5 h-5 animate-spin text-fg-brand-primary" />
            <span className="text-fg-tertiary text-sm">Loading guidelines...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="sticky top-0 bg-bg-secondary border-b border-border-secondary z-10">
                <tr>
                  <th className="py-3 px-3 text-left w-[80px]">
                    <SortButton
                      field="type"
                      currentField={sortField}
                      currentDir={sortDir}
                      onClick={handleSortClick}
                    >
                      Type
                    </SortButton>
                  </th>
                  <th className="py-3 px-3 text-left">
                    <SortButton
                      field="title"
                      currentField={sortField}
                      currentDir={sortDir}
                      onClick={handleSortClick}
                    >
                      Title
                    </SortButton>
                  </th>
                  <th className="py-3 px-3 text-left w-[120px] hidden sm:table-cell">
                    <span className="text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">
                      Category
                    </span>
                  </th>
                  <th className="py-3 px-3 text-left w-[80px]">
                    <span className="text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                  <th className="py-3 px-3 text-left w-[100px] hidden md:table-cell">
                    <SortButton
                      field="date"
                      currentField={sortField}
                      currentDir={sortDir}
                      onClick={handleSortClick}
                    >
                      Date
                    </SortButton>
                  </th>
                  <th className="py-3 px-3 w-[60px]" />
                </tr>
              </thead>
              <tbody>
                {sortedGuidelines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-fg-tertiary">
                        <File01 className="w-8 h-8 opacity-40" />
                        <p className="text-sm">No guidelines yet. Click + to add your first brand guideline.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedGuidelines.map((guideline, idx) =>
                    editingId === guideline.id ? (
                      <GuidelineEditRow
                        key={guideline.id}
                        guideline={guideline}
                        onSave={handleSaveEdit}
                        onCancel={() => setEditingId(null)}
                        isSaving={isSaving}
                      />
                    ) : (
                      <GuidelineRow
                        key={guideline.id}
                        guideline={guideline}
                        index={idx}
                        total={sortedGuidelines.length}
                        onEdit={(g) => setEditingId(g.id)}
                        onDelete={(id) => setDeleteConfirmId(id)}
                        onSetPrimary={handleSetPrimary}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        isReordering={isReordering}
                      />
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add dialog */}
      <AddGuidelineDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
        isAdding={isAdding}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => { if (deleteConfirmId) void handleDelete(deleteConfirmId); }}
        title="Delete Guideline"
        message="Are you sure you want to delete this guideline? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
