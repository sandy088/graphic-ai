import Image from "next/image";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useRemoveBackground } from "@/features/ai/api/use-remove-background";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

interface RemoveBgSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  const paywall = usePaywall();
  const mutation = useRemoveBackground();

  const selectedObjects = editor?.selectObjects[0];
  const imageSrc =
    selectedObjects?.type === "image"
      ? //@ts-ignore
        selectedObjects._originalElement?.currentSrc
      : null;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = () => {
    if (paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }
    mutation.mutate(
      { image: imageSrc },
      {
        //@ts-ignore
        onSuccess: ({ data }) => {
          editor?.addImage(data);
        },
      }
    );
  };

  return (
    <aside
      className={cn(
        "py-3 pr-3 bg-muted",
        activeTool === "remove-bg" ? "visible" : "hidden"
      )}
    >
      <div
        className="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col rounded-md"
      >

      
      <ToolSidebarHeader
        title="Remove Background"
        description="Remove Background of your image using Ai"
      />
      {!imageSrc && (
        <div className=" flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className=" size-4 text-muted-foreground" />
          <p className=" text-sm text-gray-500">
            Select an image to remove background
          </p>
        </div>
      )}
      <ScrollArea>
        {imageSrc && (
          <div className=" p-4 space-y-4">
            <div
              className={cn(
                "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                mutation.isPending && "opacity-50"
              )}
            >
              <Image
                src={imageSrc}
                fill
                className="object-cover"
                alt="Selected Image"
              />
            </div>
            <Button
              disabled={mutation.isPending}
              onClick={onClick}
              className=" w-full"
            >
              Remove Background
            </Button>
          </div>
        )}
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} /></div>
    </aside>
  );
};
