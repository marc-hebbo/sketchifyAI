'use client';
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { fetchProjectsSuccess } from "@/redux/slice/projects";
import type { ProjectSummary } from "@/redux/slice/projects";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  initialProjects: { _valueJSON?: unknown } | null;
};

const ProjectsProvider = ({ children, initialProjects }: Props) => {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state) => state.profile);
  const user = profileState.user;

  const remoteProjects = useQuery(
    api.projects.getUserProjects,
    user?.id ? { userId: user.id as Id<"users"> } : "skip"
  );

  useEffect(() => {
    if (remoteProjects) {
      dispatch(
        fetchProjectsSuccess({
          projects: remoteProjects as ProjectSummary[],
          total: remoteProjects.length,
        })
      );
      return;
    }

    if (initialProjects?._valueJSON) {
      const projectsData = Array.isArray(initialProjects._valueJSON)
        ? (initialProjects._valueJSON as ProjectSummary[])
        : [];
      dispatch(
        fetchProjectsSuccess({
          projects: projectsData,
          total: projectsData.length,
        })
      );
      return;
    }

  }, [dispatch, initialProjects, remoteProjects, user?.id]);
  return <>{children}</>;
};

export default ProjectsProvider;
