'use client';

import { motion } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from './Eyebrow';

interface SentimentGaugeProps {
  value: number;
  className?: string;
}

const ARC_RADIUS = 60;
const ARC_LENGTH = Math.PI * ARC_RADIUS;

function describeArc(value: number) {
  const clamped = Math.max(-1, Math.min(1, value));
  const t = (clamped + 1) / 2;
  const angle = Math.PI * (1 - t);
  const cx = 70 + ARC_RADIUS * Math.cos(angle);
  const cy = 70 - ARC_RADIUS * Math.sin(angle);
  return { x: cx, y: cy };
}

export function SentimentGauge({ value, className }: SentimentGaugeProps) {
  const end = describeArc(value);
  const display = `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
  const tone = value > 0.2 ? 'POSITIVE' : value < -0.2 ? 'NEGATIVE' : 'NEUTRAL';

  return (
    <div {...devProps('SentimentGauge')} className={cx('w-full', className)}>
      <svg viewBox="0 0 140 90" className="h-auto w-full">
        <path
          d={`M 10,70 A ${ARC_RADIUS},${ARC_RADIUS} 0 0 1 130,70`}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-border-secondary"
        />
        <motion.path
          d={`M 10,70 A ${ARC_RADIUS},${ARC_RADIUS} 0 0 1 ${end.x.toFixed(2)},${end.y.toFixed(2)}`}
          fill="none"
          stroke="var(--color-brand-500)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ pathLength: 1 }}
          strokeDasharray={ARC_LENGTH}
        />
        <text
          x="70"
          y="62"
          textAnchor="middle"
          className="fill-current text-fg-primary"
          style={{ font: '500 22px var(--font-display, "Neue Haas Grotesk Display Pro")', letterSpacing: '-0.02em' }}
        >
          {display}
        </text>
        <text
          x="70"
          y="78"
          textAnchor="middle"
          className="fill-current text-fg-tertiary"
          style={{
            font: '500 9px "Neue Haas Grotesk Text Pro", system-ui, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {tone}
        </text>
      </svg>
      <div className="mt-1 flex justify-between">
        <Eyebrow tone="quaternary">− 1.0</Eyebrow>
        <Eyebrow tone="quaternary">0</Eyebrow>
        <Eyebrow tone="quaternary">+ 1.0</Eyebrow>
      </div>
    </div>
  );
}
