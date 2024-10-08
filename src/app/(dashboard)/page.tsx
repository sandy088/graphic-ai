import { protectSever } from "@/features/auth/utils";
import { Banner } from "./banner";
import { ProjectsSection } from "./projects-section";
import { TemplatesSection } from "./templates";
import { AiToolsSection } from "./ai-tools-section";

export default async function Home() {
  await protectSever();
  return <div
  className=" flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
   <Banner/>
   <AiToolsSection/>
   <TemplatesSection/>
   <ProjectsSection/>
  </div>;
}
