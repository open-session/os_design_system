'use client';

import React from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { captureException } from '@/lib/monitoring/sentry';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional feature name for Sentry context (e.g., "brand-hub", "brain") */
  feature?: string;
  /** Optional custom fallback to render instead of the default error card */
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable React Error Boundary.
 *
 * Catches rendering errors in its children subtree, reports them to Sentry,
 * and shows a clean fallback UI with a retry button.
 *
 * Usage:
 *   <ErrorBoundary feature="brand-hub">
 *     <BrandHubContent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    captureException(error, {
      feature: this.props.feature,
      context: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return <div {...devProps('ErrorBoundary')}>{fallback}</div>;
      }

      return (
        <div
          {...devProps('ErrorBoundary')}
          className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-border-secondary bg-bg-secondary p-6"
        >
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <h2 className="text-base font-medium text-fg-primary">
              Something went wrong
            </h2>
            <p className="text-sm text-fg-secondary">
              {this.props.feature
                ? `An error occurred in ${this.props.feature}. `
                : ''}
              Please try again or refresh the page.
            </p>
            {process.env.NODE_ENV === 'development' && error && (
              <pre className="mt-2 max-w-full overflow-auto rounded bg-bg-primary p-3 text-left text-xs text-fg-secondary">
                {error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="mt-2 rounded-md border border-border-secondary bg-bg-primary px-4 py-2 text-sm font-medium text-fg-primary transition-colors hover:bg-bg-secondary"
              type="button"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
