"use client";

import { Logo } from "./logo";
import { useFilePicker } from "use-file-picker";
import {
  ChevronDownIcon,
  Download,
  Loader,
  MousePointerClick,
  Pencil,
  Redo2,
  Undo2,
  Upload,
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
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useSaveProject } from "@/features/projects/api/use-save-project";
import { useAdminVerification } from "@/features/auth/hooks/use-admin";
import { Label } from "@/components/ui/label";
import { useUploadProject } from "@/features/projects/api/use-upload-project";
import { toast } from "sonner";

interface NavbarProps {
  id: string;
  projectTitle: string;
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const Navbar = ({
  id,
  editor,
  projectTitle,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [Title, setTitle] = useState(projectTitle);
  const [isTitleChangeActive, setIsTitleChangeActive] = useState(false);
  const [templateThumbnailUrl, setTemplateThumbnailUrl] = useState<
    string | null
  >(null);

  const { isLoading, shouldBlock } = useAdminVerification();

  const data = useMutationState({
    filters: {
      mutationKey: ["projects", { id }],
      exact: true,
    },
    select: (mutation) => mutation.state.status,
  });

  const { mutate } = useSaveProject(id);
  const uploadTemplate = useUploadProject();

  const currentState = data[data?.length - 1];
  const isError = currentState === "error";
  const isPending = currentState === "pending";

  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles?.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          editor?.loadFromJson(reader.result as string);
        };
      }
    },
  });

  const onSetActiveChange = () => {
    if (isTitleChangeActive) {
      return;
    }
    setIsTitleChangeActive(true);
    //select the text
    inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onUploadTemplate = () => {
    if (!templateThumbnailUrl || templateThumbnailUrl.length <= 8) {
      return;
    }

    toast.loading("Uploading template");

    uploadTemplate.mutate(
      {
        thumbnailUrl: templateThumbnailUrl || "",
        templateId: id,
      },
      {
        onSuccess: () => {
          toast.dismiss();
          setTemplateThumbnailUrl(null);
          toast.success("Template uploaded successfully");
        },
        onError: (error) => {
          console.error(error);
          toast.dismiss();
          toast.error("Failed to upload template");
        },
      }
    );
  };

  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />
      <div className=" w-full flex items-center gap-x-1 h-full">
        {!shouldBlock && (
          <>
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
          </>
        )}
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
          {isError && !isPending && (
            <BsCloudSlash className=" size-5 text-muted-foreground" />
          )}

          {!isError && isPending && (
            <Loader className=" size-5 animate-spin text-muted-foreground" />
          )}

          {!isError && !isPending && (
            <BsCloudCheck className=" size-5 text-muted-foreground" />
          )}
          <div className=" text-xs text-muted-foreground">
            {isError ? "Failed to save" : isPending ? "Saving" : "Saved"}
          </div>
        </div>

        <div className=" flex flex-grow justify-center items-center">
          <div className="relative hidden max-w-fit md:flex items-center gap-x-2">
            <Input
              ref={inputRef}
              className={cn(
                " w-60 border-0 border-opacity-0 focus-visible:ring-0 focus-visible:border-none focus:border-none border-none focus-visible:ring-transparent focus:border-opacity-0 focus:ring-0 focus:ring-opacity-0",
                !isTitleChangeActive &&
                  "text-medium font-semibold cursor-pointer pl-6"
              )}
              onClick={onSetActiveChange}
              onChange={onTitleChange}
              // TODO: Save the title here onBlur
              onBlur={() => {
                setIsTitleChangeActive(false);
                if (Title !== projectTitle && Title.length > 0) {
                  mutate({ name: Title });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsTitleChangeActive(false);
                  inputRef.current?.blur();
                  if (Title !== projectTitle && Title.length > 0) {
                    mutate({ name: Title });
                  }
                }
              }}
              placeholder={
                projectTitle.length > 0 && projectTitle.length <= 20
                  ? projectTitle
                  : projectTitle.length > 20
                  ? projectTitle.slice(0, 20) + "..."
                  : "Untitled Project"
              }
              value={Title}
            />
            <Pencil
              role="button"
              onClick={onSetActiveChange}
              className={cn(
                " size-4  absolute -left-1",
                isTitleChangeActive && "hidden"
              )}
            />

            {/* TODO: add some hint save title when press eneter */}
            {/* {isTitleChangeActive && (
              <div className=" right-0 top-1/2 transform -translate-y-1/2 cursor-pointer">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-lg">⌘</span>+ S: Save
                </kbd>
              </div>
            )} */}
          </div>
        </div>

        <div className=" ml-auto flex items-center gap-x-2">
          {/* Publish------------- */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"ghost"}>
                Publish
                <Upload className=" size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" min-w-60">
              {/* TODO: Add this only for admin */}
              {!shouldBlock && (
                <>
                  <div
                    // onClick={editor?.saveJson}

                    className="flex flex-col items-center gap-x-2  px-2"
                  >
                    <Label className=" py-2 text-left w-full text-muted-foreground text-xs font-normal">
                      Thumbnail URL
                    </Label>
                    <Input
                      placeholder="Enter thumbnail URL"
                      value={templateThumbnailUrl || ""}
                      onChange={(e) => setTemplateThumbnailUrl(e.target.value)}
                    />
                  </div>
                  <DropdownMenuItem className="w-full">
                    <Button
                      size={"sm"}
                      variant={"default"}
                      onClick={() => {
                        console.log("Publish");
                        onUploadTemplate();
                      }}
                      className="w-full"
                    >
                      Publish
                    </Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --------------------------- */}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"ghost"}>
                Export
                <Download className=" size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" min-w-60">
              {/* TODO: Add this only for admin */}
              {!shouldBlock && (
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
              )}
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
              {/* TODO: Correct bug here  */}
              <DropdownMenuItem
                onClick={editor?.saveSvg}
                disabled
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
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
