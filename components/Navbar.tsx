"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, UserCircle, Moon, Sun } from "lucide-react";

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
        <Link href="/" className="text-lg font-medium tracking-tight text-black dark:text-white">
          EXAMREPO
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute top-full left-0 w-full bg-white dark:bg-black border-b border-black dark:border-white md:hidden transition-all duration-200 ease-in-out ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col py-2">
            <Link href="/" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
              Home
            </Link>
            <Link href="/categories" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
              Categories
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
              Leaderboard
            </Link>
            {!isLoggedIn ? (
              <Link href="/login" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
                Login
              </Link>
            ) : (
              <Link href="/profile" className="px-4 py-2 flex items-center gap-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
                <UserCircle size={16} /> <span>Profile</span>
              </Link>
            )}
            <button
              className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-2"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-black dark:text-white hover:underline">
            Home
          </Link>
          <Link href="#categories" className="text-sm text-black dark:text-white hover:underline">
            Categories
          </Link>
          <Link href="#about" className="text-sm text-black dark:text-white hover:underline">
            About
          </Link>
          <Link href="/pyqs" className="text-sm text-black dark:text-white hover:underline">
            PYQs
          </Link>
          <Link href="/leaderboard" className="text-sm text-black dark:text-white hover:underline">
            Leaderboard
          </Link>
          {!isLoggedIn ? (
            <Link href="/login" className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
              Login
            </Link>
          ) : (
            <Link href="/profile" className="flex items-center gap-1 text-sm text-black dark:text-white hover:underline">
              <UserCircle size={16} /> Profile
            </Link>
          )}
          <button
            className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}