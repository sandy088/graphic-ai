"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UpgradePremiumBlockProps {
  onClick: () => void;
}
export default function UpgradePremiumBlock({
  onClick,
}: UpgradePremiumBlockProps) {
  return (
    <Card>
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button size="sm" className="w-full" onClick={onClick}>
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
}
