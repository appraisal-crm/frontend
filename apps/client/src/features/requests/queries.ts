import type { CreateRequestInput } from '@appraisal/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../lib/useApi';

const REQUESTS_KEY = ['requests'] as const;

export function useMyRequests() {
  const api = useApi();
  return useQuery({
    queryKey: REQUESTS_KEY,
    queryFn: () => api.requests.list(),
  });
}

export function useCreateRequest() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRequestInput) => api.requests.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: REQUESTS_KEY }),
  });
}
