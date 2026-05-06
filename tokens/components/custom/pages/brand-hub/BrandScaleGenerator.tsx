'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, ChevronDown, ChevronUp, Check, XClose, AlertCircle } from '@untitledui-pro/icons/line';
import { generateBrandScale, type BrandScaleResult } from '@/lib/color-scale';
import { Button } from '@/components/ds/buttons/button';
import { devProps } from '@/lib/utils/dev-props';
import type { BrandColor } from '@/lib/supabase/types';

// ============================================
// TYPES
// ============================================

interface BrandScaleGeneratorProps {
  /** Brand colors available for scale generation (colorGroup === 'brand') */
  brandColors: BrandColor[];
  /** Whether a brand scale already exists */
  hasExistingScale: boolean;
  /** Callback to persist generated shades */
  onSave: (shades: BrandScaleResult) => Promise<void>;
}

type Step = 'idle' | 'select' | 'preview' | 'saving' | 'confirm-replace';

// ============================================
// COMPONENT
// ============================================

/**
 * Guided brand scale generation flow.
 *
 * Walks the user through selecting a brand color, previewing a 12-shade
 * OKLCH-based color scale, and saving it to the database. Only renders
 * when at least one brand color exists.
 */
export function BrandScaleGenerator({
  brandColors,
  hasExistingScale,
  onSave,
}: BrandScaleGeneratorProps) {
  const [step, setStep] = useState<Step>('idle');
  const [selectedColor, setSelectedColor] = useState<BrandColor | null>(null);
  const [scale, setScale] = useState<BrandScaleResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Don't render if no brand colors exist
  if (brandColors.length === 0) return null;

  /**
   * Handle CTA click: if a scale already exists, ask for confirmation first.
   */
  function handleCtaClick() {
    setError(null);
    if (hasExistingScale) {
      setStep('confirm-replace');
    } else {
      setStep('select');
    }
  }

  /**
   * Handle color selection and generate the scale preview.
   */
  function handleColorSelect(color: BrandColor) {
    setSelectedColor(color);
    setError(null);
    try {
      const result = generateBrandScale(color.hexValue);
      setScale(result);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate color scale.');
    }
  }

  /**
   * Handle confirm: save the generated scale.
   */
  async function handleConfirm() {
    if (!scale) return;
    setStep('saving');
    setError(null);
    try {
      await onSave(scale);
      // Reset to idle on success
      setStep('idle');
      setSelectedColor(null);
      setScale(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save brand scale. Please try again.');
      setStep('preview');
    }
  }

  /**
   * Reset the flow back to idle.
   */
  function handleCancel() {
    setStep('idle');
    setSelectedColor(null);
    setScale(null);
    setError(null);
    setShowExplanation(false);
  }

  return (
    <div {...devProps('BrandScaleGenerator')} className="mt-6">
      <AnimatePresence mode="wait">
        {/* IDLE: CTA Button */}
        {step === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              color="secondary"
              size="sm"
              iconLeading={Palette}
              onClick={handleCtaClick}
            >
              Generate brand scale
            </Button>
            <p className="mt-1.5 text-xs text-fg-quaternary">
              Create a 12-shade color ramp from one of your brand colors.
            </p>
          </motion.div>
        )}

        {/* CONFIRM REPLACE: Inline confirmation for existing scale */}
        {step === 'confirm-replace' && (
          <motion.div
            key="confirm-replace"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="rounded-lg border border-border-secondary bg-bg-secondary p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-fg-warning-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-fg-primary">
                  Replace existing brand scale?
                </p>
                <p className="mt-1 text-xs text-fg-tertiary">
                  This will replace your existing brand scale (12 shades) with a new one. This action cannot be undone.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => setStep('select')}
                  >
                    Continue
                  </Button>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SELECT: Pick a brand color */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="rounded-lg border border-border-secondary bg-bg-secondary p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-fg-primary">
                Select a brand color
              </h4>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={XClose}
                onClick={handleCancel}
                aria-label="Cancel"
              />
            </div>

            <p className="text-xs text-fg-tertiary mb-3">
              Choose the base color for your scale. The algorithm will generate 12 perceptually-even shades.
            </p>

            {/* Progressive disclosure: What is a brand scale? */}
            <button
              type="button"
              onClick={() => setShowExplanation((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs text-fg-quaternary hover:text-fg-tertiary transition-colors mb-3"
            >
              {showExplanation ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              What is a brand scale?
            </button>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-md bg-bg-tertiary p-3 mb-3 text-xs text-fg-tertiary leading-relaxed">
                    A brand scale is a set of 12 lightness variations of your brand color,
                    from near-white to near-black. Design systems like Tailwind and Radix use
                    these scales to create consistent, accessible UIs. Each shade is generated
                    using the OKLCH perceptual color space, ensuring visually even steps that
                    maintain the character of your brand color.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Color selection grid */}
            <div className="flex flex-wrap gap-2">
              {brandColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border-secondary bg-bg-primary hover:bg-bg-tertiary transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-md border border-border-secondary flex-shrink-0"
                    style={{ backgroundColor: color.hexValue }}
                  />
                  <div className="text-left">
                    <span className="text-sm text-fg-primary block">{color.name}</span>
                    {color.colorRole && (
                      <span className="text-[10px] text-fg-quaternary capitalize">
                        {color.colorRole}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-xs text-fg-error-primary">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
          </motion.div>
        )}

        {/* PREVIEW: Show generated scale */}
        {(step === 'preview' || step === 'saving') && scale && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="rounded-lg border border-border-secondary bg-bg-secondary p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-fg-primary">
                Brand scale preview
              </h4>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={XClose}
                onClick={handleCancel}
                isDisabled={step === 'saving'}
                aria-label="Cancel"
              />
            </div>

            {selectedColor && (
              <p className="text-xs text-fg-tertiary mb-3">
                Generated from{' '}
                <span className="font-medium text-fg-secondary">{selectedColor.name}</span>
                {' '}({selectedColor.hexValue})
              </p>
            )}

            {/* Scale preview row */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {scale.map(({ shade, hex, isSource }) => (
                <div key={shade} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-md border ${
                      isSource
                        ? 'ring-1 ring-offset-1 ring-border-brand border-border-brand'
                        : 'border-border-secondary'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`${shade}: ${hex}`}
                  />
                  <span className={`text-[10px] ${isSource ? 'font-semibold text-fg-secondary' : 'text-fg-quaternary'}`}>
                    {shade}
                  </span>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-xs text-fg-error-primary">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <Button
                color="primary"
                size="sm"
                iconLeading={step === 'saving' ? undefined : Check}
                isLoading={step === 'saving'}
                showTextWhileLoading
                isDisabled={step === 'saving'}
                onClick={handleConfirm}
              >
                {step === 'saving' ? 'Saving...' : 'Confirm'}
              </Button>
              <Button
                color="secondary"
                size="sm"
                isDisabled={step === 'saving'}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
