'use client';

import { useCallback } from 'react';
import { XClose } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  Modal as AriaModal,
  ModalOverlay,
  Heading,
} from 'react-aria-components';
import { devProps } from '@/lib/utils/dev-props';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

/**
 * Modal component built on React Aria for accessibility
 * Untitled UI design system integration
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <ModalOverlay
      {...devProps('Modal')}
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className={({ isEntering, isExiting }) =>
        cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'bg-bg-overlay backdrop-blur-sm',
          isEntering && 'animate-in fade-in-0 duration-standard',
          isExiting && 'animate-out fade-out-0 duration-quick'
        )
      }
    >
      <AriaModal
        className={({ isEntering, isExiting }) =>
          cn(
            'relative w-full rounded-xl',
            'bg-bg-secondary border border-border-secondary',
            'shadow-2xl',
            'max-h-[90vh] overflow-hidden flex flex-col',
            'outline-hidden',
            sizeClasses[size],
            isEntering && 'animate-in fade-in-0 zoom-in-95 duration-standard',
            isExiting && 'animate-out fade-out-0 zoom-out-95 duration-quick'
          )
        }
      >
        <Dialog className="outline-hidden flex flex-col max-h-[90vh]">
          {({ close }) => (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-secondary flex-shrink-0">
                <Heading
                  slot="title"
                  className="text-xl font-display font-semibold text-fg-primary"
                >
                  {title}
                </Heading>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring"
                    aria-label="Close modal"
                  >
                    <XClose className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Body - scrollable */}
              <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1">
                {children}
              </div>
            </>
          )}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  );
}

// Re-export Dialog components for advanced usage
export { DialogTrigger, Dialog, ModalOverlay, AriaModal };

// Confirmation modal variant
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

// eslint-disable-next-line bos-local/require-dev-props -- delegates to Modal component
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmModalProps) {
  const variantClasses = {
    danger: 'bg-bg-error-solid hover:bg-bg-error-solid-hover text-fg-white',
    warning: 'bg-bg-warning-solid hover:bg-bg-warning-solid-hover text-fg-white',
    default: 'bg-bg-brand-solid hover:bg-bg-brand-solid-hover text-fg-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-base text-fg-secondary mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-lg text-base font-medium text-fg-primary bg-bg-tertiary hover:bg-bg-quaternary transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            'px-4 py-2.5 rounded-lg text-base font-medium transition-colors disabled:opacity-50',
            variantClasses[variant]
          )}
        >
          {isLoading ? 'Loading...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
