import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

interface Timezone {
  id: string;
  tz_value: string;
  tz_label: string;
  is_active: boolean;
  display_order: number;
}

const DemoTimezoneManager = () => {
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const fetchTimezones = async () => {
    const { data, error } = await supabase
      .from("demo_timezones")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast({ title: "Error loading timezones", description: error.message, variant: "destructive" });
    } else {
      setTimezones(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimezones();
  }, []);

  const handleAdd = async () => {
    if (!newValue.trim() || !newLabel.trim()) return;
    setAdding(true);
    const maxOrder = timezones.length > 0 ? Math.max(...timezones.map((t) => t.display_order)) : 0;
    const { error } = await supabase.from("demo_timezones").insert({
      tz_value: newValue.trim(),
      tz_label: newLabel.trim(),
      display_order: maxOrder + 1,
    });
    if (error) {
      toast({ title: "Error adding timezone", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Timezone added" });
      setNewValue("");
      setNewLabel("");
      fetchTimezones();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("demo_timezones").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting timezone", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Timezone deleted" });
      setTimezones((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("demo_timezones").update({ is_active }).eq("id", id);
    if (error) {
      toast({ title: "Error updating timezone", description: error.message, variant: "destructive" });
    } else {
      setTimezones((prev) => prev.map((t) => (t.id === id ? { ...t, is_active } : t)));
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= timezones.length) return;

    const updated = [...timezones];
    const orderA = updated[index].display_order;
    const orderB = updated[swapIndex].display_order;

    await Promise.all([
      supabase.from("demo_timezones").update({ display_order: orderB }).eq("id", updated[index].id),
      supabase.from("demo_timezones").update({ display_order: orderA }).eq("id", updated[swapIndex].id),
    ]);

    updated[index].display_order = orderB;
    updated[swapIndex].display_order = orderA;
    updated.sort((a, b) => a.display_order - b.display_order);
    setTimezones(updated);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Existing timezones */}
      <div className="space-y-2">
        {timezones.map((tz, index) => (
          <div key={tz.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleReorder(index, "up")} disabled={index === 0}>
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleReorder(index, "down")} disabled={index === timezones.length - 1}>
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{tz.tz_label}</p>
              <p className="text-xs text-muted-foreground truncate">{tz.tz_value}</p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`tz-active-${tz.id}`} className="text-xs text-muted-foreground">
                {tz.is_active ? "Active" : "Hidden"}
              </Label>
              <Switch
                id={`tz-active-${tz.id}`}
                checked={tz.is_active}
                onCheckedChange={(checked) => handleToggle(tz.id, checked)}
              />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(tz.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {timezones.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No timezones configured</p>
        )}
      </div>

      {/* Add new timezone */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3">Add Timezone</h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="IANA Value (e.g. Europe/London)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Display Label (e.g. GMT)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={adding || !newValue.trim() || !newLabel.trim()} className="gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemoTimezoneManager;
