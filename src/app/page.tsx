import ProjectsList from "@/components/projects/list";
import ProjectsProvider from "@/components/projects/list/provider";
import { ProjectQuery } from "@/convex/query.config";
import Navbar from "@/components/navbar";

const Page = async () => {
  const { projects } = await ProjectQuery();

  return (
    <div>
      <Navbar />
      <ProjectsProvider initialProjects={projects}>
        <div className="container mx-auto py-36 px-4">
          <ProjectsList />
        </div>
      </ProjectsProvider>
    </div>
  );
};

export default Page;
