import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({
  className = "h-10 w-10 sm:h-11 sm:w-11",
  size = 44,
}: BrandLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none transition-transform duration-200 group-hover:scale-105 ${className}`}
    >
      {/* Exact eco-fintech overlapping leaf/loop logo from uploaded design */}
      <Image
        src="/images/logo.png"
        alt="kabaadse eco leaf loop logo"
        width={size}
        height={size}
        priority
        quality={100}
        className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(5,150,105,0.25)]"
      />
    </div>
  );
}
