import ProjectsList from "@/components/projects/list";
import ProjectsProvider from "@/components/projects/list/provider";
import Navbar from "@/components/navbar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <ProjectsProvider initialProjects={[]}>
        <div className="container mx-auto py-12 px-4 pt-28">
          <ProjectsList />
        </div>
      </ProjectsProvider>
    </div>
  );
};

export default DashboardPage;
