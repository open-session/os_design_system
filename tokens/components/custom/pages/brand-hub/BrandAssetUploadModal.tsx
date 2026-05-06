'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  XClose,
  Check,
  AlertCircle,
  RefreshCcw01,
  Loading01,
  File01,
  ArrowLeft,
  ArrowRight,
} from '@untitledui-pro/icons/line';
import { FileUploadZone } from './BrandHubSettingsModal';
import { Badge } from '@/components/base/base/badges/badges';
import { Select, type SelectItemType } from '@/components/base/base/select/select';
import { SelectItem } from '@/components/base/base/select/select-item';
import { Input } from '@/components/base/base/input/input';
import { Button } from '@/components/ds/buttons/button';
import { ModalOverlay, Modal, Dialog } from '@/components/base/application/modals/modal';
import { devProps } from '@/lib/utils/dev-props';

// ---- Types ----

/** Supported asset types for the upload modal */
export type UploadAssetType =
  | 'logo'
  | 'font'
  | 'image'
  | 'art-direction'
  | 'texture'
  | 'guideline';

type UploadStep = 'select' | 'metadata';
type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface SelectedFile {
  file: File;
  previewUrl: string | null;
  metadata: Record<string, string>;
  status: FileUploadStatus;
  error: string | null;
}

/** Props for the BrandAssetUploadModal component */
export interface BrandAssetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetType: UploadAssetType;
  /** Called after upload of all files with count of successful uploads */
  onUploadComplete?: (uploadedCount: number) => void;
  /** Hook upload function — caller provides it so modal stays decoupled from hooks */
  uploadFn: (file: File, metadata: Record<string, unknown>) => Promise<unknown>;
  /** Optional: brand ID for context */
  brandId?: string;
}

// ---- Constants ----

const ACCEPTED_FILE_TYPES: Record<UploadAssetType, string> = {
  logo: '.svg,.png,.jpg,.jpeg',
  font: '.ttf,.otf,.woff,.woff2',
  image: '.jpg,.jpeg,.png,.webp,.gif',
  'art-direction': '.jpg,.jpeg,.png,.webp',
  texture: '.jpg,.jpeg,.png,.webp,.svg',
  guideline: '.pdf,.doc,.docx,.md,.txt',
};

const ASSET_TYPE_LABELS: Record<UploadAssetType, string> = {
  logo: 'Logo',
  font: 'Font',
  image: 'Image',
  'art-direction': 'Art Direction',
  texture: 'Texture',
  guideline: 'Guideline',
};

// ---- Select option helpers ----

function makeItems(labels: string[]): SelectItemType[] {
  return labels.map((label) => ({ id: label, label }));
}

const LOGO_CATEGORIES = makeItems(['Main', 'Accessory']);
const LOGO_TYPES = makeItems([
  'Brandmark',
  'Combo',
  'Stacked',
  'Horizontal',
  'Core',
  'Outline',
  'Filled',
]);
const LOGO_VARIANTS = makeItems(['Vanilla', 'Glass', 'Charcoal']);

const FONT_WEIGHTS = makeItems([
  '100 — Thin',
  '200 — Extra Light',
  '300 — Light',
  '400 — Regular',
  '500 — Medium',
  '600 — Semi Bold',
  '700 — Bold',
  '800 — Extra Bold',
  '900 — Black',
]);
const FONT_STYLES = makeItems(['normal', 'italic']);
const FONT_USAGES = makeItems(['Display', 'Heading', 'Body', 'Mono']);

const ART_DIRECTION_CATEGORIES = makeItems([
  'Photography',
  'Illustration',
  'Collage',
]);
const TEXTURE_CATEGORIES = makeItems(['Grain', 'Pattern', 'Surface', 'Overlay']);
const GUIDELINE_TYPES = makeItems([
  'Brand Guide',
  'Voice & Tone',
  'Visual Standards',
  'Usage Rules',
  'Other',
]);

// ---- Helpers ----

function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
}

function getFileNameWithoutExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.slice(0, -1).join('.') : filename;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMimeType(type: string): boolean {
  return type.startsWith('image/');
}

