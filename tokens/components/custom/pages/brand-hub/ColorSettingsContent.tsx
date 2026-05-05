'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Trash01, Check, XClose, Pencil01, ChevronDown } from '@untitledui-pro/icons/line';
import { useBrandColors } from '@/hooks/useBrandColors';
import type { BrandColor, BrandColorRole } from '@/lib/supabase/types';
import { ConfirmDialog } from './BrandHubSettingsModal';
import { Badge } from '@/components/base/base/badges/badges';
import { Button } from '@/components/base/base/buttons/button';
import { Table, TableCard } from '@/components/base/application/table/table';
import { Select } from '@/components/base/base/select/select';
import type { SelectItemType } from '@/components/base/base/select/select';
import { Input } from '@/components/base/base/input/input';
import { devProps } from '@/lib/utils/dev-props';
import { BrandScaleGenerator } from '@/components/custom/pages/brand-hub/BrandScaleGenerator';
import type { BrandScaleResult } from '@/lib/color-scale';

// ============================================
// HEX VALIDATION UTILITY
// ============================================

/**
 * Validates whether a string is a valid 6-digit hex color (e.g., "#FF5500").
 */
function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// ============================================
// CONTRAST RATIO UTILITIES
// ============================================

/**
 * Computes relative luminance of a hex color per WCAG 2.0.
 */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Computes WCAG contrast ratio between a hex color and a background.
 */
function contrastRatio(hex: string, background: '#ffffff' | '#000000'): number {
  const L1 = relativeLuminance(hex);
  const L2 = background === '#ffffff' ? 1 : 0;
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ============================================
// ROLE HELPERS
// ============================================

const ROLE_OPTIONS: { value: BrandColorRole; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'tertiary', label: 'Tertiary' },
];

const ROLE_SELECT_ITEMS: SelectItemType[] = [
  { id: '', label: 'No role' },
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'tertiary', label: 'Tertiary' },
];

const roleBadgeColor: Record<string, 'brand' | 'gray' | 'slate'> = {
  primary: 'brand',
  secondary: 'gray',
  tertiary: 'slate',
};

function getRoleBadgeColor(role: string | undefined): 'brand' | 'gray' | 'slate' {
  if (!role) return 'gray';
  return roleBadgeColor[role] ?? 'gray';
}

function getRoleLabel(role: string | undefined): string {
  if (!role) return 'None';
  const opt = ROLE_OPTIONS.find((o) => o.value === role);
  return opt?.label ?? role;
}

// ============================================
// EDIT ROW STATE
// ============================================

interface EditState {
  name: string;
  hex: string;
  role: BrandColorRole | '';
}

// ============================================
// ADD ROW STATE
// ============================================

interface AddState {
  name: string;
  hex: string;
  role: BrandColorRole | '';
}

const INITIAL_ADD_STATE: AddState = {
  name: '',
  hex: '#',
  role: '',
};

// ============================================
// CONTRAST BADGE
// ============================================

function ContrastIndicator({ hex }: { hex: string }) {
  if (!isValidHex(hex)) {
    return <span {...devProps('ContrastIndicator')} className="text-xs text-fg-quaternary">--</span>;
  }

  const whiteRatio = contrastRatio(hex, '#ffffff');
  const blackRatio = contrastRatio(hex, '#000000');

  const whitePass = whiteRatio >= 4.5;
  const blackPass = blackRatio >= 4.5;

  return (
    <div {...devProps('ContrastIndicator')} className="flex flex-col gap-0.5">
      <span className={`text-xs font-mono ${whitePass ? 'text-fg-success-primary' : 'text-fg-error-primary'}`}>
        W {whiteRatio.toFixed(1)}:1 {whitePass ? '\u2713' : '\u2717'}
      </span>
      <span className={`text-xs font-mono ${blackPass ? 'text-fg-success-primary' : 'text-fg-error-primary'}`}>
        B {blackRatio.toFixed(1)}:1 {blackPass ? '\u2713' : '\u2717'}
      </span>
    </div>
  );
}

