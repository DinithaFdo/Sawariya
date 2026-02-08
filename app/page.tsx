"use client";

import { Compass, Heart, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    <div className="min-h-screen pb-24">
      <nav className="nav-shell mx-auto mt-6 flex w-[min(1440px,94%)] items-center justify-between rounded-full px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">සවාරිය</p>
            <p className="text-xs text-[color:var(--muted)]">Sawariya</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pt-8 sm:px-8 lg:px-12">
        <section className="hero-shell">
          <div className="hero-map">
            <MapComponent
              locations={locations}
              loadingLabel={strings.mapLoading}
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-search glass-panel rounded-full px-4 py-3">
            <SearchBar />
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
                {strings.itinerary}
              </p>
              <h2 className="font-display text-2xl font-semibold">
                {strings.itinerarySubtitle}
              </h2>
            </div>
            <button
              onClick={clearLocations}
              className="nav-chip text-xs font-semibold"
              title={strings.clearTrip}
            >
              {strings.clearTrip}
            </button>
          </div>
          <div className="route-scroll mt-6 flex gap-4 overflow-x-auto pb-6">
            {locations.length === 0 ? (
              <div className="glass-panel w-full rounded-2xl p-6 text-sm text-[color:var(--muted)]">
                {strings.noStops}
              </div>
            ) : (
              locations.map((location, index) => {
                const isLast = index === locations.length - 1;
                return (
                  <div key={location.id} className="route-card">
                    <div className="route-card__header">
                      <span className="route-card__dot" />
                      {!isLast ? <span className="route-card__line" /> : null}
                    </div>
                    <div className="route-card__box">
                      <div className="route-card__content">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
                          {strings.stopLabel} {index + 1}
                        </p>
                        <p className="route-card__title">{location.name}</p>
                      </div>
                      <button
                        onClick={() => removeLocation(location.id)}
                        className="route-card__close"
                        title={strings.removeStop}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="mt-12">
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
              aiPlannerRotateOne: strings.aiPlannerRotateOne,
              aiPlannerRotateTwo: strings.aiPlannerRotateTwo,
              aiPlannerRotateThree: strings.aiPlannerRotateThree,
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

        <footer className="mt-14 rounded-[32px] border border-black/10 bg-black px-6 py-8 text-center text-sm text-white sm:px-10">
          <p className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-rose-400" />
            <span>
              Built by{" "}
              <a href="https://www.dinitha.me" className="underline">
                Dinitha
              </a>
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
