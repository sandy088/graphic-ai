"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubscriptionModal } from "../use-subscription-modal";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SubscriptionModal = () => {
  const { isOpen, close } = useSubscriptionModal();
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader className=" flex items-center space-y-4">
          <Image src="/logo.svg" alt="Subscription" width={36} height={36} />
          <DialogTitle>Upgrade to a paid plan</DialogTitle>
          <DialogDescription>
            Upgrade to a paid plan to unlock all features and support the development of this app.
          </DialogDescription>

        </DialogHeader>
        <Separator/>

        <ul className=" space-y-2">
            <li
             className="flex items-center"
            >
                <CheckCircle2 className="fill-blue-500 text-white mr-2 size-5"/>
                <p
                 className="text-sm text-muted-foreground"
                >
                    Unlimited access to all premium templates
                </p>
            </li>

            <li
             className="flex items-center"
            >
                <CheckCircle2 className="fill-blue-500 text-white mr-2 size-5"/>
                <p
                 className="text-sm text-muted-foreground"
                >
                    Generate AI powered images
                </p>
            </li>

            <li
             className="flex items-center"
            >
                <CheckCircle2 className="fill-blue-500 text-white mr-2 size-5"/>
                <p
                 className="text-sm text-muted-foreground"
                >
                    Get access to AI-Image background removal
                </p>
            </li>

            <li
             className="flex items-center"
            >
                <CheckCircle2 className="fill-blue-500 text-white mr-2 size-5"/>
                <p
                 className="text-sm text-muted-foreground"
                >
                    AI image to sticker conversion
                </p>
            </li>

        </ul>
        <DialogFooter className=" pt-2 mt-4 gap-y-2">
            <Button
             className="w-full"
             onClick={()=>{

             }}
             disabled={false}
            >
                Upgrade
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
