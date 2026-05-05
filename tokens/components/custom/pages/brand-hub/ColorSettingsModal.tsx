'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XClose, Plus, Trash01, Check, ChevronDown, Loading01, Copy01, Pencil01, SearchLg, AlertCircle, Palette } from '@untitledui-pro/icons/line';
// UUI fallback: Palette → SearchLg (null-mapped, consistent with T2a)
import { useBrandColors } from '@/hooks/useBrandColors';
import type { BrandColor, BrandColorGroup, BrandColorRole, BrandTextColor, BrandThemeColors, BrandThemeColorCore } from '@/lib/supabase/types';
import { ConfirmDialog } from './BrandHubSettingsModal';
import { devProps } from '@/lib/utils/dev-props';
import { getCsrfHeaders } from '@/hooks/useCsrf';

// ============================================
// HEX VALIDATION UTILITY
// ============================================

/**
 * Validates whether a string is a valid 6-digit hex color (e.g., "#FF5500").
 */
export function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// ============================================
// PROPS
// ============================================

interface ColorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Theme ID for persisting color changes to brand_themes */
  themeId?: string;
  /** Full theme colors object for spreading non-core keys during PATCH */
  themeColors?: BrandThemeColors;
  /** Callback invoked after a successful save to refresh parent data */
  onSaved?: () => void;
  /**
   * Callback invoked after a successful save with the updated core colors array.
   * Used by the parent to run the full cascade (scale + semantic regeneration)
   * and update live preview state without a full page reload.
   */
  onColorsSaved?: (updatedCore: BrandThemeColorCore[]) => void;
}

// ============================================
// SELECT DROPDOWN FOR TEXT COLOR
// ============================================

interface TextColorSelectProps {
  value: BrandTextColor;
  onChange: (value: BrandTextColor) => void;
}

