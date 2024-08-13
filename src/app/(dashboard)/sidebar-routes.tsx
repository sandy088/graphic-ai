"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Crown, Home, MessageCircleQuestion } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname, useRouter } from "next/navigation";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

export const SidebarRoutes = () => {
  const { shouldBlock, isLoading, triggerPaywall } = usePaywall();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {shouldBlock && (
        <>
          <div className=" px-4">
            <Button
              onClick={triggerPaywall}
              className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
              variant={"outline"}
            >
              <Crown className="size-4 mr-2 fill-yellow-500 text-yellow-500" />
              Upgrade to Pro
            </Button>
          </div>

          <div className=" px-3">
            <Separator />
          </div>
        </>
      )}
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          onClick={() => {
            router.push("/");
          }}
          icon={Home}
          label="Home"
          isActive={pathname === "/"}
        />
      </ul>
      <div className=" px-3">
        <Separator />
      </div>

      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          onClick={() => {
            router.push("/billing-and-subscription");
          }}
          icon={CreditCard}
          label="Billing & Subscriptions"
          isActive={pathname === "/billing"}
        />
        <SidebarItem
          onClick={() => {
            router.push("mailto:support@graphicai.com");
          }}
          icon={MessageCircleQuestion}
          label="Get Help"
          isActive={pathname === "/billing"}
        />
      </ul>
    </div>
  );
};
