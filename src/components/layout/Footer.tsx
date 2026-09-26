"use client";

import Link from "next/link";
import { INSTAGRAM_URL } from "@/lib/site-config";

function Instagram({
  size = 24,
  strokeWidth = 2,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

// Used on the home page (in-page anchor scroll) and on secondary pages
// (privacy/terms/404), where the same href just navigates back to the
// home page section instead.
const footerLinks: [string, string][] = [
  ["WORK", "/#work"],
  ["EXPERIENCE", "/#services"],
  ["ABOUT", "/#about"],
  ["FAQ", "/#faq"],
];

const legalLinks: [string, string][] = [
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
];

export function Footer() {
  const scrollTo = (id: string) => {
    if (typeof window === "undefined" || window.location.pathname !== "/") {
      return; // let the Link's normal navigation to "/#id" handle it
    }
    const element = document.getElementById(id);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - 12;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* TOP CINEMATIC LINE */}
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">
        <div className="border-t border-white/10" />

        <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.4fr_0.7fr_0.7fr] lg:gap-20 lg:py-24">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/images/logo/sv22-logo.png"
                alt="SV22"
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em]">
                  SV22
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.28em] text-white/30">
                  Cinematic Films
                </p>
              </div>
            </div>

            <p className="mt-10 max-w-md font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.88] tracking-[-0.06em]">
              EVERY
              <br />
              <span className="text-white/25">MOMENT.</span>
            </p>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/40">
              Cinematic films for the moments that matter, crafted entirely
              on iPhone.
            </p>
          </div>

          {/* EXPLORE */}
          <div>
            <p className="mb-7 text-[8px] font-semibold uppercase tracking-[0.35em] text-white/25">
              EXPLORE
            </p>

            <div className="flex flex-col items-start gap-5">
              {footerLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => scrollTo(href.replace("/#", ""))}
                  className="group flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/55 transition-colors duration-300 hover:text-white"
                >
                  <span>{label}</span>

                  <span className="translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* CONNECT */}
          <div>
            <p className="mb-7 text-[8px] font-semibold uppercase tracking-[0.35em] text-white/25">
              CONNECT
            </p>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SV22 on Instagram"
              className="group inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/55 transition-colors duration-300 hover:text-white"
            >
              <Instagram
                size={15}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <span>Instagram</span>

              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>

            <div className="mt-12">
              <p className="text-[8px] uppercase tracking-[0.3em] text-white/20">
                THE SV22 SIGNATURE
              </p>

              <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/45">
                SHOT ENTIRELY ON IPHONE
              </p>
            </div>
          </div>
        </div>

        {/* LEGAL ROW */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:gap-8">
          {legalLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/35 transition-colors duration-300 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
            © 2026 SV22. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className="h-px w-8 bg-white/15" />

            <span className="text-[8px] uppercase tracking-[0.35em] text-white/25">
              CINEMATIC FILMS / IPHONE
            </span>
          </div>

          <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
            MADE FOR THE MOMENT
          </p>
        </div>
      </div>
    </footer>
  );
}
