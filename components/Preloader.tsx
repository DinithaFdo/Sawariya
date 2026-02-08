"use client";

import { useEffect, useState } from "react";
import { CarFront } from "lucide-react";

const STORAGE_KEY = "sawariya_preloaded";

export const Preloader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasLoaded = localStorage.getItem(STORAGE_KEY);
    if (hasLoaded) return;
    const raf = window.requestAnimationFrame(() => {
      setVisible(true);
    });

    const timeout = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "true");
      setVisible(false);
    }, 1600);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader">
      <div className="preloader__card">
        <p className="preloader__logo">සවාරිය</p>
        <div className="preloader__track">
          <div className="preloader__car">
            <CarFront className="h-5 w-5" />
          </div>
          <div className="preloader__bar" />
        </div>
        <p className="preloader__subtitle">Preparing your journey...</p>
      </div>
    </div>
  );
};
