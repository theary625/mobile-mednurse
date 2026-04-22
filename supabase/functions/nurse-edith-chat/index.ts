import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting - per user
const userRateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW = 60000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = userRateLimits.get(userId);
  
  if (!userLimit || now > userLimit.resetAt) {
    userRateLimits.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

function validateMessages(messages: unknown): { role: string; content: string }[] | null {
  if (!Array.isArray(messages)) return null;
  if (messages.length === 0 || messages.length > 50) return null;
  
  for (const msg of messages) {
    if (typeof msg !== 'object' || msg === null) return null;
    if (typeof msg.role !== 'string' || !['user', 'assistant'].includes(msg.role)) return null;
    if (typeof msg.content !== 'string') return null;
    if (msg.content.length === 0 || msg.content.length > 5000) return null;
  }
  
  return messages as { role: string; content: string }[];
}

// Extract potential drug names from the user's latest message
function extractDrugTerms(message: string): string[] {
  // Split into words, filter short ones, deduplicate
  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3);
  
  // Also extract multi-word phrases (2-3 words) for brand names
  const phrases: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(words.slice(i, i + 2).join(' '));
    if (i < words.length - 2) {
      phrases.push(words.slice(i, i + 3).join(' '));
    }
  }
  
  // Filter out common non-drug words
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'some', 'them',
    'than', 'its', 'over', 'such', 'that', 'with', 'this', 'will', 'each',
    'from', 'they', 'what', 'about', 'would', 'there', 'their', 'which',
    'could', 'other', 'into', 'more', 'your', 'when', 'how', 'why', 'where',
    'who', 'does', 'should', 'tell', 'know', 'give', 'take', 'use', 'used',
    'using', 'help', 'need', 'want', 'like', 'make', 'just', 'also', 'well',
    'back', 'been', 'much', 'then', 'very', 'after', 'before', 'between',
    'under', 'again', 'further', 'once', 'here', 'both', 'few', 'those',
    'same', 'most', 'any', 'only', 'new', 'now', 'way', 'may', 'say',
    'she', 'him', 'his', 'get', 'got', 'let', 'still', 'keep', 'never',
    'really', 'think', 'because', 'good', 'give', 'day', 'too', 'right',
    'look', 'thing', 'see', 'time', 'could', 'people', 'long', 'made',
    'come', 'many', 'first', 'being', 'down', 'side', 'part', 'last',
    'work', 'name', 'year', 'did', 'nurse', 'patient', 'drug', 'medication',
    'dose', 'dosage', 'effect', 'effects', 'reaction', 'reactions', 'max',
    'maximum', 'minimum', 'min', 'info', 'information', 'about', 'what',
    'please', 'thanks', 'thank', 'hello', 'hey', 'edith',
  ]);
  
  const candidates = words.filter(w => !stopWords.has(w) && w.length >= 4);
  return [...new Set(candidates)].slice(0, 5); // Max 5 search terms
}

// Build context from medication data
function buildMedicationContext(medications: any[]): string {
  if (!medications || medications.length === 0) return '';
  
  const sections: string[] = ['## VERIFIED MEDICATION DATA FROM MEDNURSE DATABASE\n'];
  
  for (const med of medications.slice(0, 3)) { // Max 3 drugs to avoid token overflow
    const parts: string[] = [`### ${med.generic_name.toUpperCase()}`];
    
    if (med.brand_names?.length) parts.push(`**Brand Names:** ${med.brand_names.join(', ')}`);
    if (med.drug_class) parts.push(`**Drug Class:** ${med.drug_class}`);
    if (med.route?.length) parts.push(`**Route:** ${med.route.join(', ')}`);
    if (med.dosage_form) parts.push(`**Dosage Form:** ${med.dosage_form}`);
    if (med.strengths?.length) parts.push(`**Strengths:** ${med.strengths.join(', ')}`);
    if (med.high_alert) parts.push(`⚠️ **HIGH-ALERT MEDICATION**`);
    if (med.controlled_substance) parts.push(`🔒 **Controlled Substance**`);
    
    if (med.dosing_info) parts.push(`**Dosing Info:** ${JSON.stringify(med.dosing_info)}`);
    if (med.safety_info) parts.push(`**Safety Info:** ${JSON.stringify(med.safety_info)}`);
    if (med.nursing_guide) parts.push(`**Nursing Guide:** ${JSON.stringify(med.nursing_guide)}`);
    if (med.hold_parameters) parts.push(`**Hold Parameters:** ${JSON.stringify(med.hold_parameters)}`);
    if (med.monitoring) parts.push(`**Monitoring:** ${JSON.stringify(med.monitoring)}`);
    if (med.administration_info) parts.push(`**Administration:** ${JSON.stringify(med.administration_info)}`);
    if (med.adverse_reactions) parts.push(`**Adverse Reactions:** ${JSON.stringify(med.adverse_reactions)}`);
    if (med.drug_interactions_info) parts.push(`**Drug Interactions:** ${JSON.stringify(med.drug_interactions_info)}`);
    if (med.pharmacokinetics) parts.push(`**Pharmacokinetics:** ${JSON.stringify(med.pharmacokinetics)}`);
    if (med.clinical_pearls?.length) parts.push(`**Clinical Pearls:** ${med.clinical_pearls.join('; ')}`);
    if (med.red_flags) parts.push(`**Red Flags:** ${JSON.stringify(med.red_flags)}`);
    if (med.rate_dilution) parts.push(`**Rate/Dilution:** ${JSON.stringify(med.rate_dilution)}`);
    if (med.crushing_info) parts.push(`**Crushing Info:** ${JSON.stringify(med.crushing_info)}`);
    if (med.patient_education) parts.push(`**Patient Education:** ${JSON.stringify(med.patient_education)}`);
    if (med.adjustments) parts.push(`**Dose Adjustments:** ${JSON.stringify(med.adjustments)}`);
    if (med.fda_label_url) parts.push(`**FDA Label:** ${med.fda_label_url}`);
    
    sections.push(parts.join('\n'));
  }
  
  return sections.join('\n\n');
}

