"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, CheckCircle2, ShieldCheck, HelpCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface ServiceDetail {
  id: string;
  title: string;
  category: "For Individuals" | "For Businesses" | "For Governments";
  tagline: string;
  pillars: {
    why: string;
    benefits: string[] | string;
    solution: string;
  };
  steps?: string[];
}

export const SERVICES_DATA: Record<string, ServiceDetail> = {
  // For Individuals
  "scrap-collection": {
    id: "scrap-collection",
    title: "Doorstep Scrap Collection",
    category: "For Individuals",
    tagline: "Free doorstep pickup for 40+ recyclables with certified digital weighing and instant payout.",
    pillars: {
      why: "Traditional local scrap dealers use uncalibrated analog scales and lack transparent pricing. We guarantee verified rates, digital accuracy, and hassle-free pickup.",
      benefits: [
        "100% calibrated digital weighing scales",
        "Instant UPI / Cash payment on the spot",
        "Free doorstep pickup at your scheduled slot",
        "Covers 40+ paper, plastic, metal & e-waste items",
      ],
      solution: "Verified eco-riders arrive at your doorstep, weigh scrap in front of you on a certified scale, and transfer your payout instantly.",
    },
    steps: [
      "Select your scrap category & book a slot",
      "Verified executive arrives at your doorstep",
      "Transparent weighing with digital scale",
      "Instant payout via UPI or cash with receipt",
    ],
  },
  "zero-waste-society": {
    id: "zero-waste-society",
    title: "Zero Waste Society",
    category: "For Individuals",
    tagline: "Empowering residential societies and RWAs with decentralized segregation, composting, and bulk recycling.",
    pillars: {
      why: "Unsegregated residential waste clogs landfills and violates municipal solid waste bylaws. Societies often lack proper disposal systems.",
      benefits: [
        "Over 85% waste diversion from municipal dumping grounds",
        "Society monetization from bulk dry scrap recovery",
        "Odor-free decentralized wet waste composting",
        "Green Society Certification & Swachh Survekshan boost",
      ],
      solution: "Complete turnkey RWA waste management: dual-bin sorting systems, on-site organic composting, and scheduled bulk dry waste collection.",
    },
    steps: [
      "Baseline audit of society waste volume & layout",
      "Setup of color-coded sorting stations & composter",
      "Resident awareness workshops & staff training",
      "Weekly bulk recyclable pickups & monthly impact reports",
    ],
  },
  "vehicle-scrapping": {
    id: "vehicle-scrapping",
    title: "Registered Vehicle Scrapping",
    category: "For Individuals",
    tagline: "Government-authorized RVSF deregistration and eco-friendly scrapping for end-of-life vehicles.",
    pillars: {
      why: "End-of-life petrol (>15 yrs) and diesel (>10 yrs) vehicles face legal impoundment and fines. Informal scrapping leads to environmental pollution and identity misuse.",
      benefits: [
        "Official Government Certificate of Deposit (COD)",
        "Up to 25% discount on road tax for your new vehicle",
        "Safe de-registration at RTO ensuring no liability",
        "Free doorstep vehicle towing & best metal scrap rate",
      ],
      solution: "Govt-approved Registered Vehicle Scrapping Facility (RVSF) pickup, legal RTO documentation, and safe, depolluted metal recycling.",
    },
    steps: [
      "Submit vehicle details & RC copy online",
      "Doorstep inspection and instant price quotation",
      "Free flatbed towing to authorized RVSF facility",
      "Issuance of official RTO COD & instant payment",
    ],
  },

  // For Businesses
  "commercial-scrap": {
    id: "commercial-scrap",
    title: "Commercial Bulk Scrap Collection",
    category: "For Businesses",
    tagline: "Enterprise-grade bulk recycling and waste clearing for warehouses, manufacturing plants, and corporate campuses.",
    pillars: {
      why: "Industrial offcuts, packaging waste, and obsolete stock occupy valuable warehouse floor space and require strict GST & audit documentation.",
      benefits: [
        "GST-compliant formal invoices and manifests",
        "Fleet of high-capacity pickup vehicles & dedicated labor",
        "Transparent dynamic market rate indexing",
        "Zero disruption to ongoing daily factory operations",
      ],
      solution: "Dedicated account managers, heavy-duty industrial weighing, scheduled offloading, and continuous circular raw material supply.",
    },
    steps: [
      "Site survey & material classification audit",
      "Custom SLA & contracted bulk price agreement",
      "Scheduled fleet dispatch with mechanized loading",
      "Weighbridge slip verification & digital payout",
    ],
  },
  "epr-services": {
    id: "epr-services",
    title: "Extended Producer Responsibility (EPR)",
    category: "For Businesses",
    tagline: "End-to-end EPR compliance, collection targets, and verifiable CPCB portal credit fulfillment.",
    pillars: {
      why: "CPCB and State Pollution Control Boards enforce stringent EPR quotas on PIBOs (Producers, Importers & Brand Owners) with severe penalties for defaults.",
      benefits: [
        "100% authenticated CPCB portal credit transfer",
        "Audited traceability from source to recycling plant",
        "Pan-India state-specific target fulfillment",
        "Full documentation support for annual regulatory filings",
      ],
      solution: "Authorized collection network feeding accredited recycling facilities, generating authentic mass-balance certified EPR credits.",
    },
    steps: [
      "Calculation of brand annual EPR liability targets",
      "Channelized plastic, battery & e-waste recovery",
      "Processing through authorized recycling partners",
      "Direct credit transfer & CPCB portal filing support",
    ],
  },
  "dismantling": {
    id: "dismantling",
    title: "Asset & Plant Dismantling",
    category: "For Businesses",
    tagline: "Turnkey decommissioning and certified dismantling of obsolete industrial plants, HVAC systems, and IT equipment.",
    pillars: {
      why: "Industrial decommissioning involves hazardous electricals, heavy structural steel, and chemical residues requiring certified safety protocols.",
      benefits: [
        "HSE-certified engineers and safety-compliant crew",
        "Maximum scrap value recovery for dismantled metals",
        "Hazardous waste isolation and safe treatment",
        "Clean, cleared site handed over on schedule",
      ],
      solution: "Precision deconstruction using heavy cutting machinery, hydraulic rigs, and sorted material recycling without occupational hazards.",
    },
    steps: [
      "Structural safety survey & risk mitigation plan",
      "Utility isolation & hazardous material clearing",
      "Engineered deconstruction & on-site sorting",
      "Logistics dispatch & site handover clearance",
    ],
  },
  "circular-economy": {
    id: "circular-economy",
    title: "Circular Economy Advisory",
    category: "For Businesses",
    tagline: "Strategic consulting to transform linear take-make-dispose models into regenerative closed-loop operations.",
    pillars: {
      why: "Rising virgin raw material prices and global ESG reporting requirements compel forward-thinking brands to adopt closed-loop circular systems.",
      benefits: [
        "Reduced dependence on virgin raw material supply",
        "Measurable improvement in corporate ESG ratings",
        "Closed-loop reverse logistics for product take-back",
        "Substantial lifecycle carbon footprint reduction",
      ],
      solution: "End-to-end material flow analysis, post-consumer product return channels, and secondary raw material integration into supply chains.",
    },
    steps: [
      "Comprehensive material flow & waste audit",
      "Design of closed-loop reverse supply chain",
      "Integration with accredited recyclers & compounders",
      "Continuous ESG impact tracking & sustainability reporting",
    ],
  },
  "zero-waste-business": {
    id: "zero-waste-business",
    title: "Zero Waste to Landfill (ZWTL)",
    category: "For Businesses",
    tagline: "Complete commercial campus waste stewardship diverting over 90% of operational waste away from landfills.",
    pillars: {
      why: "Tech parks, corporate offices, and educational campuses produce substantial paper, pantry, and packaging waste that damages corporate ESG credentials.",
      benefits: [
        "True Zero Waste to Landfill (ZWTL) certification",
        "Substantial reduction in municipal tipping charges",
        "Enhanced employee pride and environmental leadership",
        "Monthly audit-ready environmental diversion certificates",
      ],
      solution: "Decentralized dry and wet waste processing, organic food waste biodigesters, and full traceability of all campus recyclables.",
    },
    steps: [
      "Campus baseline waste characterization audit",
      "Installation of smart segregation bays & composter",
      "Employee and housekeeping sensitization training",
      "Monthly diversion audit & ESG impact dashboard",
    ],
  },
  "paper-shredding": {
    id: "paper-shredding",
    title: "Confidential Paper Shredding",
    category: "For Businesses",
    tagline: "DIN 66399 compliant on-site and off-site document destruction for confidential corporate records.",
    pillars: {
      why: "Improper disposal of client financial files, legal contracts, or HR data poses catastrophic data breach and regulatory compliance risks.",
      benefits: [
        "DIN 66399 Level 3/4 cross-cut strip destruction",
        "Tamper-evident locked security console bins",
        "CCTV-monitored destruction with video evidence",
        "Official Certificate of Destruction & 100% recycling into paper",
      ],
      solution: "High-throughput mobile shredding vans or secure offsite facilities providing tamper-proof destruction with zero data leak possibility.",
    },
    steps: [
      "Placement of locked tamper-proof document bins",
      "Chain-of-custody pickup by vetted personnel",
      "Cross-cut shredding with video recording option",
      "Issuance of legal Certificate of Destruction",
    ],
  },
  "csr-services": {
    id: "csr-services",
    title: "Corporate CSR Environmental Initiatives",
    category: "For Businesses",
    tagline: "High-impact CSR projects elevating informal waste-picker communities and cleaning local ecosystems.",
    pillars: {
      why: "Companies need meaningful, auditable Section 135 CSR projects with tangible socio-environmental outcomes and regulatory compliance.",
      benefits: [
        "Direct formalization & healthcare for informal Safai Sathis",
        "Measurable plastic diversion from river basins & drains",
        "Audit-ready CSR documentation for board compliance",
        "Inspiring corporate brand storytelling and employee volunteering",
      ],
      solution: "Turnkey execution of waste worker social inclusion, occupational safety kits distribution, and urban water body restoration campaigns.",
    },
    steps: [
      "Co-creation of project scope aligned with Schedule VII",
      "Field mobilization & baseline community survey",
      "On-ground execution with geotagged photographic proof",
      "Third-party audited social impact report delivery",
    ],
  },
  "zero-waste-event": {
    id: "zero-waste-event",
    title: "Zero Waste Event Management",
    category: "For Businesses",
    tagline: "Eco-friendly green event stewardship for conferences, exhibitions, marathons, and corporate summits.",
    pillars: {
      why: "Large events generate massive plastic bottle, food waste, and flex banner debris within hours, attracting negative public perception.",
      benefits: [
        "Over 90% event waste diverted from landfills",
        "Positive brand positioning as an eco-conscious host",
        "Surplus food recovery tie-ups with verified NGOs",
        "Live green scoreboard displaying plastic saved to attendees",
      ],
      solution: "On-ground green marshals, color-coded collection booths, biodegradable material consulting, and immediate post-event waste processing.",
    },
    steps: [
      "Pre-event material planning to eliminate single-use items",
      "Setup of multi-stream waste stations with green marshals",
      "Real-time food rescue and recyclable segregation",
      "Post-event waste diversion audit & green certificate",
    ],
  },
  "rfp-ewaste": {
    id: "rfp-ewaste",
    title: "RFP for E-Waste Recycling",
    category: "For Businesses",
    tagline: "Compliant enterprise tender bids for obsolete IT servers, PCs, peripherals, and telecom hardware.",
    pillars: {
      why: "Enterprise electronic equipment contains proprietary company data, toxic heavy metals, and significant reclaimable scrap value requiring strict compliance.",
      benefits: [
        "Highest competitive pricing for obsolete IT lots",
        "NIST 800-88 compliant on-site data degaussing & wiping",
        "Form-6 hazardous waste manifests under E-Waste Rules 2022",
        "Environmentally sound extraction of precious metals",
      ],
      solution: "Full-service enterprise e-waste tender responses, secure de-installation, serial-number tracked logistics, and certified data destruction.",
    },
    steps: [
      "Submission of IT asset inventory or tender RFP",
      "Commercial bid submission & technical evaluation",
      "On-site data destruction & secure chain of custody loading",
      "Receipt of Form-6 manifest & asset settlement",
    ],
  },

  // For Governments
  mrf: {
    id: "mrf",
    title: "Material Recovery Facility (MRF)",
    category: "For Governments",
    tagline: "Design, build, and automated operations of municipal MRF plants for Urban Local Bodies (ULBs).",
    pillars: {
      why: "Urban local bodies face mounting dumpsites and Swachh Bharat compliance targets. Traditional manual dumpsite sorting is slow and unhygienic.",
      benefits: [
        "Up to 95% recovery rate of dry municipal recyclables",
        "DPR alignment with Swachh Bharat Mission 2.0 grants",
        "Revenue generation from high-purity sorted bales",
        "Dignified employment & formalization of local informal sorters",
      ],
      solution: "Semi-automated & automated MRFs featuring conveyor systems, ballistic separators, optical sorters, baling machines, and digital weight trackers.",
    },
    steps: [
      "City solid waste characterization & DPR preparation",
      "Engineering layout design & machinery procurement",
      "Plant construction, civil works & commissioning",
      "Long-term operations & maintenance (O&M) partnership",
    ],
  },
  iec: {
    id: "iec",
    title: "IEC & Citizen Behavior Change",
    category: "For Governments",
    tagline: "Information, Education & Communication campaigns driving source segregation across municipal wards.",
    pillars: {
      why: "Even state-of-the-art waste plants fail if households do not segregate wet, dry, and sanitary waste at the doorstep source.",
      benefits: [
        "Direct increase in household source segregation rates",
        "Substantial improvement in city Swachh Survekshan rankings",
        "Grassroots mobilization of resident welfare associations",
        "Multilingual media campaigns, nukkad nataks & school outreach",
      ],
      solution: "End-to-end community awareness programs: door-to-door interpersonal communication, street plays, digital content, and ward competitions.",
    },
    steps: [
      "Ward-level demographic survey & barrier mapping",
      "Custom creative collaterals in regional languages",
      "Deployment of trained IEC mobilizers & street theater",
      "Impact assessment survey & segregation rate reporting",
    ],
  },
  drs: {
    id: "drs",
    title: "Deposit Refund System (DRS)",
    category: "For Governments",
    tagline: "Smart Reverse Vending Machines (RVMs) and digital refund infrastructure for beverage containers.",
    pillars: {
      why: "PET beverage bottles and aluminum cans cause rampant public littering in cities, tourist hubs, and transit stations without incentive models.",
      benefits: [
        "Up to 90% return rate for post-consumer PET bottles and cans",
        "Litter-free transit hubs, tourist spots, and public gardens",
        "Instant citizen rewards via UPI / metro smart card credits",
        "High-purity uncontaminated flakes for bottle-to-bottle recycling",
      ],
      solution: "Network of smart IoT-enabled RVM kiosks with barcode scanning, automated crushing, and cloud-managed deposit refund payouts.",
    },
    steps: [
      "Public transit & high-footfall site feasibility study",
      "Deployment of connected RVM kiosks & digital wallets",
      "Citizen awareness drives & instant refund incentives",
      "Automated logistics for baled food-grade recyclables",
    ],
  },
};

