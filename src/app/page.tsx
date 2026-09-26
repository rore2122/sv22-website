"use client";

import { FormEvent, ReactNode, PointerEvent, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Menu,
  X,
} from "lucide-react";
import Lenis from "lenis";
import { Footer } from "@/components/layout/Footer";
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/site-config";

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

/* =========================================================
   PREMIUM KIT: preloader, progress, cursor, magnetic, tilt
========================================================= */

// Pauses a <video> when it scrolls out of view and resumes it when it
// scrolls back in. Without this, every autoplay video on the page keeps
// decoding forever — even ones nowhere near the viewport — which is the
// single biggest cause of scroll lag on mobile GPUs.
function useVisibleVideo(rootMargin = "150px") {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}

function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 1500);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <motion.img
            src="/images/logo/sv22-logo.png"
            alt="SV22"
            className="h-24 w-24 rounded-full sm:h-28 sm:w-28"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="mt-8 h-px w-40 overflow-hidden bg-white/15">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-white/70"
    />
  );
}

function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [big, setBig] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32 });
  const sy = useSpring(y, { stiffness: 380, damping: 32 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // Intentional: pointer capability can only be detected on the client,
    // so this synchronizes React state with a browser API on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    const move = (e: globalThis.PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!(e.target as HTMLElement)?.closest("button,a,input,textarea"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[300] -ml-4 -mt-4 hidden lg:block"
    >
      <motion.div
        animate={{ scale: big ? 2.2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="h-8 w-8 rounded-full border border-white bg-white/10 mix-blend-difference"
      />
    </motion.div>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="inline-block w-fit"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   WHATSAPP FLOATING CTA
========================================================= */

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.91-2.2-.24-.57-.49-.5-.67-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.08 3.16 5.03 4.43.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84.12.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
      <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.87.5 3.63 1.44 5.15L2 22l4.98-1.4a9.96 9.96 0 0 0 5.04 1.37h.01c5.52 0 10-4.48 10-10S17.55 2 12.02 2zm0 18.13a8.1 8.1 0 0 1-4.15-1.14l-.3-.18-2.96.83.82-2.9-.19-.3A8.1 8.1 0 0 1 3.9 12c0-4.48 3.65-8.13 8.13-8.13S20.15 7.52 20.15 12s-3.65 8.13-8.13 8.13z" />
    </svg>
  );
}

// A quick, always-available contact option separate from the full
// booking form — opens WhatsApp directly with a short pre-filled
// greeting. No credentials or tokens involved: wa.me links only need
// the public business number, which is safe to ship client-side.
function WhatsAppFab() {
  const message = encodeURIComponent(
    "Hi SV22 👋 I'd like to know more about your cinematic reels."
  );
  const href = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message SV22 on WhatsApp"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md sm:bottom-7 sm:right-7"
      style={{
        marginBottom: "env(safe-area-inset-bottom)",
        marginRight: "env(safe-area-inset-right)",
      }}
    >
      <WhatsAppIcon size={22} />
    </motion.a>
  );
}

/* =========================================================
   BOOKING MODAL
========================================================= */

function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Guards against a double-tap / double-click opening two WhatsApp
  // windows and sending the request twice.
  const submitLockRef = useRef(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitLockRef.current) return;

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const requirements = String(formData.get("requirements") ?? "").trim();

    if (!name || !phone || !date || !address || !requirements) {
      setError("Please fill in every field before booking your service call.");
      return;
    }

    // Loose sanity check: a real phone number has at least 8 digits.
    // We don't hard-restrict formatting since clients may enter
    // country codes, spaces or dashes.
    const digitCount = phone.replace(/\D/g, "").length;
    if (digitCount < 8) {
      setError("Please enter a valid phone number.");
      return;
    }

    submitLockRef.current = true;
    setError(null);
    setSending(true);

    const text =
      `*SV22 — SERVICE CALL REQUEST* 🎬\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Hi SV22 👋\n\n` +
      `I'd like to book a cinematic service with SV22.\n\n` +
      `*CLIENT DETAILS*\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📅 *Preferred Date:* ${date}\n` +
      `📍 *Event Address:* ${address}\n\n` +
      `*REQUIREMENTS*\n` +
      `📝 ${requirements}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*SV22 / CINEMATIC FILMS*\n` +
      `Shot entirely on iPhone 📱`;

    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;

    try {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) {
        // Popup blocked by the browser — fall back to navigating the
        // current tab so the request is never silently lost.
        window.location.href = url;
      }
      setSubmitted(true);
    } catch {
      setError(
        "We couldn't open WhatsApp automatically. Please message SV22 directly on Instagram instead."
      );
    } finally {
      setSending(false);
      submitLockRef.current = false;
    }
  }

  function closeModal() {
    setSubmitted(false);
    setError(null);
    onClose();
  }

  // Lock background scroll while the modal is open
  // and restore the exact previous scroll position.
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { body } = document;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-xl"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          {/* SUBTLE CINEMATIC LIGHT */}
          <div className="pointer-events-none fixed inset-0">
            <div className="absolute left-[8%] top-[12%] h-[420px] w-[420px] rounded-full bg-white/[0.025] blur-[120px]" />
            <div className="absolute bottom-[8%] right-[5%] h-[360px] w-[360px] rounded-full bg-white/[0.02] blur-[120px]" />
          </div>

          {/* FILM GRAIN */}
          <div
            className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-screen"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.7'/%3E%3C/svg%3E\")",
            }}
          />

          <motion.div
