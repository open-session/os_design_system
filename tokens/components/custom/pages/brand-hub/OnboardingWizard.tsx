'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { XClose } from '@untitledui-pro/icons/line';
import { Button } from '@/components/base/base/buttons/button';
import { devProps } from '@/lib/utils/dev-props';

// ============================================
// TYPES
// ============================================

export interface WizardStep {
  /** CSS selector for the element to spotlight */
  targetSelector: string;
  /** Short title shown in tooltip */
  title: string;
  /** Body text with instruction */
  description: string;
}

interface OnboardingWizardProps {
  /** Whether the wizard is currently active */
  isActive: boolean;
  /** Page type used as the localStorage key suffix */
  pageType: string;
  /** Called when wizard is completed or skipped */
  onComplete: () => void;
  /** The steps to display */
  steps: WizardStep[];
}

// ============================================
// LOCALSTORAGE HELPERS
// ============================================

const wizardKey = (pageType: string) => `bos_wizard_completed_${pageType}`;
const wizardTriggerKey = (pageType: string) => `bos_wizard_trigger_${pageType}`;

export function isWizardCompleted(pageType: string): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(wizardKey(pageType)) === 'true';
}

export function markWizardCompleted(pageType: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(wizardKey(pageType), 'true');
}

export function triggerWizardOnNextVisit(pageType: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(wizardTriggerKey(pageType), 'true');
}

export function consumeWizardTrigger(pageType: string): boolean {
  if (typeof window === 'undefined') return false;
  const key = wizardTriggerKey(pageType);
  if (localStorage.getItem(key) === 'true' && !isWizardCompleted(pageType)) {
    localStorage.removeItem(key);
    return true;
  }
  return false;
}

// ============================================
// WIZARD COMPONENT
// ============================================

/**
 * OnboardingWizard
 *
 * Renders a spotlight overlay with a tooltip positioned near the target element.
 * The target element receives a thick box-shadow to create the spotlight cutout effect.
 * Steps progress via Next/Done, and Skip at any step marks the wizard complete.
 *
 * Uses data-wizard-target attributes or CSS selectors to find targets.
 * Falls back gracefully if a target is not found.
 */
export function OnboardingWizard({ isActive, pageType, onComplete, steps }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // Find target element and update rect
  useEffect(() => {
    if (!isActive || !step) return;

    const findTarget = () => {
      const el = document.querySelector(step.targetSelector) as HTMLElement | null;
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        // Elevate target above overlay
        el.style.position = 'relative';
        el.style.zIndex = '9999';
        el.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.55)';
        el.style.borderRadius = '8px';
      } else {
        setTargetRect(null);
      }
    };

    // Allow DOM to settle
    const timer = setTimeout(findTarget, 100);
    return () => clearTimeout(timer);
  }, [isActive, currentStep, step]);

  // Clean up spotlight on unmount only — avoids flicker from unstable steps reference
  useEffect(() => {
    return () => {
      // Remove spotlight from all previously targeted elements
      steps.forEach((s) => {
        const el = document.querySelector(s.targetSelector) as HTMLElement | null;
        if (el) {
          el.style.position = '';
          el.style.zIndex = '';
          el.style.boxShadow = '';
          el.style.borderRadius = '';
        }
      });
    };
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, []);

  // Focus trap: focus tooltip on mount
  useEffect(() => {
    if (isActive && tooltipRef.current) {
      tooltipRef.current.focus();
    }
  }, [isActive, currentStep]);

  const handleNext = useCallback(() => {
    // Remove spotlight from current target
    if (step) {
      const el = document.querySelector(step.targetSelector) as HTMLElement | null;
      if (el) {
        el.style.position = '';
        el.style.zIndex = '';
        el.style.boxShadow = '';
        el.style.borderRadius = '';
      }
    }

    if (isLastStep) {
      markWizardCompleted(pageType);
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep, pageType, onComplete, step]);

  const handleSkip = useCallback(() => {
    // Remove spotlight from current target
    if (step) {
      const el = document.querySelector(step.targetSelector) as HTMLElement | null;
      if (el) {
        el.style.position = '';
        el.style.zIndex = '';
        el.style.boxShadow = '';
        el.style.borderRadius = '';
      }
    }
    markWizardCompleted(pageType);
    onComplete();
  }, [pageType, onComplete, step]);

  if (!isActive || !step) return null;

  // Calculate tooltip position based on target rect
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const viewportHeight = window.innerHeight;
    const tooltipHeight = 160; // approximate
    const margin = 16;

    // Prefer below target, fall back to above if not enough space
    const spaceBelow = viewportHeight - targetRect.bottom;
    const top = spaceBelow > tooltipHeight + margin
      ? targetRect.bottom + margin
      : targetRect.top - tooltipHeight - margin;

    // Align horizontally with target, clamp to viewport
    const left = Math.max(16, Math.min(targetRect.left, window.innerWidth - 320 - 16));

    return { position: 'fixed', top, left };
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Non-blocking overlay — the spotlight comes from the target's box-shadow */}
          <motion.div
            {...devProps('OnboardingWizardOverlay')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] pointer-events-none"
            aria-hidden="true"
          />

          {/* Tooltip */}
          <motion.div
            {...devProps('OnboardingWizard')}
            ref={tooltipRef}
            tabIndex={-1}
            role="dialog"
            aria-label={`Onboarding step ${currentStep + 1} of ${steps.length}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            style={getTooltipStyle()}
            className="z-[10000] w-72 rounded-2xl bg-bg-primary border border-border-primary shadow-2xl overflow-hidden focus:outline-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-2">
                {/* Step dots */}
                <div className="flex items-center gap-1">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={`block rounded-full transition-all ${
                        i === currentStep
                          ? 'w-4 h-1.5 bg-bg-brand-solid'
                          : i < currentStep
                          ? 'w-1.5 h-1.5 bg-bg-brand-primary'
                          : 'w-1.5 h-1.5 bg-border-primary'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-fg-tertiary">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={XClose}
                onClick={handleSkip}
                aria-label="Skip wizard"
              />
            </div>

            {/* Body */}
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-fg-primary mb-1">{step.title}</h3>
              <p className="text-xs text-fg-secondary leading-relaxed">{step.description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 pb-4">
              <Button
                color="tertiary"
                size="sm"
                onClick={handleSkip}
              >
                Skip
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={handleNext}
              >
                {isLastStep ? 'Done' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
