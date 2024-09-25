"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscriptionModal } from "../use-subscription-modal";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateSubscription } from "../../hooks/use-create-subscription";
import { useEffect, useState } from "react";
import { loadScript } from "@/lib/loadscript";
import { toast } from "sonner";
import { useVerifySubscription } from "../../hooks/use-verify-subscription";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Palanquin_Dark } from "next/font/google";
import { useBuyTokenModal } from "../use-buy-token";

export const BuyTokenModal = () => {
  const { isOpen, close } = useBuyTokenModal();
  const mutation = useCreateSubscription();
  const verifyMutation = useVerifySubscription();
  const router = useRouter();

  const [active, setActive] = useState(1);

  const createSubscription = async () => {
    mutation.mutate(
      { planId: active.toString() },
      {
        onSuccess: async(data) => {
          console.log("Subscription created: ", data);
          const paymentObject = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            //@ts-ignore
            order_id: data?.data?.id,
            name: "Graphic Ai Pro",
            description: "Upgrade to a paid plan",
            image: "/logo.svg",
            handler: async function (response: any) {
              console.log(response);
              if (response.razorpay_payment_id) {
                const options2 = {
                  raz_signature: `${response?.razorpay_signature}`,
                  raz_payment_id: `${response?.razorpay_payment_id}`,
                  raz_sid: `temp`,
                  planId: `${active}`,
                  razorpay_order_id: `${response?.razorpay_order_id}`,
                };
                //TODO: call api to verify payment
                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_APP_URL}` + "/api/subs/verify",
                    options2
                  )
                  .then((res) => {
                    console.log(res.data.data);
                    if (res?.data?.data === true) {
                      alert("Payment Successful");
                    } else {
                      alert("Payment Failed");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            },

            theme: {
              color: "#F37254",
            },
          });
          await paymentObject.open();
          close();
        },
      }
    );
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader className=" flex items-center space-y-4">
          <Image src="/logo.svg" alt="Subscription" width={36} height={36} />
          <DialogTitle>Buy Some Tokens to use this AI feature</DialogTitle>
          <DialogDescription className=" text-center">
            You need to buy tokens to use this AI feature without any
            interruptions
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <ul className=" space-y-2 flex flex-wrap gap-2 items-center justify-center">
          <li className="flex items-center">
            <Button
              onClick={() => setActive(1)}
              variant={active === 1 ? "default" : "outline"}
            >
              <span className=" text-lg font-bold ">$5</span>/100 Tokens
            </Button>
          </li>

          <li className="flex items-center">
            <Button
              onClick={() => setActive(2)}
              className=""
              variant={active === 2 ? "default" : "outline"}
            >
              <span className=" text-lg font-bold ">$10</span>/220 Tokens
            </Button>
          </li>

          <li className="flex items-center">
            <Button
              onClick={() => setActive(3)}
              className=" "
              variant={active === 3 ? "default" : "outline"}
            >
              <span className=" text-lg font-bold">$20</span>/460 Tokens
            </Button>
          </li>

          <li className="flex items-center">
            <Button
              onClick={() => setActive(4)}
              variant={active === 4 ? "default" : "outline"}
            >
              <span className=" text-lg font-bold">$50</span>/1.1k Tokens
            </Button>
          </li>
        </ul>
        <DialogFooter className=" pt-2 mt-4 gap-y-2">
          <Button
            className="w-full"
            onClick={createSubscription}
            disabled={mutation.isPending}
          >
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