function getDefaultMetadata(
  assetType: UploadAssetType,
  file: File
): Record<string, string> {
  const name = getFileNameWithoutExtension(file.name);

  switch (assetType) {
    case 'logo':
      return { name, category: '', type: '', variant: '' };
    case 'font':
      return { family: name, weight: '', style: '', usage: '' };
    case 'image':
      return { name, category: '', tags: '' };
    case 'art-direction':
      return { name, category: '', tags: '' };
    case 'texture':
      return { name, category: '' };
    case 'guideline':
      return { name, documentType: '' };
  }
}

// ---- Sub-components ----

/** Step indicator showing the current step in the upload flow */
function UploadStepIndicator({
  currentStep,
}: {
  currentStep: UploadStep;
}) {
  return (
    <div
      {...devProps('UploadStepIndicator')}
      className="flex items-center gap-2 text-sm"
    >
      <span
        className={`flex items-center gap-1.5 font-medium ${
          currentStep === 'select'
            ? 'text-fg-brand-primary'
            : 'text-fg-tertiary'
        }`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
            currentStep === 'select'
              ? 'bg-bg-brand-primary text-fg-brand-primary'
              : 'bg-bg-tertiary text-fg-tertiary'
          }`}
        >
          1
        </span>
        Select Files
      </span>

      <ArrowRight className="w-3.5 h-3.5 text-fg-muted" />

      <span
        className={`flex items-center gap-1.5 font-medium ${
          currentStep === 'metadata'
            ? 'text-fg-brand-primary'
            : 'text-fg-tertiary'
        }`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
            currentStep === 'metadata'
              ? 'bg-bg-brand-primary text-fg-brand-primary'
              : 'bg-bg-tertiary text-fg-tertiary'
          }`}
        >
          2
        </span>
        Add Details
      </span>
    </div>
  );
}

/** Inline select field used in the metadata form */
function SelectField({
  label,
  items,
  selectedKey,
  onSelectionChange,
  placeholder,
}: {
  label: string;
  items: SelectItemType[];
  selectedKey: string;
  onSelectionChange: (key: string) => void;
  placeholder?: string;
}) {
  return (
    <div {...devProps('SelectField')}>
      <Select
        label={label}
        size="sm"
        items={items}
        placeholder={placeholder || `Select ${label.toLowerCase()}`}
        selectedKey={selectedKey || null}
        onSelectionChange={(key) => onSelectionChange(String(key))}
      >
        {(item: SelectItemType) => (
          <SelectItem key={item.id} id={item.id} label={item.label} />
        )}
      </Select>
    </div>
  );
}

/** Text input field used in the metadata form — wraps UUI Input */
function MetadataTextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div {...devProps('MetadataTextField')}>
      <Input
        label={label}
        value={value}
        onChange={(v) => onChange(v)}
        placeholder={placeholder}
        size="sm"
      />
    </div>
  );
}

