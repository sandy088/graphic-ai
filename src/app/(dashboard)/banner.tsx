"use client";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const Banner = () => {
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
          router.push(`/editor/${data.id}`);
          console.log("Project created successfully");
        },
        onError: (error) => {
          console.log("Failed to create project");
        },
      }
    );
  };

  return (
    <div
      className="aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl
     bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]"
    >
      <div
        className="
         hidden rounded-full size-28 md:flex items-center justify-center bg-white/50
        "
      >
        <div className=" rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
        </div>
      </div>
      <div
        className="
          flex flex-col gap-y-2 text-white
         "
      >
        <h1
          className="
                text-2xl md:text-3xl font-semibold
                "
        >
          Turn Your Imagination into Visuals
        </h1>
        <p
          className="
             text-sm md:text-sm mb-2"
        >
          Convert inspirations into beautiful, attractive visual designs with
          our powerful Ai tools in no time.
        </p>
        <Button
          disabled={mutation.isPending}
          onClick={onCreateProject}
          variant="secondary"
          className="w-[160px]"
        >
          Start creating
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
