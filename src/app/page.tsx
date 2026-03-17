import ProjectsList from "@/components/projects/list";
import ProjectsProvider from "@/components/projects/list/provider";
import { ProjectQuery } from "@/convex/query.config";
import Navbar from "@/components/navbar";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import CreateProject from "@/components/buttons/project";
import { SketchIcon, Wand2, Palette, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

const Page = async () => {
  const { projects } = await ProjectQuery();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* Hero Section - Only show when no projects */}
      {projects.length === 0 && (
        <div className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8">
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <CreateProject />
                <button className="px-6 py-2.5 rounded-lg border border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 transition-colors font-medium">
                  Learn More
                </button>
              </div>
            </div>

            {/* Process Flow */}
            <div className="mb-20">
              <div className="relative">
                {/* Connection line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 -translate-y-1/2 hidden lg:block" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: SketchIcon,
                      label: "Sketch",
                      description: "Create or upload your design sketches"
                    },
                    {
                      icon: Wand2,
                      label: "AI Transform",
                      description: "Let AI enhance and refine your designs"
                    },
                    {
                      icon: Palette,
                      label: "Style Guide",
                      description: "Build consistent design systems"
                    },
                    {
                      icon: Zap,
                      label: "Export",
                      description: "Deploy production-ready UI code"
                    }
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
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Interactive Canvas",
                    description: "Intuitive workspace for sketching, designing, and experimenting with your ideas in real-time.",
                    feature: "Canvas Workspace"
                  },
                  {
                    title: "AI Design Generation",
                    description: "Leverage advanced AI to transform rough sketches into polished, professional UI designs automatically.",
                    feature: "Powered by AI"
                  },
                  {
                    title: "Design Systems",
                    description: "Create comprehensive style guides with colors, typography, and component libraries for consistency.",
                    feature: "Style Guides"
                  }
                ].map((item, index) => (
                  <div key={index} className="P-8 rounded-xl border border-muted/40 bg-muted/30 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-4">
                      {item.feature}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center p-8 sm:p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-4">Ready to transform your designs?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start creating your first project and experience the power of AI-assisted design.
              </p>
              <CreateProject />
            </div>
          </div>
        </div>
      )}

      {/* Projects List - Always shown */}
      <ProjectsProvider initialProjects={projects}>
        <div className="container mx-auto py-12 px-4">
          <ProjectsList />
        </div>
      </ProjectsProvider>
    </div>
  );
};

export default Page;

