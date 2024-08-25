import React from "react";
import { UploadSection } from "./_components/upload-section";
import { HeaderSection } from "./_components/header-section";

const Page = () => {
  return (
    <div className="relative flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
      <div className="absolute animate-pulse -top-60 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-70 blur-3xl" />

      <div className="absolute animate-pulse z-0 -right-[22rem] h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-70 blur-3xl" />

      <HeaderSection />
      <UploadSection />
    </div>
  );
};

export default Page;
