"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  Car, 
  Utensils, 
  Plus, 
  Calendar,
  ChevronRight,
  Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_CHART_DATA = [
  { name: "Mon", value: 12.5 },
  { name: "Tue", value: 15.2 },
  { name: "Wed", value: 10.8 },
  { name: "Thu", value: 18.4 },
  { name: "Fri", value: 14.1 },
  { name: "Sat", value: 8.9 },
  { name: "Sun", value: 7.5 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ today: 0, monthly: 0 });
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const headers = { "Authorization": `Bearer ${token}` };
        
        // Fetch Today's Emission
        const todayRes = await fetch("http://localhost:8080/api/emission/today", { headers });
        const todayData = await todayRes.json();
        
        // Fetch Monthly Emission
        const monthlyRes = await fetch("http://localhost:8080/api/emission/monthly", { headers });
        const monthlyData = await monthlyRes.json();
        
        // Fetch Recent Activities
        const activitiesRes = await fetch("http://localhost:8080/api/activity/user", { headers });
        const activitiesData = await activitiesRes.json();

        setStats({ today: todayData, monthly: monthlyData });
        setActivities(activitiesData.slice(0, 5)); // Show last 5
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {user?.name || "User"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-zinc-500 dark:text-zinc-400">Track your environmental impact in real-time.</p>
            {user?.userType && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 capitalize">
                {user.userType.toLowerCase()} Account
              </Badge>
            )}
          </div>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/add")}
          className="rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Log Activity
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { 
            title: "Today's Emission", 
            value: `${stats.today.toFixed(1)} kg`, 
            desc: "CO2 Equivalent", 
            icon: Leaf,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-950/30"
          },
          { 
            title: "Monthly Total", 
            value: `${stats.monthly.toFixed(1)} kg`, 
            desc: "Current Month", 
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950/30"
          },
          { 
            title: "Average Daily", 
            value: "12.4 kg", 
            desc: "-2.4% from last week", 
            icon: TrendingDown,
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-950/30"
          },
          { 
            title: "Global Rank", 
            value: "Top 15%", 
            desc: "Among active users", 
            icon: Globe,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-950/30"
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-emerald-50 dark:border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {i === 2 && <Badge variant="outline" className="text-emerald-600 border-emerald-200">Efficient</Badge>}
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border-emerald-50 dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Emission Trends</CardTitle>
            <CardDescription>Daily CO2 output for the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-emerald-50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Impact</CardTitle>
              <CardDescription>Your latest tracked activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-emerald-600">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.length > 0 ? activities.map((activity: any, i) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    activity.category === 'TRAVEL' ? 'bg-blue-50 text-blue-600' :
                    activity.category === 'ELECTRICITY' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {activity.category === 'TRAVEL' ? <Car className="h-4 w-4" /> :
                     activity.category === 'ELECTRICITY' ? <Zap className="h-4 w-4" /> :
                     <Utensils className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{activity.description}</p>
                    <p className="text-xs text-zinc-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {activity.co2Emission.toFixed(1)}kg
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <Leaf className="h-12 w-12 text-emerald-100 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No activities logged yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Globe = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);
