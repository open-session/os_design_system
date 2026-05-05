'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { DotsVertical, HelpCircle } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface SettingsSectionHeaderProps {
  title: string;
  description?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function SettingsSectionHeader({
  title,
  description,
  showMenu = false,
  onMenuClick,
}: SettingsSectionHeaderProps) {
  return (
    <div {...devProps('SettingsSectionHeader')} className="flex items-start justify-between gap-4 pb-5 border-b border-border-secondary">
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-fg-primary">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-fg-tertiary truncate">
            {description}
          </p>
        )}
      </div>
      {showMenu && (
        <button
          onClick={onMenuClick}
          className="
            p-1.5 -m-1.5
            text-fg-quaternary hover:text-fg-tertiary
            transition-colors
          "
          aria-label="More options"
        >
          <DotsVertical className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

interface SettingsFieldProps {
  label: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function SettingsField({
  label,
  description,
  tooltip,
  required = false,
  children,
  className = '',
}: SettingsFieldProps) {
  return (
    <div {...devProps('SettingsField')} className={`
      flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8
      py-5 border-b border-border-secondary
      ${className}
    `}>
      {/* Label column */}
      <div className="flex-shrink-0 lg:w-[280px] lg:max-w-[280px]">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-fg-secondary">
            {label}
          </span>
          {required && (
            <span className="text-fg-brand-primary">*</span>
          )}
          {tooltip && (
            <div className="relative group">
              <button
                type="button"
                className="p-0.5 text-fg-quaternary hover:text-fg-tertiary transition-colors"
                aria-label={tooltip}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {/* Tooltip */}
              <div className="
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                px-3 py-2
                bg-bg-primary-solid dark:bg-bg-secondary
                text-xs font-semibold text-white dark:text-fg-primary
                rounded-lg
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-150
                whitespace-nowrap
                z-50
                shadow-lg
              ">
                {tooltip}
                {/* Arrow */}
                <div className="
                  absolute top-full left-1/2 -translate-x-1/2
                  border-4 border-transparent border-t-bg-primary-solid dark:border-t-bg-secondary
                " />
              </div>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-fg-tertiary">
            {description}
          </p>
        )}
      </div>

      {/* Input column */}
      <div className="flex-1 min-w-0 lg:max-w-[512px]">
        {children}
      </div>
    </div>
  );
}

interface SettingsSectionFooterProps {
  onCancel?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isDisabled?: boolean;
  cancelLabel?: string;
  saveLabel?: string;
  savingLabel?: string;
}

export function SettingsSectionFooter({
  onCancel,
  onSave,
  isSaving = false,
  isDisabled = false,
  cancelLabel,
  saveLabel,
  savingLabel,
}: SettingsSectionFooterProps) {
  const t = useTranslations('common');
  
  const cancel = cancelLabel ?? t('cancel');
  const save = saveLabel ?? t('save');
  const saving = savingLabel ?? t('loading');

  return (
    <div {...devProps('SettingsSectionFooter')} className="flex items-center justify-end gap-3 pt-5 border-t border-border-secondary">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="
          px-4 py-2
          bg-transparent
          border border-border-secondary
          rounded-lg
          text-sm font-medium text-fg-tertiary
          hover:text-fg-secondary
          hover:border-border-primary
          hover:bg-bg-secondary-alt
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-150
        "
      >
        {cancel}
      </button>
      <button
        type="submit"
        onClick={onSave}
        disabled={isDisabled || isSaving}
        className="
          px-4 py-2
          bg-bg-brand-primary
          border border-border-brand
          rounded-lg
          text-sm font-medium text-fg-brand-primary
          hover:bg-bg-brand-primary-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-150
        "
      >
        {isSaving ? saving : save}
      </button>
    </div>
  );
}

interface SettingsDividerProps {
  className?: string;
}

export function SettingsDivider({ className = '' }: SettingsDividerProps) {
  return (
    <div {...devProps('SettingsDivider')} className={`h-px bg-border-secondary ${className}`} />
  );
}
