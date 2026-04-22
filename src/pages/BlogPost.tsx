import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOPageLayout from "@/components/seo/SEOPageLayout";
import ArticleSchema from "@/components/seo/ArticleSchema";
import { ArrowLeft, Calendar, User, BookOpen, Clock } from "lucide-react";
import { format } from "date-fns";
import { calculateReadTime, formatReadTime } from "@/lib/blogUtils";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  citations: string[] | null;
  author_id: string | null;
}

interface AuthorData {
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        navigate("/blog");
        return;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .eq("is_archived", false)
        .maybeSingle();

      if (error || !data) {
        navigate("/blog");
        return;
      }

      setPost(data);

      // Fetch author info if author_id exists
      if (data.author_id) {
        const { data: authorData } = await supabase
          .from("profiles")
          .select("full_name, first_name, last_name, avatar_url")
          .eq("user_id", data.author_id)
          .maybeSingle();

        if (authorData) {
          setAuthor(authorData);
        }
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug, navigate]);

  const getAuthorName = () => {
    if (!author) return "MedNurse Team";
    if (author.full_name) return author.full_name;
    if (author.first_name || author.last_name) {
      return `${author.first_name || ""} ${author.last_name || ""}`.trim();
    }
    return "MedNurse Team";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const readTime = calculateReadTime(post.content);
  const baseUrl = "https://mednurse.com";

  return (
    <SEOPageLayout
      title={`${post.title} | MedNurse Blog`}
      description={post.excerpt || `Read about ${post.title} on the MedNurse blog.`}
      keywords={`${post.category}, medication safety, nursing`}
      canonicalUrl={`/blog/${post.slug}`}
      breadcrumbLabel={post.title}
    >
      <ArticleSchema
        title={post.title}
        description={post.excerpt || `Read about ${post.title} on the MedNurse blog.`}
        datePublished={post.published_at || post.created_at}
        dateModified={post.published_at || post.created_at}
        authorName={getAuthorName()}
        url={`${baseUrl}/blog/${post.slug}`}
        imageUrl={post.featured_image || `${baseUrl}/og-image.jpg`}
      />
      
      <article className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="w-3 h-3" />
                {formatReadTime(readTime)}
              </span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {getAuthorName()}
              </div>
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </div>
              )}
            </div>
          </header>

          {post.featured_image && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-justify">
              {post.excerpt}
            </p>
          )}

          {post.content && (
            <div className="prose prose-lg max-w-none text-foreground">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* References / Citations Section */}
          {post.citations && post.citations.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg text-foreground">References</h2>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {post.citations.map((citation, index) => (
                  <li key={index} className="text-justify leading-relaxed">
                    {citation.startsWith("http") ? (
                      <a
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {citation}
                      </a>
                    ) : (
                      citation
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </article>
    </SEOPageLayout>
  );
};

export default BlogPost;
