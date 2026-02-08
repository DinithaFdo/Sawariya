"use client";

import { Moon, Sun } from "lucide-react";
import { useTrip } from "@/components/TripProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTrip();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="nav-chip group flex items-center gap-2"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="nav-chip__icon">
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      <span className="hidden text-xs font-semibold sm:inline">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
};
