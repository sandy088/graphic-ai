"use client";

import { Logo } from "./logo";
import { useFilePicker } from 'use-file-picker';
import {
  ChevronDownIcon,
  Download,
  Loader,
  MousePointerClick,
  Redo2,
  Undo2,
} from "lucide-react";
import { CiFileOn } from "react-icons/ci";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { UserButton } from "@/features/auth/components/user-button";
import { useMutationState } from "@tanstack/react-query";

interface NavbarProps {
  id: string;
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const Navbar = ({
  id,
  editor,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {

  const data = useMutationState({
    filters:{
      mutationKey: ["projects", { id }],
      exact:true,
    },
    select: (mutation) => mutation.state.status,
  });

  const currentState = data[data?.length-1];
  const isError = currentState === "error"; 
  const isPending = currentState === "pending";

  const { openFilePicker } = useFilePicker({
    accept: '.json',
    onFilesSuccessfullySelected:({plainFiles}:any)=>{
      if(plainFiles?.length>0){
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          editor?.loadFromJson(reader.result as string);
        };
      }
    }
  })
  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />
      <div className=" w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant={"ghost"}>
              File
              <ChevronDownIcon className=" size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className=" min-w-60">
            <DropdownMenuItem
              onClick={openFilePicker}
              className="flex items-center gap-x-2"
            >
              <CiFileOn className=" size-8 mr-2" />
              <div>
                <p>Open</p>
                <p className=" text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />
        <Hint
          label="Select"
          side="bottom"
          align="center"
          sideOffset={10}
          alignOffset={-8}
        >
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => onChangeActiveTool("select")}
            className={cn(activeTool === "select" && "bg-primary bg-gray-100")}
          >
            <MousePointerClick className=" size-4 " />
          </Button>
        </Hint>
        <Hint
          label="Undo"
          side="bottom"
          align="center"
          sideOffset={10}
          alignOffset={-8}
        >
          <Button
            disabled={!editor?.canUndo()}
            variant={"ghost"}
            size={"icon"}
            onClick={editor?.onUndo}
          >
            <Undo2 className=" size-4 " />
          </Button>
        </Hint>
        <Hint
          label="Redo"
          side="bottom"
          align="center"
          sideOffset={10}
          alignOffset={-8}
        >
          <Button
            disabled={!editor?.canRedo()}
            variant={"ghost"}
            size={"icon"}
            onClick={editor?.onRedo}
          >
            <Redo2 className=" size-4 " />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex items-center gap-x-2"> 
         {isError && !isPending && <BsCloudSlash className=" size-5 text-muted-foreground" />}

         {!isError && isPending && <Loader className=" size-5 animate-spin text-muted-foreground" />}

         {!isError && !isPending && <BsCloudCheck className=" size-5 text-muted-foreground" />}
          <div className=" text-xs text-muted-foreground">{
             isError ? "Failed to save" : isPending ? "Saving" : "Saved"
            }</div>
        </div>

        <div className=" ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"ghost"}>
                Export
                <Download className=" size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" min-w-60">
              <DropdownMenuItem
                onClick={editor?.saveJson}
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>JSON</p>
                  <p className=" text-xs text-muted-foreground">
                    Save for later editing
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={editor?.savePng}
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>PNG</p>
                  <p className=" text-xs text-muted-foreground">
                    Best for sharing on the web
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={editor?.saveJpeg} //TODO: Implement functionality
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>JPEG</p>
                  <p className=" text-xs text-muted-foreground">
                    Best for printing
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={editor?.saveSvg}
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>SVG</p>
                  <p className=" text-xs text-muted-foreground">
                    Best for editing in vector tools
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserButton/>

        </div>
      </div>
    </nav>
  );
};
