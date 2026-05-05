'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  SettingsSectionHeader,
  SettingsField,
  SettingsSectionFooter,
} from './SettingsSection';
import { ChevronDown } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

const TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Australia/Melbourne', label: 'Melbourne' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

export function MyDetailsForm() {
  const t = useTranslations('settings.myDetails');
  const [firstName, setFirstName] = useState('Olivia');
  const [lastName, setLastName] = useState('Rhye');
  const [email, setEmail] = useState('olivia@opensession.co');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [timezone, setTimezone] = useState('Australia/Melbourne');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div {...devProps('MyDetailsForm')} className="max-w-3xl">
      <SettingsSectionHeader
        title={t('title')}
        description={t('subtitle')}
      />

      {/* First Name */}
      <SettingsField label={t('firstName')} required>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t('firstName')}
          className="
            w-full
            px-3.5 py-2.5
            bg-bg-primary
            border border-border-primary
            rounded-lg
            text-fg-primary text-base
            placeholder:text-fg-placeholder
            focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
            shadow-xs
          "
        />
      </SettingsField>

      {/* Last Name */}
      <SettingsField label={t('lastName')} required>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={t('lastName')}
          className="
            w-full
            px-3.5 py-2.5
            bg-bg-primary
            border border-border-primary
            rounded-lg
            text-fg-primary text-base
            placeholder:text-fg-placeholder
            focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
            shadow-xs
          "
        />
      </SettingsField>

      {/* Email */}
      <SettingsField
        label={t('email')}
        required
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          className="
            w-full
            px-3.5 py-2.5
            bg-bg-primary
            border border-border-primary
            rounded-lg
            text-fg-primary text-base
            placeholder:text-fg-placeholder
            focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
            shadow-xs
          "
        />
      </SettingsField>

      {/* Phone */}
      <SettingsField label={t('phone')}>
        <div className="flex">
          <button className="
            inline-flex items-center gap-1.5
            px-3.5 py-2.5
            bg-bg-secondary-alt
            border border-r-0 border-border-primary
            rounded-l-lg
            text-fg-secondary text-base
          ">
            US
            <ChevronDown className="w-4 h-4 text-fg-quaternary" />
          </button>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="
              flex-1 min-w-0
              px-3.5 py-2.5
              bg-bg-primary
              border border-border-primary
              rounded-r-lg
              text-fg-primary text-base
              placeholder:text-fg-placeholder
              focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
              shadow-xs
            "
          />
        </div>
      </SettingsField>

      {/* Timezone */}
      <SettingsField label={t('timezone')}>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="
              w-full
              appearance-none
              px-3.5 py-2.5 pr-10
              bg-bg-primary
              border border-border-primary
              rounded-lg
              text-fg-primary text-base
              focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
              shadow-xs
              cursor-pointer
            "
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="w-5 h-5 text-fg-quaternary" />
          </div>
        </div>
      </SettingsField>

      {/* Date Format */}
      <SettingsField label="Date format">
        <div className="flex flex-wrap gap-3">
          {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map((format) => (
            <label
              key={format}
              className={`
                flex items-center gap-2
                px-4 py-2.5
                border rounded-lg
                cursor-pointer
                transition-all
                ${dateFormat === format
                  ? 'border-border-brand bg-bg-brand-primary text-fg-brand-secondary'
                  : 'border-border-primary text-fg-secondary hover:bg-bg-secondary-alt'
                }
              `}
            >
              <input
                type="radio"
                name="dateFormat"
                value={format}
                checked={dateFormat === format}
                onChange={(e) => setDateFormat(e.target.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium">{format}</span>
            </label>
          ))}
        </div>
      </SettingsField>

      <SettingsSectionFooter
        onCancel={() => {}}
        onSave={handleSave}
        isSaving={isSaving}
        saveLabel={t('saveChanges')}
      />
    </div>
  );
}
