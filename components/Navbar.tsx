// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Menu, X, UserCircle, Moon, Sun } from "lucide-react";

// export default function Navbar() {
//   const [theme, setTheme] = useState("light");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme");
//     if (storedTheme) {
//       setTheme(storedTheme);
//       document.documentElement.classList.add(storedTheme);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.toggle("dark");
//   };

//   return (
//     <nav className="sticky top-0 z-50 px-4 py-3 bg-white dark:bg-black border-b border-black dark:border-white">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/" className="text-lg font-medium tracking-tight text-black dark:text-white">
//           EXAMREPO
//         </Link>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-black dark:text-white"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={18} /> : <Menu size={18} />}
//         </button>

//         {/* Mobile Menu */}
//         <div
//           className={`absolute top-full left-0 w-full bg-white dark:bg-black border-b border-black dark:border-white md:hidden transition-all duration-200 ease-in-out ${
//             menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
//           }`}
//         >
//           <div className="flex flex-col py-2">
//             <Link href="/" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               Home
//             </Link>
//             <Link href="/#categories" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               Categories
//             </Link>
//             <Link href="/pyqs" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               PYQs
//             </Link>
//             <Link href="/leaderboard" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               Leaderboard
//             </Link>
//             {!isLoggedIn ? (
//               <Link href="/login" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//                 Login
//               </Link>
//             ) : (
//               <Link href="/profile" className="px-4 py-2 flex items-center gap-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//                 <UserCircle size={16} /> <span>Profile</span>
//               </Link>
//             )}
//             <button
//               className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-2"
//               onClick={toggleTheme}
//             >
//               {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//               <span>{theme === "light" ? "Dark" : "Light"}</span>
//             </button>
//           </div>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-6">
//           <Link href="/" className="text-sm text-black dark:text-white hover:underline">
//             Home
//           </Link>
//           <Link href="#categories" className="text-sm text-black dark:text-white hover:underline">
//             Categories
//           </Link>
//           <Link href="#about" className="text-sm text-black dark:text-white hover:underline">
//             About
//           </Link>
//           <Link href="/pyqs" className="text-sm text-black dark:text-white hover:underline">
//             PYQs
//           </Link>
//           <Link href="/leaderboard" className="text-sm text-black dark:text-white hover:underline">
//             Leaderboard
//           </Link>
//           {!isLoggedIn ? (
//             <Link href="/login" className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
//               Login
//             </Link>
//           ) : (
//             <Link href="/profile" className="flex items-center gap-1 text-sm text-black dark:text-white hover:underline">
//               <UserCircle size={16} /> Profile
//             </Link>
//           )}
//           <button
//             className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
//             onClick={toggleTheme}
//           >
//             {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }




// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image"; // Explicit import
// import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
// import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
// import { signOut, onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../lib/firebase";

// export default function Navbar() {
//   const [theme, setTheme] = useState<"light" | "dark">("light");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   // Check user login status and fetch user data
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setIsLoggedIn(!!currentUser);
//       setUser(currentUser); // Store the user object
//     });
//     return () => unsubscribe();
//   }, []);

//   // Load theme from localStorage on mount
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
//     if (storedTheme) {
//       setTheme(storedTheme);
//       document.documentElement.classList.add(storedTheme);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.toggle("dark");
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setIsLoggedIn(false);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 px-4 py-3 bg-white dark:bg-black border-b border-black dark:border-white">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/" className="text-lg font-medium tracking-tight text-black dark:text-white">
//           EXAMREPO
//         </Link>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-black dark:text-white"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <X size={18} /> : <Menu size={18} />}
//         </button>

