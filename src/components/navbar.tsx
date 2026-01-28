"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, LogIn, UserPlus, LogOut, LayoutDashboard, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(JSON.parse(user).username);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md dark:border-emerald-900/20 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -20, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Leaf className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            EcoTrace
          </span>
        </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  pathname.startsWith("/dashboard") ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 md:inline">
                  {username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                <UserPlus className="h-4 w-4" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
