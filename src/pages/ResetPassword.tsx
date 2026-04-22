import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff, CheckCircle, Check, X } from "lucide-react";
import { z } from "zod";
import mednurseLogo from "@/assets/mednurse-logo-new.png";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkDebug, setLinkDebug] = useState<{
    hasCode: boolean;
    hasAccessToken: boolean;
    type: string | null;
    hasHash: boolean;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hash = window.location.hash || "";
      const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.substring(1) : hash);
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type") ?? url.searchParams.get("type");
      setLinkDebug({ hasCode: Boolean(code), hasAccessToken: Boolean(accessToken), type, hasHash: Boolean(hash) });
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!isMounted) return;
        if (error) {
          setLinkError("Invalid or Expired Link");
          toast({ title: "Invalid or Expired Link", description: "Please request a new password reset link.", variant: "destructive" });
        } else {
          setLinkError(null);
          url.searchParams.delete("code");
          window.history.replaceState({}, document.title, url.toString());
        }
        return;
      }
      if (!accessToken || type !== "recovery") {
        setLinkError("Invalid or Expired Link");
        toast({
          title: "Invalid or Expired Link",
          description: "This usually happens when the email app removes part of the link. Try opening the link in your browser, or request a new one.",
          variant: "destructive",
        });
      } else {
        setLinkError(null);
      }
    };
    void run();
    return () => { isMounted = false; };
  }, [toast]);

  const passwordStrength = (() => {
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
  })();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setIsSuccess(true);
        setTimeout(() => navigate("/auth"), 3000);
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden transition-all focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/15";
  const inputInnerClass = "border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0";
  const iconClass = "flex items-center justify-center w-11 h-12 text-muted-foreground flex-shrink-0";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--brand-dark)) 60%, hsl(213,75%,13%) 100%)" }}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "hsl(var(--brand-accent))", filter: "blur(120px)", opacity: 0.12 }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "hsl(var(--brand-light))", filter: "blur(100px)", opacity: 0.15 }} />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={mednurseLogo} alt="MedNurse" className="h-28 w-auto object-contain" />
          </div>

          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "hsl(var(--success) / 0.12)" }}>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Password Updated!</h1>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You'll be redirected to sign in shortly.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full h-12 rounded-xl text-white font-semibold"
                style={{ background: "hsl(var(--brand-accent))" }}
              >
                Sign In Now
              </Button>
            </div>
          ) : linkError ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <h1 className="font-bold text-lg text-foreground">Invalid or Expired Link</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  If you opened the email inside a mail app, try tapping "Open in browser" so the full link is preserved.
                </p>
              </div>
              <Button
                onClick={() => navigate("/forgot-password")}
                className="w-full h-12 rounded-xl text-white font-semibold"
                style={{ background: "hsl(var(--brand-accent))" }}
              >
                Request a new reset link
              </Button>
              {linkDebug && (
                <div className="text-xs text-muted-foreground">
                  Debug: code={String(linkDebug.hasCode)}, access_token={String(linkDebug.hasAccessToken)}, type={String(linkDebug.type)}, hash={String(linkDebug.hasHash)}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-3xl font-bold text-foreground mb-1.5">Reset your password</h1>
                <p className="text-muted-foreground">Enter your new password below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <div className="space-y-1.5">
                  <div className={inputClass}>
                    <div className={iconClass}><Lock className="w-4 h-4" /></div>
                    <Input type={showPassword ? "text" : "password"} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputInnerClass} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`${iconClass} hover:text-foreground transition-colors`}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive pl-2">{errors.password}</p>}
                  {password && (
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

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <div className={inputClass}>
                    <div className={iconClass}><Lock className="w-4 h-4" /></div>
                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputInnerClass} />
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

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-semibold rounded-xl text-white gap-2 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: "hsl(var(--brand-accent))" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
