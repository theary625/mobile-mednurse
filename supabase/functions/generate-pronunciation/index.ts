import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate and sanitize medication name
function sanitizeMedicationName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  // Only allow alphanumeric, spaces, and hyphens - common in drug names
  const sanitized = name.replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
  if (sanitized.length === 0 || sanitized.length > 100) return null;
  return sanitized;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify authentication
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    
    if (!jwt) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userData, error: userErr } = await authedClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const medicationName = sanitizeMedicationName(body.medicationName);
    if (!medicationName) {
      return new Response(
        JSON.stringify({ error: "Invalid medication name" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating pronunciation for: ${medicationName}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a medical pronunciation expert. Generate phonetic pronunciations for medication names using syllable breakdowns. 
            
Rules:
- Use capital letters to indicate the stressed syllable
- Separate syllables with hyphens
- Use common phonetic spellings that are easy to read
- Keep it concise and clear

Examples:
- metoprolol → meh-TOE-pro-lol
- lisinopril → lye-SIN-oh-pril
- atorvastatin → ah-TOR-vah-sta-tin
- hydrochlorothiazide → hy-droh-klor-oh-THY-ah-zide
- omeprazole → oh-MEP-rah-zole
- amlodipine → am-LOH-dih-peen

Return ONLY the phonetic pronunciation, nothing else.`
          },
          {
            role: 'user',
            content: `Generate the phonetic pronunciation for: ${medicationName}`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status);
      return new Response(
        JSON.stringify({ error: "Failed to generate pronunciation" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const pronunciation = data.choices?.[0]?.message?.content?.trim();

    if (!pronunciation) {
      return new Response(
        JSON.stringify({ error: "Failed to generate pronunciation" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generated pronunciation: ${pronunciation}`);

    return new Response(
      JSON.stringify({ pronunciation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating pronunciation:', error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
