'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Type01 } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { Select } from '@/components/base/base/select/select';
import type { SelectItemType } from '@/components/base/base/select/select';
import { Badge } from '@/components/base/base/badges/badges';
import { Input } from '@/components/base/base/input/input';
import { Table, TableCard } from '@/components/base/application/table/table';
import type {
  BrandFont,
  BrandFontMetadata,
  BrandThemeTypographyHierarchyItem,
} from '@/lib/supabase/types';
import type { TypographyRoleKey, TypographyRoleMapping } from '@/hooks/useBrandThemes';
import { TYPOGRAPHY_ROLE_KEYS } from '@/hooks/useBrandThemes';

// ---------------------------------------------------------------------------
// Role definitions
// ---------------------------------------------------------------------------

interface RoleDefinition {
  key: TypographyRoleKey;
  label: string;
  description: string;
  defaultSize: string;
  defaultLineHeight: number;
}

const ROLES: readonly RoleDefinition[] = [
  { key: 'presentation', label: 'Presentation', description: 'Slide titles, hero text', defaultSize: '48px', defaultLineHeight: 1.2 },
  { key: 'display', label: 'Display / Headings', description: 'H1-H3', defaultSize: '32px', defaultLineHeight: 1.25 },
  { key: 'subheading', label: 'Subheadings', description: 'H4-H6', defaultSize: '20px', defaultLineHeight: 1.4 },
  { key: 'body', label: 'Body', description: 'Paragraphs, UI text', defaultSize: '16px', defaultLineHeight: 1.5 },
  { key: 'caption', label: 'Button / Caption', description: 'Buttons, labels, captions', defaultSize: '14px', defaultLineHeight: 1.4 },
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TypographyMasterTableProps {
  /** All uploaded brand fonts */
  fonts: BrandFont[];
  /** Font families grouped by family name */
  fontFamilies: Map<string, BrandFont[]>;
  /** Current role hierarchy from brand_themes.typography.hierarchy */
  roleHierarchy: TypographyRoleMapping;
  /** Callback to persist updated hierarchy entries */
  onUpdate: (hierarchyUpdates: Record<string, BrandThemeTypographyHierarchyItem>) => Promise<void>;
  /** Loading state from the parent hook */
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract unique numeric weights from a list of fonts for a given family */
function getWeightsForFamily(
  fontFamilies: Map<string, BrandFont[]>,
  familyName: string
): number[] {
  const fonts = fontFamilies.get(familyName) ?? [];
  const weights = new Set<number>();
  for (const font of fonts) {
    const meta = font.metadata as BrandFontMetadata;
    const w = meta.fontWeight ? Number(meta.fontWeight) : 400;
    weights.add(w);
  }
  return Array.from(weights).sort((a, b) => a - b);
}

/** Human-readable weight name */
function weightLabel(weight: number): string {
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
  return names[weight] ?? `Weight ${weight}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * TypographyMasterTable
 *
 * Renders a fixed 5-row table mapping typographic roles (Presentation,
 * Display, Subheading, Body, Caption) to uploaded font families and weights.
 * Changes are persisted to `brand_themes.typography.hierarchy` via `onUpdate`.
 */
export function TypographyMasterTable({
  fonts,
  fontFamilies,
  roleHierarchy,
  onUpdate,
  isLoading = false,
}: TypographyMasterTableProps) {
  // ------ Local editable state for the 5 roles ------
  const [localRoles, setLocalRoles] = useState<
    Record<TypographyRoleKey, { fontFamily: string; fontWeight: number; fontSize: string; lineHeight: number }>
  >(() => buildLocalState(roleHierarchy));

  // Sync from parent when roleHierarchy changes (e.g. after refresh)
  useEffect(() => {
    setLocalRoles(buildLocalState(roleHierarchy));
  }, [roleHierarchy]);

  // Derive family names for the Select dropdown
  const familyItems: SelectItemType[] = useMemo(() => {
    const keys = Array.from(fontFamilies.keys());
    return keys.map((name) => ({ id: name, label: name }));
  }, [fontFamilies]);

  // ------ Debounced persist ------
  // Accumulates all pending changes across roles and flushes once after 400ms.
  // This prevents data loss when rapidly editing multiple roles.
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdatesRef = useRef<Record<string, BrandThemeTypographyHierarchyItem>>({});

  const schedulePersist = useCallback(
    (updates: Record<string, BrandThemeTypographyHierarchyItem>) => {
      // Merge new updates into accumulated pending changes
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };

      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
      persistTimerRef.current = setTimeout(() => {
        const batch = pendingUpdatesRef.current;
        pendingUpdatesRef.current = {};
        onUpdate(batch).catch(console.error);
      }, 400);
    },
    [onUpdate]
  );

  // Flush pending updates and clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        // Flush any accumulated but unpersisted updates
        const batch = pendingUpdatesRef.current;
        if (Object.keys(batch).length > 0) {
          pendingUpdatesRef.current = {};
          onUpdate(batch).catch(console.error);
        }
      }
    };
  }, [onUpdate]);

  // ------ Handlers ------

  const handleFamilyChange = useCallback(
    (roleKey: TypographyRoleKey, familyName: string) => {
      const weights = getWeightsForFamily(fontFamilies, familyName);
      const firstWeight = weights[0] ?? 400;
      const roleDef = ROLES.find((r) => r.key === roleKey)!;

      const updated = {
        ...localRoles,
        [roleKey]: {
          ...localRoles[roleKey],
          fontFamily: familyName,
          fontWeight: firstWeight,
          fontSize: localRoles[roleKey].fontSize || roleDef.defaultSize,
          lineHeight: localRoles[roleKey].lineHeight || roleDef.defaultLineHeight,
        },
      };
      setLocalRoles(updated);

      // Debounced persist
      const entry: BrandThemeTypographyHierarchyItem = {
        fontFamily: familyName,
        fontWeight: firstWeight,
        fontSize: updated[roleKey].fontSize,
        lineHeight: updated[roleKey].lineHeight,
      };
      schedulePersist({ [roleKey]: entry });
    },
    [fontFamilies, localRoles, schedulePersist]
  );

  const handleWeightChange = useCallback(
    (roleKey: TypographyRoleKey, weight: number) => {
      const updated = {
        ...localRoles,
        [roleKey]: { ...localRoles[roleKey], fontWeight: weight },
      };
      setLocalRoles(updated);

      const entry: BrandThemeTypographyHierarchyItem = {
        fontFamily: updated[roleKey].fontFamily,
        fontWeight: weight,
        fontSize: updated[roleKey].fontSize,
        lineHeight: updated[roleKey].lineHeight,
      };
      schedulePersist({ [roleKey]: entry });
    },
    [localRoles, schedulePersist]
  );

  const handleSizeChange = useCallback(
    (roleKey: TypographyRoleKey, fontSize: string) => {
      const updated = {
        ...localRoles,
        [roleKey]: { ...localRoles[roleKey], fontSize },
      };
      setLocalRoles(updated);

      const entry: BrandThemeTypographyHierarchyItem = {
        fontFamily: updated[roleKey].fontFamily,
        fontWeight: updated[roleKey].fontWeight,
        fontSize,
        lineHeight: updated[roleKey].lineHeight,
      };
      schedulePersist({ [roleKey]: entry });
    },
    [localRoles, schedulePersist]
  );

  // ------ Empty state ------

  if (fonts.length === 0) {
    return (
      <div
        {...devProps('TypographyMasterTable')}
        className="rounded-xl border border-border-secondary bg-bg-secondary p-8 text-center"
      >
        <Type01 className="mx-auto mb-3 h-8 w-8 text-fg-quaternary" />
        <p className="text-sm text-fg-quaternary">
          Upload fonts in the table above to assign them to roles.
        </p>
      </div>
    );
  }

  // ------ Render ------

  return (
    <div {...devProps('TypographyMasterTable')}>
      <TableCard.Root size="sm">
        <TableCard.Header
          title="Font Role Mapping"
          badge={<Badge color="gray" size="sm">{TYPOGRAPHY_ROLE_KEYS.length} roles</Badge>}
          description="Assign uploaded fonts to typographic roles used across your brand."
        />

        <Table aria-label="Typography role mapping" selectionMode="none">
          <Table.Header>
            <Table.Head id="role" label="Role" />
            <Table.Head id="preview" label="Preview" />
            <Table.Head id="family" label="Family" />
            <Table.Head id="weight" label="Weight" />
            <Table.Head id="size" label="Size" />
          </Table.Header>

          <Table.Body items={ROLES.map((r) => ({ id: r.key, ...r }))}>
            {(role) => {
              const state = localRoles[role.key];
              const hasAssignment = !!state.fontFamily;
              const weights = hasAssignment
                ? getWeightsForFamily(fontFamilies, state.fontFamily)
                : [];
              const weightItems: SelectItemType[] = weights.map((w) => ({
                id: String(w),
                label: weightLabel(w),
                supportingText: String(w),
              }));

              // Check if assigned family still exists in uploaded fonts
              const familyExists = fontFamilies.has(state.fontFamily);
              const familyDropdownItems: SelectItemType[] = hasAssignment && !familyExists
                ? [
                    { id: state.fontFamily, label: `${state.fontFamily} (removed)`, isDisabled: true },
                    ...familyItems,
                  ]
                : familyItems;

              return (
                <Table.Row key={role.key} id={role.key}>
                  {/* Role column */}
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <Badge color="gray" size="sm">
                        {role.label}
                      </Badge>
                      <span className="text-xs text-fg-tertiary">{role.description}</span>
                    </div>
                  </Table.Cell>

                  {/* Preview column */}
                  <Table.Cell>
                    <span
                      className={hasAssignment && familyExists ? 'text-fg-primary' : 'text-fg-quaternary'}
                      style={
                        hasAssignment && familyExists
                          ? {
                              fontFamily: state.fontFamily,
                              fontWeight: state.fontWeight,
                              fontSize: '16px',
                            }
                          : undefined
                      }
                    >
                      Aa Bb 123
                    </span>
                  </Table.Cell>

                  {/* Family column */}
                  <Table.Cell>
                    <Select
                      aria-label={`Font family for ${role.label}`}
                      placeholder="Select family"
                      size="sm"
                      items={familyDropdownItems}
                      selectedKey={hasAssignment ? state.fontFamily : null}
                      onSelectionChange={(key) => {
                        if (key !== null) {
                          handleFamilyChange(role.key, String(key));
                        }
                      }}
                    >
                      {(item: SelectItemType) => (
                        <Select.Item
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          isDisabled={item.isDisabled}
                        />
                      )}
                    </Select>
                  </Table.Cell>

                  {/* Weight column */}
                  <Table.Cell>
                    <Select
                      aria-label={`Font weight for ${role.label}`}
                      placeholder="Weight"
                      size="sm"
                      items={weightItems}
                      selectedKey={hasAssignment ? String(state.fontWeight) : null}
                      isDisabled={!hasAssignment}
                      onSelectionChange={(key) => {
                        if (key !== null) {
                          handleWeightChange(role.key, Number(key));
                        }
                      }}
                    >
                      {(item: SelectItemType) => (
                        <Select.Item
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          supportingText={item.supportingText}
                        />
                      )}
                    </Select>
                  </Table.Cell>

                  {/* Size column */}
                  <Table.Cell>
                    <Input
                      aria-label={`Font size for ${role.label}`}
                      placeholder={role.defaultSize}
                      value={state.fontSize}
                      onChange={(v) => handleSizeChange(role.key, v)}
                      size="sm"
                      className="w-20"
                    />
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>
      </TableCard.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildLocalState(
  hierarchy: TypographyRoleMapping
): Record<TypographyRoleKey, { fontFamily: string; fontWeight: number; fontSize: string; lineHeight: number }> {
  const state = {} as Record<
    TypographyRoleKey,
    { fontFamily: string; fontWeight: number; fontSize: string; lineHeight: number }
  >;
  for (const role of ROLES) {
    const existing = hierarchy[role.key];
    state[role.key] = {
      fontFamily: existing?.fontFamily ?? '',
      fontWeight: existing?.fontWeight ?? 400,
      fontSize: existing?.fontSize ?? role.defaultSize,
      lineHeight: existing?.lineHeight ?? role.defaultLineHeight,
    };
  }
  return state;
}
