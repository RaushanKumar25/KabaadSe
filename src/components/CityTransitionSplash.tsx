"use client";

import React from "react";
import Image from "next/image";

interface CityTransitionSplashProps {
  cityName: string;
}

export default function CityTransitionSplash({ cityName }: CityTransitionSplashProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[999999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <style>{`
        @keyframes truckDrive {
          0% {
            transform: translateX(-130%);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          40% {
            transform: translateX(-8%);
          }
          60% {
            transform: translateX(8%);
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(130%);
            opacity: 0;
          }
        }

        @keyframes truckBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2.5px);
          }
        }

        @keyframes roadDashes {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes speedLines {
          0% {
            opacity: 0.3;
            transform: scaleX(0.7);
          }
          50% {
            opacity: 0.9;
            transform: scaleX(1.15);
          }
          100% {
            opacity: 0.3;
            transform: scaleX(0.7);
          }
        }
      `}</style>

      {/* Ambient subtle green glow in the pure black backdrop */}
      <div className="absolute w-[450px] h-[350px] bg-[#5EDC1F]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Truck & Road Stage */}
      <div className="relative flex flex-col items-center justify-center py-4">
        {/* Driving Truck with bounce & speed trails - 2.2s duration with smooth cubic-bezier easing */}
        <div
          className="relative flex items-center justify-center"
          style={{
            animation: "truckDrive 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards",
          }}
        >
          {/* Suspension vibration bounce - 0.45s loop for natural vehicle rumble */}
          <div
            className="relative flex items-center"
            style={{
              animation: "truckBounce 0.45s ease-in-out infinite",
            }}
          >
            {/* Speed motion trail lines behind the truck (left side) */}
            <div
              className="absolute right-full top-1/2 -translate-y-1/2 mr-2 flex flex-col gap-1.5 pointer-events-none"
              style={{ animation: "speedLines 0.35s ease-in-out infinite" }}
            >
              <span className="w-12 sm:w-16 h-[2px] bg-gradient-to-l from-[#5EDC1F] to-transparent rounded-full shadow-[0_0_8px_rgba(94,220,31,0.8)]" />
              <span className="w-8 sm:w-12 h-[1.5px] bg-gradient-to-l from-[#5EDC1F]/80 to-transparent rounded-full" />
              <span className="w-14 sm:w-20 h-[2px] bg-gradient-to-l from-[#5EDC1F]/50 to-transparent rounded-full" />
            </div>

            {/* Lime-Green Filtered Cargo Truck */}
            <Image
              src="/images/truck.png"
              alt="KabaadSe Cargo Truck"
              width={144}
              height={144}
              priority
              quality={100}
              className="w-28 sm:w-36 h-auto drop-shadow-[0_0_15px_rgba(94,220,31,0.4)] select-none pointer-events-none"
              style={{
                filter:
                  "invert(72%) sepia(85%) saturate(450%) hue-rotate(55deg) brightness(105%) contrast(105%)",
              }}
            />
          </div>
        </div>

        {/* Road Track Line */}
        <div className="w-64 sm:w-80 h-[2px] bg-neutral-800 relative overflow-hidden mt-2 rounded-full">
          {/* Moving road dashes rushing right-to-left */}
          <div
            className="absolute inset-y-0 left-0 w-[200%] flex"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #5EDC1F 0px, #5EDC1F 12px, transparent 12px, transparent 24px)",
              animation: "roadDashes 0.5s linear infinite",
              boxShadow: "0 0 8px rgba(94, 220, 31, 0.5)",
            }}
          />
        </div>
      </div>

      {/* Text Below the Truck - Crisp & High Visibility throughout the 2.2s animation */}
      <div className="flex flex-col items-center text-center mt-6 z-10 space-y-1.5 px-4">
        <h2 className="text-xs sm:text-sm font-bold tracking-widest text-[#5EDC1F] uppercase drop-shadow-[0_0_10px_rgba(94,220,31,0.5)]">
          Heading to {cityName}...
        </h2>
        <p className="text-[11px] sm:text-xs font-mono tracking-wider text-neutral-300 uppercase flex items-center justify-center gap-2">
          <span>KabaadSe On The Way</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#5EDC1F] animate-ping" />
          <span className="text-neutral-400">Fetching live scrap rates</span>
        </p>
      </div>
    </div>
  );
}
