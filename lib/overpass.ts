import type { Language } from "@/dictionaries/strings";
import type { Location } from "@/lib/types";

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements: OverpassElement[];
};

export type WatchItem = {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  lat: number;
  lng: number;
};

const LIMIT_PER_STOP = 4;

const buildQuery = (location: Location, radiusMeters: number) => {
  const { lat, lng } = location;
  return `
[out:json][timeout:25];
(
  node(around:${radiusMeters},${lat},${lng})["tourism"~"attraction|museum|viewpoint"];
  way(around:${radiusMeters},${lat},${lng})["tourism"~"attraction|museum|viewpoint"];
  relation(around:${radiusMeters},${lat},${lng})["tourism"~"attraction|museum|viewpoint"];
  node(around:${radiusMeters},${lat},${lng})["historic"];
  way(around:${radiusMeters},${lat},${lng})["historic"];
  relation(around:${radiusMeters},${lat},${lng})["historic"];
  node(around:${radiusMeters},${lat},${lng})["leisure"="park"];
  way(around:${radiusMeters},${lat},${lng})["leisure"="park"];
  relation(around:${radiusMeters},${lat},${lng})["leisure"="park"];
  node(around:${radiusMeters},${lat},${lng})["natural"~"peak|waterfall|beach"];
  way(around:${radiusMeters},${lat},${lng})["natural"~"peak|waterfall|beach"];
  relation(around:${radiusMeters},${lat},${lng})["natural"~"peak|waterfall|beach"];
  node(around:${radiusMeters},${lat},${lng})["amenity"="place_of_worship"];
  way(around:${radiusMeters},${lat},${lng})["amenity"="place_of_worship"];
  relation(around:${radiusMeters},${lat},${lng})["amenity"="place_of_worship"];
);
out center 20;
`;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const distanceKm = (from: Location, lat: number, lng: number) => {
  const R = 6371;
  const dLat = toRadians(lat - from.lat);
  const dLng = toRadians(lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const pickName = (
  tags: Record<string, string> | undefined,
  language: Language,
) => {
  if (!tags) return null;
  const fallback = tags.name;
  if (language === "si") return tags["name:si"] ?? fallback ?? null;
  if (language === "ta") return tags["name:ta"] ?? fallback ?? null;
  return tags["name:en"] ?? fallback ?? null;
};

const pickCategory = (tags: Record<string, string> | undefined) => {
  if (!tags) return "attraction";
  if (tags.natural === "beach") return "beach";
  if (tags.natural === "waterfall") return "waterfall";
  if (tags.natural === "peak") return "viewpoint";
  if (tags.tourism === "museum") return "museum";
  if (tags.tourism === "viewpoint") return "viewpoint";
  if (tags.historic) return "heritage";
  if (tags.amenity === "place_of_worship") return "temple";
  if (tags.leisure === "park") return "park";
  return "attraction";
};

const resolveLatLng = (element: OverpassElement) => {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return { lat: element.lat, lng: element.lon };
  }
  if (element.center) {
    return { lat: element.center.lat, lng: element.center.lon };
  }
  return null;
};

export const fetchWatchItems = async (
  location: Location,
  language: Language,
  radiusMeters: number,
  signal?: AbortSignal,
): Promise<WatchItem[]> => {
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({ data: buildQuery(location, radiusMeters) }),
    signal,
  });

  if (!response.ok) return [];
  const data = (await response.json()) as OverpassResponse;

  const items = data.elements
    .map((element) => {
      const coords = resolveLatLng(element);
      if (!coords) return null;
      const name = pickName(element.tags, language);
      if (!name) return null;
      const distance = distanceKm(location, coords.lat, coords.lng);
      return {
        id: `${element.type}-${element.id}`,
        name,
        category: pickCategory(element.tags),
        distanceKm: distance,
        lat: coords.lat,
        lng: coords.lng,
      } satisfies WatchItem;
    })
    .filter((item): item is WatchItem => Boolean(item))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, LIMIT_PER_STOP);

  return items;
};
