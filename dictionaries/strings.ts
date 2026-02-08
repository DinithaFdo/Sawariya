export type Language = "en" | "si" | "ta";

type Dictionary = {
  appName: string;
  heroTitle: string;
  tagline: string;
  planTrip: string;
  searchTitle: string;
  searchSubtitle: string;
  addStop: string;
  searchPlaceholder: string;
  itinerary: string;
  itinerarySubtitle: string;
  map: string;
  mapSubtitle: string;
  optimize: string;
  clearTrip: string;
  startPlanning: string;
  howItWorks: string;
  noStops: string;
  aiPanelTitle: string;
  aiPanelSubtitle: string;
  mapPlaceholder: string;
  sampleRouteShort: string;
  sampleRouteLong: string;
  language: string;
  locationsCount: string;
  sriLankaNote: string;
};

export const dictionary: Record<Language, Dictionary> = {
  en: {
    appName: "Sawariya",
    heroTitle: "Plan a Sri Lankan loop in minutes.",
    tagline: "Plan smarter Sri Lankan journeys without backtracking.",
    planTrip: "Plan your trip",
    searchTitle: "Add your first stop",
    searchSubtitle: "Search any city or landmark in Sri Lanka.",
    addStop: "Add stop",
    searchPlaceholder: "Search city or landmark",
    itinerary: "Itinerary",
    itinerarySubtitle: "Stops ordered to reduce backtracking.",
    map: "Route map",
    mapSubtitle: "OSRM routing on OpenStreetMap tiles.",
    optimize: "Optimize with AI",
    clearTrip: "Clear trip",
    startPlanning: "Start planning",
    howItWorks: "How it works",
    noStops: "No stops yet. Add a city or landmark to begin.",
    aiPanelTitle: "AI travel signals",
    aiPanelSubtitle: "Gemini suggests stay areas, timing, and meals.",
    mapPlaceholder: "Map preview will appear here.",
    sampleRouteShort: "A → B → C",
    sampleRouteLong: "Colombo → Kandy → Ella",
    language: "Language",
    locationsCount: "Stops",
    sriLankaNote: "Travel times include the Lankan buffer (1.3x).",
  },
  si: {
    appName: "සවාරිය",
    heroTitle: "මිනිත්තු කිහිපයකින් ශ්‍රී ලාංකීය ලූපයක් සැලසුම් කරන්න.",
    tagline: "පසුබැසීමක් නැතිව ශ්‍රී ලාංකීය ගමන සැලසුම් කරන්න.",
    planTrip: "ගමන සැලසුම් කරන්න",
    searchTitle: "ඔබේ පළමු නැවතුම එක් කරන්න",
    searchSubtitle: "ශ්‍රී ලංකාවේ ඕනෑම නගරයක් හෝ ස්ථානයක් සොයන්න.",
    addStop: "නැවතුම එක් කරන්න",
    searchPlaceholder: "නගරය හෝ ස්ථානය සොයන්න",
    itinerary: "ගමන් සැලැස්ම",
    itinerarySubtitle: "පසුබැසීම අඩු කිරීමට නැවතුම් අනුक्रम කර ඇත.",
    map: "මාර්ග සිතියම",
    mapSubtitle: "OpenStreetMap ටයිල් මත OSRM මාර්ග සැලසුම් කිරීම.",
    optimize: "AI සමඟ ප්‍රශස්ත කරන්න",
    clearTrip: "ගමන ඉවත් කරන්න",
    startPlanning: "සැලසුම ආරම්භ කරන්න",
    howItWorks: "කෙසේද",
    noStops: "තවම නැවතුම් නොමැත. ආරම්භයට නගරයක් හෝ ස්ථානයක් එක් කරන්න.",
    aiPanelTitle: "AI ගමන් සංඛේත",
    aiPanelSubtitle: "Gemini නවාතැන් ප්‍රදේශ, වේලාවන් සහ ආහාර යෝජනා කරයි.",
    mapPlaceholder: "සිතියම පෙරදසුන මෙහි පෙන්වයි.",
    sampleRouteShort: "A → B → C",
    sampleRouteLong: "කොළඹ → මහනුවර → ඇල්ල",
    language: "භාෂාව",
    locationsCount: "නැවතුම්",
    sriLankaNote: "ගමන් වේලාවල 1.3x ලාංකීය බෆර් එක අඩංගුය.",
  },
  ta: {
    appName: "சவாரியா",
    heroTitle: "சில நிமிடங்களில் இலங்கை லூப் பயணத்தை திட்டமிடுங்கள்.",
    tagline:
      "பின்செல்லாமல் இலங்கைப் பயணங்களை புத்திசாலித்தனமாக திட்டமிடுங்கள்.",
    planTrip: "பயணத்தை திட்டமிடுங்கள்",
    searchTitle: "முதல் நிறுத்தத்தை சேர்க்கவும்",
    searchSubtitle: "இலங்கையில் எந்த நகரம் அல்லது இடத்தையும் தேடுங்கள்.",
    addStop: "நிறுத்தம் சேர்",
    searchPlaceholder: "நகரம் அல்லது இடத்தை தேடுங்கள்",
    itinerary: "பயண திட்டம்",
    itinerarySubtitle:
      "பின்செல்லலை குறைக்க நிறுத்தங்கள் ஒழுங்குபடுத்தப்பட்டது.",
    map: "வழி வரைபடம்",
    mapSubtitle: "OpenStreetMap டைல்களில் OSRM வழித்தடம்.",
    optimize: "AI மூலம் மேம்படுத்து",
    clearTrip: "பயணத்தை நீக்கு",
    startPlanning: "திட்டமிடத் தொடங்கு",
    howItWorks: "எப்படி வேலை செய்கிறது",
    noStops:
      "இன்னும் நிறுத்தங்கள் இல்லை. தொடங்க நகரம் அல்லது இடத்தைச் சேர்க்கவும்.",
    aiPanelTitle: "AI பயண குறிப்புகள்",
    aiPanelSubtitle:
      "Gemini தங்கும் இடம், நேரம் மற்றும் உணவுகளை பரிந்துரைக்கும்.",
    mapPlaceholder: "வரைபட முன்னோட்டம் இங்கு தோன்றும்.",
    sampleRouteShort: "A → B → C",
    sampleRouteLong: "கொழும்பு → கண்டி → எல்லா",
    language: "மொழி",
    locationsCount: "நிறுத்தங்கள்",
    sriLankaNote: "பயண நேரத்தில் 1.3x இலங்கை பஃபர் சேர்க்கப்பட்டுள்ளது.",
  },
};
