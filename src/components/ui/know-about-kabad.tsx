"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Recycle,
  Sparkles,
  Info,
  Pause,
  Play,
  CheckCircle2,
} from "lucide-react";

export interface KnowAboutKabadProps {
  onSellScrap?: (categoryName: string) => void;
  className?: string;
}

export interface ScrapItem {
  id: string;
  name: string;
  hindiName?: string;
  iconSvg: React.ReactNode;
}

export interface RecycledProduct {
  name: string;
  iconSvg: React.ReactNode;
}

export interface KabadCategory {
  id: string;
  name: string;
  title: string;
  slug: string;
  pastelBg: string;
  darkBg: string;
  borderTint: string;
  tagColor: string;
  annualStat: string;
  annualNumber: string;
  recycleRate: number;
  description: string;
  items: ScrapItem[];
  recycledProducts: RecycledProduct[];
  cardIllustration: React.ReactNode;
  detailIllustration: React.ReactNode;
}

// -------------------------------------------------------------
// SVG ILLUSTRATIONS FOR CARDS & ITEMS
// -------------------------------------------------------------

function PlasticBinIllustration() {
  return (
    <svg viewBox="0 0 280 240" className="w-full h-full max-h-56 object-contain" fill="none">
      {/* Background soft glow */}
      <circle cx="140" cy="120" r="100" fill="#E0F2FE" fillOpacity="0.5" />
      {/* Waste Bin */}
      <rect x="75" y="85" width="130" height="110" rx="10" fill="#94A3B8" />
      <rect x="85" y="95" width="110" height="90" rx="6" fill="#64748B" />
      <rect x="70" y="78" width="140" height="12" rx="4" fill="#CBD5E1" />
      {/* Overflowing Plastic Bottles & Items */}
      {/* Purple bottle */}
      <rect x="122" y="30" width="36" height="58" rx="6" fill="#A855F7" />
      <rect x="133" y="18" width="14" height="14" rx="2" fill="#7E22CE" />
      <rect x="128" y="48" width="24" height="6" fill="#FFFFFF" fillOpacity="0.4" />
      {/* Orange Jug */}
      <path
        d="M138 48 C145 35 175 35 182 48 L188 88 C188 92 184 96 180 96 L140 96 C136 96 132 92 132 88 Z"
        fill="#FB923C"
      />
      <circle cx="160" cy="36" r="6" fill="#EA580C" />
      <path d="M174 54 C184 62 184 76 174 84" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
      {/* White/Cyan Lotion Bottle */}
      <path d="M128 55 L152 55 L146 95 L134 95 Z" fill="#E2E8F0" />
      <rect x="130" y="65" width="20" height="14" fill="#38BDF8" rx="2" />
      {/* Green bottle left */}
      <rect x="90" y="52" width="24" height="42" rx="4" fill="#4ADE80" />
      <rect x="97" y="44" width="10" height="10" rx="2" fill="#16A34A" />
      {/* Light yellow bottle */}
      <rect x="110" y="50" width="20" height="45" rx="4" fill="#FDE047" />
      <rect x="116" y="42" width="8" height="10" rx="2" fill="#CA8A04" />
      {/* Foreground Yellow Shopping Bag */}
      <path
        d="M75 125 C75 110 82 105 88 105 C94 105 96 114 96 122 L98 175 C98 182 92 186 85 186 C78 186 73 182 73 175 Z"
        fill="#FACC15"
      />
      <path
        d="M94 125 C94 110 101 105 107 105 C113 105 115 114 115 122 L117 175 C117 182 111 186 104 186 C97 186 92 182 92 175 Z"
        fill="#EAB308"
      />
      <path d="M84 120 C84 108 106 108 106 120" stroke="#CA8A04" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Blue Water Bottles in foreground */}
      <rect x="115" y="135" width="24" height="48" rx="5" fill="#38BDF8" />
      <rect x="123" y="127" width="8" height="10" rx="2" fill="#0284C7" />
      <rect x="118" y="152" width="18" height="6" fill="#FFFFFF" fillOpacity="0.5" />
      {/* Orange container in foreground */}
      <rect x="138" y="142" width="30" height="42" rx="5" fill="#FB923C" />
      <rect x="148" y="135" width="10" height="9" rx="2" fill="#C2410C" />
      {/* Purple bottle right */}
      <rect x="180" y="125" width="26" height="58" rx="6" fill="#C084FC" />
      <rect x="189" y="116" width="8" height="11" rx="2" fill="#7E22CE" />
      <rect x="182" y="146" width="22" height="6" fill="#FFFFFF" fillOpacity="0.6" />
    </svg>
  );
}

