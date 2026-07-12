// Hand-written DTOs mirroring the services' contracts. When the backend swagger is
// stable these can be generated from request-service/inspect-service swagger.json.

export type RequestStatus =
  | 'new'
  | 'in_progress'
  | 'inspection_scheduled'
  | 'inspection_completed'
  | 'appraisal'
  | 'report_sent'
  | 'closed';

export type ObjectType = 'apartment' | 'house' | 'land' | 'commercial' | 'car';

export interface AppraisalRequest {
  id: string;
  client_id: string;
  email: string;
  phone_number: string;
  object_type?: ObjectType;
  address?: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestInput {
  email: string;
  phone_number: string;
  object_type?: ObjectType;
  address?: string;
}

export type InspectionStatus = 'scheduled' | 'completed';

export interface Photo {
  id: string;
  inspection_id: string;
  object_key: string;
  created_at: string;
}

export interface Inspection {
  id: string;
  request_id: string;
  inspector_id: string | null;
  status: InspectionStatus;
  notes: string | null;
  property_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateInspectionInput {
  inspector_id?: string;
  notes?: string;
  property_data?: Record<string, unknown>;
}

export interface AddPhotoResponse {
  photo: Photo;
  upload_url: string;
}

export type AppraisalStatus = 'in_progress' | 'completed';

export interface Comparable {
  id: string;
  appraisal_id: string;
  /** Free-form analog data — the field set is not formalized yet (R-001). */
  data: Record<string, unknown>;
  created_at: string;
}

export interface Appraisal {
  id: string;
  request_id: string;
  appraiser_id: string | null;
  status: AppraisalStatus;
  notes: string | null;
  /** NUMERIC as string — no float rounding. */
  market_value: string | null;
  report_s3_key: string | null;
  comparables?: Comparable[];
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateAppraisalInput {
  appraiser_id?: string;
  notes?: string;
  market_value?: string;
}

export interface UploadReportResponse {
  s3_key: string;
  upload_url: string;
}
