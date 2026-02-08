"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Location } from "@/lib/types";
import { dictionary, type Language } from "@/dictionaries/strings";

type TripContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  locations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  clearLocations: () => void;
  strings: (typeof dictionary)["en"];
};

const TripContext = createContext<TripContextValue | null>(null);
const STORAGE_KEY = "sawariya_trip";

const readStoredTrip = (): {
  language: Language;
  locations: Location[];
} | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<{
      language: Language;
      locations: Location[];
    }>;
    return {
      language: parsed.language ?? "en",
      locations: Array.isArray(parsed.locations) ? parsed.locations : [],
    };
  } catch {
    return null;
  }
};

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [locations, setLocations] = useState<Location[]>([]);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const stored = readStoredTrip();
    if (stored) {
      setLanguage(stored.language);
      setLocations(stored.locations);
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const payload = JSON.stringify({ language, locations });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [language, locations]);

  const value = useMemo<TripContextValue>(
    () => ({
      language,
      setLanguage,
      locations,
      addLocation: (location) => setLocations((prev) => [...prev, location]),
      removeLocation: (id) =>
        setLocations((prev) => prev.filter((item) => item.id !== id)),
      clearLocations: () => setLocations([]),
      strings: dictionary[language],
    }),
    [language, locations],
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
