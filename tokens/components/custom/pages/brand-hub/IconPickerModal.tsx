'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/custom/shared/overlays/Modal';
import { Icon } from '@/components/custom/shared/branding/Icon';
import { SearchLg, Upload01 } from '@untitledui-pro/icons/line';
import {
  getAllUUIIconNames,
  FA_BRAND_ICONS,
  POPULAR_ICONS,
  isFontAwesomeIcon
} from '@/lib/icons';
import { devProps } from '@/lib/utils/dev-props';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  onUploadIcon?: (file: File) => void;
}

export function IconPickerModal({
  isOpen,
  onClose,
  onSelectIcon,
  onUploadIcon,
}: IconPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Get all UUI icons once (Lucide-compat keys)
  const allUUIIcons = useMemo(() => getAllUUIIconNames(), []);

  // Get displayed icons based on search - always show popular icons or search results
  const filteredIcons = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      // When searching, search both UUI and FA icons
      const uuiMatches = allUUIIcons.filter(n =>
        n.toLowerCase().includes(query)
      );
      const faMatches = FA_BRAND_ICONS.filter(icon =>
        icon.name.toLowerCase().includes(query) ||
        icon.keywords.some(k => k.includes(query))
      ).map(i => i.name);

      // Show FA matches first (they're usually what people want for brands)
      return [...faMatches, ...uuiMatches].slice(0, 60);
    }

    // Default: show popular icons (FA brands + common UUI icons)
    return [...POPULAR_ICONS.fontAwesome, ...POPULAR_ICONS.lucide];
  }, [searchQuery, allUUIIcons]);

  const handleIconClick = (iconName: string) => {
    onSelectIcon(iconName);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadIcon) {
      onUploadIcon(file);
      onClose();
    }
  };

  // Limit to 3 rows based on responsive grid
  const maxIcons = 18; // 6 cols on desktop, 4 on tablet, 3-4 on mobile = 3 rows

  return (
    <Modal {...devProps('IconPickerModal')} isOpen={isOpen} onClose={onClose} title="Choose an Icon" size="md">
      {/* Search */}
      <div className="relative mb-3">
        <SearchLg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons... (try 'notion', 'slack', 'google')"
          aria-label="Search icons"
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-sm text-fg-primary placeholder-fg-placeholder focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:border-transparent transition-colors"
        />
      </div>

      {/* Icon Grid - Fixed to 3 rows, responsive columns */}
      <div className="overflow-y-auto custom-scrollbar">
        <div
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2"
          role="listbox"
          aria-label="Available icons"
        >
          {filteredIcons.slice(0, maxIcons).map((iconName) => {
            const isFA = isFontAwesomeIcon(iconName);
            const displayName = isFA
              ? iconName.replace('fa-', '').replace(/-/g, ' ')
              : iconName;

            return (
              <button
                key={iconName}
                onClick={() => handleIconClick(iconName)}
                title={displayName}
                role="option"
                aria-label={`Select ${displayName} icon`}
                className="aspect-square p-3 rounded-lg bg-bg-tertiary hover:bg-bg-brand-primary hover:border-border-brand-solid border border-transparent transition-all flex items-center justify-center text-fg-primary hover:text-fg-brand-primary focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring focus:ring-offset-1"
              >
                <Icon name={iconName} className="w-5 h-5" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <p className="text-center text-fg-tertiary py-8">
            No icons found for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* Upload section */}
      {onUploadIcon && (
        <div className="mt-3 pt-3 border-t border-border-secondary">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-fg-secondary hover:text-fg-primary transition-colors">
            <Upload01 className="w-4 h-4" aria-hidden="true" />
            Upload custom icon
            <input
              type="file"
              accept="image/svg+xml,image/png,image/jpeg"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </Modal>
  );
}