/** Metadata form that adapts fields based on asset type */
function MetadataForm({
  assetType,
  file,
  onChange,
}: {
  assetType: UploadAssetType;
  file: SelectedFile;
  onChange: (field: string, value: string) => void;
}) {
  const { metadata } = file;

  switch (assetType) {
    case 'logo':
      return (
        <div {...devProps('MetadataForm')} className="space-y-3">
          <MetadataTextField
            label="Name"
            value={metadata.name || ''}
            onChange={(v) => onChange('name', v)}
            placeholder="Logo name"
          />
          <SelectField
            label="Category"
            items={LOGO_CATEGORIES}
            selectedKey={metadata.category || ''}
            onSelectionChange={(v) => onChange('category', v)}
          />
          <SelectField
            label="Type"
            items={LOGO_TYPES}
            selectedKey={metadata.type || ''}
            onSelectionChange={(v) => onChange('type', v)}
          />
          <SelectField
            label="Variant"
            items={LOGO_VARIANTS}
            selectedKey={metadata.variant || ''}
            onSelectionChange={(v) => onChange('variant', v)}
          />
        </div>
      );

    case 'font':
      return (
        <div {...devProps('MetadataForm')} className="space-y-3">
          <MetadataTextField
            label="Family Name"
            value={metadata.family || ''}
            onChange={(v) => onChange('family', v)}
            placeholder="Font family"
          />
          <SelectField
            label="Weight"
            items={FONT_WEIGHTS}
            selectedKey={metadata.weight || ''}
            onSelectionChange={(v) => onChange('weight', v)}
          />
          <SelectField
            label="Style"
            items={FONT_STYLES}
            selectedKey={metadata.style || ''}
            onSelectionChange={(v) => onChange('style', v)}
          />
          <SelectField
            label="Usage"
            items={FONT_USAGES}
            selectedKey={metadata.usage || ''}
            onSelectionChange={(v) => onChange('usage', v)}
          />
        </div>
      );

    case 'image':
      return (
        <div {...devProps('MetadataForm')} className="space-y-3">
          <MetadataTextField
            label="Name"
            value={metadata.name || ''}
            onChange={(v) => onChange('name', v)}
            placeholder="Image name"
          />
          <MetadataTextField
            label="Category"
            value={metadata.category || ''}
            onChange={(v) => onChange('category', v)}
            placeholder="e.g. Product, Lifestyle"
          />
          <MetadataTextField
            label="Tags"
            value={metadata.tags || ''}
            onChange={(v) => onChange('tags', v)}
            placeholder="Comma-separated tags"
          />
        </div>
      );

    case 'art-direction':
      return (
        <div {...devProps('MetadataForm')} className="space-y-3">
          <MetadataTextField
            label="Name"
            value={metadata.name || ''}
            onChange={(v) => onChange('name', v)}
            placeholder="Art direction name"
          />
          <SelectField
            label="Category"
            items={ART_DIRECTION_CATEGORIES}
            selectedKey={metadata.category || ''}
            onSelectionChange={(v) => onChange('category', v)}
          />
          <MetadataTextField
            label="Tags"
            value={metadata.tags || ''}
            onChange={(v) => onChange('tags', v)}
            placeholder="Comma-separated tags"
          />
        </div>
      );

    case 'texture':
      return (
        <div {...devProps('MetadataForm')} className="space-y-3">
          <MetadataTextField
            label="Name"
            value={metadata.name || ''}
            onChange={(v) => onChange('name', v)}
            placeholder="Texture name"
          />
          <SelectField
            label="Category"
            items={TEXTURE_CATEGORIES}
            selectedKey={metadata.category || ''}
            onSelectionChange={(v) => onChange('category', v)}
          />
        </div>
      );

    case 'guideline':
      return (
        <div {...devProps('MetadataForm')} className="space-y-3">
          <MetadataTextField
            label="Name"
            value={metadata.name || ''}
            onChange={(v) => onChange('name', v)}
            placeholder="Document name"
          />
          <SelectField
            label="Document Type"
            items={GUIDELINE_TYPES}
            selectedKey={metadata.documentType || ''}
            onSelectionChange={(v) => onChange('documentType', v)}
          />
        </div>
      );
  }
}

