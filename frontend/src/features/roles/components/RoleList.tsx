import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { RoleFormSheet } from './RoleFormSheet';
import { useRoles, useDeleteRole } from '../hooks/useRoles';
import { formatDate } from '@/lib/formatters';
import type { Role } from '@/types/api';
import type { ColumnDef } from '@tanstack/react-table';

export function RoleList() {
  const { data: roles, isLoading, isError, refetch } = useRoles();
  const deleteMutation = useDeleteRole();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setFormOpen(true);
  };

  const handleDeleteRequest = (role: Role) => {
    setRoleToDelete(role);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteMutation.mutate(roleToDelete.id, {
        onSuccess: () => setDeleteOpen(false),
      });
    }
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Role Name',
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
        title="Failed to load roles" 
        description="There was an error communicating with the server."
        onRetry={() => refetch()} 
      />
    );
  }

  const showEmpty = !isLoading && (!roles || roles.length === 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
         <Button onClick={handleCreate}>Add Role</Button>
      </div>
      
      {showEmpty ? (
        <EmptyState 
          title="No roles found" 
          description="Create your first role to get started." 
          action={<Button onClick={handleCreate}>Add Role</Button>}
        />
      ) : (
        <DataTable
          columns={columns}
          data={roles ?? []}
          isLoading={isLoading}
        />
      )}

      <RoleFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        role={selectedRole}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Role"
        description={`Are you sure you want to delete the "${roleToDelete?.name}" role? This action cannot be undone.`}
        confirmLabel="Delete"
        isPending={deleteMutation.isPending}
        destructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
