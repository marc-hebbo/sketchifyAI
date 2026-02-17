import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";
import {
  ArrowRight,
  Check,
  Sparkles,
  Wand2,
  LayoutGrid,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Logo } from "@/components/logo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function Home() {
  return (
    <div
      className={`${manrope.variable} ${fraunces.variable} min-h-screen bg-[#0b0d12] text-white`}
    >
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.28),rgba(11,13,18,0.1)_65%)] blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.28),rgba(11,13,18,0)_70%)] blur-3xl" />

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <Logo className="h-6" />
            <span className="font-[var(--font-fraunces)] text-lg tracking-wide">
              Sketch-to-UI
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a className="transition hover:text-white" href="#features">
              Features
            </a>
            <a className="transition hover:text-white" href="#how">
              How it works
            </a>
            <a className="transition hover:text-white" href="#pricing">
              Pricing
            </a>
            <a className="transition hover:text-white" href="#faq">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              className="hidden rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-white/50 hover:text-white md:inline-flex"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[#fcd34d] px-5 py-2.5 text-xs font-semibold text-[#14161a] shadow-[0_12px_30px_rgba(252,211,77,0.35)] transition hover:-translate-y-0.5"
              href="/dashboard"
            >
              Open app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-28 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Ship design-ready screens from rough sketches in minutes.
            </div>
            <div className="space-y-6">
              <h1 className="font-[var(--font-fraunces)] text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Sketch once. Generate the UI stack that your team can build.
              </h1>
              <p className="text-base text-white/70 sm:text-lg">
                Convert whiteboards, napkin sketches, or product ideas into
                polished layouts, responsive grids, and style tokens. Keep every
                iteration synced to your Convex workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-[#120d07] shadow-[0_16px_40px_rgba(249,115,22,0.4)] transition hover:-translate-y-0.5"
                href="/dashboard"
              >
                Generate your first screen
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
                href="#demo"
              >
                See a live example
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                SOC2-ready data handling
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-emerald-300" />
                Average generation: 38 seconds
              </div>
            </div>
          </div>

          <div className="relative" id="demo">
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#121620] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Sketch-to-UI Studio</span>
                <span className="rounded-full border border-white/10 px-2 py-1">
                  Live preview
                </span>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-emerald-300">
                    Input
                  </div>
                  <div className="mt-3 h-28 rounded-xl border border-dashed border-white/20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-amber-200">
                    Generated layout
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-24 rounded-full bg-white/70" />
                      <div className="h-3 w-10 rounded-full bg-white/25" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-20 rounded-xl bg-white/15" />
                      <div className="h-20 rounded-xl bg-white/10" />
                      <div className="h-20 rounded-xl bg-white/10" />
                      <div className="h-20 rounded-xl bg-white/15" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-4 text-sm">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Tokens exported to Tailwind + Figma</span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70 sm:grid-cols-3 sm:text-left">
          <div>
            <p className="font-[var(--font-fraunces)] text-3xl text-white">
              3x
            </p>
            <p>Faster UI handoff for product teams</p>
          </div>
          <div>
            <p className="font-[var(--font-fraunces)] text-3xl text-white">
              120+
            </p>
            <p>Reusable style primitives per project</p>
          </div>
          <div>
            <p className="font-[var(--font-fraunces)] text-3xl text-white">
              15k
            </p>
            <p>Layouts generated in the last 30 days</p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto w-full max-w-6xl px-6 py-16"
      >
        <div className="flex flex-col gap-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-300">
              Built for velocity
            </p>
            <h2 className="font-[var(--font-fraunces)] text-3xl text-white sm:text-4xl">
              Everything you need to go from sketch to shipping
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-[#10151f] p-6">
              <div className="mb-4 inline-flex rounded-full bg-white/5 p-3">
                <Wand2 className="h-5 w-5 text-amber-200" />
              </div>
              <h3 className="text-lg font-semibold">Intelligent cleanup</h3>
              <p className="mt-2 text-sm text-white/70">
                Remove messy lines, detect hierarchy, and snap to an 8px grid
                without losing the intent of the sketch.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#10151f] p-6">
              <div className="mb-4 inline-flex rounded-full bg-white/5 p-3">
                <LayoutGrid className="h-5 w-5 text-emerald-300" />
              </div>
              <h3 className="text-lg font-semibold">Responsive outputs</h3>
              <p className="mt-2 text-sm text-white/70">
                Generate layout variants for desktop, tablet, and mobile with
                consistent components and constraints.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#10151f] p-6">
              <div className="mb-4 inline-flex rounded-full bg-white/5 p-3">
                <ShieldCheck className="h-5 w-5 text-sky-200" />
              </div>
              <h3 className="text-lg font-semibold">Secure collaboration</h3>
              <p className="mt-2 text-sm text-white/70">
                Keep every sketch, design, and token in your Convex workspace
                with role-based access baked in.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-10 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0f1420] via-[#121826] to-[#14121b] p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-amber-200">
              How it works
            </p>
            <h2 className="font-[var(--font-fraunces)] text-3xl text-white sm:text-4xl">
              A simple flow your whole team can follow
            </h2>
            <p className="text-sm text-white/70">
              Capture sketches, let the model derive layout intent, then polish
              in the collaborative canvas. No code changes required.
            </p>
          </div>
          <div className="space-y-5">
            {[
              "Upload a sketch or drag a whiteboard snapshot.",
              "Review detected sections, copy, and component groupings.",
              "Export tokens, grids, and components to your stack.",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fcd34d] text-xs font-semibold text-[#14161a]">
                  {index + 1}
                </div>
                <p className="text-sm text-white/80">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-300">
              Pricing
            </p>
            <h2 className="font-[var(--font-fraunces)] text-3xl text-white sm:text-4xl">
              Flexible pricing for growing product teams
            </h2>
            <p className="text-sm text-white/70">
              All plans include unlimited sketches, Convex sync, and exportable
              style tokens.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#10151f] p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Studio
                </p>
                <p className="mt-2 font-[var(--font-fraunces)] text-4xl">
                  $29
                </p>
                <p className="text-xs text-white/60">per editor / month</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-emerald-200">
                Most popular
              </span>
            </div>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              {[
                "Unlimited AI generations",
                "Shared team libraries",
                "Token export for Tailwind + CSS",
                "Priority design review",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#10151f] transition hover:-translate-y-0.5"
              href="/dashboard"
            >
              Continue to Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.32em] text-amber-200">
              FAQ
            </p>
            <h2 className="font-[var(--font-fraunces)] text-3xl text-white sm:text-4xl">
              Quick answers
            </h2>
            <p className="text-sm text-white/70">
              Need something else? Reach out in the dashboard and we will help.
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Can I import from Figma or only sketches?",
                a: "You can import sketches, low-fi wireframes, and Figma frames. The model will harmonize layout rules across sources.",
              },
              {
                q: "Does it replace my design system?",
                a: "No. It generates tokens and components that match your existing system or helps you define one from scratch.",
              },
              {
                q: "How are users billed?",
                a: "Only active editors count toward billing. Reviewers and developers can view exports for free.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-semibold text-white">{item.q}</p>
                <p className="mt-2 text-sm text-white/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex flex-col items-center gap-6 rounded-[36px] border border-white/10 bg-gradient-to-r from-[#f97316] via-[#fbbf24] to-[#fcd34d] px-8 py-12 text-center text-[#1c140b]">
          <p className="text-xs uppercase tracking-[0.4em]">
            Ready to build
          </p>
          <h2 className="font-[var(--font-fraunces)] text-3xl sm:text-4xl">
            Bring your sketches to production-ready UI in one afternoon.
          </h2>
          <p className="text-sm text-[#2b1d0f]">
            Open the app, invite your team, and export clean layout tokens in under an
            hour.
          </p>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[#14161a] px-6 py-3 text-sm font-semibold text-white"
            href="/dashboard"
          >
            Open app
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-10 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-5" />
          <span>Sketch-to-UI</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <a className="transition hover:text-white" href="#features">
            Features
          </a>
          <a className="transition hover:text-white" href="#how">
            How it works
          </a>
          <a className="transition hover:text-white" href="#pricing">
            Pricing
          </a>
          <Link className="transition hover:text-white" href="/dashboard">
            Open app
          </Link>
        </div>
      </footer>
    </div>
  );
}
