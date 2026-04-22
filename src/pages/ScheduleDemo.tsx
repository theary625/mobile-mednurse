import { useState, useEffect, useMemo } from "react";
import { format, addDays, isBefore, startOfToday, isWeekend } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Clock, User, Mail, Building2, Phone, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { convertTimeLabel } from "@/utils/timezoneConvert";

const ScheduleDemo = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [globalSlots, setGlobalSlots] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<{ scope_type: string; scope_value: string; time_slots: string[] }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [timezones, setTimezones] = useState<{ value: string; label: string }[]>([]);
  const [baseTimezone, setBaseTimezone] = useState<string>("America/New_York");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    timezone: "",
    message: "",
  });

  // Fetch booked slots when date changes
  const fetchBookedSlots = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const { data } = await supabase
      .from("demo_bookings")
      .select("scheduled_time")
      .eq("scheduled_date", dateStr);
    const fetched = (data || []).map((b) => b.scheduled_time);
    setBookedSlots((prev) => Array.from(new Set([...prev, ...fetched])));
  };

  useEffect(() => {
    const fetchSlots = async () => {
      const { data } = await supabase
        .from("demo_time_slots")
        .select("time_label")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      const labels = (data || []).map((s) => s.time_label);
      setGlobalSlots(labels);
      setTimeSlots(labels);
      setLoadingSlots(false);
    };
    const fetchOverrides = async () => {
      const { data } = await supabase
        .from("demo_time_slot_overrides")
        .select("scope_type, scope_value, time_slots");
      setOverrides(data || []);
    };
    const fetchBlockedDates = async () => {
      const { data } = await supabase
        .from("demo_blocked_dates")
        .select("blocked_date");
      setBlockedDates((data || []).map((d) => d.blocked_date));
    };
    const fetchTimezones = async () => {
      const { data } = await supabase
        .from("demo_timezones")
        .select("tz_value, tz_label")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      const tzList = (data || []).map((t) => ({ value: t.tz_value, label: t.tz_label }));
      setTimezones(tzList);
      if (tzList.length > 0) {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const matched = tzList.find((tz) => tz.value === browserTz);
        setFormData((prev) =>
          prev.timezone
            ? prev
            : { ...prev, timezone: matched ? matched.value : "" }
        );
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
    fetchSlots();
    fetchOverrides();
    fetchBlockedDates();
    fetchTimezones();
    fetchBaseTimezone();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resolveTimeSlotsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const monthStr = format(date, "yyyy-MM");
    const yearStr = format(date, "yyyy");

    const dateOverride = overrides.find((o) => o.scope_type === "date" && o.scope_value === dateStr);
    if (dateOverride) return dateOverride.time_slots;

    const monthOverride = overrides.find((o) => o.scope_type === "month" && o.scope_value === monthStr);
    if (monthOverride) return monthOverride.time_slots;

    const yearOverride = overrides.find((o) => o.scope_type === "year" && o.scope_value === yearStr);
    if (yearOverride) return yearOverride.time_slots;

    return globalSlots;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setTimeSlots(resolveTimeSlotsForDate(date));
      setSelectedTime("");
      setStep(2);
      fetchBookedSlots(date);
    }
  };

  // Convert time slots for display based on visitor timezone
  const convertedSlots = useMemo(() => {
    if (!formData.timezone || !baseTimezone) return timeSlots.map((t) => ({ original: t, display: t }));
    return timeSlots.map((t) => ({
      original: t,
      display: convertTimeLabel(t, baseTimezone, formData.timezone, selectedDate),
    }));
  }, [timeSlots, baseTimezone, formData.timezone, selectedDate]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDateStr = format(selectedDate, "yyyy-MM-dd");
      const { error } = await supabase.from("demo_bookings").insert({
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        phone: formData.phone || null,
        scheduled_date: scheduledDateStr,
        scheduled_time: selectedTime,
        timezone: formData.timezone,
        message: formData.message || null,
      });

      if (error) throw error;

      setBookedSlots((prev) => [...prev, selectedTime]);
      fetchBookedSlots(selectedDate);

      // Send email notifications (fire and forget)
      supabase.functions.invoke("send-demo-booking-emails", {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          scheduled_date: format(selectedDate, "EEEE, MMMM d, yyyy"),
          scheduled_time: selectedTime,
          timezone: formData.timezone,
          message: formData.message,
        },
      }).catch((err) => console.error("Email notification error:", err));

      setIsSuccess(true);
    } catch (error) {
      console.error("Error scheduling demo:", error);
      toast({
        title: "Error",
        description: "Failed to schedule demo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = startOfToday();
    if (isBefore(date, today) || isWeekend(date)) return true;
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.includes(dateStr);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="py-20 lg:py-32">
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              Demo Scheduled!
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Thank you, {formData.name}! Your demo has been scheduled for:
            </p>
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-4 text-lg">
                <CalendarDays className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-center gap-4 text-lg mt-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  {selectedTime} ({timezones.find(tz => tz.value === formData.timezone)?.label})
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mb-8">
              We've sent a confirmation email to <strong>{formData.email}</strong> with calendar invite details.
            </p>
            <Button asChild size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </section>
        <Footer />
        <LandingChatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
            <CalendarDays className="w-4 h-4" />
            Schedule a Demo
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-4">
            <span className="text-primary">See MedNurse</span>{" "}
            <span className="text-accent">in Action</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Book a personalized 30-minute demo with our team. We'll show you how MedNurse can transform medication safety at your organization.
          </p>
        </div>
      </section>

      {/* Scheduler */}
      <section className="py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => s < step && setStep(s)}
                  disabled={s > step}
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                    s < step && "cursor-pointer hover:bg-primary/80"
                  )}
                >
                  {s}
                </button>
                <span
                  className={cn(
                    "hidden sm:block text-xs font-medium whitespace-nowrap",
                    step >= s ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s === 1 ? "Date" : s === 2 ? "Time" : "Details"}
                </span>
                {s < 3 && (
                  <div className={cn(
                    "w-6 sm:w-8 h-0.5 mx-1",
                    step > s ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Calendar & Time */}
            <div className="bg-card border border-border rounded-3xl p-6 lg:p-8">
              {/* Timezone selector — always shown at top of left panel */}
              <div className="mb-6 space-y-2">
                <Label htmlFor="tz-select" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Your Timezone
                </Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => {
                    setTimeout(() => {
                      setFormData((prev) => ({ ...prev, timezone: value }));
                    }, 0);
                  }}
                >
                  <SelectTrigger id="tz-select">
                    <SelectValue placeholder="Select timezone..." />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {step >= 1 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">Select a Date</h2>
                    {selectedDate && (
                      <span className="text-sm text-primary font-medium">
                        {format(selectedDate, "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    fromDate={startOfToday()}
                    toDate={addDays(startOfToday(), 60)}
                    className={cn("rounded-xl border p-3 pointer-events-auto")}
                    onMonthChange={() => {
                      setSelectedDate(undefined);
                      setSelectedTime("");
                      setTimeSlots(globalSlots);
                      setStep(1);
                    }}
                  />
                </div>
              )}

              {step >= 2 && selectedDate && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">Select a Time</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Change date
                    </button>
                  </div>
                  <div key={formData.timezone} className="grid grid-cols-2 gap-2">
                    {loadingSlots ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-11 rounded-xl" />
                      ))
                    ) : convertedSlots.length === 0 ? (
                      <p className="col-span-2 text-sm text-muted-foreground text-center py-4">No time slots available</p>
                    ) : (
                      convertedSlots.map(({ original, display }) => {
                        const isBooked = bookedSlots.includes(original);
                        return (
                          <button
                            key={original}
                            onClick={() => !isBooked && handleTimeSelect(original)}
                            disabled={isBooked}
                            className={cn(
                              "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                              isBooked
                                ? "bg-muted/50 text-muted-foreground cursor-not-allowed line-through opacity-60"
                                : selectedTime === original
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80 text-foreground"
                            )}
                          >
                            {display} {isBooked && "(Booked)"}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Form */}
            <div className="bg-card border border-border rounded-3xl p-6 lg:p-8">
              <h2 className="font-semibold text-lg mb-6">Your Information</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Work Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@hospital.org"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={255}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      Organization
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Hospital Name"
                      value={formData.company}
                      onChange={handleChange}
                      maxLength={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Anything you'd like us to know?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your team size, current challenges, or specific features you're interested in..."
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={500}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting || !selectedDate || !selectedTime || !formData.name || !formData.email}
                >
                  {isSubmitting ? (
                    "Scheduling..."
                  ) : (
                    <>
                      <CalendarDays className="w-4 h-4" />
                      Confirm Demo
                    </>
                  )}
                </Button>

                {(!selectedDate || !selectedTime) && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please select a date and time to continue
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LandingChatbot />
    </div>
  );
};

export default ScheduleDemo;
