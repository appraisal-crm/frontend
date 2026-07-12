import type { Inspection, UpdateInspectionInput } from '@appraisal/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../lib/useApi';

const INSPECTIONS_KEY = ['office', 'inspections'] as const;
const inspectionKey = (id: string) => ['office', 'inspection', id] as const;

export function useInspections() {
  const api = useApi();
  return useQuery({
    queryKey: INSPECTIONS_KEY,
    queryFn: async (): Promise<Inspection[]> => {
      const res = await api.inspections.list();
      return Array.isArray(res) ? res : res.data;
    },
  });
}

export function useInspection(id: string) {
  const api = useApi();
  return useQuery({
    queryKey: inspectionKey(id),
    queryFn: () => api.inspections.get(id),
  });
}

export function useUpdateInspection(id: string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateInspectionInput) => api.inspections.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(inspectionKey(id), updated);
      void qc.invalidateQueries({ queryKey: INSPECTIONS_KEY });
    },
  });
}

export function useAddPhoto(id: string) {
  const api = useApi();
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await api.inspections.addPhoto(id, file.name);
      // The bytes go straight to object storage via the presigned URL; with the
      // S3 stub this PUT fails — the photo row still exists, so surface both states.
      let uploaded = false;
      try {
        const put = await fetch(res.upload_url, { method: 'PUT', body: file });
        uploaded = put.ok;
      } catch {
        uploaded = false;
      }
      return { ...res, uploaded };
    },
  });
}

export function useCompleteInspection() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.inspections.complete(id),
    onSuccess: (updated, id) => {
      qc.setQueryData(inspectionKey(id), updated);
      void qc.invalidateQueries({ queryKey: INSPECTIONS_KEY });
    },
  });
}

export function useAssignInspector() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, inspectorId }: { id: string; inspectorId: string }) =>
      api.inspections.update(id, { inspector_id: inspectorId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: INSPECTIONS_KEY }),
  });
}
