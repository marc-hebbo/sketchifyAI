"use client";
import { useProjectCreation } from "@/hooks/use-project";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const { projects, createProject, deleteProject, isCreating } = useProjectCreation();

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
            <div key={project._id} className="group relative">
              <Link
                href={`/canvas?project=${project._id}`}
                className="block cursor-pointer"
              >
                <div className="h-full rounded-xl border border-border/40 bg-card p-2 transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-1">
                  <div className="space-y-3">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/50 relative">
                      {project.thumbnail ? (
                        <Image
                          src={project.thumbnail}
                          alt={project.name || "Untitled Project"}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          <Plus className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                    <div className="space-y-1 px-2 pb-1">
                      <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors duration-200">
                        {project.name || "Untitled Project"}
                      </h3>
                      <p className="text-[10px] text-muted-foreground/50 font-normal lowercase">
                        edited {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="absolute bottom-4 right-4 z-20 p-2 text-muted-foreground/40 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label="Delete project"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[400px] rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold">Delete Project?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This will permanently remove <span className="text-foreground font-medium">"{project.name || "Untitled Project"}"</span>. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel className="rounded-xl border-border/50 hover:bg-muted/50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteProject(project._id)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-xl border-none shadow-lg shadow-red-500/20"
                    >
                      Delete Project
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;