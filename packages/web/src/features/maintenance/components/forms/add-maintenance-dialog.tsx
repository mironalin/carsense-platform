import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AddMaintenanceForm } from "./add-maintenance-form";

type AddMaintenanceDialogProps = {
  vehicleUUID: string;
  trigger?: React.ReactNode;
};

export function AddMaintenanceDialog({ vehicleUUID, trigger }: AddMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="w-full sm:w-auto">
            Add Maintenance Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Maintenance Entry</DialogTitle>
          <DialogDescription>
            Record a new service or maintenance activity for your vehicle.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <AddMaintenanceForm vehicleUUID={vehicleUUID} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