// Aliases for matching alternate slugs
SERVICES_DATA["commercial-recycling"] = SERVICES_DATA["commercial-scrap"];
SERVICES_DATA["paper-shredding-dismantling"] = SERVICES_DATA["paper-shredding"];
SERVICES_DATA["csr-events"] = SERVICES_DATA["csr-services"];
SERVICES_DATA["mrf-drs"] = SERVICES_DATA["mrf"];

interface ServiceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail | null;
}

export default function ServiceInquiryModal({
  isOpen,
  onClose,
  service,
}: ServiceInquiryModalProps) {
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    cityOrSociety: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fix Page Scroll Lock on Close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keyboard ESC key to trigger onClose()
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset form status when opened with a new service
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, service?.id]);

  // Return null when closed, no service, or not mounted on client
  if (!isOpen || !service || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        cityOrSociety: "",
        message: "",
      });
    }, 600);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#121417] text-white rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden my-auto"
      >
        {/* Header (Sticky top) */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 shrink-0">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#5EDC1F]/20 text-[#5EDC1F] text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {service.category}
              </span>
            </div>
            <h3
              id="service-modal-title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {service.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition duration-150 cursor-pointer"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-300" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition duration-150 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <p className="text-sm text-neutral-300 leading-relaxed font-normal">
            {service.tagline}
          </p>

          {service.id === "vehicle-scrapping" && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-md">
              <div className="relative z-10 max-w-[65%] space-y-1.5 text-left">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5EDC1F]/20 text-[#5EDC1F] border border-[#5EDC1F]/30">
                  <ShieldCheck className="w-3 h-3" />
                  MoRTH Registered RVSF
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Govt. Authorized Vehicle Scrapping
                </h4>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  Doorstep flatbed towing, certified weighing &amp; official RTO de-registration Certificate of Deposit (COD).
                </p>
              </div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 shadow-inner">
                <Image
                  src="/images/vehicle.png"
                  alt="Scrap Vehicle Scrapping"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain filter invert drop-shadow-[0_2px_8px_rgba(94,220,31,0.3)]"
                />
              </div>
            </div>
          )}

          {/* 3-Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Pillar 1: Why */}
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-[#5EDC1F] shrink-0" />
                  <h4 className="text-sm font-bold text-white">
                    Why It Matters
                  </h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal break-words">
                  {service.pillars.why}
                </p>
              </div>
            </div>

            {/* Pillar 2: Benefits */}
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EDC1F] shrink-0" />
                  <h4 className="text-sm font-bold text-white">
                    Key Benefits
                  </h4>
                </div>
                {Array.isArray(service.pillars.benefits) ? (
                  <ul className="space-y-1.5 text-xs text-neutral-400">
                    {service.pillars.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug break-words">
                        <span className="text-[#5EDC1F] font-bold shrink-0 mt-0.5">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal break-words">
                    {service.pillars.benefits}
                  </p>
                )}
              </div>
            </div>

            {/* Pillar 3: Our Solution */}
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#5EDC1F] shrink-0" />
                  <h4 className="text-sm font-bold text-white">
                    Our Solution
                  </h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal break-words">
                  {service.pillars.solution}
                </p>
              </div>
            </div>
          </div>

          {/* "What We Do" Steps list (if available) */}
          {service.steps && service.steps.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                What We Do • Process Flow
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 min-w-0"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5EDC1F]/20 text-[#5EDC1F] text-xs font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium break-words">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lead Capture Form Section */}
          <div className="pt-5 border-t border-neutral-800 space-y-4">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Request Service Consultation
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Fill in your details below and our service specialist will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#5EDC1F]/10 border border-[#5EDC1F]/30 text-center space-y-2 animate-in fade-in duration-200">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#5EDC1F]/20 text-[#5EDC1F] mx-auto mb-1">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-base font-bold text-white">
                  Inquiry Submitted Successfully!
                </h5>
                <p className="text-xs text-neutral-300 max-w-md mx-auto">
                  Thank you! Our dedicated specialist for <strong>{service.title}</strong> has received your request and will contact you shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-white text-black hover:bg-neutral-200 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] transition"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] transition"
                    />
                  </div>

                  {/* City / Society Name */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      City / Society / Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Patna / Ashiana Nagar"
                      value={formData.cityOrSociety}
                      onChange={(e) =>
                        setFormData({ ...formData, cityOrSociety: e.target.value })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] transition"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Message / Specific Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your estimated scrap quantity, pickup frequency, or any questions..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#5EDC1F] focus:ring-1 focus:ring-[#5EDC1F] resize-none transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#5EDC1F] hover:bg-[#52c41b] text-black font-semibold rounded-xl transition duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
