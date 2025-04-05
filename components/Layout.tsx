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
      {children}
      <Footer />
    </div>
    </AuthProvider>
  );
}