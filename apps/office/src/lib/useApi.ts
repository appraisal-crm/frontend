import { createApiClient, type ApiClient } from '@appraisal/api-client';
import { useAuth } from '@appraisal/auth';
import { useMemo } from 'react';
import { config } from './config';

/** An API client bound to the current session's bearer token. */
export function useApi(): ApiClient {
  const { getToken } = useAuth();
  return useMemo(
    () =>
      createApiClient({
        requestApiUrl: config.requestApiUrl,
        inspectApiUrl: config.inspectApiUrl,
        reviewApiUrl: config.reviewApiUrl,
        getToken,
      }),
    [getToken],
  );
}
