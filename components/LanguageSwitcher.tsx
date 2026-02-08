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
    <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-(--muted)">
      <span>{strings.language}</span>
      <select
        className="nav-chip text-xs font-semibold"
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
