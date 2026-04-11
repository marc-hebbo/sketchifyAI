"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Quote, Users, Lightbulb } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

interface UserStory {
  title: string;
  userType: string;
  story: string;
  scenario: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I sketch rough wireframes by hand, upload them to Sketchify, and the AI turns them into polished mockups in minutes. It's like having a second designer refining every detail. Cuts my design prep time from hours to 30 minutes.",
    name: "Sarah Chen",
    role: "Product Designer",
    company: "Northstar Design Studio",
  },
  {
    quote:
      "What impressed me most is the style guide builder. I created a mood board, defined typography and colors, and suddenly I have a living design system. Our team stays consistent without the overhead of Figma library management.",
    name: "Daniel Rivera",
    role: "Design Lead",
    company: "BrightLabs",
  },
  {
    quote:
      "We use Sketchify to explore multiple design directions quickly. Sketch 5 variations, let AI refine them, iterate based on feedback. The whole process that used to take a week now takes a day. Most useful during design sprints.",
    name: "Priya Patel",
    role: "Head of Product",
    company: "ScaleFlow",
  },
  {
    quote:
      "As a solo designer, I rarely have time for polish. Sketchify's AI refinement fills that gap perfectly. My rough sketches come out looking professional, and I can move faster without sacrificing quality. The mood board feature is genuinely useful.",
    name: "Marcus Thompson",
    role: "Freelance Designer",
    company: "Thompson Design",
  },
  {
    quote:
      "The canvas tools are straightforward and the AI enhancement feels natural. If you're someone who sketches (on paper or tablet), this bridges that to digital mockups faster than the traditional workflow. It's not perfect, but it genuinely saves time.",
    name: "Elena Rodriguez",
    role: "UX Designer",
    company: "TechVision Labs",
  },
];

const userStories: UserStory[] = [
  {
    title: "Sketch-to-Polish Workflow",
    userType: "Designer",
    story:
      "As a designer, I want to quickly refine hand-drawn sketches into polished mockups using AI so that I can focus on concept exploration instead of tedious digital work.",
    scenario:
      "Alex sketches three dashboard layouts on paper during a brainstorm. He photographs each and uploads to Sketchify. The AI cleans them up and polishes details within 5 minutes. His team reviews refined mockups immediately, moving concepts forward instead of debating sketch quality.",
  },
  {
    title: "Design System in Minutes",
    userType: "Design System Manager",
    story:
      "As a design system manager, I want to build and maintain a style guide with mood board inspiration, typography rules, and color systems so that my team stays aligned on visual direction.",
    scenario:
      "Jamie curates a mood board with 30 reference images, defines primary and secondary color palettes, sets typography rules for headings and body text. The style guide is live and shared with the team. When designers need guidance, they reference the guide instead of asking in Slack.",
  },
  {
    title: "Rapid Design Iteration",
    userType: "Product Designer",
    story:
      "As a product designer, I want to explore multiple design variations quickly without investing hours in each one so that I can test ideas with stakeholders faster.",
    scenario:
      "During a design sprint, Maya sketches 4 different onboarding flow layouts. She uploads each to Sketchify and refines them with AI in parallel. Within 2 hours, she has 4 polished mockups ready for stakeholder feedback instead of 2 days of manual design work.",
  },
  {
    title: "Visual Inspiration & Direction",
    userType: "Product Team",
    story:
      "As a product team, I want to establish a visual mood and aesthetic direction early so that designers, engineers, and stakeholders align on the feel before detailed design work begins.",
    scenario:
      "Before kicking off a redesign, the team builds a mood board with hero images, defines a color palette, and creates typography samples in Sketchify. This becomes the north star for the project. It takes one afternoon instead of weeks of design direction discussions.",
  },
  {
    title: "Design Exploration & Variation Testing",
    userType: "UX Researcher",
    story:
      "As a UX researcher, I want to quickly create multiple design variations of key screens so that I can test different visual approaches with users and gather feedback on aesthetics.",
    scenario:
      "Jordan sketches 3 different header variations for a landing page redesign. Sketchify refines them to presentation quality. The team tests all three with 20 users in a Maze test within 48 hours. Clear favorite emerges, saving weeks of back-and-forth design cycles.",
  },
];

export default function Testimonials() {
  return (
    <div className="w-full">
      {/* Testimonials Section */}
      <section className="mb-24" aria-labelledby="testimonials-heading">
        <div className="text-center mb-12">
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            Loved by teams everywhere
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear from designers, founders, and product teams using SketchifyAI
            daily to accelerate their workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="py-0 bg-muted/20 border-muted/40 hover:border-primary/25 transition-colors h-full flex flex-col"
            >
              <CardContent className="py-6 flex flex-col flex-grow">
                <div className="flex items-start gap-3 flex-grow">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 flex-shrink-0">
                    <Quote className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-foreground leading-relaxed text-sm">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border/40">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">
                      {testimonial.name}
                    </span>
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {testimonial.role} at {testimonial.company}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* User Stories Section */}
      <section aria-labelledby="user-stories-heading">
        <div className="text-center mb-12">
          <h2
            id="user-stories-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            How teams use SketchifyAI
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real workflows and use cases across different roles and company
            sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userStories.map((story, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:bg-accent/5 transition-all"
            >
              {/* Header with icon and user type */}
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {story.title}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-1">
                    {story.userType}
                  </p>
                </div>
              </div>

              {/* Story section */}
              <div className="mb-4 p-4 bg-muted/40 rounded-lg border border-border/30">
                <div className="flex gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    User Story
                  </span>
                </div>
                <p className="text-sm text-foreground italic">{story.story}</p>
              </div>

              {/* Scenario section */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-2">
                  Real Scenario
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {story.scenario}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
