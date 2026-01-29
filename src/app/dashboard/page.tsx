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
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ today: 0, average: 19.8, top: 1.3 });
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("Transportation");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [vehicleType, setVehicleType] = useState("gasoline");
  const [electricitySource, setElectricitySource] = useState("grid");
  const [heatingFuel, setHeatingFuel] = useState("gas");
  const [flightClass, setFlightClass] = useState("economy");
  const [foodType, setFoodType] = useState("meat");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    { name: "MacBook Pro 14\"", category: "Electronics", co2: 245, icon: Package },
    { name: "Denim Jeans", category: "Apparel", co2: 33.4, icon: Package },
    { name: "Coffee (1kg)", category: "Food", co2: 17.0, icon: Package },
    { name: "Smartphone", category: "Electronics", co2: 79.0, icon: Package },
    { name: "Leather Shoes", category: "Apparel", co2: 15.0, icon: Package },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      const headers = { "Authorization": `Bearer ${token}` };
      const todayRes = await fetch("http://localhost:8080/api/emission/today", { headers });
      const todayData = await todayRes.json();
      setStats(prev => ({ ...prev, today: todayData }));
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmission = async (isProduct = false) => {
    if (!amount) return;
    setIsLogging(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    // Map categories to backend ActivityType
    const categoryMap: Record<string, string> = {
      "Transportation": "TRAVEL",
      "Electricity": "ELECTRICITY",
      "Heating": "HEATING",
      "Flights": "FLIGHTS",
      "Food": "FOOD"
    };

    let description = "";
    if (isProduct && selectedProduct) {
      description = `Product: ${selectedProduct.name} (${selectedProduct.category})`;
    } else {
      switch (activeCategory) {
        case "Transportation": description = `Vehicle: ${vehicleType}`; break;
        case "Electricity": description = `Source: ${electricitySource}`; break;
        case "Heating": description = `Fuel: ${heatingFuel}`; break;
        case "Flights": description = `Class: ${flightClass}`; break;
        case "Food": description = `Diet: ${foodType}`; break;
        default: description = activeCategory;
      }
    }

    try {
      const response = await fetch("http://localhost:8080/api/activity/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type: isProduct ? "PRODUCT" : (categoryMap[activeCategory] || "TRAVEL"),
          description: description,
          value: parseFloat(amount),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setAmount("");
        setSelectedProduct(null);
        setTimeout(() => {
          setIsSuccess(false);
          fetchData();
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to log activity", err);
    } finally {
      setIsLogging(false);
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

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 font-sans">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-1 flex items-center justify-between">
          <button className="flex-1 py-2 px-4 rounded-xl bg-zinc-800 text-white font-medium text-sm transition-all">Overview</button>
          <button className="flex-1 py-2 px-4 rounded-xl hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 font-medium text-sm transition-all">Leaderboard</button>
          <button className="flex-1 py-2 px-4 rounded-xl hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 font-medium text-sm transition-all">Insights</button>
          <button className="flex-1 py-2 px-4 rounded-xl hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 font-medium text-sm transition-all">AI Assistant</button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-zinc-900/40 border-zinc-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Net Emissions Balance</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17.5c0 2.5 2 4.5 5 4.5s5-2 5-4.5c0-3-2.5-5-5-8-2.5 3-5 5-5 8z"/>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.today.toFixed(1)} kg</div>
            <div className="text-xs text-zinc-500">After 21.0 kg offset</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Total Activities</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-400 text-lg">+</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">22.3 kg</div>
            <div className="text-xs text-zinc-500">Total logged CO2</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Monthly Change</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17l5-5 5 5M7 7l5 5 5-5"/>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-500 mb-1">+133900.0%</div>
            <div className="text-xs text-zinc-500">vs last month</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Your Rank</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Settings className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">#11</div>
            <div className="text-xs text-zinc-500">on leaderboard</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 rounded-2xl md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Trees Needed</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17.5c0 2.5 2 4.5 5 4.5s5-2 5-4.5c0-3-2.5-5-5-8-2.5 3-5 5-5 8z"/>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-zinc-500">100% offset (1 planted)</div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Entry Section */}
        <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2rem] overflow-hidden relative">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">Quick Entry</h2>
              <p className="text-sm text-zinc-500">Log your carbon emissions</p>
            </div>

            <Tabs defaultValue="manual" className="w-full mb-8">
              <TabsList className="bg-zinc-950/50 border border-zinc-800 p-1 rounded-xl w-full h-12">
                <TabsTrigger value="manual" className="flex-1 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                  <Settings className="w-4 h-4 mr-2" /> Manual
                </TabsTrigger>
                <TabsTrigger value="image" className="flex-1 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                  <Camera className="w-4 h-4 mr-2" /> Image
                </TabsTrigger>
                <TabsTrigger value="product" className="flex-1 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                  <Package className="w-4 h-4 mr-2" /> Product LCA
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="mt-6 space-y-8">
                <div className="flex items-center justify-between bg-zinc-950/30 border border-zinc-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <Settings className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Precision Mode</div>
                      <div className="text-xs text-zinc-500">Recommended</div>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-4 block">Activity Category</label>
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
                          ? "bg-white border-white text-black" 
                          : "bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
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
                      <Label className="text-sm text-zinc-400">Vehicle Type</Label>
                      <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12 rounded-xl text-zinc-300 focus:ring-0">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          <SelectItem value="gasoline">Car (Gasoline)</SelectItem>
                          <SelectItem value="electric">Car (Electric)</SelectItem>
                          <SelectItem value="hybrid">Car (Hybrid)</SelectItem>
                          <SelectItem value="bus">Public Bus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {activeCategory === "Electricity" && (
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-400">Energy Source</Label>
                      <Select value={electricitySource} onValueChange={setElectricitySource}>
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12 rounded-xl text-zinc-300 focus:ring-0">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          <SelectItem value="grid">Power Grid</SelectItem>
                          <SelectItem value="solar">Solar Panels</SelectItem>
                          <SelectItem value="wind">Wind Energy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {activeCategory === "Heating" && (
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-400">Heating Fuel</Label>
                      <Select value={heatingFuel} onValueChange={setHeatingFuel}>
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12 rounded-xl text-zinc-300 focus:ring-0">
                          <SelectValue placeholder="Select fuel" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          <SelectItem value="gas">Natural Gas</SelectItem>
                          <SelectItem value="oil">Heating Oil</SelectItem>
                          <SelectItem value="electric">Electric Heat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {activeCategory === "Flights" && (
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-400">Flight Class</Label>
                      <Select value={flightClass} onValueChange={setFlightClass}>
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12 rounded-xl text-zinc-300 focus:ring-0">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="first">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {activeCategory === "Food" && (
                    <div className="space-y-2">
                      <Label className="text-sm text-zinc-400">Diet Type</Label>
                      <Select value={foodType} onValueChange={setFoodType}>
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12 rounded-xl text-zinc-300 focus:ring-0">
                          <SelectValue placeholder="Select diet" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          <SelectItem value="meat">Meat Lover</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="beef">High Beef</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm text-zinc-400">Value</Label>
                    <div className="relative">
                      <Input 
                        placeholder="Enter value" 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 h-12 rounded-xl pr-16 text-zinc-300 placeholder:text-zinc-600 focus:ring-0 focus:border-zinc-700"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">{getUnit()}</div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAddEmission}
                  disabled={isLogging || !amount}
                  className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-base transition-all disabled:opacity-50"
                >
                  {isLogging ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Emission"}
                </Button>
              </TabsContent>

              <TabsContent value="product" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Input 
                      placeholder="Search products (e.g. Laptop, Jeans...)" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 h-12 rounded-xl pl-4 text-zinc-300 placeholder:text-zinc-600 focus:ring-0 focus:border-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.name}
                        onClick={() => {
                          setSelectedProduct(product);
                          setAmount(product.co2.toString());
                        }}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          selectedProduct?.name === product.name
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-zinc-950/30 border-zinc-800/50 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-800 rounded-lg">
                            <product.icon className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-xs text-zinc-500">{product.category}</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">{product.co2} kg</div>
                      </button>
                    ))}
                  </div>

                  {selectedProduct && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-emerald-500 uppercase tracking-wider font-bold">Estimated Impact</span>
                        <span className="text-lg font-bold text-white">{selectedProduct.co2} kg CO2e</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Button 
                  onClick={() => handleAddEmission(true)}
                  disabled={isLogging || !selectedProduct}
                  className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-base transition-all disabled:opacity-50"
                >
                  {isLogging ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log Product Impact"}
                </Button>
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
        <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2rem] overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-1">Compare Your Impact</h2>
              <p className="text-sm text-zinc-500">See how you stack up against others</p>
            </div>

            <div className="space-y-10">
              {/* Your Emissions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Your Emissions</div>
                      <div className="text-xs text-zinc-500">{stats.today.toFixed(1)} kg CO2</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-500">
                    {stats.today < stats.average ? `${Math.round((1 - stats.today / stats.average) * 100)}% below average` : "Above average"}
                  </div>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stats.today / stats.average) * 100, 100)}%` }}
                    className="absolute h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>

              {/* Community Average */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Users className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Community Average</div>
                    <div className="text-xs text-zinc-500">{stats.average.toFixed(1)} kg CO2</div>
                  </div>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
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
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Top Performer</div>
                    <div className="text-xs text-zinc-500">{stats.top.toFixed(1)} kg CO2</div>
                  </div>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.top / stats.average) * 100}%` }}
                    className="absolute h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>

              {/* Encouragement Box */}
              <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl flex gap-4 mt-8">
                <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {stats.today < stats.average 
                    ? "Great job! You're doing better than average! Keep up the good work and inspire others."
                    : "You're slightly above average today. Try reducing travel or electricity usage to lower your impact!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
