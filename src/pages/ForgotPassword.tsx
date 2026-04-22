import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import mednurseLogo from "@/assets/mednurse-logo-new.png";

const emailSchema = z.string().email("Please enter a valid email address");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = emailSchema.safeParse(email);
    if (!result.success) { setError(result.error.errors[0].message); return; }
    setIsLoading(true);
    try {
      const { data, error: functionError } = await supabase.functions.invoke("send-password-reset", {
        body: { email, redirectUrl: `${window.location.origin}/reset-password` },
      });
      if (functionError) {
        toast({ title: "Error", description: functionError.message || "Failed to send reset email. Please try again.", variant: "destructive" });
      } else if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else {
        setIsSuccess(true);
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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
                style={{ background: "hsl(var(--brand-accent) / 0.12)" }}>
                <CheckCircle className="w-8 h-8 text-brand-accent" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
              <p className="text-muted-foreground mb-2">
                We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-brand-accent/30 text-brand-accent hover:bg-brand-accent/5"
                  onClick={() => setIsSuccess(false)}
                >
                  Try a different email
                </Button>
                <Link to="/auth">
                  <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-3xl font-bold text-foreground mb-1.5">Forgot password?</h1>
                <p className="text-muted-foreground">Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden transition-all focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/15">
                    <div className="flex items-center justify-center w-11 h-12 text-muted-foreground flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  </div>
                  {error && <p className="text-xs text-destructive pl-2">{error}</p>}
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
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
