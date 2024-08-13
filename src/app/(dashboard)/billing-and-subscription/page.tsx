"use client";
import React from "react";
import { BillingBanner } from "../billing-banner";
import { useSession, signOut } from "next-auth/react";
import { Loader } from "lucide-react";
import { BillingCard } from "../billing-card";

const BillingAndSubscription = () => {
  const session = useSession();

  if (session.status === "loading")
    return <Loader className="size-4 animate-spin text-muted-foreground" />;

  if (session.status === "unauthenticated" || !session.data) return null;

  return (
    <div className=" flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
      <BillingBanner userData={session.data} />
      <BillingCard/>
    </div>
  );
};

export default BillingAndSubscription;