className="relative mx-auto flex min-h-0 w-full max-w-[1500px] flex-col bg-[#050505] text-white lg:min-h-[720px] lg:border-x lg:border-white/[0.06]"            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 24,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5 sm:px-8 lg:px-12">
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-[9px] font-semibold uppercase tracking-[0.38em] text-white/40"
              >
                SV22 / THE BRIEF
              </motion.p>

              <motion.button
                onClick={closeModal}
                aria-label="Close booking form"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className="flex h-10 w-10 items-center justify-center border border-white/[0.12] text-white/50 transition-colors hover:border-white/30 hover:text-white"
              >
                <X size={17} strokeWidth={1.5} />
              </motion.button>
            </div>

            {!submitted ? (
              <div className="grid flex-1 lg:grid-cols-[0.92fr_1.08fr]">
                {/* =====================================================
                   LEFT / EDITORIAL SIDE
                ====================================================== */}
                <div className="flex flex-col justify-between border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-14 lg:border-b-0 lg:border-r lg:px-12 lg:py-16 xl:px-16">
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="mb-6 text-[8px] uppercase tracking-[0.35em] text-white/25"
                    >
                      LET&apos;S CREATE
                    </motion.p>

                    <motion.h2
                      id="booking-modal-title"
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.25,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
className="max-w-[620px] font-display text-[clamp(3rem,14vw,7.4rem)] leading-[0.84] tracking-[-0.065em] sm:text-[clamp(3.7rem,8vw,7.4rem)]"                    >
                      BOOK YOUR
                      <br />
                      <span className="text-white/35">
                        SERVICE CALL.
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.65,
                      }}
className="mt-5 max-w-[390px] text-sm leading-6 text-white/40 sm:mt-10 sm:text-[15px]"                    >
                      Tell us when, where, and how you&apos;d like SV22 to
                      capture it.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.7 }}
                    className="mt-12 hidden lg:block"
                  >
                    <div className="mb-4 h-px w-12 bg-white/25" />

                    <p className="text-[8px] uppercase tracking-[0.35em] text-white/25">
                      SV22 / CINEMATIC FILMS
                    </p>

                    <p className="mt-2 text-[8px] uppercase tracking-[0.3em] text-white/15">
                      SHOT ENTIRELY ON IPHONE
                    </p>
                  </motion.div>
                </div>

                {/* =====================================================
                   RIGHT / FORM
                ====================================================== */}
<div className="flex flex-col justify-center px-5 py-7 sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-16">                  <form
  onSubmit={handleSubmit}
  className="w-full max-w-[620px] lg:ml-auto"
>
                    {/* NAME */}
                    <motion.label
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="block"
                    >
                      <span className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.28em] text-white/35">
                        YOUR NAME
                      </span>

                      <input
                        required
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        className="w-full border-b border-white/[0.14] bg-transparent px-0 py-3 text-[15px] text-white outline-none placeholder:text-white/20 transition-colors duration-300 focus:border-white/60 sm:py-4"
                      />
                    </motion.label>

                    {/* PHONE */}
                    <motion.label
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.36, duration: 0.5 }}
                      className="mt-5 block sm:mt-8"
                    >
                      <span className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.28em] text-white/35">
                        PHONE NUMBER
                      </span>

                      <input
                        required
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        minLength={8}
                        pattern="[0-9+\-\s()]{8,}"
                        title="Enter a valid phone number (digits, spaces, + and - are okay)"
                        placeholder="Your phone number"
                        className="w-full border-b border-white/[0.14] bg-transparent px-0 py-3 text-[15px] text-white outline-none placeholder:text-white/20 transition-colors duration-300 focus:border-white/60 sm:py-4"
                      />
                    </motion.label>

                    {/* DATE */}
                    <motion.label
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.42, duration: 0.5 }}
                      className="mt-5 block sm:mt-8"
                    >
                      <span className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.28em] text-white/35">
                        PREFERRED DATE
                      </span>

                      <div className="relative">
                        <input
                          required
                          name="date"
                          type="date"
                          className="w-full border-b border-white/[0.14] bg-transparent px-0 py-3 pr-10 text-[15px] text-white outline-none transition-colors duration-300 focus:border-white/60 [color-scheme:dark] sm:py-4"
                        />

                        <CalendarDays
                          size={16}
                          strokeWidth={1.5}
                          className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-white/25"
                        />
                      </div>
                    </motion.label>

                    {/* ADDRESS */}
                    <motion.label
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.48, duration: 0.5 }}
                      className="mt-5 block sm:mt-8"
                    >
                      <span className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.28em] text-white/35">
                        EVENT ADDRESS
                      </span>

                      <input
                        required
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        placeholder="City / venue / location"
                        className="w-full border-b border-white/[0.14] bg-transparent px-0 py-3 text-[15px] text-white outline-none placeholder:text-white/20 transition-colors duration-300 focus:border-white/60 sm:py-4"
                      />
                    </motion.label>

                    {/* REQUIREMENTS */}
                    <motion.label
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.54, duration: 0.5 }}
                      className="mt-5 block sm:mt-8"
                    >
                      <span className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.28em] text-white/35">
                        REQUIREMENTS
                      </span>

                      <textarea
                        required
                        name="requirements"
                        rows={2}
                        placeholder="Tell us what you need..."
