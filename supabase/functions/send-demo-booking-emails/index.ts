import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  use_tls: boolean;
  is_active: boolean;
}

async function getSmtpSettings(supabase: any): Promise<SmtpSettings | null> {
  const { data } = await supabase
    .from("smtp_settings")
    .select("*")
    .eq("setting_key", "demo_booking")
    .eq("is_active", true)
    .maybeSingle();

  if (data && data.host && data.username && data.password && data.from_email) {
    return data as SmtpSettings;
  }
  return null;
}

async function sendViaSmtp(
  smtp: SmtpSettings,
  to: string,
  subject: string,
  html: string
) {
  // Validate email addresses before attempting to send
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const fromAddr = smtp.from_email?.trim();
  const toAddr = to?.trim();

  console.log(`SMTP send: from="${smtp.from_name} <${fromAddr}>", to="${toAddr}", subject="${subject}"`);

  if (!fromAddr || !emailRegex.test(fromAddr)) {
    throw new Error(`Invalid from email address: "${fromAddr}"`);
  }
  if (!toAddr || !emailRegex.test(toAddr)) {
    throw new Error(`Invalid to email address: "${toAddr}"`);
  }

  // Port 465 = implicit TLS; Port 587 = STARTTLS (tls must be false)
  const useTls = smtp.port === 465;

  const client = new SMTPClient({
    connection: {
      hostname: smtp.host,
      port: smtp.port,
      tls: useTls,
      auth: {
        username: smtp.username,
        password: smtp.password,
      },
    },
  });

  await client.send({
    from: `${smtp.from_name} <${fromAddr}>`,
    to: toAddr,
    subject,
    content: "auto",
    html,
  });

  await client.close();
}

