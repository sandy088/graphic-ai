import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";
import { useState } from "react";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

interface AiSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AiSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: AiSidebarProps) => {
  const paywall = usePaywall();
  const mutation = useGenerateImage();

  const [value, setValue] = useState("");

  const onsubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }
console.log("Here is limit: ",paywall.aiImgeGenerationLimitReached);

    if (
      paywall.aiImgeGenerationLimitReached ||
      paywall.aiImageRmgLimitReached
    ) {
      console.log("Inside if");
      paywall.triggerAiExhaustedModal();
      return;
    }

    if (value.length < 3) return;
    mutation.mutate(
      { prompt: value },
      {
        //@ts-ignore
        onSuccess: ({ data }) => {
          console.log("image generated", data);
          editor?.addImage(data[0]);
        },
      }
    );
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "py-3 pr-3 bg-muted",
        activeTool === "ai" ? "visible" : "hidden"
      )}
    >
      <div
        className="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col rounded-md"
      >

      
      <ToolSidebarHeader title="AI" description="Generate an image using AI" />
      <ScrollArea>
        <div className=" p-4 space-y-6">
          <form onSubmit={onsubmit} className=" p-4 space-y-6">
            <Textarea
              placeholder="black forest gateau cake spelling out the words ,FLUX DEV, tasty, food photography, dynamic shot"
              value={value}
              cols={30}
              rows={10}
              required
              minLength={3}
              onChange={onChange}
              disabled={mutation.isPending}
            />

            <Button
              disabled={mutation.isPending}
              type="submit"
              className=" w-full"
            >
              Generate
            </Button>
          </form>
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} /></div>
    </aside>
  );
};
