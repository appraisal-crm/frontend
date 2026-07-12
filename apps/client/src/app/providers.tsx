import { AuthProvider } from '@appraisal/auth';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { config } from '../lib/config';
import { queryClient } from '../lib/queryClient';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider config={{ authority: config.keycloakAuthority, clientId: config.keycloakClientId }}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
