import Link from "next/link";
import { Logo } from "@/components/logo";
import LandingAuthCta from "@/components/landing/auth-cta";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowRightLeft,
  PenLine,
  Wand2,
  Zap,
  Palette,
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
      <div className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <Logo className="w-5 h-5" uniColor />
              <span className="text-sm font-medium text-primary/80">SketchifyAI</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                Sketch. Refined. Ready.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Upload your sketch. AI transforms it into polished UI mockups and designs in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:from-primary/95 hover:to-primary/75 active:translate-y-[1px] transition-all"
              >
                <Link href="/canvas">
                  Try Canvas
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
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-4">See the transformation</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Watch how SketchifyAI turns your rough sketches into polished UI designs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Before */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Before</div>
            <div className="w-full h-80 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center">
              <div className="text-center">
                <PenLine className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Your sketch</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Hand-drawn wireframe</p>
              </div>
            </div>
          </div>

          {/* Arrow divider */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div className="w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* After */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-primary uppercase tracking-wide">After</div>
            <div className="w-full h-80 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <Wand2 className="w-12 h-12 mx-auto text-primary/60 mb-3" />
                <p className="text-sm text-foreground">AI-refined design</p>
                <p className="text-xs text-muted-foreground mt-1">Production-ready UI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Three simple steps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Upload Sketch",
              description: "Share your hand-drawn wireframe or screenshot",
            },
            {
              step: "2",
              title: "AI Analyzes",
              description: "Our AI understands layout, hierarchy, and components",
            },
            {
              step: "3",
              title: "Export Design",
              description: "Get refined mockups, style guides, and assets",
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="text-center p-8 rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-semibold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Built for designers</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Palette,
              title: "Design Systems",
              description: "Auto-generate consistent color palettes, typography, and component libraries",
            },
            {
              icon: Wand2,
              title: "Smart Refinement",
              description: "AI enhances your sketches with proper alignment, spacing, and hierarchy",
            },
            {
              icon: Zap,
              title: "Fast Export",
              description: "Export assets, mockups, and style guides in seconds, ready to use",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-muted/40 bg-muted/30 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Testimonials />
      </div>

      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center p-8 sm:p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Upload your first sketch and see the magic happen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/canvas">
                Try Canvas Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
            >
              <Link href="/dashboard">
                View Examples
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
