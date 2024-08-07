import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const protectSever = async() => {
    const session = await auth();

    if (!session) {
        redirect("/api/auth/signin");
    }
}