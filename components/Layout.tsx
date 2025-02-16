import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}