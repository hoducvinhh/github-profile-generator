"use client";

import * as React from "react";
import { useProfileStore } from "@/stores/use-profile-store";
import { THEME_LIST } from "@/lib/themes/registry";
import { ThemeId } from "@/types/profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";

export function ThemeSelector() {
  const { config, setTheme } = useProfileStore();
  const currentTheme = THEME_LIST.find((t) => t.id === config.themeId) || THEME_LIST[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
          <Palette className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Theme:</span>
          <span className="font-semibold">{currentTheme.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>README Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEME_LIST.map((theme) => {
          const isSelected = theme.id === config.themeId;
          return (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => setTheme(theme.id as ThemeId)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: theme.previewBg,
                    borderColor: theme.previewBorder,
                  }}
                />
                <span className="text-xs font-medium">{theme.name}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
