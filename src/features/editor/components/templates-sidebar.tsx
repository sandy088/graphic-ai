import Image from "next/image";

import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Crown, Loader } from "lucide-react";
import { useGetTemplates } from "@/features/projects/api/use-get-templates";
import { ResponseType } from "@/features/projects/api/use-get-templates";
import { useConfirm } from "@/app/hooks/use-confirm";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

interface TemplatesSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TemplatesSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplatesSidebarProps) => {
  const paywall = usePaywall();

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message:
      "You are about to replace the current project with the selected template. This action cannot be undone.",
  });
  const { data, isLoading, isError } = useGetTemplates({
    page: "1",
    limit: "20",
  });

  const onClick = async (template: ResponseType["data"][0]) => {
    //TODO: Check if template is pro

    if (template.isPro && paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    if (!editor) {
      return;
    }

    const ok = await confirm();
    if (!ok) {
      return;
    }

    editor.loadFromJson(template.json);
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden"
      )}
    >
      <ConfirmationDialog />
      <ToolSidebarHeader
        title="Templates"
        description="Start with any template you like"
      />

      {isLoading && (
        <div className=" flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}

      {isError && (
        <div className=" flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className=" text-muted-foreground text-xs">
            Failed to load templates
          </p>
        </div>
      )}
      <ScrollArea>
        <div className=" p-4">
          <div className="grid grid-cols-2 gap-4">
            {data?.map((template) => {
              return (
                <button
                  key={template.id}
                  style={{
                    aspectRatio: `${template.width}/${template.height}`,
                  }}
                  className="w-full relative group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  onClick={() => onClick(template)}
                >
                  <Image
                    src={template.thumbnailUrl || ""}
                    fill
                    alt={template.name || "templates"}
                    className="object-cover"
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                    {template.name}
                  </div>
                  {template.isPro && (
                    <div className=" z-20  absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs bg-black/50">
                      <Crown className=" size-4 inline-block fill-yellow-500 text-yellow-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};
