import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react"
import type { IconType } from "react-icons"

interface SidebarItemProps {
  icon: IconType | LucideIcon;
  iconClassName?: string;
  onClick: () => void;
}
export const ShapeTool = ({
    icon:Icon,
    iconClassName,
    onClick,
}:SidebarItemProps) => {
  return (
    <button
     onClick={onClick}
     className=" aspect-square rounded-md p-5"
    >
        <Icon className={cn("h-full w-full",iconClassName) }/>
    </button>
  )
}
