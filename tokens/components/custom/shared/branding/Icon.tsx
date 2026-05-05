'use client';

/**
 * Unified Icon Component
 *
 * Renders both UUI icons and Font Awesome brand icons.
 * - UUI icons: Use Lucide-compat PascalCase names like "Globe", "Settings"
 *   (looked up via UUI_ICON_REGISTRY which is keyed by Lucide names for backward compat)
 * - Font Awesome: Use fa- prefix like "fa-anthropic", "fa-google-drive"
 */

import React from 'react';
import { Link01 } from '@untitledui-pro/icons/line';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UUI_ICON_REGISTRY } from '@/lib/icon-map';
import { isFontAwesomeIcon, getFAIconByName, getFAIconObjectByName } from '@/lib/icons';
import { devProps } from '@/lib/utils/dev-props';

interface IconProps {
  /** Icon name - either UUI/Lucide-compat (PascalCase) or Font Awesome (fa-prefix) */
  name: string;
  /** CSS classes for sizing and styling */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/**
 * Renders an icon from either UUI (via Lucide-compat name) or Font Awesome library
 *
 * UUI_ICON_REGISTRY is keyed by Lucide PascalCase names (e.g., "Globe", "Settings"),
 * so existing code and database-stored icon names continue working without changes.
 *
 * @example
 * // UUI icon via Lucide-compat name (backward compat)
 * <Icon name="Globe" className="w-5 h-5" />
 *
 * // Font Awesome brand icon
 * <Icon name="fa-anthropic" className="w-5 h-5" />
 */
export function Icon({ name, className = 'w-5 h-5', 'aria-label': ariaLabel }: IconProps) {
  // Font Awesome brand icons (including custom SVGs)
  if (isFontAwesomeIcon(name)) {
    const faIconObject = getFAIconObjectByName(name);

    // Custom SVG icon (e.g., Anthropic)
    if (faIconObject?.customSvg) {
      return (
        <span
          {...devProps('Icon')}
          className={className}
          dangerouslySetInnerHTML={{ __html: faIconObject.customSvg }}
          aria-label={ariaLabel}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        />
      );
    }

    // Regular Font Awesome icon
    const faIcon = getFAIconByName(name);
    if (faIcon) {
      return (
        <FontAwesomeIcon
          {...devProps('Icon')}
          icon={faIcon}
          className={className}
          aria-label={ariaLabel}
        />
      );
    }

    // Fallback to Link01 if FA icon not found
    return <Link01 {...devProps('Icon')} className={className} aria-label={ariaLabel} />;
  }

  // UUI icons — resolve via registry (keyed by Lucide-compat PascalCase names)
  // Supports both new code passing Lucide names and DB-stored legacy names.
  const UUIComponent = UUI_ICON_REGISTRY[name];

  if (UUIComponent) {
    return <UUIComponent {...devProps('Icon')} className={className} aria-label={ariaLabel} />;
  }

  // Fallback for unknown icon names
  return <Link01 {...devProps('Icon')} className={className} aria-label={ariaLabel} />;
}

/**
 * Preview component showing the icon with its name
 */
// eslint-disable-next-line bos-local/require-dev-props -- delegates to Icon component
export function IconPreview({
  name,
  size = 'md'
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return <Icon name={name} className={sizeClasses[size]} />;
}

export default Icon;
