import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ErrorsPreventedCounter = () => {
  const [count, setCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      const { count: totalCount, error } = await supabase
        .from("errors_prevented")
        .select("*", { count: "exact", head: true })
        .eq("helped_prevent", true);

      if (!error && totalCount !== null) {
        setCount(totalCount);
      }
    };

    fetchCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("errors_prevented_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "errors_prevented",
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Animate counter
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    if (count === 0) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = count / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div
      className={`inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-full transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        <div className="relative p-2 bg-primary/10 rounded-full">
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="text-left">
        <div className="text-2xl font-bold text-primary tabular-nums">
          {displayCount.toLocaleString()}+
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Medication Errors Prevented
        </div>
      </div>
    </div>
  );
};

export default ErrorsPreventedCounter;
