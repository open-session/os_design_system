'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

interface FeatureCarouselProps {
  children: ReactNode;
  count: number;
}

const GAP = 10; // gap-2.5

export function FeatureCarousel({ children, count }: FeatureCarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [stops, setStops] = useState(1);
  const [maxOffset, setMaxOffset] = useState(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const nextStep = cardWidth + GAP;
    const visible = nextStep > 0 ? Math.max(1, Math.round(viewport.clientWidth / nextStep)) : 1;
    const nextStops = Math.max(1, count - visible + 1);

    // Total track width = count * card + (count - 1) * gap. We want the LAST
    // stop to align the right edge of the last card with the viewport's right
    // edge — so max offset is the difference between track width and viewport.
    const trackWidth = count * cardWidth + (count - 1) * GAP;
    const nextMaxOffset = Math.max(0, trackWidth - viewport.clientWidth);

    setStep(nextStep);
    setStops(nextStops);
    setMaxOffset(nextMaxOffset);
    setActiveIndex((prev) => Math.min(prev, nextStops - 1));
  }, [count]);

  useEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [measure]);

  // Raw offset from active index, clamped so the last stop aligns to the
  // viewport's right edge instead of overshooting.
  const rawOffset = activeIndex * step;
  const offset = Math.min(rawOffset, maxOffset);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < stops - 1;

  return (
    <div {...devProps('FeatureCarousel')} className="relative">
      <div ref={viewportRef} className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-full gap-2.5 will-change-transform"
          style={{
            transform: `translate3d(${-offset}px, 0, 0)`,
            transition: 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {children}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          aria-label="Previous features"
          disabled={!canPrev}
          className={cx(
            'flex h-6 w-6 items-center justify-center rounded-sm text-fg-tertiary transition-colors',
            'hover:text-fg-primary focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring-brand',
            'disabled:cursor-not-allowed disabled:opacity-30',
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: stops }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to feature page ${i + 1}`}
              className={cx(
                'h-1.5 rounded-full transition-all',
                i === activeIndex ? 'w-4 bg-fg-primary' : 'w-1.5 bg-fg-quaternary hover:bg-fg-tertiary',
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActiveIndex((i) => Math.min(stops - 1, i + 1))}
          aria-label="Next features"
          disabled={!canNext}
          className={cx(
            'flex h-6 w-6 items-center justify-center rounded-sm text-fg-tertiary transition-colors',
            'hover:text-fg-primary focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring-brand',
            'disabled:cursor-not-allowed disabled:opacity-30',
          )}
        >
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
