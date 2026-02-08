"use server";

import type { Location, OptimizedTrip } from "@/lib/types";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const buildPrompt = (locations: Location[]) => {
  const locationsJson = JSON.stringify(locations, null, 2);
  return [
    "You are a Sri Lanka trip planning assistant.",
    "Reorder the visits to minimize backtracking while keeping a logical geographic flow.",
    "Return ONLY valid JSON with the exact shape:",
    "{",
    '  "order": ["id1", "id2"],',
    '  "timeEstimates": [{"id": "id1", "minutes": 45}],',
    '  "stayArea": "string",',
    '  "mealSuggestions": {"breakfast": "string", "lunch": "string", "dinner": "string"}',
    "}",
    "Use the provided ids, estimate time per location in minutes (30-120),",
    "recommend a central stay area, and suggest breakfast/lunch/dinner along the route.",
    "Locations:",
    locationsJson,
  ].join("\n");
};

const extractJson = (text: string) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1];
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) return text;
  return text.slice(firstBrace, lastBrace + 1);
};

const normalizeTrip = (trip: Partial<OptimizedTrip>, locations: Location[]) => {
  const ids = new Set(locations.map((loc) => loc.id));
  const fallbackOrder = locations.map((loc) => loc.id);

  const order = Array.isArray(trip.order)
    ? trip.order.filter((id) => ids.has(id))
    : [];
  const timeEstimates = Array.isArray(trip.timeEstimates)
    ? trip.timeEstimates.filter((item) => ids.has(item.id))
    : [];
  const mealSuggestions = trip.mealSuggestions ?? {
    breakfast: "",
    lunch: "",
    dinner: "",
  };

  return {
    order: order.length ? order : fallbackOrder,
    stayArea: trip.stayArea ?? "",
    mealSuggestions,
    timeEstimates,
  } satisfies OptimizedTrip;
};

export const optimizeTrip = async (
  locations: Location[],
): Promise<OptimizedTrip> => {
  if (locations.length < 2) {
    throw new Error("Add at least two stops before optimizing.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  let response: Response;
  try {
    response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(locations) }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Gemini request failed: ${error.message}`
        : "Gemini request failed.",
    );
  }

  if (!response.ok) {
    let details = "";
    try {
      const errorPayload = (await response.json()) as {
        error?: { message?: string };
      };
      details = errorPayload.error?.message ?? "";
    } catch {
      details = await response.text();
    }

    const suffix = details ? ` ${details}` : "";
    throw new Error(
      `Gemini request failed (status ${response.status}).${suffix}`.trim(),
    );
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const json = extractJson(text);
  const parsed = JSON.parse(json) as Partial<OptimizedTrip>;
  return normalizeTrip(parsed, locations);
};
