import { protectSever } from "@/features/auth/utils";

export default async function Home() {
  await protectSever();
  return <div>You are logged in</div>;
}
