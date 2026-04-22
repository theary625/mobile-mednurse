import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Archive, ArchiveRestore, Trash2, Image, Video, Calendar, Clock, FileDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ImageUploader from "@/components/admin/marketing/ImageUploader";
import VideoUploader from "@/components/admin/marketing/VideoUploader";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  featured_image: string | null;
  featured_video?: string | null;
  is_published: boolean | null;
  is_archived: boolean | null;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  citations: string[] | null;
}

const categories = [
  "Safety",
  "Clinical",
  "Education",
  "Compliance",
  "Tools",
  "General",
];

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "General",
    featured_image: "",
    featured_video: "",
    is_published: false,
    scheduled_at: null as Date | null,
    citations: "",
  });

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_archived", showArchived)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching posts",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [showArchived]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : generateSlug(title),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "General",
      featured_image: "",
      featured_video: "",
      is_published: false,
      scheduled_at: null,
      citations: "",
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category,
      featured_image: post.featured_image || "",
      featured_video: post.featured_video || "",
      is_published: post.is_published || false,
      scheduled_at: post.scheduled_at ? new Date(post.scheduled_at) : null,
      citations: post.citations?.join("\n") || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) {
      toast({
        title: "Validation Error",
        description: "Title and slug are required",
        variant: "destructive",
      });
      return;
    }

    const citationsArray = formData.citations
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      category: formData.category,
      featured_image: formData.featured_image || null,
      featured_video: formData.featured_video || null,
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
      scheduled_at: formData.scheduled_at ? formData.scheduled_at.toISOString() : null,
      citations: citationsArray.length > 0 ? citationsArray : null,
    };

    if (editingPost) {
      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingPost.id);

      if (error) {
        toast({
          title: "Error updating post",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Post updated successfully" });
        setIsDialogOpen(false);
        resetForm();
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(postData);

      if (error) {
        toast({
          title: "Error creating post",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Post created successfully" });
        setIsDialogOpen(false);
        resetForm();
        fetchPosts();
      }
    }
  };

  const handleArchive = async (post: BlogPost) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ is_archived: !post.is_archived })
      .eq("id", post.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: post.is_archived ? "Post restored" : "Post archived",
      });
      fetchPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to permanently delete this post?")) {
      return;
    }

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Post deleted permanently" });
      fetchPosts();
    }
  };

  const handleDownloadPDF = (post: BlogPost) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    const titleLines = doc.splitTextToSize(post.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 28 + 10;

    // Meta line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    const status = post.is_published
      ? "Published"
      : post.scheduled_at
      ? `Scheduled: ${format(new Date(post.scheduled_at), "MMM d, yyyy")}`
      : "Draft";
    doc.text(
      `Category: ${post.category}  |  Status: ${status}  |  Created: ${format(new Date(post.created_at), "MMM d, yyyy")}`,
      margin,
      y
    );
    y += 20;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;

    // Excerpt
    if (post.excerpt) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      const excerptLines = doc.splitTextToSize(post.excerpt, contentWidth);
      doc.text(excerptLines, margin, y);
      y += excerptLines.length * 16 + 14;
    }

    // Content
    if (post.content) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      const contentLines = doc.splitTextToSize(post.content, contentWidth);
      contentLines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 16;
      });
      y += 10;
    }

    // Citations
    if (post.citations && post.citations.length > 0) {
      if (y > pageHeight - margin - 40) {
        doc.addPage();
        y = margin;
      }
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 16;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text("References", margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      post.citations.forEach((citation, i) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        const lines = doc.splitTextToSize(`${i + 1}. ${citation}`, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 13 + 4;
      });
    }

    doc.save(`${post.slug || post.title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Blog Management</h2>
          <p className="text-muted-foreground">Create, edit, and archive blog posts</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showArchived}
              onCheckedChange={setShowArchived}
              id="show-archived"
            />
            <Label htmlFor="show-archived" className="text-sm">
              Show Archived
            </Label>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Edit Post" : "Create New Post"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="url-friendly-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                    }
                    placeholder="Brief summary of the post"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Full post content (supports markdown)"
                    rows={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Featured Media</Label>
                  <Tabs defaultValue={formData.featured_video ? "video" : "image"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="image" className="gap-2">
                        <Image className="w-4 h-4" />
                        Image
                      </TabsTrigger>
                      <TabsTrigger value="video" className="gap-2">
                        <Video className="w-4 h-4" />
                        Video
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="image" className="mt-3">
                      <ImageUploader
                        onUpload={(url) => setFormData((prev) => ({ ...prev, featured_image: url, featured_video: "" }))}
                        currentUrl={formData.featured_image}
                        showCrop={false}
                        showAltText={true}
                        showGallery={true}
                      />
                    </TabsContent>
                    <TabsContent value="video" className="mt-3">
                      <VideoUploader
                        onUpload={(url) => setFormData((prev) => ({ ...prev, featured_video: url, featured_image: "" }))}
                        currentUrl={formData.featured_video}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citations">References / Citations</Label>
                  <Textarea
                    id="citations"
                    value={formData.citations}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, citations: e.target.value }))
                    }
                    placeholder="Add references (one per line)&#10;e.g., ISMP. (2024). High-Alert Medications. https://www.ismp.org"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter each reference on a new line. Supports URLs and formatted citations.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ 
                          ...prev, 
                          is_published: checked,
                          scheduled_at: checked ? null : prev.scheduled_at 
                        }))
                      }
                      id="is_published"
                    />
                    <Label htmlFor="is_published">Publish immediately</Label>
                  </div>
                  
                  {!formData.is_published && (
                    <div className="space-y-2">
                      <Label>Schedule Launch Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.scheduled_at && "text-muted-foreground"
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {formData.scheduled_at 
                              ? format(formData.scheduled_at, "PPP 'at' p")
                              : "Pick a launch date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={formData.scheduled_at || undefined}
                            onSelect={(date) => 
                              setFormData((prev) => ({ ...prev, scheduled_at: date || null }))
                            }
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      {formData.scheduled_at && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData((prev) => ({ ...prev, scheduled_at: null }))}
                          className="text-muted-foreground"
                        >
                          Clear scheduled date
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Post will automatically become visible on the selected date.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {showArchived
            ? "No archived posts found"
            : "No posts yet. Create your first post!"}
        </div>
      ) : (
        /* Posts List */
        isMobile ? (
          /* Mobile Card View */
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 bg-card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base truncate">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.is_published ? (
                        <span className="text-green-600 text-xs">Published</span>
                      ) : post.scheduled_at ? (
                        <span className="text-amber-600 text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.scheduled_at), "MMM d, yyyy")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Draft</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(post)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleArchive(post)}
                  >
                    {post.is_archived ? (
                      <>
                        <ArchiveRestore className="h-4 w-4 mr-1" />
                        Restore
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-1" />
                        Archive
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownloadPDF(post)}
                  >
                    <FileDown className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  {showArchived && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {post.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      {post.is_published ? (
                        <span className="text-green-600 text-sm">Published</span>
                      ) : post.scheduled_at ? (
                        <span className="text-amber-600 text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.scheduled_at), "MMM d, yyyy")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Draft</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(post)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleArchive(post)}
                          title={post.is_archived ? "Restore" : "Archive"}
                        >
                          {post.is_archived ? (
                            <ArchiveRestore className="h-4 w-4" />
                          ) : (
                            <Archive className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadPDF(post)}
                          title="Download PDF"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        {showArchived && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                            title="Delete permanently"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      )}
    </div>
  );
};

export default BlogManagement;
