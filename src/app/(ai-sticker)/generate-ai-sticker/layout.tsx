import { Navbar } from "@/app/(dashboard)/navbar";
import { Logo } from "./_components/logo";
import { Footer } from "./_components/footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="bg-muted h-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between w-full">
          <Logo />
          <Navbar />
        </div>

        <main className="bg-white flex-1 overflow-auto p-8 overflow-x-hidden">{children}</main>
        <Footer/>
      </div>
    </div>
  );
};

export default DashboardLayout;
