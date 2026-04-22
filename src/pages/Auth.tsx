import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff, User, Stethoscope, Check, X, Loader2, WifiOff, RefreshCw, CreditCard, Tag, Shield, MapPin } from "lucide-react";
import { z } from "zod";
import mednurseLogo from "@/assets/mednurse-logo-new.png";
import edithMascot from "@/assets/edith-mascot-final.png";
import { useConnectivityOptional } from "@/contexts/ConnectivityContext";
import { isConnectivityError } from "@/lib/supabase-helpers";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const healthcareRoles = [
  { value: "rn", label: "Registered Nurse (RN)" },
  { value: "lpn", label: "Licensed Practical Nurse (LPN)" },
  { value: "np", label: "Nurse Practitioner (NP)" },
  { value: "student", label: "Nursing Student" },
];

const FEATURES = [
  "Clinical drug references",
  "IV compatibility checker",
  "Dose calculators",
  "Real-time safety alerts",
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<{ type: string; value: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    terms?: string;
  }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const connectivity = useConnectivityOptional();
  const isOnline = connectivity?.isOnline ?? null;
  const isChecking = connectivity?.isChecking ?? false;
  const retry = connectivity?.retry ?? (async () => {});

  const canSubmit = isOnline !== false && !isLoading;

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score: 1, label: "Weak", color: "bg-destructive" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-warning" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-info" };
    return { score: 4, label: "Strong", color: "bg-success" };
  }, [password]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) navigate("/dashboard");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (!isLogin) {
      if (!firstName.trim()) newErrors.firstName = "Please enter your first name";
      if (!lastName.trim()) newErrors.lastName = "Please enter your last name";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!acceptedTerms) newErrors.terms = "You must accept the Terms of Service";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (isConnectivityError(error)) {
            retry();
            toast({ title: "Connection Error", description: "Unable to connect to the server. Please check your internet connection and try again.", variant: "destructive" });
          } else if (error.message.includes("Invalid login credentials")) {
            toast({ title: "Login Failed", description: "Invalid email or password. Please try again.", variant: "destructive" });
          } else {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: "Welcome back!", description: "You have successfully signed in." });
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: firstName,
              last_name: lastName,
              healthcare_role: role || undefined,
              street_address: streetAddress || undefined,
              city: city || undefined,
              state: addressState || undefined,
              zip_code: zipCode || undefined,
              country: country || undefined,
            },
          },
        });
        if (error) {
          if (isConnectivityError(error)) {
            retry();
            toast({ title: "Connection Error", description: "Unable to connect to the server. Please check your internet connection and try again.", variant: "destructive" });
          } else if (error.message.includes("User already registered")) {
            toast({ title: "Account Exists", description: "This email is already registered. Please sign in instead.", variant: "destructive" });
            setIsLogin(true);
          } else {
            toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: "Account Created!", description: "Welcome to MedNurse. You are now signed in." });
        }
      }
    } catch (error) {
      if (isConnectivityError(error)) {
        retry();
        toast({ title: "Connection Error", description: "Unable to connect to the server. Please check your internet connection and try again.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("missing oauth secret") || msg.includes("unsupported provider")) {
          toast({
            title: "Google Sign-In not configured",
            description: "Google OAuth must be enabled in Supabase (Auth → Providers → Google) with Client ID + Client Secret.",
            variant: "destructive",
          });
          return;
        }
        toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    const couponSchema = z.string().max(20).regex(/^[A-Za-z0-9]*$/, "Coupon code must be alphanumeric");
    const result = couponSchema.safeParse(couponCode);
    if (!result.success) { setCouponError(result.error.errors[0].message); setCouponApplied(false); setCouponDiscount(null); return; }
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); setCouponApplied(false); setCouponDiscount(null); return; }
    setCouponLoading(true);
    setCouponError("");
    try {
      const { data, error } = await supabase.from("coupons").select("*").eq("code", couponCode.toUpperCase().trim()).eq("is_active", true).maybeSingle();
      if (error) throw error;
      if (!data) { setCouponError("Invalid coupon code"); setCouponApplied(false); setCouponDiscount(null); return; }
      if (data.expires_at && new Date(data.expires_at) < new Date()) { setCouponError("This coupon has expired"); setCouponApplied(false); setCouponDiscount(null); return; }
      if (data.max_uses !== null && data.current_uses >= data.max_uses) { setCouponError("This coupon has reached its maximum uses"); setCouponApplied(false); setCouponDiscount(null); return; }
      const plans = data.applicable_plans as string[] | null;
      if (plans && plans.length > 0 && !plans.includes(selectedPlan)) { setCouponError(`This coupon is only valid for ${plans.join(" or ")} plans`); setCouponApplied(false); setCouponDiscount(null); return; }
      setCouponApplied(true);
      setCouponDiscount({ type: data.discount_type, value: Number(data.discount_value) });
      setCouponError("");
    } catch {
      setCouponError("Unable to validate coupon. Please try again.");
      setCouponApplied(false);
      setCouponDiscount(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setConfirmPassword("");
    setAcceptedTerms(false);
  };

  const inputClass = "relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden transition-all focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/15";
  const inputInnerClass = "border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0";
  const iconClass = "flex items-center justify-center w-11 h-12 text-muted-foreground flex-shrink-0";

  return (
    <div
      className="min-h-screen py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--brand-dark)) 60%, hsl(213,75%,13%) 100%)" }}
    >
      {/* Background glow orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "hsl(var(--brand-accent))", filter: "blur(120px)", opacity: 0.12 }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "hsl(var(--brand-light))", filter: "blur(100px)", opacity: 0.15 }} />

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

          {/* ── Left: Form Panel ── */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={mednurseLogo} alt="MedNurse" className="h-28 w-auto object-contain" />
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-3xl font-bold text-foreground mb-1.5">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? "Sign in to continue your safety journey" : "Join 50,000+ healthcare professionals"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 flex-1">

              {/* Connectivity banner */}
              {(isOnline === null || isOnline === false) && (
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isOnline === null ? "bg-muted border-border" : "bg-destructive/10 border-destructive/30"
                }`}>
                  {isOnline === null ? (
                    <>
                      <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                      <p className="text-sm text-muted-foreground">Checking server connection...</p>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive font-medium flex-1">Server temporarily unavailable</p>
                      <Button type="button" size="sm" variant="outline" onClick={() => retry()} disabled={isChecking} className="h-7 px-2 text-xs">
                        <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? "animate-spin" : ""}`} />
                        {isChecking ? "Checking..." : "Retry"}
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Name row — register only */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className={inputClass}>
                      <div className={iconClass}><User className="w-4 h-4" /></div>
                      <Input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputInnerClass} />
                    </div>
                    {errors.firstName && <p className="text-xs text-destructive pl-2">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <div className={inputClass}>
                      <div className={iconClass}><User className="w-4 h-4" /></div>
                      <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputInnerClass} />
                    </div>
                    {errors.lastName && <p className="text-xs text-destructive pl-2">{errors.lastName}</p>}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <div className={inputClass}>
                  <div className={iconClass}><Mail className="w-4 h-4" /></div>
                  <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputInnerClass} />
                </div>
                {errors.email && <p className="text-xs text-destructive pl-2">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className={inputClass}>
                  <div className={iconClass}><Lock className="w-4 h-4" /></div>
                  <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputInnerClass} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`${iconClass} hover:text-foreground transition-colors`}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive pl-2">{errors.password}</p>}
                {!isLogin && password && (
                  <div className="space-y-1.5 pl-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength.score ? passwordStrength.color : "bg-border"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password — register only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <div className={inputClass}>
                    <div className={iconClass}><Lock className="w-4 h-4" /></div>
                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputInnerClass} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`${iconClass} hover:text-foreground transition-colors`}>
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {confirmPassword && (
                      <div className="flex items-center justify-center w-10 h-12">
                        {password === confirmPassword ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />}
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive pl-2">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Role — register only */}
              {!isLogin && (
                <div className={inputClass}>
                  <div className={iconClass}><Stethoscope className="w-4 h-4" /></div>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="border-0 bg-transparent h-12 text-base focus:ring-0 focus:ring-offset-0 px-0 [&>span]:text-muted-foreground/60">
                      <SelectValue placeholder="Healthcare Role (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthcareRoles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Address — register only */}
              {!isLogin && (
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Mailing Address
                  </label>
                  <div className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/15 transition-all">
                    <Input type="text" placeholder="Street Address" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}
                      className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { placeholder: "City", value: city, onChange: setCity },
                      { placeholder: "State", value: addressState, onChange: setAddressState },
                    ].map(({ placeholder, value, onChange }) => (
                      <div key={placeholder} className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/15 transition-all">
                        <Input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { placeholder: "ZIP Code", value: zipCode, onChange: setZipCode },
                      { placeholder: "Country", value: country, onChange: setCountry },
                    ].map(({ placeholder, value, onChange }) => (
                      <div key={placeholder} className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/15 transition-all">
                        <Input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plan selection — register only */}
              {!isLogin && (
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-foreground">Select Your Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setSelectedPlan("monthly")}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === "monthly" ? "border-brand-accent bg-brand-accent/5 shadow-sm" : "border-border bg-muted hover:border-brand-accent/40"
                      }`}>
                      <p className="font-semibold text-foreground text-sm">Monthly</p>
                      <p className="text-lg font-bold text-brand-accent">$12.99<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                    </button>
                    <button type="button" onClick={() => setSelectedPlan("annual")}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === "annual" ? "border-brand-accent bg-brand-accent/5 shadow-sm" : "border-border bg-muted hover:border-brand-accent/40"
                      }`}>
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{ background: "hsl(var(--brand-accent))" }}>Best value</div>
                      <p className="font-semibold text-foreground text-sm">Annual</p>
                      <p className="text-lg font-bold text-brand-accent">$129<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
                      <p className="text-[11px] text-muted-foreground">2 months free</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Coupon — register only */}
              {!isLogin && (
                <div className="space-y-2">
                  <button type="button" onClick={() => setShowCoupon(!showCoupon)}
                    className="text-sm font-medium flex items-center gap-1.5 transition-colors text-brand-accent hover:text-brand-accent-dark">
                    <Tag className="w-3.5 h-3.5" />
                    {showCoupon ? "Hide coupon code" : "Have a coupon code?"}
                  </button>
                  {showCoupon && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/15 transition-all">
                        <Input type="text" placeholder="Enter coupon code" value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponApplied(false); setCouponError(""); }}
                          maxLength={20}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={handleApplyCoupon} disabled={couponLoading} className="h-10 px-4 rounded-xl">
                        {couponLoading ? "..." : "Apply"}
                      </Button>
                    </div>
                  )}
                  {couponApplied && couponDiscount && (
                    <p className="text-sm text-success flex items-center gap-1.5 pl-1">
                      <Check className="w-3.5 h-3.5" />
                      {couponDiscount.type === "percentage" ? `${couponDiscount.value}% discount applied!` : `$${couponDiscount.value} discount applied!`}
                    </p>
                  )}
                  {couponError && <p className="text-sm text-destructive pl-1">{couponError}</p>}
                </div>
              )}

              {/* Payment — register only */}
              {!isLogin && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" /> Payment Details
                    </label>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Powered by Stripe
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">You will be charged after account creation</p>
                  <div className="space-y-2">
                    <div className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden">
                      <Input type="text" placeholder="Card number" disabled className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {["MM / YY", "CVC"].map((ph) => (
                        <div key={ph} className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden">
                          <Input type="text" placeholder={ph} disabled className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-renewal disclaimer — register only */}
              {!isLogin && (
                <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
                  By creating your account, you agree to automatic renewal of your subscription at the selected plan rate. You may cancel anytime from your account settings. No refunds for partial billing periods.{" "}
                  <Link to="/terms" className="text-brand-accent hover:underline">Terms of Service</Link>
                </p>
              )}

              {/* Forgot password — login only */}
              {isLogin && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm font-medium text-brand-accent hover:text-brand-accent-dark transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Terms checkbox — register only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(c === true)} className="mt-0.5" />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                      I agree to the{" "}
                      <Link to="/terms" className="text-brand-accent hover:underline">Terms of Service</Link>
                      ,{" "}
                      <Link to="/privacy" className="text-brand-accent hover:underline">Privacy Policy</Link>
                      , and auto-renewal policy
                    </label>
                  </div>
                  {errors.terms && <p className="text-sm text-destructive pl-7">{errors.terms}</p>}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold rounded-xl text-white gap-2 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "hsl(var(--brand-accent))" }}
                disabled={!canSubmit}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isOnline === false ? (
                  <><WifiOff className="w-4 h-4" /> Server Offline</>
                ) : (
                  <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-5 h-5" /></>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-12 text-base font-medium rounded-xl bg-background hover:bg-muted border-border gap-3 transition-all hover:-translate-y-0.5"
                onClick={handleGoogleSignIn}
                disabled={!canSubmit}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </form>

            {/* Toggle mode */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "New user?" : "Already have an account?"}{" "}
                <button onClick={switchMode} className="font-semibold text-brand-accent hover:text-brand-accent-dark transition-colors">
                  {isLogin ? "Sign up" : "Sign In"}
                </button>
              </p>
            </div>

            {/* Back to home */}
            <div className="mt-3 text-center">
              <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Home
              </button>
            </div>
          </div>

          {/* ── Right: Gradient + Mascot (desktop only) ── */}
          <div
            className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(213,75%,13%) 100%)" }}
          >
            {/* Glow orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "hsl(var(--brand-accent))", filter: "blur(80px)", opacity: 0.15 }} />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "hsl(var(--brand-light))", filter: "blur(60px)", opacity: 0.2 }} />

            {/* Mascot */}
            <div className="relative z-10">
              <img
                src={edithMascot}
                alt="Edith"
                className="w-72 h-auto animate-float"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
              />
            </div>

            {/* Feature list */}
            <div className="relative z-10 mt-6 space-y-3 w-full max-w-xs">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: "hsl(var(--brand-accent))" }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-white/85">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="relative z-10 mt-8 flex gap-6 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 backdrop-blur-sm">
              {[
                { value: "50K+", label: "Nurses" },
                { value: "HIPAA", label: "Compliant" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/55">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-white/20" />}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
