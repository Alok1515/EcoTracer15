"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Car, 
  Zap, 
  Utensils, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function AddActivityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    category: "TRAVEL",
    description: "",
    amount: "",
  });

  const getUnit = () => {
    switch (formData.category) {
      case "TRAVEL": return "km";
      case "ELECTRICITY": return "kWh";
      case "FOOD": return "meals";
      default: return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/activity/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        const error = await response.text();
        alert(error || "Failed to add activity");
      }
    } catch (err) {
      alert("Something went wrong. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 mb-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Activity Logged!</h2>
          <p className="text-zinc-500 mt-2">Your carbon footprint is being updated...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 hover:bg-emerald-50 text-zinc-600 dark:text-zinc-400"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card className="border-emerald-50 dark:border-zinc-800 shadow-xl shadow-emerald-600/5">
        <CardHeader>
          <CardTitle className="text-2xl">Log New Activity</CardTitle>
          <CardDescription>Enter details about your daily habits to calculate emissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "TRAVEL", icon: Car, label: "Travel", color: "text-blue-600", bg: "bg-blue-50" },
                  { id: "ELECTRICITY", icon: Zap, label: "Energy", color: "text-yellow-600", bg: "bg-yellow-50" },
                  { id: "FOOD", icon: Utensils, label: "Food", color: "text-orange-600", bg: "bg-orange-50" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      formData.category === cat.id 
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" 
                        : "border-transparent bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <cat.icon className={`h-6 w-6 mb-2 ${cat.color}`} />
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g. Commute to office, Dinner (Meat), etc."
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl border-zinc-200 focus-visible:ring-emerald-600 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({getUnit()})</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="rounded-xl border-zinc-200 focus-visible:ring-emerald-600 dark:border-zinc-800 pr-12"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-sm text-zinc-500">
                  {getUnit()}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-emerald-600 py-6 text-lg font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Calculate & Log"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
