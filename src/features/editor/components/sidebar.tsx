"use client";

import { ActiveTool } from "../types";
import { SidebarItem } from "./sidebar-item";

import { LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type
 } from "lucide-react";

 interface SidebarProps {
  activeTool:ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
 }
export const Sidebar = ({
  activeTool,
  onChangeActiveTool,
}:SidebarProps) => {
  return (
    <aside className=" bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <ul className=" flex flex-col">
        {/* Do it in a  better way like using map */}
        <SidebarItem
          icon={LayoutTemplate}
          label="Design"
          isActive={activeTool === 'templates'}
          onClick={() => onChangeActiveTool('templates')}
        />
        <SidebarItem
          icon={ImageIcon}
          label="Image"
          isActive={activeTool === 'images'}
          onClick={() => onChangeActiveTool('images')}
        />
        <SidebarItem
          icon={Type}
          label="Text"
          isActive={activeTool === 'text'}
          onClick={() => onChangeActiveTool('text')}
        />
        <SidebarItem
          icon={Shapes}
          label="shapes"
          isActive={activeTool === 'shapes'}
          onClick={() => onChangeActiveTool('shapes')}
        />
        <SidebarItem
          icon={Sparkles}
          label="AI"
          isActive={activeTool === 'ai'}
          onClick={() => onChangeActiveTool('ai')}
        />
        <SidebarItem
          icon={Pencil}
          label="Draw"
          isActive={activeTool === 'draw'}
          onClick={() => onChangeActiveTool('draw')}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          isActive={activeTool === 'settings'}
          onClick={() => onChangeActiveTool('settings')}
        />
      </ul>
    </aside>
  );
};
