"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Location } from "@/lib/types";
import { fetchOsrmRoute, type RouteData } from "@/lib/osrm";

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];

const useRouteData = (locations: Location[]) => {
  const [route, setRoute] = useState<RouteData | null>(null);

  useEffect(() => {
    let active = true;
    const loadRoute = async () => {
      if (locations.length < 2) {
        setRoute(null);
        return;
      }
      const data = await fetchOsrmRoute(locations);
      if (active) setRoute(data);
    };
    void loadRoute();
    return () => {
      active = false;
    };
  }, [locations]);

  return route;
};

const MapAutoFit = ({ locations }: { locations: Location[] }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 10);
      return;
    }
    const bounds = locations.map((loc) => [loc.lat, loc.lng]) as Array<
      [number, number]
    >;
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [locations, map]);

  return null;
};

const configureLeafletIcons = () => {
  if (typeof window === "undefined") return;
  const iconRetinaUrl =
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
  const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
  const shadowUrl =
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
  L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
};

const MapClient = ({ locations }: { locations: Location[] }) => {
  const route = useRouteData(locations);
  const polyline = route?.coordinates ?? [];

  const pinIcon = useMemo(
    () =>
      L.divIcon({
        className: "trip-pin leaflet-div-icon",
        html: '<span class="trip-pin__pulse"></span><span class="trip-pin__core"></span>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
    [],
  );

  useEffect(() => {
    configureLeafletIcons();
  }, []);

  const markers = useMemo(
    () =>
      locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          title={location.name}
          icon={pinIcon}
        />
      )),
    [locations, pinIcon],
  );

  return (
    <MapContainer
      center={SRI_LANKA_CENTER}
      zoom={7}
      className="h-full min-h-[320px]"
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {markers}
      {polyline.length > 0 && (
        <>
          <Polyline
            positions={polyline}
            pathOptions={{
              color: "#0b0f1a",
              weight: 7,
              opacity: 0.85,
              lineCap: "round",
              lineJoin: "round",
              className: "route-base",
            }}
          />
          <Polyline
            positions={polyline}
            pathOptions={{
              color: "#0b0f1a",
              weight: 4,
              opacity: 0.65,
              lineCap: "round",
              lineJoin: "round",
              className: "route-pulse",
            }}
          />
        </>
      )}
      <MapAutoFit locations={locations} />
    </MapContainer>
  );
};

export default MapClient;
