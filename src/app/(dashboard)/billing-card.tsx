import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBilling } from "@/features/subscriptions/hooks/use-billing";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "lucide-react";
import Link from "next/link";

export const BillingCard = () => {
  const { data, isLoading } = usePaywall();

  if (isLoading)
    return <Loader className="size-4 animate-spin text-muted-foreground" />;

  return (
    <div>
      <Card className="w-full">
        <CardHeader className=" flex justify-start">
          <CardTitle>
            Subscription
            <Badge
              className={cn(
                "ml-2",
                "text-white",
                data?.active ? "bg-green-500" : "bg-orange-500"
              )}
            >
              {data?.active ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Track your subscription and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Subscription id</p>
              <p className="text-lg font-semibold">
                {data.subscriptionId ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days left</p>
              <p className="text-lg font-semibold">
                {data?.currentPeriodEnd
                  ? formatDistanceToNow(new Date(data?.currentPeriodEnd!), {})
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