//         {/* Mobile Menu */}
//         <div
//           className={`absolute top-full left-0 w-full bg-white dark:bg-black border-b border-black dark:border-white md:hidden transition-all duration-200 ease-in-out ${
//             menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
//           }`}
//         >
//           <div className="flex flex-col py-2">
//             <Link href="/" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               Home
//             </Link>
//             <Link href="/#categories" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               Categories
//             </Link>
//             <Link href="/pyqs" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               PYQs
//             </Link>
//             <Link href="/leaderboard" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//               Leaderboard
//             </Link>
//             {!isLoggedIn ? (
//               <Link href="/login" className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900">
//                 Login
//               </Link>
//             ) : (
//               <HeadlessMenu as="div" className="relative px-4 py-2">
//                 <HeadlessMenu.Button className="flex items-center gap-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 w-full text-left">
//                   <Image
//                     src={user?.photoURL || "https://via.placeholder.com/32"} // Use user's photoURL or fallback
//                     alt="User profile"
//                     width={32}
//                     height={32}
//                     className="rounded-full"
//                     onError={(e) => {
//                       e.currentTarget.src = "https://via.placeholder.com/32"; // Fallback to placeholder
//                     }}
//                   />
//                   <span>Profile</span>
//                 </HeadlessMenu.Button>
//                 <Transition
//                   enter="transition ease-out duration-100"
//                   enterFrom="transform opacity-0 scale-95"
//                   enterTo="transform opacity-100 scale-100"
//                   leave="transition ease-in duration-75"
//                   leaveFrom="transform opacity-100 scale-100"
//                   leaveTo="transform opacity-0 scale-95"
//                 >
//                   <HeadlessMenu.Items className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-900 dark:border-gray-700 rounded-md shadow-lg">
//                     <HeadlessMenu.Item>
//                       {({ active }) => (
//                         <Link
//                           href="/dashboard"
//                           className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                             active ? "bg-gray-100 dark:bg-gray-700" : ""
//                           }`}
//                         >
//                           Dashboard
//                         </Link>
//                       )}
//                     </HeadlessMenu.Item>
//                     <HeadlessMenu.Item>
//                       {({ active }) => (
//                         <button
//                           onClick={handleLogout}
//                           className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                             active ? "bg-gray-100 dark:bg-gray-700" : ""
//                           }`}
//                         >
//                           <LogOut size={16} />
//                           Logout
//                         </button>
//                       )}
//                     </HeadlessMenu.Item>
//                   </HeadlessMenu.Items>
//                 </Transition>
//               </HeadlessMenu>
//             )}
//             <button
//               className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-2"
//               onClick={toggleTheme}
//             >
//               {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//               <span>{theme === "light" ? "Dark" : "Light"}</span>
//             </button>
//           </div>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-6">
//           <Link href="/" className="text-sm text-black dark:text-white hover:underline">
//             Home
//           </Link>
//           <Link href="#categories" className="text-sm text-black dark:text-white hover:underline">
//             Categories
//           </Link>
//           <Link href="#about" className="text-sm text-black dark:text-white hover:underline">
//             About
//           </Link>
//           <Link href="/pyqs" className="text-sm text-black dark:text-white hover:underline">
//             PYQs
//           </Link>
//           <Link href="/leaderboard" className="text-sm text-black dark:text-white hover:underline">
//             Leaderboard
//           </Link>
//           {!isLoggedIn ? (
//             <Link
//               href="/login"
//               className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//             >
//               Login
//             </Link>
//           ) : (
//             <HeadlessMenu as="div" className="relative">
//               <HeadlessMenu.Button className="flex items-center gap-1">
//                 <Image
//                   src={user?.photoURL || "https://via.placeholder.com/32"} // Use user's photoURL or fallback
//                   alt="User profile"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://via.placeholder.com/32"; // Fallback to placeholder
//                   }}
//                 />
//               </HeadlessMenu.Button>
//               <Transition
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <Link
//                         href="/dashboard"
//                         className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         Dashboard
//                       </Link>
//                     )}
//                   </HeadlessMenu.Item>
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <button
//                         onClick={handleLogout}
//                         className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         <LogOut size={16} />
//                         Logout
//                       </button>
//                     )}
//                   </HeadlessMenu.Item>
//                 </HeadlessMenu.Items>
//               </Transition>
//             </HeadlessMenu>
//           )}
//           <button
//             className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
//             onClick={toggleTheme}
//           >
//             {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image"; // Explicit import
// import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
// import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
// import { signOut, onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../lib/firebase";

// export default function Navbar() {
//   const [theme, setTheme] = useState<"light" | "dark">("light");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   // Check user login status on mount
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setIsLoggedIn(!!currentUser);
//       setUser(currentUser); // Store the user object
//     });
//     return () => unsubscribe();
//   }, []);

