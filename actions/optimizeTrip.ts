"use server";

import type { Location } from "@/lib/types";

export type OptimizedTrip = {
  order: string[];
  stayArea: string;
  mealSuggestions: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  timeEstimates: Array<{ id: string; minutes: number }>;
};

export const optimizeTrip = async (
  _locations: Location[],
): Promise<OptimizedTrip> => {
  throw new Error("optimizeTrip not implemented yet.");
};
