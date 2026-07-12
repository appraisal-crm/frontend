import { nextRequestStatus, type AppraisalRequest } from '@appraisal/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../lib/useApi';

const REQUESTS_KEY = ['office', 'requests'] as const;

export function useRequests() {
  const api = useApi();
  return useQuery({
    queryKey: REQUESTS_KEY,
    queryFn: () => api.requests.list(),
  });
}

export function useAdvanceStatus() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (request: AppraisalRequest) => {
      const next = nextRequestStatus(request.status);
      if (!next) return Promise.reject(new Error('Заявка уже на финальной стадии'));
      return api.requests.changeStatus(request.id, next);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: REQUESTS_KEY }),
  });
}
