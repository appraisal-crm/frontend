import type { AppraisalStatus, InspectionStatus, ObjectType, RequestStatus } from './types';

/** Strictly-linear request pipeline, in order. */
export const requestStatusOrder: RequestStatus[] = [
  'new',
  'in_progress',
  'inspection_scheduled',
  'inspection_completed',
  'appraisal',
  'report_sent',
  'closed',
];

export const requestStatusLabels: Record<RequestStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  inspection_scheduled: 'Осмотр назначен',
  inspection_completed: 'Осмотр завершён',
  appraisal: 'Оценка',
  report_sent: 'Отчёт отправлен',
  closed: 'Закрыта',
};

/** Short labels for the pipeline rail. */
export const requestStageLabels: Record<RequestStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  inspection_scheduled: 'Осмотр назн.',
  inspection_completed: 'Осмотр готов',
  appraisal: 'Оценка',
  report_sent: 'Отчёт',
  closed: 'Закрыта',
};

export function requestStatusIndex(status: RequestStatus): number {
  return requestStatusOrder.indexOf(status);
}

export function nextRequestStatus(status: RequestStatus): RequestStatus | null {
  const i = requestStatusIndex(status);
  return i >= 0 && i < requestStatusOrder.length - 1 ? requestStatusOrder[i + 1]! : null;
}

export const objectTypeLabels: Record<ObjectType, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  land: 'Земельный участок',
  commercial: 'Коммерческая',
  car: 'Автомобиль',
};

export const inspectionStatusLabels: Record<InspectionStatus, string> = {
  scheduled: 'Назначен',
  completed: 'Завершён',
};

export const appraisalStatusLabels: Record<AppraisalStatus, string> = {
  in_progress: 'В работе',
  completed: 'Завершена',
};