function PaperIllustration() {
  return (
    <svg viewBox="0 0 280 240" className="w-full h-full max-h-56 object-contain" fill="none">
      <circle cx="140" cy="120" r="100" fill="#FFEDD5" fillOpacity="0.6" />
      {/* Big Cardboard Box */}
      <path d="M80 100 L140 75 L205 98 L145 125 Z" fill="#F59E0B" />
      <path d="M80 100 L145 125 L145 190 L80 160 Z" fill="#D97706" />
      <path d="M145 125 L205 98 L205 165 L145 190 Z" fill="#B45309" />
      {/* Box Flaps */}
      <path d="M78 98 L110 82 L120 102 L86 114 Z" fill="#FBBF24" />
      <path d="M208 96 L175 80 L168 100 L200 114 Z" fill="#D97706" />
      {/* Newspaper sticking out */}
      <path d="M115 50 L165 42 L168 95 L118 100 Z" fill="#E2E8F0" />
      <rect x="122" y="55" width="34" height="4" fill="#64748B" rx="1" />
      <rect x="122" y="62" width="28" height="3" fill="#94A3B8" rx="1" />
      <rect x="122" y="68" width="36" height="3" fill="#94A3B8" rx="1" />
      <rect x="122" y="74" width="30" height="3" fill="#94A3B8" rx="1" />
      {/* Stacked sheets */}
      <path d="M135 60 L185 52 L188 95 L138 102 Z" fill="#CBD5E1" />
      <rect x="142" y="66" width="30" height="3" fill="#64748B" rx="1" />
      {/* Kraft Paper Bag on the left */}
      <path d="M55 120 L80 115 L88 178 L60 182 Z" fill="#D97706" />
      <path d="M55 120 L48 135 L52 180 L60 182 Z" fill="#B45309" />
      {/* Paper Cups in front */}
      <path d="M60 160 L78 158 L74 195 L63 195 Z" fill="#FEF3C7" />
      <ellipse cx="69" cy="159" rx="9" ry="3" fill="#FDE68A" />
      <ellipse cx="68.5" cy="195" rx="5.5" ry="2" fill="#D97706" />
    </svg>
  );
}

function MetalIllustration() {
  return (
    <svg viewBox="0 0 280 240" className="w-full h-full max-h-56 object-contain" fill="none">
      <circle cx="140" cy="120" r="100" fill="#FFE4E6" fillOpacity="0.6" />
      {/* Rusty Metal Drum */}
      <ellipse cx="98" cy="95" rx="30" ry="12" fill="#9A3412" />
      <rect x="68" y="95" width="60" height="75" fill="#7C2D12" />
      <ellipse cx="98" cy="170" rx="30" ry="12" fill="#9A3412" />
      <ellipse cx="98" cy="95" rx="26" ry="9" fill="#C2410C" />
      <line x1="68" y1="125" x2="128" y2="125" stroke="#431407" strokeWidth="2" />
      {/* Golden Brass Utensil (Lota/Kalash) */}
      <ellipse cx="180" cy="85" rx="22" ry="7" fill="#EAB308" />
      <path
        d="M162 85 C162 105 148 115 152 135 C156 155 204 155 208 135 C212 115 198 105 198 85 Z"
        fill="#CA8A04"
      />
      <ellipse cx="180" cy="138" rx="22" ry="10" fill="#EAB308" />
      <ellipse cx="180" cy="155" rx="16" ry="5" fill="#A16207" />
      {/* Tin Food Cans */}
      <ellipse cx="130" cy="130" rx="20" ry="7" fill="#CBD5E1" />
      <rect x="110" y="130" width="40" height="45" fill="#94A3B8" />
      <ellipse cx="130" cy="175" rx="20" ry="7" fill="#64748B" />
      <ellipse cx="130" cy="130" rx="17" ry="5" fill="#E2E8F0" />
      {/* Iron Bar / Pipe lying down */}
      <path d="M70 178 L195 194 L193 204 L68 188 Z" fill="#475569" />
      <ellipse cx="70" cy="183" rx="4" ry="7" fill="#334155" />
    </svg>
  );
}

