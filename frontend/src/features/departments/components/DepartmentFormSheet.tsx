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
import { departmentSchema, type DepartmentValues } from '../schemas/department.schema';
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments';
import type { Department } from '@/types/api';

interface DepartmentFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
}

export function DepartmentFormSheet({ open, onOpenChange, department }: DepartmentFormSheetProps) {
  const isEditing = !!department;
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when sheet opens or department changes
  useEffect(() => {
    if (open) {
      reset({ name: department?.name || '' });
    }
  }, [open, department, reset]);

  const onSubmit = (values: DepartmentValues) => {
    if (isEditing && department) {
      updateMutation.mutate(
        { id: department.id, payload: values },
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
          <SheetTitle>{isEditing ? 'Edit Department' : 'Add Department'}</SheetTitle>
          <SheetDescription>
            {isEditing 
              ? 'Update the details of the department here.' 
              : 'Create a new department here.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col justify-between py-6">
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.name} data-disabled={isPending}>
                  <FieldLabel htmlFor="name">Department Name</FieldLabel>
                  <Input 
                    id="name" 
                    placeholder="e.g. Engineering" 
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
