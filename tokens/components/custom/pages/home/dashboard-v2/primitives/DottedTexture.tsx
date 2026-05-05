'use client';

import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

type Variant = 'dark' | 'vanilla' | 'aperol';

const dotColorByVariant: Record<Variant, string> = {
  dark: 'rgba(255,255,255,0.06)',
  vanilla: 'rgba(25,25,25,0.18)',
  aperol: 'rgba(25,25,25,0.25)',
};

interface DottedTextureProps {
  variant?: Variant;
  size?: number;
  className?: string;
}

export function DottedTexture({ variant = 'dark', size = 6, className }: DottedTextureProps) {
  const color = dotColorByVariant[variant];
  return (
    <div
      {...devProps('DottedTexture')}
      aria-hidden
      className={cx('pointer-events-none absolute inset-0 z-0', className)}
      style={{
        backgroundImage: `radial-gradient(${color} 0.5px, transparent 0.5px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
