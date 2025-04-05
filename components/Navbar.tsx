
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check user login status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsLoggedIn(!!currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.add(storedTheme);
    } else {
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close menu if user clicks outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) setMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 bg-white dark:bg-black border-b border-black dark:border-white text-black dark:text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left section: Mobile Menu Button + Logo */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button - only on mobile */}
          <button
            className="md:hidden text-black dark:text-white"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up
              setMenuOpen(!menuOpen);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-lg font-medium tracking-tight text-black dark:text-white">
            EXAMREPO
          </Link>
        </div>

        {/* Right section: User Profile on mobile, full menu on desktop */}
        <div className="flex items-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-black dark:text-white hover:underline">
              Home
            </Link>
            <Link href="/#categories" className="text-sm text-black dark:text-white hover:underline">
              Categories
            </Link>
            <Link href="/#about" className="text-sm text-black dark:text-white hover:underline">
              About
            </Link>
            <Link href="/pyqs" className="text-sm text-black dark:text-white hover:underline">
              PYQs
            </Link>
            <Link href="/leaderboard" className="text-sm text-black dark:text-white hover:underline">
              Leaderboard
            </Link>
            <button
              className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {/* User Profile or Login Button */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black ml-4"
            >
              Login
            </Link>
          ) : (
            <div className="ml-4">
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (menuOpen) setMenuOpen(false);
                  }}
                >
                  <Image
                    src={user?.photoURL || "https://via.placeholder.com/32"}
                    alt="User profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/32";
                    }}
                  />
                </HeadlessMenu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <HeadlessMenu.Items
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-900 focus:outline-none rounded-md shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <HeadlessMenu.Item>
                        {() => (
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                          >
                            Dashboard
                          </Link>
                        )}
                      </HeadlessMenu.Item>
                      <HeadlessMenu.Item>
                        {() => (
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </div>
                  </HeadlessMenu.Items>
                </Transition>
              </HeadlessMenu>
            </div>
          )}
        </div>
      </div>

      {/* Full-width Mobile Menu */}
      <div
        className={`absolute left-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 md:hidden transition-all duration-200 ease-in-out ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing menu
      >
        <div className="flex flex-col py-2">
          <Link
            href="/"
            className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/#categories"
            className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/#about"
            className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/pyqs"
            className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            PYQs
          </Link>
          <Link
            href="/leaderboard"
            className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            Leaderboard
          </Link>
          <button
            className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-2"
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}