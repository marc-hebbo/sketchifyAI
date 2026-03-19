import Link from "next/link";
import { Logo } from "@/components/logo";
import LandingAuthCta from "@/components/landing/auth-cta";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  PenLine,
  ShieldCheck,
  Timer,
  Wand2,
  Zap,
  Palette,
  Quote,
} from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-3 border-white bg-black flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            <span className="font-semibold text-foreground">SketchifyAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-background/30 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors backdrop-blur"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <LandingAuthCta />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background gradient elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto">
          {/* Logo & Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <Logo className="w-5 h-5" uniColor />
              <span className="text-sm font-medium text-primary/80">SketchifyAI</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                Sketch to UI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Transform your sketches into production-ready UI designs powered by AI. Design smarter, not harder.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:from-primary/95 hover:to-primary/75 active:translate-y-[1px] transition-all"
              >
                <Link href="/canvas">
                  Generate
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-6 rounded-xl border-border/60 bg-background/30 hover:bg-accent/40"
              >
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>

              <a
                href="#features"
                className="px-5 py-3 rounded-xl border border-muted-foreground/25 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 transition-colors font-medium"
              >
                Learn more
              </a>
            </div>

            <p className="text-sm text-muted-foreground">
              Fast iterations • Clean exports • Works great on dark mode
            </p>
          </div>

          {/* Compact Value Proposition */}
          <section className="mb-14">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    From idea to UI in minutes
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    A simple workflow that stays out of your way—sketch, generate, refine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { icon: Timer, label: "Quick results" },
                    { icon: CheckCircle2, label: "Clean output" },
                    { icon: ShieldCheck, label: "Built for teams" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2"
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground/90">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Process Flow */}
          <div className="mb-20">
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 -translate-y-1/2 hidden lg:block" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: PenLine,
                    label: "Sketch",
                    description: "Create or upload your design sketches",
                  },
                  {
                    icon: Wand2,
                    label: "AI Transform",
                    description: "Let AI enhance and refine your designs",
                  },
                  {
                    icon: Palette,
                    label: "Style Guide",
                    description: "Build consistent design systems",
                  },
                  {
                    icon: Zap,
                    label: "Export",
                    description: "Deploy production-ready UI code",
                  },
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div className="text-center p-6 rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-colors">
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{step.label}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Interactive Canvas",
                  description:
                    "Intuitive workspace for sketching, designing, and experimenting with your ideas in real-time.",
                  feature: "Canvas Workspace",
                },
                {
                  title: "AI Design Generation",
                  description:
                    "Leverage advanced AI to transform rough sketches into polished, professional UI designs automatically.",
                  feature: "Powered by AI",
                },
                {
                  title: "Design Systems",
                  description:
                    "Create comprehensive style guides with colors, typography, and component libraries for consistency.",
                  feature: "Style Guides",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl border border-muted/40 bg-muted/30 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-4">
                    {item.feature}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <section className="mb-20" aria-labelledby="testimonials-heading">
            <div className="text-center mb-12">
              <h2 id="testimonials-heading" className="text-3xl font-bold">
                Loved by fast-moving teams
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Short feedback from people who sketch, ship, and iterate daily.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "This tool cut our workflow time in half.",
                  name: "Sarah Chen",
                  title: "Product Designer",
                  company: "Northstar",
                },
                {
                  quote: "The fastest way we’ve found to go from a whiteboard to a usable UI draft.",
                  name: "Daniel Rivera",
                  title: "Founder",
                  company: "BrightLabs",
                },
                {
                  quote: "Great for creating consistent UI directions before we commit to full design work.",
                  name: "Priya Patel",
                  title: "Marketing Lead",
                  company: "ScaleFlow",
                },
              ].map((t) => (
                <Card
                  key={t.name}
                  className="py-0 bg-muted/20 border-muted/40 hover:border-primary/25 transition-colors"
                >
                  <CardContent className="py-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                        <Quote className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground leading-relaxed">“{t.quote}”</p>
                        <p className="text-sm text-muted-foreground mt-4">
                          <span className="font-medium text-foreground">{t.name}</span>{" "}
                          — {t.title} at {t.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center p-8 sm:p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your designs?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start creating your first project and experience the power of AI-assisted design.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-lg"
            >
              Open Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
