import type { Inspection } from '@appraisal/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../lib/useApi';

const INSPECTIONS_KEY = ['office', 'inspections'] as const;

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

export function useCompleteInspection() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.inspections.complete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: INSPECTIONS_KEY }),
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
