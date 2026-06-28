/**
 * components/shared/ConfirmDialog.tsx
 *
 * Reusable confirmation dialog for destructive actions (delete, deactivate).
 * Wraps shadcn AlertDialog.
 *
 * shadcn skill rules:
 *   - AlertDialog always needs AlertDialogTitle (accessibility)
 *   - Button has no isPending prop — compose with disabled + visual indicator
 *   - No manual z-index — AlertDialog handles its own stacking
 *
 * Vercel skill:
 *   - rendering-conditional-render: ternary not && for conditional JSX
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  /** If true, the confirm button renders in destructive (danger) styling */
  destructive?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isPending = false,
  destructive = true,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Title is required for accessibility — shadcn composition rule */}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              destructive &&
                'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            )}
          >
            {/* Compose loading state — Button has no isPending prop (shadcn rule) */}
            {isPending
              ? <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              : null}
            {isPending ? 'Processing…' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
