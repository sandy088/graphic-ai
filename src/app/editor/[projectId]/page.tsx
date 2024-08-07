import { protectSever } from "@/features/auth/utils";
import { Editor } from "@/features/editor/components/editor";
import React from "react";

const EditorProjectIdPage = async () => {
  await protectSever();
  return <Editor />;
};

export default EditorProjectIdPage;
