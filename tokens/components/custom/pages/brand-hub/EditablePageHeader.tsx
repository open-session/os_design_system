'use client';

import { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/base/base/input/input';
import { TextArea } from '@/components/base/base/textarea/textarea';
import { devProps } from '@/lib/utils/dev-props';
import type { BrandHubPage } from '@/lib/supabase/types';

interface EditablePageHeaderProps {
  slug: string;
  fallbackTitle: string;
  fallbackDescription?: string;
  isEditing: boolean;
  /** Synchronous lookup of a page from the parent-owned useBrandHubPages instance */
  getPage: (slug: string) => BrandHubPage | undefined;
  /** Persist title/description changes — from the parent-owned useBrandHubPages instance */
  updatePage: (slug: string, updates: { title?: string; description?: string }) => Promise<BrandHubPage>;
}

/**
 * Renders the page title and description as either static text or inline-editable
 * inputs, depending on the `isEditing` prop. When editing, changes are auto-saved
 * on blur via the `updatePage` prop. If no database record exists for the given
 * slug, the fallback prop values are displayed.
 *
 * `getPage` and `updatePage` must be passed from the parent (e.g. BrandHubLayout)
 * which owns the single useBrandHubPages() instance — this prevents duplicate
 * fetches and stale-state issues caused by independent hook instances.
 */
export function EditablePageHeader({
  slug,
  fallbackTitle,
  fallbackDescription,
  isEditing,
  getPage,
  updatePage,
}: EditablePageHeaderProps) {
  const page = getPage(slug);

  const persistedTitle = page?.title ?? fallbackTitle;
  const persistedDescription = page?.description ?? fallbackDescription ?? '';

  const [titleDraft, setTitleDraft] = useState(persistedTitle);
  const [descriptionDraft, setDescriptionDraft] = useState(persistedDescription);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Sync draft values when persisted data changes (e.g., after initial fetch)
  useEffect(() => {
    setTitleDraft(persistedTitle);
  }, [persistedTitle]);

  useEffect(() => {
    setDescriptionDraft(persistedDescription);
  }, [persistedDescription]);

  const handleTitleBlur = useCallback(async () => {
    // Validate: title cannot be empty
    if (!titleDraft.trim()) {
      setTitleDraft(persistedTitle);
      setTitleError('Title cannot be empty.');
      return;
    }

    // No change — skip save
    if (titleDraft === persistedTitle) return;

    setIsSavingTitle(true);
    setTitleError(null);
    try {
      await updatePage(slug, { title: titleDraft.trim() });
    } catch {
      setTitleDraft(persistedTitle);
      setTitleError('Failed to save — try again');
    } finally {
      setIsSavingTitle(false);
    }
  }, [titleDraft, persistedTitle, slug, updatePage]);

  const handleDescriptionBlur = useCallback(async () => {
    // No change — skip save
    if (descriptionDraft === persistedDescription) return;

    setIsSavingDescription(true);
    setDescriptionError(null);
    try {
      await updatePage(slug, { description: descriptionDraft });
    } catch {
      setDescriptionDraft(persistedDescription);
      setDescriptionError('Failed to save — try again');
    } finally {
      setIsSavingDescription(false);
    }
  }, [descriptionDraft, persistedDescription, slug, updatePage]);

  if (!isEditing) {
    return (
      <div {...devProps('EditablePageHeader')} className="flex flex-col gap-1">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-fg-primary leading-tight">
          {persistedTitle}
        </h1>
        {persistedDescription && (
          <p className="text-base md:text-lg text-fg-tertiary max-w-2xl">
            {persistedDescription}
          </p>
        )}
      </div>
    );
  }

  return (
    <div {...devProps('EditablePageHeader')} className="flex flex-col gap-3">
      {/* Editable title */}
      <div className="relative">
        <Input
          value={titleDraft}
          onChange={(v) => setTitleDraft(v)}
          onBlur={handleTitleBlur}
          isDisabled={isSavingTitle}
          placeholder="Page title"
          aria-label="Edit page title"
          isInvalid={!!titleError}
          hint={titleError || undefined}
          wrapperClassName="!rounded-none !shadow-none !ring-0 !border-b !border-border-primary focus-within:!border-border-brand !bg-transparent"
          inputClassName={[
            'text-4xl md:text-5xl font-display font-bold text-fg-primary leading-tight',
            '!bg-transparent !px-0 !py-1 placeholder:text-fg-tertiary',
            isSavingTitle ? 'opacity-60' : '',
          ].filter(Boolean).join(' ')}
        />
      </div>

      {/* Editable description */}
      <div className="relative max-w-2xl">
        <TextArea
          value={descriptionDraft}
          onChange={(v) => setDescriptionDraft(v)}
          onBlur={handleDescriptionBlur}
          isDisabled={isSavingDescription}
          rows={2}
          placeholder="Page description (optional)"
          aria-label="Edit page description"
          isInvalid={!!descriptionError}
          hint={descriptionError || undefined}
          textAreaClassName={[
            'text-base md:text-lg text-fg-tertiary',
            '!rounded-none !shadow-none !ring-0 !border-b !border-border-primary focus:!border-border-brand focus:!shadow-none',
            '!bg-transparent !px-0 !py-1 resize-none placeholder:text-fg-tertiary',
            isSavingDescription ? 'opacity-60' : '',
          ].filter(Boolean).join(' ')}
        />
      </div>
    </div>
  );
}
