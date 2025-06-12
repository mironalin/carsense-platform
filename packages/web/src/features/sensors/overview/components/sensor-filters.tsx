import { Check, ChevronsUpDown, Search, SlidersHorizontal, StarIcon, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { SensorCardData, SensorFiltersProps } from "../types";

import { getCategoryIcon } from "../../utils/sensor-categories";

export function SensorFilters({
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  showFavoritesOnly,
  setShowFavoritesOnly,
  uniqueCategories,
  allSensorData,
  resetFilters,
  selectedVehicle,
  vehicles,
  onVehicleChange,
}: SensorFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-4">
        {/* Search and favorite toggle */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sensors..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>

          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <StarIcon className="h-4 w-4" />
            {showFavoritesOnly ? "All Sensors" : "Favorites Only"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 ml-auto"
            onClick={resetFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Category filters */}
        {uniqueCategories.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2 relative">
              <h3 className="text-sm font-medium">Filter by Category</h3>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 text-xs transition-opacity duration-200 ${selectedCategories.length === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                onClick={() => setSelectedCategories([])}
              >
                Clear filters
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map((category: string) => {
                // Count sensors in this category
                const count = allSensorData.filter((s: SensorCardData) => s.category === category).length;
                const isSelected = selectedCategories.includes(category);

                return (
                  <div
                    key={category}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                      cursor-pointer transition-colors
                      ${isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 hover:bg-muted text-foreground"}
                    `}
                    onClick={() => {
                      setSelectedCategories(
                        selectedCategories.includes(category)
                          ? selectedCategories.filter((c: string) => c !== category)
                          : [...selectedCategories, category],
                      );
                    }}
                  >
                    <div className={`${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}>
                      {getCategoryIcon(category)}
                    </div>
                    <span>{category}</span>
                    <Badge
                      variant="outline"
                      className={`ml-1 px-1.5 py-0 h-4 min-w-4 flex items-center justify-center rounded-full text-[10px] ${
                        isSelected ? "bg-primary-foreground text-primary border-primary-foreground" : "bg-background"
                      }`}
                    >
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vehicle selector */}
        {vehicles && vehicles.length > 0 && (
          <div className="w-full lg:w-auto">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full lg:w-[220px] justify-between h-8 text-xs"
                >
                  {selectedVehicle
                    ? vehicles.find(v => v.id === selectedVehicle)?.name || "Select vehicle"
                    : "Select vehicle"}
                  <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full lg:w-[220px] p-0">
                <Command>
                  <CommandInput placeholder="Search vehicles..." />
                  <CommandEmpty>No vehicle found.</CommandEmpty>
                  <CommandGroup>
                    {vehicles.map(vehicle => (
                      <CommandItem
                        key={vehicle.id}
                        value={vehicle.id}
                        onSelect={(currentValue) => {
                          onVehicleChange?.(currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedVehicle === vehicle.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{vehicle.name}</span>
                          {vehicle.model && (
                            <span className="text-xs text-muted-foreground">
                              {vehicle.make}
                              {" "}
                              {vehicle.model}
                              {vehicle.year ? ` (${vehicle.year})` : ""}
                            </span>
                          )}
                        </div>
                        {vehicle.status === "active" && (
                          <Badge variant="outline" className="ml-auto text-[10px] py-0 h-5">
                            Active
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}
