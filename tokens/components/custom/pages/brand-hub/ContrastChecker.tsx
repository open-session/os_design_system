'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  InfoCircle,
  Play,
  SwitchHorizontal01,
  Type01,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { getWcagContrast, type ContrastResult } from '@/lib/utils/color-contrast';
import {
  simulateColor,
  getSimulationLabel,
  getSimulationDescription,
  SIMULATION_MODES,
  type SimulationMode,
} from '@/lib/utils/color-simulation';
import { Select } from '@/components/base/base/select/select';
import type { BrandThemeColorCore } from '@/lib/supabase/types';
import { getCsrfHeaders } from '@/hooks/useCsrf';

interface ContrastCheckerProps {
  colors: BrandThemeColorCore[];
  themeId: string;
  /** Initial foreground slug from persisted theme data */
  initialFgSlug?: string;
  /** Initial background slug from persisted theme data */
  initialBgSlug?: string;
  /** Callback when fg/bg selections change (for parent state sync) */
  onSelectionChange?: (fgSlug: string, bgSlug: string) => void;
}

/**
 * Get default foreground color slug based on role priority
 */
function getDefaultFgSlug(colors: BrandThemeColorCore[]): string {
  const primary = colors.find((c) => c.role === 'primary');
  if (primary) return primary.slug;
  return colors[0]?.slug ?? '';
}

/**
 * Get default background color slug based on role priority
 */
function getDefaultBgSlug(colors: BrandThemeColorCore[]): string {
  const secondary = colors.find((c) => c.role === 'secondary');
  if (secondary) return secondary.slug;
  // Fall back to second color if exists, otherwise first
  return colors[1]?.slug ?? colors[0]?.slug ?? '';
}

/**
 * Color swatch element for select dropdown
 */
function ColorSwatch({ hex }: { hex: string }) {
  return (
    <div
      {...devProps('ColorSwatch')}
      className="w-4 h-4 rounded-sm shrink-0 border border-border-secondary"
      style={{ backgroundColor: hex }}
    />
  );
}

/**
 * Pass/Fail badge with animation
 */