//   // Load theme from localStorage on mount
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
//     if (storedTheme) {
//       setTheme(storedTheme);
//       document.documentElement.classList.add(storedTheme);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.toggle("dark");
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setIsLoggedIn(false);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 px-4 py-3 bg-white dark:bg-black border-b border-black dark:border-white">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         {/* Mobile View: Left Section - Dropdown Menu */}
//         <div className="md:hidden">
//           <HeadlessMenu as="div" className="relative">
//             <HeadlessMenu.Button className="text-black dark:text-white">
//               <Menu size={18} />
//             </HeadlessMenu.Button>
//             <Transition
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <HeadlessMenu.Items className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       Home
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/#categories"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       Categories
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/pyqs"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       PYQs
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/leaderboard"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       Leaderboard
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={toggleTheme}
//                       className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//                       {theme === "light" ? "Dark Mode" : "Light Mode"}
//                     </button>
//                   )}
//                 </HeadlessMenu.Item>
//               </HeadlessMenu.Items>
//             </Transition>
//           </HeadlessMenu>
//         </div>

//         {/* Center Section: Logo */}
//         <Link href="/" className="text-lg font-medium tracking-tight text-black dark:text-white">
//           EXAMREPO
//         </Link>

//         {/* Mobile View: Right Section - User Image/Login Button */}
//         <div className="flex items-center gap-2">
//           {!isLoggedIn ? (
//             <Link
//               href="/login"
//               className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black md:hidden"
//             >
//               Login
//             </Link>
//           ) : (
//             <HeadlessMenu as="div" className="relative">
//               <HeadlessMenu.Button className="flex items-center gap-1">
//                 <Image
//                   src={user?.photoURL || "https://via.placeholder.com/32"} // Use user's photoURL or fallback
//                   alt="User profile"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://via.placeholder.com/32"; // Fallback to placeholder
//                   }}
//                 />
//               </HeadlessMenu.Button>
//               <Transition
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <Link
//                         href="/dashboard"
//                         className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         Dashboard
//                       </Link>
//                     )}
//                   </HeadlessMenu.Item>
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <button
//                         onClick={handleLogout}
//                         className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         <LogOut size={16} />
//                         Logout
//                       </button>
//                     )}
//                   </HeadlessMenu.Item>
//                 </HeadlessMenu.Items>
//               </Transition>
//             </HeadlessMenu>
//           )}
//         </div>

//         {/* Desktop Menu (unchanged) */}
//         <div className="hidden md:flex items-center gap-6">
//           <Link href="/" className="text-sm text-black dark:text-white hover:underline">
//             Home
//           </Link>
//           <Link href="#categories" className="text-sm text-black dark:text-white hover:underline">
//             Categories
//           </Link>
//           <Link href="#about" className="text-sm text-black dark:text-white hover:underline">
//             About
//           </Link>
//           <Link href="/pyqs" className="text-sm text-black dark:text-white hover:underline">
//             PYQs
//           </Link>
//           <Link href="/leaderboard" className="text-sm text-black dark:text-white hover:underline">
//             Leaderboard
//           </Link>
//           {!isLoggedIn ? (
//             <Link
//               href="/login"
//               className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//             >
//               Login
//             </Link>
//           ) : (
//             <HeadlessMenu as="div" className="relative">
//               <HeadlessMenu.Button className="flex items-center gap-1">
//                 <Image
//                   src={user?.photoURL || "https://via.placeholder.com/32"} // Use user's photoURL or fallback
//                   alt="User profile"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://via.placeholder.com/32"; // Fallback to placeholder
//                   }}
//                 />
//               </HeadlessMenu.Button>
//               <Transition
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <Link
//                         href="/dashboard"
//                         className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         Dashboard
//                       </Link>
//                     )}
//                   </HeadlessMenu.Item>
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <button
//                         onClick={handleLogout}
//                         className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         <LogOut size={16} />
//                         Logout
//                       </button>
//                     )}
//                   </HeadlessMenu.Item>
//                 </HeadlessMenu.Items>
//               </Transition>
//             </HeadlessMenu>
//           )}
//           <button
//             className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
//             onClick={toggleTheme}
//           >
//             {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image"; // Explicit import
// import { Menu, Moon, Sun, LogOut } from "lucide-react"; // Removed X
// import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
// import { signOut, onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../lib/firebase";

// export default function Navbar() {
//   const [theme, setTheme] = useState<"light" | "dark">("light");
//   // Removed unused menuOpen state
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   // Check user login status on mount
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setIsLoggedIn(!!currentUser);
//       setUser(currentUser); // Store the user object
//     });
//     return () => unsubscribe();
//   }, []);

