import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: string;
  time_label: string;
  display_order: number;
  is_active: boolean;
}

interface TimeSlotOverride {
  id: string;
  scope_type: string;
  scope_value: string;
  time_slots: string[];
  reason: string | null;
  created_at: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DemoTimeSlotManager = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  // Base timezone state
  const [baseTimezone, setBaseTimezone] = useState("");
  const [availableTimezones, setAvailableTimezones] = useState<{ value: string; label: string }[]>([]);
  const [savingTimezone, setSavingTimezone] = useState(false);

  // Override state
  const [overrides, setOverrides] = useState<TimeSlotOverride[]>([]);
  const [overrideTab, setOverrideTab] = useState("date");
  const [overrideDates, setOverrideDates] = useState<Date[]>([]);
  const [overrideMonth, setOverrideMonth] = useState(String(new Date().getMonth()));
  const [overrideMonthYear, setOverrideMonthYear] = useState(String(new Date().getFullYear()));
  const [overrideYear, setOverrideYear] = useState(String(new Date().getFullYear()));
  const [selectedOverrideSlots, setSelectedOverrideSlots] = useState<string[]>([]);
  const [customSlotLabel, setCustomSlotLabel] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [savingOverride, setSavingOverride] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2];

  const fetchSlots = async () => {
    const { data, error } = await supabase
      .from("demo_time_slots")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast({ title: "Error loading time slots", description: error.message, variant: "destructive" });
    } else {
      setSlots(data || []);
    }
    setLoading(false);
  };

  const fetchOverrides = async () => {
    const { data, error } = await supabase
      .from("demo_time_slot_overrides")
      .select("*")
      .order("scope_value", { ascending: true });
    if (error) {
      toast({ title: "Error loading overrides", description: error.message, variant: "destructive" });
    } else {
      setOverrides(data || []);
    }
  };

  const fetchBaseTimezone = async () => {
    const { data } = await supabase
      .from("demo_settings")
      .select("value")
      .eq("key", "base_timezone")
      .single();
    if (data) setBaseTimezone(data.value);
  };

  const fetchAvailableTimezones = async () => {
    const { data } = await supabase
      .from("demo_timezones")
      .select("tz_value, tz_label")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    setAvailableTimezones((data || []).map((t) => ({ value: t.tz_value, label: t.tz_label })));
  };

  useEffect(() => {
    fetchSlots();
    fetchOverrides();
    fetchBaseTimezone();
    fetchAvailableTimezones();
  }, []);

  const updateBaseTimezone = async (value: string) => {
    setSavingTimezone(true);
    setBaseTimezone(value);
    const { error } = await supabase
      .from("demo_settings")
      .upsert({ key: "base_timezone", value }, { onConflict: "key" });
    if (error) {
      toast({ title: "Error saving timezone", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Base timezone updated" });
    }
    setSavingTimezone(false);
  };

  const toggleSlot = async (id: string, is_active: boolean) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, is_active } : s)));
    const { error } = await supabase.from("demo_time_slots").update({ is_active }).eq("id", id);
    if (error) {
      toast({ title: "Error updating slot", description: error.message, variant: "destructive" });
      fetchSlots();
    }
  };

  const addSlot = async () => {
    if (!newLabel.trim()) return;
    setAdding(true);
    const maxOrder = slots.length > 0 ? Math.max(...slots.map((s) => s.display_order)) : 0;
    const { error } = await supabase
      .from("demo_time_slots")
      .insert({ time_label: newLabel.trim(), display_order: maxOrder + 1 });
    if (error) {
      toast({ title: "Error adding slot", description: error.message, variant: "destructive" });
    } else {
      setNewLabel("");
      toast({ title: "Time slot added" });
      fetchSlots();
    }
    setAdding(false);
  };

  const deleteSlot = async (id: string) => {
    if (!confirm("Delete this time slot?")) return;
    const { error } = await supabase.from("demo_time_slots").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting slot", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Time slot deleted" });
      setSlots((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Override helpers
  const getScopeValues = (): string[] => {
    if (overrideTab === "date") {
      return overrideDates.map((d) => format(d, "yyyy-MM-dd"));
    }
    if (overrideTab === "month") {
      const m = parseInt(overrideMonth) + 1;
      return [`${overrideMonthYear}-${String(m).padStart(2, "0")}`];
    }
    if (overrideTab === "year") {
      return [overrideYear];
    }
    return [];
  };

  const getScopeLabel = (o: TimeSlotOverride): string => {
    if (o.scope_type === "date") {
      const [y, m, d] = o.scope_value.split("-");
      return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
    }
    if (o.scope_type === "month") {
      const [y, m] = o.scope_value.split("-");
      return `${MONTHS[parseInt(m) - 1]} ${y}`;
    }
    return o.scope_value;
  };

  const toggleOverrideSlot = (label: string) => {
    setSelectedOverrideSlots((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const addCustomOverrideSlot = () => {
    const trimmed = customSlotLabel.trim();
    if (!trimmed || selectedOverrideSlots.includes(trimmed)) return;
    setSelectedOverrideSlots((prev) => [...prev, trimmed]);
    setCustomSlotLabel("");
  };

  const saveOverride = async () => {
    const scopeValues = getScopeValues();
    if (scopeValues.length === 0) {
      toast({ title: "Please select a scope", variant: "destructive" });
      return;
    }
    if (selectedOverrideSlots.length === 0) {
      toast({ title: "Please select at least one time slot", variant: "destructive" });
      return;
    }

    setSavingOverride(true);
    let hasError = false;
    for (const scopeValue of scopeValues) {
      const { error } = await supabase.from("demo_time_slot_overrides").upsert(
        {
          scope_type: overrideTab,
          scope_value: scopeValue,
          time_slots: selectedOverrideSlots,
          reason: overrideReason || null,
        },
        { onConflict: "scope_value" }
      );
      if (error) {
        toast({ title: "Error saving override", description: error.message, variant: "destructive" });
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      toast({ title: `Override${scopeValues.length > 1 ? "s" : ""} saved` });
      setSelectedOverrideSlots([]);
      setOverrideReason("");
      setOverrideDates([]);
      fetchOverrides();
    }
    setSavingOverride(false);
  };

  const deleteOverride = async (id: string) => {
    if (!confirm("Delete this override?")) return;
    const { error } = await supabase.from("demo_time_slot_overrides").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting override", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Override deleted" });
      setOverrides((prev) => prev.filter((o) => o.id !== id));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  const activeSlots = slots.filter((s) => s.is_active);

  return (
    <div className="space-y-6">
      {/* Base Timezone Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Base Timezone
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            The timezone that your time slot labels represent. Visitors will see times converted to their selected timezone.
          </p>
        </CardHeader>
        <CardContent>
          <Select value={baseTimezone} onValueChange={updateBaseTimezone} disabled={savingTimezone}>
            <SelectTrigger className="max-w-[300px]">
              <SelectValue placeholder="Select base timezone" />
            </SelectTrigger>
            <SelectContent>
              {availableTimezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Global Default Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Default Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 5:00 PM"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSlot()}
              className="max-w-[200px]"
            />
            <Button size="sm" onClick={addSlot} disabled={adding || !newLabel.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between rounded-lg border px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Switch checked={slot.is_active} onCheckedChange={(checked) => toggleSlot(slot.id, checked)} />
                  <span className={slot.is_active ? "font-medium" : "text-muted-foreground line-through"}>
                    {slot.time_label}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteSlot(slot.id)} className="text-destructive hover:text-destructive h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {slots.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No time slots configured</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Overrides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarIcon className="h-4 w-4" />
            Time Slot Overrides
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Set different time slots for specific dates, months, or years. Overrides take priority over defaults.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={overrideTab} onValueChange={setOverrideTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="date">By Date</TabsTrigger>
              <TabsTrigger value="month">By Month</TabsTrigger>
              <TabsTrigger value="year">By Year</TabsTrigger>
            </TabsList>

            <TabsContent value="date" className="space-y-3 pt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", overrideDates.length === 0 && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {overrideDates.length === 0
                      ? "Pick dates"
                      : overrideDates.length === 1
                        ? format(overrideDates[0], "PPP")
                        : `${overrideDates.length} dates selected`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="multiple"
                    selected={overrideDates}
                    onSelect={(dates) => setOverrideDates(dates || [])}
                    fromDate={startOfToday()}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {overrideDates.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {overrideDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((d) => (
                      <span key={d.toISOString()} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {format(d, "MMM d, yyyy")}
                        <button
                          onClick={() => setOverrideDates((prev) => prev.filter((pd) => pd.getTime() !== d.getTime()))}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="month" className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Select value={overrideMonth} onValueChange={setOverrideMonth}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={overrideMonthYear} onValueChange={setOverrideMonthYear}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="year" className="space-y-3 pt-2">
              <Select value={overrideYear} onValueChange={setOverrideYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
          </Tabs>

          {/* Select time slots from defaults */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Available time slots for this override</Label>
            {activeSlots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeSlots.map((slot) => (
                  <label key={slot.id} className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={selectedOverrideSlots.includes(slot.time_label)}
                      onCheckedChange={() => toggleOverrideSlot(slot.time_label)}
                    />
                    <span className="text-sm">{slot.time_label}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Custom time, e.g. 4:30 PM"
                value={customSlotLabel}
                onChange={(e) => setCustomSlotLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomOverrideSlot()}
                className="max-w-[200px]"
              />
              <Button size="sm" variant="outline" onClick={addCustomOverrideSlot} disabled={!customSlotLabel.trim()}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {selectedOverrideSlots.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedOverrideSlots.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {s}
                    <button onClick={() => toggleOverrideSlot(s)} className="hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Input
            placeholder="Reason (optional)"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
          />

          <Button onClick={saveOverride} disabled={savingOverride || selectedOverrideSlots.length === 0}>
            {savingOverride ? "Saving..." : "Save Override"}
          </Button>

          {/* Active overrides list */}
          {overrides.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-sm font-medium">Active Overrides ({overrides.length})</h3>
              {overrides.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border px-4 py-2.5">
                  <div>
                    <span className="font-medium text-sm">{getScopeLabel(o)}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({o.scope_type}) — {o.time_slots.length} slot{o.time_slots.length !== 1 ? "s" : ""}
                    </span>
                    {o.reason && (
                      <p className="text-xs text-muted-foreground mt-0.5">{o.reason}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">{o.time_slots.join(", ")}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteOverride(o.id)} className="text-destructive hover:text-destructive h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoTimeSlotManager;
