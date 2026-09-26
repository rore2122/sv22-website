import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export function LegalShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-black text-white [-webkit-tap-highlight-color:transparent]">
      <header
        className="px-5 py-5 sm:px-8 sm:py-6 lg:px-10"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
      >
        <nav className="mx-auto flex max-w-[1000px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo/sv22-logo.png"
              alt="SV22"
              className="h-9 w-9 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/50">
              SV22
            </span>
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to site
          </Link>
        </nav>
      </header>

      <article className="px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-10">
        <div className="mx-auto max-w-[820px]">
          <p className="mb-4 text-[8px] font-semibold uppercase tracking-[0.4em] text-white/35 sm:text-[9px]">
            {eyebrow}
          </p>

          <h1 className="font-display text-[clamp(2.4rem,9vw,4.5rem)] leading-[0.88] tracking-[-0.055em] text-white">
            {title}
          </h1>

          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-white/30">
            Last updated: {updated}
          </p>

          <div className="prose-legal mt-14 max-w-none border-t border-white/10 pt-10">
            {children}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