className="w-full resize-none border-b border-white/[0.14] bg-transparent px-0 py-2.5 text-[15px] leading-6 text-white outline-none placeholder:text-white/20 transition-colors duration-300 focus:border-white/60 sm:py-4"                      />
                    </motion.label>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.64,
                        duration: 0.6,
                      }}
                    >
                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{
                          scale: 1.01,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
className="group mt-6 flex h-14 w-full items-center justify-between bg-white px-5 text-[9px] font-bold uppercase tracking-[0.22em] text-black transition-colors duration-500 hover:bg-transparent hover:text-white hover:ring-1 hover:ring-white/25 disabled:opacity-60 sm:mt-10 sm:h-16 sm:px-6"                      >
                        <span>{sending ? "OPENING WHATSAPP..." : "BOOK A SERVICE CALL"}</span>

                        <span className="flex h-9 w-9 items-center justify-center border border-black/15 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-white/25">
                          <ArrowUpRight
                            size={16}
                            strokeWidth={1.5}
                          />
                        </span>
                      </motion.button>
                    </motion.div>

                    <div role="status" aria-live="polite" className="sr-only">
                      {sending ? "Opening WhatsApp" : ""}
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="mt-4 text-[10px] uppercase tracking-[0.15em] text-red-400"
                      >
                        {error}
                      </motion.p>
                    )}

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.75, duration: 0.6 }}
                      className="mt-4 text-[8px] uppercase tracking-[0.2em] text-white/20"
                    >
                      WE&apos;LL GET BACK TO YOU SHORTLY
                    </motion.p>
                  </form>
                </div>
              </div>
            ) : (
              /* =====================================================
                 SUCCESS STATE
              ====================================================== */
              <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full max-w-xl text-center"
                >
                  <motion.div
                    initial={{
                      scale: 0.7,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.15,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mx-auto mb-8 flex h-16 w-16 items-center justify-center border border-white/20 bg-white text-black"
                  >
                    <Check size={27} strokeWidth={1.7} />
                  </motion.div>

                  <p className="mb-4 text-[8px] font-semibold uppercase tracking-[0.4em] text-white/30">
                    REQUEST RECEIVED
                  </p>

                  <h2 className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.85] tracking-[-0.065em]">
                    YOU&apos;RE
                    <br />
                    <span className="text-white/35">ON.</span>
                  </h2>

                  <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-white/40">
                    The SV22 team will contact you shortly to discuss your
                    booking and bring your idea to life.
                  </p>

                  <motion.button
                    onClick={closeModal}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-9 inline-flex items-center gap-3 border-b border-white/20 pb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-white hover:text-white"
                  >
                    CLOSE
                    <ArrowUpRight size={14} strokeWidth={1.5} />
                  </motion.button>
                </motion.div>
              </div>
            )}

            {/* MOBILE FOOTER */}
            {!submitted && (
              <div className="border-t border-white/[0.06] px-5 py-4 sm:px-8 lg:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[7px] uppercase tracking-[0.3em] text-white/20">
                    SV22 / CINEMATIC FILMS
                  </span>

                  <span className="text-[7px] uppercase tracking-[0.3em] text-white/20">
                    SHOT ON IPHONE
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({
  onBook,
}: {
  onBook: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock background scroll on mobile while the menu is open.
  useEffect(() => {
    if (!menuOpen) return;

    const scrollY = window.scrollY;
    const { body } = document;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  function scrollTo(id: string) {
    setMenuOpen(false);

    window.setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const top =
        element.getBoundingClientRect().top + window.scrollY - 12;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }, 80);
  }

  return (
    <>
      <header
        className="fixed left-0 top-0 z-50 w-full px-5 py-5 sm:px-8 lg:px-10"
        style={{
          paddingTop: "max(1.25rem, env(safe-area-inset-top))",
        }}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between">
          {/* LOGO */}
          <button
            onClick={() => scrollTo("top")}
            className="group flex items-center gap-3"
          >
            <img
              src="/images/logo/sv22-logo.png"
              alt="SV22"
              width={40}
              height={40}
              decoding="async"
              className="h-10 w-10 rounded-full object-cover"
            />

            <span className="hidden text-[8px] font-semibold uppercase tracking-[0.35em] text-white/35 sm:block">
              Cinematic
            </span>
          </button>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-9 lg:flex">
            <button
              onClick={() => scrollTo("work")}
              className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              Work
            </button>

            <button
              onClick={() => scrollTo("services")}
              className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              The Experience
            </button>

            <button
              onClick={() => scrollTo("about")}
              className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              About
            </button>

            <button
              onClick={() => scrollTo("faq")}
              className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              FAQ
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SV22 on Instagram"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
            >
              <Instagram
                size={17}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            <button
              onClick={onBook}
              className="rounded-full bg-white px-5 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black transition hover:bg-white/85"
            >
              Start Your Booking
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            whileTap={{ scale: 0.88 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition active:bg-black/50 lg:hidden"
          >
            <Menu size={19} />
          </motion.button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-black px-6 py-7 [-webkit-overflow-scrolling:touch]"
            style={{
              paddingTop: "max(1.75rem, env(safe-area-inset-top))",
              paddingBottom: "max(1.75rem, env(safe-area-inset-bottom))",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <img
                src="/images/logo/sv22-logo.png"
                alt="SV22"
                decoding="async"
                className="h-9 w-auto"
              />

              <motion.button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                whileTap={{ scale: 0.88 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white active:bg-white/10"
              >
                <X size={19} />
              </motion.button>
            </div>

            <div className="flex flex-1 flex-col justify-center">
              {[
                ["work", "Work"],
                ["services", "Experience"],
                ["about", "About"],
                ["faq", "FAQ"],
              ].map(([id, label], index) => (
                <motion.button
                  key={id}
                  initial={{
                    opacity: 0,
                    x: -25,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  onClick={() => scrollTo(id)}
                  whileTap={{ scale: 0.97, x: 4 }}
                  className="border-b border-white/10 py-6 text-left font-display text-[clamp(2.25rem,11vw,3.25rem)] tracking-[-0.05em] text-white transition active:text-white/70"
                >
                  {label}
                </motion.button>
              ))}

              <motion.button
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setMenuOpen(false);
                  onBook();
                }}
                className="mt-10 flex h-14 items-center justify-between rounded-full bg-white px-6 text-[9px] font-bold tracking-[0.2em] text-black active:bg-white/85"
              >
                Start Your Booking

                <ArrowUpRight size={18} />
              </motion.button>

              <motion.a
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.38,
                }}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-4 flex h-14 items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-6 text-[9px] font-bold tracking-[0.2em] text-white active:bg-white/10"
              >
                FOLLOW SV22 ON INSTAGRAM

                <Instagram size={18} strokeWidth={1.7} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero({
  onBook,
}: {
  onBook: () => void;
}) {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useSpring(useMotionValue(0), {
    stiffness: 80,
    damping: 20,
    mass: 0.35,
  });
  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    pointerX.set(x);
  };

  const handleHeroPointerLeave = () => {
    pointerX.set(0);
  };

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "15%"]
  );

  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.07]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "-18%"]
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.75],
    [1, 0]
  );

  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "-10%"]
  );

  const backgroundX = useTransform(
    pointerX,
    [-0.5, 0.5],
    prefersReducedMotion ? ["0%", "0%"] : ["-0.45%", "0.45%"]
  );

  const titleX = useTransform(
    pointerX,
    [-0.5, 0.5],
    prefersReducedMotion ? ["0%", "0%"] : ["-0.18%", "0.18%"]
  );

  return (
    <section
      id="top"
      ref={heroRef}
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
      className="relative flex min-h-[100dvh] items-end overflow-hidden bg-black"
    >
      {/* HERO VIDEO */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: backgroundX,
          y: backgroundY,
          scale: backgroundScale,
        }}
      >
        <video
          ref={useVisibleVideo()}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.12] contrast-[1.05]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="/videos/hero.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* CINEMATIC GRADING */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.58)_100%)]" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/35 to-transparent" />

      {/* SUBTLE FILM GRAIN */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9) 0 0.7px, transparent 0.8px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.8) 0 0.6px, transparent 0.7px), radial-gradient(circle at 55% 40%, rgba(255,255,255,0.7) 0 0.5px, transparent 0.6px)",
          backgroundSize: "17px 17px, 23px 23px, 29px 29px",
        }}
      />

      {/* LIGHT STREAK */}
      <motion.div
        className="pointer-events-none absolute left-[-10%] top-[35%] h-px w-[55%] bg-white/20 blur-[2px]"
        animate={{
          x: ["0%", "25%", "0%"],
          opacity: [0.15, 0.45, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute right-[-15%] top-[25%] h-[25rem] w-[25rem] rounded-full bg-white/[0.035] blur-[100px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* CONTENT */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
          paddingTop: "max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))",
        }}
        className="relative z-20 mx-auto w-full max-w-[1600px] px-5 pb-24 sm:px-8 sm:pb-16 sm:pt-40 lg:px-10 lg:pb-20"
      >
        <div className="max-w-5xl">
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="mb-6 text-[9px] font-semibold uppercase tracking-[0.4em] text-white/55 sm:text-[10px]"
          >
            SV22 / CINEMATIC AUTOMOTIVE FILMS
          </motion.p>

          <motion.h1
            style={{
              y: titleY,
              x: titleX,
            }}
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-[clamp(3rem,12.5vw,6rem)] leading-[0.8] tracking-[-0.08em] text-white sm:text-[clamp(5rem,15vw,9rem)] lg:text-[12vw]"
          >
            EVERY
            <br />
            <span className="text-white/90">MOMENT.</span>
          </motion.h1>

          <div className="mt-9 flex flex-col gap-8 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
              className="max-w-md"
            >
              <p className="text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
                Cinematic films for the moments that matter, crafted entirely
                on iPhone.
              </p>

              <Magnetic>
              <motion.button
                onClick={onBook}
                whileTap={{ scale: 0.95 }}
                className="group mt-7 flex items-center gap-3 rounded-full bg-white px-5 py-3.5 text-[9px] font-bold tracking-[0.2em] text-black transition hover:bg-white/90 active:bg-white/85"
              >
                Start Your Booking

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1 group-active:translate-x-1">
                  <ArrowUpRight size={14} />
                </span>
              </motion.button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.45,
              }}
              className="grid grid-cols-2 gap-8 border-t border-white/15 pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0"
            >
              <div>
                <p className="font-display text-3xl tracking-[-0.04em] text-white sm:text-4xl">
                  300+
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-white/35">
                  Cinematic Reels
                </p>
              </div>

              <div>
                <p className="font-display text-3xl tracking-[-0.04em] text-white sm:text-4xl">
                  01
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-white/35">
                  iPhone Camera
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-4 sm:mt-20">
          <span className="text-[8px] uppercase tracking-[0.35em] text-white/30">
            SV22 / CINEMATIC
          </span>

          <motion.div
            animate={{
              y: [0, 7, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center gap-2 text-[8px] uppercase tracking-[0.35em] text-white/35"
          >
            Scroll to explore
            <ArrowDown size={13} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================================================
   IPHONE SECTION
========================================================= */

function IphoneSection() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? ["0%", "0%", "0%"] : ["4%", "0%", "-4%"],
  );

  const videoScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.02, 1, 1.02],
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [0, 0, 0] : [20, 0, -20],
  );

  return (
    <section
      id="about"
      ref={ref}
      className="relative flex min-h-[84dvh] items-end overflow-hidden bg-black sm:min-h-[92dvh] lg:min-h-[100dvh]"
    >
      {/* SOFT FULL-SCREEN BACKGROUND — only on sm+. On mobile the main video
          below switches to object-cover and fills the screen on its own, so
          this second blurred copy (previously *more* blurred on mobile than
          desktop — the wrong way round) doesn't need to exist there at all.
          Blurring a live-playing video is one of the heaviest things a phone
          GPU can be asked to do continuously; dropping the duplicate on
          mobile removes both an extra video decode and that blur cost. */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden bg-black sm:block">
        <video
          ref={useVisibleVideo()}
          src="/videos/sv22-signature.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35 blur-[8px] scale-[1.08]"
        />
      </div>

      {/* MAIN SIGNATURE VIDEO */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: videoY, scale: videoScale }}
      >
        <video
          ref={useVisibleVideo()}
          src="/videos/sv22-signature.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover object-center sm:object-contain"
        />
      </motion.div>

      {/* CINEMATIC GRADING */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_14%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black via-black/55 to-transparent" />

      {/* CONTENT */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-9 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-10 lg:pb-20 lg:pt-40"
      >
        <div className="max-w-5xl">
          <p className="mb-4 text-[8px] font-semibold uppercase tracking-[0.38em] text-white/55 sm:mb-5 sm:text-[10px]">
            SV22 / OUR SIGNATURE
          </p>

          <h2 className="font-display text-[clamp(3rem,15vw,6rem)] leading-[0.78] tracking-[-0.08em] text-white sm:text-[clamp(5rem,13vw,9rem)] lg:text-[10vw]">
            SHOT ON
            <br />
            <span className="text-white/35">iPHONE.</span>
          </h2>

          <p className="mt-6 max-w-xl font-display text-[clamp(1.45rem,5vw,3rem)] leading-[0.98] tracking-[-0.045em] text-white/90 sm:mt-8">
            The moments you live.
            <br />
            <span className="text-white/35">The films you keep.</span>
          </p>

          <div className="mt-7 flex items-center gap-3 sm:mt-9 sm:gap-4">
            <span className="h-px w-8 bg-white/35 sm:w-10" />
            <span className="text-[7px] font-semibold uppercase tracking-[0.3em] text-white/40 sm:text-[8px] sm:tracking-[0.35em]">
              WE FIND THE FILM INSIDE THE MOMENT
            </span>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM LABEL */}
      <div className="pointer-events-none absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between sm:bottom-7 sm:left-8 sm:right-8 lg:left-10 lg:right-10">
        <span className="text-[7px] uppercase tracking-[0.3em] text-white/30 sm:text-[8px] sm:tracking-[0.35em]">
          SV22 / FILMED ON IPHONE
        </span>
        <span className="text-[7px] uppercase tracking-[0.3em] text-white/30 sm:text-[8px] sm:tracking-[0.35em]">
          SIGNATURE FILM
        </span>
      </div>
    </section>
  );
}

