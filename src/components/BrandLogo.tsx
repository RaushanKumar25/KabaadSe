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
      {/* Stylized K eco recycling bin brand logo */}
      <Image
        src="/images/logo.png"
        alt="KabaadSe Logo"
        width={size}
        height={size}
        priority
        quality={100}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
