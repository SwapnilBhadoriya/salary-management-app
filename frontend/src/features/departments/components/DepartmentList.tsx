import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DepartmentFormSheet } from './DepartmentFormSheet';
import { useDepartments, useDeleteDepartment } from '../hooks/useDepartments';
import { formatDate } from '@/lib/formatters';
import type { Department } from '@/types/api';
import type { ColumnDef } from '@tanstack/react-table';

export function DepartmentList() {
  const { data: departments, isLoading, isError, refetch } = useDepartments();
  const deleteMutation = useDeleteDepartment();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setFormOpen(true);
  };

  const handleDeleteRequest = (department: Department) => {
    setDepartmentToDelete(department);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteMutation.mutate(departmentToDelete.id, {
        onSuccess: () => setDeleteOpen(false),
      });
    }
  };

  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: 'name',
      header: 'Department Name',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created On',
      cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <Pencil className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(row.original)}>
            <Trash2 className="size-4 text-destructive" aria-hidden="true" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <ErrorState 
        title="Failed to load departments" 
        description="There was an error communicating with the server."
        onRetry={() => refetch()} 
      />
    );
  }

  // Handle empty state gracefully
  const showEmpty = !isLoading && (!departments || departments.length === 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
         <Button onClick={handleCreate}>Add Department</Button>
      </div>
      
      {showEmpty ? (
        <EmptyState 
          title="No departments found" 
          description="Create your first department to get started." 
          action={<Button onClick={handleCreate}>Add Department</Button>}
        />
      ) : (
        <DataTable
          columns={columns}
          data={departments ?? []}
          isLoading={isLoading}
        />
      )}

      {/* Forms and Dialogs */}
      <DepartmentFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        department={selectedDepartment}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Department"
        description={`Are you sure you want to delete the "${departmentToDelete?.name}" department? This action cannot be undone.`}
        confirmLabel="Delete"
        isPending={deleteMutation.isPending}
        destructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
