import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml",
};

const BASE_URL = "https://mednurse.com";

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/plans", priority: "0.9", changefreq: "weekly" },
  { url: "/medication-error-prevention", priority: "0.8", changefreq: "monthly" },
  { url: "/bedside-guidance", priority: "0.8", changefreq: "monthly" },
  { url: "/nursing-safety-tools", priority: "0.8", changefreq: "monthly" },
  { url: "/iv-infusion-safety", priority: "0.8", changefreq: "monthly" },
  { url: "/patient-education", priority: "0.8", changefreq: "monthly" },
  { url: "/hospital-compliance", priority: "0.8", changefreq: "monthly" },
  { url: "/ask-edith", priority: "0.7", changefreq: "monthly" },
  { url: "/about", priority: "0.6", changefreq: "monthly" },
  { url: "/press", priority: "0.6", changefreq: "monthly" },
  { url: "/blog", priority: "0.7", changefreq: "weekly" },
  { url: "/contact", priority: "0.5", changefreq: "monthly" },
  { url: "/privacy", priority: "0.3", changefreq: "yearly" },
  { url: "/security", priority: "0.3", changefreq: "yearly" },
  { url: "/terms", priority: "0.3", changefreq: "yearly" },
  { url: "/editorial", priority: "0.4", changefreq: "yearly" },
];

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function generateUrlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string
): string {
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch published blog posts
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true)
      .eq("is_archived", false)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }

    const today = formatDate(new Date());
    
    // Generate static page entries
    const staticEntries = staticPages.map((page) =>
      generateUrlEntry(page.url, today, page.changefreq, page.priority)
    );

    // Generate blog post entries
    const blogEntries = (blogPosts || []).map((post) => {
      const lastmod = formatDate(post.updated_at || post.published_at || new Date());
      return generateUrlEntry(`/blog/${post.slug}`, lastmod, "monthly", "0.6");
    });

    // Combine all entries
    const allEntries = [...staticEntries, ...blogEntries];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.join("\n")}
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  }
});
