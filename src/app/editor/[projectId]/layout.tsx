import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design - thumblify",
  description: "Design your thumbnails with thumblify",
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
