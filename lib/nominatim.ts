import type { Language } from "@/dictionaries/strings";

export type NominatimResult = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
};

export const fetchNominatimResults = async (
  query: string,
  language: Language,
  signal?: AbortSignal,
): Promise<NominatimResult[]> => {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "lk");
  url.searchParams.set("accept-language", language);
  url.searchParams.set("q", trimmed);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) return [];
  return (await response.json()) as NominatimResult[];
};
