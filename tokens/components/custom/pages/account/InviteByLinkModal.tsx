'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Copy01,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { Button } from '@/components/ds/buttons/button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InviteByLinkTabProps {
  /** Called when the user clicks Cancel */
  onClose: () => void;
}

// ─── Static prototype ─────────────────────────────────────────────────────────

const STATIC_INVITE_URL = 'https://www.bos.live/invite/coming-soon';

function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text: string): void {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// ─── InviteByLinkTab ──────────────────────────────────────────────────────────

/**
 * Tab body for "Invite by link" within the InviteModal shell (Task 4c).
 * Renders the warning banner, link field, role dropdown, regenerate button,
 * and footer actions. Does NOT include modal chrome.
 *
 * @example
 * ```tsx
 * import { InviteByLinkTab } from '@/components/custom/pages/account/InviteByLinkModal';
 * <InviteByLinkTab orgId={activeOrg.id} onClose={closeModal} />
 * ```
 */
export function InviteByLinkTab({ onClose }: InviteByLinkTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(STATIC_INVITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div {...devProps('InviteByLinkTab')} className="flex flex-col gap-4">
      {/* Warning banner */}
      <div
        className="
          flex items-start gap-3
          bg-bg-warning-primary
          border border-border-warning
          text-fg-warning-primary
          rounded-lg px-4 py-3 text-sm
        "
        role="alert"
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-fg-warning-primary" />
        <p>
          Invite links are coming soon. Copy the placeholder link below.
        </p>
      </div>

      {/* Read-only link input */}
      <input
        type="text"
        readOnly
        value={STATIC_INVITE_URL}
        aria-label="Invite link"
        className="
          w-full px-4 py-2.5
          bg-bg-primary
          border border-border-secondary
          rounded-lg
          text-fg-primary
          truncate
          cursor-default
        "
      />

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          color="secondary"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          size="sm"
          iconLeading={Copy01}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
      </div>
    </div>
  );
}
