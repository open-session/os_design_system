'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { triggerWizardOnNextVisit } from '@/components/custom/pages/brand-hub/OnboardingWizard';
import { AnimatePresence, motion } from 'motion/react';
import {
  XClose,
  ArrowLeft,
  Fingerprint01 as Fingerprint,
  Palette,
  Type01 as Type,
  Image01 as ImageIcon,
  BookOpen01 as BookOpen,
  Link01,
  Loading01,
} from '@untitledui-pro/icons/line';
import { ModalOverlay, Modal, Dialog } from '@/components/base/application/modals/modal';
import { Input } from '@/components/base/base/input/input';
import { Button } from '@/components/ds/buttons/button';
import { devProps } from '@/lib/utils/dev-props';
import type { BrandHubPageType, BrandHubPage } from '@/lib/supabase/types';

// ---- Types ----

/** Minimal input the modal controls — brandId is provided by the parent via createPage binding. */
interface PageCreationInput {
  pageType: BrandHubPageType;
  title: string;
  description: string | null;
}

interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** createPage from useBrandHubPages with brandId already bound by the parent. */
  createPage: (input: PageCreationInput) => Promise<BrandHubPage>;
}

interface PageTypeConfig {
  type: BrandHubPageType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
  bgClass: string;
}

// ---- Constants ----

const PAGE_TYPES: PageTypeConfig[] = [
  {
    type: 'logo',
    label: 'Logo',
    description: 'Brand marks, lockups, and usage guidelines',
    icon: Fingerprint,
    accentClass: 'text-fg-brand-primary',
    bgClass: 'bg-bg-brand-primary',
  },
  {
    type: 'colors',
    label: 'Colors',
    description: 'Brand palette and color tokens',
    icon: Palette,
    accentClass: 'text-fg-warning-primary',
    bgClass: 'bg-bg-warning-primary',
  },
  {
    type: 'fonts',
    label: 'Fonts',
    description: 'Type system and font specimens',
    icon: Type,
    accentClass: 'text-fg-quaternary',
    bgClass: 'bg-bg-quaternary',
  },
  {
    type: 'galleries',
    label: 'Galleries',
    description: 'Art direction, imagery, and textures',
    icon: ImageIcon,
    accentClass: 'text-fg-success-primary',
    bgClass: 'bg-bg-success-primary',
  },
  {
    type: 'guidelines',
    label: 'Guidelines',
    description: 'Complete brand documentation',
    icon: BookOpen,
    accentClass: 'text-fg-warning-secondary',
    bgClass: 'bg-bg-warning-secondary',
  },
  {
    type: 'resources',
    label: 'Resources',
    description: 'Links, references, and external resources',
    icon: Link01,
    accentClass: 'text-fg-success-secondary',
    bgClass: 'bg-bg-success-secondary',
  },
];

// ---- Sub-components ----

interface PageTypeCardProps {
  config: PageTypeConfig;
  onClick: (type: BrandHubPageType) => void;
}

function PageTypeCard({ config, onClick }: PageTypeCardProps) {
  const Icon = config.icon;
  return (
    <button
      {...devProps('PageTypeCard')}
      type="button"
      onClick={() => onClick(config.type)}
      className="flex flex-col gap-3 p-4 rounded-xl border border-border-secondary bg-bg-primary hover:bg-bg-secondary hover:border-border-primary transition-all duration-150 text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fg-quaternary"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgClass}`}>
        <Icon className={`w-5 h-5 ${config.accentClass}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-fg-primary group-hover:text-fg-primary">
          {config.label}
        </p>
        <p className="text-xs text-fg-tertiary mt-0.5 leading-relaxed">
          {config.description}
        </p>
      </div>
    </button>
  );
}

// ---- Main Component ----

/**
 * AddPageModal — two-step modal for creating a new Brand Hub page.
 *
 * Step 1: 2x3 grid of page type cards — user selects a type.
 * Step 2: Title (required) + description (optional) form, then Create.
 *
 * On successful creation, redirects to the new page at /brand-hub/{slug}.
 * The "Invite users" section is a labeled placeholder — no auth wiring.
 */
