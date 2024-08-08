import { cn } from "@/lib/utils";
import { Link, LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick: () => void;
}
export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    // TODO: Fix hydration error with Link
    // <Link href={href} onClick={onClick}>
      <div
        role="button"
        onClick={onClick}
        className={cn(
          "flex items-center px-3 py-3 rounded-xl bg-transparent hover:bg-white transition",
          isActive && "bg-white"
        )}
      >

        <Icon
         className=" size-4 mr-2 stroke-2"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
    // </Link>
  );
};
