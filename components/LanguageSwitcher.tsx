"use client";

import { useTrip } from "@/components/TripProvider";
import type { Language } from "@/dictionaries/strings";

const languageOptions: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "si", label: "සිංහල" },
  { value: "ta", label: "தமிழ்" },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage, strings } = useTrip();

  return (
    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
      <span>{strings.language}</span>
      <select
        className="glass-panel rounded-full px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-300"
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