export function AddPageModal({ isOpen, onClose, createPage }: AddPageModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<'select' | 'create'>('select');
  const [selectedType, setSelectedType] = useState<PageTypeConfig | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setStep('select');
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setIsCreating(false);
    setCreateError(null);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleTypeSelect = useCallback((type: BrandHubPageType) => {
    const config = PAGE_TYPES.find(pt => pt.type === type) ?? null;
    setSelectedType(config);
    setStep('create');
  }, []);

  const handleBack = useCallback(() => {
    setStep('select');
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setCreateError(null);
  }, []);

  const handleCreate = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !selectedType) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const newPage = await createPage({
        pageType: selectedType.type,
        title: trimmedTitle,
        description: description.trim() || null,
      });

      // Set wizard trigger so the destination page shows the onboarding wizard
      triggerWizardOnNextVisit(newPage.slug.split('-')[0] ?? selectedType.type);
      handleClose();
      router.push(`/brand-hub/${newPage.slug}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create page. Please try again.';
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  }, [title, description, selectedType, createPage, handleClose, router]);

  const isTitleValid = title.trim().length > 0;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Modal className="max-w-2xl mx-auto">
        <Dialog className="border border-border-primary">
          <div
            {...devProps('AddPageModal')}
            className="w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-secondary">
              <div className="flex items-center gap-3">
                {step === 'create' && (
                  <Button
                    color="tertiary"
                    size="sm"
                    iconLeading={ArrowLeft}
                    onClick={handleBack}
                    aria-label="Back to page type selection"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-fg-primary">
                    {step === 'select' ? 'Add a page' : `New ${selectedType?.label ?? ''} page`}
                  </h2>
                  <p className="text-sm text-fg-tertiary">
                    {step === 'select'
                      ? 'Choose a page type to get started'
                      : 'Give your page a name and description'}
                  </p>
                </div>
              </div>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={XClose}
                onClick={handleClose}
                aria-label="Close modal"
              />
            </div>

            {/* Content — animated step transition */}
            <div className="px-6 py-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 'select' ? (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* 2x3 grid of page type cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PAGE_TYPES.map((config) => (
                        <PageTypeCard
                          key={config.type}
                          config={config}
                          onClick={handleTypeSelect}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-5"
                  >
                    {/* Form fields */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <label
                          htmlFor="page-title"
                          className="block text-sm font-medium text-fg-secondary mb-1.5"
                        >
                          Page title <span className="text-fg-error-primary">*</span>
                        </label>
                        {/* UUI Input uses React Aria TextFieldProps: onChange(value: string) */}
                        <Input
                          id="page-title"
                          value={title}
                          onChange={setTitle}
                          placeholder={`e.g., ${selectedType?.label ?? 'My page'}`}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="page-description"
                          className="block text-sm font-medium text-fg-secondary mb-1.5"
                        >
                          Description{' '}
                          <span className="text-fg-tertiary text-xs font-normal">(optional)</span>
                        </label>
                        <textarea
                          id="page-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="What's on this page? Help your team understand its purpose."
                          rows={3}
                          className="w-full px-3 py-2.5 text-sm rounded-lg border border-border-primary bg-bg-primary text-fg-primary placeholder:text-fg-quaternary focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-fg-quaternary resize-none transition-shadow"
                        />
                      </div>
                    </div>

                    {/* Invite users — placeholder section */}
                    <div className="rounded-xl border border-border-secondary bg-bg-secondary px-4 py-3">
                      <p className="text-sm font-medium text-fg-secondary">
                        Invite team members
                      </p>
                      <p className="text-xs text-fg-tertiary mt-0.5">
                        Team collaboration is coming soon — invite users will be available in a future update.
                      </p>
                    </div>

                    {/* Error message */}
                    {createError && (
                      <p className="text-sm text-fg-error-primary bg-bg-error-primary border border-border-error rounded-lg px-3 py-2">
                        {createError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer — only shown on create step */}
            {step === 'create' && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-secondary bg-bg-secondary">
                {/* UUI Button uses color prop and onClick (not onPress) */}
                <Button
                  color="secondary"
                  size="md"
                  onClick={handleClose}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  size="md"
                  onClick={handleCreate}
                  disabled={!isTitleValid || isCreating}
                  isLoading={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create page'}
                </Button>
              </div>
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
