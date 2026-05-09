'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Check, Upload01 } from '@untitledui-pro/icons/line';
import { cx } from '@/utils/cx';
import { devProps } from '@/lib/utils/dev-props';
import {
  PALETTE_PRESETS,
  DEFAULT_PALETTE_ID,
  applyPaletteToRoot,
  clearPaletteFromRoot,
  getPalettePreset,
} from '@/lib/theme/palette-presets';
import type { PalettePreset } from '@/lib/theme/palette-presets';
import { useBrandThemes } from '@/hooks/useBrandThemes';
import { getCsrfHeaders } from '@/hooks/useCsrf';
import {
  SettingsSectionHeader,
  SettingsField,
  SettingsSectionFooter,
  SettingsDivider,
} from './SettingsSection';

// ─── Palette Swatch ──────────────────────────────────────────────────
interface PaletteSwatchProps {
  palette: PalettePreset;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function PaletteSwatch({ palette, isSelected, onSelect }: PaletteSwatchProps) {
  return (
    <button
      {...devProps('PaletteSwatch')}
      type="button"
      onClick={() => onSelect(palette.id)}
      className={cx(
        'group flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-quick',
        'hover:bg-bg-secondary-alt',
        isSelected
          ? 'bg-bg-secondary-alt ring-1 ring-brand-500 shadow-focus-ring'
          : 'ring-1 ring-border-secondary',
      )}
      aria-pressed={isSelected}
      aria-label={`${palette.name} palette`}
    >
      <div
        className="size-10 rounded-full shadow-xs transition-transform duration-quick group-hover:scale-110"
        style={{ backgroundColor: palette.shades[500] }}
      />
      <span className="text-xs font-medium text-fg-secondary">{palette.name}</span>
      {isSelected && (
        <Check className="size-3.5 text-fg-brand-primary" />
      )}
    </button>
  );
}

// ─── Scale Preview ───────────────────────────────────────────────────
interface ScalePreviewProps {
  palette: PalettePreset;
}

function ScalePreview({ palette }: ScalePreviewProps) {
  const shadeKeys = [50, 100, 200, 400, 500, 700] as const;

  return (
    <div {...devProps('ScalePreview')} className="space-y-3">
      <div className="flex gap-1.5">
        {shadeKeys.map((shade) => (
          <div key={shade} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="h-8 w-full rounded-md shadow-xs ring-1 ring-border-secondary/50 ring-inset"
              style={{ backgroundColor: palette.shades[shade] }}
            />
            <span className="text-[10px] font-medium text-fg-quaternary">{shade}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5">
        {Object.entries(palette.brandScale).map(([shade, hex]) => (
          <div key={shade} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="h-4 w-full rounded-sm"
              style={{ backgroundColor: hex }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-fg-quaternary">
        Full 12-stop scale ({palette.name} {palette.brandScale[500]})
      </p>
    </div>
  );
}

// ─── Logo Upload ─────────────────────────────────────────────────────
interface LogoUploadProps {
  logoUrl: string | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
  isUploading: boolean;
}

function LogoUpload({ logoUrl, onUpload, onDelete, isUploading }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a PNG or SVG file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be less than 2MB.');
      return;
    }

    onUpload(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div {...devProps('LogoUpload')} className="space-y-3">
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div
          className={cx(
            'relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-secondary bg-bg-secondary',
            isUploading && 'opacity-50',
          )}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Brand logo"
              fill
              className="object-contain p-1"
              sizes="64px"
            />
          ) : (
            <Upload01 className="size-6 text-fg-quaternary" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {logoUrl && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isUploading}
              className="text-sm font-semibold text-fg-tertiary hover:text-fg-secondary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-sm font-semibold text-fg-brand-secondary hover:text-fg-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isUploading ? 'Uploading...' : logoUrl ? 'Replace' : 'Upload'}
          </button>
        </div>
      </div>

      <p className="text-xs text-fg-quaternary">
        Recommended: 500 x 500px, PNG with transparent background or SVG. Max 2MB.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload brand logo"
      />
    </div>
  );
}

// ─── Theme Form ──────────────────────────────────────────────────────
export function ThemeForm() {
  const { resolvedTheme } = useTheme();
  const { theme: activeTheme, refresh: refreshTheme } = useBrandThemes();

  // State
  const [selectedPaletteId, setSelectedPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [savedPaletteId, setSavedPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [savedLogoUrl, setSavedLogoUrl] = useState<string | null>(null);
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Seed from the loaded brand theme once it arrives
  useEffect(() => {
    if (!activeTheme) return;
    const id = activeTheme.colors?.activePaletteId ?? DEFAULT_PALETTE_ID;
    const savedLogo = activeTheme.colors?.customLogoUrl ?? null;
    setSelectedPaletteId(id);
    setSavedPaletteId(id);
    setLogoUrl(savedLogo);
    setSavedLogoUrl(savedLogo);
  }, [activeTheme]);

  const isDirty = selectedPaletteId !== savedPaletteId || logoUrl !== savedLogoUrl;

  // Live preview: apply palette CSS vars when selection changes
  useEffect(() => {
    const palette = getPalettePreset(selectedPaletteId);
    if (palette && selectedPaletteId !== DEFAULT_PALETTE_ID) {
      applyPaletteToRoot(palette);
    } else {
      clearPaletteFromRoot();
    }
  }, [selectedPaletteId]);

  // Revert preview to saved palette only on unmount
  const savedPaletteIdRef = useRef(savedPaletteId);
  useEffect(() => {
    savedPaletteIdRef.current = savedPaletteId;
  }, [savedPaletteId]);
  useEffect(() => {
    return () => {
      const id = savedPaletteIdRef.current;
      const saved = getPalettePreset(id);
      if (saved && id !== DEFAULT_PALETTE_ID) applyPaletteToRoot(saved);
      else clearPaletteFromRoot();
    };
  }, []);

  const handlePaletteSelect = useCallback((id: string) => {
    setSelectedPaletteId(id);
  }, []);

  const handleLogoUpload = useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setLogoUrl(previewUrl);
    setPendingLogoFile(file);
  }, []);

  const handleLogoDelete = useCallback(() => {
    setLogoUrl(null);
    setPendingLogoFile(null);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedPaletteId(savedPaletteId);
    setLogoUrl(savedLogoUrl);
    setPendingLogoFile(null);
  }, [savedPaletteId, savedLogoUrl]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Upload logo if there's a pending file
      let finalLogoUrl = logoUrl;
      if (pendingLogoFile) {
        setIsUploading(true);
        try {
          // For now, use local preview URL. When Supabase storage is wired:
          // const { uploadBrandLogo } = await import('@/lib/supabase/settings-service');
          // finalLogoUrl = await uploadBrandLogo('open-session', pendingLogoFile);
          finalLogoUrl = logoUrl;
        } finally {
          setIsUploading(false);
        }
      }

      if (activeTheme) {
        const nextColors = {
          ...activeTheme.colors,
          activePaletteId: selectedPaletteId,
          customLogoUrl: finalLogoUrl,
        };
        const res = await fetch('/api/brand-themes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
          credentials: 'include',
          body: JSON.stringify({ id: activeTheme.id, colors: nextColors }),
        });
        if (!res.ok) {
          const detail = await res.text().catch(() => '');
          throw new Error(`Failed to save theme (${res.status}): ${detail}`);
        }
        await refreshTheme();
      }

      setSavedPaletteId(selectedPaletteId);
      setSavedLogoUrl(finalLogoUrl);
      setPendingLogoFile(null);
    } finally {
      setIsSaving(false);
    }
  }, [activeTheme, selectedPaletteId, logoUrl, pendingLogoFile, refreshTheme]);

  const selectedPalette = getPalettePreset(selectedPaletteId);

  return (
    <div {...devProps('ThemeForm')} className="space-y-0">
      {/* ── Section 1: Color Palette ── */}
      <SettingsSectionHeader
        title="Color palette"
        description="Choose a color theme for your workspace. This sets the brand accent used across the interface."
      />

      <SettingsField label="Active palette" description="Select a predefined color palette">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {PALETTE_PRESETS.map((palette) => (
            <PaletteSwatch
              key={palette.id}
              palette={palette}
              isSelected={selectedPaletteId === palette.id}
              onSelect={handlePaletteSelect}
            />
          ))}
        </div>
      </SettingsField>

      {selectedPalette && (
        <SettingsField label="Scale preview" description="How this palette maps across shades">
          <ScalePreview palette={selectedPalette} />
          <p className="mt-2 text-xs text-fg-quaternary">
            Currently viewing: {resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode.
            Toggle your theme to preview the other.
          </p>
        </SettingsField>
      )}

      <SettingsDivider className="my-1" />

      {/* ── Section 2: Logo ── */}
      <SettingsSectionHeader
        title="Logo"
        description="Upload your brand logo for the navigation header."
      />

      <SettingsField label="Header logo" description="Displayed in the top navigation">
        <LogoUpload
          logoUrl={logoUrl}
          onUpload={handleLogoUpload}
          onDelete={handleLogoDelete}
          isUploading={isUploading}
        />
      </SettingsField>

      <SettingsSectionFooter
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isSaving}
        isDisabled={!isDirty}
      />
    </div>
  );
}
