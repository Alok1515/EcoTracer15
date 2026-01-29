"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Truck, 
  Zap, 
  Trash2, 
  Info, 
  Calculator, 
  ArrowRight,
  Factory,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  export default function LcaPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    materialType: "PLASTIC",
    materialKg: 2,
    energyKwh: 10,
    distanceKm: 500,
    transportMode: "TRUCK",
    usageKwh: 5,
    disposalType: "LANDFILL",
  });

    const handleCalculate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setResult(null);

      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/api/lca/calculate", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        alert("Failed to calculate. Please try again.");
      }
    } catch (err) {
      alert("Error connecting to server.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleSave = async () => {
      if (!result) return;
      setIsSaving(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/api/activity/add", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            type: "PRODUCT",
            description: `LCA: ${formData.materialKg}kg ${formData.materialType.toLowerCase()} product`,
            value: result.totalEmission,
          }),
        });

        if (response.ok) {
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
        } else {
          alert("Failed to save activity.");
        }
      } catch (err) {
        alert("Error saving activity.");
      } finally {
        setIsSaving(false);
      }
    };

    const chartData = result ? Object.entries(result.breakdown).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value
  })) : [];

  return (
    <div className="min-h-screen pb-12 pt-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Product LCA Module
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Life Cycle Assessment following IPCC & UK DEFRA standards
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            5-Stage Model Compliant
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <Package className="h-5 w-5 text-emerald-600" />
                  1. Raw Material & Manufacturing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Material Type</label>
                    <select
                      className="mt-1 block w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      value={formData.materialType}
                      onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                    >
                      <option value="COTTON">Cotton</option>
                      <option value="PLASTIC">Plastic</option>
                      <option value="STEEL">Steel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="mt-1 block w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      value={formData.materialKg}
                      onChange={(e) => setFormData({ ...formData, materialKg: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Manufacturing Energy (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                    value={formData.energyKwh}
                    onChange={(e) => setFormData({ ...formData, energyKwh: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <Truck className="h-5 w-5 text-blue-600" />
                  2. Transportation & Logistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Distance (km)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      value={formData.distanceKm}
                      onChange={(e) => setFormData({ ...formData, distanceKm: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mode</label>
                    <select
                      className="mt-1 block w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      value={formData.transportMode}
                      onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
                    >
                      <option value="TRUCK">Truck</option>
                      <option value="SHIP">Ship</option>
                      <option value="AIR">Air</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <Zap className="h-5 w-5 text-amber-500" />
                  3. Usage & End-of-Life
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Usage (kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="mt-1 block w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      value={formData.usageKwh}
                      onChange={(e) => setFormData({ ...formData, usageKwh: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Disposal</label>
                    <select
                      className="mt-1 block w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      value={formData.disposalType}
                      onChange={(e) => setFormData({ ...formData, disposalType: e.target.value })}
                    >
                      <option value="RECYCLE">Recycle</option>
                      <option value="LANDFILL">Landfill</option>
                      <option value="INCINERATION">Incineration</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Calculator className="h-6 w-6" />
                    Calculate Product LCA
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Display */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="text-center">
                      <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        Estimated Carbon Footprint
                      </p>
                      <h2 className="mt-2 text-5xl font-black text-emerald-600 dark:text-emerald-400">
                        {result.totalEmission} <span className="text-2xl font-bold text-zinc-400">kg CO2</span>
                      </h2>
                      
                      <div className="mt-6 flex flex-col gap-3">
                        <button
                          onClick={handleSave}
                          disabled={isSaving || isSuccess}
                          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all active:scale-[0.98] ${
                            isSuccess 
                              ? "bg-emerald-500 text-white" 
                              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                          }`}
                        >
                          {isSaving ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : isSuccess ? (
                            <>
                              <CheckCircle2 className="h-5 w-5" />
                              Saved to Activity Log
                            </>
                          ) : (
                            <>
                              <Package className="h-5 w-5" />
                              Log This Product Impact
                            </>
                          )}
                        </button>
                        <p className="text-[10px] text-zinc-500">
                          Save this calculation to your personal dashboard and contribution history
                        </p>
                      </div>
                    </div>

                  <div className="mt-8 h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.1} />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={100} 
                          tick={{ fontSize: 12, fill: "currentColor" }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: 'rgb(24, 24, 27)'
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {chartData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <div>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.name}</p>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.value} kg</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/20">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                        Emission factors are based on IPCC and UK DEFRA public datasets. Calculations follow the ISO 14040:2006 framework for life cycle assessment.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 text-center p-12 dark:border-zinc-800"
                >
                  <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
                    <Factory className="h-12 w-12 text-zinc-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Ready to Analyze?</h3>
                  <p className="mt-2 max-w-xs text-zinc-500 dark:text-zinc-400">
                    Enter your product details on the left to generate a comprehensive life cycle assessment report.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
