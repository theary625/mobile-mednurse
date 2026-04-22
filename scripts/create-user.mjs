import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function parseDotEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function getConfig() {
  const dotEnvPath = path.resolve(process.cwd(), ".env");
  const dotEnv = parseDotEnvFile(dotEnvPath);

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    dotEnv.SUPABASE_URL ||
    dotEnv.VITE_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SUPABASE_SERVICE_KEY;

  return { supabaseUrl, serviceRoleKey };
}

function usage() {
  console.log(
    [
      "Usage:",
      "  SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-user.mjs <email> <password>",
      "",
      "Example:",
      "  SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-user.mjs test@gmail.com test1234",
    ].join("\n")
  );
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  usage();
  process.exit(1);
}

const { supabaseUrl, serviceRoleKey } = getConfig();

if (!supabaseUrl) {
  console.error("Missing Supabase URL. Set SUPABASE_URL or VITE_SUPABASE_URL (or add VITE_SUPABASE_URL to .env).");
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error(
    "Missing service role key. Set SUPABASE_SERVICE_ROLE_KEY (do NOT put this in a frontend .env shipped to users)."
  );
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error(`Failed to create user: ${error.message}`);
  process.exit(1);
}

console.log(`Created user ${data.user.id} (${data.user.email})`);

