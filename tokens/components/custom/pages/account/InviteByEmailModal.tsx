'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { XClose } from '@untitledui-pro/icons/line';
import { toast } from 'sonner';
import { devProps } from '@/lib/utils/dev-props';
import { Button } from '@/components/ds/buttons/button';
import { TextArea } from '@/components/base/base/textarea/textarea';
import { NativeSelect } from '@/components/base/base/select/select-native';
import { Tabs, TabList, TabPanel } from '@/components/ds/tabs/tabs';
import { InviteByLinkTab } from './InviteByLinkModal';

// ============================================================
// Types
// ============================================================

type TabId = 'email' | 'link';
type OrgRole = 'owner' | 'editor' | 'viewer';

export interface InviteByEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  /** Called after a successful invite so the parent can show a toast or refresh state. */
  onSuccess?: (emails: string[], role: OrgRole) => void;
}

// ============================================================
// Helpers
// ============================================================

/**
 * Splits a raw string by commas, semicolons, or whitespace and returns trimmed, non-empty entries.
 */
function parseEmails(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Returns true if the string looks like a valid email address.
 */
function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// ============================================================
// InviteByEmailModal
// ============================================================

/**
 * Tabbed modal for inviting members to an organization.
 * "Invite by email" tab: comma-separated emails + seat type dropdown.
 * "Invite by link" tab: placeholder (Task 4d provides InviteByLinkTab).
 */
export function InviteByEmailModal({
  isOpen,
  onClose,
  orgId,
  onSuccess,
}: InviteByEmailModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('email');

  // Email tab state
  const [emailsRaw, setEmailsRaw] = useState('');
  const [role, setRole] = useState<OrgRole>('viewer');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus textarea when email tab is active and modal is open
  useEffect(() => {
    if (isOpen && activeTab === 'email' && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, activeTab]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmailsRaw('');
      setRole('viewer');
      setValidationErrors([]);
      setApiError(null);
      setIsSubmitting(false);
      setActiveTab('email');
    }
  }, [isOpen]);

  const handleSend = () => {
    const emails = parseEmails(emailsRaw);
    if (emails.length === 0) return;

    // Client-side validation
    const invalid = emails.filter((e) => !isValidEmail(e));
    if (invalid.length > 0) {
      setValidationErrors(invalid);
      return;
    }

    // Static prototype — email invitations not yet implemented
    toast.info('Email invitations coming soon');
    onSuccess?.(emails, role);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const parsedEmails = parseEmails(emailsRaw);
  const canSubmit = parsedEmails.length > 0 && !isSubmitting;

  // Prevent SSR portal crash
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
              {...devProps('InviteByEmailModal')}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="
                w-full max-w-lg
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="invite-modal-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-secondary flex-shrink-0">
                <div>
                  <h2
                    id="invite-modal-title"
                    className="text-base font-semibold text-fg-primary"
                  >
                    Invite users
                  </h2>
                  <p className="text-xs text-fg-tertiary">
                    Add new members to your organization
                  </p>
                </div>
                <Button
                  ref={closeButtonRef}
                  color="tertiary"
                  size="sm"
                  iconLeading={XClose}
                  onClick={onClose}
                  isDisabled={isSubmitting}
                  aria-label="Close"
                />
              </div>

              {/* Tab bar + content */}
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as TabId)}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <TabList
                  type="underline"
                  size="sm"
                  className="flex-shrink-0 px-6"
                  items={[
                    { id: 'email', children: 'Invite by email' },
                    { id: 'link', children: 'Invite by link' },
                  ]}
                />

                <TabPanel id="email" className="flex flex-col flex-1 overflow-hidden">
                  <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
                    {/* Email addresses */}
                    <TextArea
                      label="Email addresses"
                      textAreaRef={textareaRef}
                      value={emailsRaw}
                      onChange={(val) => {
                        setEmailsRaw(val);
                        setValidationErrors([]);
                        setApiError(null);
                      }}
                      placeholder="you@example.com, colleague@example.com"
                      rows={4}
                      isDisabled={isSubmitting}
                      hint="Invitations expire after 14 days"
                    />

                    {/* Validation errors */}
                    {validationErrors.length > 0 && (
                      <div
                        className="rounded-lg border border-border-secondary bg-bg-tertiary px-4 py-3"
                        role="alert"
                      >
                        <p className="text-sm font-medium text-fg-error-primary mb-1">
                          Invalid email address{validationErrors.length > 1 ? 'es' : ''}:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {validationErrors.map((e) => (
                            <li key={e} className="text-sm text-fg-error-primary">
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Seat type */}
                    <NativeSelect
                      label="Seat type"
                      value={role}
                      onChange={(e) => setRole(e.target.value as OrgRole)}
                      disabled={isSubmitting}
                      options={[
                        { value: 'owner', label: 'Owner — $20 / month' },
                        { value: 'editor', label: 'Editor — $20 / month' },
                        { value: 'viewer', label: 'Viewer — $5 / month' },
                      ]}
                    />
                  </div>

                  {/* API error */}
                  {apiError && (
                    <div className="px-6 py-3 flex-shrink-0">
                      <p className="text-sm text-fg-error-primary" role="alert">
                        {apiError}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-secondary bg-bg-tertiary flex-shrink-0">
                    <Button
                      type="button"
                      color="secondary"
                      size="sm"
                      onClick={onClose}
                      isDisabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      color="primary"
                      size="sm"
                      onClick={handleSend}
                      isDisabled={!canSubmit}
                      isLoading={isSubmitting}
                    >
                      Send Invite
                    </Button>
                  </div>
                </TabPanel>

                <TabPanel id="link" className="flex flex-col flex-1 px-6 py-5">
                  <InviteByLinkTab onClose={onClose} />
                </TabPanel>
              </Tabs>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
