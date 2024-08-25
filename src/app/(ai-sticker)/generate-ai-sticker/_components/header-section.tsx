import { Sparkles } from "lucide-react";
import React from "react";

export const HeaderSection = () => {
  return (
    <div className=" w-full flex flex-col  justify-center items-center mt-10">
      <div className="flex items-center px-3 py-1.5 mb-3 bg-primary rounded-full text-muted font-medium">
        <p>Generate with AI</p>
        <Sparkles className="w-4 h-4 text-white ml-2" />
      </div>
      <h2
        className="md:text-4xl
        text-2xl
        font-bold text-center
        "
      >
        Advanced AI Sticker Generator
      </h2>
      <p
        className="text-center
           md:text-lg
              text-sm
          text-muted-foreground mt-2
          md:w-1/3
            w-full
          "
      >
        Upload an image and generate a sticker with AI, Moreover edit with our
        <span className=" font-semibold underline underline-offset-[5px]">
          {" "}
          advanced editor
        </span>
      </p>
    </div>
  );
};
