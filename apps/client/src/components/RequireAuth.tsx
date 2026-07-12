import { useAuth } from '@appraisal/auth';
import type { ReactNode } from 'react';
import { SignInScreen } from './SignInScreen';
import { Splash } from './Splash';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <Splash />;
  if (!isAuthenticated) return <SignInScreen />;
  return <>{children}</>;
}