// ============================================
// COLOR SWATCH
// ============================================

function ColorSwatch({ hex, size = 20 }: { hex: string; size?: number }) {
  const validColor = isValidHex(hex) ? hex : '#cccccc';
  return (
    <div
      {...devProps('ColorSwatch')}
      className="rounded-full border border-border-secondary flex-shrink-0"
      style={{
        backgroundColor: validColor,
        width: size,
        height: size,
      }}
    />
  );
}

// ============================================
// ROW ITEM TYPE (for Table.Body items)
// ============================================

interface ColorRowItem {
  id: string;
  type: 'skeleton' | 'empty' | 'color' | 'add';
  color?: BrandColor;
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Inline color settings content for managing brand colors.
 * Renders a table with swatch, name, hex, role, contrast, and actions columns.
 * Supports row-level editing, adding new colors, and max-5 constraint.
 */
export function ColorSettingsContent() {
  const {
    brandColors,
    brandScaleColors,
    isLoading,
    addColor,
    editColor,
    removeColor,
    saveColorScale,
  } = useBrandColors();

  // Row editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ name: '', hex: '', role: '' });

  // Add row state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addState, setAddState] = useState<AddState>(INITIAL_ADD_STATE);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'default';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'default',
    onConfirm: () => {},
  });

  // Brand Scale expansion state
  const [scaleExpanded, setScaleExpanded] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // ---- Edit Handlers ----

  const startEditing = useCallback((color: BrandColor) => {
    setEditingId(color.id);
    setEditState({
      name: color.name,
      hex: color.hexValue,
      role: color.colorRole ?? '',
    });
    setIsAddingNew(false);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditState({ name: '', hex: '', role: '' });
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    if (!editState.name.trim() || !isValidHex(editState.hex)) return;

    setIsSaving(true);
    try {
      await editColor(editingId, {
        name: editState.name.trim(),
        hex_value: editState.hex,
        color_role: editState.role || null,
      });
      cancelEditing();
    } catch (err) {
      console.error('Failed to save color:', err);
    } finally {
      setIsSaving(false);
    }
  }, [editingId, editState, editColor, cancelEditing]);

  // ---- Add Handlers ----

  const startAdding = useCallback(() => {
    setIsAddingNew(true);
    setAddState(INITIAL_ADD_STATE);
    setEditingId(null);
  }, []);

  const cancelAdding = useCallback(() => {
    setIsAddingNew(false);
    setAddState(INITIAL_ADD_STATE);
  }, []);

  const saveAdd = useCallback(async () => {
    if (!addState.name.trim() || !isValidHex(addState.hex)) return;

    setIsSaving(true);
    try {
      await addColor({
        name: addState.name.trim(),
        hex_value: addState.hex,
        color_group: 'brand',
        color_role: addState.role || null,
      });
      cancelAdding();
    } catch (err) {
      console.error('Failed to add color:', err);
    } finally {
      setIsSaving(false);
    }
  }, [addState, addColor, cancelAdding]);

  // ---- Delete Handlers ----

  const handleRemove = useCallback((color: BrandColor) => {
    // Check if this is the only primary or secondary
    const role = color.colorRole;
    if (role === 'primary' || role === 'secondary') {
      const sameRoleColors = brandColors.filter((c) => c.colorRole === role);
      if (sameRoleColors.length <= 1) {
        setConfirmDialog({
          isOpen: true,
          title: `Remove ${getRoleLabel(role)} Color`,
          message: `This is your only ${getRoleLabel(role).toLowerCase()} brand color. Removing it means you will have no ${getRoleLabel(role).toLowerCase()} color assigned. Are you sure?`,
          variant: 'danger',
          onConfirm: () => {
            void (async () => {
              try {
                await removeColor(color.id);
              } catch (err) {
                console.error('Failed to remove color:', err);
              } finally {
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
              }
            })();
          },
        });
        return;
      }
    }

    // Standard removal confirmation
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Color',
      message: `Are you sure you want to remove "${color.name}"? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: () => {
        void (async () => {
          try {
            await removeColor(color.id);
          } catch (err) {
            console.error('Failed to remove color:', err);
          } finally {
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          }
        })();
      },
    });
  }, [brandColors, removeColor]);

  // ---- Validation helpers ----

  const canSaveEdit = editState.name.trim() !== '' && isValidHex(editState.hex);
  const canSaveAdd = addState.name.trim() !== '' && isValidHex(addState.hex);

  // ---- Build table items ----

  const tableItems: ColorRowItem[] = [];

  if (isLoading && brandColors.length === 0) {
    tableItems.push(
      { id: 'skeleton-1', type: 'skeleton' },
      { id: 'skeleton-2', type: 'skeleton' },
      { id: 'skeleton-3', type: 'skeleton' },
    );
  } else if (!isLoading && brandColors.length === 0 && !isAddingNew) {
    tableItems.push({ id: 'empty', type: 'empty' });
  } else {
    for (const color of brandColors) {
      tableItems.push({ id: color.id, type: 'color', color });
    }
  }

  if (isAddingNew) {
    tableItems.push({ id: 'add-row', type: 'add' });
  }

  // ---- Render ----

  return (
    <div {...devProps('ColorSettingsContent')}>
      <TableCard.Root size="sm">
        <TableCard.Header
          title="Brand Colors"
          badge={
            <Badge color="gray" size="sm">
              {brandColors.length} color{brandColors.length !== 1 ? 's' : ''}
            </Badge>
          }
          contentTrailing={
            <Button
              {...devProps('AddColorButton')}
              color="secondary"
              size="sm"
              iconLeading={Plus}
              isDisabled={isAddingNew}
              onClick={startAdding}
            >
              Add
            </Button>
          }
        />

        {/* Table */}
        <Table aria-label="Brand colors" selectionMode="none" className="table-fixed">
          <Table.Header>
            <Table.Head id="swatch" className="w-12 px-4 py-2" />
            <Table.Head id="name" label="Name" className="min-w-[120px] px-4 py-2" />
            <Table.Head id="hex" label="Hex" className="w-36 px-4 py-2" />
            <Table.Head id="role" label="Brand" className="w-32 px-4 py-2" />
            <Table.Head id="contrast" label="Contrast" className="w-28 px-4 py-2 hidden sm:table-cell" />
            <Table.Head id="actions" label="Actions" className="w-20 px-4 py-2 text-right" />
          </Table.Header>

          <Table.Body items={tableItems}>
            {(item) => {
              // ---- Skeleton rows ----
              if (item.type === 'skeleton') {
                return (
                  <Table.Row key={item.id} id={item.id} className="border-b border-border-secondary">
                    <Table.Cell className="px-4 py-3">
                      <div className="w-5 h-5 rounded-full bg-bg-tertiary animate-pulse" />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="h-4 w-24 rounded bg-bg-tertiary animate-pulse" />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="h-4 w-16 rounded bg-bg-tertiary animate-pulse" />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="h-5 w-16 rounded-full bg-bg-tertiary animate-pulse" />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 hidden sm:table-cell">
                      <div className="h-4 w-14 rounded bg-bg-tertiary animate-pulse" />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3" />
                  </Table.Row>
                );
              }

              // ---- Empty state ----
              if (item.type === 'empty') {
                return (
                  <Table.Row key={item.id} id={item.id}>
                    <Table.Cell className="px-4 py-8 text-center" colSpan={6}>
                      <p className="text-sm text-fg-tertiary">
                        No brand colors yet. Click + to add your first brand color.
                      </p>
                    </Table.Cell>
                    <Table.Cell className="hidden" />
                    <Table.Cell className="hidden" />
                    <Table.Cell className="hidden" />
                    <Table.Cell className="hidden" />
                    <Table.Cell className="hidden" />
                  </Table.Row>
                );
              }

              // ---- Add row ----
              if (item.type === 'add') {
                return (
                  <Table.Row key={item.id} id={item.id} className="border-b border-border-secondary bg-bg-secondary">
                    <Table.Cell className="px-4 py-3">
                      <ColorSwatch hex={addState.hex} />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <Input
                        {...devProps('AddNameInput')}
                        aria-label="Color name"
                        value={addState.name}
                        onChange={(v) =>
                          setAddState((s) => ({ ...s, name: v }))
                        }
                        placeholder="Color name"
                        size="sm"
                        autoFocus
                      />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div {...devProps('AddHexInput')} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isValidHex(addState.hex) ? addState.hex : '#cccccc'}
                          onChange={(e) =>
                            setAddState((s) => ({ ...s, hex: e.target.value }))
                          }
                          className="w-7 h-7 rounded border border-border-primary cursor-pointer p-0 bg-transparent"
                        />
                        <Input
                          aria-label="Hex color"
                          value={addState.hex}
                          onChange={(v) => {
                            let val = v;
                            if (!val.startsWith('#')) val = '#' + val;
                            setAddState((s) => ({ ...s, hex: val }));
                          }}
                          placeholder="#000000"
                          maxLength={7}
                          size="sm"
                          className="w-20 font-mono"
                          isInvalid={addState.hex !== '#' && !isValidHex(addState.hex)}
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <Select
                        {...devProps('AddRoleSelect')}
                        aria-label="Color role"
                        placeholder="No role"
                        size="sm"
                        items={ROLE_SELECT_ITEMS}
                        selectedKey={addState.role}
                        onSelectionChange={(key) =>
                          setAddState((s) => ({
                            ...s,
                            role: (key ?? '') as BrandColorRole | '',
                          }))
                        }
                      >
                        {(item: SelectItemType) => (
                          <Select.Item key={item.id} id={item.id} label={item.label} />
                        )}
                      </Select>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 hidden sm:table-cell">
                      <ContrastIndicator hex={addState.hex} />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          {...devProps('SaveAddButton')}
                          color="secondary"
                          size="sm"
                          iconLeading={Check}
                          onClick={saveAdd}
                          isDisabled={!canSaveAdd || isSaving}
                          title="Add color"
                        />
                        <Button
                          {...devProps('CancelAddButton')}
                          color="tertiary"
                          size="sm"
                          iconLeading={XClose}
                          onClick={cancelAdding}
                          title="Cancel"
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              }

              // ---- Color rows ----
              const color = item.color!;
              const isEditing = editingId === color.id;

              if (isEditing) {
                return (
                  <Table.Row key={color.id} id={color.id} className="border-b border-border-secondary hover:bg-bg-secondary transition-colors">
                    <Table.Cell className="px-4 py-3">
                      <ColorSwatch hex={editState.hex} />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <Input
                        {...devProps('EditNameInput')}
                        aria-label="Color name"
                        value={editState.name}
                        onChange={(v) =>
                          setEditState((s) => ({ ...s, name: v }))
                        }
                        placeholder="Color name"
                        size="sm"
                      />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div {...devProps('EditHexInput')} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isValidHex(editState.hex) ? editState.hex : '#cccccc'}
                          onChange={(e) =>
                            setEditState((s) => ({ ...s, hex: e.target.value }))
                          }
                          className="w-7 h-7 rounded border border-border-primary cursor-pointer p-0 bg-transparent"
                        />
                        <Input
                          aria-label="Hex color"
                          value={editState.hex}
                          onChange={(v) => {
                            let val = v;
                            if (!val.startsWith('#')) val = '#' + val;
                            setEditState((s) => ({ ...s, hex: val }));
                          }}
                          placeholder="#000000"
                          maxLength={7}
                          size="sm"
                          className="w-20 font-mono"
                          isInvalid={!isValidHex(editState.hex)}
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <Select
                        {...devProps('EditRoleSelect')}
                        aria-label="Color role"
                        placeholder="No role"
                        size="sm"
                        items={ROLE_SELECT_ITEMS}
                        selectedKey={editState.role}
                        onSelectionChange={(key) =>
                          setEditState((s) => ({
                            ...s,
                            role: (key ?? '') as BrandColorRole | '',
                          }))
                        }
                      >
                        {(item: SelectItemType) => (
                          <Select.Item key={item.id} id={item.id} label={item.label} />
                        )}
                      </Select>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 hidden sm:table-cell">
                      <ContrastIndicator hex={editState.hex} />
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          {...devProps('SaveEditButton')}
                          color="secondary"
                          size="sm"
                          iconLeading={Check}
                          onClick={saveEdit}
                          isDisabled={!canSaveEdit || isSaving}
                          title="Save"
                        />
                        <Button
                          {...devProps('CancelEditButton')}
                          color="tertiary"
                          size="sm"
                          iconLeading={XClose}
                          onClick={cancelEditing}
                          title="Cancel"
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              }

              // ---- Display Mode ----
              return (
                <Table.Row key={color.id} id={color.id} className="border-b border-border-secondary hover:bg-bg-secondary transition-colors">
                  <Table.Cell className="px-4 py-3">
                    <ColorSwatch hex={color.hexValue} />
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3">
                    <span className="text-sm font-medium text-fg-primary truncate block">
                      {color.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ColorSwatch hex={color.hexValue} size={14} />
                      <span className="text-sm font-mono text-fg-secondary">
                        {color.hexValue}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3">
                    {color.colorRole ? (
                      <Badge color={getRoleBadgeColor(color.colorRole)} size="sm">
                        {getRoleLabel(color.colorRole)}
                      </Badge>
                    ) : (
                      <span className="text-xs text-fg-quaternary">--</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3 hidden sm:table-cell">
                    <ContrastIndicator hex={color.hexValue} />
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        {...devProps('EditRowButton')}
                        color="tertiary"
                        size="sm"
                        iconLeading={Pencil01}
                        onClick={() => startEditing(color)}
                        title="Edit"
                      />
                      <Button
                        {...devProps('DeleteRowButton')}
                        color="tertiary-destructive"
                        size="sm"
                        iconLeading={Trash01}
                        onClick={() => handleRemove(color)}
                        title="Remove"
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>

          {/* Brand Scale parent-child row — algorithm wired in task 3a */}
          <tfoot {...devProps('BrandScaleSection')}>
            <tr className="border-t border-border-secondary bg-bg-secondary">
              <td className="px-4 py-3" colSpan={6}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setScaleExpanded(prev => !prev)}
                    className="flex items-center gap-2 text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors"
                    aria-expanded={scaleExpanded}
                    aria-label="Toggle Brand Scale"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${scaleExpanded ? '' : '-rotate-90'}`} />
                    Brand Scale
                  </button>
                  {brandScaleColors.length > 0 && (
                    <span className="text-xs text-fg-tertiary">{brandScaleColors.length} shades</span>
                  )}
                </div>
              </td>
            </tr>
            {scaleExpanded && (
              <tr className="border-b border-border-secondary">
                <td className="px-4 py-4" colSpan={6}>
                  <BrandScaleGenerator
                    brandColors={brandColors}
                    hasExistingScale={brandScaleColors.length > 0}
                    onSave={async (shades: BrandScaleResult) => {
                      await saveColorScale(shades);
                    }}
                  />
                </td>
              </tr>
            )}
          </tfoot>
        </Table>
      </TableCard.Root>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmLabel="Remove"
        cancelLabel="Cancel"
      />
    </div>
  );
}
