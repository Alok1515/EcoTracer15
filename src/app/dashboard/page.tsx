"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Camera, 
  Package, 
  Car, 
  Zap, 
  Flame, 
  Plane, 
  Utensils, 
  User, 
  Users, 
  Trophy, 
  Sparkles,
  Info,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  X,
  Calendar,
  Plus,
  MessageSquare
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AIAssistant } from "@/components/AIAssistant";
import { Leaderboard } from "@/components/Leaderboard";
import { Insights } from "@/components/Insights";
import { Settings as SettingsComponent } from "@/components/Settings";

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("Overview");
  const [stats, setStats] = useState({ 
    today: 0, 
    total: 0, 
    monthlyChange: 0, 
    rank: 11, 
    treesNeeded: 0, 
    treesPlanted: 0,
    totalPositiveEmissions: 0,
    netBalance: 0,
    average: 19.8, 
    top: 1.3,
    streakCount: 0,
    categoryEmissions: {} as Record<string, number>,
    timelineData: [] as any[]
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("Transportation");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [vehicleType, setVehicleType] = useState("gasoline");
  const [electricitySource, setElectricitySource] = useState("grid");
    const [heatingFuel, setHeatingFuel] = useState("gas");
    const [flightClass, setFlightClass] = useState("short_economy");
    const [foodType, setFoodType] = useState("meat");
  const [precisionMode, setPrecisionMode] = useState(true);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [modalStreakCount, setModalStreakCount] = useState(0);

  // Tree Planting State
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [treeCount, setTreeCount] = useState("");
  const [treeDate, setTreeDate] = useState(new Date().toISOString().split('T')[0]);
  const [treeNote, setTreeNote] = useState("");
  const [isLoggingTrees, setIsLoggingTrees] = useState(false);

  const formatValue = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + " B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + " M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + " k";
    }
    return num.toFixed(1);
  };

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

    fetchData();
  }, [router]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      };
      console.log("Fetching stats...");
      const res = await fetch("http://localhost:8080/api/emission/stats", { headers });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Stats received:", data);
      
      setStats({
        today: data.todayEmissions ?? 0,
        total: data.totalEmissions ?? 0,
        monthlyChange: data.monthlyChange ?? 0,
        rank: data.userRank ?? 1,
        treesNeeded: data.treesNeeded ?? 0,
        treesPlanted: data.treesPlanted ?? 0,
        totalPositiveEmissions: data.totalPositiveEmissions ?? 0,
        netBalance: data.netBalance ?? 0,
        average: data.communityAverage ?? 19.8,
        top: 1.3,
        streakCount: data.streakCount ?? 0,
        categoryEmissions: data.categoryEmissions ?? {},
        timelineData: data.timelineData ?? []
      });

      // Fetch activities for history
      const activitiesRes = await fetch("http://localhost:8080/api/activity/user", { headers });
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUnit = () => {
    switch (activeCategory) {
      case "Transportation":
      case "Flights":
        return "km";
      case "Electricity":
      case "Heating":
        return "kWh";
      case "Food":
        return "meals";
      default:
        return "units";
    }
  };

  const getEmissionDetails = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val)) return null;

    const factors: Record<string, any> = {
      "Transportation": {
        "gasoline": 0.21,
        "diesel": 0.19,
        "electric": 0.05,
        "hybrid": 0.12,
        "bus": 0.08,
        "train": 0.04,
        "subway": 0.03,
        "motorcycle": 0.11
      },
      "Electricity": {
        "grid": 0.82,
        "solar": 0.05,
        "wind": 0.02,
        "hydro": 0.03,
        "biomass": 0.08,
        "nuclear": 0.01
      },
      "Heating": {
        "gas": 0.18,
        "oil": 0.25,
        "electric": 0.45,
        "wood": 0.02,
        "heatpump": 0.12,
        "coal": 0.35
      },
      "Flights": {
        "short_economy": 0.15,
        "short_business": 0.25,
        "long_economy": 0.12,
        "long_business": 0.35,
        "long_first": 0.45
      },
      "Food": {
        "meat": 2.5,
        "vegetarian": 1.2,
        "vegan": 0.8,
        "beef": 6.1,
        "seafood": 1.8,
        "chicken": 6.1
      }
    };

    const categoryFactors = factors[activeCategory] || {};
    let factor = 0;
    
    switch (activeCategory) {
      case "Transportation": factor = categoryFactors[vehicleType] || 0.21; break;
      case "Electricity": factor = categoryFactors[electricitySource] || 0.82; break;
      case "Heating": factor = categoryFactors[heatingFuel] || 0.18; break;
      case "Flights": factor = categoryFactors[flightClass] || 0.15; break;
      case "Food": factor = categoryFactors[foodType] || 2.5; break;
      default: factor = 0;
    }

    const total = val * factor;
    return {
      total,
      factor: `${factor} kg CO2e per ${getUnit() === 'meals' ? 'meal' : getUnit()}`,
      calculation: `${val} ${getUnit()} × ${factor} = ${total.toFixed(2)} kg CO2e`,
      source: "IPCC, EPA, DEFRA standards",
      precision: precisionMode ? "98%" : "85%"
    };
  };

  const handleAddEmission = async () => {
    if (!amount) return;
    await processAddEmission();
  };

  const processAddEmission = async () => {
    setIsLogging(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    const categoryMap: Record<string, string> = {
      "Transportation": "TRAVEL",
      "Electricity": "ELECTRICITY",
      "Heating": "HEATING",
      "Flights": "FLIGHTS",
      "Food": "FOOD"
    };

    let description = "";
    switch (activeCategory) {
      case "Transportation": description = `Vehicle: ${vehicleType}`; break;
      case "Electricity": description = `Source: ${electricitySource}`; break;
      case "Heating": description = `Fuel: ${heatingFuel}`; break;
      case "Flights": description = `Class: ${flightClass}`; break;
      case "Food": description = `Diet: ${foodType}`; break;
      default: description = activeCategory;
    }

    try {
      const response = await fetch("http://localhost:8080/api/activity/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type: categoryMap[activeCategory] || "TRAVEL",
          description: description,
          value: parseFloat(amount),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setAmount("");
        await fetchData();
        
        if (data.firstToday) {
          setModalStreakCount(data.streakCount);
          setShowStreakModal(true);
        }

        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to log activity", err);
    } finally {
      setIsLogging(false);
    }
  };

  const handleTreeLog = async () => {
    if (!treeCount || isNaN(parseInt(treeCount))) return;
    setIsLoggingTrees(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/activity/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "TREE_PLANTING",
          description: treeNote || "Planted trees",
          value: parseFloat(treeCount),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTreeCount("");
        setTreeNote("");
        setShowTreeModal(false);
        await fetchData();
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to log tree planting", err);
    } finally {
      setIsLoggingTrees(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground/80 p-6 font-sans">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-card/50 border border-border rounded-2xl p-1 flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1">
            {["Overview", "Leaderboard", "Insights", "AI Assistant", "Product LCA", "Settings"].map((view) => (
              <button 
                key={view}
                onClick={() => {
                  if (view === "Product LCA") {
                    router.push("/dashboard/lca");
                  } else {
                    setActiveView(view);
                  }
                }}
                className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${
                  activeView === view 
                    ? "bg-accent text-foreground" 
                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          
          <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-2 mr-1">
            <span className="text-orange-500 font-bold text-sm">{stats.streakCount}</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-[10px] text-orange-500/70 font-bold uppercase tracking-wider">Streak</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === "Overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card/40 border-border rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Net Emissions Balance</span>
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17.5c0 2.5 2 4.5 5 4.5s5-2 5-4.5c0-3-2.5-5-5-8-2.5 3-5 5-5 8z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{formatValue(stats.netBalance)} kg</div>
                  <div className="text-xs text-muted-foreground/60">After {(stats.treesPlanted * 21).toFixed(1)} kg offset</div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-border rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Lifetime Emissions</span>
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <span className="text-muted-foreground text-lg">+</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{formatValue(stats.total)} kg</div>
                  <div className="text-xs text-muted-foreground/60">Lifetime logged CO2</div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-border rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Monthly Change</span>
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <svg className={`w-4 h-4 ${stats.monthlyChange > 0 ? 'text-red-500' : 'text-emerald-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {stats.monthlyChange > 0 
                          ? <path d="M7 17l5-5 5 5M7 7l5 5 5-5"/>
                          : <path d="M7 7l5 5 5-5M7 17l5-5 5 5"/>
                        }
                      </svg>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${stats.monthlyChange > 0 ? 'text-red-500' : 'text-emerald-500'} mb-1`}>
                    {stats.monthlyChange > 0 ? '+' : ''}{stats.monthlyChange.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground/60">vs last month</div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-border rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Your Rank</span>
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">#{stats.rank}</div>
                  <div className="text-xs text-muted-foreground/60">on leaderboard</div>
                </CardContent>
              </Card>

              <Card 
                className="bg-card/40 border-border rounded-2xl md:col-span-1 cursor-pointer hover:bg-accent/40 transition-all group"
                onClick={() => setShowTreeModal(true)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Trees Needed</span>
                    <div className="w-8 h-8 rounded-lg bg-accent group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stats.treesNeeded}</div>
                  <div className="text-xs text-muted-foreground/60">to offset total impact</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Entry Section */}
              <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden relative">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-1">Quick Entry</h2>
                    <p className="text-sm text-muted-foreground">Log your carbon emissions</p>
                  </div>

                  <Tabs defaultValue="manual" className="w-full mb-8">
                    <TabsList className="bg-muted/50 border border-border p-1 rounded-xl w-full h-12">
                      <TabsTrigger value="manual" className="flex-1 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-foreground">
                        <Settings className="w-4 h-4 mr-2" /> Manual
                      </TabsTrigger>
                      <TabsTrigger value="image" className="flex-1 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-foreground">
                        <Camera className="w-4 h-4 mr-2" /> Image
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="manual" className="mt-6 space-y-8">
                      <div className="flex items-center justify-between bg-muted/30 border border-border/50 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent rounded-lg">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">Precision Mode</div>
                            <div className="text-xs text-muted-foreground">{precisionMode ? "Recommended" : "Basic"}</div>
                          </div>
                        </div>
                        <Switch checked={precisionMode} onCheckedChange={setPrecisionMode} />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Activity Category</label>
                        <div className="grid grid-cols-5 gap-3">
                          {[
                            { name: "Transportation", icon: Car },
                            { name: "Electricity", icon: Zap },
                            { name: "Heating", icon: Flame },
                            { name: "Flights", icon: Plane },
                            { name: "Food", icon: Utensils }
                          ].map((cat) => (
                            <button 
                              key={cat.name}
                              onClick={() => setActiveCategory(cat.name)}
                              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                activeCategory === cat.name 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "bg-muted/50 border-border text-muted-foreground hover:border-accent-foreground/20"
                              }`}
                            >
                              <cat.icon className="w-5 h-5" />
                              <span className="text-[10px] font-medium">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {activeCategory === "Transportation" && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Vehicle Type</Label>
                            <Select value={vehicleType} onValueChange={setVehicleType}>
                              <SelectTrigger className="bg-muted/50 border-border h-12 rounded-xl text-foreground focus:ring-0">
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="gasoline">Car (Gasoline)</SelectItem>
                                <SelectItem value="diesel">Car (Diesel)</SelectItem>
                                <SelectItem value="electric">Car (Electric)</SelectItem>
                                <SelectItem value="hybrid">Car (Hybrid)</SelectItem>
                                <SelectItem value="bus">Public Bus</SelectItem>
                                <SelectItem value="train">Train (Intercity)</SelectItem>
                                <SelectItem value="subway">Subway/Metro</SelectItem>
                                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {activeCategory === "Electricity" && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Energy Source</Label>
                            <Select value={electricitySource} onValueChange={setElectricitySource}>
                              <SelectTrigger className="bg-muted/50 border-border h-12 rounded-xl text-foreground focus:ring-0">
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="grid">Power Grid</SelectItem>
                                <SelectItem value="solar">Solar Panels</SelectItem>
                                <SelectItem value="wind">Wind Energy</SelectItem>
                                <SelectItem value="hydro">Hydroelectric</SelectItem>
                                <SelectItem value="biomass">Biomass</SelectItem>
                                <SelectItem value="nuclear">Nuclear</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {activeCategory === "Heating" && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Heating Fuel</Label>
                            <Select value={heatingFuel} onValueChange={setHeatingFuel}>
                              <SelectTrigger className="bg-muted/50 border-border h-12 rounded-xl text-foreground focus:ring-0">
                                <SelectValue placeholder="Select fuel" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="gas">Natural Gas</SelectItem>
                                <SelectItem value="oil">Heating Oil</SelectItem>
                                <SelectItem value="electric">Electric Heat</SelectItem>
                                <SelectItem value="wood">Wood/Pellets</SelectItem>
                                <SelectItem value="heatpump">Heat Pump</SelectItem>
                                <SelectItem value="coal">Coal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {activeCategory === "Flights" && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Flight Class</Label>
                            <Select value={flightClass} onValueChange={setFlightClass}>
                              <SelectTrigger className="bg-muted/50 border-border h-12 rounded-xl text-foreground focus:ring-0">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="short_economy">Short Haul (Economy)</SelectItem>
                                <SelectItem value="short_business">Short Haul (Business)</SelectItem>
                                <SelectItem value="long_economy">Long Haul (Economy)</SelectItem>
                                <SelectItem value="long_business">Long Haul (Business)</SelectItem>
                                <SelectItem value="long_first">Long Haul (First Class)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {activeCategory === "Food" && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Diet Type</Label>
                            <Select value={foodType} onValueChange={setFoodType}>
                              <SelectTrigger className="bg-muted/50 border-border h-12 rounded-xl text-foreground focus:ring-0">
                                <SelectValue placeholder="Select diet" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="meat">Average Meat Eater</SelectItem>
                                <SelectItem value="beef">High Beef Consumption</SelectItem>
                                <SelectItem value="chicken">Poultry/Chicken</SelectItem>
                                <SelectItem value="seafood">Seafood/Fish</SelectItem>
                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Value</Label>
                          <div className="relative">
                            <Input 
                              placeholder="Enter value" 
                              type="number"
                              value={amount}
                              onChange={(e) => {
                                setAmount(e.target.value);
                                setIsProductMode(false);
                              }}
                              className="bg-muted/50 border-border h-12 rounded-xl pr-16 text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:border-accent"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{getUnit()}</div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {getEmissionDetails() && !isProductMode && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-6 bg-muted/30 border border-border rounded-2xl space-y-4"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-semibold text-foreground">Estimated Emissions</span>
                              </div>
                              
                              <div className="text-3xl font-bold text-foreground">
                                {getEmissionDetails()?.total.toFixed(2)} kg CO2e
                              </div>

                              <div className="space-y-2 pt-2 border-t border-border">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">Emission Factor:</span>
                                  <span className="text-foreground/80">{getEmissionDetails()?.factor}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">Calculation:</span>
                                  <span className="text-foreground/80">{getEmissionDetails()?.calculation}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">Source:</span>
                                  <span className="text-foreground/80">{getEmissionDetails()?.source}</span>
                                </div>
                              </div>

                              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3">
                                <Info className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-emerald-500">High Precision</div>
                                  <p className="text-[11px] text-emerald-500/80 leading-relaxed">
                                    Using industry-standard emission factors from IPCC (Intergovernmental Panel on Climate Change), EPA (Environmental Protection Agency), and DEFRA (Department for Environment, Food & Rural Affairs) guidelines
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Button 
                        onClick={() => handleAddEmission(false)}
                        disabled={isLogging || !amount}
                        className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-xl text-base transition-all disabled:opacity-50"
                      >
                        {isLogging ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Emission"}
                      </Button>
                    </TabsContent>

                    <TabsContent value="image" className="mt-6">
                      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-muted/30">
                        <Camera className="w-12 h-12 text-muted-foreground/60 mb-4" />
                        <p className="text-muted-foreground text-sm text-center mb-6">Scan your receipts or product labels to automatically log emissions</p>
                        <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-accent">
                          Coming Soon
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <AnimatePresence>
                    {isSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-x-8 bottom-8 flex items-center justify-center bg-emerald-500 text-white py-3 rounded-xl gap-2 z-10"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Emission logged successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Impact Comparison Section */}
              <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden">
                <CardContent className="p-8">
                  <div className="mb-10">
                    <h2 className="text-xl font-semibold text-foreground mb-1">Compare Your Impact</h2>
                    <p className="text-sm text-muted-foreground">See how you stack up against others</p>
                  </div>

                  <div className="space-y-10">
                    {/* Your Emissions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">Your Emissions</div>
                            <div className="text-xs text-muted-foreground">{stats.today.toFixed(1)} kg CO2</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-emerald-500">
                          {stats.today < stats.average ? `${Math.round((1 - stats.today / stats.average) * 100)}% below average` : "Above average"}
                        </div>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stats.today / stats.average) * 100, 100)}%` }}
                          className="absolute h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        />
                      </div>
                    </div>

                    {/* Community Average */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Community Average</div>
                          <div className="text-xs text-muted-foreground">{stats.average.toFixed(1)} kg CO2</div>
                        </div>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          className="absolute h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                    </div>

                    {/* Top Performer */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Top Performer</div>
                          <div className="text-xs text-muted-foreground">{stats.top.toFixed(1)} kg CO2</div>
                        </div>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats.top / stats.average) * 100}%` }}
                          className="absolute h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        />
                      </div>
                    </div>

                    {/* Encouragement Box */}
                    <div className="bg-muted/50 border border-border p-5 rounded-2xl flex gap-4 mt-8">
                      <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {stats.today < stats.average 
                          ? "Great job! You're doing better than average! Keep up the good work and inspire others."
                          : "You're slightly above average today. Try reducing travel or electricity usage to lower your impact!"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden min-h-[400px]">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-1">Emissions by Category</h2>
                    <p className="text-sm text-muted-foreground">Distribution of your carbon footprint</p>
                  </div>
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(stats.categoryEmissions || {}).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {Object.entries(stats.categoryEmissions || {}).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                          itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden min-h-[400px]">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-1">Emissions Timeline</h2>
                    <p className="text-sm text-muted-foreground">Your carbon footprint over time</p>
                  </div>
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value}kg`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                          itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="co2" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            </motion.div>
          )}

          {activeView === "Leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <Leaderboard />
            </motion.div>
          )}

          {activeView === "Insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <Insights stats={stats} activities={activities} user={user} />
            </motion.div>
          )}

          {activeView === "AI Assistant" && (

          <motion.div
            key="ai-assistant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <AIAssistant stats={stats} user={user} />
          </motion.div>
        )}

        {activeView === "Settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <SettingsComponent onUpdate={(updatedUser) => setUser(updatedUser)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showTreeModal} onOpenChange={setShowTreeModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px] p-0 overflow-hidden">
          <div className="p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-bold text-white mb-1">Tree Planting Tracker</DialogTitle>
                <DialogDescription className="text-zinc-500 text-sm">
                  Track your tree plantings to offset your carbon emissions. One tree absorbs approximately 21 kg of CO2 per year.
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowTreeModal(false)} className="text-zinc-500 hover:text-white -mt-2 -mr-2">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between h-[140px]">
                <span className="text-sm text-zinc-400">Trees Needed</span>
                <div>
                  <div className="text-2xl font-bold text-white">{Math.ceil((stats.totalPositiveEmissions || 0) / 21) || 0}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 leading-tight">to offset {(stats.totalPositiveEmissions || 0).toFixed(1)} kg CO2</div>
                </div>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between h-[140px]">
                <span className="text-sm text-zinc-400">Trees Planted</span>
                <div>
                  <div className="text-2xl font-bold text-emerald-500">{stats.treesPlanted}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 leading-tight">total planted</div>
                </div>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between h-[140px]">
                <span className="text-sm text-zinc-400">Remaining</span>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.treesNeeded}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 leading-tight">
                    {stats.totalPositiveEmissions > 0 
                      ? `${Math.min(Math.round((stats.treesPlanted / Math.ceil(stats.totalPositiveEmissions / 21)) * 100), 100)}% complete`
                      : "0% complete"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-medium">Offset Progress</span>
                <span className="text-white font-bold">
                  {stats.totalPositiveEmissions > 0 
                    ? `${Math.min(Math.round((stats.treesPlanted / Math.ceil(stats.totalPositiveEmissions / 21)) * 100), 100)}%`
                    : "0%"}
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.totalPositiveEmissions > 0 ? Math.min((stats.treesPlanted / Math.ceil(stats.totalPositiveEmissions / 21)) * 100, 100) : 0}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>

            <div className="bg-zinc-950/30 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 text-white">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold">Log Tree Planting</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Number of Trees *</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    value={treeCount}
                    onChange={(e) => setTreeCount(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Planting Date *</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={treeDate}
                      onChange={(e) => setTreeDate(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 h-12 rounded-xl focus:ring-emerald-500 pl-4 pr-10"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Notes (optional)</Label>
                <Textarea
                  placeholder="e.g., Planted with local community group..."
                  value={treeNote}
                  onChange={(e) => setTreeNote(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 min-h-[80px] rounded-xl focus:ring-emerald-500"
                />
              </div>

              <Button 
                onClick={handleTreeLog}
                disabled={!treeCount || isLoggingTrees}
                className="w-full h-12 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all"
              >
                {isLoggingTrees ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Log Tree Planting
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Planting History
              </h3>
              <div className="space-y-2">
                {activities.filter(a => a.type === "TREE_PLANTING").length > 0 ? (
                  activities.filter(a => a.type === "TREE_PLANTING").map((activity) => (
                    <div key={activity.id} className="bg-zinc-950/30 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <Leaf className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{activity.value} Trees Planted</div>
                          <div className="text-[10px] text-zinc-500">{new Date(activity.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400 italic max-w-[150px] truncate">
                        {activity.description}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-500 text-sm italic">
                    No planting history yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Streak Congratulations Modal */}
      <Dialog open={showStreakModal} onOpenChange={setShowStreakModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[400px] p-0 overflow-hidden">
          <DialogTitle className="sr-only">Daily Streak Congratulations</DialogTitle>
          <div className="relative p-8 flex flex-col items-center text-center">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 blur-[80px] -z-10" />
            
            <div className="w-20 h-20 bg-orange-500/20 border border-orange-500/30 rounded-3xl flex items-center justify-center mb-6 relative">
              <Flame className="w-10 h-10 text-orange-500 fill-orange-500" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Awesome Work!</h2>
            <p className="text-zinc-400 text-sm mb-6">
              You've logged your first activity today. Your commitment to the planet is inspiring!
            </p>

            <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 w-full mb-8">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">Current Streak</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-black text-white">{modalStreakCount}</span>
                <span className="text-2xl font-bold text-orange-500">Days</span>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 text-left">
                <Leaf className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-xs text-emerald-500/90 leading-relaxed">
                  Consistency is key to understanding and reducing your carbon footprint. You're making a real difference!
                </p>
              </div>
              
              <Button 
                onClick={() => setShowStreakModal(false)}
                className="w-full h-12 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all"
              >
                Keep it up!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
