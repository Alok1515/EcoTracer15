"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Leaf, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LeaderboardEntry {
  name: string;
  netEmission: number;
  rank: number;
  streakCount: number;
  treesPlanted: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/emission/leaderboard", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-amber-500 fill-amber-500/20" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-zinc-300 fill-zinc-300/20" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700 fill-amber-700/20" />;
    return <span className="text-zinc-500 font-bold w-6 text-center">#{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-500 text-sm">Calculating rankings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Global Leaderboard</h2>
          <p className="text-sm text-zinc-500">Ranking by lowest net carbon emission</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-emerald-500">{leaderboard.length} Active Users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/40 transition-all ${entry.rank === 1 ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-10 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden">
                      <User className="w-6 h-6 text-zinc-400" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {entry.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                          <span className="text-xs text-orange-500 font-bold">{entry.streakCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-500 font-bold">{entry.treesPlanted} trees</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xl font-black ${entry.netEmission <= 0 ? 'text-emerald-500' : 'text-white'}`}>
                      {entry.netEmission.toFixed(1)} <span className="text-[10px] uppercase tracking-wider text-zinc-500 ml-1">kg</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mt-1">
                      Net Emission
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {leaderboard.length === 0 && (
          <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
            <User className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-500">No active users yet</h3>
            <p className="text-sm text-zinc-600">Be the first to log an activity!</p>
          </div>
        )}
      </div>
    </div>
  );
}
