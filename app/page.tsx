"use client";

import { Compass, Leaf, MapPin, Route, Sparkles, Waves } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTrip } from "@/components/TripProvider";

export default function Home() {
  const { locations, strings } = useTrip();

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl text-emerald-700">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {strings.appName}
              </p>
              <h1 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                {strings.heroTitle}
              </h1>
            </div>
          </div>
          <LanguageSwitcher />
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card flex flex-col gap-6 rounded-3xl p-8">
            <p className="text-lg text-slate-600 sm:text-xl">
              {strings.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
                <MapPin className="h-4 w-4" />
                {strings.startPlanning}
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200">
                <Sparkles className="h-4 w-4" />
                {strings.optimize}
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 text-emerald-600" />
                {strings.sriLankaNote}
              </div>
            </div>
          </div>
          <div className="glass-card flex flex-col gap-6 rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                  {strings.planTrip}
                </p>
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  {strings.aiPanelTitle}
                </h2>
              </div>
              <Waves className="h-8 w-8 text-sky-500" />
            </div>
            <p className="text-sm text-slate-600">{strings.aiPanelSubtitle}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {strings.locationsCount}
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {locations.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {strings.itinerary}
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {strings.sampleRouteShort}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  {strings.searchTitle}
                </h3>
                <p className="text-sm text-slate-600">
                  {strings.searchSubtitle}
                </p>
              </div>
              <Leaf className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                className="flex-1 rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-300"
                placeholder={strings.searchPlaceholder}
              />
              <button className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
                {strings.addStop}
              </button>
            </div>
          </div>
          <div className="glass-panel flex flex-col rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  {strings.map}
                </h3>
                <p className="text-sm text-slate-600">{strings.mapSubtitle}</p>
              </div>
              <Route className="h-8 w-8 text-sky-500" />
            </div>
            <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
              {strings.mapPlaceholder}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  {strings.itinerary}
                </h3>
                <p className="text-sm text-slate-600">
                  {strings.itinerarySubtitle}
                </p>
              </div>
              <button className="rounded-full border border-emerald-100 bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-700">
                {strings.clearTrip}
              </button>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
              {locations.length === 0
                ? strings.noStops
                : strings.sampleRouteLong}
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-slate-900">
              {strings.howItWorks}
            </h3>
            <div className="mt-6 grid gap-4 text-sm text-slate-600">
              <p>1. {strings.searchTitle}.</p>
              <p>2. {strings.mapSubtitle}</p>
              <p>3. {strings.optimize}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
