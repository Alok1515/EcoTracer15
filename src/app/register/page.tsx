"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, User, Mail, Lock, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call to backend
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const error = await response.text();
        alert(error || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-emerald-50 dark:bg-zinc-900 dark:border-zinc-800"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
            <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Already have one?{" "}
            <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              Log in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                className="block w-full rounded-xl border-0 py-2.5 pl-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="block w-full rounded-xl border-0 py-2.5 pl-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                className="block w-full rounded-xl border-0 py-2.5 pl-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
