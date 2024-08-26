"use client";
import { useGenerateSticker } from "@/features/ai/api/use-generate-sticker";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useTokenPaywall } from "@/features/subscriptions/hooks/use-tokens-paywall";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "sonner";

export const UploadSection = () => {
  const router = useRouter();
  const paywall = useTokenPaywall();
  const createProjectMutation = useCreateProject();
  const mutation = useGenerateSticker();

  const onCreateProject = (imgUrl: string) => {
    createProjectMutation.mutate(
      {
        name: "Untitled Project",
        json: "",
        height: 512,
        width: 512,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data.id}?generatedImage=${imgUrl}`);
          console.log("Project created successfully");
        },
        onError: (error) => {
          console.log("Failed to create project");
        },
      }
    );
  };

  const onGenerateSticker = async (imageUrl: string) => {
    if (paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    if (imageUrl.length < 3) return;
    toast.loading("Generating image, please wait");
    mutation.mutate(
      { imageUrl: imageUrl },
      {
        //@ts-ignore
        onSuccess: ({ data }) => {
          console.log("image generated", data);
          toast.dismiss();
          toast.success("Image generated successfully");
          console.log("here is generated image: ", data);
          // create new project && redirect and add to editor
          onCreateProject(data[0]);
        },
        onError: (error) => {
          toast.dismiss();
          toast.error("Error generating image");
        },
      }
    );
  };
  return (
    <div className=" w-full flex justify-center items-center">
      <div className="w-full relative top-8 hue-rotate-30 -rotate-[20deg] max-w-fit h-full max-h-fit bg-muted rounded-md shadow-md p-3">
        <img
          src="/placeholder-2.png"
          alt="Example 1"
          className="w-[180px] h-[180px] h-auto"
          style={{ aspectRatio: "150/150", objectFit: "cover" }}
        />
      </div>
      <div className=" py-4 relative z-10 bg-white">
        {/* TODO: ADD PAYwall here, only show upload button when premium member */}
        <UploadDropzone
          appearance={{
            button: "w-full text-sm font-medium",
            // allowedContent: "hidden",
          }}
          content={{
            button: "Upload Image",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log(res[0].url);
            onGenerateSticker(res[0].url);
            toast.success("Image uploaded successfully");
          }}
          onUploadBegin={(name) => {
            // Do something once upload begins
            console.log("Uploading: ", name);
          }}
          onDrop={(acceptedFiles) => {
            if (paywall.shouldBlock) {
              paywall.triggerPaywall();
              return;
            }
            toast.warning(
              `${acceptedFiles[0].name}` +
                " :file is selected, Click on upload to upload"
            );
            // Do something with the accepted files
            console.log("Accepted files: ", acceptedFiles);
          }}
        />
        {/* <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{
            button: "Upload Image",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log(res)
          }}
        /> */}
      </div>

      <div className="w-full relative top-8 rotate-[20deg] max-w-fit h-full max-h-fit bg-muted rounded-md shadow-md p-3">
        <img
          src="/placeholder.png"
          alt="Example 1"
          className="w-[180px] h-[180px] h-auto"
          style={{ aspectRatio: "150/150", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
