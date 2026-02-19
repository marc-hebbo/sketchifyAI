"use client";

import { useEffect, useState } from "react";

const Preloader = ({ children }: { children: React.ReactNode }) => {
  const [phase, setPhase] = useState<"drawing" | "pausing" | "fading" | "done">("drawing");

  useEffect(() => {
    const drawTimer = setTimeout(() => setPhase("pausing"), 2500);
    const pauseTimer = setTimeout(() => setPhase("fading"), 3300);
    const doneTimer = setTimeout(() => setPhase("done"), 4000);

    return () => {
      clearTimeout(drawTimer);
      clearTimeout(pauseTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          phase === "fading" ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>

      <div
        className={`preloader-overlay ${phase === "fading" ? "preloader-fade-out" : ""}`}
      >
        <div className="preloader-content">
          <svg
            className="preloader-svg"
            viewBox="0 0 480 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="240"
              y="55"
              textAnchor="middle"
              className="preloader-text"
            >
              Sketchify
            </text>
          </svg>

          <p
            className={`preloader-tagline ${
              phase !== "drawing" ? "preloader-tagline-visible" : ""
            }`}
          >
            sketch to interface
          </p>
        </div>
      </div>
    </>
  );
};

export default Preloader;
