import { Reducer } from "@reduxjs/toolkit";
import profile from "./profile";
import projects from "./projects";
import shapes from "./shapes";
import viewport from "./viewport";

export const slices: Record<string, Reducer> = {
  // TODO: add slices here
  profile,
  projects,
  shapes,
  viewport
};
