import type { Location } from "@/lib/types";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving/";
export const LANKAN_BUFFER = 1.3;

export type RouteData = {
  coordinates: Array<[number, number]>;
  distanceMeters: number;
  durationSeconds: number;
  durationWithBufferSeconds: number;
};

export type RouteLegs = {
  legDurationsSeconds: number[];
  legDurationsWithBufferSeconds: number[];
  totalDurationWithBufferSeconds: number;
};

export const fetchOsrmRoute = async (
  locations: Location[],
): Promise<RouteData | null> => {
  if (locations.length < 2) return null;

  const coordinates = locations
    .map((location) => `${location.lng},${location.lat}`)
    .join(";");

  const url = new URL(`${OSRM_BASE}${coordinates}`);
  url.searchParams.set("overview", "full");
  url.searchParams.set("geometries", "geojson");

  const response = await fetch(url.toString());
  if (!response.ok) return null;

  const data = (await response.json()) as {
    routes?: Array<{
      distance: number;
      duration: number;
      geometry: { coordinates: Array<[number, number]> };
    }>;
  };

  const route = data.routes?.[0];
  if (!route) return null;

  const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  const durationWithBufferSeconds = route.duration * LANKAN_BUFFER;

  return {
    coordinates: coords,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    durationWithBufferSeconds,
  };
};

export const fetchOsrmLegDurations = async (
  locations: Location[],
): Promise<RouteLegs | null> => {
  if (locations.length < 2) return null;

  const coordinates = locations
    .map((location) => `${location.lng},${location.lat}`)
    .join(";");

  const url = new URL(`${OSRM_BASE}${coordinates}`);
  url.searchParams.set("overview", "false");
  url.searchParams.set("steps", "false");

  const response = await fetch(url.toString());
  if (!response.ok) return null;

  const data = (await response.json()) as {
    routes?: Array<{
      legs?: Array<{ duration: number }>;
    }>;
  };

  const legs = data.routes?.[0]?.legs;
  if (!legs || legs.length === 0) return null;

  const legDurationsSeconds = legs.map((leg) => leg.duration);
  const legDurationsWithBufferSeconds = legDurationsSeconds.map(
    (duration) => duration * LANKAN_BUFFER,
  );
  const totalDurationWithBufferSeconds = legDurationsWithBufferSeconds.reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    legDurationsSeconds,
    legDurationsWithBufferSeconds,
    totalDurationWithBufferSeconds,
  };
};
