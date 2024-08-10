import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TemplateCardProps {
  imageSrc: string;
  title: string;
  onclick: () => void;
  disabled: boolean;
  description: string;
  width: number;
  height: number;
  isPro: boolean | null;
}
export const TemplateCard = ({
  imageSrc,
  title,
  onclick,
  disabled,
  description,
  width,
  height,
  isPro,
}: TemplateCardProps) => {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className={cn(
        "space-y-2 group text-left transition flex flex-col mt-4",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <div
        style={{ aspectRatio: `${width}/${height}` }}
        className="relative rounded-xl h-full w-full overflow-hidden border"
      >
        <Image
          fill
          src={imageSrc}
          alt={title}
          className="object-cover
          transition-transform group-hover:scale-105
         "
        />
        {isPro && (
          <div className=" z-20  absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs bg-black/50">
            <Crown className=" size-4 inline-block fill-yellow-500 text-yellow-500" />
          </div>
        )}
        <div
          className="
          opacity-0 group-hover:opacity-100 transition inset-0
          absolute bg-black/50 flex items-center justify-center
          rounded-xl backdrop-filter backdrop-blur-sm
         "
        >
          <p className="text-white font-medium">Open in Editor</p>
        </div>
      </div>
      <div className=" space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p
          className="text-xs text-muted-foreground 
          opacity-0 group-hover:opacity-75 transition
         "
        >
          {description}
        </p>
      </div>
    </button>
  );
};
