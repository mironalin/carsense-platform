import { Search, SlidersHorizontal, Star, X } from "lucide-react";

import type { ChartFiltersProps } from "@/features/charts/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartControls } from "@/features/charts/components/chart-controls";
import { getCategoryIcon } from "@/features/charts/overview/utils/chart-categories";

import type { Sensor } from "../../types";

export function ChartFilters({
  searchTerm,
  setSearchTerm,
  showFavoritesOnly,
  setShowFavoritesOnly,
  resetFilters,
  selectedCategories,
  setSelectedCategories,
  categories,
  allSensors,
  chartType,
  setChartType,
  colorTheme,
  setColorTheme,
}: ChartFiltersProps) {
  // Get unique categories with at least one sensor
  const uniqueCategories = Object.keys(categories).filter(category =>
    categories[category] && categories[category].length > 0,
  );

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-4">
        {/* Top row with search, favorites, chart type and theme */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left side - Search and Favorites */}
          <div className="flex items-center gap-3 flex-grow max-w-md">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search charts by name..."
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
              className="gap-1 whitespace-nowrap"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className="h-4 w-4" />
              {showFavoritesOnly ? "All Charts" : "Favorites"}
            </Button>
          </div>

          {/* Right side - Chart Type and Theme */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Chart Controls */}
            <ChartControls
              chartType={chartType}
              onChartTypeChange={value => setChartType(value)}
              colorTheme={colorTheme}
              onColorThemeChange={value => setColorTheme(value)}
            />

            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={resetFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Reset
            </Button>
          </div>
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
              {uniqueCategories.map((category) => {
                // Count sensors in this category
                const count = allSensors.filter((s: Sensor) => s.category === category).length;
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
      </div>
    </div>
  );
}
