"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSignUp } from "../hooks/use-sign-up";
import { TriangleAlert } from "lucide-react";

export const SignUpCard = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useSignUp();

  const onCredentialsSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //implement the sign up functionality
    mutation.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          signIn("credentials",{
            email,
            password,
            callbackUrl: "/"
          })
        },
      }
    );
  };
  const onProviderSignUp = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className="px-0 pt-0 ">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Use your email or another methods to continue
        </CardDescription>
      </CardHeader>
      {
        !!mutation.error && (
          <div
           className=" bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6"
          >
            <TriangleAlert
             className=" size-4"
            />
            <p>Something Went Wrong</p>

          </div>
        )
      }
      <CardContent className=" space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialsSignUp} className=" space-y-2.5">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            type="text"
            disabled={mutation.isPending}
            required
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            disabled={mutation.isPending}
            required
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            minLength={3}
            disabled={mutation.isPending}
            required
          />
          <Button
            type="submit"
            className=" w-full "
            size={"lg"}
            disabled={mutation.isPending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => onProviderSignUp("github")}
            variant={"outline"}
            size={"lg"}
            disabled={mutation.isPending}
            className="w-full relative"
          >
            <FaGithub className=" mr-2 size-5 top-2.5 left-2.5 absolute" />
            Continue with Github
          </Button>
          <Button
            onClick={() => onProviderSignUp("google")}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
            disabled={mutation.isPending}
          >
            <FcGoogle className=" mr-2 size-5 top-2.5 left-2.5 absolute" />
            Continue with Google
          </Button>

          <p className=" text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href={"/sign-in"}>
              <span className="text-sky-700 hover:underline">Sign in</span>
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