function PassFailBadge({ pass, label }: { pass: boolean; label?: string }) {
  return (
    <motion.div
      {...devProps('PassFailBadge')}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        pass
          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
          : 'bg-red-500/10 text-red-600 dark:text-red-400'
      }`}
    >
      {pass ? (
        <Check className="w-3 h-3" />
      ) : (
        <XClose className="w-3 h-3" />
      )}
      {label ?? (pass ? 'Pass' : 'Fail')}
    </motion.div>
  );
}

/**
 * WCAG compliance results table
 */
function WcagResultsTable({ result }: { result: ContrastResult }) {
  return (
    <div {...devProps('WcagResultsTable')} className="space-y-3">
      {/* Contrast Ratio - Large and prominent */}
      <div className="text-center">
        <motion.div
          key={result.ratio}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-fg-primary"
        >
          {result.ratio.toFixed(2)}:1
        </motion.div>
        <p className="text-xs text-fg-tertiary mt-1">Contrast Ratio</p>
      </div>

      {/* WCAG Results Table */}
      <div className="rounded-lg border border-border-secondary overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-tertiary">
              <th className="text-left px-3 py-2 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                Category
              </th>
              <th className="text-center px-3 py-2 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                AA
              </th>
              <th className="text-center px-3 py-2 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                AAA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-secondary">
            <tr>
              <td className="px-3 py-2 text-fg-secondary">
                Normal text
                <span className="block text-xs text-fg-quaternary">4.5:1 / 7.0:1</span>
              </td>
              <td className="px-3 py-2 text-center">
                <PassFailBadge pass={result.normalText.aa} />
              </td>
              <td className="px-3 py-2 text-center">
                <PassFailBadge pass={result.normalText.aaa} />
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-fg-secondary">
                Large text
                <span className="block text-xs text-fg-quaternary">3.0:1 / 4.5:1</span>
              </td>
              <td className="px-3 py-2 text-center">
                <PassFailBadge pass={result.largeText.aa} />
              </td>
              <td className="px-3 py-2 text-center">
                <PassFailBadge pass={result.largeText.aaa} />
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-fg-secondary">
                UI elements
                <span className="block text-xs text-fg-quaternary">3.0:1</span>
              </td>
              <td className="px-3 py-2 text-center">
                <PassFailBadge pass={result.uiElements.aa} />
              </td>
              <td className="px-3 py-2 text-center">
                <span className="text-fg-quaternary">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Fake UI preview card showing the color pairing in context
 */
function PreviewCard({ fgHex, bgHex }: { fgHex: string; bgHex: string }) {
  return (
    <div
      {...devProps('PreviewCard')}
      className="rounded-xl border border-border-secondary overflow-hidden"
      style={{ backgroundColor: bgHex }}
    >
      <div className="p-5 space-y-4">
        {/* Album art placeholder */}
        <div
          className="w-full aspect-square rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: fgHex,
            opacity: 0.1,
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: bgHex,
              border: `2px solid ${fgHex}`,
            }}
          >
            <Play
              className="w-6 h-6 ml-1"
              style={{ color: fgHex, fill: fgHex }}
            />
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-1.5" style={{ color: fgHex }}>
          <h4 className="text-lg font-semibold">Sample Heading</h4>
          <p className="text-sm opacity-80">
            This is how body text will appear with your selected color pairing.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: fgHex, color: bgHex }}
          >
            Primary Action
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: fgHex, color: fgHex }}
          >
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline info panel listing all simulation mode descriptions.
 * Rendered as a <details> element for simple, accessible expansion.
 */
function SimulationInfoPanel() {
  return (
    <details
      {...devProps('SimulationInfoPanel')}
      className="mt-2 rounded-lg border border-border-secondary bg-bg-secondary text-sm"
    >
      <summary className="px-3 py-2 cursor-pointer text-fg-secondary font-medium select-none list-none flex items-center gap-2">
        <InfoCircle className="w-3.5 h-3.5 text-fg-tertiary shrink-0" aria-hidden="true" />
        About color vision simulations
      </summary>
      <ul className="px-3 pb-3 pt-1 space-y-2.5">
        {SIMULATION_MODES.map((mode) => (
          <li key={mode} className="space-y-0.5">
            <p className="font-medium text-fg-primary">
              {getSimulationLabel(mode)}
            </p>
            <p className="text-xs text-fg-tertiary">
              {getSimulationDescription(mode)}
            </p>
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * Simulation mode dropdown with an adjacent info button.
 * Renders a native <select> to stay consistent with the accessibility approach
 * already used across smaller utility controls in this component.
 */
function SimulationModeSelector({
  value,
  onChange,
}: {
  value: SimulationMode;
  onChange: (mode: SimulationMode) => void;
}) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div {...devProps('SimulationModeSelector')} className="space-y-1">
      <div className="flex items-center gap-2">
        <label
          htmlFor="simulation-mode-select"
          className="text-xs font-medium text-fg-secondary"
        >
          Color vision simulation
        </label>
        <button
          type="button"
          onClick={() => setInfoOpen((prev) => !prev)}
          aria-expanded={infoOpen}
          aria-label="About color vision simulations"
          className="text-fg-tertiary hover:text-fg-secondary transition-colors"
        >
          <InfoCircle className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <select
        id="simulation-mode-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SimulationMode)}
        className="w-full rounded-lg border border-border-secondary bg-bg-secondary text-fg-primary text-sm px-3 py-2 outline-hidden focus:border-border-primary transition-colors cursor-pointer appearance-none"
      >
        {SIMULATION_MODES.map((mode) => (
          <option key={mode} value={mode}>
            {getSimulationLabel(mode)}
          </option>
        ))}
      </select>

      {infoOpen && <SimulationInfoPanel />}
    </div>
  );
}

/**
 * ContrastChecker
 *
 * A Figma-style accessibility checker that allows users to select foreground
 * and background colors from their brand palette and see WCAG 2.1 contrast
 * compliance results in real time.
 *
 * Includes a color vision deficiency simulation mode that updates the preview
 * card to show how the color pair would appear to people with various types
 * of color blindness. WCAG ratios always reflect true (non-simulated) colors.
 */
export function ContrastChecker({
  colors,
  themeId,
  initialFgSlug,
  initialBgSlug,
  onSelectionChange,
}: ContrastCheckerProps) {
  // Determine default slugs (computed before hooks for stable initialization)
  const hasColors = colors && colors.length > 0;
  const defaultFgSlug = hasColors
    ? (initialFgSlug ?? getDefaultFgSlug(colors))
    : '';
  const defaultBgSlug = hasColors
    ? (initialBgSlug ?? getDefaultBgSlug(colors))
    : '';

  // Local state for selected colors - always call hooks
  const [fgSlug, setFgSlug] = useState<string>(defaultFgSlug);
  const [bgSlug, setBgSlug] = useState<string>(defaultBgSlug);

  // Simulation mode state — defaults to 'none' (no transformation)
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('none');

  // Debounce timer ref for persistence
  const persistTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist selections to theme via PATCH (debounced 800ms)
  const persistSelections = useCallback(
    async (fg: string, bg: string) => {
      try {
        const response = await fetch('/api/brand-themes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
          credentials: 'include',
          body: JSON.stringify({
            id: themeId,
            contrast_fg_slug: fg,
            contrast_bg_slug: bg,
          }),
        });

        if (!response.ok) {
          console.error(
            'ContrastChecker: failed to persist fg/bg selection:',
            await response.text()
          );
        }
      } catch (error) {
        console.error('ContrastChecker: failed to persist fg/bg selection:', error);
      }
    },
    [themeId]
  );

  // Effect to persist selections with debounce
  useEffect(() => {
    // Skip persistence if no colors
    if (!hasColors) return;

    // Clear existing timer
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
    }

    // Set new debounced timer
    persistTimerRef.current = setTimeout(() => {
      persistSelections(fgSlug, bgSlug);
      onSelectionChange?.(fgSlug, bgSlug);
    }, 800);

    // Cleanup on unmount
    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
    };
  }, [fgSlug, bgSlug, persistSelections, onSelectionChange, hasColors]);

  // Handle empty colors case - render loading state after hooks
  if (!hasColors) {
    return (
      <div
        {...devProps('ContrastChecker')}
        className="animate-pulse bg-bg-tertiary rounded-xl h-40"
      />
    );
  }

  // Derive colors and contrast result (always use true colors for WCAG)
  const fgColor = colors.find((c) => c.slug === fgSlug) ?? colors[0];
  const bgColor = colors.find((c) => c.slug === bgSlug) ?? colors[0];
  const result = getWcagContrast(fgColor.hex, bgColor.hex);

  // Derive simulated hex values for the preview card only.
  // WCAG ratios always use true (non-simulated) colors.
  const previewFg =
    simulationMode === 'none' ? fgColor.hex : simulateColor(fgColor.hex, simulationMode);
  const previewBg =
    simulationMode === 'none' ? bgColor.hex : simulateColor(bgColor.hex, simulationMode);

  // Single color edge case - disable swap
  const isSingleColor = colors.length === 1;

  // Handle swap button
  const handleSwap = () => {
    setFgSlug(bgSlug);
    setBgSlug(fgSlug);
  };

  // Build select items with color swatches
  const colorItems = colors.map((c) => ({
    id: c.slug,
    label: c.name,
    icon: <ColorSwatch hex={c.hex} />,
  }));

  return (
    <div {...devProps('ContrastChecker')} className="space-y-4">
      <h4 className="text-sm font-medium text-fg-secondary">
        Contrast Checker
      </h4>

      {/* Color Selectors */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3">
        {/* Foreground selector */}
        <div className="flex-1 min-w-0">
          <Select
            label="Foreground"
            placeholder="Select color"
            selectedKey={fgSlug}
            onSelectionChange={(key) => setFgSlug(key as string)}
            items={colorItems}
            size="sm"
          >
            {(item) => (
              <Select.Item
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
              />
            )}
          </Select>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={isSingleColor}
          className="p-2.5 rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-center md:self-end md:mb-0.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Swap foreground and background colors"
        >
          <SwitchHorizontal01 className="w-4 h-4" />
        </button>

        {/* Background selector */}
        <div className="flex-1 min-w-0">
          <Select
            label="Background"
            placeholder="Select color"
            selectedKey={bgSlug}
            onSelectionChange={(key) => setBgSlug(key as string)}
            items={colorItems}
            size="sm"
          >
            {(item) => (
              <Select.Item
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
              />
            )}
          </Select>
        </div>
      </div>

      {/* Color Vision Simulation Selector */}
      <SimulationModeSelector
        value={simulationMode}
        onChange={setSimulationMode}
      />

      {/* Preview and Results - Responsive layout: stacked on mobile, side-by-side at md: */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Preview Card — uses simulated colors when a mode is active */}
        <div className="w-full md:w-1/2">
          {simulationMode !== 'none' && (
            <p className="text-xs text-fg-tertiary mb-2">
              Preview simulated as:{' '}
              <span className="font-medium text-fg-secondary">
                {getSimulationLabel(simulationMode)}
              </span>
            </p>
          )}
          <PreviewCard fgHex={previewFg} bgHex={previewBg} />
        </div>

        {/* WCAG Results — always reflects true colors */}
        <div className="w-full md:w-1/2">
          <WcagResultsTable result={result} />
        </div>
      </div>
    </div>
  );
}
