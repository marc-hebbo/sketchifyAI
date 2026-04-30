'use client';
import { fetchProjectsSuccess } from "@/redux/slice/projects";
import type { ProjectSummary } from "@/redux/slice/projects";
import { useAppDispatch } from "@/redux/store";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  initialProjects: ProjectSummary[];
};

const ProjectsProvider = ({ children, initialProjects }: Props) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (initialProjects.length > 0) {
      dispatch(
        fetchProjectsSuccess({
          projects: initialProjects,
          total: initialProjects.length,
        })
      );
    }
  }, [dispatch, initialProjects]);
  return <>{children}</>;
};

export default ProjectsProvider;
