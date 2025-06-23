import { TrashIcon } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { MaintenanceEntry } from "../../types";

import { useDeleteMaintenanceEntry } from "../../api/use-delete-maintenance-entry";
import { getServiceTypeLabel } from "../../utils/maintenance-utils";

type DeleteMaintenanceDialogProps = {
  entry: MaintenanceEntry;
  children?: React.ReactNode;
};

export function DeleteMaintenanceDialog({ entry, children }: DeleteMaintenanceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const deleteMaintenanceEntry = useDeleteMaintenanceEntry();

  const isConfirmValid = confirmText === "Delete";
  const hasMultipleServices = entry.serviceTypes.length > 1;

  const handleDelete = async () => {
    if (!isConfirmValid)
      return;

    try {
      await deleteMaintenanceEntry.mutateAsync(entry.uuid);
      setIsOpen(false);
      setConfirmText("");
    }
    catch {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConfirmText("");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <TrashIcon className="h-5 w-5 text-destructive" />
            Delete Maintenance Entry
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete this maintenance entry? This action cannot be undone.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg border">
              <p className="font-medium text-foreground">
                {hasMultipleServices
                  ? `Complete Service Package (${entry.serviceTypes.length} services)`
                  : getServiceTypeLabel(entry.serviceTypes[0])}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(entry.serviceDate).toLocaleDateString()}
                {entry.cost && ` • ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(entry.cost)}`}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="delete-confirm">
            To confirm deletion, please type "Delete" in the field below:
          </Label>
          <Input
            id="delete-confirm"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="Delete"
            autoComplete="off"
            className={confirmText && !isConfirmValid ? "border-destructive" : ""}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmValid || deleteMaintenanceEntry.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMaintenanceEntry.isPending ? "Deleting..." : "Delete Entry"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
