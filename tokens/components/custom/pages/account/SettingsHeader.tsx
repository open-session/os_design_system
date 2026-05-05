'use client';

import { useTranslations } from 'next-intl';
import { devProps } from '@/lib/utils/dev-props';

export function SettingsHeader() {
  const t = useTranslations('settings.header');

  return (
    <div {...devProps('SettingsHeader')} className="flex flex-col gap-3">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-display font-bold text-fg-primary">
        {t('title')}
      </h1>
      <p className="text-base md:text-lg text-fg-secondary max-w-2xl">
        {t('subtitle')}
      </p>
    </div>
  );
}
