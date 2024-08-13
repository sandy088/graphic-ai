"use client";
import { Session } from "next-auth";
import React from "react";

interface BillingBannerProps {
  userData: Session;
}
export const BillingBanner = ({ userData }: BillingBannerProps) => {
  return (
    <div
      className="relative overflow-hidden aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl
     bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]"
    >
      <div
        className="
         hidden rounded-full size-28 md:flex items-center justify-center bg-white/50
        "
      >
        <div className=" rounded-full text-4xl size-20 flex items-center justify-center bg-white">
          {/* <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" /> */}
          👋
        </div>
      </div>
      <div
        className="
          flex flex-col gap-y-2 text-white
         "
      >
        <h1
          className="
                text-2xl md:text-3xl font-semibold
                "
        >
          Hi {userData.user?.name}!
        </h1>
        <p
          className="
             text-sm md:text-sm mb-2"
        >
         Welcome to your dashboard. Here you can manage your <br/> billing and subscription.
        </p>
      </div>

      <img
       src="/debit.png"
       className="absolute -right-24 md:block hidden -bottom-10 w-1/2 h-full object-cover"
      />

    </div>
  );
};
