"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Location } from "@/lib/types";

type MapComponentProps = {
  locations: Location[];
  loadingLabel: string;
};

export const MapComponent = ({
  locations,
  loadingLabel,
}: MapComponentProps) => {
  const MapClient = useMemo(
    () =>
      dynamic(() => import("@/components/MapClient"), {
        ssr: false,
        loading: () => (
          <div className="flex h-full min-h-80 items-center justify-center text-sm text-slate-500">
            {loadingLabel}
          </div>
        ),
      }),
    [loadingLabel],
  );

  return <MapClient locations={locations} />;
};
