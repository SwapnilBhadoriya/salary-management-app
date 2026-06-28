import { apiClient } from './client';
import type { Department, CreateDepartmentPayload, UpdateDepartmentPayload } from '@/types/api';

export const departmentsApi = {
  list: async (): Promise<Department[]> => {
    return apiClient.get<unknown, Department[]>('/departments');
  },

  get: async (id: string): Promise<Department> => {
    return apiClient.get<unknown, Department>(`/departments/${id}`);
  },

  create: async (payload: CreateDepartmentPayload): Promise<Department> => {
    return apiClient.post<unknown, Department>('/departments', payload);
  },

  update: async (id: string, payload: UpdateDepartmentPayload): Promise<Department> => {
    return apiClient.patch<unknown, Department>(`/departments/${id}`, payload);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<unknown, void>(`/departments/${id}`);
  },
};
