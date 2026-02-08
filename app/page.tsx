"use client";

import { Compass, Leaf, MapPin, Route, Sparkles, Waves } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTrip } from "@/components/TripProvider";
import { SearchBar } from "@/components/SearchBar";
import { MapComponent } from "@/components/MapComponent";
import { AIPlannerCard } from "@/components/AIPlannerCard";
import { TripWatchlist } from "@/components/TripWatchlist";

export default function Home() {
  const {
    locations,
    language,
    strings,
    addLocation,
    removeLocation,
    clearLocations,
    applyOptimizedOrder,
    aiPlan,
    setAiPlan,
  } = useTrip();

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
              <SearchBar />
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
            <div className="map-shell mt-6 overflow-hidden rounded-2xl border border-white/70 bg-white/70">
              {locations.length === 0 ? (
                <div className="flex h-full min-h-[320px] items-center justify-center p-6 text-center text-sm text-slate-500">
                  {strings.mapPlaceholder}
                </div>
              ) : (
                <MapComponent
                  locations={locations}
                  loadingLabel={strings.mapLoading}
                />
              )}
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
              <button
                onClick={clearLocations}
                className="rounded-full border border-emerald-100 bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-700"
              >
                {strings.clearTrip}
              </button>
            </div>
            <div className="mt-6 grid gap-3">
              {locations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
                  {strings.noStops}
                </div>
              ) : (
                locations.map((location, index) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                        {strings.stopLabel} {index + 1}
                      </p>
                      <p className="text-slate-700">{location.name}</p>
                    </div>
                    <button
                      onClick={() => removeLocation(location.id)}
                      className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      {strings.removeStop}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <AIPlannerCard
            locations={locations}
            initialPlan={aiPlan}
            onApplyOrder={applyOptimizedOrder}
            onSavePlan={setAiPlan}
            strings={{
              aiPlannerTitle: strings.aiPlannerTitle,
              aiPlannerSubtitle: strings.aiPlannerSubtitle,
              aiPlannerCta: strings.aiPlannerCta,
              aiPlannerEmpty: strings.aiPlannerEmpty,
              aiPlannerError: strings.aiPlannerError,
              aiPlannerLoading: strings.aiPlannerLoading,
              aiPlannerClearLabel: strings.aiPlannerClearLabel,
              optimizedOrderLabel: strings.optimizedOrderLabel,
              timeAtStopLabel: strings.timeAtStopLabel,
              stayAreaLabel: strings.stayAreaLabel,
              mealLabel: strings.mealLabel,
              breakfastLabel: strings.breakfastLabel,
              lunchLabel: strings.lunchLabel,
              dinnerLabel: strings.dinnerLabel,
              minutesShort: strings.minutesShort,
              travelLabel: strings.travelLabel,
              visitLabel: strings.visitLabel,
              applyOrderLabel: strings.applyOrderLabel,
              travelTimeLabel: strings.travelTimeLabel,
              travelLoadingLabel: strings.travelLoadingLabel,
              totalTripTimeLabel: strings.totalTripTimeLabel,
              totalTripLoadingLabel: strings.totalTripLoadingLabel,
              bestStartTimeLabel: strings.bestStartTimeLabel,
              bestStartTimeEarly: strings.bestStartTimeEarly,
              bestStartTimeMorning: strings.bestStartTimeMorning,
            }}
          />
        </section>

        <TripWatchlist
          locations={locations}
          language={language}
          onAddLocation={addLocation}
          strings={{
            watchTitle: strings.watchTitle,
            watchSubtitle: strings.watchSubtitle,
            watchLoading: strings.watchLoading,
            watchEmpty: strings.watchEmpty,
            watchNearLabel: strings.watchNearLabel,
            watchRadiusLabel: strings.watchRadiusLabel,
            watchRadiusUnit: strings.watchRadiusUnit,
            watchFiltersLabel: strings.watchFiltersLabel,
            watchAddLabel: strings.watchAddLabel,
            watchAddedLabel: strings.watchAddedLabel,
            watchDistanceUnit: strings.watchDistanceUnit,
            categoryAttraction: strings.categoryAttraction,
            categoryMuseum: strings.categoryMuseum,
            categoryViewpoint: strings.categoryViewpoint,
            categoryHeritage: strings.categoryHeritage,
            categoryTemple: strings.categoryTemple,
            categoryPark: strings.categoryPark,
            categoryBeach: strings.categoryBeach,
            categoryWaterfall: strings.categoryWaterfall,
          }}
        />
      </main>
    </div>
  );
}