//   // Load theme from localStorage on mount
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
//     if (storedTheme) {
//       setTheme(storedTheme);
//       document.documentElement.classList.add(storedTheme);
//     } else {
//       // Optional: Set default theme class if nothing is stored
//       document.documentElement.classList.add("light");
//     }
//     // Add cleanup to remove class if component unmounts (though unlikely for Navbar)
//     // return () => {
//     //   document.documentElement.classList.remove('light', 'dark');
//     // };
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     // More robust class switching
//     if (newTheme === 'dark') {
//         document.documentElement.classList.add("dark");
//         document.documentElement.classList.remove("light"); // Ensure light is removed
//     } else {
//         document.documentElement.classList.add("light");
//         document.documentElement.classList.remove("dark"); // Ensure dark is removed
//     }
//     // Original toggle works too if only 'dark' class is used and absence means light
//     // document.documentElement.classList.toggle("dark");
//   };


//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setIsLoggedIn(false);
//       setUser(null); // Explicitly set user to null on logout
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 px-4 py-3 bg-white dark:bg-black border-b border-black dark:border-white">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         {/* Mobile View: Left Section - Dropdown Menu */}
//         <div className="md:hidden"> {/* This div hides the mobile menu button on md+ screens */}
//           <HeadlessMenu as="div" className="relative">
//             <HeadlessMenu.Button className="text-black dark:text-white">
//               <Menu size={18} />
//             </HeadlessMenu.Button>
//             <Transition
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <HeadlessMenu.Items className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       Home
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/#categories"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       Categories
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 {/* Added About Link */}
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/#about"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       About
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/pyqs"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       PYQs
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <HeadlessMenu.Item>
//                   {({ active }) => (
//                     <Link
//                       href="/leaderboard"
//                       className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                         active ? "bg-gray-100 dark:bg-gray-700" : ""
//                       }`}
//                     >
//                       Leaderboard
//                     </Link>
//                   )}
//                 </HeadlessMenu.Item>
//                 <div className="py-1"> {/* Separator is often good practice */}
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <button
//                         onClick={toggleTheme}
//                         className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//                         {theme === "light" ? "Dark Mode" : "Light Mode"}
//                       </button>
//                     )}
//                   </HeadlessMenu.Item>
//                 </div>
//               </HeadlessMenu.Items>
//             </Transition>
//           </HeadlessMenu>
//         </div>

//         {/* Center Section: Logo */}
//         <div className="flex-1 flex justify-center md:flex-none md:justify-start"> {/* Ensure logo is centered on mobile when menu icon takes space */}
//           <Link href="/" className="text-lg font-medium tracking-tight text-black dark:text-white">
//             EXAMREPO
//           </Link>
//         </div>


//         {/* Right Section: Desktop Menu & Mobile User/Login */}
//         <div className="flex items-center gap-2">
//             {/* Mobile View: Right Section - User Image/Login Button */}
//             <div className="flex items-center md:hidden"> {/* This div hides the mobile user/login controls on md+ screens */}
//                 {!isLoggedIn ? (
//                     <Link
//                     href="/login"
//                     className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//                     // md:hidden here is correct - it hides this specific button on larger screens
//                     // but the parent div makes sure it's only considered on mobile anyway.
//                     >
//                     Login
//                     </Link>
//                 ) : (
//                     <HeadlessMenu as="div" className="relative">
//                     <HeadlessMenu.Button className="flex items-center gap-1">
//                         <Image
//                         src={user?.photoURL || "https://via.placeholder.com/32"} // Use user's photoURL or fallback
//                         alt="User profile"
//                         width={32}
//                         height={32}
//                         className="rounded-full"
//                         onError={(e) => {
//                             e.currentTarget.src = "https://via.placeholder.com/32"; // Fallback to placeholder
//                         }}
//                         />
//                     </HeadlessMenu.Button>
//                     <Transition
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                     >
//                         <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                         <HeadlessMenu.Item>
//                             {({ active }) => (
//                             <Link
//                                 href="/dashboard"
//                                 className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                                 active ? "bg-gray-100 dark:bg-gray-700" : ""
//                                 }`}
//                             >
//                                 Dashboard
//                             </Link>
//                             )}
//                         </HeadlessMenu.Item>
//                         <HeadlessMenu.Item>
//                             {({ active }) => (
//                             <button
//                                 onClick={handleLogout}
//                                 className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                                 active ? "bg-gray-100 dark:bg-gray-700" : ""
//                                 }`}
//                             >
//                                 <LogOut size={16} />
//                                 Logout
//                             </button>
//                             )}
//                         </HeadlessMenu.Item>
//                         </HeadlessMenu.Items>
//                     </Transition>
//                     </HeadlessMenu>
//                 )}
//             </div>

