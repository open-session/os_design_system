'use client';

import { devProps } from '@/lib/utils/dev-props';
import { FramedPanel } from '../primitives/FramedPanel';
import { Eyebrow } from '../primitives/Eyebrow';
import { Pill } from '../primitives/Pill';

const HEX_LARGE = '0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50';
const HEX_MID_HI = '0,-75 64.95,-37.5 64.95,37.5 0,75 -64.95,37.5 -64.95,-37.5';
const HEX_MID = '0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25';
const HEX_SMALL = '0,-25 21.65,-12.5 21.65,12.5 0,25 -21.65,12.5 -21.65,-12.5';

const VERTICES: Array<{
  x: number;
  y: number;
  label: string;
  anchor: 'start' | 'middle' | 'end';
  dx: number;
  dy: number;
}> = [
  { x: 0, y: -100, label: 'Logo', anchor: 'middle', dx: 0, dy: -8 },
  { x: 86.6, y: -50, label: 'Color', anchor: 'start', dx: 13, dy: 0 },
  { x: 86.6, y: 50, label: 'Fonts', anchor: 'start', dx: 13, dy: 5 },
  { x: 0, y: 100, label: 'Identity', anchor: 'middle', dx: 0, dy: 15 },
  { x: -86.6, y: 50, label: 'Tokens', anchor: 'end', dx: -13, dy: 5 },
  { x: -86.6, y: -50, label: 'Skills', anchor: 'end', dx: -13, dy: 0 },
];

const DATA_POINTS = '0,-90 73.61,-42.5 64.95,37.5 0,80 -56.29,32.5 -75.05,-43.35';

export function ContextRadarView() {
  return (
    <div {...devProps('ContextRadarView')} className="flex h-full flex-col">
      <div className="flex items-start justify-between px-6 pb-4 pt-6">
        <div>
          <h3 className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-fg-primary">
            Context Radar
          </h3>
          <Eyebrow tone="tertiary" as="div" className="mt-1">
            Completeness across dimensions
          </Eyebrow>
        </div>
        <div className="flex gap-1">
          <Pill variant="on">All</Pill>
          <Pill>Hub</Pill>
          <Pill>Brain</Pill>
        </div>
      </div>

      <FramedPanel variant="dark" className="mx-5" innerClassName="py-4">
        <svg width="280" height="240" viewBox="0 0 280 240" aria-hidden>
          <g transform="translate(140,120)">
            {[HEX_LARGE, HEX_MID_HI, HEX_MID, HEX_SMALL].map((pts) => (
              <polygon
                key={pts}
                points={pts}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border-secondary"
              />
            ))}
            {VERTICES.map((v) => (
              <line
                key={v.label}
                x1="0"
                y1="0"
                x2={v.x}
                y2={v.y}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border-secondary"
              />
            ))}
            <polygon
              points={DATA_POINTS}
              fill="var(--color-brand-500)"
              fillOpacity="0.18"
              stroke="var(--color-brand-500)"
              strokeWidth="1"
            />
            {DATA_POINTS.split(' ').map((p) => {
              const [x, y] = p.split(',').map(Number);
              return <circle key={p} cx={x} cy={y} r="2.5" fill="var(--color-brand-500)" />;
            })}
            {VERTICES.map((v) => (
              <text
                key={`label-${v.label}`}
                x={v.x + v.dx}
                y={v.y + v.dy}
                textAnchor={v.anchor}
                fontSize="11"
                fontWeight="500"
                fill="currentColor"
                className="text-fg-tertiary"
              >
                {v.label}
              </text>
            ))}
          </g>
        </svg>
      </FramedPanel>

      <div className="mt-4 flex items-center justify-between px-6 pb-5 pt-4 text-xs">
        <span className="text-fg-tertiary">
          Strongest: <span className="text-fg-brand-secondary">Logo 90</span>
        </span>
        <span className="text-fg-tertiary">
          Weakest: <span className="text-fg-primary">Tokens 55</span>
        </span>
        <a href="#" className="text-fg-brand-secondary no-underline hover:underline">
          View report →
        </a>
      </div>
    </div>
  );
}
