import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff, RefreshCw } from "lucide-react";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject: string;
  greeting: string;
  body_text: string;
  closing_text: string;
  updated_at: string;
}

interface TemplateForm {
  subject: string;
  greeting: string;
  body_text: string;
  closing_text: string;
  logo_url: string;
  header_color: string;
}

const CUSTOMER_SAMPLE = {
  name: "Jane Smith",
  date: "March 15, 2026",
  time: "10:00 AM",
  timezone: "Eastern Time",
};

const ADMIN_SAMPLE = {
  name: "Jane Smith",
  email: "jane@example.com",
  company: "Acme Healthcare",
  phone: "(555) 123-4567",
  date: "March 15, 2026",
  time: "10:00 AM",
  timezone: "Eastern Time",
  message: "Interested in learning more about medication safety features.",
};

const replacePlaceholders = (text: string, data: Record<string, string>) => {
  let result = text;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
};

const CUSTOMER_PLACEHOLDERS = ["{name}", "{date}", "{time}", "{timezone}"];
const ADMIN_PLACEHOLDERS = ["{name}", "{email}", "{company}", "{phone}", "{date}", "{time}", "{timezone}", "{message}"];

const DemoEmailTemplateManager = () => {
  const [customerTemplate, setCustomerTemplate] = useState<EmailTemplate | null>(null);
  const [adminTemplate, setAdminTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [showCustomerPreview, setShowCustomerPreview] = useState(false);
  const [showAdminPreview, setShowAdminPreview] = useState(false);
  const [customerForm, setCustomerForm] = useState<TemplateForm>({ subject: "", greeting: "", body_text: "", closing_text: "", logo_url: "", header_color: "#0D4F4F" });
  const [adminForm, setAdminForm] = useState<TemplateForm>({ subject: "", greeting: "", body_text: "", closing_text: "", logo_url: "", header_color: "#0D4F4F" });
  const { toast } = useToast();

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("demo_email_templates")
      .select("*")
      .in("template_key", ["customer_confirmation", "admin_notification"]);

    if (error) {
      toast({ title: "Error loading templates", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    let customer = data?.find((t) => t.template_key === "customer_confirmation") ?? null;
    let admin = data?.find((t) => t.template_key === "admin_notification") ?? null;

    if (!customer) {
      const { data: newRow, error: insertErr } = await supabase
        .from("demo_email_templates")
        .insert({
          template_key: "customer_confirmation",
          subject: "Your MedNurse Demo is Confirmed!",
          greeting: "Hi {name},",
          body_text: "Thank you for scheduling a demo with MedNurse!\n\nYour demo is confirmed for {date} at {time} ({timezone}).\n\nWe look forward to showing you how MedNurse can help streamline your workflow.",
          closing_text: "Best regards, The MedNurse Team",
        })
        .select()
        .single();
      if (insertErr) {
        toast({ title: "Error creating customer template", description: insertErr.message, variant: "destructive" });
      } else if (newRow) {
        customer = newRow;
      }
    }

    if (!admin) {
      const { data: newRow, error: insertErr } = await supabase
        .from("demo_email_templates")
        .insert({
          template_key: "admin_notification",
          subject: "New Demo Booking: {name}",
          greeting: "New Demo Booking Received",
          body_text: "Name: {name}\nEmail: {email}\nCompany: {company}\nPhone: {phone}\n\nScheduled: {date} at {time} ({timezone})\n\nMessage: {message}",
          closing_text: "-- MedNurse Booking System",
        })
        .select()
        .single();
      if (insertErr) {
        toast({ title: "Error creating admin template", description: insertErr.message, variant: "destructive" });
      } else if (newRow) {
        admin = newRow;
      }
    }

    if (customer) {
      setCustomerTemplate(customer);
      setCustomerForm({ subject: customer.subject, greeting: customer.greeting, body_text: customer.body_text, closing_text: customer.closing_text, logo_url: (customer as any).logo_url || "", header_color: (customer as any).header_color || "#0D4F4F" });
    }
    if (admin) {
      setAdminTemplate(admin);
      setAdminForm({ subject: admin.subject, greeting: admin.greeting, body_text: admin.body_text, closing_text: admin.closing_text, logo_url: (admin as any).logo_url || "", header_color: (admin as any).header_color || "#0D4F4F" });
    }

    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleSave = async (type: "customer" | "admin") => {
    const template = type === "customer" ? customerTemplate : adminTemplate;
    const form = type === "customer" ? customerForm : adminForm;
    const setSaving = type === "customer" ? setSavingCustomer : setSavingAdmin;
    if (!template) return;
    setSaving(true);

    const { error } = await supabase
      .from("demo_email_templates")
      .update({ subject: form.subject, greeting: form.greeting, body_text: form.body_text, closing_text: form.closing_text, logo_url: form.logo_url, header_color: form.header_color } as any)
      .eq("id", template.id);

    if (error) {
      toast({ title: "Error saving template", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    try {
      await supabase.functions.invoke("send-demo-booking-emails", {
        body: { _type: "template_update_alert", subject: form.subject },
      });
    } catch { /* best-effort */ }

    toast({ title: "Template saved", description: `${type === "customer" ? "Customer confirmation" : "Admin notification"} email template updated.` });
    setSaving(false);
    fetchTemplates();
  };

  const buildPreviewHtml = (form: TemplateForm, sampleData: Record<string, string>, title: string) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:${form.header_color || '#0D4F4F'};padding:30px;text-align:center;border-radius:12px 12px 0 0;">
        ${form.logo_url ? `<img src="${form.logo_url}" alt="Logo" style="max-height:60px;max-width:200px;" />` : `<h1 style="color:#fff;margin:0;font-size:24px;">MedNurse</h1>`}
      </div>
      <div style="padding:30px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
        ${title ? `<h2 style="color:#333;margin-top:0;">${title}</h2>` : ""}
        <p style="color:#555;">${replacePlaceholders(form.greeting, sampleData)}</p>
        <p style="color:#555;white-space:pre-wrap;">${replacePlaceholders(form.body_text, sampleData)}</p>
        <p style="color:#555;white-space:pre-wrap;">${replacePlaceholders(form.closing_text, sampleData)}</p>
      </div>
    </div>
  `;

  const renderTemplateForm = (
    type: "customer" | "admin",
    form: TemplateForm,
    setForm: (f: TemplateForm) => void,
    saving: boolean,
    showPreview: boolean,
    setShowPreview: (v: boolean) => void,
    placeholders: string[],
    sampleData: Record<string, string>,
    previewTitle: string,
  ) => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs text-muted-foreground mr-1">Placeholders:</span>
        {placeholders.map((p) => (
          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Logo URL</Label>
          <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="https://example.com/logo.png" />
        </div>
        <div className="space-y-2">
          <Label>Header Color</Label>
          <div className="flex gap-2">
            <input type="color" value={form.header_color || "#0D4F4F"} onChange={(e) => setForm({ ...form, header_color: e.target.value })} className="h-10 w-12 rounded border border-input cursor-pointer" />
            <Input value={form.header_color} onChange={(e) => setForm({ ...form, header_color: e.target.value })} placeholder="#0D4F4F" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>
        <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Greeting</Label>
        <Input value={form.greeting} onChange={(e) => setForm({ ...form, greeting: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Body</Label>
        <Textarea value={form.body_text} onChange={(e) => setForm({ ...form, body_text: e.target.value })} rows={6} />
      </div>
      <div className="space-y-2">
        <Label>Closing</Label>
        <Input value={form.closing_text} onChange={(e) => setForm({ ...form, closing_text: e.target.value })} />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => handleSave(type)} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Template"}
        </Button>
        <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="gap-2">
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? "Hide Preview" : "Live Preview"}
        </Button>
      </div>

      {showPreview && (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <div className="bg-muted px-3 py-2 text-xs text-muted-foreground font-medium">Preview (with sample data)</div>
          <div className="p-4 bg-white" dangerouslySetInnerHTML={{ __html: buildPreviewHtml(form, sampleData, previewTitle) }} />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Email Templates</CardTitle>
        <CardDescription>Edit emails sent when a demo is booked.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="customer">
          <TabsList className="mb-4">
            <TabsTrigger value="customer">Customer Confirmation</TabsTrigger>
            <TabsTrigger value="admin">Admin Notification</TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            {renderTemplateForm("customer", customerForm, setCustomerForm, savingCustomer, showCustomerPreview, setShowCustomerPreview, CUSTOMER_PLACEHOLDERS, CUSTOMER_SAMPLE, "")}
          </TabsContent>
          <TabsContent value="admin">
            {renderTemplateForm("admin", adminForm, setAdminForm, savingAdmin, showAdminPreview, setShowAdminPreview, ADMIN_PLACEHOLDERS, ADMIN_SAMPLE, "New Demo Booking 📋")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DemoEmailTemplateManager;
