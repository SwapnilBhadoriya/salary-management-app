import { apiClient } from './client';
import type { Role, CreateRolePayload, UpdateRolePayload } from '@/types/api';

export const rolesApi = {
  list: async (): Promise<Role[]> => {
    return apiClient.get<unknown, Role[]>('/roles');
  },

  get: async (id: string): Promise<Role> => {
    return apiClient.get<unknown, Role>(`/roles/${id}`);
  },

  create: async (payload: CreateRolePayload): Promise<Role> => {
    return apiClient.post<unknown, Role>('/roles', payload);
  },

  update: async (id: string, payload: UpdateRolePayload): Promise<Role> => {
    return apiClient.patch<unknown, Role>(`/roles/${id}`, payload);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<unknown, void>(`/roles/${id}`);
  },
};