async function sendViaResend(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Failed to send email to ${to}:`, err);
  }
  return res;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();

    // Handle SMTP test
    if (body._type === "smtp_test") {
      const smtpSettings = await getSmtpSettings(supabase);
      if (!smtpSettings) {
        return new Response(
          JSON.stringify({ success: false, error: "SMTP is not active or settings are incomplete" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      try {
        await sendViaSmtp(
          smtpSettings,
          smtpSettings.from_email,
          "MedNurse SMTP Test",
          "<h2>SMTP Test Successful</h2><p>Your SMTP settings are working correctly.</p>"
        );
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        console.error("SMTP test failed:", e);
        let errorMsg = e.message || String(e);
        // Detect edge runtime TLS limitation
        if (errorMsg.includes("BadResource") || errorMsg.includes("startTls") || errorMsg.includes("operation not supported")) {
          if (smtpSettings.port === 587) {
            errorMsg = "Port 587 (STARTTLS) is not supported in this environment. Please switch to port 465 (SSL/TLS) in your SMTP settings and try again.";
          } else {
            errorMsg = "Direct SMTP connections are not supported in this environment. Please use the Resend API fallback by disabling SMTP.";
          }
        }
        return new Response(
          JSON.stringify({ success: false, error: errorMsg }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Handle template update alert
    if (body._type === "template_update_alert") {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

      await sendViaResend(
        RESEND_API_KEY,
        "MedNurse <noreply@mednurse.com>",
        "info@mednurse.com",
        "Email Template Updated",
        `<p>The demo booking confirmation email template has been updated by an admin.</p><p>New subject: <strong>${body.subject}</strong></p>`
      );

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normal booking email flow
    const { name, email, company, phone, scheduled_date, scheduled_time, timezone, message } = body;

    if (!name || !email || !scheduled_date || !scheduled_time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const timezoneLabel = timezone?.replace("America/", "").replace(/_/g, " ") || "Eastern Time";

    // Placeholder replacer for all booking fields
    const replaceAll = (t: string) =>
      t
        .replace(/\{name\}/g, name)
        .replace(/\{email\}/g, email)
        .replace(/\{company\}/g, company || "—")
        .replace(/\{phone\}/g, phone || "—")
        .replace(/\{date\}/g, scheduled_date)
        .replace(/\{time\}/g, scheduled_time)
        .replace(/\{timezone\}/g, timezoneLabel)
        .replace(/\{message\}/g, message || "—");

    // Fetch both templates
    let customerSubject = "Your MedNurse Demo is Confirmed!";
    let customerGreeting = `Hi ${name},`;
    let customerBody = `Thank you for scheduling a demo with MedNurse. Here are your booking details:\n\n📅 Date: ${scheduled_date}\n🕐 Time: ${scheduled_time} (${timezoneLabel})\n\nA member of our team will reach out with meeting details shortly. We look forward to showing you how MedNurse can transform medication safety at your organization.`;
    let customerClosing = `Best regards,\nThe MedNurse Team`;
    let alertEmail = "info@mednurse.com";

    let adminSubject = `New Demo Booking: ${name}`;
    let adminGreeting = "New Demo Booking Received";
    let adminBody = `📋 Booking Details:\n\n👤 Name: ${name}\n📧 Email: ${email}\n🏢 Company: ${company || "—"}\n📱 Phone: ${phone || "—"}\n📅 Date: ${scheduled_date}\n🕐 Time: ${scheduled_time} (${timezoneLabel})\n🌐 Timezone: ${timezoneLabel}\n\n💬 Message:\n${message || "—"}`;
    let adminClosing = "— MedNurse Booking System";

    try {
      const { data: templates } = await supabase
        .from("demo_email_templates")
        .select("*")
        .in("template_key", ["customer_confirmation", "admin_notification"]);

      if (templates) {
        const custTpl = templates.find((t: any) => t.template_key === "customer_confirmation");
        const adminTpl = templates.find((t: any) => t.template_key === "admin_notification");

        if (custTpl) {
          customerSubject = replaceAll(custTpl.subject);
          customerGreeting = replaceAll(custTpl.greeting);
          customerBody = replaceAll(custTpl.body_text);
          customerClosing = replaceAll(custTpl.closing_text);
          if (custTpl.alert_email) alertEmail = custTpl.alert_email;
        }
        if (adminTpl) {
          adminSubject = replaceAll(adminTpl.subject);
          adminGreeting = replaceAll(adminTpl.greeting);
          adminBody = replaceAll(adminTpl.body_text);
          adminClosing = replaceAll(adminTpl.closing_text);
          if (adminTpl.alert_email) alertEmail = adminTpl.alert_email;
        }
      }
    } catch (e) {
      console.error("Failed to fetch email templates, using defaults:", e);
    }

    const buildEmailHtml = (title: string, greeting: string, body: string, closing: string, logoUrl?: string, headerColor?: string) => {
      const bgColor = headerColor || '#0D4F4F';
      const logoHtml = logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height:60px;max-width:200px;" />` : `<h1 style="color:#fff;margin:0;font-size:24px;">MedNurse</h1>`;
      return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">` +
`<div style="background:${bgColor};padding:30px;text-align:center;border-radius:12px 12px 0 0;">` +
`${logoHtml}</div>` +
`<div style="padding:30px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">` +
(title ? `<h2 style="color:#333;margin-top:0;">${title}</h2>` : "") +
`<p style="color:#555;">${greeting}</p>` +
`<p style="color:#555;white-space:pre-wrap;">${body}</p>` +
`<p style="color:#555;white-space:pre-wrap;">${closing}</p>` +
`</div></div>`;
    };

    // Extract logo/color from templates
    let customerLogoUrl = '';
    let customerHeaderColor = '#0D4F4F';
    let adminLogoUrl = '';
    let adminHeaderColor = '#0D4F4F';

    try {
      const { data: brandingData } = await supabase
        .from("demo_email_templates")
        .select("template_key, logo_url, header_color")
        .in("template_key", ["customer_confirmation", "admin_notification"]);
      if (brandingData) {
        const custB = brandingData.find((t: any) => t.template_key === "customer_confirmation");
        const adminB = brandingData.find((t: any) => t.template_key === "admin_notification");
        if (custB) { customerLogoUrl = custB.logo_url || ''; customerHeaderColor = custB.header_color || '#0D4F4F'; }
        if (adminB) { adminLogoUrl = adminB.logo_url || ''; adminHeaderColor = adminB.header_color || '#0D4F4F'; }
      }
    } catch (e) { console.error("Failed to fetch branding:", e); }

    const customerHtml = buildEmailHtml("", customerGreeting, customerBody, customerClosing, customerLogoUrl, customerHeaderColor);
    const adminHtml = buildEmailHtml("New Demo Booking 📋", adminGreeting, adminBody, adminClosing, adminLogoUrl, adminHeaderColor);

    // Determine sending method
    const smtpSettings = await getSmtpSettings(supabase);

    // When SMTP is active, send admin alert to the SMTP from_email address
    const adminAlertRecipient = smtpSettings ? smtpSettings.from_email : alertEmail;

    if (smtpSettings) {
      // Send via SMTP
      try {
        await Promise.all([
          sendViaSmtp(smtpSettings, adminAlertRecipient, adminSubject, adminHtml),
          sendViaSmtp(smtpSettings, email, customerSubject, customerHtml),
        ]);
      } catch (smtpErr) {
        console.error("SMTP sending failed, falling back to Resend:", smtpErr);
        // Fallback to Resend
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (RESEND_API_KEY) {
          const from = "MedNurse <noreply@mednurse.com>";
          await Promise.all([
            sendViaResend(RESEND_API_KEY, from, alertEmail, `New Demo Booking: ${name}`, adminHtml),
            sendViaResend(RESEND_API_KEY, from, email, customerSubject, customerHtml),
          ]);
        } else {
          throw smtpErr;
        }
      }
    } else {
      // Send via Resend (default)
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (!RESEND_API_KEY) throw new Error("No email sending method configured");

      const from = "MedNurse <noreply@mednurse.com>";
      await Promise.all([
        sendViaResend(RESEND_API_KEY, from, alertEmail, `New Demo Booking: ${name}`, adminHtml),
        sendViaResend(RESEND_API_KEY, from, email, customerSubject, customerHtml),
      ]);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending demo booking emails:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
