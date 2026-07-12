import { useAuth } from '@appraisal/auth';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export function RequireRole({ anyOf, children }: { anyOf: string[]; children: ReactNode }) {
  const { roles } = useAuth();
  const allowed = anyOf.some((r) => roles.includes(r));
  if (!allowed) return <Navigate to="/forbidden" replace />;
  return <>{children}</>;
}