function EWasteIllustration() {
  return (
    <svg viewBox="0 0 280 240" className="w-full h-full max-h-56 object-contain" fill="none">
      <circle cx="140" cy="120" r="100" fill="#E0E7FF" fillOpacity="0.6" />
      {/* Retro CRT Monitor */}
      <rect x="75" y="60" width="90" height="75" rx="8" fill="#D1D5DB" />
      <rect x="83" y="68" width="74" height="58" rx="6" fill="#374151" />
      <rect x="88" y="72" width="64" height="50" rx="4" fill="#1F2937" />
      <circle cx="152" cy="130" r="3" fill="#10B981" />
      {/* Monitor base */}
      <polygon points="105,135 135,135 142,148 98,148" fill="#9CA3AF" />
      <rect x="94" y="148" width="52" height="6" rx="2" fill="#6B7280" />
      {/* Keyboard */}
      <polygon points="120,150 200,150 215,190 105,190" fill="#D1D5DB" />
      <polygon points="124,154 196,154 208,186 112,186" fill="#4B5563" />
      {/* Key grid hint */}
      <line x1="120" y1="162" x2="202" y2="162" stroke="#9CA3AF" strokeWidth="1.5" />
      <line x1="116" y1="170" x2="205" y2="170" stroke="#9CA3AF" strokeWidth="1.5" />
      <line x1="114" y1="178" x2="208" y2="178" stroke="#9CA3AF" strokeWidth="1.5" />
      {/* Mouse */}
      <rect x="210" y="165" width="22" height="32" rx="9" fill="#E5E7EB" />
      <line x1="221" y1="165" x2="221" y2="178" stroke="#9CA3AF" strokeWidth="1.5" />
      {/* Coiled wires */}
      <path
        d="M170 170 Q185 195 195 180 T220 185"
        stroke="#4B5563"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OtherIllustration() {
  return (
    <svg viewBox="0 0 280 240" className="w-full h-full max-h-56 object-contain" fill="none">
      <circle cx="140" cy="120" r="100" fill="#FEF9C3" fillOpacity="0.6" />
      {/* Heavy Lead Acid Battery */}
      <rect x="125" y="95" width="65" height="85" rx="6" fill="#0284C7" />
      <rect x="135" y="85" width="14" height="12" rx="2" fill="#DC2626" />
      <rect x="165" y="85" width="14" height="12" rx="2" fill="#1E293B" />
      <text x="138" y="93" fill="white" fontSize="9" fontWeight="bold">
        +
      </text>
      <text x="169" y="93" fill="white" fontSize="9" fontWeight="bold">
        -
      </text>
      {/* Battery Lightning Bolt Icon */}
      <polygon points="160,115 150,135 158,135 152,158 168,132 160,132" fill="#FACC15" />
      {/* Hair / Wool Tuft on left */}
      <path
        d="M60 145 C50 120 75 95 95 110 C110 90 135 105 130 125 C140 140 125 170 100 165 C80 175 55 160 60 145 Z"
        fill="#5C3D2E"
      />
      <path
        d="M68 140 C75 130 90 132 95 145"
        stroke="#784C38"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Dry Cell Batteries lying on ground */}
      <rect x="75" y="175" width="38" height="18" rx="4" fill="#64748B" />
      <rect x="113" y="179" width="4" height="10" rx="1" fill="#CBD5E1" />
      <rect x="85" y="175" width="16" height="18" fill="#F59E0B" />
      {/* Glass Bottle */}
      <rect x="195" y="125" width="22" height="50" rx="4" fill="#059669" fillOpacity="0.85" />
      <rect x="202" y="112" width="8" height="15" rx="2" fill="#047857" />
    </svg>
  );
}

// -------------------------------------------------------------
// 30+ ITEM ICONS (CLEAN VECTOR DISCS)
// -------------------------------------------------------------

function ItemDiscIcon({ type }: { type: string }) {
  switch (type) {
    case "plastic-bag":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path
            d="M12 18 C12 10 18 8 24 8 C30 8 36 10 36 18 L38 38 C38 41 35 43 31 43 L17 43 C13 43 10 41 10 38 Z"
            fill="#38BDF8"
          />
          <path d="M19 18 C19 13 29 13 29 18 L29 24 C29 26 19 26 19 24 Z" fill="#E0F2FE" />
        </svg>
      );
    case "plastic-bori":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path
            d="M14 16 L20 12 L28 12 L34 16 L36 38 C36 41 33 43 29 43 L19 43 C15 43 12 41 12 38 Z"
            fill="#FACC15"
          />
          <path d="M18 15 Q24 18 30 15" stroke="#CA8A04" strokeWidth="2" fill="none" />
          <line x1="15" y1="26" x2="33" y2="26" stroke="#EAB308" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="15" y1="34" x2="33" y2="34" stroke="#EAB308" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      );
    case "plastic-bottle":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="18" y="15" width="12" height="25" rx="3" fill="#38BDF8" />
          <rect x="22" y="9" width="4" height="6" rx="1" fill="#0284C7" />
          <line x1="18" y1="24" x2="30" y2="24" stroke="white" strokeWidth="2" strokeOpacity="0.6" />
          <rect x="13" y="20" width="8" height="19" rx="2" fill="#7DD3FC" />
          <rect x="15" y="15" width="4" height="5" rx="1" fill="#0284C7" />
        </svg>
      );
    case "blue-drum":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <ellipse cx="24" cy="13" rx="13" ry="5" fill="#0284C7" />
          <rect x="11" y="13" width="26" height="23" fill="#0369A1" />
          <ellipse cx="24" cy="36" rx="13" ry="5" fill="#0284C7" />
          <ellipse cx="24" cy="13" rx="11" ry="3.5" fill="#38BDF8" />
          <line x1="11" y1="23" x2="37" y2="23" stroke="#075985" strokeWidth="2" />
        </svg>
      );
    case "fibre":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <ellipse cx="24" cy="16" rx="14" ry="7" fill="#F1F5F9" />
          <rect x="10" y="16" width="28" height="18" fill="#E2E8F0" />
          <ellipse cx="24" cy="34" rx="14" ry="7" fill="#CBD5E1" />
          <ellipse cx="24" cy="16" rx="8" ry="4" fill="#94A3B8" />
        </svg>
      );
    case "crate":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="9" y="15" width="30" height="20" rx="3" fill="#2563EB" />
          <rect x="12" y="18" width="5" height="6" rx="1" fill="#1D4ED8" />
          <rect x="19" y="18" width="5" height="6" rx="1" fill="#1D4ED8" />
          <rect x="26" y="18" width="5" height="6" rx="1" fill="#1D4ED8" />
          <rect x="33" y="18" width="4" height="6" rx="1" fill="#1D4ED8" />
          <rect x="14" y="27" width="20" height="4" rx="1" fill="#60A5FA" />
        </svg>
      );
    case "pvc-pipe":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="9" y="12" width="30" height="7" rx="2" fill="#E2E8F0" />
          <ellipse cx="9" cy="15.5" rx="2.5" ry="3.5" fill="#CBD5E1" />
          <rect x="9" y="21" width="30" height="7" rx="2" fill="#E2E8F0" />
          <ellipse cx="9" cy="24.5" rx="2.5" ry="3.5" fill="#CBD5E1" />
          <rect x="9" y="30" width="30" height="7" rx="2" fill="#E2E8F0" />
          <ellipse cx="9" cy="33.5" rx="2.5" ry="3.5" fill="#CBD5E1" />
        </svg>
      );
    case "can-5l":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="14" y="14" width="20" height="24" rx="4" fill="#F8FAFC" />
          <rect x="25" y="9" width="6" height="5" rx="1" fill="#0284C7" />
          <path d="M18 14 L18 20 L23 20 L23 14" stroke="#CBD5E1" strokeWidth="2" fill="none" />
        </svg>
      );
    case "newspaper":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="11" width="28" height="26" rx="2" fill="#F1F5F9" />
          <rect x="14" y="15" width="20" height="4" rx="1" fill="#334155" />
          <rect x="14" y="22" width="10" height="3" fill="#94A3B8" />
          <rect x="14" y="27" width="20" height="2" fill="#CBD5E1" />
          <rect x="14" y="31" width="18" height="2" fill="#CBD5E1" />
          <rect x="26" y="22" width="8" height="4" fill="#CBD5E1" />
        </svg>
      );
    case "cardboard":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path d="M10 18 L24 10 L38 18 L24 25 Z" fill="#F59E0B" />
          <path d="M10 18 L24 25 L24 38 L10 31 Z" fill="#D97706" />
          <path d="M24 25 L38 18 L38 31 L24 38 Z" fill="#B45309" />
        </svg>
      );
    case "office-paper":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="14" y="10" width="22" height="28" rx="2" fill="#FFFFFF" />
          <polygon points="30,10 36,16 30,16" fill="#CBD5E1" />
          <line x1="18" y1="20" x2="30" y2="20" stroke="#94A3B8" strokeWidth="2" />
          <line x1="18" y1="25" x2="30" y2="25" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="18" y1="30" x2="26" y2="30" stroke="#CBD5E1" strokeWidth="2" />
        </svg>
      );
    case "books":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="11" y="28" width="26" height="8" rx="2" fill="#3B82F6" />
          <rect x="12" y="20" width="24" height="8" rx="2" fill="#10B981" />
          <rect x="13" y="12" width="22" height="8" rx="2" fill="#F59E0B" />
        </svg>
      );
    case "iron-steel":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="8" y="14" width="32" height="6" rx="2" fill="#64748B" />
          <rect x="8" y="24" width="32" height="6" rx="2" fill="#475569" />
          <rect x="8" y="34" width="32" height="6" rx="2" fill="#334155" />
          <circle cx="12" cy="17" r="1.5" fill="#94A3B8" />
          <circle cx="20" cy="17" r="1.5" fill="#94A3B8" />
          <circle cx="28" cy="17" r="1.5" fill="#94A3B8" />
        </svg>
      );
    case "copper-wire":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <circle cx="24" cy="24" r="13" stroke="#B45309" strokeWidth="4" fill="none" />
          <circle cx="24" cy="24" r="8" stroke="#D97706" strokeWidth="3" fill="none" />
          <circle cx="24" cy="24" r="3" fill="#EA580C" />
        </svg>
      );
    case "brass":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <ellipse cx="24" cy="14" rx="10" ry="3.5" fill="#FACC15" />
          <path d="M15 14 C15 22 10 26 12 34 C14 38 34 38 36 34 C38 26 33 22 33 14 Z" fill="#CA8A04" />
          <ellipse cx="24" cy="28" rx="11" ry="4" fill="#FDE047" />
        </svg>
      );
    case "aluminium":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <ellipse cx="24" cy="14" rx="9" ry="4" fill="#E2E8F0" />
          <rect x="15" y="14" width="18" height="22" fill="#CBD5E1" />
          <ellipse cx="24" cy="36" rx="9" ry="4" fill="#94A3B8" />
          <rect x="18" y="21" width="12" height="8" rx="1" fill="#DC2626" />
        </svg>
      );
    case "laptop":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="12" y="13" width="24" height="17" rx="2" fill="#475569" />
          <rect x="14" y="15" width="20" height="13" rx="1" fill="#0F172A" />
          <polygon points="8,35 40,35 37,30 11,30" fill="#94A3B8" />
          <rect x="21" y="32" width="6" height="2" rx="1" fill="#64748B" />
        </svg>
      );
    case "monitor":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="11" width="28" height="21" rx="3" fill="#D1D5DB" />
          <rect x="13" y="14" width="22" height="15" rx="2" fill="#1F2937" />
          <polygon points="21,32 27,32 29,38 19,38" fill="#9CA3AF" />
        </svg>
      );
    case "smartphone":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="16" y="9" width="16" height="30" rx="4" fill="#1E293B" />
          <rect x="18" y="12" width="12" height="22" rx="1" fill="#38BDF8" />
          <circle cx="24" cy="36" r="1.5" fill="#94A3B8" />
        </svg>
      );
    case "cables":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path
            d="M12 18 Q24 35 36 18 Q24 45 14 32"
            stroke="#10B981"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="33" y="15" width="6" height="8" rx="2" fill="#1E293B" />
        </svg>
      );
    case "battery":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="12" y="16" width="24" height="22" rx="3" fill="#0369A1" />
          <rect x="15" y="12" width="6" height="4" rx="1" fill="#DC2626" />
          <rect x="27" y="12" width="6" height="4" rx="1" fill="#334155" />
          <polygon points="25,21 21,27 25,27 23,33 28,26 25,26" fill="#FACC15" />
        </svg>
      );
    case "glass":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="18" y="20" width="12" height="19" rx="3" fill="#059669" fillOpacity="0.8" />
          <rect x="22" y="12" width="4" height="8" rx="1" fill="#047857" />
          <line x1="21" y1="23" x2="21" y2="34" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
      );
    case "inverter":
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="15" width="28" height="18" rx="3" fill="#334155" />
          <rect x="13" y="19" width="10" height="4" rx="1" fill="#22C55E" />
          <circle cx="28" cy="21" r="2" fill="#F59E0B" />
          <circle cx="34" cy="21" r="2" fill="#EF4444" />
          <line x1="10" y1="27" x2="38" y2="27" stroke="#475569" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <circle cx="24" cy="24" r="14" fill="#E2E8F0" />
          <path
            d="M24 16 L27 22 L33 22 L28 26 L30 32 L24 28 L18 32 L20 26 L15 22 L21 22 Z"
            fill="#94A3B8"
          />
        </svg>
      );
  }
}

