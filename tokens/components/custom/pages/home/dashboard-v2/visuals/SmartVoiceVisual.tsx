'use client';

import { devProps } from '@/lib/utils/dev-props';

export function SmartVoiceVisual() {
  return (
    <svg
      {...devProps('SmartVoiceVisual')}
      width="130"
      height="130"
      viewBox="0 0 130 130"
      aria-hidden
    >
      <circle cx="65" cy="65" r="58" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="65" y="19" textAnchor="middle" fontSize="14" fill="currentColor">−</text>
      <circle cx="65" cy="65" r="42" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="65" y="35" textAnchor="middle" fontSize="14" fill="currentColor">+</text>
      <circle cx="65" cy="65" r="26" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="65" y="51" textAnchor="middle" fontSize="14" fill="currentColor">−</text>
      <circle cx="65" cy="65" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="65" y="69" textAnchor="middle" fontSize="14" fill="currentColor">+</text>
    </svg>
  );
}
