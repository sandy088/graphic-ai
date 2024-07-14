import { ChevronLeft } from "lucide-react";

interface ToolSideBarCloseProps {
    onClick: () => void;
}

export const ToolSideBarClose = ({
    onClick
}: ToolSideBarCloseProps) => {
  return (
    <button onClick={onClick}
     className="absolute -right-[0.90rem] h-[70px] bg-white top-1/2 transform -translate-y-1/2
     flex items-center justify-center rounded-r-xl border-r border-y group"
    >
        <ChevronLeft className="size-4 text-black group-hover:opacity-75 transition" onClick={onClick} />
    </button>
  )
}
