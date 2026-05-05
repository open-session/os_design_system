'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bold01,
  Check,
  Copy01,
  Download01,
  File01,
  Type01,
} from '@untitledui-pro/icons/line';
// UUI fallback: FileType → File01 (no FileType in UUI)
import { devProps } from '@/lib/utils/dev-props';
import type { BrandThemeTypography, BrandThemeTypographyFamily } from '@/lib/supabase/types';

interface TypographyTokensPreviewProps {
  typography: BrandThemeTypography;
}

// Copy button component
function CopyButton({ text }: { text: string }) {
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
      className="p-1 rounded text-fg-tertiary hover:text-fg-primary transition-colors"
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

// Font family preview card
function FontFamilyCard({
  name,
  family,
  index
}: {
  name: string;
  family: BrandThemeTypographyFamily;
  index: number;
}) {
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const isAccent = name === 'mono' || name === 'accent';

  // Map family name to CSS font-family
  const fontFamilyCSS = family.value === 'Offbit'
    ? 'var(--font-accent)'
    : family.value === 'Neue Haas Grotesk Display Pro'
      ? 'var(--font-display)'
      : 'inherit';

  return (
    <motion.div
      {...devProps('FontFamilyCard')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-xl border border-border-secondary bg-bg-tertiary overflow-hidden"
    >
      {/* Preview area */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Header with name and badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-medium text-fg-primary">
              {family.value}
            </h4>
            <p className="text-xs text-fg-tertiary mt-0.5">
              {family.usage}
            </p>
          </div>
          {isAccent && (
            <span className="px-2 py-0.5 text-[10px] font-medium text-amber-400 bg-amber-500/10 rounded-full shrink-0">
              Max 2 per viewport
            </span>
          )}
        </div>

        {/* Live preview */}
        <div
          className="min-h-[60px] p-3 rounded-lg bg-bg-secondary border border-border-secondary"
          style={{ fontFamily: fontFamilyCSS }}
        >
          <textarea
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="w-full bg-transparent text-lg text-fg-primary resize-none outline-hidden leading-relaxed"
            rows={2}
            placeholder="Type to preview..."
          />
        </div>

        {/* Font info */}
        <div className="flex flex-wrap gap-4 text-xs text-fg-tertiary">
          <div className="flex items-center gap-1.5">
            <span className="text-fg-quaternary">Family:</span>
            <code className="font-mono">{family.value}</code>
            <CopyButton text={family.value} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-fg-quaternary">Fallback:</span>
            <code className="font-mono">{family.fallback.slice(0, 2).join(', ')}</code>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Type scale row
function TypeScaleRow({
  name,
  item,
  fontFamilies,
  index
}: {
  name: string;
  item: { fontFamily: string; fontWeight: number; fontSize: string; lineHeight: number; note?: string };
  fontFamilies: Record<string, BrandThemeTypographyFamily>;
  index: number;
}) {
  const fontFamilyName = fontFamilies[item.fontFamily]?.value || item.fontFamily;

  const fontFamilyCSS = item.fontFamily === 'mono' || item.fontFamily === 'accent'
    ? 'var(--font-accent)'
    : 'var(--font-display)';

  return (
    <motion.div
      {...devProps('TypeScaleRow')}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="flex items-center gap-4 py-3 px-4 hover:bg-bg-tertiary transition-colors group"
    >
      {/* Sample text */}
      <div
        className="w-24 sm:w-32 shrink-0"
        style={{
          fontFamily: fontFamilyCSS,
          fontSize: item.fontSize,
          fontWeight: item.fontWeight,
          lineHeight: item.lineHeight,
        }}
      >
        <span className="text-fg-primary">Aa</span>
      </div>

      {/* Scale name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-fg-secondary">{name}</code>
          {item.note && (
            <span className="text-[10px] text-amber-400 hidden sm:inline">
              {item.note}
            </span>
          )}
        </div>
        <span className="text-xs text-fg-tertiary">
          {fontFamilyName}
        </span>
      </div>

      {/* Properties */}
      <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-fg-tertiary">
        <span className="w-16">{item.fontSize}</span>
        <span className="w-10">{item.fontWeight}</span>
        <span className="w-10">{item.lineHeight}</span>
      </div>

      {/* Copy */}
      <CopyButton text={name} />
    </motion.div>
  );
}

// Get weight name from number
function getWeightName(weight: number): string {
  const names: Record<number, string> = {
    100: 'Thin',
    200: 'Extra Light',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'Semi Bold',
    700: 'Bold',
    800: 'Extra Bold',
    900: 'Black',
  };
  return names[weight] || `Weight ${weight}`;
}

// Font file row component
function FontFileRow({
  name,
  file,
  index
}: {
  name: string;
  file: { family: string; weight: number; style: string; file: string };
  index: number;
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/styles/${file.file}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.file.split('/').pop() || 'font.woff2';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const fileName = file.file.split('/').pop() || '';
  const weightName = getWeightName(file.weight);

  return (
    <motion.div
      {...devProps('FontFileRow')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-bg-tertiary transition-colors group"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-secondary flex items-center justify-center shrink-0">
        <File01 className="w-5 h-5 text-fg-tertiary" />
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-fg-primary truncate">
            {fileName}
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-medium text-fg-tertiary bg-bg-tertiary rounded uppercase">
            woff2
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-fg-tertiary">
            {file.family}
          </span>
          <span className="text-xs text-fg-quaternary">·</span>
          <span className="text-xs text-fg-tertiary">
            {weightName}
          </span>
        </div>
      </div>

      {/* Download button */}
      <motion.button
        onClick={handleDownload}
        disabled={downloading}
        className="p-2 rounded-lg text-fg-tertiary hover:text-fg-brand-primary hover:bg-bg-tertiary transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Download ${fileName}`}
      >
        {downloaded ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : downloading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Download01 className="w-4 h-4" />
          </motion.div>
        ) : (
          <Download01 className="w-4 h-4" />
        )}
      </motion.button>
    </motion.div>
  );
}

/**
 * TypographyTokensPreview
 *
 * Displays font families with live previews, type scale table,
 * font weights, and font file downloads.
 */
export function TypographyTokensPreview({ typography }: TypographyTokensPreviewProps) {
  // Get unique display families (display and mono/accent only)
  const primaryFamilies = ['display', 'mono'].map(key => ({
    key,
    family: typography.fontFamilies[key]
  })).filter(f => f.family);

  const hierarchyItems = Object.entries(typography.hierarchy);

  // Font files grouped by family
  const fontFiles = typography.fontFiles
    ? Object.entries(typography.fontFiles)
    : [];

  const groupedFontFiles = fontFiles.reduce((acc, [name, file]) => {
    const family = file.family;
    if (!acc[family]) acc[family] = [];
    acc[family].push({ name, file });
    return acc;
  }, {} as Record<string, Array<{ name: string; file: { family: string; weight: number; style: string; file: string } }>>);

  return (
    <div {...devProps('TypographyTokensPreview')} className="space-y-6">
      {/* Font Families */}
      <div>
        <h4 className="text-sm font-medium text-fg-secondary mb-3">
          Font Families
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {primaryFamilies.map((item, index) => (
            <FontFamilyCard
              key={item.key}
              name={item.key}
              family={item.family}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Type Scale */}
      <div>
        <h4 className="text-sm font-medium text-fg-secondary mb-3">
          Type Scale
        </h4>
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary overflow-hidden">
          {/* Header */}
          <div className="hidden sm:flex items-center gap-4 py-2 px-4 border-b border-border-secondary bg-bg-tertiary">
            <span className="w-24 sm:w-32 shrink-0 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Sample
            </span>
            <span className="flex-1 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Token
            </span>
            <span className="w-16 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Size
            </span>
            <span className="w-10 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Weight
            </span>
            <span className="w-10 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Line
            </span>
            <span className="w-6" />
          </div>

          {/* Rows */}
          <div className="divide-y divide-border-tertiary">
            {hierarchyItems.map(([name, item], index) => (
              <TypeScaleRow
                key={name}
                name={name}
                item={item}
                fontFamilies={typography.fontFamilies}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h4 className="text-sm font-medium text-fg-secondary mb-3">
          Font Weights
        </h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(typography.fontWeights).map(([name, weight], index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-secondary bg-bg-tertiary group"
            >
              <span
                className="text-sm text-fg-primary"
                style={{ fontWeight: weight }}
              >
                {name}
              </span>
              <code className="text-xs font-mono text-fg-tertiary">{weight}</code>
              <CopyButton text={String(weight)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Font Files */}
      {fontFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-fg-secondary mb-3">
            Font Files
          </h4>
          <div className="space-y-4">
            {Object.entries(groupedFontFiles).map(([family, familyFiles], groupIndex) => (
              <motion.div
                key={family}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
              >
                <h5 className="text-xs font-medium text-fg-tertiary mb-2 px-1">
                  {family}
                </h5>
                <div className="rounded-lg border border-border-secondary bg-bg-tertiary divide-y divide-border-tertiary">
                  {familyFiles.map(({ name, file }, index) => (
                    <FontFileRow
                      key={name}
                      name={name}
                      file={file}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
            <p className="text-xs text-fg-tertiary">
              {fontFiles.length} font files · WOFF2 format for optimal web performance
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