// -------------------------------------------------------------
// DATA SEED FOR 5 CATEGORIES
// -------------------------------------------------------------

export const KABAD_CATEGORIES: KabadCategory[] = [
  {
    id: "plastic",
    name: "PLASTIC",
    title: "Plastic Scrap",
    slug: "plastic",
    pastelBg: "bg-[#E6F4FF]",
    darkBg: "dark:bg-[#0c1f30]",
    borderTint: "border-sky-200/80 dark:border-sky-900/50",
    tagColor: "text-sky-700 dark:text-sky-300",
    annualStat: "3.4 million",
    annualNumber: "3.4 million",
    recycleRate: 60,
    description: "Rigid & flexible polymers including PET bottles, HDPE drums, PP crates, and PVC conduit pipes.",
    cardIllustration: <PlasticBinIllustration />,
    detailIllustration: <PlasticBinIllustration />,
    items: [
      { id: "p1", name: "Plastic Bags", hindiName: "Polythene", iconSvg: <ItemDiscIcon type="plastic-bag" /> },
      { id: "p2", name: "Plastic Bori", hindiName: "Katta / Sacks", iconSvg: <ItemDiscIcon type="plastic-bori" /> },
      { id: "p3", name: "Plastic Bottle", hindiName: "PET Water / Soda", iconSvg: <ItemDiscIcon type="plastic-bottle" /> },
      { id: "p4", name: "Blue Drum", hindiName: "Water / Chemical Barrel", iconSvg: <ItemDiscIcon type="blue-drum" /> },
      { id: "p5", name: "Fibre", hindiName: "Synthetic Spools", iconSvg: <ItemDiscIcon type="fibre" /> },
      { id: "p6", name: "Crate", hindiName: "Milk & Veggie Crates", iconSvg: <ItemDiscIcon type="crate" /> },
      { id: "p7", name: "PVC Pipe", hindiName: "Plumbing Conduits", iconSvg: <ItemDiscIcon type="pvc-pipe" /> },
      { id: "p8", name: "Plastic Can 5 Ltr", hindiName: "Oil Jerrycans", iconSvg: <ItemDiscIcon type="can-5l" /> },
    ],
    recycledProducts: [
      { name: "Storage Buckets", iconSvg: <ItemDiscIcon type="blue-drum" /> },
      { name: "Recycled Bottles", iconSvg: <ItemDiscIcon type="plastic-bottle" /> },
      { name: "Polyester Fibre", iconSvg: <ItemDiscIcon type="fibre" /> },
    ],
  },
  {
    id: "paper",
    name: "PAPER",
    title: "Paper Scrap",
    slug: "paper",
    pastelBg: "bg-[#FFF3E6]",
    darkBg: "dark:bg-[#2b1b11]",
    borderTint: "border-amber-200/80 dark:border-amber-900/50",
    tagColor: "text-amber-800 dark:text-amber-300",
    annualStat: "21 million",
    annualNumber: "21 million",
    recycleRate: 70,
    description: "Clean newsprint, corrugated cardboard packaging, discarded office documents, notebooks, and egg trays.",
    cardIllustration: <PaperIllustration />,
    detailIllustration: <PaperIllustration />,
    items: [
      { id: "pa1", name: "Newspaper", hindiName: "Dainik Raddi", iconSvg: <ItemDiscIcon type="newspaper" /> },
      { id: "pa2", name: "Cardboard Boxes", hindiName: "Gatta / Cartons", iconSvg: <ItemDiscIcon type="cardboard" /> },
      { id: "pa3", name: "Office Paper", hindiName: "White A4 Sheets", iconSvg: <ItemDiscIcon type="office-paper" /> },
      { id: "pa4", name: "Books & Notebooks", hindiName: "Copies & Novels", iconSvg: <ItemDiscIcon type="books" /> },
      { id: "pa5", name: "Cartons & Packaging", hindiName: "Product Boxes", iconSvg: <ItemDiscIcon type="cardboard" /> },
      { id: "pa6", name: "Magazines & Glossy", hindiName: "Catalogues", iconSvg: <ItemDiscIcon type="newspaper" /> },
    ],
    recycledProducts: [
      { name: "Kraft Paper Bags", iconSvg: <ItemDiscIcon type="newspaper" /> },
      { name: "Corrugated Cartons", iconSvg: <ItemDiscIcon type="cardboard" /> },
      { name: "Moulded Egg Trays", iconSvg: <ItemDiscIcon type="office-paper" /> },
    ],
  },
  {
    id: "metal",
    name: "METAL",
    title: "Metal Scrap",
    slug: "metal",
    pastelBg: "bg-[#FDECEC]",
    darkBg: "dark:bg-[#2b1216]",
    borderTint: "border-rose-200/80 dark:border-rose-900/50",
    tagColor: "text-rose-800 dark:text-rose-300",
    annualStat: "10 million",
    annualNumber: "10 million",
    recycleRate: 85,
    description: "Ferrous and non-ferrous metals including iron rebars, pure copper winding wire, brass utensils, and aluminium.",
    cardIllustration: <MetalIllustration />,
    detailIllustration: <MetalIllustration />,
    items: [
      { id: "m1", name: "Iron & Steel", hindiName: "Loha & TMT", iconSvg: <ItemDiscIcon type="iron-steel" /> },
      { id: "m2", name: "Copper Wire", hindiName: "Taamba Winding", iconSvg: <ItemDiscIcon type="copper-wire" /> },
      { id: "m3", name: "Brass Utensils", hindiName: "Peetal Bartan", iconSvg: <ItemDiscIcon type="brass" /> },
      { id: "m4", name: "Aluminium Cans", hindiName: "Beverage Tins", iconSvg: <ItemDiscIcon type="aluminium" /> },
      { id: "m5", name: "Tin Food Cans", hindiName: "Dalda / Oil Tins", iconSvg: <ItemDiscIcon type="aluminium" /> },
      { id: "m6", name: "Old Water Pipes", hindiName: "GI Pipes", iconSvg: <ItemDiscIcon type="iron-steel" /> },
    ],
    recycledProducts: [
      { name: "Construction Rebar", iconSvg: <ItemDiscIcon type="iron-steel" /> },
      { name: "Automotive Castings", iconSvg: <ItemDiscIcon type="aluminium" /> },
      { name: "New Brass Utensils", iconSvg: <ItemDiscIcon type="brass" /> },
    ],
  },
  {
    id: "ewaste",
    name: "E-WASTE",
    title: "E-Waste Scrap",
    slug: "e-waste",
    pastelBg: "bg-[#ECEEFF]",
    darkBg: "dark:bg-[#151733]",
    borderTint: "border-indigo-200/80 dark:border-indigo-900/50",
    tagColor: "text-indigo-800 dark:text-indigo-300",
    annualStat: "1.6 million",
    annualNumber: "1.6 million",
    recycleRate: 22,
    description: "End-of-life electronics, obsolete desktop computers, mobile phones, printed circuit boards, and battery chargers.",
    cardIllustration: <EWasteIllustration />,
    detailIllustration: <EWasteIllustration />,
    items: [
      { id: "e1", name: "Laptops & PCs", hindiName: "Old Computers", iconSvg: <ItemDiscIcon type="laptop" /> },
      { id: "e2", name: "Monitors & CRT", hindiName: "Screen Displays", iconSvg: <ItemDiscIcon type="monitor" /> },
      { id: "e3", name: "Keyboards & Mice", hindiName: "Computer Peripherals", iconSvg: <ItemDiscIcon type="laptop" /> },
      { id: "e4", name: "Smartphones", hindiName: "Feature & Touch Phones", iconSvg: <ItemDiscIcon type="smartphone" /> },
      { id: "e5", name: "Chargers & Cables", hindiName: "Power Adapters", iconSvg: <ItemDiscIcon type="cables" /> },
      { id: "e6", name: "Small Appliances", hindiName: "Mixers & Irons", iconSvg: <ItemDiscIcon type="inverter" /> },
    ],
    recycledProducts: [
      { name: "Refined Copper & Gold", iconSvg: <ItemDiscIcon type="copper-wire" /> },
      { name: "Recycled Circuit Boards", iconSvg: <ItemDiscIcon type="laptop" /> },
      { name: "Refurbished Tech", iconSvg: <ItemDiscIcon type="monitor" /> },
    ],
  },
  {
    id: "other",
    name: "OTHER",
    title: "Other & Special Scrap",
    slug: "other",
    pastelBg: "bg-[#FEFCE8]",
    darkBg: "dark:bg-[#262410]",
    borderTint: "border-yellow-200/80 dark:border-yellow-900/50",
    tagColor: "text-yellow-800 dark:text-yellow-300",
    annualStat: "4.5 million",
    annualNumber: "4.5 million",
    recycleRate: 45,
    description: "Inverter batteries, soda-lime glass bottles, foam mattresses, used vehicle tyres, and mixed scrap.",
    cardIllustration: <OtherIllustration />,
    detailIllustration: <OtherIllustration />,
    items: [
      { id: "o1", name: "Lead Acid Batteries", hindiName: "Inverter Batteries", iconSvg: <ItemDiscIcon type="battery" /> },
      { id: "o2", name: "Glass Bottles", hindiName: "Beer & Sauce Glass", iconSvg: <ItemDiscIcon type="glass" /> },
      { id: "o3", name: "Home Inverters", hindiName: "UPS Units", iconSvg: <ItemDiscIcon type="inverter" /> },
      { id: "o4", name: "Tyres & Rubber", hindiName: "Two / Four Wheeler", iconSvg: <ItemDiscIcon type="battery" /> },
      { id: "o5", name: "Mattress Foam", hindiName: "Cushion Padding", iconSvg: <ItemDiscIcon type="fibre" /> },
      { id: "o6", name: "Mixed Household", hindiName: "Assorted Scrap", iconSvg: <ItemDiscIcon type="cardboard" /> },
    ],
    recycledProducts: [
      { name: "Secondary Lead Ingot", iconSvg: <ItemDiscIcon type="battery" /> },
      { name: "Cullet Raw Glass", iconSvg: <ItemDiscIcon type="glass" /> },
      { name: "Crumb Rubber Floor", iconSvg: <ItemDiscIcon type="fibre" /> },
    ],
  },
];

