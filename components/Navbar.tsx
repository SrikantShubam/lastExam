// components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.add(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 bg-white dark:bg-black border-b border-black dark:border-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold tracking-tight text-black dark:text-white hover:opacity-80 transition-opacity">
          ExamRepo
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black dark:text-white hover:opacity-70 transition-opacity"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute top-full left-0 w-full bg-white dark:bg-black border-b border-black dark:border-white md:hidden transition-all duration-200 ease-in-out ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col py-2">
            <Link href="/" className="px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Button variant="ghost" className="w-full justify-start text-base">Home</Button>
            </Link>
            <Link href="/categories" className="px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Button variant="ghost" className="w-full justify-start text-base">Categories</Button>
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Button variant="ghost" className="w-full justify-start text-base">Leaderboard</Button>
            </Link>
            {!isLoggedIn ? (
              <Link href="/login" className="px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <Button variant="ghost" className="w-full justify-start text-base">Login</Button>
              </Link>
            ) : (
              <Link href="/profile" className="px-4 py-2 flex items-center gap-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <UserCircle size={18} /> <span className="text-base">Profile</span>
              </Link>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 text-base"
              onClick={toggleTheme}
            >
              Toggle Theme
            </Button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-black dark:text-white hover:opacity-70 transition-opacity">
            <Button variant="ghost" className="text-base px-3 py-1">Home</Button>
          </Link>
          <Link href="/categories" className="text-black dark:text-white hover:opacity-70 transition-opacity">
            <Button variant="ghost" className="text-base px-3 py-1">Categories</Button>
          </Link>
          <Link href="/leaderboard" className="text-black dark:text-white hover:opacity-70 transition-opacity">
            <Button variant="ghost" className="text-base px-3 py-1">Leaderboard</Button>
          </Link>
          {!isLoggedIn ? (
            <Link href="/login">
              <Button variant="outline" className="text-black dark:text-white border-black dark:border-white hover:bg-gray-200 dark:hover:bg-gray-800 px-3 py-1 text-base">
                Login
              </Button>
            </Link>
          ) : (
            <Link href="/profile" className="flex items-center gap-2 text-black dark:text-white hover:opacity-70 transition-opacity">
              <UserCircle size={18} /> <span className="text-base">Profile</span>
            </Link>
          )}
          <Button
            variant="outline"
            className="text-black dark:text-white border-black dark:border-white hover:bg-gray-200 dark:hover:bg-gray-800 px-3 py-1 text-base"
            onClick={toggleTheme}
          >
            Toggle Theme
          </Button>
        </div>
      </div>
    </nav>
  );
}