"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Leaf, 
  BarChart3, 
  Car, 
  Zap, 
  Utensils, 
  Globe 
} from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative isolate flex flex-col items-center">
      {/* Background Decor */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-cyan-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold leading-6 text-emerald-600 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/20 dark:text-emerald-400">
              Track your impact, save the planet.
            </div>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl"
          >
            Measure Your <span className="text-emerald-600 dark:text-emerald-400">Carbon Footprint</span> with Ease
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            EcoTrace helps you track daily activities like travel, energy usage, and food consumption to calculate your personal CO2 emissions. Join us in making the world greener, one step at a time.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Start Tracking Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl mb-24 w-[calc(100%-2rem)]">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Travel Tracking",
              desc: "Log your daily commutes via car, bus, or plane to see their carbon cost.",
              icon: Car,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              title: "Energy Usage",
              desc: "Track your electricity and heating consumption with smart conversion factors.",
              icon: Zap,
              color: "text-yellow-500",
              bg: "bg-yellow-50 dark:bg-yellow-500/10",
            },
            {
              title: "Food Consumption",
              desc: "See how your dietary choices impact the environment from meat to plant-based.",
              icon: Utensils,
              color: "text-orange-500",
              bg: "bg-orange-50 dark:bg-orange-500/10",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col items-start p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"
            >
              <div className={`p-3 rounded-xl mb-4 ${feature.bg}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Preview */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-900 px-6 py-20 shadow-2xl sm:px-12 sm:py-32">
          <Globe className="absolute -right-20 -top-20 h-96 w-96 text-emerald-800/50 opacity-20" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Visualize Your Progress
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-emerald-100">
              Our intuitive dashboard gives you a clear breakdown of your emissions over time, helping you identify where to make the biggest impact.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white">45%</span>
                <span className="text-emerald-200 text-sm">Avg. Reduction</span>
              </div>
              <div className="h-10 w-px bg-emerald-700" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white">10k+</span>
                <span className="text-emerald-200 text-sm">Active Users</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
