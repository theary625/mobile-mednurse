import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  format,
  isBefore,
  startOfToday,
  getDaysInMonth,
  getDay,
  isWeekend,
} from "date-fns";
import { CalendarDays, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear + 1, currentYear + 2];

/** Return all weekday dates (Mon–Fri) for a given month (0-indexed) and year */
function getWeekdaysInMonth(year: number, month: number): string[] {
  const days = getDaysInMonth(new Date(year, month));
  const dates: string[] = [];
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d);
    if (!isWeekend(date)) {
      dates.push(format(date, "yyyy-MM-dd"));
    }
  }
  return dates;
}

/** Return all weekday dates for an entire year */
function getWeekdaysInYear(year: number): string[] {
  const dates: string[] = [];
  for (let m = 0; m < 12; m++) {
    dates.push(...getWeekdaysInMonth(year, m));
  }
  return dates;
}

const DemoBlockedDatesManager = () => {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<number | null>(null);

  // Month/Year selectors
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth()));
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(String(currentYear));
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

  // Collapsible month groups
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const { toast } = useToast();

  const fetchBlockedDates = async () => {
    const { data, error } = await supabase
      .from("demo_blocked_dates")
      .select("*")
      .order("blocked_date", { ascending: true });

    if (error) {
      toast({ title: "Error loading blocked dates", description: error.message, variant: "destructive" });
    } else {
      setBlockedDates(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const today = startOfToday();

  // Group blocked dates by "YYYY-MM"
  const groupedDates = useMemo(() => {
    const groups: Record<string, BlockedDate[]> = {};
    for (const bd of blockedDates) {
      const key = bd.blocked_date.substring(0, 7); // "YYYY-MM"
      if (!groups[key]) groups[key] = [];
      groups[key].push(bd);
    }
    return groups;
  }, [blockedDates]);

  const sortedGroupKeys = useMemo(
    () => Object.keys(groupedDates).sort(),
    [groupedDates]
  );

  // --- Handlers ---

  const handleAddSingle = async () => {
    if (!selectedDate) return;
    setAdding(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const { error } = await supabase
      .from("demo_blocked_dates")
      .insert({ blocked_date: dateStr, reason: reason.trim() || null });

    if (error) {
      toast({
        title: error.message.includes("duplicate") ? "Date already blocked" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Date blocked", description: format(selectedDate, "MMMM d, yyyy") });
      setSelectedDate(undefined);
      setReason("");
      fetchBlockedDates();
    }
    setAdding(false);
  };

  const handleBulkBlock = async (dateStrings: string[], label: string) => {
    if (dateStrings.length === 0) return;
    setAdding(true);
    setBulkProgress(0);

    // Filter out already-blocked dates
    const existingSet = new Set(blockedDates.map((bd) => bd.blocked_date));
    const newDates = dateStrings.filter((d) => !existingSet.has(d));

    if (newDates.length === 0) {
      toast({ title: "All dates already blocked", description: `${label} has no new weekdays to block.` });
      setAdding(false);
      setBulkProgress(null);
      return;
    }

    // Batch in chunks of 50
    const chunkSize = 50;
    let inserted = 0;
    let errorOccurred = false;

    for (let i = 0; i < newDates.length; i += chunkSize) {
      const chunk = newDates.slice(i, i + chunkSize).map((d) => ({
        blocked_date: d,
        reason: reason.trim() || null,
      }));

      const { error } = await supabase.from("demo_blocked_dates").insert(chunk);
      if (error) {
        toast({ title: "Error blocking dates", description: error.message, variant: "destructive" });
        errorOccurred = true;
        break;
      }
      inserted += chunk.length;
      setBulkProgress(Math.round((inserted / newDates.length) * 100));
    }

    if (!errorOccurred) {
      toast({
        title: `${label} blocked`,
        description: `${inserted} weekday${inserted !== 1 ? "s" : ""} blocked successfully.`,
      });
      setReason("");
      fetchBlockedDates();
    }

    setAdding(false);
    setBulkProgress(null);
  };

  const handleBlockMonth = () => {
    const m = parseInt(selectedMonth);
    const y = parseInt(selectedMonthYear);
    const dates = getWeekdaysInMonth(y, m);
    handleBulkBlock(dates, `${MONTHS[m]} ${y}`);
  };

  const handleBlockYear = () => {
    const y = parseInt(selectedYear);
    const dates = getWeekdaysInYear(y);
    handleBulkBlock(dates, `Year ${y}`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("demo_blocked_dates").delete().eq("id", id);
    if (error) {
      toast({ title: "Error removing date", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Date unblocked" });
      setBlockedDates((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleDeleteGroup = async (groupKey: string) => {
    const ids = groupedDates[groupKey]?.map((bd) => bd.id) || [];
    if (ids.length === 0) return;

    const { error } = await supabase
      .from("demo_blocked_dates")
      .delete()
      .in("id", ids);

    if (error) {
      toast({ title: "Error removing dates", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${ids.length} dates unblocked` });
      setBlockedDates((prev) => prev.filter((d) => !ids.includes(d.id)));
    }
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Block dates with mode tabs */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Block Dates</h4>
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single">Single Date</TabsTrigger>
              <TabsTrigger value="month">Entire Month</TabsTrigger>
              <TabsTrigger value="year">Entire Year</TabsTrigger>
            </TabsList>

            {/* Single Date */}
            <TabsContent value="single">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    fromDate={today}
                    className={cn("rounded-xl border p-3 pointer-events-auto")}
                  />
                </div>
                <div className="flex-1 space-y-3">
                  {selectedDate ? (
                    <>
                      <p className="text-sm">
                        Selected: <span className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</span>
                      </p>
                      <Input
                        placeholder="Reason (optional, e.g. Holiday)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={200}
                      />
                      <Button onClick={handleAddSingle} disabled={adding} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {adding ? "Blocking..." : "Block Date"}
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Select a date on the calendar to block it.</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Entire Month */}
            <TabsContent value="month">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedMonthYear} onValueChange={setSelectedMonthYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Reason (optional, e.g. Office closed)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={200}
                />
                <Button onClick={handleBlockMonth} disabled={adding} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {adding ? "Blocking..." : `Block ${MONTHS[parseInt(selectedMonth)]} ${selectedMonthYear}`}
                </Button>
                {bulkProgress !== null && (
                  <div className="space-y-1">
                    <Progress value={bulkProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{bulkProgress}% complete</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Entire Year */}
            <TabsContent value="year">
              <div className="space-y-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Reason (optional, e.g. Year-long closure)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={200}
                />
                <Button onClick={handleBlockYear} disabled={adding} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {adding ? "Blocking..." : `Block All of ${selectedYear}`}
                </Button>
                {bulkProgress !== null && (
                  <div className="space-y-1">
                    <Progress value={bulkProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{bulkProgress}% complete</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* List of blocked dates grouped by month */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Blocked Dates ({blockedDates.length})</h4>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : blockedDates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No dates are currently blocked.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {sortedGroupKeys.map((groupKey) => {
                const group = groupedDates[groupKey];
                const [y, m] = groupKey.split("-");
                const label = `${MONTHS[parseInt(m) - 1]} ${y}`;
                const isCollapsed = collapsedGroups.has(groupKey);

                return (
                  <div key={groupKey} className="border rounded-lg">
                    {/* Group header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-t-lg">
                      <button
                        onClick={() => toggleGroup(groupKey)}
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                        {label}
                        <span className="text-muted-foreground font-normal">
                          ({group.length} date{group.length !== 1 ? "s" : ""})
                        </span>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGroup(groupKey)}
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove All
                      </Button>
                    </div>

                    {/* Individual dates */}
                    {!isCollapsed && (
                      <div className="divide-y">
                        {group.map((bd) => {
                          const isPast = isBefore(new Date(bd.blocked_date + "T00:00:00"), today);
                          return (
                            <div
                              key={bd.id}
                              className={cn(
                                "flex items-center justify-between px-3 py-1.5 text-sm",
                                isPast && "opacity-50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium">
                                  {format(new Date(bd.blocked_date + "T00:00:00"), "EEE, MMM d")}
                                </span>
                                {bd.reason && (
                                  <span className="text-muted-foreground">— {bd.reason}</span>
                                )}
                                {isPast && (
                                  <span className="text-xs text-muted-foreground">(past)</span>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(bd.id)}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoBlockedDatesManager;
