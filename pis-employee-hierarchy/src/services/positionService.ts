import api from '@/lib/axios';
import { Position, CreatePositionPayload, UpdatePositionPayload } from '@/types/position';

export const positionService = {
  getAll: () => api.get<Position[]>('/positions').then((r) => r.data),
  getTree: () => api.get<Position[]>('/positions/tree').then((r) => r.data),
  getOne: (id: string) => api.get<Position>(`/positions/${id}`).then((r) => r.data),
  getChildren: (id: string) => api.get<Position[]>(`/positions/${id}/children`).then((r) => r.data),
  create: (data: CreatePositionPayload) => api.post<Position>('/positions', data).then((r) => r.data),
  update: (id: string, data: UpdatePositionPayload) => api.put<Position>(`/positions/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/positions/${id}`),
};
