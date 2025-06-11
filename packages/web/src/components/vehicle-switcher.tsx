import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { Car } from "lucide-react";

import { useGetVehicles } from "@/features/vehicles/api/use-get-vehicles";

import { VehicleSwitcherSkeleton } from "./skeleton/vehicle-switcher-skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { SidebarMenuButton } from "./ui/sidebar";

export function VehicleSwitcher() {
  const navigate = useNavigate();

  const { vehicleId } = useParams({ strict: false });
  const { data: vehicles, isPending } = useGetVehicles();

  const { pathname } = useLocation();

  const page = pathname.split("/").pop();

  const onSelect = (id: string) => {
    navigate({ to: `/app/${id}/${page}`, params: { vehicleId: id } });
  };

  if (isPending) {
    return <VehicleSwitcherSkeleton />;
  }

  const placeholder = () => {
    return (
      <>
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Car className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">CarSense</span>
          <span className="truncate text-xs">Select a vehicle</span>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Select value={vehicleId} onValueChange={onSelect}>
        <SidebarMenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder()} />
          </SelectTrigger>
        </SidebarMenuButton>
        <SelectContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <SelectGroup>
            <SelectLabel className="text-xs text-muted-foreground">Vehicles</SelectLabel>
            {vehicles?.map(vehicle => (
              <SelectItem
                key={vehicle.uuid}
                value={vehicle.uuid}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Car className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {vehicle.year}
                    {" "}
                    {vehicle.make}
                    {" "}
                    {vehicle.model}
                  </span>
                  <span className="text-xs text-muted-foreground">{vehicle.licensePlate}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
