"use client";

import React, { useState } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  X,
  FileText,
  ShieldCheck,
  Briefcase,
  Store,
} from "lucide-react";

interface FooterProps {
  onOpenSellModal?: () => void;
  onOpenBusinessModal?: () => void;
}

export default function Footer({
  onOpenSellModal,
  onOpenBusinessModal,
}: FooterProps) {
  // Modal state for informational links (Privacy Policy, Terms, Careers, Franchise)
  const [activeInfoModal, setActiveInfoModal] = useState<{
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  } | null>(null);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#07090c] dark:bg-black text-slate-300 border-t border-neutral-800 dark:border-white/10 pt-14 pb-8 transition-colors select-none font-sans">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Grid: 4 Link Columns + 1 Right Info/Brand Column */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-8 pb-12">
          {/* Column 1: Businesses */}
          <div className="lg:col-span-2">
            <h4 className="text-[#5EDC1F] font-bold text-sm tracking-wide mb-4">
              Businesses
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenBusinessModal) onOpenBusinessModal();
                    else handleScrollTo("contact");
                  }}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  EPR Compliance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("circular-economy")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Circular Economy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("services")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Paper Shredding
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenBusinessModal) onOpenBusinessModal();
                    else handleScrollTo("contact");
                  }}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Commercial Scrap
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Individuals */}
          <div className="lg:col-span-2">
            <h4 className="text-[#5EDC1F] font-bold text-sm tracking-wide mb-4">
              Individuals
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenSellModal) onOpenSellModal();
                    else handleScrollTo("how-it-works");
                  }}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Scrap Collection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("services")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Vehicle Scrapping
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("circular-economy")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Zero Waste Society
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("how-it-works")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Digital Weighing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2">
            <h4 className="text-[#5EDC1F] font-bold text-sm tracking-wide mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("circular-economy")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("how-it-works")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setActiveInfoModal({
                      title: "Careers at KabaadSe",
                      icon: <Briefcase className="h-5 w-5 text-emerald-400" />,
                      content: (
                        <div className="space-y-3 text-sm text-slate-300">
                          <p>
                            We are on a mission to organize India&apos;s scrap
                            recycling ecosystem through technology, certified
                            digital weighing, and transparent pricing.
                          </p>
                          <p className="font-semibold text-white">
                            Open Positions:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>Logistics & Fleet Operations Manager (Patna / Bihar)</li>
                            <li>Full-Stack Web & Mobile Engineer (Next.js & React Native)</li>
                            <li>B2B Industrial Scrap Procurement Lead</li>
                          </ul>
                          <p className="text-xs text-slate-400 pt-2">
                            Send your resume to{" "}
                            <span className="text-emerald-400 font-medium">
                              raushankumarbhardwaj4510@gmail.com
                            </span>
                          </p>
                        </div>
                      ),
                    })
                  }
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setActiveInfoModal({
                      title: "Franchise & Partner Program",
                      icon: <Store className="h-5 w-5 text-emerald-400" />,
                      content: (
                        <div className="space-y-3 text-sm text-slate-300">
                          <p>
                            Partner with KabaadSe to launch an authorized
                            doorstep collection center or digital scrap hub in
                            your city.
                          </p>
                          <p className="font-semibold text-white">
                            What We Provide:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>ISO 9001:2015 certified Bluetooth weighing tech</li>
                            <li>Centralized customer lead allocation & routing app</li>
                            <li>Direct authorized recycling plant contracts</li>
                          </ul>
                          <p className="text-xs text-slate-400 pt-2">
                            Reach out at{" "}
                            <span className="text-emerald-400 font-medium">
                              +91-7061529409
                            </span>{" "}
                            to speak with our Franchise Director.
                          </p>
                        </div>
                      ),
                    })
                  }
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Franchise
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div className="lg:col-span-2">
            <h4 className="text-[#5EDC1F] font-bold text-sm tracking-wide mb-4">
              Help
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo("contact")}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setActiveInfoModal({
                      title: "Privacy Policy",
                      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
                      content: (
                        <div className="space-y-3 text-sm text-slate-300">
                          <p>
                            At <strong>KabaadSe</strong>, your privacy is our
                            utmost priority. We only collect the necessary
                            contact information (name, address, and mobile number)
                            required to coordinate doorstep scrap pickups.
                          </p>
                          <p>
                            We do not sell, rent, or trade your personal data to
                            third-party advertisers. All transaction and payout
                            records are encrypted and processed securely.
                          </p>
                          <p className="text-xs text-slate-400">
                            Last updated: {new Date().getFullYear()}. For inquiries,
                            contact raushankumarbhardwaj4510@gmail.com.
                          </p>
                        </div>
                      ),
                    })
                  }
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setActiveInfoModal({
                      title: "Terms & Conditions",
                      icon: <FileText className="h-5 w-5 text-emerald-400" />,
                      content: (
                        <div className="space-y-3 text-sm text-slate-300">
                          <p>
                            By booking a scrap pickup on <strong>KabaadSe</strong>,
                            you confirm that you are the lawful owner of the items
                            being sold.
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                            <li>All weighing is performed using certified digital scales in front of you.</li>
                            <li>Instant payout is issued via cash or UPI immediately upon weight verification.</li>
                            <li>Hazardous industrial materials must be disclosed prior to scheduled collection.</li>
                          </ul>
                          <p className="text-xs text-slate-400 pt-1">
                            Governed under the laws of Bihar, India.
                          </p>
                        </div>
                      ),
                    })
                  }
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 focus:outline-none transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Brand Identity & Contact Info (Right Side) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 lg:pl-4 space-y-4 pt-4 lg:pt-0 border-t border-neutral-800 lg:border-t-0">
            {/* Logo + Brand Name + Divider + Social Icons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 group"
              >
                <BrandLogo className="h-8 w-8 sm:h-9 sm:w-9" size={36} />
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  kabaad<span className="text-emerald-400">se</span>
                </span>
              </Link>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-5 w-[1px] bg-slate-700" />

              {/* Social Media Icons */}
              <div className="flex items-center gap-2.5 text-slate-400">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-4 w-4 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <a
                  href="tel:+917061529409"
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 transition-colors font-medium"
                >
                  +91-7061529409
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <a
                  href="mailto:raushankumarbhardwaj4510@gmail.com"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      "https://mail.google.com/mail/?view=cm&fs=1&to=raushankumarbhardwaj4510@gmail.com",
                      "_blank"
                    );
                  }}
                  className="hover:text-emerald-400 active:text-emerald-400 focus:text-emerald-400 transition-colors break-all font-medium"
                  title="Send via Gmail"
                >
                  raushankumarbhardwaj4510@gmail.com
                </a>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-2 pt-1 text-slate-400 text-xs leading-relaxed">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  KabaadSe, 3rd floor, Plot No. 22, Beside Biscoman Bhawan,
                  Gandhi Maidan, Gate No. 07, Patna, Bihar 800001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Made with Heart */}
        <div className="border-t border-neutral-800 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            all copyrights reserved by © KabaadSe Recycling Technologies Pvt. Ltd.
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 mx-0.5 inline-block" />
            <span>in India, for the World</span>
          </div>
        </div>
      </div>

      {/* Interactive Info Modal (Privacy Policy / Terms / Careers / Franchise) */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#10141a] border border-white/10 p-6 sm:p-7 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setActiveInfoModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-emerald-400 active:text-emerald-400 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                {activeInfoModal.icon}
              </div>
              <h3 className="text-lg font-bold text-white">
                {activeInfoModal.title}
              </h3>
            </div>

            <div className="mt-2 text-slate-300">
              {activeInfoModal.content}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black active:bg-emerald-400 text-white font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
