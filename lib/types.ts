export type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

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
