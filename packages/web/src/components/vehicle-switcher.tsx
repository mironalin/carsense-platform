import { Car } from "lucide-react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { SidebarMenuButton } from "./ui/sidebar";
import { useNavigate, useParams } from "@tanstack/react-router";

const mockVehicles = [
  {
    id: "1",
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    ownerId: "user1",
    vin: "1HGBH41JXMN109186",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    licensePlate: "ABC-123",
    mileage: 15247,
    status: "online",
    batteryLevel: 85,
    lastUpdate: "2024-01-20T10:30:00Z",
    enrolledDate: "2024-01-01T00:00:00Z",
    fuelType: "Electric",
  },
  {
    id: "2",
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    ownerId: "user1",
    vin: "2HGBH41JXMN109187",
    make: "Honda",
    model: "Civic",
    year: 2022,
    licensePlate: "XYZ-789",
    mileage: 28450,
    status: "offline",
    lastUpdate: "2024-01-19T18:45:00Z",
    enrolledDate: "2024-01-15T00:00:00Z",
    fuelType: "Gasoline",
  },
];

export function VehicleSwitcher() {
  const navigate = useNavigate();

  const {vehicleId} = useParams({strict: false});

  const onSelect = (id: string) => {
    navigate({to: "/dashboard/$vehicleId", params: {vehicleId: id}});
  }

  const placeholder = (
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
  return (
    <div className="flex flex-col gap-2">
      <Select value={vehicleId} onValueChange={onSelect}>
        <SidebarMenuButton asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder}>

            </SelectValue>

          </SelectTrigger>
        </SidebarMenuButton>
        <SelectContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
          <SelectGroup>
            <SelectLabel className="text-xs text-muted-foreground">Vehicles</SelectLabel>
            {mockVehicles.map(vehicle => (
              <SelectItem
                key={vehicle.id}
                value={vehicle.id}
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
