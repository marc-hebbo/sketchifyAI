
import ProjectsList from "@/components/projects/list";
import ProjectsProvider from "@/components/projects/list/provider";
import { ProjectQuery } from "@/convex/query.config";
import React from "react";

const Page = async () => {
  const { projects, profile } = await ProjectQuery();

  return <ProjectsProvider initialProjects={projects}>
    <div className="container mx-auto py-36 px-4">
      <ProjectsList/>

    </div>
  </ProjectsProvider>;
};

export default Page;
