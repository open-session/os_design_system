'use client';

import { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/custom/shared/overlays/Modal';
import { Button } from '@/components/base/base/buttons/button';
import {
  Link01 as LinkIcon,
  LinkExternal01,
  Plus,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { SpaceLink } from '@/types';

interface AddLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (link: Omit<SpaceLink, 'id' | 'addedAt'>) => void;
  existingLinks?: SpaceLink[];
  onRemoveLink?: (linkId: string) => void;
}

export function AddLinksModal({
  isOpen,
  onClose,
  onAddLink,
  existingLinks = [],
  onRemoveLink,
}: AddLinksModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        urlInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddLink = () => {
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    const urlToAdd = url.startsWith('http') ? url : `https://${url}`;
    
    if (!validateUrl(urlToAdd)) {
      setError('Please enter a valid URL');
      return;
    }

    onAddLink({
      url: urlToAdd,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    });

    setUrl('');
    setTitle('');
    setDescription('');
    setError('');
    urlInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && url.trim()) {
      e.preventDefault();
      handleAddLink();
    }
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  };

  // Common input styles using UUI theme tokens
  const inputStyles = `
    w-full px-3 py-2.5 rounded-lg
    bg-primary-alt border
    text-fg-primary placeholder-fg-placeholder
    focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-transparent
    transition-colors
  `;

  return (
    <Modal {...devProps('AddLinksModal')} isOpen={isOpen} onClose={handleClose} title="Add Links" size="md">
      {/* Add new link form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleAddLink();
        }}
        className="space-y-4"
      >
        <div>
          <label 
            htmlFor="link-url"
            className="block text-sm font-medium text-fg-primary mb-1.5"
          >
            URL <span className="text-fg-error-primary">*</span>
          </label>
          <input
            ref={urlInputRef}
            id="link-url"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            autoComplete="url"
            className={`${inputStyles} ${error ? 'border-border-error' : 'border-border-primary'}`}
          />
          {error && (
            <p className="mt-1.5 text-sm text-fg-error-primary" role="alert">{error}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="link-title"
            className="block text-sm font-medium text-fg-primary mb-1.5"
          >
            Title <span className="text-fg-quaternary font-normal">(optional)</span>
          </label>
          <input
            id="link-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Link title"
            autoComplete="off"
            className={`${inputStyles} border-border-primary`}
          />
        </div>

        <div>
          <label 
            htmlFor="link-description"
            className="block text-sm font-medium text-fg-primary mb-1.5"
          >
            Description <span className="text-fg-quaternary font-normal">(optional)</span>
          </label>
          <textarea
            id="link-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the link"
            rows={2}
            className={`${inputStyles} border-border-primary resize-none`}
          />
        </div>

        <Button
          type="submit"
          color="primary"
          size="md"
          iconLeading={Plus}
          className="w-full"
        >
          Add Link
        </Button>
      </form>

      {/* Existing links */}
      {existingLinks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border-secondary">
          <h4 className="text-sm font-medium text-fg-primary mb-3">
            Saved links ({existingLinks.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {existingLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-start justify-between p-3 rounded-xl bg-bg-tertiary hover:bg-bg-secondary transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <LinkIcon className="w-4 h-4 text-fg-tertiary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-fg-primary truncate">
                      {link.title || link.url}
                    </p>
                    {link.title && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-fg-brand-primary hover:underline inline-flex items-center gap-1 truncate max-w-full"
                      >
                        <span className="truncate">{link.url}</span>
                        <LinkExternal01 className="w-3 h-3 flex-shrink-0" />
                      </a>
                    )}
                    {link.description && (
                      <p className="text-xs text-fg-tertiary mt-1 line-clamp-2">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
                {onRemoveLink && (
                  <button
                    type="button"
                    onClick={() => onRemoveLink(link.id)}
                    className="p-1.5 rounded-lg hover:bg-bg-quaternary text-fg-tertiary hover:text-fg-error-primary transition-colors flex-shrink-0 focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring-error"
                    aria-label={`Remove link "${link.title || link.url}"`}
                  >
                    <XClose className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {existingLinks.length === 0 && (
        <div className="mt-4 p-4 rounded-xl bg-bg-secondary text-center">
          <p className="text-sm text-fg-tertiary">
            Add links to reference websites and resources in this space.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end mt-6 pt-4 border-t border-border-secondary">
        <Button
          type="button"
          color="secondary"
          size="md"
          onClick={handleClose}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}
