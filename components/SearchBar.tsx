"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTrip } from "@/components/TripProvider";
import { fetchNominatimResults, type NominatimResult } from "@/lib/nominatim";
import type { Location } from "@/lib/types";

const resultToLocation = (result: NominatimResult): Location => ({
  id: result.place_id,
  name: result.display_name,
  lat: Number(result.lat),
  lng: Number(result.lon),
});

export const SearchBar = () => {
  const { addLocation, locations, strings, language } = useTrip();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasResults = results.length > 0;

  const existingIds = useMemo(
    () => new Set(locations.map((loc) => loc.id)),
    [locations],
  );

  useEffect(() => {
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const handle = window.setTimeout(async () => {
      setIsLoading(true);
      const data = await fetchNominatimResults(
        query,
        language,
        controller.signal,
      );
      if (!controller.signal.aborted) {
        setResults(data);
        setActiveIndex(0);
        setIsLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(handle);
    };
  }, [query, language]);

  const handleSelect = (result: NominatimResult) => {
    const location = resultToLocation(result);
    if (!existingIds.has(location.id)) {
      addLocation(location);
    }
    setQuery("");
    setResults([]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasResults) return;
    handleSelect(results[activeIndex] ?? results[0]);
  };

  return (
    <div className="relative">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="relative flex-1">
          <span className="sr-only">{strings.searchPlaceholder}</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)" />
          <input
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (value.trim().length < 2) {
                setResults([]);
                setActiveIndex(0);
                setIsLoading(false);
              }
            }}
            className="w-full rounded-full border border-white/60 bg-white/90 py-3 pl-11 pr-4 text-sm text-foreground shadow-[0_18px_35px_rgba(15,23,42,0.15)] outline-none transition focus:ring-2 focus:ring-black/30"
            placeholder={strings.searchPlaceholder}
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(0,0,0,0.3)]"
        >
          {strings.addStop}
        </button>
      </form>

      {query.length > 1 && (
        <div className="glass-panel absolute z-50 mt-3 w-full rounded-2xl p-2 text-sm text-foreground shadow-xl">
          {isLoading ? (
            <div className="space-y-2 px-3 py-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className="skeleton h-4 w-full" />
              ))}
            </div>
          ) : hasResults ? (
            <ul className="max-h-64 overflow-auto">
              {results.map((result, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={result.place_id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full rounded-xl px-3 py-2 text-left transition ${
                        isActive ? "bg-black text-white" : "hover:bg-black/10"
                      }`}
                    >
                      {result.display_name}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-3 py-2 text-(--muted)">
              {strings.searchNoResults}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
