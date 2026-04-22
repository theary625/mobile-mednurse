import { useState, useEffect } from "react";
import SEOPageLayout from "@/components/seo/SEOPageLayout";
import SEOHero from "@/components/seo/SEOHero";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { calculateReadTime, formatReadTime } from "@/lib/blogUtils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  published_at: string | null;
  featured_image: string | null;
}

// Fallback posts for when database is empty
const fallbackPosts = [
  { title: "10 Common Medication Errors and How to Prevent Them", category: "Safety", href: "/medication-error-prevention" },
  { title: "IV Compatibility: What Every Nurse Needs to Know", category: "Clinical", href: "/iv-infusion-safety" },
  { title: "Effective Patient Medication Teaching Strategies", category: "Education", href: "/patient-education" },
  { title: "Meeting Joint Commission Medication Safety Goals", category: "Compliance", href: "/hospital-compliance" },
  { title: "Clinical Calculators Every Nurse Should Use", category: "Tools", href: "/nursing-safety-tools" },
  { title: "Bedside Medication Guidance Best Practices", category: "Clinical", href: "/bedside-guidance" },
];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, content, category, published_at, featured_image")
        .eq("is_published", true)
        .eq("is_archived", false)
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const hasDatabasePosts = posts.length > 0;

  return (
    <SEOPageLayout
      title="MedNurse Blog - Medication Safety Resources"
      description="Expert insights on medication safety, nursing best practices, clinical tools, and patient education. Stay current with the latest in medication safety."
      keywords="nursing blog, medication safety articles, nursing education, clinical resources"
      canonicalUrl="/blog"
      breadcrumbLabel="Blog"
    >
      <SEOHero
        badge="Resources"
        title="Medication Safety"
        highlightedText="Insights"
        description="Expert articles on medication safety, clinical best practices, and nursing education. Stay informed with the latest evidence-based insights."
      />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasDatabasePosts
                ? posts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all overflow-hidden flex flex-col"
                    >
                      {post.featured_image && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                            <Clock className="w-3 h-3" />
                            {formatReadTime(calculateReadTime(post.content || post.excerpt))}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-1">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all mt-auto">
                          Read more <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))
                : fallbackPosts.map((post) => (
                    <Link
                      key={post.title}
                      to={post.href}
                      className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                        {post.category}
                      </span>
                      <h3 className="font-semibold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  ))}
            </div>
          )}
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default Blog;
