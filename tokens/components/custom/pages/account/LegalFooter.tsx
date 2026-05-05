import Link from 'next/link';
import { devProps } from '@/lib/utils/dev-props';

export function LegalFooter() {
  return (
    <div {...devProps('LegalFooter')} className="px-4 py-4 border-t border-border-secondary">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link
          href="/legal/privacy"
          className="text-xs text-fg-tertiary hover:text-fg-secondary transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-fg-quaternary text-xs">·</span>
        <Link
          href="/legal/terms"
          className="text-xs text-fg-tertiary hover:text-fg-secondary transition-colors"
        >
          Terms of Service
        </Link>
        <span className="text-fg-quaternary text-xs">·</span>
        <a
          href="https://opensession.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-fg-tertiary hover:text-fg-secondary transition-colors"
        >
          opensession.co
        </a>
      </div>
    </div>
  );
}
