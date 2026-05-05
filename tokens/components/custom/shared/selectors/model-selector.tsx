'use client';

import { useState, useRef, useEffect, type ComponentType, type SVGProps } from 'react';
import {
  Check,
  ChevronDown,
  Route,
} from '@untitledui-pro/icons/line';
import { ClaudeLogo, PerplexityLogo } from '@/components/custom/shared/branding/provider-icons';
import { devProps } from '@/lib/utils/dev-props';
import { models, ModelId, ModelConfig } from '@/lib/ai/providers';

// Provider icons: official logos for Claude/Perplexity, Route for auto-routing
function getProviderIcon(provider: 'anthropic' | 'perplexity' | 'auto'): ComponentType<SVGProps<SVGSVGElement>> {
  // Type assertion needed: UUI icon package bundles its own React types that conflict
  // with @types/react, causing "two different types with this name exist" errors.
  switch (provider) {
    case 'anthropic':
      return ClaudeLogo as unknown as ComponentType<SVGProps<SVGSVGElement>>;
    case 'perplexity':
      return PerplexityLogo as unknown as ComponentType<SVGProps<SVGSVGElement>>;
    case 'auto':
      return Route as unknown as ComponentType<SVGProps<SVGSVGElement>>;
    default:
      return Route as unknown as ComponentType<SVGProps<SVGSVGElement>>;
  }
}

interface ModelSelectorProps {
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
  disabled?: boolean;
}

export function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ right?: number; left?: number; maxWidth?: number }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentModel = models[selectedModel];
  
  const displayName = currentModel.version 
    ? `${currentModel.name} ${currentModel.version}` 
    : currentModel.name;

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const calculatePosition = () => {
      const button = buttonRef.current;
      if (!button) return;

      const buttonRect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const isMobileOrTablet = viewportWidth < 1024;

      if (isMobileOrTablet) {
        const formContainer = button.closest('form');
        if (formContainer) {
          const containerRect = formContainer.getBoundingClientRect();
          const rightOffset = buttonRect.right - containerRect.right;
          const dropdownMaxWidth = Math.min(containerRect.width, 280);
          
          setPosition({ 
            right: rightOffset, 
            left: undefined,
            maxWidth: dropdownMaxWidth
          });
        } else {
          const containerPadding = 16;
          setPosition({ 
            right: 0, 
            left: undefined,
            maxWidth: Math.min(viewportWidth - (containerPadding * 2), 280)
          });
        }
      } else {
        setPosition({ left: 0, right: undefined, maxWidth: 256 });
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const allModels = Object.values(models);

  return (
    <div {...devProps('ModelSelector')} ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-1 px-2 py-1 rounded-md text-xs
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bg-tertiary cursor-pointer'}
          ${
            isOpen
              ? 'bg-bg-tertiary text-fg-primary'
              : 'text-fg-tertiary hover:text-fg-primary'
          }
        `}
      >
        <span className="font-medium">{displayName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-full mb-2 bg-bg-secondary rounded-xl border border-border-primary shadow-xl overflow-hidden z-50 lg:w-64"
          style={{
            right: position.right !== undefined ? position.right : undefined,
            left: position.left !== undefined ? position.left : undefined,
            width: position.maxWidth !== undefined ? position.maxWidth : undefined,
          }}
        >
          <div className="py-2">
            {allModels.map((model: ModelConfig) => {
              const isSelected = model.id === selectedModel;
              const nameWithVersion = model.version 
                ? `${model.name} ${model.version}` 
                : model.name;
              const Icon = getProviderIcon(model.provider);

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className="group w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-150 hover:bg-bg-tertiary"
                >
                  <Icon className="w-4 h-4 text-fg-quaternary group-hover:text-fg-tertiary transition-colors flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
                      {nameWithVersion}
                    </span>
                    <p className="text-xs text-fg-quaternary mt-0.5 truncate">
                      {model.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-fg-brand-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
