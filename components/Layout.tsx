import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./ThemeProvider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
          <Navbar />
          <main className="flex-1 min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}