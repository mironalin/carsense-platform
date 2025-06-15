import { Check, ChevronDown } from "lucide-react";

import type { ColorTheme, ColorThemeSelectorProps } from "@/features/charts/types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colorThemes } from "@/features/charts/utils/color-themes";

export function ColorThemeSelector({ colorTheme, onColorThemeChange }: ColorThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-2 flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Object.keys(colorThemes).map(theme => (
                <div
                  key={theme}
                  className={`h-2 w-2 rounded-full ${theme === colorTheme ? "ring-1 ring-primary ring-offset-1" : ""}`}
                  style={{ backgroundColor: colorThemes[theme as keyof typeof colorThemes].colors.Engine }}
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
                onClick={() => onColorThemeChange(key as ColorTheme)}
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
    </div>
  );
}
