import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetImages } from "@/features/images/api/use-get-images";
import { AlertTriangle, DivideSquare, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ElementsList } from "./elements-list";
import { useSaveImage } from "@/features/images/api/use-save-images";
import { UploadedImagesList } from "./saved-images";
import axios from "axios";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const { data, isLoading, isError } = useGetImages();
  const mutation = useSaveImage();

  const [currentList, setCurrentList] = useState<
    "images" | "graphics" | "saved-images"
  >("images");

  const value = editor?.getActiveFontFamily();
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeList = (list: "images" | "graphics" | "saved-images") => {
    setCurrentList(list);
  };

  const onSaveImage = async (imageUrl: string) => {
    mutation.mutate({ imageUrl });
  };

  const unsplashDownloadEndPointTrigger = async (url: string) => {
    const downloadLink =
      url + `&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`;

    await axios
      .get(downloadLink)
      .then((res) => {
        console.log("download triggered successfully", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <aside
      className={cn(
        "py-3 pr-3 bg-muted",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <div className="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col rounded-md">
        <ToolSidebarHeader
          title="Images"
          description="Add images to your design"
        />

        <div className="p-4 border-b">
          <UploadButton
            appearance={{
              button: "w-full text-sm font-medium",
              allowedContent: "hidden",
            }}
            content={{
              button: "Upload Image",
            }}
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              editor?.addImage(res[0].url);
              onSaveImage(res[0].url);
            }}
          />
        </div>

        {/* Testing adding video elements  */}

        {/* <div>
        <Button
         onClick={()=>{
          editor?.addVideo("https://cdn.pixabay.com/video/2024/03/04/202982-919365848_large.mp4")
         }}
        >
          Add a video
        </Button>
      </div> */}

        <div className="px-4 py-4">
          <ScrollArea>
            <div className=" flex w-full">
              <Button
                variant={currentList === "images" ? "default" : "outline"}
                onClick={() => onChangeList("images")}
                className="mr-2"
              >
                unsplash
              </Button>

              <Button
                variant={currentList === "graphics" ? "default" : "outline"}
                onClick={() => onChangeList("graphics")}
              >
                Graphics
              </Button>
              <Button
                variant={currentList === "saved-images" ? "default" : "outline"}
                onClick={() => onChangeList("saved-images")}
                className="ml-2"
              >
                Uploaded
              </Button>
            </div>
          </ScrollArea>
        </div>

        {isLoading && (
          <div className=" flex items-center justify-center flex-1">
            <Loader className="size-4 text-muted-foreground animate-spin" />
          </div>
        )}

        {isError && (
          <div className=" flex flex-col gap-y-4 items-center justify-center flex-1">
            <AlertTriangle className="size-4 text-muted-foreground" />
            <p className=" text-muted-foreground text-xs">
              Failed to load images
            </p>
          </div>
        )}
        <ScrollArea>
          <div className=" px-4 pb-4">
            {currentList === "images" && (
              <div className="grid grid-cols-2 gap-4">
                {data?.map((image) => {
                  return (
                    <button
                      key={image.id}
                      className="w-full relative h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                      onClick={() => {
                        editor?.addImage(image.urls.regular);
                        unsplashDownloadEndPointTrigger(
                          image.links.download_location
                        );
                      }}
                    >
                      <Image
                        src={image.urls.thumb}
                        fill
                        alt={image.alt_description || "Unsplash Image"}
                        className="object-cover"
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                        <Link
                          target="_blank"
                          href={image.user.links.html}
                          className="hover:underline"
                        >
                          {image.user.name}
                        </Link>{" "}
                        on
                        <Link
                          target="_blank"
                          href={image.links.html}
                          className="hover:underline"
                        >
                          {" "}
                          Unsplash
                        </Link>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentList === "graphics" && <ElementsList editor={editor} />}
            {currentList === "saved-images" && (
              <UploadedImagesList editor={editor} />
            )}
          </div>
        </ScrollArea>
        <ToolSideBarClose onClick={onClose} />
      </div>
    </aside>
  );
};
