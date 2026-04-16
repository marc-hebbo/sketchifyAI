"use client";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { CircleQuestionMark, Hash, LayoutTemplate } from "lucide-react";
import { Button } from "../ui/button";
import { useAppSelector } from "@/redux/store";
import CreateProject from "../buttons/project";
import AccountMenu from "@/components/auth/account-menu";

type TabProps = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const Navbar = () => {
  const params = useSearchParams();
  const projectId = params.get("project");

  const pathname = usePathname();
  //  TODO: add credits logic
  const profileState = useAppSelector((state) => state.profile);
  const me = profileState.user;

  // TODO: Fix these urls
  const tabs: TabProps[] = [
    {
      label: "Canvas",
      href: projectId ? `/canvas?project=${projectId}` : "/canvas",
      icon: <Hash className="w-4 h-4" />,
    },
    {
      label: "Style Guide",
      href: projectId ? `/style-guide?project=${projectId}` : "/style-guide",
      icon: <LayoutTemplate className="w-4 h-4" />,
    },
  ];

  // TODO: uncomment this when we have a project

  const shouldFetchProject =
    !!projectId && !projectId.startsWith("local-") && !!me?.id;
  const project = useQuery(
    api.projects.getProject,
    shouldFetchProject ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // const project = {title: "My Project"};

  const hasCanvas = pathname.includes("canvas");
  const hasStyleGuide = pathname.includes("style-guide");

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 p-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="w-8 h-8 rounded-full border-3 border-white bg-black flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white"></div>
        </Link>

        {!hasCanvas ||
          (!hasStyleGuide && (
            <div className="lg:inline-block hidden rounded-full text-primary/60 border border-white/[0.12] backdrop-blur-xl bg-white/[0.08] px-4 py-2 text-sm saturate-150">
              Project / {project?.name}
            </div>
          ))}
      </div>

      <div className="lg:flex hidden items-center justify-center gap-2">
        <div className="flex items-center gap-2 backdrop-blue-xl bg-white/[0.08] border border-white/[0.12] rounded-full p-2 saturate-150">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                `${pathname}?project=${projectId}` === tab.href
                  ? "bg-white/[0.12] text-white border border-white/[0.16] backdrop-blur-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent",
              ].join(" ")}
            >
              {" "}
              <span
                className={
                  `${pathname}?project=${projectId}` === tab.href
                    ? "opacity-100"
                    : "opacity-70 group-hover:opacity-90"
                }
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 justify-end">
        <span className="text-sm text-white/50">TODO: credits</span>
        <Button
          variant="secondary"
          className="rounded-full h-12 w-12 flex items-center justify-center backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] saturate-150 hover:bg-white/[0.12]"
        >
          <CircleQuestionMark className="size-5 text-white" />
        </Button>
        <AccountMenu />
        {/* TODO: Add autosave and create project */}
        {!hasCanvas && !hasStyleGuide && <CreateProject />}
      </div>
    </div>
  );
};

export default Navbar;
