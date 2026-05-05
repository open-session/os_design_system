'use client';

import { useEffect } from 'react';
import { useBrandThemes } from '@/hooks/useBrandThemes';
import {
  applyPaletteToRoot,
  clearPaletteFromRoot,
  DEFAULT_PALETTE_ID,
  getPalettePreset,
} from '@/lib/theme/palette-presets';

/**
 * Reads the saved palette from the active brand_themes row and applies it
 * to the :root CSS primitives so every `--color-brand-*` token cascades
 * through the UI on first paint.
 */
export function PaletteBootstrap() {
  const { theme } = useBrandThemes();

  useEffect(() => {
    if (!theme) return;
    const id = theme.colors?.activePaletteId ?? DEFAULT_PALETTE_ID;
    const preset = getPalettePreset(id);
    if (preset && id !== DEFAULT_PALETTE_ID) applyPaletteToRoot(preset);
    else clearPaletteFromRoot();
  }, [theme]);

  return null;
}
