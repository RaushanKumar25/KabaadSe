"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface CircularEconomyProps {
  onLearnMore?: () => void;
}

export default function CircularEconomy({ onLearnMore }: CircularEconomyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position normalized relative to center (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D tilt
  const springConfig = { stiffness: 150, damping: 15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map normalized coordinates to rotateX and rotateY (-7deg to +7deg)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const normalizedX = clientX / width - 0.5;
    const normalizedY = clientY / height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      const el = document.getElementById("how-it-works");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-6 sm:px-12 box-border relative overflow-hidden bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        {/* Left Column Graphic: Interactive 3D Perspective Tilt & Suspension Truck */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex flex-col items-center justify-center p-4 lg:p-8"
          style={{ perspective: 1000 }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative flex flex-col items-center justify-center w-full max-w-lg select-none"
          >
            {/* Idle Suspension Floating / Engine Vibration */}
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full z-10"
            >
              <Image
                src="/images/kabadsetruck.png"
                alt="KabaadSe Branded Collection Truck"
                width={1024}
                height={765}
                priority
                className="w-full max-h-[360px] h-auto object-contain pointer-events-none select-none"
              />
            </motion.div>

            {/* Dynamic Grounded Elliptical Soft Shadow */}
            <motion.div
              animate={{
                scale: [1, 0.93, 1],
                opacity: [0.35, 0.22, 0.35],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-3/4 h-5 sm:h-7 bg-black/40 dark:bg-black/80 rounded-[100%] blur-md -mt-3 sm:-mt-5 -z-0 pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Right Column (Content Block) */}
        <div className="flex flex-col justify-center">
          {/* Top Pill Badge */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/70 border border-emerald-500/30 dark:border-emerald-800/60 uppercase tracking-wider mb-4">
              About KabaadSe
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight tracking-tight mb-4 sm:mb-5">
            Sustainability &<br />Circular Economy
          </h2>

          {/* Description (Short, natural, non-AI copy) */}
          <p className="text-neutral-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-7 max-w-xl">
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">KabaadSe</strong> makes scrap selling simple, transparent, and rewarding. We connect your home directly with authorized recycling centers—ensuring fair digital weighing, instant payouts, and zero scrap in landfills.
          </p>

          {/* Action Button */}
          <div>
            <button
              type="button"
              onClick={handleLearnMore}
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Learn More <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
