import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "lucide-react";
import { useMemo } from "react";

export const BillingCard = () => {
  const { data, isLoading } = usePaywall();

  const currentPeriodEnd = useMemo(()=>{
    console.log("Running memo")

    //check if currentPeriodEnd is greater than current date or not
    //if it is greater than current date then return the currentPeriodEnd
    //else return null
    if(data?.currentPeriodEnd && new Date(data.currentPeriodEnd) > new Date()){
      return formatDistanceToNow(new Date(data.currentPeriodEnd),{})
    }
    return "N/A"
  },[data?.currentPeriodEnd])

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
                {currentPeriodEnd}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