/* =========================================================
   WORK / MOMENTS SECTION
========================================================= */

function WorkSection() {
  const projects = [
    {
      number: "01",
      title: "A MOMENT IN MOTION",
      subtitle: "THE FIRST FRAME",
      video: "/videos/car1.mp4",
      orientation: "portrait" as const,
    },
    {
      number: "02",
      title: "THE ARRIVAL",
      subtitle: "A MEMORY IN MOTION",
      video: "/videos/car2.mp4",
      orientation: "portrait" as const,
    },
    {
      number: "03",
      title: "THE EXPERIENCE",
      subtitle: "MADE TO REMEMBER",
      video: "/videos/car3.mp4",
      orientation: "landscape" as const,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  // Track whether the carousel is actually on screen, so the rotation
  // timer and the active video stop burning CPU/GPU once the user has
  // scrolled past this section.
  const sectionRef = useRef<HTMLElement | null>(null);
  const [sectionInView, setSectionInView] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { rootMargin: "150px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionInView) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [projects.length, sectionInView]);

  const selectProject = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-24 sm:py-32 lg:py-40"
    >
      {/* =====================================================
          INTRO
      ===================================================== */}
      <div className="px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="mb-5 flex items-center gap-3 sm:mb-7">
                <span className="h-px w-8 bg-white/35" />
                <span className="text-[8px] font-semibold uppercase tracking-[0.42em] text-white/35 sm:text-[9px]">
                  SV22 / WORK
                </span>
              </div>

              <h2 className="font-display text-[clamp(3.2rem,13vw,6rem)] leading-[0.78] tracking-[-0.08em] text-white sm:text-[clamp(4.5rem,10vw,7.5rem)] lg:text-[8vw]">
                SELECTED
                <br />
                <span className="text-white/25">MOMENTS.</span>
              </h2>
            </div>

            <div className="hidden max-w-[280px] pb-1 text-right lg:block">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
                Real moments.
                <br />
                Real movement.
                <br />
                One iPhone.
              </p>
            </div>
          </div>

          <p className="mt-7 max-w-sm text-xs leading-6 text-white/35 lg:hidden">
            Real moments. Real movement. Cinematic films crafted entirely on
            iPhone.
          </p>
        </div>
      </div>

      {/* =====================================================
          CINEMATIC CAROUSEL STAGE
      ===================================================== */}
      <div className="mt-12 px-5 sm:mt-16 sm:px-8 lg:mt-20 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.015] shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:rounded-[2.5rem]">
            {/* Ambient active-film background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
              {projects.map((project, index) => (
                <motion.video
                  key={`ambient-${project.number}`}
                  src={project.video}
                  autoPlay={index === activeIndex && sectionInView}
                  muted
                  loop
                  playsInline
                  preload={index === activeIndex ? "auto" : "none"}
                  aria-hidden="true"
                  animate={{
                    opacity: index === activeIndex ? 0.34 : 0,
                    scale: index === activeIndex ? 1.06 : 1.12,
                  }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover object-center blur-[26px] sm:blur-[20px]"
                />
              ))}
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(0,0,0,0.72)_100%)]" />
            </div>

            {/* Main film */}
            <div className="relative flex h-[60dvh] min-h-[500px] items-center justify-center overflow-hidden sm:h-[68dvh] sm:min-h-[600px] lg:h-[76dvh] lg:min-h-[680px]">
              {projects.map((project, index) => (
                <motion.div
                  key={project.number}
                  initial={false}
                  animate={{
                    opacity: index === activeIndex ? 1 : 0,
                    scale: index === activeIndex ? 1 : 0.965,
                  }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute inset-0 flex items-center justify-center ${
                    index === activeIndex
                      ? "pointer-events-auto"
                      : "pointer-events-none"
                  }`}
                >
                  <video
                    key={`${project.number}-${activeIndex}`}
                    src={project.video}
                    autoPlay={index === activeIndex && sectionInView}
                    muted
                    loop
                    playsInline
                    preload={index === activeIndex ? "auto" : "none"}
                    aria-label={`${project.title} — SV22 cinematic film`}
                    className={
                      project.orientation === "portrait"
                        ? "h-[88%] w-auto max-w-[78%] rounded-[1.1rem] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:h-[92%] sm:max-w-[52%] sm:rounded-[1.4rem] lg:max-w-[36%]"
                        : "h-auto w-[92%] max-h-[78%] rounded-[1.1rem] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:w-[88%] sm:rounded-[1.4rem] lg:w-[82%]"
                    }
                  />
                </motion.div>
              ))}

              {/* Stage index */}
              <div className="pointer-events-none absolute left-5 top-5 z-20 sm:left-8 sm:top-8">
                <span className="text-[8px] font-semibold uppercase tracking-[0.32em] text-white/45 sm:text-[9px]">
                  {activeProject.number} / 03
                </span>
              </div>

              <div className="pointer-events-none absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
                <span className="text-[7px] font-semibold uppercase tracking-[0.3em] text-white/30 sm:text-[8px]">
                  FILMED ON IPHONE
                </span>
              </div>

              {/* Cinematic stage vignette */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
            </div>
          </div>

          {/* =================================================
              FILM INFORMATION / SELECTORS
          ================================================= */}
          <div className="mt-7 sm:mt-9">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {projects.map((project, index) => {
                const active = index === activeIndex;

                return (
                  <button
                    key={project.number}
                    type="button"
                    onClick={() => selectProject(index)}
                    aria-label={`View ${project.title}`}
                    aria-pressed={active}
                    className={`group relative min-h-[92px] overflow-hidden rounded-2xl border px-3 py-4 text-left transition-all duration-500 sm:min-h-[112px] sm:rounded-3xl sm:px-5 sm:py-5 ${
                      active
                        ? "border-white/25 bg-white/[0.07]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.045]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[8px] font-semibold tracking-[0.2em] transition-colors sm:text-[9px] ${
                          active ? "text-white" : "text-white/30"
                        }`}
                      >
                        {project.number}
                      </span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                          active
                            ? "scale-100 bg-white"
                            : "scale-75 bg-white/15"
                        }`}
                      />
                    </div>

                    <div className="absolute bottom-4 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5">
                      <p
                        className={`text-[7px] font-semibold uppercase tracking-[0.18em] transition-colors sm:text-[8px] ${
                          active ? "text-white/75" : "text-white/35"
                        }`}
                      >
                        {project.subtitle}
                      </p>
                      <p
                        className={`mt-1 text-[9px] font-medium uppercase tracking-[0.05em] transition-colors sm:text-[11px] ${
                          active ? "text-white" : "text-white/45"
                        }`}
                      >
                        {project.title}
                      </p>
                    </div>

                    {/* Active 5-second progress */}
                    {active && (
                      <motion.span
                        key={`progress-${activeIndex}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-px w-full origin-left bg-white/60"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dots + CTA */}
            <div className="mt-7 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2" aria-label="Film carousel pagination">
                {projects.map((project, index) => (
                  <button
                    key={project.number}
                    type="button"
                    onClick={() => selectProject(index)}
                    aria-label={`Go to film ${project.number}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className="group flex h-6 w-6 items-center justify-center"
                  >
                    <span
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === activeIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/20 group-hover:bg-white/45"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-[7px] uppercase tracking-[0.3em] text-white/20">
                  AUTO / 5 SEC
                </span>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-between gap-8 rounded-full border border-white/15 bg-white/[0.04] px-5 text-[8px] font-bold uppercase tracking-[0.28em] text-white transition-all duration-500 hover:border-white/30 hover:bg-white hover:text-black sm:h-14 sm:px-7 sm:text-[9px]"
              >
                SEE OUR WORK
                <span className="text-sm transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CLOSING STATEMENT
      ===================================================== */}
      <div className="px-5 pb-2 pt-24 sm:px-8 sm:pt-32 lg:px-10 lg:pt-40">
        <div className="mx-auto max-w-[1500px] border-t border-white/10 pt-8 sm:pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.88] tracking-[-0.06em] text-white/85">
              EVERY MOMENT.
              <br />
              <span className="text-white/20">A FILM.</span>
            </p>

            <span className="text-[7px] uppercase tracking-[0.35em] text-white/20 sm:text-[8px]">
              SV22 / CINEMATIC FILMS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   EXPERIENCE SECTION
========================================================= */

function ServicesSection({
  onBook,
}: {
  onBook: () => void;
}) {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-end">
          {/* LEFT */}
          <div>
            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.4em] text-white/30">
              WHAT WE DO
            </p>

            <h2 className="max-w-3xl font-display text-[clamp(3rem,14vw,5.5rem)] leading-[0.8] tracking-[-0.07em] text-white sm:text-[clamp(4rem,10vw,6.5rem)] lg:text-[8vw]">
              WHATEVER
              <br />
              <span className="text-white/30">THE MOMENT.</span>
            </h2>
          </div>

          {/* RIGHT */}
          <div className="max-w-xl lg:ml-auto">
            <p className="text-lg leading-8 text-white/55 sm:text-xl sm:leading-9">
              A new arrival. A celebration. A milestone. A moment you&apos;ve
              been waiting for.
            </p>

            <p className="mt-6 text-sm leading-7 text-white/35">
              Tell us what you&apos;re planning and we&apos;ll create the film
              around it — with cinematic movement, detail and emotion,
              captured entirely on iPhone.
            </p>

            <motion.button
              onClick={onBook}
              whileTap={{ scale: 0.96 }}
              className="group mt-9 flex items-center gap-4 rounded-full bg-white px-6 py-4 text-[9px] font-bold tracking-[0.2em] text-black transition hover:bg-white/90 active:bg-white/85"
            >
              Start Your Booking

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1">
                <ArrowUpRight size={15} />
              </span>
            </motion.button>
          </div>
        </div>

        {/* STATEMENT */}
        <div className="mt-28 border-t border-white/10 pt-8 sm:mt-40">
          <p className="max-w-5xl font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            YOU BRING THE MOMENT.
            <br />
            <span className="text-white/25">WE MAKE IT LAST.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
========================================================= */

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What events does SV22 cover?",
    a: "SV22 films life's moments that matter — celebrations, arrivals, milestones and everyday events — alongside cinematic automotive reels. Tell us what you're planning when you book and we'll let you know how we can help.",
  },
  {
    q: "Do you shoot using an iPhone?",
    a: "Yes — every SV22 film is shot entirely on iPhone. It's the core of the SV22 signature look.",
  },
  {
    q: "How do I book SV22?",
    a: "Tap \u201cStart Your Booking\u201d anywhere on the site to open the booking form. Submitting it opens a pre-filled WhatsApp message you send directly to SV22. You can also reach out via Instagram.",
  },
  {
    q: "How far in advance should I book?",
    a: "As early as possible once you have a date in mind — especially during busier periods — so we can confirm availability for your event.",
  },
  {
    q: "When will I receive my reel?",
    a: "Delivery timelines depend on the scope of the shoot and are confirmed with you directly after booking.",
  },
  {
    q: "Can I request a specific editing style?",
    a: "You're welcome to share references or preferences in the requirements field of the booking form. We'll do our best to accommodate them within the SV22 cinematic style.",
  },
  {
    q: "Can I request a specific song or audio?",
    a: "Yes, you can share a preference when you book. We'll confirm whether it's a good fit, taking platform and licensing considerations into account.",
  },
  {
    q: "Do you cover locations outside the primary service area?",
    a: "Let us know your event location in the booking form. We're happy to discuss travel for locations outside our primary service area.",
  },
  {
    q: "Can I request revisions?",
    a: "Yes — once you've received your reel, reach out via WhatsApp or Instagram and we'll discuss your revision request directly.",
  },
  {
    q: "What happens if I need to reschedule my event?",
    a: "Message SV22 as soon as possible via WhatsApp or Instagram and we'll do our best to find a new date, subject to availability.",
  },
  {
    q: "How will SV22 contact me after submitting the booking form?",
    a: "The booking form opens a pre-filled WhatsApp message for you to send. Once SV22 receives it, our team will reply to you directly on WhatsApp to confirm the details.",
  },
  {
    q: "What information is required to make a booking?",
    a: "Your name, phone number, preferred event date, event address, and a short note on your requirements — that's everything the booking form asks for.",
  },
];

function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border-b border-white/10">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-white sm:py-7"
        >
          <span
            className={`font-display text-[clamp(1.15rem,3.2vw,1.7rem)] leading-tight tracking-[-0.02em] transition-colors duration-300 ${
              isOpen ? "text-white" : "text-white/70"
            }`}
          >
            {item.q}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/15 text-white/60"
            aria-hidden="true"
          >
            <span className="relative block h-3 w-3">
              <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current" />
            </span>
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-sm leading-7 text-white/45 sm:pb-8 sm:text-[15px]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="mb-5 flex items-center gap-3 sm:mb-7">
            <span className="h-px w-8 bg-white/35" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.42em] text-white/35 sm:text-[9px]">
              SV22 / FAQ
            </span>
          </div>

          <h2 className="font-display text-[clamp(2.6rem,10vw,4.5rem)] leading-[0.85] tracking-[-0.06em] text-white">
            QUESTIONS,
            <br />
            <span className="text-white/25">ANSWERED.</span>
          </h2>
        </div>

        <div className="border-t border-white/10">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.q}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FINAL CTA
========================================================= */

function FinalCTA({ onBook }: { onBook: () => void }) {
  return (
    <section
      id="booking"
      className="relative isolate min-h-[82dvh] overflow-hidden bg-black text-white sm:min-h-[88dvh] lg:min-h-screen"
    >
      {/* =========================================================
          CINEMATIC CTA VIDEO
         ========================================================= */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-black">
        <video
          ref={useVisibleVideo()}
          src="/videos/cta.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.12] contrast-[1.05]"
        />
      </div>

      {/* =========================================================
          EXTREME DARK CINEMATIC GRADING
         ========================================================= */}

      {/* Overall darkness */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black/25" />

      {/* Top darkness */}
<div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32%] bg-gradient-to-b from-black/70 via-black/25 to-transparent" />

      {/* Bottom darkness */}
<div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[42%] bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Cinematic vignette */}
<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.42)_100%)]" />

      {/* Subtle film grain */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.65'/%3E%3C/svg%3E\")",
        }}
      />

      {/* =========================================================
          CONTENT
         ========================================================= */}
      <div className="relative mx-auto flex min-h-[82dvh] max-w-[1600px] flex-col justify-end px-5 pb-10 pt-32 sm:min-h-[88dvh] sm:px-8 sm:pb-14 lg:min-h-screen lg:px-10 lg:pb-20">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 flex items-center gap-3 sm:mb-9"
        >
          <span className="h-px w-8 bg-white/45 sm:w-12" />

          <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/55 sm:text-[10px]">
            SV22 / LET&apos;S CREATE
          </p>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 1,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-[1100px] font-serif text-[clamp(3.6rem,10vw,9rem)] font-normal leading-[0.84] tracking-[-0.055em]"
        >
          YOU BRING
          <br />
          <span className="text-white/38">THE MOMENT.</span>
        </motion.h2>

        {/* Bottom information row */}
        <div className="mt-12 flex flex-col gap-9 border-t border-white/15 pt-7 sm:mt-16 sm:pt-8 lg:flex-row lg:items-end lg:justify-between">
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.8,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[430px] text-sm leading-6 text-white/55 sm:text-[15px]"
          >
            We turn the moments you care about into cinematic films,
            crafted entirely on iPhone.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.8,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Magnetic>
              <motion.button
                type="button"
                onClick={onBook}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-5 border border-white/30 bg-white px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition-colors duration-500 hover:bg-transparent hover:text-white sm:px-7 sm:py-5"
              >
                <span>START YOUR BOOKING</span>

                <span className="flex h-9 w-9 items-center justify-center border border-black/15 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-white/30">
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                  />
                </span>
              </motion.button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Tiny bottom signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex items-center justify-between text-[8px] uppercase tracking-[0.28em] text-white/30 sm:mt-16 sm:text-[9px]"
        >
          <span>SV22 / CINEMATIC FILMS</span>
          <span>SHOT ON IPHONE</span>
        </motion.div>
      </div>
    </section>
  );
}
/* =========================================================
   LENIS SMOOTH SCROLL
========================================================= */

function SmoothScroll() {
  useEffect(() => {
    // Keep native iPhone/iPad touch scrolling.
    // Lenis touch syncing can lock or fight Safari's native scrolling.
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  // Prevent the iOS/Android rubber-band bounce from revealing empty
  // space at the top/bottom of the page during fast swipes.
  useEffect(() => {
    const { style } = document.documentElement;
    const previous = style.overscrollBehaviorY;
    style.overscrollBehaviorY = "none";
    return () => {
      style.overscrollBehaviorY = previous;
    };
  }, []);

  return (
    <main className={`min-h-[100dvh] overflow-x-hidden bg-black text-white [-webkit-tap-highlight-color:transparent]`}>
      <Preloader />
      <ScrollProgress />
      <CustomCursor />
      <SmoothScroll />
      <Navbar
        onBook={() => setBookingOpen(true)}
      />

      <Hero
        onBook={() => setBookingOpen(true)}
      />

      <IphoneSection />

      <WorkSection />

      <ServicesSection
        onBook={() => setBookingOpen(true)}
      />

      <FaqSection />

      <FinalCTA
        onBook={() => setBookingOpen(true)}
      />

      <Footer />

      <WhatsAppFab />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </main>
  );
}
