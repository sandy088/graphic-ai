import { auth } from "@/auth";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";
import React from "react";

const SignUp = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
     <SignUpCard />
      
  );
};

export default SignUp;
