"use client";

import { Logo } from "./logo";

import { ChevronDownIcon, Download, MousePointerClick, Redo2, Undo2 } from "lucide-react";
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
import { BsCloudCheck } from "react-icons/bs";

export const Navbar = () => {
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
              onClick={() => {}} //TODO: Implement open file
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
            onClick={() => {}} //TODO: Implement functionality
            className="" //TODO: Implement dynamic class
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
            variant={"ghost"}
            size={"icon"}
            onClick={() => {}} //TODO: Implement functionality
            className="" //TODO: Implement dynamic class
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
            variant={"ghost"}
            size={"icon"}
            onClick={() => {}} //TODO: Implement functionality
            className="" //TODO: Implement dynamic class
          >
            <Redo2 className=" size-4 " />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className=" size-5 text-muted-foreground" />
          <div className=" text-xs text-muted-foreground">
            Saved
          </div>
        </div>

        <div
        className=" ml-auto flex items-center gap-x-4"
        >
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"ghost"}>
                Export
                <Download className=" size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" min-w-60">
              <DropdownMenuItem
                onClick={() => {}} //TODO: Implement functionality
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>JSON</p>
                  <p
                    className=" text-xs text-muted-foreground"
                  >Save for later editing</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}} //TODO: Implement functionality
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>PNG</p>
                  <p
                    className=" text-xs text-muted-foreground"
                  >Best for sharing on the web</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}} //TODO: Implement functionality
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>JPEG</p>
                  <p
                    className=" text-xs text-muted-foreground"
                  >Best for printing</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {}} //TODO: Implement functionality
                className="flex items-center gap-x-2"
              >
                <CiFileOn className=" size-8 " />
                <div>
                  <p>SVG</p>
                  <p
                    className=" text-xs text-muted-foreground"
                  >Best for editing in vector tools</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
