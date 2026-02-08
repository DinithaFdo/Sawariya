"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Car, MapPin, Sparkles, Utensils } from "lucide-react";
import type { Location } from "@/lib/types";
import { optimizeTrip } from "@/actions/optimizeTrip";
import { fetchOsrmLegDurations } from "@/lib/osrm";
import type { OptimizedTrip } from "@/lib/types";

type AIPlannerCardProps = {
  locations: Location[];
  initialPlan: OptimizedTrip | null;
  strings: {
    aiPlannerTitle: string;
    aiPlannerSubtitle: string;
    aiPlannerCta: string;
    aiPlannerEmpty: string;
    aiPlannerError: string;
    aiPlannerLoading: string;
    aiPlannerClearLabel: string;
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
  };
  onApplyOrder: (order: string[]) => void;
  onSavePlan: (plan: OptimizedTrip | null) => void;
};

type TimelineStep = {
  id: string;
  icon: "travel" | "visit" | "meal";
  title: string;
  subtitle?: string;
  minutes: number;
};

const DEFAULT_VISIT_MINUTES = 60;
const DEFAULT_TRAVEL_MINUTES = 45;
const MEAL_DURATIONS = {
  breakfast: 30,
  lunch: 45,
  dinner: 60,
};

const buildNameMap = (locations: Location[]) =>
  new Map(locations.map((loc) => [loc.id, loc.name]));

