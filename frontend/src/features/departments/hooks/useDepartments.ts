import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '@/api/departments';
import { departmentKeys } from './queryKeys';
import { toast } from 'sonner';

export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.list(),
    queryFn: departmentsApi.list,
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('Department created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create department');
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof departmentsApi.update>[1] }) =>
      departmentsApi.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('Department updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update department');
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('Department deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete department');
    },
  });
}