export function KnowAboutKabad({ onSellScrap, className = "" }: KnowAboutKabadProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState<KabadCategory | null>(null);

  // Auto slide effect
  useEffect(() => {
    if (!isAutoPlay || isHovered || drawerCategory !== null) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % KABAD_CATEGORIES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, drawerCategory]);

  const activeCategory = KABAD_CATEGORIES[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % KABAD_CATEGORIES.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + KABAD_CATEGORIES.length) % KABAD_CATEGORIES.length);
  };

  return (
    <div
      id="kabad-guide-section"
      className={`rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm transition-all ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header bar with line divider matching app inspiration */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              Know more about Kabad
            </h2>
            <div className="hidden sm:block h-px w-20 lg:w-32 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Learn more about kabad and their categories
          </p>
        </div>

        {/* Carousel controls & Play/Pause */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAutoPlay((prev) => !prev)}
            title={isAutoPlay ? "Pause auto-slide" : "Start auto-slide"}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-xs flex items-center gap-1"
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-medium hidden md:inline">
              {isAutoPlay ? "Auto-slide" : "Paused"}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Next category"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 mb-4">
        {KABAD_CATEGORIES.map((cat, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#15803D] text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <span>{cat.name}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />}
            </button>
          );
        })}
      </div>

      {/* =========================================================
          AUTO-SLIDING SHOWCASE CARD (Smooth slide transition)
          ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl mb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={() => setDrawerCategory(activeCategory)}
            className={`p-5 sm:p-6 rounded-2xl cursor-pointer border ${activeCategory.pastelBg} ${activeCategory.darkBg} ${activeCategory.borderTint} group transition shadow-sm hover:shadow-md`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Info: Category Name, National Stat, Recycle Gauge */}
              <div className="md:col-span-7 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    {activeCategory.name}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    India Recycling Guide
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-[#15803D] dark:group-hover:text-emerald-400 transition-colors">
                    {activeCategory.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                    {activeCategory.description}
                  </p>
                </div>

                {/* Quick Impact Metrics */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="bg-white/70 dark:bg-black/30 backdrop-blur-xs rounded-xl px-3 py-2 border border-black/5 dark:border-white/5">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 block">
                      Annual Generation
                    </span>
                    <span className="text-sm font-bold text-[#15803D] dark:text-emerald-400 tabular-nums">
                      {activeCategory.annualStat} tons
                    </span>
                  </div>

                  <div className="bg-white/70 dark:bg-black/30 backdrop-blur-xs rounded-xl px-3 py-2 border border-black/5 dark:border-white/5 flex items-center gap-2">
                    {/* Tiny gauge */}
                    <div className="w-8 h-8 relative flex items-center justify-center">
                      <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke="currentColor"
                          className="text-zinc-200 dark:text-zinc-700"
                          strokeWidth="3.5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke="#15803D"
                          strokeWidth="3.5"
                          strokeDasharray={88}
                          strokeDashoffset={88 - (88 * activeCategory.recycleRate) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold text-zinc-800 dark:text-zinc-100 tabular-nums">
                        {activeCategory.recycleRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 block">
                        Recycle Rate
                      </span>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        National Avg
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Details Prompt */}
                <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-[#15803D] dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>View types, items & details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Right Illustration */}
              <div className="md:col-span-5 flex items-center justify-center p-2">
                <div className="w-44 h-36 sm:w-52 sm:h-44 transition-transform group-hover:scale-105 duration-300">
                  {activeCategory.cardIllustration}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =========================================================
          2-COLUMN PASTEL CATEGORY CARDS (As shown in screenshot)
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {KABAD_CATEGORIES.map((cat, idx) => {
          const isCurrent = idx === activeIdx;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setDrawerCategory(cat);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-40 relative group overflow-hidden ${cat.pastelBg} ${cat.darkBg} ${
                isCurrent
                  ? "ring-2 ring-[#15803D] border-[#15803D]"
                  : `${cat.borderTint} hover:shadow-sm`
              }`}
            >
              <div className="flex items-center justify-between z-10 w-full">
                <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-wide">
                  {cat.name}
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 tabular-nums">
                  {cat.recycleRate}%
                </span>
              </div>

              <div className="my-auto flex items-center justify-center w-full z-10 group-hover:scale-105 transition-transform duration-200">
                <div className="w-20 h-20">{cat.cardIllustration}</div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 font-medium z-10">
                <span>{cat.items.length} types</span>
                <span className="text-[#15803D] dark:text-emerald-400 group-hover:underline">
                  Read &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          INTERACTIVE DETAIL SLIDE-OVER DRAWER (SHEET)
          Matching uploaded screenshots (media_1794913417135 / media_1794913431724)
          ========================================================= */}
      <AnimatePresence>
        {drawerCategory && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-over panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="w-screen max-w-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xl flex flex-col h-full border-l border-zinc-200 dark:border-white/10"
              >
                {/* Header bar with < Back button */}
                <div className="px-5 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md z-20">
                  <button
                    type="button"
                    onClick={() => setDrawerCategory(null)}
                    className="p-1.5 -ml-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-xs font-semibold hidden sm:inline">Back</span>
                  </button>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                    {drawerCategory.title}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setDrawerCategory(null)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-7">
                  {/* Top Category Illustration */}
                  <div className="flex justify-center py-2">
                    <div className="w-56 h-48 sm:w-64 sm:h-52">
                      {drawerCategory.detailIllustration}
                    </div>
                  </div>

                  {/* Impact Stat: Total Generated in India */}
                  <div className="text-center space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      Total {drawerCategory.name.toLowerCase()} scrap generated in India
                    </h4>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                      Approximately
                    </p>
                    {/* Highlighted Big Green Text */}
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#2E7D32] dark:text-emerald-500 tracking-tight tabular-nums py-1">
                      {drawerCategory.annualStat}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      tons annually.
                    </p>
                  </div>

                  {/* Vertical connector line with small green circle */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-emerald-600/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] dark:bg-emerald-500" />
                    <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-1">
                      They have
                    </span>
                  </div>

                  {/* Circular Recycle Rate Gauge */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                        {/* Track circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          className="text-zinc-200 dark:text-zinc-800"
                          strokeWidth="7"
                        />
                        {/* Progress circle in forest green */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#15803D"
                          strokeWidth="7"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * drawerCategory.recycleRate) / 100}
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Percentage inside gauge */}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-zinc-900 dark:text-white tabular-nums">
                          {drawerCategory.recycleRate}%
                        </span>
                      </div>

                      {/* Small circular green recycle badge on top right */}
                      <div className="absolute top-0 right-1 w-7 h-7 rounded-full bg-[#15803D] text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-zinc-900">
                        <Recycle className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-2">
                      recycle rate
                    </span>
                  </div>

                  {/* Types of scrap generated: 3-column grid of circular warm-tinted discs */}
                  <div className="space-y-3.5 pt-2">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                      Types of {drawerCategory.name.toLowerCase()} scrap generated
                    </h4>

                    <div className="grid grid-cols-3 gap-3.5">
                      {drawerCategory.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col items-center text-center space-y-1.5 group"
                        >
                          {/* Circular warm-tinted disc disc background */}
                          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#FFE8CC] dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/40 flex items-center justify-center p-2.5 shadow-xs transition-transform group-hover:scale-105">
                            {item.iconSvg}
                          </div>
                          <span className="text-[11px] sm:text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Soft Warm Amber Reference Note Banner */}
                  <div className="rounded-xl p-3.5 bg-[#FDE68A]/60 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800/40 text-zinc-800 dark:text-amber-100 text-xs leading-relaxed space-y-0.5">
                    <span className="font-bold">Note: </span>
                    <span>
                      The prices shown are for reference only. Actual rates may vary based on digital scale weighment.
                    </span>
                  </div>

                  {/* "Can be recycled into" Section */}
                  <div className="space-y-3.5 pt-1">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight text-center">
                      Can be recycled into
                    </h4>

                    <div className="grid grid-cols-3 gap-3">
                      {drawerCategory.recycledProducts.map((prod, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex flex-col items-center text-center space-y-1.5"
                        >
                          <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center p-2 shadow-xs">
                            {prod.iconSvg}
                          </div>
                          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
                            {prod.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 sticky bottom-0 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      const catName = drawerCategory.name;
                      setDrawerCategory(null);
                      onSellScrap?.(catName);
                    }}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#15803D] hover:bg-[#166534] active:bg-[#14532D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sell {drawerCategory.title}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

