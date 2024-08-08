"use client";
import { Button } from "@/components/ui/button";
import { protectSever } from "@/features/auth/utils";
import { Editor } from "@/features/editor/components/editor";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { AlertTriangle, Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";


interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  };
}
const EditorProjectIdPage = ({ params }: EditorProjectIdPageProps) => {
 
  console.log("Here is the params", params.projectId)
  const { data, isError, isLoading } = useGetProject(params.projectId);

  if (isLoading || !data) {
    console.log(data)
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className=" size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col gap-y-5 items-center justify-center">
        <AlertTriangle className=" size-6 text-muted-foreground text-sm" />
        <p className="text-muted-foreground">
          An error occurred while fetching the project
        </p>
        <Button  asChild>
          <Link href={'/'}>
          Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return <Editor initialData={data}/>;
};

export default EditorProjectIdPage;
