import type { Appraisal, UpdateAppraisalInput } from '@appraisal/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../lib/useApi';

const APPRAISALS_KEY = ['office', 'appraisals'] as const;
const appraisalKey = (id: string) => ['office', 'appraisal', id] as const;

export function useAppraisals() {
  const api = useApi();
  return useQuery({
    queryKey: APPRAISALS_KEY,
    queryFn: async (): Promise<Appraisal[]> => {
      const res = await api.appraisals.list();
      return Array.isArray(res) ? res : res.data;
    },
  });
}

export function useAppraisal(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: appraisalKey(id),
    queryFn: () => api.appraisals.get(id),
  });
}

/** The appraisal of a request (null until the consumer creates it) — for cross-links. */
export function useAppraisalOfRequest(requestId: string, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: ['office', 'appraisal-of-request', requestId] as const,
    queryFn: () => api.appraisals.getByRequest(requestId),
    enabled,
  });
}

export function useUpdateAppraisal(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAppraisalInput) => api.appraisals.update(id, input),
    onSuccess: (updated) => {
      // PATCH responds without comparables — keep the ones already in the cache.
      qc.setQueryData(appraisalKey(id), (prev: Appraisal | undefined) => ({
        ...updated,
        comparables: prev?.comparables ?? updated.comparables,
      }));
      void qc.invalidateQueries({ queryKey: APPRAISALS_KEY });
    },
  });
}

export function useTakeAppraisal() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, appraiserId }: { id: string; appraiserId: string }) =>
      api.appraisals.update(id, { appraiser_id: appraiserId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: APPRAISALS_KEY }),
  });
}

export function useAddComparable(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.appraisals.addComparable(id, data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: appraisalKey(id) }),
  });
}

export function useDeleteComparable(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (comparableId: string) => api.appraisals.deleteComparable(id, comparableId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: appraisalKey(id) }),
  });
}

export function useUploadReport(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await api.appraisals.uploadReport(id, file.name);
      // The bytes go straight to object storage via the presigned URL; with the
      // S3 stub this PUT fails — the key is still stored, so surface both states.
      let uploaded = false;
      try {
        const put = await fetch(res.upload_url, { method: 'PUT', body: file });
        uploaded = put.ok;
      } catch {
        uploaded = false;
      }
      return { ...res, uploaded };
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: appraisalKey(id) }),
  });
}

export function useCompleteAppraisal() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.appraisals.complete(id),
    onSuccess: (updated, id) => {
      qc.setQueryData(appraisalKey(id), (prev: Appraisal | undefined) => ({
        ...updated,
        comparables: prev?.comparables ?? updated.comparables,
      }));
      void qc.invalidateQueries({ queryKey: APPRAISALS_KEY });
    },
  });
}
