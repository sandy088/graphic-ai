"use client";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const Banner = () => {
  const mutation = useCreateProject();
  const router = useRouter();

  const onCreateProject = (isAi:boolean = false) => {
    mutation.mutate(
      {
        name: "Untitled Project",
        json: "",
        height: 900,
        width: 1200,
      },
      {
        onSuccess: ({ data }) => {
          isAi && router.push(`/editor/${data.id}?ai=true`);
          !isAi && router.push(`/editor/${data.id}`);
          console.log("Project created successfully");
        },
        onError: (error) => {
          console.log("Failed to create project");
        },
      }
    );
  };

  return (
    // <div
    //   className="aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl
    //  bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]"
    // >
    //   <div
    //     className="
    //      hidden rounded-full size-28 md:flex items-center justify-center bg-white/50
    //     "
    //   >
    //     <div className=" rounded-full size-20 flex items-center justify-center bg-white">
    //       <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
    //     </div>
    //   </div>
    //   <div
    //     className="
    //       flex flex-col gap-y-2 text-white
    //      "
    //   >
    //     <h1
    //       className="
    //             text-2xl md:text-3xl font-semibold
    //             "
    //     >
    //       Turn Your Imagination into Visuals
    //     </h1>
    //     <p
    //       className="
    //          text-sm md:text-sm mb-2"
    //     >
    //       Convert inspirations into beautiful, attractive visual designs with
    //       our powerful Ai tools in no time.
    //     </p>
    //     <Button
    //       disabled={mutation.isPending}
    //       onClick={onCreateProject}
    //       variant="secondary"
    //       className="w-[160px]"
    //     >
    //       Start creating
    //       <ArrowRight className="w-4 h-4 ml-2" />
    //     </Button>
    //   </div>
    // </div>

    <div className="aspect-[5/1] min-h-[200px] grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-x-6 gap-y-3">
      <button
        onClick={()=>onCreateProject(false)}
        className="group bg-gradient-to-r text-white from-[#2e62cb] via-[#0073ff] to-[#3faff5] h-full px-6 py-3 rounded-md flex flex-col justify-center items-center"
      >
        <Plus className="
        w-8 h-8 my-3 group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300" />
        <p className="md:text-lg text-sm">Create a new project</p>
      </button>

      <button
        onClick={()=>onCreateProject(true)}
        className="group bg-gradient-to-r
         from-[#6a2ecb] via-[#b700ff] to-[#f53fd7]
        text-white  h-full px-6 py-3 rounded-md flex flex-col justify-center items-center"
      >
        <Sparkles className="w-8 h-8 my-3 group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300" />
        <p className="md:text-lg text-sm 
        ">Generate a new image</p>
      </button>
    </div>
  );
};