const SYSTEM_PROMPT = `You are Nurse Edith, a clinically accurate medication safety companion for healthcare professionals (MedNurse platform).

**CORE RULES:**
1. **Be concise.** No filler. No restating the question. Get to the answer.
2. **Use tables** for dosing, parameters, comparisons, and lab values — always prefer a markdown table over bullet lists when data has 2+ columns.
3. **Cite sources**: "Per MedNurse database..." or "Per AHA 2025 guidelines..." — never guess.
4. **Flag uncertainty**: Say "Verify with pharmacy" if unsure. Never fabricate clinical data.
5. **Safety first**: Black box warnings, high-alert flags, and hold parameters go at the TOP.
6. **Prioritize verified data**: When MedNurse database data is provided below, base your answer on it.

---

## RESPONSE TEMPLATES

### GENERAL MEDICATION QUESTION:

**[Drug Name]** — [one-line summary of what it is/does]

| Parameter | Value |
|-----------|-------|
| Class | [drug class] |
| Route | [routes] |
| Typical Dose | [dose range] |
| Frequency | [schedule] |

⚠️ **Hold If:** [hold parameters in a compact line]

**Key Nursing Points:**
- [point 1]
- [point 2]
- [point 3 max]

📋 *Source: MedNurse verified data / [guideline]*

---

### ADMINISTRATION QUESTION (triggered by: "administer", "give", "push", "infuse", "inject", "rate", "dilute", "hang", "drip", "bolus", "reconstitute", "prepare", "draw up"):

**[Drug Name] — [Route] Administration**

🏥 **Prep**
| Item | Detail |
|------|--------|
| Equipment | [list] |
| Dilution | [instructions or "None needed"] |
| Compatibility | [NS/D5W/LR] |

💉 **Give**
| Step | Detail |
|------|--------|
| Rate | [rate with math if applicable] |
| Technique | [specifics] |
| Flush | [before/after instructions] |

👀 **Monitor**
| When | What |
|------|------|
| During | [vitals/rhythm to watch] |
| Post (5-15 min) | [reassessment targets] |
| Hold if | [specific parameters] |

📝 **Chart:** Drug, dose, route, site, time, pre/post vitals, response.

📋 *Source: MedNurse verified data. Verify with facility protocols.*

---

### DOSE CALCULATION:

Show the math step-by-step:
\`\`\`
Given: [values]
Formula: [formula]
Calculation: [step-by-step]
Answer: [result with units]
\`\`\`

Then add a safety check table:

| Check | Status |
|-------|--------|
| Within max dose? | ✅/❌ |
| Weight-appropriate? | ✅/❌ |
| Renal adjustment? | [needed/not needed] |

---

### DRUG COMPARISON:

| Feature | Drug A | Drug B |
|---------|--------|--------|
| Class | | |
| Onset | | |
| Duration | | |
| Route | | |
| Key Advantage | | |
| Key Risk | | |

---

## FORMATTING RULES:
- Max 3-4 short sections per response
- Tables > bullets > paragraphs (in order of preference)
- Bold drug names, doses, and critical numbers
- Use ⚠️ for warnings, ✅ for safe, ❌ for contraindicated, 🔒 for controlled
- Never exceed 5 bullet points in any list
- No emoji overload — use sparingly for clinical markers only
- Skip pleasantries. No "Great question!" or "I'd be happy to help!"

Nurses are busy. Be their smartest, fastest pocket reference.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    if (!checkRateLimit(userId)) {
      console.warn(`Rate limit exceeded for user: ${userId}`);
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const validatedMessages = validateMessages(body.messages);
    
    if (!validatedMessages) {
      return new Response(JSON.stringify({ error: "Invalid message format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // --- RAG: Extract drug terms from the latest user message and query DB ---
    const lastUserMessage = [...validatedMessages].reverse().find(m => m.role === 'user');
    let medicationContext = '';
    
    if (lastUserMessage) {
      const drugTerms = extractDrugTerms(lastUserMessage.content);
      console.log(`Extracted drug terms: ${JSON.stringify(drugTerms)}`);
      
      if (drugTerms.length > 0) {
        // Use service role to bypass RLS for medication lookup
        const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const allMeds: any[] = [];
        const seenIds = new Set<string>();
        
        // Search for each term
        for (const term of drugTerms) {
          try {
            const { data, error } = await serviceSupabase.rpc('search_medications', {
              search_query: term,
              max_results: 3,
            });
            
            if (!error && data) {
              for (const med of data) {
                if (!seenIds.has(med.id)) {
                  seenIds.add(med.id);
                  allMeds.push(med);
                }
              }
            }
          } catch (e) {
            console.error(`Error searching for "${term}":`, e);
          }
        }
        
        if (allMeds.length > 0) {
          medicationContext = buildMedicationContext(allMeds);
          console.log(`Found ${allMeds.length} medications for context`);
        }
      }
    }

    // Build the final system prompt with medication context
    const finalSystemPrompt = medicationContext
      ? `${SYSTEM_PROMPT}\n\n---\n\n${medicationContext}\n\n---\nThe above medication data comes from the MedNurse verified database. Prioritize this data in your response.`
      : SYSTEM_PROMPT;

    console.log(`Processing chat for user ${userId} with ${validatedMessages.length} messages, context: ${medicationContext ? 'yes' : 'no'}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: finalSystemPrompt },
          ...validatedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response back to client");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Nurse Edith chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
