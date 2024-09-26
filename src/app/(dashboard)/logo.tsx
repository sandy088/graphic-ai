import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const font = Space_Grotesk({
  weight: ["700"],
  subsets: ["latin"],
});
export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-2 hover:opacity-75 transition h-[68px] px-4">
        <div className=" size-6 relative">
          <Image src="/logo3.svg" fill alt="Thumblify Ai Logo" />
        </div>
        <h1 className={cn(font.className, "text-xl  font-bold")}>Thumblify</h1>
      </div>
    </Link>
  );
};
