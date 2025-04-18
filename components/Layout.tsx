import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </div>
    </AuthProvider>
  );
}