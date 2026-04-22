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
import mednurseLogoWhite from "@/assets/mednurse-logo-white.png";
import mednurseHeartLogo from "@/assets/mednurse-heart-logo.png";
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
  
  // Determine if form can be submitted
  const canSubmit = isOnline !== false && !isLoading;

  // Password strength calculation
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/dashboard");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin) {
      if (!firstName.trim()) {
        newErrors.firstName = "Please enter your first name";
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Please enter your last name";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!acceptedTerms) {
        newErrors.terms = "You must accept the Terms of Service";
      }
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Check for connectivity errors
          const isConnectionErr = isConnectivityError(error);

          if (isConnectionErr) {
            // Trigger immediate connectivity re-check
            retry();
            toast({
              title: "Connection Error",
              description: "Unable to connect to the server. Please check your internet connection and try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
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
          // Check for connectivity errors
          const isConnectionErr = isConnectivityError(error);

          if (isConnectionErr) {
            // Trigger immediate connectivity re-check
            retry();
            toast({
              title: "Connection Error",
              description: "Unable to connect to the server. Please check your internet connection and try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("User already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to MedNurse. You are now signed in.",
          });
        }
      }
    } catch (error) {
      // Catch-all for unexpected errors including network failures
      const isConnectionErr = isConnectivityError(error);

      if (isConnectionErr) {
        retry();
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("missing oauth secret") || msg.includes("unsupported provider")) {
          toast({
            title: "Google Sign-In not configured",
            description:
              "Google OAuth must be enabled in Supabase (Auth → Providers → Google) with Client ID + Client Secret, and Google must allow redirect URI https://gbpbuzbymqydtvkolans.supabase.co/auth/v1/callback.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Google Sign-In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    const couponSchema = z.string().max(20).regex(/^[A-Za-z0-9]*$/, "Coupon code must be alphanumeric");
    const result = couponSchema.safeParse(couponCode);
    if (!result.success) {
      setCouponError(result.error.errors[0].message);
      setCouponApplied(false);
      setCouponDiscount(null);
      return;
    }
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      setCouponApplied(false);
      setCouponDiscount(null);
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setCouponError("Invalid coupon code");
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      // Check expiry
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setCouponError("This coupon has expired");
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      // Check max uses
      if (data.max_uses !== null && data.current_uses >= data.max_uses) {
        setCouponError("This coupon has reached its maximum uses");
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      // Check applicable plan
      const plans = data.applicable_plans as string[] | null;
      if (plans && plans.length > 0 && !plans.includes(selectedPlan)) {
        setCouponError(`This coupon is only valid for ${plans.join(" or ")} plans`);
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      setCouponApplied(true);
      setCouponDiscount({ type: data.discount_type, value: Number(data.discount_value) });
      setCouponError("");
    } catch (err: any) {
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

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
          
          {/* Left Panel - Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col">
            {/* Logo and Header - Side by Side */}
            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center flex-shrink-0">
                <img src={isLogin ? mednurseLogoWhite : mednurseLogo} alt="MedNurse" className="h-24 w-auto" />
              </div>
              <div className="border-l-4 border-primary pl-6">
                <h1 className="font-serif text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  {isLogin ? "Welcome Back!" : "Create Account"}
                </h1>
                <p className="text-muted-foreground text-lg lg:text-xl font-medium">
                  {isLogin
                    ? "Sign in to continue your safety journey"
                    : "Join 50,000+ healthcare professionals"}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              {/* Server Status Indicator */}
              {(isOnline === null || isOnline === false) && (
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isOnline === null 
                    ? 'bg-muted border-border' 
                    : 'bg-destructive/10 border-destructive/30'
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
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => retry()}
                        disabled={isChecking}
                        className="h-7 px-2 text-xs"
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
                        {isChecking ? 'Checking...' : 'Retry'}
                      </Button>
                    </>
                  )}
                </div>
              )}
              
              {/* First Name - Sign Up Only */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <div className="flex items-center justify-center w-12 h-12 text-muted-foreground">
                        <User className="w-5 h-5" />
                      </div>
                      <Input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-destructive pl-2">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <div className="flex items-center justify-center w-12 h-12 text-muted-foreground">
                        <User className="w-5 h-5" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-destructive pl-2">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive pl-2">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <div className="flex items-center justify-center w-12 h-12 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive pl-2">{errors.password}</p>
                )}
                
                {/* Password Strength Indicator - Sign Up Only */}
                {!isLogin && password && (
                  <div className="space-y-1.5 pl-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.score ? passwordStrength.color : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <div className="flex items-center justify-center w-12 h-12 text-muted-foreground">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {/* Match indicator */}
                    {confirmPassword && (
                      <div className="flex items-center justify-center w-10 h-12">
                        {password === confirmPassword ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive pl-2">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Healthcare Role - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <div className="flex items-center justify-center w-12 h-12 text-muted-foreground">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="border-0 bg-transparent h-12 text-base focus:ring-0 focus:ring-offset-0 px-0 [&>span]:text-muted-foreground/60 [&>span]:data-[placeholder]:text-muted-foreground/60">
                        <SelectValue placeholder="Healthcare Role (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {healthcareRoles.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Address - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    Mailing Address
                  </label>
                  <div className="space-y-2.5">
                    <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <Input
                        type="text"
                        placeholder="Street Address"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <Input
                          type="text"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <Input
                          type="text"
                          placeholder="State"
                          value={addressState}
                          onChange={(e) => setAddressState(e.target.value)}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <Input
                          type="text"
                          placeholder="ZIP Code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <Input
                          type="text"
                          placeholder="Country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan Selection - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Select Your Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('monthly')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === 'monthly'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-muted hover:border-primary/40'
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">Monthly</p>
                      <p className="text-lg font-bold text-primary">$12.99<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('annual')}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === 'annual'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-muted hover:border-primary/40'
                      }`}
                    >
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-[10px] font-semibold">
                        Best value
                      </div>
                      <p className="font-semibold text-foreground text-sm">Annual</p>
                      <p className="text-lg font-bold text-primary">$129<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
                      <p className="text-[11px] text-muted-foreground">2 months free</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Coupon Code - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowCoupon(!showCoupon)}
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {showCoupon ? 'Hide coupon code' : 'Have a coupon code?'}
                  </button>
                  {showCoupon && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative flex items-center bg-muted border border-border rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <Input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponApplied(false);
                            setCouponError("");
                          }}
                          maxLength={20}
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="h-10 px-4 rounded-xl"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </Button>
                    </div>
                  )}
                  {couponApplied && couponDiscount && (
                    <p className="text-sm text-success flex items-center gap-1.5 pl-1">
                      <Check className="w-3.5 h-3.5" />
                      {couponDiscount.type === "percentage"
                        ? `${couponDiscount.value}% discount applied!`
                        : `$${couponDiscount.value} discount applied!`}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-sm text-destructive pl-1">{couponError}</p>
                  )}
                </div>
              )}

              {/* Payment Details - Sign Up Only (Placeholder) */}
              {!isLogin && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      Payment Details
                    </label>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secure payment powered by Stripe
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">You will be charged after account creation</p>
                  <div className="space-y-2.5">
                    <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden">
                      <Input
                        type="text"
                        placeholder="Card number"
                        disabled
                        className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden">
                        <Input
                          type="text"
                          placeholder="MM / YY"
                          disabled
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
                        />
                      </div>
                      <div className="relative flex items-center bg-muted border border-border rounded-xl overflow-hidden">
                        <Input
                          type="text"
                          placeholder="CVC"
                          disabled
                          className="border-0 bg-transparent h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-Renewal Disclaimer - Sign Up Only */}
              {!isLogin && (
                <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
                  By creating your account, you agree to automatic renewal of your subscription at the selected plan rate. You may cancel anytime from your account settings. No refunds for partial billing periods.{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </p>
              )}

              {/* Forgot Password - Sign In Only */}
              {isLogin && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Terms Checkbox - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      , and auto-renewal policy
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-destructive pl-7">{errors.terms}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
                disabled={!canSubmit}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : isOnline === false ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    Server Offline
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-12 text-base font-medium rounded-xl bg-background hover:bg-muted border-border gap-3 transition-all hover:-translate-y-0.5"
                onClick={handleGoogleSignIn}
                disabled={!canSubmit}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "New user?" : "Already have an account?"}{" "}
                <button
                  onClick={switchMode}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign In"}
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-3 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>

          {/* Right Panel - Mascot Illustration */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-muted via-muted/50 to-background items-center justify-center p-8 relative">
            {/* Soft glow effects */}
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-accent/8 rounded-full blur-3xl" />
            
            {/* Mascot */}
            <div className="relative">
              <img
                src={edithMascot}
                alt="Edith - MedNurse Mascot"
                className="w-[380px] h-auto relative z-10 animate-float"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))",
                }}
              />
              
              {/* Floating badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full px-5 py-2 shadow-lg z-20">
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-foreground text-sm">50K+</p>
                    <p className="text-muted-foreground text-xs">Users</p>
                  </div>
                  <div className="w-px h-7 bg-border" />
                  <div className="text-center">
                    <p className="font-bold text-foreground text-sm">HIPAA</p>
                    <p className="text-muted-foreground text-xs">Compliant</p>
                  </div>
                  <div className="w-px h-7 bg-border" />
                  <div className="text-center">
                    <p className="font-bold text-foreground text-sm">24/7</p>
                    <p className="text-muted-foreground text-xs">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
