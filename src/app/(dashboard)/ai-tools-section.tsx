"use client";

import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";

export const AiToolsSection = () => {
  const mutation = useCreateProject();
  const router = useRouter();

  const onCreateProject = () => {
    mutation.mutate(
      {
        name: "Untitled Project",
        json: "",
        height: 900,
        width: 1200,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data.id}?ai=true`);
          console.log("Project created successfully");
        },
        onError: (error) => {
          console.log("Failed to create project");
        },
      }
    );
  };
  return (
    <div className=" space-y-4">
      <h3 className="font-semibold text-lg">Try AI tools</h3>
      <div className=" w-full grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        <div
          role="button"
          onClick={onCreateProject}
          className="relative group flex h-52 max-w-[27rem] flex-grow overflow-hidden rounded-md"
        >
          <img
            src="/bg-remove.png"
            className="w-full group-hover:scale-105 transition-transform duration-200 h-full object-cover"
          />

          <div className="absolute h-full w-full bg-gradient-to-b from-transparent to-black/70">
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white md:text-2xl text-xl font-bold">
                AI Background Remover
              </h4>
              <p className="text-white/80 text-xs">
                Remove background from any image in seconds
              </p>
            </div>
          </div>
        </div>

        <div
          role="button"
          onClick={onCreateProject}
          className="relative group flex h-52 max-w-[27rem] flex-grow overflow-hidden rounded-md"
        >
          <img
            src="/ai-generate.jpg"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            alt="AI Image Generator"
          />

          <div className="absolute h-full w-full bg-gradient-to-b from-transparent to-black/70">
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white md:text-2xl text-xl font-bold">
                AI Image Generator
              </h4>
              <p className="text-white/80 text-xs">
                Generate images with AI in seconds
              </p>
            </div>
          </div>
        </div>
        <div
          role="button"
          onClick={() => router.push("/generate-ai-sticker")}
          className="relative group flex h-52 max-w-[27rem] flex-grow overflow-hidden rounded-md"
        >
          <img
            src="https://utfs.io/f/25b249c2-6df5-48b0-8e92-69484187b419-rfbm3g.png"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            alt="AI Image Generator"
          />

          <div className="absolute h-full w-full bg-gradient-to-b from-transparent to-black/70">
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white md:text-2xl text-xl font-bold">
                AI Image To Sticker
              </h4>
              <p className="text-white/80 text-xs">
                Generate stickers from images with AI
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};
