"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Location, OptimizedTrip } from "@/lib/types";
import { dictionary, type Language } from "@/dictionaries/strings";

type TripContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  locations: Location[];
  aiPlan: OptimizedTrip | null;
  setAiPlan: (plan: OptimizedTrip | null) => void;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  clearLocations: () => void;
  applyOptimizedOrder: (order: string[]) => void;
  strings: (typeof dictionary)["en"];
};

const TripContext = createContext<TripContextValue | null>(null);
const STORAGE_KEY = "sawariya_trip";

const readStoredTrip = (): {
  language: Language;
  locations: Location[];
  aiPlan: OptimizedTrip | null;
} | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<{
      language: Language;
      locations: Location[];
      aiPlan: OptimizedTrip | null;
    }>;
    return {
      language: parsed.language ?? "en",
      locations: Array.isArray(parsed.locations) ? parsed.locations : [],
      aiPlan: parsed.aiPlan ?? null,
    };
  } catch {
    return null;
  }
};

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [locations, setLocations] = useState<Location[]>([]);
  const [aiPlan, setAiPlan] = useState<OptimizedTrip | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const stored = readStoredTrip();
    if (stored) {
      setLanguage(stored.language);
      setLocations(stored.locations);
      setAiPlan(stored.aiPlan);
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const payload = JSON.stringify({ language, locations, aiPlan });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [language, locations, aiPlan]);

  const value = useMemo<TripContextValue>(
    () => ({
      language,
      setLanguage,
      locations,
      aiPlan,
      setAiPlan,
      addLocation: (location) => {
        setLocations((prev) => [...prev, location]);
        setAiPlan(null);
      },
      removeLocation: (id) => {
        setLocations((prev) => prev.filter((item) => item.id !== id));
        setAiPlan(null);
      },
      clearLocations: () => {
        setLocations([]);
        setAiPlan(null);
      },
      applyOptimizedOrder: (order) =>
        setLocations((prev) => {
          const map = new Map(prev.map((loc) => [loc.id, loc]));
          const ordered = order
            .map((id) => map.get(id))
            .filter((loc): loc is Location => Boolean(loc));
          const remaining = prev.filter((loc) => !order.includes(loc.id));
          return [...ordered, ...remaining];
        }),
      strings: dictionary[language],
    }),
    [language, locations, aiPlan],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within TripProvider");
  }
  return context;
};
