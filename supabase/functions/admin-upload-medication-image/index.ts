import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Constants for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Magic bytes for image validation
const IMAGE_SIGNATURES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header (WebP starts with RIFF)
};

function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function sanitizeString(str: string, maxLength: number = 100): string {
  return str.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim().slice(0, maxLength);
}

async function validateImageContent(file: File): Promise<{ valid: boolean; error?: string }> {
  try {
    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer.slice(0, 12));
    
    // Check for valid image magic bytes
    let isValidImage = false;
    
    // JPEG check
    if (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) {
      isValidImage = true;
    }
    // PNG check
    else if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
      isValidImage = true;
    }
    // GIF check
    else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
      isValidImage = true;
    }
    // WebP check (RIFF....WEBP)
    else if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
      // Check for WEBP at bytes 8-11
      if (header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50) {
        isValidImage = true;
      }
    }
    
    if (!isValidImage) {
      return { valid: false, error: "File content does not match a valid image format" };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: "Failed to validate file content" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user
    const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userData, error: userErr } = await authedClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Admin check + privileged actions
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleRow, error: roleErr } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "support", "moderator"])
      .maybeSingle();

    if (roleErr) {
      console.error("Role check error:", roleErr);
      return new Response(JSON.stringify({ error: "Authorization check failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse form data
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid form data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const file = form.get("file");
    const rawMedicationId = String(form.get("medicationId") || "").trim();
    const rawMedicationName = String(form.get("medicationName") || "").trim();
    const rawRoute = String(form.get("route") || "").trim();

    // Validate medicationId
    if (!rawMedicationId || !isValidUUID(rawMedicationId)) {
      return new Response(JSON.stringify({ error: "Valid medication ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const medicationId = rawMedicationId;

    // Sanitize optional fields
    const medicationName = sanitizeString(rawMedicationName, 100);
    const route = sanitizeString(rawRoute, 50);

    // Validate file exists and is a File
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "File is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: "File too large (max 5MB)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate actual file content (magic bytes check)
    const contentValidation = await validateImageContent(file);
    if (!contentValidation.valid) {
      return new Response(JSON.stringify({ error: contentValidation.error || "Invalid image content" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine file extension from MIME type
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const fileExt = mimeToExt[file.type] || 'png';

    const safeBaseName = (medicationName || medicationId)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

    // Include route in filename if provided
    const routeSuffix = route ? `-${route.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "")}` : "";
    const fileName = `${Date.now()}-${safeBaseName}${routeSuffix}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadErr } = await adminClient.storage
      .from("medication-assets")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadErr) {
      console.error("Storage upload error:", uploadErr);
      return new Response(JSON.stringify({ error: "Failed to upload file" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: urlData } = adminClient.storage
      .from("medication-assets")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // If route is specified, update nursing_guide with route-specific image
    if (route) {
      // Get current medication to preserve existing nursing_guide
      const { data: medData, error: fetchErr } = await adminClient
        .from("medications")
        .select("nursing_guide")
        .eq("id", medicationId)
        .single();

      if (fetchErr) {
        console.error("Medication fetch error:", fetchErr);
        return new Response(JSON.stringify({ error: "Failed to retrieve medication data" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const normalizedRoute = route.toLowerCase().replace(/\s+/g, "_");
      const currentGuide = (medData?.nursing_guide as Record<string, unknown>) || {};
      
      // Find matching key or use normalized route
      let targetKey = normalizedRoute;
      for (const key of Object.keys(currentGuide)) {
        if (key.toLowerCase() === normalizedRoute || key.toLowerCase().replace(/\s+/g, "_") === normalizedRoute) {
          targetKey = key;
          break;
        }
      }

      // Update nursing_guide with route-specific image
      const updatedGuide = {
        ...currentGuide,
        [targetKey]: {
          ...(currentGuide[targetKey] as Record<string, unknown> || {}),
          image_url: publicUrl
        }
      };

      const { error: updateErr } = await adminClient
        .from("medications")
        .update({ nursing_guide: updatedGuide })
        .eq("id", medicationId);

      if (updateErr) {
        console.error("Medication update error:", updateErr);
        return new Response(JSON.stringify({ error: "Failed to update medication record" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // No route specified, update main image_url
      const { error: updateErr } = await adminClient
        .from("medications")
        .update({ image_url: publicUrl })
        .eq("id", medicationId);

      if (updateErr) {
        console.error("Medication update error:", updateErr);
        return new Response(JSON.stringify({ error: "Failed to update medication record" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ publicUrl, filePath, route: route || null }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("admin-upload-medication-image error:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
