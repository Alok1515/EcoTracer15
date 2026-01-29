"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Leaf, 
  TrendingDown, 
  Zap, 
  Car, 
  Utensils, 
  Loader2,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Insight {
  title: string;
  description: string;
  impact: string;
  category: string;
}

interface InsightsData {
  summary: string;
  insights: Insight[];
  recommendation: string;
}

interface InsightsProps {
  stats: any;
  activities: any[];
  user: any;
}

export function Insights({ stats, activities, user }: InsightsProps) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateInsights();
  }, [user?.name, stats.total, activities.length]);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats, activities, user }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error("Insights error:", err);
      setError(err.message || "Failed to load insights");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("travel") || cat.includes("car") || cat.includes("transport")) return Car;
    if (cat.includes("food") || cat.includes("diet")) return Utensils;
    if (cat.includes("energy") || cat.includes("electricity") || cat.includes("power")) return Zap;
    return Leaf;
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2rem] overflow-hidden border">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-emerald-500 animate-pulse" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute -inset-2 border-2 border-dashed border-emerald-500/20 rounded-[2rem] -z-10"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Generating Personalized Insights</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Our AI is analyzing your carbon footprint data to provide actionable reduction tips.
            </p>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing activities...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2rem] overflow-hidden border">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Couldn't Generate Insights</h3>
            <p className="text-zinc-500 text-sm">{error}</p>
          </div>
          <Button onClick={generateInsights} variant="outline" className="border-zinc-800 hover:bg-zinc-800">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-24 h-24 text-emerald-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Sustainability Report</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Your Carbon Footprint Analysis</h2>
            <p className="text-zinc-400 leading-relaxed">
              {data?.summary}
            </p>
          </div>
          
          <div className="flex-shrink-0 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex flex-col items-center text-center min-w-[200px]">
            <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider mb-1">Impact Level</span>
            <span className="text-3xl font-black text-white">Medium</span>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-8 h-1.5 rounded-full ${i <= 3 ? "bg-emerald-500" : "bg-zinc-800"}`} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.insights.map((insight, index) => {
          const Icon = getCategoryIcon(insight.category);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-zinc-900/40 border-zinc-800 h-full hover:bg-zinc-900/60 transition-all border group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      insight.impact === "High" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                      insight.impact === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}>
                      {insight.impact} Impact
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                    {insight.description}
                  </p>
                  
                  <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{insight.category}</span>
                    <button className="text-emerald-500 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                      Learn how <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation Action Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shrink-0">
            <TrendingDown className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Next Week's Goal</div>
            <h3 className="text-xl font-black text-black">{data?.recommendation}</h3>
            <p className="text-zinc-600 text-sm">Follow this key recommendation to see a significant drop in your emissions.</p>
          </div>
        </div>
        
        <Button className="bg-black hover:bg-zinc-800 text-white rounded-xl h-14 px-8 font-bold whitespace-nowrap">
          Set as Goal
        </Button>
      </motion.div>

      {/* Info Box */}
      <div className="flex items-start gap-4 p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
        <Info className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          These insights are generated by analyzing your recent activity history, category distribution, and community averages. 
          The more activities you log, the more precise and helpful these recommendations become.
        </p>
      </div>
    </div>
  );
}
