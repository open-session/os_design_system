'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ChevronDown,
  Clock,
  Copy01,
  FilterLines,
  InfoCircle,
  Pencil01,
  Type01,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { TokenPreviewSection } from './TokenPreviewSection';
import { ContrastChecker } from './ContrastChecker';
import type { BrandThemeColors } from '@/lib/supabase/types';
import { getCsrfHeaders } from '@/hooks/useCsrf';

interface ColorTokensPreviewProps {
  colors: BrandThemeColors;
  themeId?: string;
  onColorsChange?: (colors: BrandThemeColors) => void;
  /** Initial foreground slug from persisted theme data */
  initialContrastFgSlug?: string;
  /** Initial background slug from persisted theme data */
  initialContrastBgSlug?: string;
  /** Callback when contrast checker selections change */
  onContrastSelectionChange?: (fgSlug: string, bgSlug: string) => void;
  /** Callback to open the color version history panel */
  onHistoryOpen?: () => void;
}

// Helper to determine if text should be light or dark on a color
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return '#FFFFFF';
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#191919' : '#FFFFFF';
}

// Copy button component
function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      {...devProps('CopyButton')}
      onClick={handleCopy}
      className={`p-1 rounded transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Copy ${text}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy01 className="w-3.5 h-3.5" />
      )}
    </motion.button>
  );
}

// Brand color swatch component (for core colors)
function BrandColorSwatch({
  name,
  hex,
  role
}: {
  name: string;
  hex: string;
  role: string;
}) {
  const textColor = getContrastColor(hex);

  return (
    <motion.div
      {...devProps('BrandColorSwatch')}
      className="group relative flex flex-col rounded-xl overflow-hidden border border-border-secondary"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {/* Color swatch */}
      <div
        className="h-24 sm:h-28 relative flex items-end p-3"
        style={{ backgroundColor: hex }}
      >
        <span
          className="text-lg font-medium"
          style={{ color: textColor }}
        >
          {name}
        </span>

        {/* Copy button - appears on hover */}
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: textColor }}
        >
          <CopyButton text={hex} />
        </div>
      </div>

      {/* InfoCircle */}
      <div className="p-3 bg-bg-secondary space-y-1.5">
        <div className="flex items-center justify-between">
          <code className="text-xs font-mono text-fg-secondary">
            {hex}
          </code>
          <CopyButton text={hex} className="text-fg-tertiary hover:text-fg-primary" />
        </div>
        <p className="text-xs text-fg-tertiary leading-relaxed capitalize">
          {role}
        </p>
      </div>
    </motion.div>
  );
}

// Compact color scale component with visible hex codes
function CompactColorScale({
  name,
  scale,
  index
}: {
  name: string;
  scale: Record<string, string>;
  index: number;
}) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const entries = Object.entries(scale).sort(([a], [b]) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  const handleCopy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <motion.div
      {...devProps('CompactColorScale')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="space-y-2"
    >
      <h5 className="text-xs font-medium text-fg-tertiary uppercase tracking-wider capitalize">
        {name}
      </h5>
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([step, hex]) => (
          <button
            key={step}
            onClick={() => handleCopy(hex)}
            className="group flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
            aria-label={`Copy ${step}: ${hex}`}
          >
            {/* Swatch */}
            <div
              className="w-8 h-8 rounded border border-border-secondary"
              style={{ backgroundColor: hex }}
            />
            {/* Step label */}
            <span className="text-[9px] font-mono text-fg-quaternary">
              {step}
            </span>
            {/* Hex code - always visible */}
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] font-mono text-fg-tertiary truncate max-w-[3.5rem] text-center">
                {hex}
              </span>
              {/* Copy icon indicator */}
              <div className="w-3 h-3 flex items-center justify-center">
                {copiedHex === hex ? (
                  <Check className="w-2.5 h-2.5 text-green-500" />
                ) : (
                  <Copy01 className="w-2.5 h-2.5 text-fg-quaternary opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Semantic token group with collapsible behavior and inline editing
function SemanticTokenGroup({
  category,
  lightTokens,
  darkTokens,
  startIndex,
  coreColors,
  themeId,
  onTokenUpdate,
}: {
  category: string;
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  startIndex: number;
  coreColors: BrandThemeColors['core'];
  themeId?: string;
  onTokenUpdate?: (category: string, tokenName: string, mode: 'light' | 'dark', value: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingToken, setEditingToken] = useState<{ tokenName: string; mode: 'light' | 'dark' } | null>(null);
  const [editValue, setEditValue] = useState('');

  const tokenNames = Object.keys(lightTokens);
  const groupId = `semantic-group-${category}`;

  const handleEditStart = (tokenName: string, mode: 'light' | 'dark', currentValue: string) => {
    setEditingToken({ tokenName, mode });
    setEditValue(currentValue);
  };

  const handleEditConfirm = () => {
    if (editingToken && onTokenUpdate) {
      onTokenUpdate(category, editingToken.tokenName, editingToken.mode, editValue);
    }
    setEditingToken(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingToken(null);
    setEditValue('');
  };

  const handleColorSelect = (hex: string) => {
    setEditValue(hex);
  };

  return (
    <div {...devProps('SemanticTokenGroup')}>
      {/* Group header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        aria-controls={groupId}
        className="flex items-center justify-between px-3 py-2 bg-bg-tertiary border-b border-border-secondary hover:bg-bg-secondary transition-colors cursor-pointer"
      >
        <h5 className="text-xs font-medium text-fg-tertiary uppercase tracking-wider">
          {category.replace(/_/g, ' ')}
        </h5>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-fg-tertiary" />
        </motion.div>
      </div>

      {/* Token rows */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={groupId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.15 }
            }}
            className="divide-y divide-border-secondary"
          >
            {tokenNames.map((tokenName, index) => {
              const lightValue = lightTokens[tokenName] || '';
              const darkValue = darkTokens[tokenName] || '';
              const isHexOrRgba = (v: string) => v.startsWith('#') || v.startsWith('rgb');
              const fullVarName = `var(--${category.replace(/_/g, '-')}-${tokenName.replace(/_/g, '-')})`;
              const isEditingLight = editingToken?.tokenName === tokenName && editingToken?.mode === 'light';
              const isEditingDark = editingToken?.tokenName === tokenName && editingToken?.mode === 'dark';

              return (
                <motion.div
                  key={tokenName}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: (startIndex + index) * 0.02 }}
                  className="flex items-center gap-3 py-2 px-3 hover:bg-bg-tertiary transition-colors group"
                >
                  {/* Variable name with var() wrapper */}
                  <span className="flex-1 text-sm font-mono text-fg-secondary truncate">
                    {fullVarName}
                  </span>

                  {/* Light mode */}
                  <div className="flex items-center gap-2">
                    {isEditingLight ? (
                      <TokenEditPopover
                        coreColors={coreColors}
                        currentValue={editValue}
                        onColorSelect={handleColorSelect}
                        onValueChange={setEditValue}
                        onConfirm={handleEditConfirm}
                        onCancel={handleEditCancel}
                      />
                    ) : (
                      <>
                        {isHexOrRgba(lightValue) && (
                          <div
                            className="w-5 h-5 rounded border border-border-secondary shadow-sm shrink-0"
                            style={{ backgroundColor: lightValue }}
                            title={lightValue}
                          />
                        )}
                        <span className="text-[10px] text-fg-tertiary w-16 font-mono truncate" title={lightValue}>
                          {lightValue}
                        </span>
                        {themeId && (
                          <button
                            onClick={() => handleEditStart(tokenName, 'light', lightValue)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-bg-tertiary transition-opacity"
                            aria-label="Edit light mode value"
                          >
                            <Pencil01 className="w-3 h-3 text-fg-tertiary" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Dark mode */}
                  <div className="flex items-center gap-2">
                    {isEditingDark ? (
                      <TokenEditPopover
                        coreColors={coreColors}
                        currentValue={editValue}
                        onColorSelect={handleColorSelect}
                        onValueChange={setEditValue}
                        onConfirm={handleEditConfirm}
                        onCancel={handleEditCancel}
                      />
                    ) : (
                      <>
                        {isHexOrRgba(darkValue) && (
                          <div
                            className="w-5 h-5 rounded border border-border-secondary shadow-sm shrink-0"
                            style={{ backgroundColor: darkValue }}
                            title={darkValue}
                          />
                        )}
                        <span className="text-[10px] text-fg-tertiary w-16 font-mono truncate" title={darkValue}>
                          {darkValue}
                        </span>
                        {themeId && (
                          <button
                            onClick={() => handleEditStart(tokenName, 'dark', darkValue)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-bg-tertiary transition-opacity"
                            aria-label="Edit dark mode value"
                          >
                            <Pencil01 className="w-3 h-3 text-fg-tertiary" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Copy */}
                  <CopyButton
                    text={fullVarName}
                    className="text-fg-tertiary hover:text-fg-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline token edit popover
function TokenEditPopover({
  coreColors,
  currentValue,
  onColorSelect,
  onValueChange,
  onConfirm,
  onCancel,
}: {
  coreColors: BrandThemeColors['core'];
  currentValue: string;
  onColorSelect: (hex: string) => void;
  onValueChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div {...devProps('TokenEditPopover')} className="flex items-center gap-2 p-2 bg-bg-secondary rounded-lg border border-border-secondary">
      {/* Brand color swatches */}
      <div className="flex items-center gap-1">
        {coreColors.map((color) => (
          <button
            key={color.slug}
            onClick={() => onColorSelect(color.hex)}
            className="w-6 h-6 rounded border border-border-secondary hover:scale-110 transition-transform"
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`Select ${color.name}`}
          />
        ))}
      </div>

      {/* Custom hex input */}
      <input
        type="color"
        value={currentValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-8 h-6 rounded border border-border-secondary cursor-pointer"
        aria-label="Select custom color"
      />

      {/* Hex text input */}
      <input
        type="text"
        value={currentValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-20 px-2 py-1 text-xs font-mono bg-bg-primary border border-border-secondary rounded focus:border-border-primary focus:outline-hidden"
        placeholder="#000000"
      />

      {/* Confirm */}
      <button
        onClick={onConfirm}
        className="p-1 rounded hover:bg-bg-tertiary text-green-500"
        aria-label="Confirm"
      >
        <Check className="w-4 h-4" />
      </button>

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="p-1 rounded hover:bg-bg-tertiary text-fg-tertiary"
        aria-label="Cancel"
      >
        <XClose className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * ColorTokensPreview
 *
 * Displays core brand colors, color scales, and semantic token mappings
 * with visual swatches and copy-to-clipboard functionality.
 */
export function ColorTokensPreview({
  colors,
  themeId,
  onColorsChange,
  initialContrastFgSlug,
  initialContrastBgSlug,
  onContrastSelectionChange,
  onHistoryOpen,
}: ColorTokensPreviewProps) {
  const [filterText, setFilterText] = useState('');
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [semanticSectionExpanded, setSemanticSectionExpanded] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Get semantic categories (bg, fg, border, etc.)
  const lightCategories = Object.keys(colors.semantic.light);
  const darkCategories = colors.semantic.dark;

  // Filter categories by search text
  const filteredCategories = filterText
    ? lightCategories.filter(cat =>
        cat.toLowerCase().includes(filterText.toLowerCase())
      )
    : lightCategories;

  // Handle token update
  const handleTokenUpdate = async (category: string, tokenName: string, mode: 'light' | 'dark', value: string) => {
    if (!themeId || !onColorsChange) return;

    setSaveError(null);

    try {
      // Update the colors object
      const updatedColors: BrandThemeColors = {
        ...colors,
        semantic: {
          ...colors.semantic,
          [mode]: {
            ...colors.semantic[mode],
            [category]: {
              ...colors.semantic[mode][category],
              [tokenName]: value,
            },
          },
        },
      };

      // Call the API
      const response = await fetch('/api/brand-themes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
        credentials: 'include',
        body: JSON.stringify({
          id: themeId,
          colors: updatedColors,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update theme');
      }

      const updatedTheme = await response.json();
      onColorsChange(updatedTheme.colors);
    } catch (error) {
      console.error('Error updating token:', error);
      setSaveError('Failed to save changes. Please try again.');
      setTimeout(() => setSaveError(null), 5000);
    }
  };

  let semanticIndex = 0;

  return (
    <div {...devProps('ColorTokensPreview')} className="space-y-6">
      {/* Core Brand Colors */}
      <div className="group">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-fg-secondary">
            Brand Colors
          </h4>
          {onHistoryOpen && (
            <button
              onClick={onHistoryOpen}
              className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary"
              title="View color history"
              aria-label="View color history"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {colors.core.map((color) => (
            <BrandColorSwatch
              key={color.slug}
              name={color.name}
              hex={color.hex}
              role={color.role}
            />
          ))}
        </div>
      </div>

      {/* Contrast Checker */}
      {themeId && (
        <ContrastChecker
          colors={colors.core}
          themeId={themeId}
          initialFgSlug={initialContrastFgSlug}
          initialBgSlug={initialContrastBgSlug}
          onSelectionChange={onContrastSelectionChange}
        />
      )}

      {/* Color Scales */}
      {(() => {
        // Sort scales: Brand first, then Gray, then alphabetical
        const SCALE_ORDER = ['brand', 'gray'];
        const sortedScales = Object.entries(colors.scales)
          .filter(([name]) => name !== 'utility')
          .sort(([a], [b]) => {
            const ai = SCALE_ORDER.indexOf(a);
            const bi = SCALE_ORDER.indexOf(b);
            if (ai !== -1 && bi !== -1) return ai - bi;
            if (ai !== -1) return -1;
            if (bi !== -1) return 1;
            return a.localeCompare(b);
          });

        return (
          <TokenPreviewSection
            title="Color Scales"
            badge={`${sortedScales.length} scales`}
            defaultExpanded={true}
          >
            <p className="text-sm text-fg-secondary mb-4 leading-relaxed">
              Color scales are automatically generated from your brand colors following
              Tailwind CSS best practices and accessibility guidelines.
            </p>
            <div className="space-y-4">
              {sortedScales.map(([name, scale], index) => (
                <CompactColorScale
                  key={name}
                  name={name}
                  scale={scale}
                  index={index}
                />
              ))}
            </div>
          </TokenPreviewSection>
        );
      })()}

      {/* Semantic Tokens */}
      <TokenPreviewSection
        title="Semantic Tokens"
        badge={`${lightCategories.length} categories`}
        defaultExpanded={semanticSectionExpanded}
      >
        {/* Description with progressive disclosure */}
        <div className="mb-4">
          <p className="text-sm text-fg-secondary leading-relaxed">
            Semantic tokens are automatically generated from your brand colors.
          </p>
          <AnimatePresence initial={false}>
            {showLearnMore && (
              <motion.p
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: '0.5rem' }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-fg-tertiary leading-relaxed overflow-hidden"
              >
                You can customize individual values, but we recommend keeping the defaults for
                accessibility compliance. Overrides apply only to this theme and will not be
                affected by future regeneration.
              </motion.p>
            )}
          </AnimatePresence>
          <button
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="text-xs text-fg-brand-primary hover:underline mt-1"
          >
            {showLearnMore ? 'Show less' : 'Learn more'}
          </button>
        </div>

        {/* Filter input */}
        <div className="mb-4">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter categories..."
            className="w-full px-3 py-2 text-sm bg-bg-secondary border border-border-secondary rounded-lg focus:border-border-primary focus:bg-bg-tertiary focus:outline-hidden transition-colors"
          />
        </div>

        {/* Save error message */}
        {saveError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
            {saveError}
          </div>
        )}

        {/* Token table */}
        {lightCategories.length === 0 ? (
          <p className="text-sm text-fg-tertiary py-4 text-center">
            No semantic tokens defined.
          </p>
        ) : filteredCategories.length === 0 ? (
          <p className="text-sm text-fg-tertiary py-6 text-center">
            No categories match &quot;{filterText}&quot;.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="rounded-lg border border-border-secondary bg-bg-tertiary overflow-hidden min-w-[480px]">
              {/* Header */}
              <div className="flex items-center gap-3 py-2 px-3 border-b border-border-secondary bg-bg-tertiary">
                <span className="flex-1 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Variable
                </span>
                <span className="text-xs font-medium text-fg-tertiary uppercase tracking-wider w-24 text-center">
                  Light
                </span>
                <span className="text-xs font-medium text-fg-tertiary uppercase tracking-wider w-24 text-center">
                  Dark
                </span>
                <span className="w-6" />
              </div>

              {/* Token groups */}
              {filteredCategories.map((category) => {
                const lightTokens = colors.semantic.light[category] || {};
                const darkTokens = darkCategories[category] || {};
                const count = Object.keys(lightTokens).length;
                const group = (
                  <SemanticTokenGroup
                    key={category}
                    category={category}
                    lightTokens={lightTokens}
                    darkTokens={darkTokens}
                    startIndex={semanticIndex}
                    coreColors={colors.core}
                    themeId={themeId}
                    onTokenUpdate={handleTokenUpdate}
                  />
                );
                semanticIndex += count;
                return group;
              })}
            </div>
          </div>
        )}
      </TokenPreviewSection>
    </div>
  );
}
