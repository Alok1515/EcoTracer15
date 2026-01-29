"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Trash2, 
  Save, 
  AlertTriangle,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SettingsProps {
  onUpdate?: (user: any) => void;
}

export function Settings({ onUpdate }: SettingsProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name || "");
      setEmail(parsedUser.email || "");
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = {
          name: data.name,
          email: data.email,
          userType: data.userType
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setUser(data);
        if (onUpdate) {
          onUpdate(updatedUser);
        }
        
        setPassword("");
        setMessage({ type: "success", text: "Profile updated successfully!" });
        
        // No longer strictly needed for state sync if onUpdate is used, 
        // but keeping a short delay before any potential redirect/refresh
      } else {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.message || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/user/account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        localStorage.clear();
        router.push("/login");
      } else {
        setMessage({ type: "error", text: "Failed to delete account" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">Personal Information</CardTitle>
              <CardDescription className="text-muted-foreground">Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-muted-foreground font-medium">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-muted/50 border-border h-12 rounded-xl pl-12 text-foreground focus:ring-emerald-500"
                        placeholder="Your name"
                        required
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-muted-foreground font-medium">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/50 border-border h-12 rounded-xl pl-12 text-foreground focus:ring-emerald-500"
                        placeholder="your@email.com"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <Label htmlFor="password" className="text-sm text-muted-foreground font-medium">New Password (leave blank to keep current)</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-muted/50 border-border h-12 rounded-xl pl-12 text-foreground focus:ring-emerald-500"
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      message.type === "success" 
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" 
                        : "bg-red-500/10 border border-red-500/20 text-red-500"
                    }`}
                  >
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-bold rounded-xl transition-all"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden border-red-500/20">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-semibold text-red-500 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-muted-foreground">Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Once you delete your account, there is no going back. All your activities, stats, and carbon footprint data will be permanently removed.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full h-12 rounded-xl font-bold bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 transition-all">
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-popover border-border text-popover-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This action cannot be undone. This will permanently delete your account
                      and remove all data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-accent border-border text-foreground hover:bg-accent/80 rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl"
                    >
                      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Yes, Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
