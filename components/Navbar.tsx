// 4️⃣ Create Navbar Component (components/Navbar.tsx)
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

    setTimeout(() => {
      document.documentElement.style.display = "none";
      document.documentElement.offsetHeight;
      document.documentElement.style.display = "";
    }, 0);
  };

  return (
    <nav className="p-4 border-b flex justify-between items-center relative bg-white dark:bg-black shadow-md">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-xl font-bold cursor-pointer">ExamRepo</h1>
      </Link>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white dark:bg-black flex flex-col items-start shadow-md md:hidden transition-all duration-300 ease-in-out z-50 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <Link href="/" className="w-full text-left p-4"><Button variant="ghost">Home</Button></Link>
        <Link href="/categories" className="w-full text-left p-4"><Button variant="ghost">Categories</Button></Link>
        <Link href="/leaderboard" className="w-full text-left p-4"><Button variant="ghost">Leaderboard</Button></Link>
        {!isLoggedIn ? (
          <Link href="/login" className="w-full text-left p-4"><Button variant="ghost">Login</Button></Link>
        ) : (
          <Link href="/profile" className="w-full text-left p-4 flex items-center gap-2">
            <UserCircle size={24} /> Profile
          </Link>
        )}
        <Button variant="ghost" className="w-full text-left p-4" onClick={toggleTheme}>Toggle Theme</Button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link href="/categories">
          <Button variant="ghost">Categories</Button>
        </Link>
        <Link href="/leaderboard">
          <Button variant="ghost">Leaderboard</Button>
        </Link>
        {!isLoggedIn ? (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        ) : (
          <Link href="/profile" className="flex items-center gap-2">
            <UserCircle size={24} /> Profile
          </Link>
        )}
        <Button variant="outline" onClick={toggleTheme}>Toggle Theme</Button>
      </div>
    </nav>
  );
}
