import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design - Graphic Ai",
  description: "Graphic AI design file",
};
const Layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) => {
  //set meta data
  return <>{children}</>;
};

export default Layout;
