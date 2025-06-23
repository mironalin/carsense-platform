import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarIcon, CheckIcon, DollarSignIcon, GaugeIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { CreateMaintenanceEntry } from "../../types";

import { FieldErrorIconTooltip } from "../../../auth/components/field-error-icon-tooltip";
import { useCreateMaintenanceEntry } from "../../api/use-create-maintenance-entry";
import { SERVICE_TYPE_CATEGORIES, SERVICE_TYPE_LABELS, SERVICE_TYPES } from "../../types";
import { itemVariants } from "../../utils/animation-variants";

const maintenanceFormSchema = z.object({
  serviceTypes: z.array(z.enum(SERVICE_TYPES)).min(1, "Please select at least one service type"),
  serviceDate: z.date({
    errorMap: () => ({ message: "Please select a valid service date" }),
  }),
  odometer: z.number().int().positive().optional(),
  customServiceWorkshopName: z.string().min(1, "Workshop name is required"),
  cost: z.number().optional(),
  notes: z.string().optional(),
});

type AddMaintenanceFormProps = {
  vehicleUUID: string;
  onSuccess?: () => void;
};

export function AddMaintenanceForm({ vehicleUUID, onSuccess }: AddMaintenanceFormProps) {
  const createMaintenanceMutation = useCreateMaintenanceEntry();
  const [serviceTypesOpen, setServiceTypesOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      serviceTypes: [] as (typeof SERVICE_TYPES)[number][],
      serviceDate: undefined as Date | undefined,
      odometer: undefined as number | undefined,
      customServiceWorkshopName: "",
      cost: undefined as number | undefined,
      notes: "",
    },
    onSubmit: async ({ value }) => {
      // Validate using Zod schema
      const result = maintenanceFormSchema.safeParse({
        serviceTypes: value.serviceTypes,
        serviceDate: value.serviceDate,
        odometer: value.odometer,
        customServiceWorkshopName: value.customServiceWorkshopName,
        cost: value.cost,
        notes: value.notes,
      });

      if (!result.success) {
        console.error("Validation failed:", result.error);
        // The field-level validators will show the errors
        return;
      }

      const formData: CreateMaintenanceEntry = {
        vehicleUUID,
        serviceTypes: result.data.serviceTypes,
        serviceDate: result.data.serviceDate.toISOString(),
        odometer: result.data.odometer,
        customServiceWorkshopName: result.data.customServiceWorkshopName,
        cost: result.data.cost,
        notes: result.data.notes || undefined,
      };

      try {
        await createMaintenanceMutation.mutateAsync(formData);

        // Reset form
        form.reset();
        onSuccess?.();
      }
      catch (error) {
        // Error is handled by the mutation's onError callback
        console.error("Failed to create maintenance entry:", error);
      }
    },
  });

  return (
    <TooltipProvider>
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Multiple Service Types Selection */}
          <form.Field
            name="serviceTypes"
            validators={{
              onChange: ({ value }) =>
                value && value.length > 0 ? undefined : "Please select at least one service type",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;

              const toggleServiceType = (serviceType: (typeof SERVICE_TYPES)[number]) => {
                const currentTypes = field.state.value || [];
                const newTypes = currentTypes.includes(serviceType)
                  ? currentTypes.filter(type => type !== serviceType)
                  : [...currentTypes, serviceType];
                field.handleChange(newTypes);
              };

              const removeServiceType = (serviceType: (typeof SERVICE_TYPES)[number]) => {
                const currentTypes = field.state.value || [];
                field.handleChange(currentTypes.filter(type => type !== serviceType));
              };

              return (
                <div className="space-y-2">
                  <Label>Service Types</Label>
                  <div className="relative">
                    <Popover open={serviceTypesOpen} onOpenChange={setServiceTypesOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal min-h-10",
                            (!field.state.value || field.state.value.length === 0) && "text-muted-foreground",
                            hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                          )}
                        >
                          {field.state.value && field.state.value.length > 0
                            ? (
                                <span className="truncate">
                                  {field.state.value.length === 1
                                    ? SERVICE_TYPE_LABELS[field.state.value[0]]
                                    : `${field.state.value.length} services selected`}
                                </span>
                              )
                            : (
                                "Select service types..."
                              )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        align="start"
                        onWheel={e => e.stopPropagation()}
                      >
                        <Command>
                          <CommandInput placeholder="Search services..." />
                          <CommandList
                            className="max-h-[300px] overflow-y-auto overscroll-contain"
                            onWheel={e => e.stopPropagation()}
                          >
                            <CommandEmpty>No services found.</CommandEmpty>
                            {Object.entries(SERVICE_TYPE_CATEGORIES).map(([category, types]) => (
                              <CommandGroup key={category} heading={category}>
                                {types.map((serviceType) => {
                                  const isSelected = field.state.value?.includes(serviceType) || false;
                                  return (
                                    <CommandItem
                                      key={serviceType}
                                      onSelect={() => toggleServiceType(serviceType)}
                                      className="cursor-pointer"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div className={cn(
                                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                          isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "opacity-50 [&_svg]:invisible",
                                        )}
                                        >
                                          <CheckIcon className="h-3 w-3" />
                                        </div>
                                        <span>{SERVICE_TYPE_LABELS[serviceType]}</span>
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                  </div>

                  {/* Selected Service Types as Badges */}
                  {field.state.value && field.state.value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {field.state.value.map(serviceType => (
                        <Badge key={serviceType} variant="secondary" className="flex items-center gap-1 pr-1">
                          {SERVICE_TYPE_LABELS[serviceType]}
                          <button
                            type="button"
                            className="ml-1 p-0.5 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Removing service type:", serviceType);
                              removeServiceType(serviceType);
                            }}
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Service Date */}
          <form.Field
            name="serviceDate"
            validators={{
              onChange: ({ value }) =>
                value ? undefined : "Please select a service date",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;

              return (
                <div className="space-y-2">
                  <Label>Service Date</Label>
                  <div className="relative">
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.state.value && "text-muted-foreground",
                            hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.state.value
                            ? (
                                format(field.state.value, "PPP")
                              )
                            : (
                                <span>Pick a date</span>
                              )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={date => field.handleChange(date)}
                          disabled={date =>
                            date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                  </div>
                </div>
              );
            }}
          </form.Field>

          {/* Odometer Reading */}
          <form.Field name="odometer">
            {field => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Odometer Reading (Optional)</Label>
                <div className="relative">
                  <GaugeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    type="text"
                    inputMode="numeric"
                    value={field.state.value ? field.state.value.toString() : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string
                      if (value === "") {
                        field.handleChange(undefined);
                        return;
                      }
                      // Only allow positive integers
                      const numericRegex = /^\d+$/;
                      if (numericRegex.test(value)) {
                        const numValue = Number.parseInt(value, 10);
                        if (!Number.isNaN(numValue) && numValue > 0) {
                          field.handleChange(numValue);
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent non-numeric characters except backspace, delete, tab, escape, enter
                      if (
                        !((e.key >= "0" && e.key <= "9")
                          || e.key === "Backspace"
                          || e.key === "Delete"
                          || e.key === "Tab"
                          || e.key === "Escape"
                          || e.key === "Enter"
                          || e.key === "ArrowLeft"
                          || e.key === "ArrowRight"
                          || (e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x")))
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="e.g., 45000"
                    className="pl-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Current vehicle mileage/kilometers at time of service
                </p>
              </div>
            )}
          </form.Field>

          {/* Workshop Name */}
          <form.Field
            name="customServiceWorkshopName"
            validators={{
              onChange: ({ value }) =>
                value.trim().length > 0 ? undefined : "Workshop name is required",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Workshop/Service Location</Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="e.g., Joe's Auto Shop, Quick Lube, Home Garage"
                      className={cn(
                        hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                      )}
                    />
                    {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                  </div>
                </div>
              );
            }}
          </form.Field>

          {/* Cost */}
          <form.Field name="cost">
            {field => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Cost (Optional)</Label>
                <div className="relative">
                  <DollarSignIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    type="text"
                    inputMode="decimal"
                    value={field.state.value ? field.state.value.toString() : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string
                      if (value === "") {
                        field.handleChange(undefined);
                        return;
                      }
                      // Only allow numbers, decimal point, and one decimal point max
                      const numericRegex = /^\d*\.?\d{0,2}$/;
                      if (numericRegex.test(value)) {
                        const numValue = Number.parseFloat(value);
                        if (!Number.isNaN(numValue) && numValue >= 0) {
                          field.handleChange(numValue);
                        }
                        else if (value.match(/^\d*\.?$/)) {
                          // Allow partial input like "123." or "."
                          field.handleChange(value === "." ? undefined : Number.parseFloat(value) || undefined);
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent non-numeric characters except backspace, delete, tab, escape, enter, and decimal point
                      if (
                        !((e.key >= "0" && e.key <= "9")
                          || e.key === "."
                          || e.key === "Backspace"
                          || e.key === "Delete"
                          || e.key === "Tab"
                          || e.key === "Escape"
                          || e.key === "Enter"
                          || e.key === "ArrowLeft"
                          || e.key === "ArrowRight"
                          || (e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x")))
                      ) {
                        e.preventDefault();
                      }
                      // Prevent multiple decimal points
                      if (e.key === "." && e.currentTarget.value.includes(".")) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="0.00"
                    className="pl-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            )}
          </form.Field>

          {/* Notes */}
          <form.Field name="notes">
            {field => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Notes (Optional)</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Additional details, parts replaced, recommendations, etc."
                  rows={3}
                />
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={createMaintenanceMutation.isPending}
              className="w-full sm:w-auto"
            >
              {createMaintenanceMutation.isPending ? "Adding..." : "Add Maintenance Entry"}
            </Button>
          </div>
        </form>
      </motion.div>
    </TooltipProvider>
  );
}
