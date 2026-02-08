"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Car, Clock, MapPin, Sparkles, Utensils } from "lucide-react";
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
  timeLabel: string;
  distanceKm?: number;
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

const toTimeLabel = (minutesFromMidnight: number) => {
  const hours = Math.floor(minutesFromMidnight / 60) % 24;
  const minutes = minutesFromMidnight % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};

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
  const [travelDistancesKm, setTravelDistancesKm] = useState<number[]>([]);
  const [totalTravelMinutes, setTotalTravelMinutes] = useState<number | null>(
    null,
  );
  const [isTravelLoading, setIsTravelLoading] = useState(false);
  const [rotateIndex, setRotateIndex] = useState(0);

  useEffect(() => {
    setResult(initialPlan);
  }, [initialPlan]);

  const rotatingTexts = useMemo(
    () => [
      strings.aiPlannerRotateOne,
      strings.aiPlannerRotateTwo,
      strings.aiPlannerRotateThree,
    ],
    [strings],
  );

  useEffect(() => {
    if (result || isPending) return;
    const interval = window.setInterval(() => {
      setRotateIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [result, isPending, rotatingTexts.length]);

  const nameMap = useMemo(() => buildNameMap(locations), [locations]);
  const orderedNames = useMemo(() => {
    if (!result) return [];
    return result.order.map((id) => nameMap.get(id) ?? id);
  }, [result, nameMap]);

  const routeSummary = useMemo(() => {
    if (!result || orderedNames.length === 0) return null;
    const start = orderedNames[0];
    const end = orderedNames[orderedNames.length - 1];
    return {
      start,
      end,
      count: orderedNames.length,
    };
  }, [result, orderedNames]);

  const timeEstimates = useMemo(() => {
    if (!result) return [];
    return result.timeEstimates.map((item) => ({
      label: nameMap.get(item.id) ?? item.id,
      minutes: item.minutes,
      id: item.id,
    }));
  }, [result, nameMap]);

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

    const steps: Omit<TimelineStep, "timeLabel">[] = [];

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
        const distanceKm = travelDistancesKm[index];
        steps.push({
          id: `travel-${stop.id}-${nextStop.id}`,
          icon: "travel",
          title: strings.travelLabel,
          subtitle: `${stop.name} → ${nextStop.name}`,
          minutes: travelMinutesValue,
          distanceKm,
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

    const baseStartMinutes =
      totalTripMinutes && totalTripMinutes > 480 ? 390 : 480;
    let current = baseStartMinutes;

    return steps.map((step) => {
      const timeLabel = toTimeLabel(current);
      current += step.minutes;
      return { ...step, timeLabel };
    });
  }, [
    result,
    timeEstimates,
    nameMap,
    strings,
    travelMinutes,
    travelDistancesKm,
    totalTripMinutes,
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
      setTravelDistancesKm([]);
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
        setTravelDistancesKm([]);
        setTotalTravelMinutes(null);
        setIsTravelLoading(false);
        return;
      }

      const minutes = data.legDurationsWithBufferSeconds.map((seconds) =>
        Math.max(1, Math.round(seconds / 60)),
      );
      const distancesKm = data.legDistancesMeters.map((meters) =>
        Math.max(0.1, Math.round(meters / 100) / 10),
      );
      setTravelMinutes(minutes);
      setTravelDistancesKm(distancesKm);
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
          <h3 className="font-display text-2xl font-semibold text-[color:var(--foreground)]">
            {strings.aiPlannerTitle}
          </h3>
          <p className="text-sm text-[color:var(--muted)]">
            {strings.aiPlannerSubtitle}
          </p>
        </div>
        <Sparkles className="h-7 w-7 text-emerald-500" />
      </div>

      <button
        onClick={handleOptimize}
        disabled={isDisabled}
        className="ai-cta mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>
          {isPending ? strings.aiPlannerLoading : strings.aiPlannerCta}
        </span>
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
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {locations.length < 2 && !result ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-[color:var(--muted)]">
          {strings.aiPlannerEmpty}
        </div>
      ) : null}

      {!result && !isPending && locations.length >= 2 ? (
        <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-6 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
            {strings.aiPlannerSubtitle}
          </p>
          <p className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">
            {rotatingTexts[rotateIndex]}
          </p>
        </div>
      ) : null}

      {isPending ? (
        <div className="mt-6 space-y-4">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-10 w-2/3" />
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-5 text-sm text-[color:var(--foreground)]">
          {routeSummary ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Start
                </p>
                <p className="mt-2 text-[color:var(--foreground)]">
                  {routeSummary.start}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Stops
                </p>
                <p className="mt-2 text-[color:var(--foreground)]">
                  {routeSummary.count}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  End
                </p>
                <p className="mt-2 text-[color:var(--foreground)]">
                  {routeSummary.end}
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/70 bg-white/70 p-4 sm:p-6">
            <div
              className="plan-timeline"
              aria-label={strings.optimizedOrderLabel}
            >
              <span className="plan-thread" />
              {timelineSteps.map((step) => {
                const icon =
                  step.icon === "travel" ? (
                    <Car className="h-4 w-4" />
                  ) : step.icon === "meal" ? (
                    <Utensils className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  );
                const travelMeta =
                  step.icon === "travel" && step.distanceKm
                    ? `${step.minutes} ${strings.minutesShort} drive • ${step.distanceKm} km`
                    : `${step.minutes} ${strings.minutesShort}`;

                return (
                  <div
                    key={step.id}
                    className={`plan-step plan-step--${step.icon}`}
                  >
                    <span className="plan-node">{icon}</span>
                    <div className={`plan-card plan-card--${step.icon}`}>
                      <div className="plan-card__header">
                        <p className="plan-card__title">{step.title}</p>
                        <span className="plan-card__time">
                          <Clock className="h-3 w-3" />
                          {step.timeLabel}
                        </span>
                      </div>
                      {step.subtitle ? (
                        <p className="plan-card__subtitle">{step.subtitle}</p>
                      ) : null}
                      <div className="plan-card__meta">
                        <span className="plan-card__duration">
                          {travelMeta}
                        </span>
                        {step.icon === "travel" ? (
                          <span className="plan-card__buffer">
                            Lankan buffer
                          </span>
                        ) : null}
                        {step.icon === "visit" ? (
                          <span className="plan-card__tip">
                            Tip: keep 10 min for photos.
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {strings.travelTimeLabel}
            </p>
            <p className="mt-2 text-[color:var(--foreground)]">
              {isTravelLoading || totalTravelMinutes === null
                ? strings.travelLoadingLabel
                : `${totalTravelMinutes} ${strings.minutesShort}`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {strings.totalTripTimeLabel}
              </p>
              <p className="mt-2 text-[color:var(--foreground)]">
                {totalTripMinutes === null
                  ? strings.totalTripLoadingLabel
                  : `${totalTripMinutes} ${strings.minutesShort}`}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {strings.bestStartTimeLabel}
              </p>
              <p className="mt-2 text-[color:var(--foreground)]">
                {bestStartTime ?? strings.totalTripLoadingLabel}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {strings.stayAreaLabel}
            </p>
            <p className="mt-2 text-[color:var(--foreground)]">
              {result.stayArea}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
