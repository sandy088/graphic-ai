"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useBilling } from "@/features/subscriptions/hooks/use-billing";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useTokenPaywall } from "@/features/subscriptions/hooks/use-tokens-paywall";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { CreditCard, Crown, Loader, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const UserButton = () => {
  const router = useRouter();
  const session = useSession();
  const { shouldBlock, triggerPaywall, isLoading } = usePaywall();
  const { data, isLoading: tokenLoading } = useTokenPaywall();

  const onBillingClick = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }
    router.push("/billing-and-subscription");
  };

  if (session.status === "loading")
    return <Loader className="size-4 animate-spin text-muted-foreground" />;

  if (session.status === "unauthenticated" || !session.data) return null;

  const name = session.data.user?.name!;
  const imageUrl = session.data.user?.image;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className=" outline-none relative">
        {!shouldBlock && !isLoading && (
          <div className="absolute -top-1 -left-1 z-10 flex items-center justify-center">
            <div className="rounded-full bg-white flex items-center justify-center p-1 drop-shadow-sm">
              <Crown className="size-3 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        )}
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt="name" src={imageUrl || ""} />
          <AvatarFallback className=" bg-blue-500 font-medium text-white rounded-full px-3.5 py-2">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {data?.tokens && !tokenLoading && (
          <DropdownMenuItem>
            <div className="flex flex-col w-full justify-start ">
              <div className="flex w-full justify-between">
                <p className="mb-2 font-semibold text-muted-foreground">
                  Ai Sticker Credits
                </p>
                <p className="mb-2 font-semibold text-muted-foreground">
                  {data.tokens}
                </p>
              </div>
              <Progress value={data.tokens} className="w-full h-3" />
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onBillingClick} className="h-10">
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
