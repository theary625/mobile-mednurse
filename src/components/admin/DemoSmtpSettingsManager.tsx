import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, SendHorizonal } from "lucide-react";

interface SmtpSettings {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  use_tls: boolean;
  is_active: boolean;
}

const DemoSmtpSettingsManager = () => {
  const [settings, setSettings] = useState<SmtpSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("smtp_settings")
      .select("*")
      .eq("setting_key", "demo_booking")
      .maybeSingle();

    if (error) {
      toast({ title: "Error loading SMTP settings", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data) {
      setSettings(data as SmtpSettings);
    } else {
      // Auto-create default row if none exists
      const defaults = {
        setting_key: "demo_booking",
        host: "",
        port: 465,
        username: "",
        password: "",
        from_email: "",
        from_name: "MedNurse",
        use_tls: true,
        is_active: false,
      };
      const { data: newRow, error: insertError } = await supabase
        .from("smtp_settings")
        .insert(defaults)
        .select()
        .single();

      if (insertError) {
        toast({ title: "Error creating SMTP settings", description: insertError.message, variant: "destructive" });
      } else if (newRow) {
        setSettings(newRow as SmtpSettings);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("smtp_settings")
      .update({
        host: settings.host,
        port: settings.port,
        username: settings.username,
        password: settings.password,
        from_email: settings.from_email,
        from_name: settings.from_name,
        use_tls: settings.use_tls,
        is_active: settings.is_active,
      })
      .eq("setting_key", "demo_booking");

    if (error) {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "SMTP settings saved" });
    }
    setSaving(false);
  };

  const handleTest = async () => {
    if (!settings) return;
    setTesting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-demo-booking-emails", {
        body: { _type: "smtp_test" },
      });

      if (error) throw error;

      if (data?.success) {
        toast({ title: "Test email sent!", description: "Check your admin inbox for the test message." });
      } else {
        toast({ title: "Test failed", description: data?.error || "Unknown error", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Test failed", description: err.message, variant: "destructive" });
    }

    setTesting(false);
  };

  const update = (field: keyof SmtpSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No SMTP configuration found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">SMTP Email Settings</CardTitle>
        <CardDescription>
          Configure your own SMTP server for sending demo booking emails. When disabled, emails use the default delivery method.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label className="text-base font-medium">Enable SMTP</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, all demo booking emails will be sent via your SMTP server
            </p>
          </div>
          <Switch
            checked={settings.is_active}
            onCheckedChange={(v) => update("is_active", v)}
          />
        </div>

        {/* Server Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">SMTP Host</Label>
            <Input
              id="smtp-host"
              placeholder="smtp.gmail.com"
              value={settings.host}
              onChange={(e) => update("host", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">Port</Label>
            <Input
              id="smtp-port"
              type="number"
              placeholder="465"
              value={settings.port}
              onChange={(e) => update("port", parseInt(e.target.value) || 465)}
            />
            <p className="text-xs text-muted-foreground">
              Use port 465 (SSL/TLS) for best compatibility. Port 587 (STARTTLS) is not supported.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-username">Username</Label>
            <Input
              id="smtp-username"
              placeholder="your@email.com"
              value={settings.username}
              onChange={(e) => update("username", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-password">Password</Label>
            <Input
              id="smtp-password"
              type="password"
              placeholder="••••••••"
              value={settings.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-from-email">From Email</Label>
            <Input
              id="smtp-from-email"
              placeholder="noreply@mednurse.com"
              value={settings.from_email}
              onChange={(e) => update("from_email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-from-name">From Name</Label>
            <Input
              id="smtp-from-name"
              placeholder="MedNurse"
              value={settings.from_name}
              onChange={(e) => update("from_name", e.target.value)}
            />
          </div>
        </div>

        {/* TLS Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label className="text-base font-medium">Use TLS</Label>
            <p className="text-sm text-muted-foreground">Enable TLS/STARTTLS encryption</p>
          </div>
          <Switch
            checked={settings.use_tls}
            onCheckedChange={(v) => update("use_tls", v)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || !settings.is_active || !settings.host}
          >
            {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <SendHorizonal className="h-4 w-4 mr-2" />}
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoSmtpSettingsManager;