//             {/* Desktop Menu (Links, Login/User, Theme) */}
//             <div className="hidden md:flex items-center gap-6">
//                 <Link href="/" className="text-sm text-black dark:text-white hover:underline">
//                     Home
//                 </Link>
//                 <Link href="/#categories" className="text-sm text-black dark:text-white hover:underline">
//                     Categories
//                 </Link>
//                 <Link href="/#about" className="text-sm text-black dark:text-white hover:underline">
//                     About
//                 </Link>
//                 <Link href="/pyqs" className="text-sm text-black dark:text-white hover:underline">
//                     PYQs
//                 </Link>
//                 <Link href="/leaderboard" className="text-sm text-black dark:text-white hover:underline">
//                     Leaderboard
//                 </Link>
//                 {!isLoggedIn ? (
//                 <Link
//                     href="/login"
//                     className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//                 >
//                     Login
//                 </Link>
//                 ) : (
//                     <HeadlessMenu as="div" className="relative">
//                     <HeadlessMenu.Button className="flex items-center gap-1">
//                         <Image
//                         src={user?.photoURL || "https://via.placeholder.com/32"} // Use user's photoURL or fallback
//                         alt="User profile"
//                         width={32}
//                         height={32}
//                         className="rounded-full"
//                         onError={(e) => {
//                             e.currentTarget.src = "https://via.placeholder.com/32"; // Fallback to placeholder
//                         }}
//                         />
//                     </HeadlessMenu.Button>
//                     <Transition
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                     >
//                         <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                         <HeadlessMenu.Item>
//                             {({ active }) => (
//                             <Link
//                                 href="/dashboard"
//                                 className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                                 active ? "bg-gray-100 dark:bg-gray-700" : ""
//                                 }`}
//                             >
//                                 Dashboard
//                             </Link>
//                             )}
//                         </HeadlessMenu.Item>
//                         <HeadlessMenu.Item>
//                             {({ active }) => (
//                             <button
//                                 onClick={handleLogout}
//                                 className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                                 active ? "bg-gray-100 dark:bg-gray-700" : ""
//                                 }`}
//                             >
//                                 <LogOut size={16} />
//                                 Logout
//                             </button>
//                             )}
//                         </HeadlessMenu.Item>
//                         </HeadlessMenu.Items>
//                     </Transition>
//                     </HeadlessMenu>
//                 )}
//                 <button
//                 className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
//                 onClick={toggleTheme}
//                 aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} // Added aria-label
//                 >
//                 {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//                 </button>
//             </div>
//         </div>
//       </div>
//     </nav>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Menu, X, Moon, Sun, LogOut } from "lucide-react"; // Added X back
// import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
// import { signOut, onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../lib/firebase";

// export default function Navbar() {
//   const [theme, setTheme] = useState<"light" | "dark">("light");
//   const [menuOpen, setMenuOpen] = useState(false); // Re-added menuOpen state
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   // Check user login status on mount
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setIsLoggedIn(!!currentUser);
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Load theme from localStorage on mount
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
//     if (storedTheme) {
//       setTheme(storedTheme);
//       document.documentElement.classList.add(storedTheme);
//     } else {
//       document.documentElement.classList.add("light");
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
    
//     if (newTheme === 'dark') {
//         document.documentElement.classList.add("dark");
//         document.documentElement.classList.remove("light");
//     } else {
//         document.documentElement.classList.add("light");
//         document.documentElement.classList.remove("dark");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setIsLoggedIn(false);
//       setUser(null);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 px-4 py-3 bg-white dark:bg-black border-b border-black dark:border-white">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/" className="text-lg font-medium tracking-tight text-black dark:text-white">
//           EXAMREPO
//         </Link>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden flex items-center gap-2">
//           <button
//             className="text-black dark:text-white"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label={menuOpen ? "Close menu" : "Open menu"}
//           >
//             {menuOpen ? <X size={18} /> : <Menu size={18} />}
//           </button>
          
