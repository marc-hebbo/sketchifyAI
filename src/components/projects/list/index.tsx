"use client";
import { useProjectCreation } from "@/hooks/use-project";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ProjectCard = {
  _id: string;
  name?: string;
  projectNumber: number;
  thumbnail?: string;
  lastModified: number;
  createdAt: number;
  isPublic?: boolean;
};

const ProjectsList = () => {
  const { projects, createProject, isCreating } = useProjectCreation();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Your Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your design projects and continue where you left off.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <button
            onClick={() => createProject()}
            disabled={isCreating}
            className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Plus className="w-8 h-8 text-muted-foreground group-hover:scale-110 transition-transform" />
          </button>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No projects yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {projects.map((project: ProjectCard) => (
            <Link
              key={project._id}
              href={`/canvas?project=${project._id}`}
              className="group cursor-pointer"
            >
              <div className="h-full rounded-lg border border-transparent bg-card p-2 transition-all duration-200 group-hover:border-border group-hover:shadow-md group-hover:-translate-y-1">
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-muted">
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.name || "Untitled Project"}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 px-1">
                    <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                      {project.name || "Untitled Project"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;