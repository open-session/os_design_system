'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/custom/shared/overlays/Modal';
import { Button } from '@/components/base/base/buttons/button';
import { Icon } from '@/components/custom/shared/branding/Icon';
import {
  AlertCircle,
  Mail01,
  Plus,
  SearchLg,
  XClose,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import {
  getAllLucideIconNames,
  FA_BRAND_ICONS,
  POPULAR_ICONS,
  isFontAwesomeIcon
} from '@/lib/icons';

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description?: string, icon?: string, inviteEmails?: string[]) => Promise<{ slug: string }> | { slug: string };
}

// Tab types for the icon picker
type IconTab = 'popular' | 'brands' | 'all';
type ModalStep = 1 | 2;

export function CreateSpaceModal({ isOpen, onClose, onCreate }: CreateSpaceModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<ModalStep>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Rocket');
  const [iconSearch, setIconSearch] = useState('');
  const [iconTab, setIconTab] = useState<IconTab>('popular');
  const [isCreating, setIsCreating] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  // Invite step state
  const [inviteInput, setInviteInput] = useState('');
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);

  // Get all Lucide icons once
  const allLucideIcons = useMemo(() => getAllLucideIconNames(), []);

  // Get displayed icons based on tab and search
  const displayedIcons = useMemo(() => {
    const query = iconSearch.toLowerCase().trim();
    
    if (query) {
      // When searching, search both Lucide and FA icons
      const lucideMatches = allLucideIcons.filter(n => 
        n.toLowerCase().includes(query)
      );
      const faMatches = FA_BRAND_ICONS.filter(icon =>
        icon.name.toLowerCase().includes(query) ||
        icon.keywords.some(k => k.includes(query))
      ).map(i => i.name);
      
      // Interleave results: show FA matches first
      return [...faMatches, ...lucideMatches].slice(0, 24);
    }
    
    switch (iconTab) {
      case 'popular':
        // Mix of popular Lucide and FA icons
        return [...POPULAR_ICONS.fontAwesome.slice(0, 6), ...POPULAR_ICONS.lucide.slice(0, 12)];
      case 'brands':
        // Font Awesome brand icons only
        return FA_BRAND_ICONS.slice(0, 24).map(i => i.name);
      case 'all':
        // All Lucide icons
        return allLucideIcons.slice(0, 24);
      default:
        return [];
    }
  }, [iconSearch, iconTab, allLucideIcons]);

  const handleAddInviteEmail = () => {
    const email = inviteInput.trim();
    if (email && email.includes('@') && !inviteEmails.includes(email)) {
      setInviteEmails((prev) => [...prev, email]);
      setInviteInput('');
    }
  };

  const handleRemoveInviteEmail = (email: string) => {
    setInviteEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setStep(2);
  };

  const handleCreateSpace = async (emails: string[]) => {
    setIsCreating(true);
    try {
      const newSpace = await onCreate(title.trim(), description.trim() || undefined, selectedIcon || undefined, emails);
      resetForm();
      onClose();
      router.push(`/spaces/${newSpace.slug}`);
    } catch (error) {
      console.error('Error creating space:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedIcon('Rocket');
    setIconSearch('');
    setShowValidation(false);
    setStep(1);
    setInviteInput('');
    setInviteEmails([]);
  };

  const handleClose = () => {
    if (!isCreating) {
      resetForm();
      onClose();
    }
  };

  // Clear validation when user starts typing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setShowValidation(false);
    }
  };

  const hasValidationError = showValidation && !title.trim();

  // Step 2: Invite members content
  const renderInviteStep = () => (
    <div {...devProps('InviteMembersStep')} className="space-y-4">
      <div>
        <p className="text-sm text-fg-secondary mb-4">
          Invite teammates to collaborate in <span className="font-medium text-fg-primary">{title}</span>. You can also skip and invite them later.
        </p>
        <label className="block text-sm font-medium text-fg-primary mb-1.5">
          Invite by email <span className="text-xs text-fg-quaternary">(Optional)</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail01 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
            <input
              type="email"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInviteEmail();
                }
              }}
              placeholder="colleague@company.com"
              disabled={isCreating}
              className="
                w-full pl-10 pr-4 py-2.5 rounded-lg
                bg-bg-secondary border border-border-secondary
                text-sm text-fg-primary placeholder:text-fg-quaternary
                focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-border-brand
                disabled:opacity-50
              "
            />
          </div>
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={handleAddInviteEmail}
            isDisabled={!inviteInput.trim() || !inviteInput.includes('@') || isCreating}
          >
            Add
          </Button>
        </div>

        {/* Invited emails list */}
        {inviteEmails.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {inviteEmails.map((email) => (
              <div
                key={email}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-tertiary border border-border-secondary text-xs text-fg-primary"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInviteEmail(email)}
                  className="text-fg-quaternary hover:text-fg-primary transition-colors"
                  aria-label={`Remove ${email}`}
                >
                  <XClose className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-secondary">
        <button
          type="button"
          onClick={() => setStep(1)}
          disabled={isCreating}
          className="text-sm text-fg-tertiary hover:text-fg-primary transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={() => handleCreateSpace([])}
            isDisabled={isCreating}
            isLoading={isCreating}
          >
            Skip
          </Button>
          <Button
            type="button"
            color="primary"
            size="md"
            onClick={() => handleCreateSpace(inviteEmails)}
            isLoading={isCreating}
            iconLeading={!isCreating ? Plus : undefined}
          >
            {isCreating ? 'Creating...' : 'Create Space'}
          </Button>
        </div>
      </div>
    </div>
  );

  // Tab button styles
  const tabStyles = (isActive: boolean) => `
    px-3 py-1.5 text-xs font-medium rounded-md transition-colors
    ${isActive 
      ? 'bg-bg-brand-primary text-fg-brand-primary' 
      : 'text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary'
    }
  `;

  return (
    <Modal
      {...devProps('CreateSpaceModal')}
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Create a Space' : 'Invite Members'}
      size="lg"
      showCloseButton={!isCreating}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`flex items-center gap-1.5 text-xs font-medium ${step === 1 ? 'text-fg-brand-primary' : 'text-fg-tertiary'}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? 'bg-fg-brand-primary text-white' : 'bg-bg-tertiary text-fg-tertiary'}`}>1</div>
          Details
        </div>
        <div className="flex-1 h-px bg-border-secondary" />
        <div className={`flex items-center gap-1.5 text-xs font-medium ${step === 2 ? 'text-fg-brand-primary' : 'text-fg-tertiary'}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? 'bg-fg-brand-primary text-white' : 'bg-bg-tertiary text-fg-tertiary'}`}>2</div>
          Invite
        </div>
      </div>

      {/* Step 2: Invite members */}
      {step === 2 && renderInviteStep()}

      {/* Step 1: Space details */}
      {step === 1 && <form onSubmit={handleStep1Submit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="space-title"
            className="block text-sm font-medium text-fg-primary"
          >
            Title <span className="text-fg-brand-primary">*</span>
          </label>
          <input
            id="space-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g., Marketing Research, Design System, Q4 Strategy"
            disabled={isCreating}
            className={`
              w-full px-4 py-2.5 rounded-lg
              bg-primary-alt
              border
              text-fg-primary placeholder:text-fg-placeholder
              focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-transparent
              transition-all duration-standard
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-disabled
              ${hasValidationError ? 'border-border-error' : 'border-border-primary'}
            `}
            autoFocus
          />
          {hasValidationError && (
            <div className="flex items-center gap-1.5 text-sm text-fg-error-primary">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Please enter a title for your space</span>
            </div>
          )}
        </div>

        {/* Description Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="space-description"
            className="block text-sm font-medium text-fg-primary"
          >
            Description <span className="text-xs text-fg-quaternary">(Optional)</span>
          </label>
          <textarea
            id="space-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this space for? Add context for AI and collaborators..."
            rows={3}
            disabled={isCreating}
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-primary-alt
              border border-border-primary
              text-fg-primary placeholder:text-fg-placeholder
              focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-transparent
              transition-all duration-standard
              resize-none
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-disabled
            "
          />
        </div>

        {/* Icon Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-fg-primary">
            Icon <span className="text-xs text-fg-quaternary">(Optional)</span>
          </label>
          
          {/* Tabs */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => { setIconTab('popular'); setIconSearch(''); }}
              className={tabStyles(iconTab === 'popular' && !iconSearch)}
              disabled={isCreating}
            >
              Popular
            </button>
            <button
              type="button"
              onClick={() => { setIconTab('brands'); setIconSearch(''); }}
              className={tabStyles(iconTab === 'brands' && !iconSearch)}
              disabled={isCreating}
            >
              Brands
            </button>
            <button
              type="button"
              onClick={() => { setIconTab('all'); setIconSearch(''); }}
              className={tabStyles(iconTab === 'all' && !iconSearch)}
              disabled={isCreating}
            >
              All Icons
            </button>
          </div>
          
          {/* Search input */}
          <div className="relative">
            <SearchLg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" aria-hidden="true" />
            <input
              type="text"
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              placeholder="Search icons... (try 'notion', 'slack', 'google')"
              aria-label="Search icons"
              disabled={isCreating}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-sm text-fg-primary placeholder-fg-placeholder focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-transparent transition-colors disabled:opacity-50"
            />
          </div>
          
          {/* Icon Grid */}
          <div 
            className="grid grid-cols-8 gap-2" 
            role="listbox" 
            aria-label="Available icons"
          >
            {displayedIcons.map((iconName) => {
              const isFA = isFontAwesomeIcon(iconName);
              const displayName = isFA ? iconName.replace('fa-', '').replace(/-/g, ' ') : iconName;
              
              return (
                <button
                  key={iconName}
                  type="button"
                  role="option"
                  aria-selected={selectedIcon === iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  title={displayName}
                  disabled={isCreating}
                  className={`
                    w-full aspect-square rounded-xl
                    flex items-center justify-center
                    transition-all duration-standard
                    focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:ring-offset-1
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${selectedIcon === iconName
                      ? 'bg-bg-brand-primary ring-1 ring-focus-ring text-fg-brand-primary'
                      : 'bg-bg-tertiary text-fg-tertiary hover:bg-bg-secondary hover:text-fg-primary'
                    }
                  `}
                  aria-label={`Select ${displayName} icon`}
                >
                  <Icon name={iconName} className="w-5 h-5" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          
          {displayedIcons.length === 0 && iconSearch && (
            <p className="text-center text-sm text-fg-tertiary py-4">
              No icons found for &ldquo;{iconSearch}&rdquo;
            </p>
          )}
          
          {/* Selected icon preview */}
          {selectedIcon && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-bg-tertiary">
              <div className="p-2 rounded-lg bg-bg-primary border border-border-primary">
                <Icon name={selectedIcon} className="w-5 h-5" />
              </div>
              <span className="text-sm text-fg-secondary">
                Selected: <span className="font-medium text-fg-primary">
                  {isFontAwesomeIcon(selectedIcon) 
                    ? selectedIcon.replace('fa-', '').replace(/-/g, ' ')
                    : selectedIcon
                  }
                </span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedIcon('')}
                disabled={isCreating}
                className="ml-auto text-xs text-fg-tertiary hover:text-fg-brand-primary transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-secondary">
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={handleClose}
            isDisabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            size="md"
          >
            Next: Invite Members
          </Button>
        </div>
      </form>}
    </Modal>
  );
}
