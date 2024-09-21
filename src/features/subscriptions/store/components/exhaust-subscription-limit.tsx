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
import { useEffect } from "react";
import { loadScript } from "@/lib/loadscript";
import { toast } from "sonner";
import { useVerifySubscription } from "../../hooks/use-verify-subscription";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Palanquin_Dark } from "next/font/google";
import { useAiExhaustedModal } from "../use-ai-exhaustem-modal";

export const AiExhaustedModal = () => {
  const { isOpen, close } = useAiExhaustedModal();
  const mutation = useCreateSubscription();
  const verifyMutation = useVerifySubscription();
  const router = useRouter();

  const createSubscription = async () => {
    mutation.mutate(
      { planId: process.env.NEXT_PUBLIC_PLAN_ID! },
      {
        onSuccess: (data) => {
          console.log("Subscription created: ", data);
          const paymentObject = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            //@ts-ignore
            subscription_id: data?.data?.id,
            name: "Graphic Ai Pro",
            description: "Upgrade to a paid plan",
            image: "/logo.svg",
            handler: async function (response: any) {
              console.log(response);
              if (response.razorpay_payment_id) {
                const options2 = {
                  raz_signature: `${response.razorpay_signature}`,
                  raz_payment_id: `${response.razorpay_payment_id}`,
                  raz_sid: `${response.razorpay_subscription_id}`,
                  planId: `${process.env.NEXT_PUBLIC_PLAN_ID}`,
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
          paymentObject.open();
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
          <DialogTitle>Existing Ai Limit Exhausted</DialogTitle>
          <DialogDescription>
            Upgrade plan to continue using AI features
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <ul className=" space-y-2">
          <li className="flex items-center">
            <CheckCircle2 className="fill-blue-500 text-white mr-2 size-5" />
            <p className="text-sm text-muted-foreground">
              Unlimited access to all premium templates
            </p>
          </li>

          <li className="flex items-center">
            <CheckCircle2 className="fill-blue-500 text-white mr-2 size-5" />
            <p className="text-sm text-muted-foreground">
              Generate 100+ AI powered images
            </p>
          </li>

          <li className="flex items-center">
            <CheckCircle2 className="fill-blue-500 text-white mr-2 size-5" />
            <p className="text-sm text-muted-foreground">
              Get access to 100+ AI-Image background removal
            </p>
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