/** Preview card for a single selected file shown in the metadata step */
function FilePreviewCard({
  selectedFile,
  assetType,
  onMetadataChange,
  onRetry,
}: {
  selectedFile: SelectedFile;
  assetType: UploadAssetType;
  onMetadataChange: (field: string, value: string) => void;
  onRetry: () => void;
}) {
  const { file, previewUrl, status, error } = selectedFile;
  const ext = getFileExtension(file.name);

  return (
    <div
      {...devProps('FilePreviewCard')}
      className={`rounded-xl border p-4 space-y-4 ${
        status === 'success'
          ? 'border-border-success bg-bg-success-primary'
          : status === 'error'
            ? 'border-border-error bg-bg-error-primary'
            : 'border-border-primary bg-bg-secondary'
      }`}
    >
      {/* File info header */}
      <div className="flex items-start gap-3">
        {/* Preview or icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-bg-tertiary flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <File01 className="w-6 h-6 text-fg-tertiary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-fg-primary truncate">
            {file.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-fg-tertiary">
              {formatFileSize(file.size)}
            </span>
            {ext && (
              <Badge type="pill-color" size="sm" color="gray">
                {ext}
              </Badge>
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex-shrink-0">
          {status === 'uploading' && (
            <Loading01 className="w-5 h-5 animate-spin text-fg-brand-primary" />
          )}
          {status === 'success' && (
            <Check className="w-5 h-5 text-fg-success-primary" />
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-fg-error-primary" />
              <Button
                color="tertiary-destructive"
                size="sm"
                iconLeading={RefreshCcw01}
                onClick={onRetry}
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {status === 'error' && error && (
        <p className="text-xs text-fg-error-primary flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}

      {/* Metadata form — only show when idle */}
      {status === 'idle' && (
        <MetadataForm
          assetType={assetType}
          file={selectedFile}
          onChange={onMetadataChange}
        />
      )}
    </div>
  );
}

// ---- Main Component ----

/**
 * Shared upload modal for all Brand Hub asset types.
 * Guides users through a two-step flow: file selection then metadata entry.
 * Calls the provided uploadFn for each file — does not own any Supabase logic.
 */
