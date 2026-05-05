'use client';

import { useAuth } from '@/lib/auth';
import { devProps } from '@/lib/utils/dev-props';

interface AdminOnlyProps {
  /** Content to render when user is admin */
  children: React.ReactNode;
  /** Optional fallback for non-admins (default: null) */
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children only for authenticated users.
 *
 * Static prototype — all authenticated users are full admins (Open Session
 * has only karim and morgan, both owners). Rendering gates on authentication only.
 *
 * Usage:
 * ```tsx
 * <AdminOnly>
 *   <Button>Edit</Button>
 * </AdminOnly>
 * ```
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return (
    <span {...devProps('AdminOnly')}>
      {children}
    </span>
  );
}
