export * from './types';
export * from './status';

import type {
  AddPhotoResponse,
  AppraisalRequest,
  CreateRequestInput,
  Inspection,
  RequestStatus,
  UpdateInspectionInput,
} from './types';

export interface ApiClientConfig {
  requestApiUrl: string;
  inspectApiUrl: string;
  /** Returns the current bearer token, or undefined when logged out. */
  getToken: () => string | undefined;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API error ${status}`);
    this.name = 'ApiError';
  }
}

function makeRequest(baseUrl: string, getToken: () => string | undefined) {
  return async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = getToken();
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? (JSON.parse(text) as unknown) : undefined;
    if (!res.ok) throw new ApiError(res.status, data);
    return data as T;
  };
}

export interface ApiClient {
  requests: {
    create: (input: CreateRequestInput) => Promise<AppraisalRequest>;
    list: () => Promise<AppraisalRequest[]>;
    get: (id: string) => Promise<AppraisalRequest>;
    changeStatus: (id: string, status: RequestStatus) => Promise<AppraisalRequest>;
    update: (id: string, fields: Partial<Pick<AppraisalRequest, 'object_type' | 'address'>>) => Promise<AppraisalRequest>;
  };
  inspections: {
    list: () => Promise<Inspection[] | { data: Inspection[] }>;
    get: (id: string) => Promise<Inspection>;
    update: (id: string, input: UpdateInspectionInput) => Promise<Inspection>;
    addPhoto: (id: string, filename: string) => Promise<AddPhotoResponse>;
    complete: (id: string) => Promise<Inspection>;
  };
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const reqApi = makeRequest(config.requestApiUrl, config.getToken);
  const inspApi = makeRequest(config.inspectApiUrl, config.getToken);

  return {
    requests: {
      create: (input) => reqApi('POST', '/requests', input),
      // request-service returns a bare array for clients but a paginated
      // envelope for appraiser/admin — normalise to an array either way.
      list: async () => {
        const res = await reqApi<AppraisalRequest[] | { data: AppraisalRequest[] }>('GET', '/requests');
        return Array.isArray(res) ? res : res.data;
      },
      get: (id) => reqApi('GET', `/requests/${id}`),
      changeStatus: (id, status) => reqApi('PATCH', `/requests/${id}/status`, { status }),
      update: (id, fields) => reqApi('PATCH', `/requests/${id}`, fields),
    },
    inspections: {
      list: () => inspApi('GET', '/inspections'),
      get: (id) => inspApi('GET', `/inspections/${id}`),
      update: (id, input) => inspApi('PATCH', `/inspections/${id}`, input),
      addPhoto: (id, filename) => inspApi('POST', `/inspections/${id}/photos`, { filename }),
      complete: (id) => inspApi('POST', `/inspections/${id}/complete`),
    },
  };
}
