import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "sonner";
import "./globals.css";
import { Modals } from "@/components/modals";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Graphic Ai - Create stunning youtube thumbnails with ai",
  description: "Create stunning youtube thumbnails with power of ai. Graphic Ai is an ai tool to create youtube thumbnails", 
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <Toaster />
            <Modals/>
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
