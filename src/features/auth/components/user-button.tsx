"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { CreditCard, Loader, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export const UserButton = () => {
  const session = useSession();
  if (session.status === "loading")
    return <Loader className="size-4 animate-spin text-muted-foreground" />;

  if (session.status === "unauthenticated" || !session.data) return null;

  const name = session.data.user?.name!;
  const imageUrl = session.data.user?.image;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        {/* TODO: Add crown if user is premium */}
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt="name" src={imageUrl || ""} />
          <AvatarFallback className=" bg-blue-500 font-medium text-white rounded-full px-3.5 py-2">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem disabled={false} onClick={() => {}} className="h-10">
          <CreditCard className="size-6 mr-2" />
          Billing
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()} className="h-10">
          <LogOut className="size-6 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
