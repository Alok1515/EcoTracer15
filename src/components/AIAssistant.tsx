"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Image as ImageIcon, 
  Sparkles, 
  Loader2,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
  timestamp: string;
}

export function AIAssistant({ stats, user }: { stats?: any, user?: any }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi${user?.name ? ' ' + user.name : ''}! I'm your Carbon Assistant powered by AI. I see your current net emission is ${stats?.netBalance?.toFixed(2) || '0.00'} kg CO2e. How can I help you reduce it today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "How can I reduce my carbon footprint?",
    "Analyze my emissions",
    "Sustainable travel tips",
    "Home energy savings"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // Inject user context as a system message if stats are available
      const contextMessage = {
        role: "system",
        content: `You are assisting ${user?.name || 'the user'}. Their current net emissions balance is ${stats?.netBalance?.toFixed(2) || '0.00'} kg CO2e. This is the primary metric (Total emissions - offsets). Always refer to this as 'Net Emissions' and prioritize it over lifetime emissions.`
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [contextMessage, ...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error("Failed to fetch AI response");
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your API key and try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden flex flex-col h-[700px] border">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center border border-border">
            <Bot className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Carbon Assistant
            </h2>
            <p className="text-xs text-muted-foreground">AI-powered personalized tips</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                message.role === "assistant" 
                  ? "bg-accent border-border text-foreground" 
                  : "bg-foreground border-foreground text-background"
              }`}>
                {message.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
                <div className={`flex flex-col gap-1.5 max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    message.role === "assistant"
                      ? "bg-accent/50 border border-border/50 text-foreground/80 shadow-sm"
                      : "bg-foreground text-background font-medium shadow-sm"
                  }`}>
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none 
                        prose-p:leading-relaxed prose-p:text-foreground/80 prose-p:mb-4 last:prose-p:mb-0
                        prose-headings:text-foreground prose-headings:font-bold prose-headings:mb-3 prose-headings:mt-6 first:prose-headings:mt-0
                        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                        prose-code:text-emerald-500 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                        prose-strong:text-foreground prose-strong:font-bold
                        prose-ul:my-4 prose-li:my-1 prose-ul:list-disc
                        prose-ol:my-4 prose-li:my-1 prose-ol:list-decimal
                        prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 px-1">{message.timestamp}</span>
                </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-accent border border-border text-foreground flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-accent/30 border border-border/30 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium italic">Carbon Assistant is thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-card/60 backdrop-blur-xl border-t border-border space-y-4">
        {/* Suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSend(suggestion)}
              className="whitespace-nowrap px-4 py-2 rounded-xl bg-accent/50 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all shrink-0"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about carbon reduction..."
            className="w-full bg-muted/50 border-border h-14 rounded-2xl pl-14 pr-16 text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:border-accent transition-all"
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-accent hover:bg-foreground hover:text-background text-muted-foreground h-10 w-10 rounded-xl transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