//           {/* Mobile User/Login Control - Moved next to hamburger menu */}
//           {!isLoggedIn ? (
//             <Link
//               href="/login"
//               className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//             >
//               Login
//             </Link>
//           ) : (
//             <HeadlessMenu as="div" className="relative">
//               <HeadlessMenu.Button className="flex items-center gap-1">
//                 <Image
//                   src={user?.photoURL || "https://via.placeholder.com/32"}
//                   alt="User profile"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://via.placeholder.com/32";
//                   }}
//                 />
//               </HeadlessMenu.Button>
//               <Transition
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <Link
//                         href="/dashboard"
//                         className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         Dashboard
//                       </Link>
//                     )}
//                   </HeadlessMenu.Item>
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <button
//                         onClick={handleLogout}
//                         className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         <LogOut size={16} />
//                         Logout
//                       </button>
//                     )}
//                   </HeadlessMenu.Item>
//                 </HeadlessMenu.Items>
//               </Transition>
//             </HeadlessMenu>
//           )}
//         </div>

//         {/* Full-width Mobile Menu (from first version) */}
//         <div
//           className={`absolute top-full left-0 w-full bg-white dark:bg-black border-b border-black dark:border-white md:hidden transition-all duration-200 ease-in-out ${
//             menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
//           }`}
//         >
//           <div className="flex flex-col py-2">
//             <Link href="/" 
//                   className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
//                   onClick={() => setMenuOpen(false)}>
//               Home
//             </Link>
//             <Link href="/#categories" 
//                   className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
//                   onClick={() => setMenuOpen(false)}>
//               Categories
//             </Link>
//             <Link href="/#about" 
//                   className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
//                   onClick={() => setMenuOpen(false)}>
//               About
//             </Link>
//             <Link href="/pyqs" 
//                   className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
//                   onClick={() => setMenuOpen(false)}>
//               PYQs
//             </Link>
//             <Link href="/leaderboard" 
//                   className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
//                   onClick={() => setMenuOpen(false)}>
//               Leaderboard
//             </Link>
//             <button
//               className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-2"
//               onClick={() => {
//                 toggleTheme();
//                 setMenuOpen(false);
//               }}
//             >
//               {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//               <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
//             </button>
//           </div>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-6">
//           <Link href="/" className="text-sm text-black dark:text-white hover:underline">
//             Home
//           </Link>
//           <Link href="/#categories" className="text-sm text-black dark:text-white hover:underline">
//             Categories
//           </Link>
//           <Link href="/#about" className="text-sm text-black dark:text-white hover:underline">
//             About
//           </Link>
//           <Link href="/pyqs" className="text-sm text-black dark:text-white hover:underline">
//             PYQs
//           </Link>
//           <Link href="/leaderboard" className="text-sm text-black dark:text-white hover:underline">
//             Leaderboard
//           </Link>
//           {!isLoggedIn ? (
//             <Link
//               href="/login"
//               className="text-sm text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//             >
//               Login
//             </Link>
//           ) : (
//             <HeadlessMenu as="div" className="relative">
//               <HeadlessMenu.Button className="flex items-center gap-1">
//                 <Image
//                   src={user?.photoURL || "https://via.placeholder.com/32"}
//                   alt="User profile"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://via.placeholder.com/32";
//                   }}
//                 />
//               </HeadlessMenu.Button>
//               <Transition
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <Link
//                         href="/dashboard"
//                         className={`block px-4 py-2 text-sm text-black dark:text-white ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         Dashboard
//                       </Link>
//                     )}
//                   </HeadlessMenu.Item>
//                   <HeadlessMenu.Item>
//                     {({ active }) => (
//                       <button
//                         onClick={handleLogout}
//                         className={`block w-full text-left px-4 py-2 text-sm text-black dark:text-white flex items-center gap-2 ${
//                           active ? "bg-gray-100 dark:bg-gray-700" : ""
//                         }`}
//                       >
//                         <LogOut size={16} />
//                         Logout
//                       </button>
//                     )}
//                   </HeadlessMenu.Item>
//                 </HeadlessMenu.Items>
//               </Transition>
//             </HeadlessMenu>
//           )}
//           <button
//             className="text-sm text-black dark:text-white hover:underline flex items-center gap-1"
//             onClick={toggleTheme}
//             aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
//           >
//             {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }






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