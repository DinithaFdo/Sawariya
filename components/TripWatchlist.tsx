"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Binoculars,
  Landmark,
  Leaf,
  MapPin,
  Palmtree,
  Plus,
} from "lucide-react";
import type { Location } from "@/lib/types";
import type { Language } from "@/dictionaries/strings";
import { fetchWatchItems, type WatchItem } from "@/lib/overpass";

type TripWatchlistProps = {
  locations: Location[];
  language: Language;
  onAddLocation: (location: Location) => void;
  strings: {
    watchTitle: string;
    watchSubtitle: string;
    watchLoading: string;
    watchEmpty: string;
    watchNearLabel: string;
    watchRadiusLabel: string;
    watchRadiusUnit: string;
    watchFiltersLabel: string;
    watchAddLabel: string;
    watchAddedLabel: string;
    watchDistanceUnit: string;
    categoryAttraction: string;
    categoryMuseum: string;
    categoryViewpoint: string;
    categoryHeritage: string;
    categoryTemple: string;
    categoryPark: string;
    categoryBeach: string;
    categoryWaterfall: string;
  };
};

type WatchGroup = {
  location: Location;
  items: WatchItem[];
};

const categoryIcon = (category: string) => {
  switch (category) {
    case "beach":
      return <Palmtree className="h-4 w-4 text-sky-500" />;
    case "park":
      return <Leaf className="h-4 w-4 text-emerald-500" />;
    case "museum":
    case "heritage":
      return <Landmark className="h-4 w-4 text-amber-500" />;
    case "temple":
      return <MapPin className="h-4 w-4 text-rose-500" />;
    default:
      return <Binoculars className="h-4 w-4 text-slate-500" />;
  }
};

const categoryLabel = (
  category: string,
  strings: TripWatchlistProps["strings"],
) => {
  switch (category) {
    case "museum":
      return strings.categoryMuseum;
    case "viewpoint":
      return strings.categoryViewpoint;
    case "heritage":
      return strings.categoryHeritage;
    case "temple":
      return strings.categoryTemple;
    case "park":
      return strings.categoryPark;
    case "beach":
      return strings.categoryBeach;
    case "waterfall":
      return strings.categoryWaterfall;
    default:
      return strings.categoryAttraction;
  }
};

export const TripWatchlist = ({
  locations,
  language,
  onAddLocation,
  strings,
}: TripWatchlistProps) => {
  const [groups, setGroups] = useState<WatchGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState(() =>
    new Set([
      "attraction",
      "museum",
      "viewpoint",
      "heritage",
      "temple",
      "park",
      "beach",
      "waterfall",
    ]),
  );

  const existingIds = useMemo(
    () => new Set(locations.map((location) => location.id)),
    [locations],
  );

  const activeLocations = useMemo(() => locations.slice(0, 5), [locations]);

  useEffect(() => {
    if (activeLocations.length === 0) {
      setGroups([]);
      setIsLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      const results: WatchGroup[] = [];
      for (const location of activeLocations) {
        const items = await fetchWatchItems(
          location,
          language,
          radiusKm * 1000,
          controller.signal,
        );
        results.push({ location, items });
      }
      if (!active) return;
      setGroups(results);
      setIsLoading(false);
    };

    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [activeLocations, language, radiusKm]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const categoryOptions = [
    { key: "attraction", label: strings.categoryAttraction },
    { key: "museum", label: strings.categoryMuseum },
    { key: "viewpoint", label: strings.categoryViewpoint },
    { key: "heritage", label: strings.categoryHeritage },
    { key: "temple", label: strings.categoryTemple },
    { key: "park", label: strings.categoryPark },
    { key: "beach", label: strings.categoryBeach },
    { key: "waterfall", label: strings.categoryWaterfall },
  ];

  return (
    <section className="glass-card mt-10 rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-slate-900">
            {strings.watchTitle}
          </h3>
          <p className="text-sm text-slate-600">{strings.watchSubtitle}</p>
        </div>
        <Binoculars className="h-7 w-7 text-emerald-500" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {strings.watchRadiusLabel}
          </span>
          <input
            type="range"
            min={2}
            max={10}
            step={1}
            value={radiusKm}
            onChange={(event) => setRadiusKm(Number(event.target.value))}
            className="accent-emerald-600"
          />
          <span className="text-sm font-semibold text-slate-800">
            {radiusKm} {strings.watchRadiusUnit}
          </span>
        </label>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {strings.watchFiltersLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const isActive = selectedCategories.has(category.key);
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => toggleCategory(category.key)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-white/70 bg-white/70 text-slate-500"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
          {strings.watchLoading}
        </div>
      ) : null}

      {!isLoading && groups.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
          {strings.watchEmpty}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.location.id}
            className="rounded-2xl border border-white/70 bg-white/70 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              {strings.watchNearLabel} {group.location.name}
            </p>
            <div className="mt-4 grid gap-3">
              {group.items.filter((item) => selectedCategories.has(item.category)).length === 0 ? (
                <p className="text-sm text-slate-500">{strings.watchEmpty}</p>
              ) : (
                group.items
                  .filter((item) => selectedCategories.has(item.category))
                  .map((item) => {
                    const locationId = `watch-${item.id}`;
                    const isAdded = existingIds.has(locationId);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/70 bg-white/80 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                            {categoryIcon(item.category)}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {categoryLabel(item.category, strings)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-500">
                            {item.distanceKm.toFixed(1)} {strings.watchDistanceUnit}
                          </span>
                          <button
                            type="button"
                            disabled={isAdded}
                            onClick={() =>
                              onAddLocation({
                                id: locationId,
                                name: item.name,
                                lat: item.lat,
                                lng: item.lng,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500"
                          >
                            <Plus className="h-3 w-3" />
                            {isAdded ? strings.watchAddedLabel : strings.watchAddLabel}
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
