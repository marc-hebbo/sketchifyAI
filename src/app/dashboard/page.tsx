import ProjectsList from "@/components/projects/list";
import ProjectsProvider from "@/components/projects/list/provider";
import { ProjectQuery } from "@/convex/query.config";
import Navbar from "@/components/navbar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const { projects } = await ProjectQuery();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <ProjectsProvider initialProjects={projects}>
        <div className="container mx-auto py-12 px-4 pt-28">
          <ProjectsList />
        </div>
      </ProjectsProvider>
    </div>
  );
};

export default DashboardPage;
