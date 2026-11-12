"use client";

import React from "react";
import Image from "next/image";

interface CityTransitionSplashProps {
  cityName: string;
}

export default function CityTransitionSplash({ cityName }: CityTransitionSplashProps) {
  const destination = cityName
    ? cityName.toLowerCase() === "patna"
      ? "patna"
      : cityName
    : "patna";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[999999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <style>{`
        @keyframes logoBreathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.95;
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
          }
        }
      `}</style>

      {/* Main KabaadSe Logo */}
      <div className="relative flex items-center justify-center">
        <div
          style={{ animation: "logoBreathe 2s ease-in-out infinite" }}
          className="relative flex items-center justify-center"
        >
          <Image
            src="/images/logo.png"
            alt="KabaadSe Logo"
            width={112}
            height={112}
            priority
            quality={100}
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain select-none pointer-events-none"
          />
        </div>
      </div>

      {/* Heading towards the city */}
      <div className="mt-6 text-center">
        <h2 className="text-sm sm:text-base font-semibold tracking-wider text-[#5EDC1F]">
          Heading towards {destination}
        </h2>
      </div>
    </div>
  );
}
