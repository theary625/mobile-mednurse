import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";

const PlatformSettings = () => {
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // General settings
  const [siteName, setSiteName] = useState("MedNurse");
  const [siteDescription, setSiteDescription] = useState("AI-powered healthcare assistant");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUserAlerts, setNewUserAlerts] = useState(true);
  const [supportAlerts, setSupportAlerts] = useState(true);

  // Security settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");

  // Track initial values for change detection
  const initialValues = useRef({
    siteName: "MedNurse",
    siteDescription: "AI-powered healthcare assistant",
    maintenanceMode: false,
    emailNotifications: true,
    newUserAlerts: true,
    supportAlerts: true,
    requireEmailVerification: false,
    twoFactorEnabled: false,
    sessionTimeout: "60",
  });

  const getChangedSettings = () => {
    const changes: Record<string, { old: string | boolean; new: string | boolean }> = {};
    
    if (siteName !== initialValues.current.siteName) {
      changes.siteName = { old: initialValues.current.siteName, new: siteName };
    }
    if (siteDescription !== initialValues.current.siteDescription) {
      changes.siteDescription = { old: initialValues.current.siteDescription, new: siteDescription };
    }
    if (maintenanceMode !== initialValues.current.maintenanceMode) {
      changes.maintenanceMode = { old: initialValues.current.maintenanceMode, new: maintenanceMode };
    }
    if (emailNotifications !== initialValues.current.emailNotifications) {
      changes.emailNotifications = { old: initialValues.current.emailNotifications, new: emailNotifications };
    }
    if (newUserAlerts !== initialValues.current.newUserAlerts) {
      changes.newUserAlerts = { old: initialValues.current.newUserAlerts, new: newUserAlerts };
    }
    if (supportAlerts !== initialValues.current.supportAlerts) {
      changes.supportAlerts = { old: initialValues.current.supportAlerts, new: supportAlerts };
    }
    if (requireEmailVerification !== initialValues.current.requireEmailVerification) {
      changes.requireEmailVerification = { old: initialValues.current.requireEmailVerification, new: requireEmailVerification };
    }
    if (twoFactorEnabled !== initialValues.current.twoFactorEnabled) {
      changes.twoFactorEnabled = { old: initialValues.current.twoFactorEnabled, new: twoFactorEnabled };
    }
    if (sessionTimeout !== initialValues.current.sessionTimeout) {
      changes.sessionTimeout = { old: initialValues.current.sessionTimeout, new: sessionTimeout };
    }
    
    return changes;
  };

  const handleSave = async () => {
    setSaving(true);
    
    const changes = getChangedSettings();
    const hasChanges = Object.keys(changes).length > 0;
    
    // Simulate save - in production, this would save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log activity if there are changes
    if (hasChanges) {
      // Determine which category of settings changed
      const generalChanged = changes.siteName || changes.siteDescription || changes.maintenanceMode;
      const notificationsChanged = changes.emailNotifications || changes.newUserAlerts || changes.supportAlerts;
      const securityChanged = changes.requireEmailVerification || changes.twoFactorEnabled || changes.sessionTimeout;
      
      // Build a simplified changes summary for logging
      const changesSummary: Record<string, string> = {};
      Object.entries(changes).forEach(([key, value]) => {
        changesSummary[key] = `${value.old} → ${value.new}`;
      });
      
      // Log the overall settings update
      await logActivity({
        actionType: 'settings_updated',
        entityType: 'settings',
        details: {
          tab: activeTab,
          changes_count: Object.keys(changes).length,
          categories_changed: [
            generalChanged ? 'general' : null,
            notificationsChanged ? 'notifications' : null,
            securityChanged ? 'security' : null,
          ].filter((c): c is string => c !== null),
          changes: changesSummary,
        },
      });
      
      // Update initial values to reflect saved state
      initialValues.current = {
        siteName,
        siteDescription,
        maintenanceMode,
        emailNotifications,
        newUserAlerts,
        supportAlerts,
        requireEmailVerification,
        twoFactorEnabled,
        sessionTimeout,
      };
    }
    
    setSaving(false);
    toast({
      title: "Settings saved",
      description: hasChanges 
        ? `${Object.keys(changes).length} setting(s) have been updated successfully.`
        : "No changes to save.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Platform Settings
        </CardTitle>
        <CardDescription>
          Configure global platform settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Enter site name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-destructive font-medium">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to show maintenance page to all visitors
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="emailNotifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="newUserAlerts" className="font-medium">
                    New User Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new users sign up
                  </p>
                </div>
                <Switch
                  id="newUserAlerts"
                  checked={newUserAlerts}
                  onCheckedChange={setNewUserAlerts}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="supportAlerts" className="font-medium">
                    Support Ticket Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified for new support tickets
                  </p>
                </div>
                <Switch
                  id="supportAlerts"
                  checked={supportAlerts}
                  onCheckedChange={setSupportAlerts}
                />
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="requireEmailVerification" className="font-medium">
                    Require Email Verification
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify email before accessing features
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={requireEmailVerification}
                  onCheckedChange={setRequireEmailVerification}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="twoFactorEnabled" className="font-medium">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  id="twoFactorEnabled"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  min="15"
                  max="1440"
                />
                <p className="text-xs text-muted-foreground">
                  Automatically log out inactive users after this duration
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Appearance customization coming soon</p>
              <p className="text-sm">Theme colors, logo, and branding options</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6 pt-6 border-t">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformSettings;
