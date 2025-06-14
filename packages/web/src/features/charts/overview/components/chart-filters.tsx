import { AreaChart, BarChart3, Check, ChevronDown, LineChart, Search, SlidersHorizontal, Star, X } from "lucide-react";

import type { ChartFiltersProps, ChartType, ColorTheme } from "@/features/charts/overview/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getCategoryIcon } from "@/features/charts/overview/utils/chart-categories";

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
  colorThemes,
}: ChartFiltersProps) {
  // Get unique categories with at least one sensor
  const uniqueCategories = Object.keys(categories).filter(category =>
    categories[category] && categories[category].length > 0,
  );

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
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
            {/* Chart Type Selector */}
            <ToggleGroup
              type="single"
              value={chartType}
              onValueChange={value => value && setChartType(value as ChartType)}
              className="border rounded-md"
            >
              <ToggleGroupItem value="area" aria-label="Area Chart" className="h-8 w-8 p-0">
                <AreaChart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="line" aria-label="Line Chart" className="h-8 w-8 p-0">
                <LineChart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="bar" aria-label="Bar Chart" className="h-8 w-8 p-0">
                <BarChart3 className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {Object.keys(colorThemes).map(theme => (
                      <div
                        key={theme}
                        className={`h-2 w-2 rounded-full ${theme === colorTheme ? "ring-1 ring-primary ring-offset-1" : ""}`}
                        style={{ backgroundColor: colorThemes[theme].colors.Engine }}
                      />
                    ))}
                  </div>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {Object.entries(colorThemes).map(([key, theme]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => setColorTheme(key as ColorTheme)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1.5">
                        {Object.values(theme.colors).slice(0, 5).map((color, i) => (
                          <div
                            key={i}
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span>{theme.name}</span>
                      {key === colorTheme && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

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
                const count = allSensors.filter(s => s.category === category).length;
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
                          ? selectedCategories.filter(c => c !== category)
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
