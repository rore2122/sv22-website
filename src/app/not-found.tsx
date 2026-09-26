import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-black text-white [-webkit-tap-highlight-color:transparent]">
      <div
        className="flex min-h-[78dvh] flex-col items-center justify-center px-5 text-center sm:px-8"
        style={{
          paddingTop: "max(2rem, env(safe-area-inset-top))",
        }}
      >
        <img
          src="/images/logo/sv22-logo.png"
          alt="SV22"
          className="mb-10 h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
          loading="lazy"
          decoding="async"
        />

        <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.4em] text-white/35 sm:text-[10px]">
          SV22 / 404
        </p>

        <h1 className="font-display text-[clamp(4.5rem,22vw,9rem)] leading-[0.82] tracking-[-0.06em] text-white">
          LOST
          <br />
          <span className="text-white/25">FRAME.</span>
        </h1>

        <p className="mt-7 max-w-sm text-sm leading-7 text-white/40">
          This moment doesn&apos;t exist on SV22. The page you&apos;re
          looking for may have moved or never existed.
        </p>

        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-black transition hover:bg-white/85"
        >
          Back to SV22

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
