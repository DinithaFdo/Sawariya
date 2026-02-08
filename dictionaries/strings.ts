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
  searchLoading: string;
  searchNoResults: string;
  mapLoading: string;
  stopLabel: string;
  removeStop: string;
  aiPlannerTitle: string;
  aiPlannerSubtitle: string;
  aiPlannerCta: string;
  aiPlannerEmpty: string;
  aiPlannerError: string;
  aiPlannerLoading: string;
  aiPlannerClearLabel: string;
  aiPlannerRotateOne: string;
  aiPlannerRotateTwo: string;
  aiPlannerRotateThree: string;
  optimizedOrderLabel: string;
  timeAtStopLabel: string;
  stayAreaLabel: string;
  mealLabel: string;
  breakfastLabel: string;
  lunchLabel: string;
  dinnerLabel: string;
  minutesShort: string;
  travelLabel: string;
  visitLabel: string;
  applyOrderLabel: string;
  travelTimeLabel: string;
  travelLoadingLabel: string;
  totalTripTimeLabel: string;
  totalTripLoadingLabel: string;
  bestStartTimeLabel: string;
  bestStartTimeEarly: string;
  bestStartTimeMorning: string;
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
    searchLoading: "Searching Sri Lanka...",
    searchNoResults: "No results found in Sri Lanka.",
    mapLoading: "Loading map...",
    stopLabel: "Stop",
    removeStop: "Remove",
    aiPlannerTitle: "AI Planner",
    aiPlannerSubtitle: "Get a smart sequence, stay area, and meal timing.",
    aiPlannerCta: "Generate AI plan",
    aiPlannerEmpty: "Add at least two stops to generate a plan.",
    aiPlannerError: "Unable to generate a plan right now.",
    aiPlannerLoading: "Planning...",
    aiPlannerClearLabel: "Clear AI plan",
    aiPlannerRotateOne: "Tracing the smoothest loop across the island.",
    aiPlannerRotateTwo: "Aligning temples, coastlines, and golden-hour stops.",
    aiPlannerRotateThree: "Balancing travel time with calm scenic pauses.",
    optimizedOrderLabel: "Optimized order",
    timeAtStopLabel: "Time at each stop",
    stayAreaLabel: "Stay area",
    mealLabel: "Meals",
    breakfastLabel: "Breakfast",
    lunchLabel: "Lunch",
    dinnerLabel: "Dinner",
    minutesShort: "min",
    travelLabel: "Travel",
    visitLabel: "Visit",
    applyOrderLabel: "Apply optimized order",
    travelTimeLabel: "Total travel time",
    travelLoadingLabel: "Calculating with Lankan buffer...",
    totalTripTimeLabel: "Total trip time",
    totalTripLoadingLabel: "Calculating full day...",
    bestStartTimeLabel: "Best start time",
    bestStartTimeEarly: "Start by 6:30 AM for a full day",
    bestStartTimeMorning: "Start around 8:00 AM",
    watchTitle: "Places to watch",
    watchSubtitle: "Nearby highlights and cultural stops along your route.",
    watchLoading: "Finding places near your stops...",
    watchEmpty: "No places found yet. Add more stops to discover highlights.",
    watchNearLabel: "Near",
    watchRadiusLabel: "Radius",
    watchRadiusUnit: "km",
    watchFiltersLabel: "Filters",
    watchAddLabel: "Add",
    watchAddedLabel: "Added",
    watchDistanceUnit: "km",
    categoryAttraction: "Attraction",
    categoryMuseum: "Museum",
    categoryViewpoint: "Viewpoint",
    categoryHeritage: "Heritage",
    categoryTemple: "Temple",
    categoryPark: "Park",
    categoryBeach: "Beach",
    categoryWaterfall: "Waterfall",
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
    searchLoading: "ශ්‍රී ලංකාවේ සොයමින්...",
    searchNoResults: "ශ්‍රී ලංකාවේ ප්‍රතිඵල නොමැත.",
    mapLoading: "සිතියම ලෝඩ් වෙමින්...",
    stopLabel: "නැවතුම",
    removeStop: "ඉවත් කරන්න",
    aiPlannerTitle: "AI සැලසුම",
    aiPlannerSubtitle: "ගමන් අනුक्रमය, නවාතැන් ප්‍රදේශ සහ ආහාර යෝජනා ලබාගන්න.",
    aiPlannerCta: "AI සැලසුම ගන්න",
    aiPlannerEmpty: "සැලසුම සඳහා අවම වශයෙන් නැවතුම් දෙකක් එක් කරන්න.",
    aiPlannerError: "දැනට සැලසුම ලබාගත නොහැක.",
    aiPlannerLoading: "සැලසුම් කරමින්...",
    aiPlannerClearLabel: "AI සැලසුම ඉවත් කරන්න",
    aiPlannerRotateOne: "දිවයින පුරා සුමට ලූපයක් සොයාගෙන ඇත.",
    aiPlannerRotateTwo: "දේවාල, වෙරළ සහ සන්ධ්‍යා කාලය සමාලෝචනය කරමින්.",
    aiPlannerRotateThree: "ගමන් කාලය සහ විවේක නිවැරදිව සමතුලිත කරමින්.",
    optimizedOrderLabel: "ප්‍රශස්ත අනුಕ್ರಮය",
    timeAtStopLabel: "නැවතුමක කාලය",
    stayAreaLabel: "නවාතැන් ප්‍රදේශය",
    mealLabel: "ආහාර",
    breakfastLabel: "උදෑසන ආහාර",
    lunchLabel: "දවල් ආහාර",
    dinnerLabel: "රාත්‍රී ආහාර",
    minutesShort: "මිනි",
    travelLabel: "ගමන්",
    visitLabel: "සංචාරය",
    applyOrderLabel: "ප්‍රශස්ත අනුक्रमය යොදන්න",
    travelTimeLabel: "සම්පූර්ණ ගමන් වේලාව",
    travelLoadingLabel: "ලාංකීය බෆර් සමඟ ගණනය කරමින්...",
    totalTripTimeLabel: "සම්පූර්ණ ගමන් කාලය",
    totalTripLoadingLabel: "සම්පූර්ණ දිනය ගණනය කරමින්...",
    bestStartTimeLabel: "ආරම්භ කිරීමට හොඳම වේලාව",
    bestStartTimeEarly: "සම්පූර්ණ දිනය සඳහා පෙ.ව. 6:30 ට පෙර ආරම්භ කරන්න",
    bestStartTimeMorning: "පෙ.ව. 8:00 ට සමීපව ආරම්භ කරන්න",
    watchTitle: "බලාගන්න ඇති ස්ථාන",
    watchSubtitle: "ඔබගේ මාර්ගයේ අසල සුවිශේෂී සහ සංස්කෘතික ස්ථාන.",
    watchLoading: "ඔබගේ නැවතුම් අසල ස්ථාන සොයමින්...",
    watchEmpty: "තවම ස්ථාන නොමැත. වැඩි නැවතුම් එක් කරන්න.",
    watchNearLabel: "අසළ",
    watchRadiusLabel: "රේඩියස්",
    watchRadiusUnit: "කිමී",
    watchFiltersLabel: "පෙරහන්",
    watchAddLabel: "එක් කරන්න",
    watchAddedLabel: "එක් කළා",
    watchDistanceUnit: "කිමී",
    categoryAttraction: "අදර්ශනීය",
    categoryMuseum: "කෞතුකාගාරය",
    categoryViewpoint: "දර්ශන ස්ථානය",
    categoryHeritage: "පුරාවස්තු",
    categoryTemple: "දේවාලය",
    categoryPark: "පාක්",
    categoryBeach: "වෙරළ",
    categoryWaterfall: "ජලපත",
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
    searchLoading: "இலங்கையில் தேடுகிறது...",
    searchNoResults: "இலங்கையில் முடிவுகள் இல்லை.",
    mapLoading: "வரைபடம் ஏற்றப்படுகிறது...",
    stopLabel: "நிறுத்தம்",
    removeStop: "நீக்கு",
    aiPlannerTitle: "AI திட்டம்",
    aiPlannerSubtitle: "பயண வரிசை, தங்கும் பகுதி, உணவு நேரம் பெறுங்கள்.",
    aiPlannerCta: "AI திட்டத்தை உருவாக்கவும்",
    aiPlannerEmpty:
      "திட்டம் உருவாக்க குறைந்தது இரண்டு நிறுத்தங்களை சேர்க்கவும்.",
    aiPlannerError: "திட்டத்தை உருவாக்க முடியவில்லை.",
    aiPlannerLoading: "திட்டமிடுகிறது...",
    aiPlannerClearLabel: "AI திட்டத்தை நீக்கு",
    aiPlannerRotateOne: "தீவைச் சுற்றி மென்மையான பாதையை வரைபடமாக்குகிறது.",
    aiPlannerRotateTwo: "கோவில்கள், கடற்கரை, மாலை நேரங்களை ஒத்திசைக்கிறது.",
    aiPlannerRotateThree:
      "பயண நேரம் மற்றும் அமைதியான இடைவெளிகளை சமநிலைப்படுத்துகிறது.",
    optimizedOrderLabel: "மேம்படுத்தப்பட்ட வரிசை",
    timeAtStopLabel: "ஒவ்வொரு நிறுத்த நேரம்",
    stayAreaLabel: "தங்கும் பகுதி",
    mealLabel: "உணவுகள்",
    breakfastLabel: "காலை உணவு",
    lunchLabel: "மதிய உணவு",
    dinnerLabel: "இரவு உணவு",
    minutesShort: "நிமிடம்",
    travelLabel: "பயணம்",
    visitLabel: "பார்வை",
    applyOrderLabel: "மேம்படுத்திய வரிசையை பயன்படுத்தவும்",
    travelTimeLabel: "மொத்த பயண நேரம்",
    travelLoadingLabel: "இலங்கை பஃபர் உடன் கணக்கிடுகிறது...",
    totalTripTimeLabel: "மொத்த பயண நேரம்",
    totalTripLoadingLabel: "முழு நாள் கணக்கிடுகிறது...",
    bestStartTimeLabel: "சிறந்த தொடக்க நேரம்",
    bestStartTimeEarly: "முழு நாளுக்கு காலை 6:30 க்கு முன் தொடங்கவும்",
    bestStartTimeMorning: "காலை 8:00 அருகில் தொடங்கவும்",
    watchTitle: "கவனிக்க வேண்டிய இடங்கள்",
    watchSubtitle: "பாதையில் உள்ள அருகிலான சிறப்பு மற்றும் கலாச்சார இடங்கள்.",
    watchLoading: "உங்கள் நிறுத்தங்களுக்கு அருகில் இடங்களை கண்டுபிடிக்கிறது...",
    watchEmpty: "இன்னும் இடங்கள் இல்லை. மேலும் நிறுத்தங்களை சேர்க்கவும்.",
    watchNearLabel: "அருகில்",
    watchRadiusLabel: "அரையளவு",
    watchRadiusUnit: "கிமீ",
    watchFiltersLabel: "வடிகட்டிகள்",
    watchAddLabel: "சேர்",
    watchAddedLabel: "சேர்க்கப்பட்டது",
    watchDistanceUnit: "கிமீ",
    categoryAttraction: "சிறப்பு இடம்",
    categoryMuseum: "அருங்காட்சியகம்",
    categoryViewpoint: "நோக்கிடம்",
    categoryHeritage: "பாரம்பரியம்",
    categoryTemple: "கோவில்",
    categoryPark: "பூங்கா",
    categoryBeach: "கடற்கரை",
    categoryWaterfall: "அருவி",
    language: "மொழி",
    locationsCount: "நிறுத்தங்கள்",
    sriLankaNote: "பயண நேரத்தில் 1.3x இலங்கை பஃபர் சேர்க்கப்பட்டுள்ளது.",
  },
};
