'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { XClose } from '@untitledui-pro/icons/line';
import { toast } from 'sonner';
import { devProps } from '@/lib/utils/dev-props';
import { Button } from '@/components/ds/buttons/button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateOrgModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when the modal requests close */
  onClose: () => void;
  /**
   * Called with the newly created org's ID and name after successful creation.
   * Use this to switch to the new org via the org store or a parent callback.
   */
  onOrgCreated?: (orgId: string, orgName: string) => void;
}

// ─── Slug utilities ───────────────────────────────────────────────────────────

/**
 * Derives a URL-safe slug from a plain text org name.
 * Lowercases, replaces spaces with hyphens, strips non-alphanumeric-hyphen chars,
 * and truncates to 50 characters.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50);
}

/**
 * Returns true when the slug satisfies the format rules:
 * - Starts and ends with an alphanumeric character
 * - Contains only lowercase letters, digits, and hyphens
 * - Total length between 3 and 50 characters
 */
function validateSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug);
}

// ─── CreateOrgModal ───────────────────────────────────────────────────────────

/**
 * Standalone modal for creating a new organization.
 * Triggered from the org switcher "Create Organization" action.
 *
 * On success it calls `onOrgCreated(id)` so the parent can switch to the new
 * org (e.g. by calling `switchOrg` from the org Zustand store).
 *
 * @example
 * ```tsx
 * import { CreateOrgModal } from '@/components/custom/pages/account/CreateOrgModal';
 *
 * <CreateOrgModal
 *   isOpen={showCreate}
 *   onClose={() => setShowCreate(false)}
 *   onOrgCreated={(id) => switchOrg(id)}
 * />
 * ```
 */
export function CreateOrgModal({
  isOpen,
  onClose,
  onOrgCreated,
}: CreateOrgModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSlug('');
      setSlugManuallyEdited(false);
      setError(null);
    }
  }, [isOpen]);

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      if (!slugManuallyEdited) {
        setSlug(generateSlug(value));
      }
    },
    [slugManuallyEdited]
  );

  const handleSlugChange = useCallback(
    (value: string) => {
      // Only allow valid slug characters while typing
      const sanitized = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 50);
      setSlug(sanitized);
      setSlugManuallyEdited(true);
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const slugValid = validateSlug(slug);
  const canSubmit = name.trim().length > 0 && slugValid;

  const handleCreate = () => {
    if (!canSubmit) return;
    // Static prototype — organization creation not yet implemented
    toast.info('Organization creation coming soon');
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };

  // Don't render portal on the server
  if (typeof window === 'undefined') return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={onClose}
          />

          {/* Centering container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              {...devProps('CreateOrgModal')}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="
                w-full max-w-md
                max-h-[calc(100vh-64px)]
                bg-bg-secondary
                border border-border-primary
                rounded-xl
                shadow-2xl
                overflow-hidden
                flex flex-col
                pointer-events-auto
              "
              onKeyDown={handleKeyDown}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border-secondary flex-shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-fg-primary">
                    Create Organization
                  </h2>
                  <p className="text-xs text-fg-tertiary">
                    Set up a new workspace for your team
                  </p>
                </div>
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={XClose}
                  onClick={onClose}
                  aria-label="Close modal"
                />
              </div>

              {/* Form */}
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="px-5 sm:px-6 py-5 space-y-5 overflow-y-auto flex-1">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="org-name"
                      className="block text-sm font-medium text-fg-secondary mb-2"
                    >
                      Organization name
                      <span className="text-fg-error ml-0.5">*</span>
                    </label>
                    <input
                      ref={inputRef}
                      id="org-name"
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Acme Inc."
                      maxLength={100}

                      className="
                        w-full px-4 py-2.5
                        bg-bg-primary
                        border border-border-secondary
                        rounded-lg
                        text-fg-primary
                        placeholder:text-fg-quaternary
                        focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
                        transition-all
                        disabled:opacity-50
                      "
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label
                      htmlFor="org-slug"
                      className="block text-sm font-medium text-fg-secondary mb-2"
                    >
                      URL slug
                      <span className="text-fg-error ml-0.5">*</span>
                    </label>
                    <input
                      id="org-slug"
                      type="text"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="acme-inc"
                      maxLength={50}

                      className="
                        w-full px-4 py-2.5
                        bg-bg-primary
                        border border-border-secondary
                        rounded-lg
                        text-fg-primary
                        placeholder:text-fg-quaternary
                        focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
                        transition-all
                        disabled:opacity-50
                      "
                    />
                    {/* Slug preview */}
                    {slug && (
                      <p className="mt-1.5 text-xs text-fg-tertiary">
                        bos.live/
                        <span
                          className={
                            slugValid ? 'text-fg-secondary' : 'text-fg-error'
                          }
                        >
                          {slug}
                        </span>
                      </p>
                    )}
                    {/* Slug validation hint */}
                    {slug && !slugValid && (
                      <p className="mt-1 text-xs text-fg-error">
                        Slug must be 3–50 characters, start and end with a
                        letter or number, and contain only lowercase letters,
                        numbers, and hyphens.
                      </p>
                    )}
                  </div>
                </div>

                {/* Inline error */}
                {error && (
                  <div className="px-5 sm:px-6 pb-4">
                    <p className="text-sm text-fg-error">{error}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-border-secondary bg-bg-tertiary flex-shrink-0">
                  <Button
                    type="button"
                    color="secondary"
                    size="sm"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    isDisabled={!canSubmit}
                  >
                    Create Organization
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
