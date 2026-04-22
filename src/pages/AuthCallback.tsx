import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        // PKCE flow: exchange the auth code for a session.
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!isMounted) return;

          if (error) {
            setErrorMessage(error.message);
            toast({
              title: "Sign-in failed",
              description: error.message,
              variant: "destructive",
            });
            return;
          }

          // Clean up URL so refresh doesn't re-use the code.
          url.searchParams.delete("code");
          url.searchParams.delete("provider_token");
          url.searchParams.delete("provider_refresh_token");
          window.history.replaceState({}, document.title, url.toString());
        }

        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error) {
          setErrorMessage(error.message);
          toast({
            title: "Sign-in failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.session?.user) {
          // Clean up hash fragments (implicit flow) after Supabase has detected the session.
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
          navigate("/dashboard", { replace: true });
          return;
        }

        setErrorMessage("No session found after OAuth redirect.");
        toast({
          title: "Sign-in incomplete",
          description: "Please try signing in again.",
          variant: "destructive",
        });
      } catch (e) {
        if (!isMounted) return;
        const message = e instanceof Error ? e.message : String(e);
        setErrorMessage(message);
        toast({
          title: "Sign-in failed",
          description: message,
          variant: "destructive",
        });
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [navigate, toast]);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-6 space-y-4">
          <h1 className="font-serif text-xl font-bold text-foreground">Unable to sign in</h1>
          <p className="text-sm text-muted-foreground break-words">{errorMessage}</p>
          <Button className="w-full" onClick={() => navigate("/auth", { replace: true })}>
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-6 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Completing sign-in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;