function TextColorSelect({ value, onChange }: TextColorSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div {...devProps('TextColorSelect')} ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors"
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${value === 'light' ? 'bg-white border border-gray-300' : 'bg-gray-900'}`}
        />
        <span className="text-fg-primary capitalize">{value}</span>
        <ChevronDown className="w-3 h-3 text-fg-tertiary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full mt-1 left-0 z-20 py-1 min-w-[90px] rounded-lg border border-border-primary bg-bg-primary shadow-lg"
          >
            {(['light', 'dark'] as BrandTextColor[]).map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-bg-secondary transition-colors ${
                  value === option ? 'text-fg-brand-primary' : 'text-fg-primary'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${option === 'light' ? 'bg-white border border-gray-300' : 'bg-gray-900'}`}
                />
                <span className="capitalize">{option}</span>
                {value === option && <Check className="w-3 h-3 ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// COLOR GROUP SELECT
// ============================================

interface ColorGroupSelectProps {
  value: BrandColorGroup;
  onChange: (value: BrandColorGroup) => void;
  disabled?: boolean;
}

function ColorGroupSelect({ value, onChange, disabled }: ColorGroupSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const groups: { value: BrandColorGroup; label: string }[] = [
    { value: 'brand', label: 'Brand' },
    { value: 'mono-scale', label: 'Mono Scale' },
    { value: 'brand-scale', label: 'Brand Scale' },
    { value: 'custom', label: 'Custom' },
  ];

  const currentGroup = groups.find(g => g.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div {...devProps('ColorGroupSelect')} ref={dropdownRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border border-border-primary bg-bg-secondary transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bg-tertiary'
        }`}
      >
        <span className="text-fg-primary">{currentGroup?.label}</span>
        <ChevronDown className="w-3 h-3 text-fg-tertiary" />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full mt-1 left-0 z-20 py-1 min-w-[120px] rounded-lg border border-border-primary bg-bg-primary shadow-lg"
          >
            {groups.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-bg-secondary transition-colors ${
                  value === option.value ? 'text-fg-brand-primary' : 'text-fg-primary'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="w-3 h-3 ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// COLOR ROLE SELECT (Primary/Secondary/Accent/Custom)
// ============================================

/** Known built-in role values */
const BUILT_IN_ROLES: BrandColorRole[] = ['primary', 'secondary', 'accent', 'neutral'];

interface ColorRoleSelectProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

function ColorRoleSelect({ value, onChange, disabled }: ColorRoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRoleValue, setCustomRoleValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if the current value is a custom role (not a built-in)
  const isCustomRole = value !== undefined && !BUILT_IN_ROLES.includes(value as BrandColorRole);

  // Initialize custom input when the component mounts with a custom role value
  useEffect(() => {
    if (isCustomRole && value) {
      setShowCustomInput(true);
      setCustomRoleValue(value);
    }
  }, []);

  const roles: { value: string | undefined; label: string }[] = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
    { value: 'neutral', label: 'Neutral' },
    { value: undefined, label: 'None' },
    { value: '__custom__', label: 'Custom...' },
  ];

  // Display label for current value
  const getDisplayLabel = (): string => {
    if (showCustomInput || isCustomRole) {
      return customRoleValue || value || 'Custom';
    }
    const found = roles.find(r => r.value === value);
    return found ? found.label : 'None';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div {...devProps('ColorRoleSelect')} ref={dropdownRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border border-border-primary bg-bg-secondary transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bg-tertiary'
        }`}
      >
        <span className="text-fg-primary truncate max-w-[70px]">{getDisplayLabel()}</span>
        <ChevronDown className="w-3 h-3 text-fg-tertiary shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full mt-1 left-0 z-20 py-1 min-w-[120px] rounded-lg border border-border-primary bg-bg-primary shadow-lg"
          >
            {roles.map((option) => (
              <button
                key={option.value ?? 'none'}
                onClick={() => {
                  if (option.value === '__custom__') {
                    setShowCustomInput(true);
                    setCustomRoleValue('');
                    onChange(undefined);
                    setIsOpen(false);
                  } else {
                    setShowCustomInput(false);
                    setCustomRoleValue('');
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-bg-secondary transition-colors ${
                  value === option.value ? 'text-fg-brand-primary' : 'text-fg-primary'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && option.value !== '__custom__' && <Check className="w-3 h-3 ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom role name input */}
      {showCustomInput && !disabled && (
        <input
          type="text"
          value={customRoleValue}
          onChange={(e) => {
            const val = e.target.value;
            setCustomRoleValue(val);
            // When empty, treat as undefined/None
            onChange(val.trim() ? val.trim() : undefined);
          }}
          placeholder="e.g. tertiary"
          autoFocus
          className="mt-1 w-full px-2 py-1 text-xs rounded border border-border-primary bg-bg-primary text-fg-primary focus:border-border-primary focus:outline-hidden"
        />
      )}
    </div>
  );
}

// ============================================
// TABLE ROW COMPONENT
// ============================================

interface ColorRowProps {
  color: BrandColor;
  isEditing: boolean;
  editValues: EditingColor | null;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onUpdateField: <K extends keyof EditingColor>(field: K, value: EditingColor[K]) => void;
  onSave: () => void;
  onDelete: () => void;
  onCopyHex: (hex: string) => void;
  isSaving: boolean;
  /** Whether the save button should be disabled (e.g., due to role validation) */
  saveDisabled?: boolean;
  /** Whether deletion is blocked (color count at minimum) */
  canDelete?: boolean;
  /** Error message to show for deletion block */
  deleteBlockMessage?: string;
}

interface EditingColor {
  name: string;
  hexValue: string;
  cssVariableName: string;
  textColor: BrandTextColor;
  colorGroup: BrandColorGroup;
  colorRole: string | undefined;
}

function ColorRow({
  color,
  isEditing,
  editValues,
  onStartEdit,
  onCancelEdit,
  onUpdateField,
  onSave,
  onDelete,
  onCopyHex,
  isSaving,
  saveDisabled,
  canDelete = true,
  deleteBlockMessage,
}: ColorRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHoveringConfirm, setIsHoveringConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Hex validation for editing state
  const hexValid = editValues ? isValidHex(editValues.hexValue) : true;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyHex(color.hexValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDeleteAttempt = () => {
    if (!canDelete) {
      setDeleteError(deleteBlockMessage || 'A minimum of 2 colors is required.');
      setTimeout(() => setDeleteError(null), 3000);
      return;
    }
    setShowDeleteConfirm(true);
  };

  const groupLabels: Record<BrandColorGroup, string> = {
    'brand': 'Brand',
    'mono-scale': 'Mono',
    'brand-scale': 'Scale',
    'custom': 'Custom',
  };

  const roleLabels: Record<string, string> = {
    'primary': 'Primary',
    'secondary': 'Secondary',
    'accent': 'Accent',
    'neutral': 'Neutral',
  };

  return (
    <>
      {/* Subtle row divider using border-secondary */}
      <tr {...devProps('ColorRow')} className={`group border-b border-border-secondary hover:bg-bg-tertiary transition-colors ${
        isEditing ? 'bg-bg-secondary' : ''
      }`}>
        {/* Color Swatch - with proper radius when editing */}
        <td className="py-2 px-3 w-[52px]">
          {isEditing && editValues ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border-primary">
              <input
                type="color"
                value={isValidHex(editValues.hexValue) ? editValues.hexValue : '#000000'}
                onChange={(e) => onUpdateField('hexValue', e.target.value.toUpperCase())}
                className="w-10 h-10 -m-1 cursor-pointer"
              />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-lg border border-border-secondary shadow-sm"
              style={{ backgroundColor: color.hexValue }}
            />
          )}
        </td>

        {/* Name */}
        <td className="py-2 px-3">
          {isEditing && editValues ? (
            <input
              type="text"
              value={editValues.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
              className="w-full px-2 py-1 text-sm rounded border border-border-primary bg-bg-primary text-fg-primary focus:border-border-primary focus:outline-hidden"
            />
          ) : (
            <span className="text-sm font-medium text-fg-primary">
              {color.name}
            </span>
          )}
        </td>

        {/* Hex Value */}
        <td className="py-2 px-3 w-[100px]">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {isEditing && editValues ? (
                <input
                  type="text"
                  value={editValues.hexValue.toUpperCase()}
                  onChange={(e) => onUpdateField('hexValue', e.target.value)}
                  className={`w-20 px-2 py-1 text-xs font-mono rounded border bg-bg-primary text-fg-primary focus:outline-hidden ${
                    !hexValid ? 'border-red-500 focus:border-red-500' : 'border-border-primary focus:border-border-primary'
                  }`}
                />
              ) : (
                <>
                  <span className="text-xs font-mono text-fg-secondary">
                    {color.hexValue.toUpperCase()}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-bg-tertiary opacity-0 group-hover:opacity-100 transition-all"
                    title="Copy hex"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy01 className="w-3 h-3 text-fg-tertiary" />
                    )}
                  </button>
                </>
              )}
            </div>
            {isEditing && !hexValid && (
              <p className="mt-0.5 text-[10px] text-red-500">Invalid hex</p>
            )}
          </div>
        </td>

        {/* Role (for brand colors) */}
        <td className="py-2 px-3 w-[90px]">
          {isEditing && editValues ? (
            <ColorRoleSelect
              value={editValues.colorRole}
              onChange={(value) => onUpdateField('colorRole', value)}
            />
          ) : (
            color.colorRole ? (
              <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-bg-brand-solid/10 text-fg-brand-primary">
                {roleLabels[color.colorRole] || color.colorRole}
              </span>
            ) : (
              <span className="text-xs text-fg-quaternary">&mdash;</span>
            )
          )}
        </td>

        {/* CSS Variable */}
        <td className="py-2 px-3">
          {isEditing && editValues ? (
            <input
              type="text"
              value={editValues.cssVariableName}
              onChange={(e) => onUpdateField('cssVariableName', e.target.value)}
              placeholder="--color-name"
              className="w-full px-2 py-1 text-xs font-mono rounded border border-border-primary bg-bg-primary text-fg-tertiary focus:border-border-primary focus:outline-hidden"
            />
          ) : (
            <span className="text-xs font-mono text-fg-tertiary">
              {color.cssVariableName || '\u2014'}
            </span>
          )}
        </td>

        {/* Text Color */}
        <td className="py-2 px-3 w-[80px]">
          {isEditing && editValues ? (
            <TextColorSelect
              value={editValues.textColor}
              onChange={(value) => onUpdateField('textColor', value)}
            />
          ) : (
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full ${color.textColor === 'light' ? 'bg-white border border-gray-300' : 'bg-gray-900'}`}
              />
              <span className="text-xs text-fg-secondary capitalize">
                {color.textColor}
              </span>
            </div>
          )}
        </td>

        {/* Group */}
        <td className="py-2 px-3 w-[80px]">
          {isEditing && editValues ? (
            <ColorGroupSelect
              value={editValues.colorGroup}
              onChange={(value) => onUpdateField('colorGroup', value)}
            />
          ) : (
            <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-bg-tertiary text-fg-secondary">
              {groupLabels[color.colorGroup]}
            </span>
          )}
        </td>

        {/* Actions */}
        <td className="py-2 px-3 w-[70px]">
          <div className="flex items-center justify-end gap-1">
            {isEditing ? (
              <>
                {/* Save button - outline style with fill on hover (Aperol themed) */}
                <button
                  onClick={onSave}
                  disabled={isSaving || saveDisabled || !hexValid}
                  onMouseEnter={() => setIsHoveringConfirm(true)}
                  onMouseLeave={() => setIsHoveringConfirm(false)}
                  className={`p-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isHoveringConfirm
                      ? 'bg-bg-brand-solid border-bg-brand-solid text-white'
                      : 'border-fg-brand-primary text-fg-brand-primary bg-transparent'
                  }`}
                  title="Save"
                >
                  {isSaving ? (
                    <Loading01 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={onCancelEdit}
                  className="p-1.5 rounded-lg hover:bg-bg-tertiary text-fg-tertiary hover:text-fg-primary transition-colors"
                  title="Cancel"
                >
                  <XClose className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {/* Edit button */}
                <button
                  onClick={onStartEdit}
                  className="p-1.5 rounded-lg hover:bg-bg-tertiary text-fg-tertiary hover:text-fg-primary opacity-0 group-hover:opacity-100 transition-all"
                  title="Edit"
                >
                  <Pencil01 className="w-3.5 h-3.5" />
                </button>
                {/* Delete button */}
                <button
                  onClick={handleDeleteAttempt}
                  disabled={!canDelete}
                  className={`p-1.5 rounded-lg hover:bg-red-500/10 text-fg-tertiary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ${
                    !canDelete ? 'disabled:opacity-30 disabled:cursor-not-allowed group-hover:disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg-tertiary' : ''
                  }`}
                  title={!canDelete ? 'Minimum 2 colors required' : 'Delete'}
                >
                  <Trash01 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
          {/* Delete block error */}
          {deleteError && (
            <p className="mt-1 text-[10px] text-red-500 text-right">{deleteError}</p>
          )}
        </td>
      </tr>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteConfirm(false);
        }}
        title="Delete Color"
        message={`Are you sure you want to delete "${color.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}

// ============================================
// ADD NEW COLOR ROW
// ============================================

interface AddColorRowProps {
  onAdd: (color: {
    name: string;
    hexValue: string;
    cssVariableName: string;
    textColor: BrandTextColor;
    colorGroup: BrandColorGroup;
    colorRole: string | undefined;
  }) => void;
  onCancel: () => void;
  isAdding: boolean;
}

function AddColorRow({ onAdd, onCancel, isAdding }: AddColorRowProps) {
  const [isHoveringConfirm, setIsHoveringConfirm] = useState(false);

  const [values, setValues] = useState({
    name: '',
    hexValue: '#000000',
    cssVariableName: '',
    textColor: 'light' as BrandTextColor,
    colorGroup: 'brand' as BrandColorGroup,
    colorRole: 'primary' as string | undefined,
  });

  const hexValid = isValidHex(values.hexValue);

  const handleSubmit = () => {
    if (!values.name.trim() || !hexValid) return;
    onAdd(values);
  };

  return (
    <tr {...devProps('AddColorRow')} className="border-b border-border-secondary bg-bg-brand-solid/10">
      {/* Color Swatch */}
      <td className="py-2 px-3 w-[52px]">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-border-secondary">
          <input
            type="color"
            value={hexValid ? values.hexValue : '#000000'}
            onChange={(e) => setValues(v => ({ ...v, hexValue: e.target.value.toUpperCase() }))}
            className="w-10 h-10 -m-1 cursor-pointer"
          />
        </div>
      </td>

      {/* Name */}
      <td className="py-2 px-3">
        <input
          type="text"
          value={values.name}
          onChange={(e) => setValues(v => ({ ...v, name: e.target.value }))}
          placeholder="Color name"
          autoFocus
          className="w-full px-2 py-1 text-sm rounded border border-border-secondary bg-bg-primary text-fg-primary focus:border-border-primary focus:outline-hidden"
        />
      </td>

      {/* Hex Value */}
      <td className="py-2 px-3 w-[100px]">
        <div className="flex flex-col">
          <input
            type="text"
            value={values.hexValue.toUpperCase()}
            onChange={(e) => setValues(v => ({ ...v, hexValue: e.target.value }))}
            className={`w-20 px-2 py-1 text-xs font-mono rounded border bg-bg-primary text-fg-primary focus:outline-hidden ${
              !hexValid ? 'border-red-500 focus:border-red-500' : 'border-border-secondary focus:border-border-primary'
            }`}
          />
          {!hexValid && (
            <p className="mt-0.5 text-[10px] text-red-500">Invalid hex</p>
          )}
        </div>
      </td>

      {/* Role */}
      <td className="py-2 px-3 w-[90px]">
        <ColorRoleSelect
          value={values.colorRole}
          onChange={(value) => setValues(v => ({ ...v, colorRole: value }))}
        />
      </td>

      {/* CSS Variable */}
      <td className="py-2 px-3">
        <input
          type="text"
          value={values.cssVariableName}
          onChange={(e) => setValues(v => ({ ...v, cssVariableName: e.target.value }))}
          placeholder="--color-name"
          className="w-full px-2 py-1 text-xs font-mono rounded border border-border-secondary bg-bg-primary text-fg-tertiary focus:border-border-primary focus:outline-hidden"
        />
      </td>

      {/* Text Color */}
      <td className="py-2 px-3 w-[80px]">
        <TextColorSelect
          value={values.textColor}
          onChange={(value) => setValues(v => ({ ...v, textColor: value }))}
        />
      </td>

      {/* Group */}
      <td className="py-2 px-3 w-[80px]">
        <ColorGroupSelect
          value={values.colorGroup}
          onChange={(value) => setValues(v => ({ ...v, colorGroup: value }))}
        />
      </td>

      {/* Actions */}
      <td className="py-2 px-3 w-[70px]">
        <div className="flex items-center justify-end gap-1">
          {/* Save button - outline style with fill on hover */}
          <button
            onClick={handleSubmit}
            disabled={isAdding || !values.name.trim() || !hexValid}
            onMouseEnter={() => setIsHoveringConfirm(true)}
            onMouseLeave={() => setIsHoveringConfirm(false)}
            className={`p-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isHoveringConfirm
                ? 'bg-bg-brand-solid border-bg-brand-solid text-white'
                : 'border-fg-brand-primary text-fg-brand-primary bg-transparent'
            }`}
            title="Add"
          >
            {isAdding ? (
              <Loading01 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-bg-tertiary text-fg-tertiary hover:text-fg-primary transition-colors"
            title="Cancel"
          >
            <XClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ============================================
// MAIN MODAL COMPONENT
// ============================================

/**
 * ColorSettingsModal
 *
 * Full editing interface for brand colors. Supports inline editing,
 * adding new colors, role assignment (including custom roles),
 * hex validation, color count limits (2-10), and persists changes
 * to both the brand_colors table and brand_themes.colors.core.
 */
export function ColorSettingsModal({ isOpen, onClose, themeId, themeColors, onSaved, onColorsSaved }: ColorSettingsModalProps) {
  const {
    colors,
    isLoading,
    addColor,
    editColor,
    removeColor,
  } = useBrandColors();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditingColor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // ---- Role validation ----
  const hasPrimary = colors.some(c => c.colorRole === 'primary');
  const hasSecondary = colors.some(c => c.colorRole === 'secondary');
  const roleError = !hasPrimary || !hasSecondary
    ? 'Primary and Secondary roles are required.'
    : null;

  // ---- Color count limits ----
  const canAddMore = colors.length < 10;
  const canDelete = colors.length > 2;

  // ---- Sync updated colors to brand_themes via PATCH ----
  const syncToBrandTheme = useCallback(async (updatedColors: BrandColor[]) => {
    if (!themeId) {
      console.warn('ColorSettingsModal: themeId is undefined, skipping brand_themes sync.');
      return;
    }

    const core: BrandThemeColorCore[] = updatedColors
      .filter(c => c.colorGroup === 'brand')
      .map(c => ({
        name: c.name,
        slug: c.slug,
        hex: c.hexValue,
        role: c.colorRole ?? '',
      }));

    // Build the colors object, preserving existing scales and semantic tokens.
    // The parent's onColorsSaved cascade will overwrite scales + semantic with
    // freshly generated values after this PATCH resolves.
    const colorsPayload: BrandThemeColors = themeColors
      ? { ...themeColors, core }
      : { core, scales: { brand: {}, gray: {}, error: {}, warning: {}, success: {}, utility: {} }, semantic: { light: {}, dark: {} } };

    try {
      const response = await fetch('/api/brand-themes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
        credentials: 'include',
        body: JSON.stringify({ id: themeId, colors: colorsPayload }),
      });

      if (!response.ok) {
        throw new Error(`PATCH failed: ${response.status}`);
      }

      setSyncError(null);
      onSaved?.();
      // Invoke cascade callback with updated core so the parent can regenerate
      // scales and semantic tokens and re-render ColorTokensPreview immediately.
      if (core.length > 0) {
        onColorsSaved?.(core);
      }
    } catch (error) {
      console.error('Error syncing to brand_themes:', error);
      setSyncError('Failed to sync changes to theme. Please try again.');
      setTimeout(() => setSyncError(null), 5000);
    }
  }, [themeId, themeColors, onSaved, onColorsSaved]);

  const handleStartEdit = useCallback((color: BrandColor) => {
    setEditingId(color.id);
    setEditValues({
      name: color.name,
      hexValue: color.hexValue,
      cssVariableName: color.cssVariableName || '',
      textColor: color.textColor,
      colorGroup: color.colorGroup,
      colorRole: color.colorRole,
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValues(null);
  }, []);

  const handleUpdateField = useCallback(<K extends keyof EditingColor>(
    field: K,
    value: EditingColor[K]
  ) => {
    setEditValues(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingId || !editValues) return;
    if (!isValidHex(editValues.hexValue)) return;

    setIsSaving(true);
    try {
      await editColor(editingId, {
        name: editValues.name,
        hex_value: editValues.hexValue,
        css_variable_name: editValues.cssVariableName || undefined,
        text_color: editValues.textColor,
        color_group: editValues.colorGroup,
        color_role: (editValues.colorRole as BrandColorRole) || null,
      });
      setEditingId(null);
      setEditValues(null);

      // Build an updated array reflecting the edit for syncing
      const updatedColors = colors.map(c =>
        c.id === editingId
          ? {
              ...c,
              name: editValues.name,
              hexValue: editValues.hexValue,
              cssVariableName: editValues.cssVariableName,
              textColor: editValues.textColor,
              colorGroup: editValues.colorGroup,
              colorRole: editValues.colorRole as BrandColorRole | undefined,
            }
          : c
      );
      await syncToBrandTheme(updatedColors);
    } catch (error) {
      console.error('Error saving color:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editingId, editValues, editColor, colors, syncToBrandTheme]);

  const handleDelete = useCallback(async (id: string) => {
    if (!canDelete) return;
    try {
      await removeColor(id);
      // Sync after deletion: filter out the deleted color
      const updatedColors = colors.filter(c => c.id !== id);
      await syncToBrandTheme(updatedColors);
    } catch (error) {
      console.error('Error deleting color:', error);
    }
  }, [removeColor, canDelete, colors, syncToBrandTheme]);

  const handleAddColor = useCallback(async (values: {
    name: string;
    hexValue: string;
    cssVariableName: string;
    textColor: BrandTextColor;
    colorGroup: BrandColorGroup;
    colorRole: string | undefined;
  }) => {
    if (!isValidHex(values.hexValue)) return;

    setIsSaving(true);
    try {
      const newColor = await addColor({
        name: values.name,
        hex_value: values.hexValue,
        css_variable_name: values.cssVariableName || undefined,
        text_color: values.textColor,
        color_group: values.colorGroup,
        color_role: (values.colorRole as BrandColorRole) || null,
      });
      setIsAddingNew(false);

      // Sync after add
      const updatedColors = [...colors, newColor];
      await syncToBrandTheme(updatedColors);
    } catch (error) {
      console.error('Error adding color:', error);
    } finally {
      setIsSaving(false);
    }
  }, [addColor, colors, syncToBrandTheme]);

  const handleCopyHex = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex);
  }, []);

  // Sort colors by group, then sort order
  const sortedColors = [...colors].sort((a, b) => {
    const groupOrder = ['brand', 'mono-scale', 'brand-scale', 'custom'];
    const aGroup = groupOrder.indexOf(a.colorGroup);
    const bGroup = groupOrder.indexOf(b.colorGroup);
    if (aGroup !== bGroup) return aGroup - bGroup;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            {...devProps('ColorSettingsModal')}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 sm:inset-x-4 sm:top-[5%] sm:mx-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-2xl overflow-hidden z-50 bg-bg-primary border border-border-primary shadow-2xl"
          >
            {/* Header - NO ICON, just title + subtitle + actions */}
            <div className="flex items-center justify-between p-5 border-b border-border-primary">
              <div>
                <h2 className="text-lg font-display font-bold text-fg-primary">
                  Manage Colors
                </h2>
                <p className="text-sm text-fg-tertiary">
                  {colors.length} color{colors.length !== 1 ? 's' : ''} in your brand palette
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Add Color - Icon only */}
                <motion.button
                  onClick={() => setIsAddingNew(true)}
                  disabled={!canAddMore || isAddingNew}
                  className="p-2.5 rounded-xl bg-bg-secondary hover:bg-bg-brand-primary border border-border-primary hover:border-border-secondary transition-colors group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-bg-secondary disabled:hover:border-border-primary"
                  title={!canAddMore ? 'Maximum 10 colors reached' : 'Add color'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4 text-fg-tertiary group-hover:text-fg-brand-primary transition-colors" />
                </motion.button>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-2.5 sm:p-2 rounded-lg hover:bg-bg-tertiary text-fg-tertiary hover:text-fg-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Close"
                >
                  <XClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Role validation error banner */}
            {roleError && (
              <div className="px-5 py-2.5 bg-red-500/10 border-b border-red-500/20 text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {roleError}
              </div>
            )}

            {/* Sync error banner */}
            {syncError && (
              <div className="px-5 py-2.5 bg-red-500/10 border-b border-red-500/20 text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {syncError}
              </div>
            )}

            {/* Table Content */}
            <div className="overflow-auto max-h-[calc(100dvh-5rem)] sm:max-h-[calc(90vh-5rem)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 gap-3">
                  <Loading01 className="w-5 h-5 animate-spin text-fg-brand-primary" />
                  <span className="text-fg-tertiary">Loading colors...</span>
                </div>
              ) : colors.length === 0 && !isAddingNew ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
                    <Palette className="w-7 h-7 text-fg-tertiary" />
                  </div>
                  <h3 className="text-base font-medium text-fg-primary">No colors yet</h3>
                  <p className="mt-1 text-sm text-fg-tertiary max-w-xs">
                    Add your brand colors to create a cohesive design system.
                  </p>
                  <motion.button
                    onClick={() => setIsAddingNew(true)}
                    className="mt-4 p-3 rounded-xl bg-bg-secondary hover:bg-bg-brand-primary border border-border-primary hover:border-border-secondary transition-colors group"
                    title="Add first color"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5 text-fg-tertiary group-hover:text-fg-brand-primary transition-colors" />
                  </motion.button>
                </div>
              ) : (
                <table className="w-full table-fixed">
                  <thead className="sticky top-0 bg-bg-primary border-b border-border-secondary">
                    <tr>
                      <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[52px]">

                      </th>
                      <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[100px]">
                        Hex
                      </th>
                      <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[90px]">
                        Role
                      </th>
                      <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider">
                        Variable
                      </th>
                      <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[80px]">
                        Text
                      </th>
                      <th className="py-2.5 px-3 text-left text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[80px]">
                        Group
                      </th>
                      <th className="py-2.5 px-3 text-right text-[10px] font-semibold text-fg-tertiary uppercase tracking-wider w-[70px]">

                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAddingNew && (
                      <AddColorRow
                        onAdd={handleAddColor}
                        onCancel={() => setIsAddingNew(false)}
                        isAdding={isSaving}
                      />
                    )}
                    {sortedColors.map((color) => (
                      <ColorRow
                        key={color.id}
                        color={color}
                        isEditing={editingId === color.id}
                        editValues={editingId === color.id ? editValues : null}
                        onStartEdit={() => handleStartEdit(color)}
                        onCancelEdit={handleCancelEdit}
                        onUpdateField={handleUpdateField}
                        onSave={handleSaveEdit}
                        onDelete={() => handleDelete(color.id)}
                        onCopyHex={handleCopyHex}
                        isSaving={isSaving}
                        saveDisabled={!!roleError}
                        canDelete={canDelete}
                        deleteBlockMessage="A minimum of 2 colors is required."
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