export const AIPlannerCard = ({
  locations,
  initialPlan,
  strings,
  onApplyOrder,
  onSavePlan,
}: AIPlannerCardProps) => {
  const [result, setResult] = useState<OptimizedTrip | null>(initialPlan);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [travelMinutes, setTravelMinutes] = useState<number[]>([]);
  const [totalTravelMinutes, setTotalTravelMinutes] = useState<number | null>(
    null,
  );
  const [isTravelLoading, setIsTravelLoading] = useState(false);

  useEffect(() => {
    setResult(initialPlan);
  }, [initialPlan]);

  const nameMap = useMemo(() => buildNameMap(locations), [locations]);
  const orderedNames = useMemo(() => {
    if (!result) return [];
    return result.order.map((id) => nameMap.get(id) ?? id);
  }, [result, nameMap]);

  const timeEstimates = useMemo(() => {
    if (!result) return [];
    return result.timeEstimates.map((item) => ({
      label: nameMap.get(item.id) ?? item.id,
      minutes: item.minutes,
      id: item.id,
    }));
  }, [result, nameMap]);

  const timelineSteps = useMemo(() => {
    if (!result) return [] as TimelineStep[];
    const timeMap = new Map(
      timeEstimates.map((item) => [item.id, item.minutes]),
    );
    const orderedStops = result.order.map((id) => ({
      id,
      name: nameMap.get(id) ?? id,
      minutes: timeMap.get(id) ?? DEFAULT_VISIT_MINUTES,
    }));

    const steps: TimelineStep[] = [];

    steps.push({
      id: "meal-breakfast",
      icon: "meal",
      title: strings.breakfastLabel,
      subtitle: result.mealSuggestions.breakfast || strings.mealLabel,
      minutes: MEAL_DURATIONS.breakfast,
    });

    const lunchInsertIndex = Math.max(1, Math.floor(orderedStops.length / 2));

    orderedStops.forEach((stop, index) => {
      steps.push({
        id: `visit-${stop.id}`,
        icon: "visit",
        title: stop.name,
        subtitle: strings.visitLabel,
        minutes: stop.minutes,
      });

      if (index === lunchInsertIndex - 1) {
        steps.push({
          id: "meal-lunch",
          icon: "meal",
          title: strings.lunchLabel,
          subtitle: result.mealSuggestions.lunch || strings.mealLabel,
          minutes: MEAL_DURATIONS.lunch,
        });
      }

      if (index < orderedStops.length - 1) {
        const nextStop = orderedStops[index + 1];
        const travelMinutesValue =
          travelMinutes[index] ?? DEFAULT_TRAVEL_MINUTES;
        steps.push({
          id: `travel-${stop.id}-${nextStop.id}`,
          icon: "travel",
          title: strings.travelLabel,
          subtitle: `${stop.name} → ${nextStop.name}`,
          minutes: travelMinutesValue,
        });
      }
    });

    steps.push({
      id: "meal-dinner",
      icon: "meal",
      title: strings.dinnerLabel,
      subtitle: result.mealSuggestions.dinner || strings.mealLabel,
      minutes: MEAL_DURATIONS.dinner,
    });

    return steps;
  }, [result, timeEstimates, nameMap, strings, travelMinutes]);

  const totalVisitMinutes = useMemo(() => {
    if (!result) return null;
    const estimateMap = new Map(
      timeEstimates.map((item) => [item.id, item.minutes]),
    );
    return result.order.reduce((sum, id) => {
      const minutes = estimateMap.get(id) ?? DEFAULT_VISIT_MINUTES;
      return sum + minutes;
    }, 0);
  }, [result, timeEstimates]);

  const totalMealMinutes = useMemo(() => {
    if (!result) return null;
    return (
      MEAL_DURATIONS.breakfast + MEAL_DURATIONS.lunch + MEAL_DURATIONS.dinner
    );
  }, [result]);

  const totalTripMinutes = useMemo(() => {
    if (!result) return null;
    if (isTravelLoading || totalTravelMinutes === null) return null;
    const visits = totalVisitMinutes ?? 0;
    const meals = totalMealMinutes ?? 0;
    return totalTravelMinutes + visits + meals;
  }, [
    result,
    isTravelLoading,
    totalTravelMinutes,
    totalVisitMinutes,
    totalMealMinutes,
  ]);

  const bestStartTime = useMemo(() => {
    if (!totalTripMinutes) return null;
    return totalTripMinutes > 480
      ? strings.bestStartTimeEarly
      : strings.bestStartTimeMorning;
  }, [totalTripMinutes, strings]);

  useEffect(() => {
    if (!result) return;
    const orderedLocations = result.order
      .map((id) => locations.find((loc) => loc.id === id))
      .filter((loc): loc is Location => Boolean(loc));

    if (orderedLocations.length < 2) {
      setTravelMinutes([]);
      setTotalTravelMinutes(null);
      return;
    }

    let active = true;
    const loadTravel = async () => {
      setIsTravelLoading(true);
      const data = await fetchOsrmLegDurations(orderedLocations);
      if (!active) return;
      if (!data) {
        setTravelMinutes([]);
        setTotalTravelMinutes(null);
        setIsTravelLoading(false);
        return;
      }

      const minutes = data.legDurationsWithBufferSeconds.map((seconds) =>
        Math.max(1, Math.round(seconds / 60)),
      );
      setTravelMinutes(minutes);
      setTotalTravelMinutes(
        Math.max(1, Math.round(data.totalDurationWithBufferSeconds / 60)),
      );
      setIsTravelLoading(false);
    };

    void loadTravel();
    return () => {
      active = false;
    };
  }, [result, locations]);

  const handleOptimize = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await optimizeTrip(locations);
        setResult(data);
        onSavePlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : strings.aiPlannerError);
      }
    });
  };

  const handleClearPlan = () => {
    setResult(null);
    onSavePlan(null);
  };

  const isDisabled = locations.length < 2 || isPending;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-slate-900">
            {strings.aiPlannerTitle}
          </h3>
          <p className="text-sm text-slate-600">{strings.aiPlannerSubtitle}</p>
        </div>
        <Sparkles className="h-7 w-7 text-emerald-500" />
      </div>

      <button
        onClick={handleOptimize}
        disabled={isDisabled}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? strings.aiPlannerLoading : strings.aiPlannerCta}
      </button>

      {result ? (
        <button
          onClick={() => onApplyOrder(result.order)}
          className="ml-3 mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200"
        >
          {strings.applyOrderLabel}
        </button>
      ) : null}

      {result ? (
        <button
          onClick={handleClearPlan}
          className="ml-3 mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300"
        >
          {strings.aiPlannerClearLabel}
        </button>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {locations.length < 2 && !result ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
          {strings.aiPlannerEmpty}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-5 text-sm text-slate-700">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {strings.optimizedOrderLabel}
            </p>
            <p className="mt-2 text-slate-800">{orderedNames.join(" → ")}</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/70 p-4 sm:p-5">
            <div className="space-y-6">
              {timelineSteps.map((step, index) => {
                const isLast = index === timelineSteps.length - 1;
                const icon =
                  step.icon === "travel" ? (
                    <Car className="h-4 w-4" />
                  ) : step.icon === "meal" ? (
                    <Utensils className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  );

                return (
                  <div key={step.id} className="relative pl-12">
                    {!isLast && (
                      <span className="absolute left-4 top-10 h-[calc(100%-1rem)] w-px bg-slate-200/70" />
                    )}
                    <span className="absolute left-0 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 text-emerald-700 shadow-sm">
                      {icon}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-base font-semibold text-slate-900">
                          {step.title}
                        </p>
                        {step.subtitle ? (
                          <p className="text-xs italic text-slate-500">
                            {step.subtitle}
                          </p>
                        ) : null}
                      </div>
                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {step.minutes} {strings.minutesShort}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {strings.travelTimeLabel}
            </p>
            <p className="mt-2 text-slate-800">
              {isTravelLoading || totalTravelMinutes === null
                ? strings.travelLoadingLabel
                : `${totalTravelMinutes} ${strings.minutesShort}`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {strings.totalTripTimeLabel}
              </p>
              <p className="mt-2 text-slate-800">
                {totalTripMinutes === null
                  ? strings.totalTripLoadingLabel
                  : `${totalTripMinutes} ${strings.minutesShort}`}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {strings.bestStartTimeLabel}
              </p>
              <p className="mt-2 text-slate-800">
                {bestStartTime ?? strings.totalTripLoadingLabel}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {strings.stayAreaLabel}
            </p>
            <p className="mt-2 text-slate-800">{result.stayArea}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
