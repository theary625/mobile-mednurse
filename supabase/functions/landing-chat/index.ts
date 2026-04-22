import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory rate limiting (resets on cold start, but provides basic protection)
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // 10 requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

const SYSTEM_PROMPT = `You're Edith, the friendly MedNurse assistant. You can ONLY answer questions about the MedNurse platform—if asked about anything else, politely redirect to MedNurse topics.

Sound human—use contractions, keep it casual, match their energy.

**CRITICAL: Keep responses to 1-2 SHORT sentences max. Be punchy.**

**KNOW THIS:**
- Award-winning medication safety app for nurses (50,000+ users, 4.9 stars)
- $12.99/month or $129/year (full access, no locked features)
- Custom pricing for universities and hospitals
- HIPAA compliant, no EMR connection, no PHI stored

**FEATURES:** Drug lookups (1,600+ meds), interaction alerts, IV compatibility, dosing calculators, Ask Edith AI, 50+ clinical tools, CE courses, bedside guidance

**EXAMPLES:**

User: "What is MedNurse?"
You: "Medication safety and educational tool for nurses—drug lookups, interaction alerts, dosing calcs, CE courses, and clinical tools all in one. Want details on a specific feature?"

User: "How much?"
You: "$12.99/month or $129/year. Full access, no locked features."

User: "Drug interactions?"
You: "Yep! Search two meds and get instant alerts with severity and clinical details."

User: "Free trial?"
You: "No free trial, but monthly is cancel-anytime. Annual saves you 2 months!"

User: "I'm a student"
You: "Great for clinicals! Check if your school has a university plan—otherwise individual membership works too."

User: "Clinical tools?"
You: "50+ scoring tools—NIHSS, GCS, APACHE II, Wells, plus dosing calculators."

User: "Is it secure?"
You: "HIPAA compliant, no EMR connection, no patient data stored."

If they ask medical questions, redirect them to sign up and use the app.`;

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const limit = ipRateLimits.get(clientIp);

  if (limit && now < limit.resetAt) {
    if (limit.count >= RATE_LIMIT_MAX) {
      return false;
    }
    limit.count++;
  } else {
    ipRateLimits.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  }

  // Cleanup old entries periodically
  if (ipRateLimits.size > 1000) {
    const entries = Array.from(ipRateLimits.entries());
    for (const [ip, data] of entries) {
      if (now >= data.resetAt) {
        ipRateLimits.delete(ip);
      }
    }
  }

  return true;
}

function validateMessages(messages: unknown): { role: string; content: string }[] | null {
  if (!Array.isArray(messages)) return null;
  if (messages.length === 0 || messages.length > 20) return null;
  
  for (const msg of messages) {
    if (typeof msg !== 'object' || msg === null) return null;
    if (typeof msg.role !== 'string' || !['user', 'assistant'].includes(msg.role)) return null;
    if (typeof msg.content !== 'string') return null;
    if (msg.content.length > 2000) return null; // Max 2000 chars per message
  }
  
  return messages as { role: string; content: string }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof body !== 'object' || body === null) {
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = validateMessages((body as Record<string, unknown>).messages);
    if (!messages) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Landing chat request with", messages.length, "messages from IP:", clientIp);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Service busy. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Landing chat error:", e);
    return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
