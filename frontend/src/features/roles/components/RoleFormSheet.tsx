import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { roleSchema, type RoleValues } from '../schemas/role.schema';
import { useCreateRole, useUpdateRole } from '../hooks/useRoles';
import type { Role } from '@/types/api';

interface RoleFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}

export function RoleFormSheet({ open, onOpenChange, role }: RoleFormSheetProps) {
  const isEditing = !!role;
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when sheet opens or role changes
  useEffect(() => {
    if (open) {
      reset({ name: role?.name || '' });
    }
  }, [open, role, reset]);

  const onSubmit = (values: RoleValues) => {
    if (isEditing && role) {
      updateMutation.mutate(
        { id: role.id, payload: values },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Role' : 'Add Role'}</SheetTitle>
          <SheetDescription>
            {isEditing 
              ? 'Update the details of the role here.' 
              : 'Create a new role here.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col justify-between py-6">
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.name} data-disabled={isPending}>
                  <FieldLabel htmlFor="name">Role Name</FieldLabel>
                  <Input 
                    id="name" 
                    placeholder="e.g. Software Engineer" 
                    aria-invalid={!!errors.name}
                    disabled={isPending}
                    {...field} 
                  />
                  <FieldError errors={[errors.name]} />
                </Field>
              )}
            />
          </FieldGroup>

          <SheetFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              Save
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