export function BrandAssetUploadModal({
  isOpen,
  onClose,
  assetType,
  onUploadComplete,
  uploadFn,
}: BrandAssetUploadModalProps) {
  const [step, setStep] = useState<UploadStep>('select');
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const previewUrlsRef = useRef<string[]>([]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, []);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow exit animation
      const timeout = setTimeout(() => {
        setStep('select');
        setSelectedFiles([]);
        setIsUploading(false);
        previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        previewUrlsRef.current = [];
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleFileSelect = useCallback(
    (fileList: FileList) => {
      const newFiles: SelectedFile[] = Array.from(fileList).map((file) => {
        let previewUrl: string | null = null;
        if (isImageMimeType(file.type)) {
          previewUrl = URL.createObjectURL(file);
          previewUrlsRef.current.push(previewUrl);
        }
        return {
          file,
          previewUrl,
          metadata: getDefaultMetadata(assetType, file),
          status: 'idle' as const,
          error: null,
        };
      });
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    },
    [assetType]
  );

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const file = prev[index];
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (url) => url !== file.previewUrl
        );
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleMetadataChange = useCallback(
    (fileIndex: number, field: string, value: string) => {
      setSelectedFiles((prev) =>
        prev.map((f, i) =>
          i === fileIndex
            ? { ...f, metadata: { ...f.metadata, [field]: value } }
            : f
        )
      );
    },
    []
  );

  const updateFileStatus = useCallback(
    (index: number, status: FileUploadStatus, error?: string) => {
      setSelectedFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status, error: error || null } : f
        )
      );
    },
    []
  );

  const uploadSingleFile = useCallback(
    async (index: number) => {
      const selected = selectedFiles[index];
      if (!selected || selected.status === 'success') return;

      updateFileStatus(index, 'uploading');
      try {
        await uploadFn(selected.file, selected.metadata);
        updateFileStatus(index, 'success');
      } catch (err) {
        updateFileStatus(
          index,
          'error',
          err instanceof Error ? err.message : 'Upload failed'
        );
      }
    },
    [selectedFiles, uploadFn, updateFileStatus]
  );

  const handleUpload = useCallback(async () => {
    setIsUploading(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].status === 'success') continue;
      updateFileStatus(i, 'uploading');
      try {
        await uploadFn(selectedFiles[i].file, selectedFiles[i].metadata);
        updateFileStatus(i, 'success');
      } catch (err) {
        updateFileStatus(
          i,
          'error',
          err instanceof Error ? err.message : 'Upload failed'
        );
      }
    }

    setIsUploading(false);

    // Count successes from the latest state
    setSelectedFiles((prev) => {
      const successCount = prev.filter((f) => f.status === 'success').length;
      onUploadComplete?.(successCount);

      // Auto-close if all succeeded
      const allDone = prev.every((f) => f.status === 'success');
      if (allDone) {
        setTimeout(onClose, 500);
      }

      return prev;
    });
  }, [selectedFiles, uploadFn, updateFileStatus, onUploadComplete, onClose]);

  const handleRetryFile = useCallback(
    (index: number) => {
      uploadSingleFile(index);
    },
    [uploadSingleFile]
  );

  const hasFailures = selectedFiles.some((f) => f.status === 'error');
  const allDone = selectedFiles.length > 0 && selectedFiles.every((f) => f.status === 'success');
  const canAdvance = selectedFiles.length > 0;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }} isDismissable>
      <Modal className="max-w-4xl">
        <Dialog className="border border-border-primary">
          <div
            {...devProps('BrandAssetUploadModal')}
            className="max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border-primary">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-fg-primary">
                  Upload {ASSET_TYPE_LABELS[assetType]}
                </h2>
                <UploadStepIndicator currentStep={step} />
              </div>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={XClose}
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-12rem)] p-6 custom-scrollbar">
              {step === 'select' && (
                <div className="space-y-4">
                  <FileUploadZone
                    onFileSelect={handleFileSelect}
                    accept={ACCEPTED_FILE_TYPES[assetType]}
                    multiple
                    label={`Drop ${ASSET_TYPE_LABELS[assetType].toLowerCase()} here or click to upload`}
                    description={`Accepted: ${ACCEPTED_FILE_TYPES[assetType]}`}
                  />

                  {/* Selected files list */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-fg-secondary">
                        {selectedFiles.length} file
                        {selectedFiles.length !== 1 ? 's' : ''} selected
                      </p>
                      {selectedFiles.map((sf, i) => (
                        <div
                          key={`${sf.file.name}-${i}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary border border-border-primary"
                        >
                          {/* Preview thumbnail or icon */}
                          <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden bg-bg-tertiary flex items-center justify-center">
                            {sf.previewUrl ? (
                              <img
                                src={sf.previewUrl}
                                alt={sf.file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <File01 className="w-4 h-4 text-fg-tertiary" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-fg-primary truncate">
                              {sf.file.name}
                            </p>
                          </div>

                          <span className="text-xs text-fg-tertiary">
                            {formatFileSize(sf.file.size)}
                          </span>

                          {getFileExtension(sf.file.name) && (
                            <Badge type="pill-color" size="sm" color="gray">
                              {getFileExtension(sf.file.name)}
                            </Badge>
                          )}

                          <Button
                            color="tertiary"
                            size="sm"
                            iconLeading={XClose}
                            onClick={() => handleRemoveFile(i)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 'metadata' && (
                <div className="space-y-4">
                  {selectedFiles.map((sf, i) => (
                    <FilePreviewCard
                      key={`${sf.file.name}-${i}`}
                      selectedFile={sf}
                      assetType={assetType}
                      onMetadataChange={(field, value) =>
                        handleMetadataChange(i, field, value)
                      }
                      onRetry={() => handleRetryFile(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border-primary">
              <div>
                {step === 'metadata' && !isUploading && !allDone && (
                  <Button
                    color="tertiary"
                    size="sm"
                    iconLeading={ArrowLeft}
                    onClick={() => setStep('select')}
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  color="secondary"
                  size="sm"
                  isDisabled={isUploading}
                  onClick={onClose}
                >
                  Cancel
                </Button>

                {step === 'select' && (
                  <Button
                    color="primary"
                    size="sm"
                    iconTrailing={ArrowRight}
                    isDisabled={!canAdvance}
                    onClick={() => setStep('metadata')}
                  >
                    Next
                  </Button>
                )}

                {step === 'metadata' && !allDone && (
                  <Button
                    color="primary"
                    size="sm"
                    isLoading={isUploading}
                    showTextWhileLoading
                    onClick={handleUpload}
                  >
                    {hasFailures ? 'Retry Failed' : 'Upload'}
                  </Button>
                )}

                {allDone && (
                  <Button
                    color="primary"
                    size="sm"
                    iconLeading={Check}
                    onClick={onClose}
                  >
                    Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
