import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, Mail, Eye, FileText, AlertTriangle, Activity, 
  TrendingUp, Pill, MessageSquare, 
  CheckCircle, XCircle, ArrowRight, Shield
} from "lucide-react";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

interface Stats {
  totalUsers: number;
  totalContacts: number;
  pendingContacts: number;
  respondedContacts: number;
  totalPageViews: number;
  todayPageViews: number;
  weekPageViews: number;
  totalBlogPosts: number;
  publishedPosts: number;
  draftPosts: number;
  newsletterSubscribers: number;
  totalMedications: number;
  highAlertMeds: number;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  totalCalculations: number;
  errorsPrevented: number;
  activeUsersToday: number;
  newUsersWeek: number;
}

interface DetailCard {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface TrendDataPoint {
  date: string;
  label: string;
  users?: number;
  pageViews?: number;
  tickets?: number;
  errors?: number;
}

export const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalContacts: 0,
    pendingContacts: 0,
    respondedContacts: 0,
    totalPageViews: 0,
    todayPageViews: 0,
    weekPageViews: 0,
    totalBlogPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    newsletterSubscribers: 0,
    totalMedications: 0,
    highAlertMeds: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    totalCalculations: 0,
    errorsPrevented: 0,
    activeUsersToday: 0,
    newUsersWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<DetailCard | null>(null);
  const [detailData, setDetailData] = useState<any[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const today = startOfDay(new Date());
      const weekAgo = subDays(today, 7);

      const [
        usersRes,
        newUsersRes,
        contactsRes,
        pendingContactsRes,
        respondedContactsRes,
        pageViewsRes,
        todayViewsRes,
        weekViewsRes,
        blogRes,
        publishedBlogRes,
        draftBlogRes,
        subscribersRes,
        medicationsRes,
        highAlertRes,
        ticketsRes,
        openTicketsRes,
        resolvedTicketsRes,
        calculationsRes,
        errorsRes,
        activeUsersRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "responded"),
        supabase.from("page_views").select("id", { count: "exact", head: true }),
        supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
        supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_published", false),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("medications").select("id", { count: "exact", head: true }),
        supabase.from("medications").select("id", { count: "exact", head: true }).eq("high_alert", true),
        supabase.from("support_tickets").select("id", { count: "exact", head: true }),
        supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "resolved"),
        supabase.from("calculation_logs").select("id", { count: "exact", head: true }),
        supabase.from("errors_prevented").select("id", { count: "exact", head: true }).eq("helped_prevent", true),
        supabase.from("page_views").select("user_id", { count: "exact", head: true }).gte("created_at", today.toISOString()).not("user_id", "is", null),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        newUsersWeek: newUsersRes.count || 0,
        totalContacts: contactsRes.count || 0,
        pendingContacts: pendingContactsRes.count || 0,
        respondedContacts: respondedContactsRes.count || 0,
        totalPageViews: pageViewsRes.count || 0,
        todayPageViews: todayViewsRes.count || 0,
        weekPageViews: weekViewsRes.count || 0,
        totalBlogPosts: blogRes.count || 0,
        publishedPosts: publishedBlogRes.count || 0,
        draftPosts: draftBlogRes.count || 0,
        newsletterSubscribers: subscribersRes.count || 0,
        totalMedications: medicationsRes.count || 0,
        highAlertMeds: highAlertRes.count || 0,
        totalTickets: ticketsRes.count || 0,
        openTickets: openTicketsRes.count || 0,
        resolvedTickets: resolvedTicketsRes.count || 0,
        totalCalculations: calculationsRes.count || 0,
        errorsPrevented: errorsRes.count || 0,
        activeUsersToday: activeUsersRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrendData = useCallback(async () => {
    try {
      setTrendLoading(true);
      const today = new Date();
      const twoWeeksAgo = subDays(today, 13);
      
      const dateRange = eachDayOfInterval({ start: twoWeeksAgo, end: today });
      
      const [usersData, pageViewsData, ticketsData, errorsData] = await Promise.all([
        supabase.from("profiles").select("created_at").gte("created_at", twoWeeksAgo.toISOString()),
        supabase.from("page_views").select("created_at").gte("created_at", twoWeeksAgo.toISOString()),
        supabase.from("support_tickets").select("created_at").gte("created_at", twoWeeksAgo.toISOString()),
        supabase.from("errors_prevented").select("created_at").gte("created_at", twoWeeksAgo.toISOString()).eq("helped_prevent", true),
      ]);

      const trendPoints: TrendDataPoint[] = dateRange.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayStart = startOfDay(date);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const countForDay = (data: { created_at: string }[] | null) => {
          if (!data) return 0;
          return data.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= dayStart && itemDate < dayEnd;
          }).length;
        };

        return {
          date: dateStr,
          label: format(date, "MMM d"),
          users: countForDay(usersData.data),
          pageViews: countForDay(pageViewsData.data),
          tickets: countForDay(ticketsData.data),
          errors: countForDay(errorsData.data),
        };
      });

      setTrendData(trendPoints);
    } catch (error) {
      console.error("Error fetching trend data:", error);
    } finally {
      setTrendLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchTrendData();
  }, [fetchStats, fetchTrendData]);

  useEffect(() => {
    const channels: ReturnType<typeof supabase.channel>[] = [];

    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchStats();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsLive(true);
      });
    channels.push(profilesChannel);

    const contactsChannel = supabase
      .channel('admin-contacts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, () => {
        fetchStats();
      })
      .subscribe();
    channels.push(contactsChannel);

    const ticketsChannel = supabase
      .channel('admin-tickets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
        fetchStats();
      })
      .subscribe();
    channels.push(ticketsChannel);

    const pageViewsChannel = supabase
      .channel('admin-pageviews-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_views' }, () => {
        fetchStats();
      })
      .subscribe();
    channels.push(pageViewsChannel);

    const errorsChannel = supabase
      .channel('admin-errors-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'errors_prevented' }, () => {
        fetchStats();
      })
      .subscribe();
    channels.push(errorsChannel);

    const calculationsChannel = supabase
      .channel('admin-calculations-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'calculation_logs' }, () => {
        fetchStats();
      })
      .subscribe();
    channels.push(calculationsChannel);

    const blogChannel = supabase
      .channel('admin-blog-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => {
        fetchStats();
      })
      .subscribe();
    channels.push(blogChannel);

    const subscribersChannel = supabase
      .channel('admin-subscribers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'newsletter_subscribers' }, () => {
        fetchStats();
      })
      .subscribe();
    channels.push(subscribersChannel);

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setIsLive(false);
    };
  }, [fetchStats]);

  const fetchDetailData = async (cardId: string) => {
    setDetailLoading(true);
    try {
      let data: any[] = [];
      switch (cardId) {
        case "users":
          const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(10);
          data = users || [];
          break;
        case "contacts":
          const { data: contacts } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(10);
          data = contacts || [];
          break;
        case "pageviews":
          const { data: views } = await supabase.from("page_views").select("page_path, created_at").order("created_at", { ascending: false }).limit(20);
          data = views || [];
          break;
        case "blog":
          const { data: posts } = await supabase.from("blog_posts").select("title, is_published, created_at").order("created_at", { ascending: false }).limit(10);
          data = posts || [];
          break;
        case "medications":
          const { data: meds } = await supabase.from("medications").select("generic_name, high_alert, drug_class").order("generic_name").limit(15);
          data = meds || [];
          break;
        case "tickets":
          const { data: tickets } = await supabase.from("support_tickets").select("subject, status, priority, created_at").order("created_at", { ascending: false }).limit(10);
          data = tickets || [];
          break;
        case "subscribers":
          const { data: subs } = await supabase.from("newsletter_subscribers").select("email, subscribed_at, is_active").order("subscribed_at", { ascending: false }).limit(10);
          data = subs || [];
          break;
      }
      setDetailData(data);
    } catch (error) {
      console.error("Error fetching detail data:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCardClick = (card: DetailCard) => {
    setSelectedCard(card);
    fetchDetailData(card.id);
  };

  const statCards = [
    { id: "users", title: "Total Users", value: stats.totalUsers, subtitle: `+${stats.newUsersWeek} this week`, icon: Users, trend: stats.newUsersWeek > 0 ? "up" : "neutral" },
    { id: "contacts", title: "Contacts", value: stats.totalContacts, subtitle: `${stats.pendingContacts} pending`, icon: Mail, trend: stats.pendingContacts > 0 ? "alert" : "neutral" },
    { id: "pageviews", title: "Page Views", value: stats.totalPageViews, subtitle: `${stats.todayPageViews} today`, icon: Eye, trend: stats.todayPageViews > 10 ? "up" : "neutral" },
    { id: "blog", title: "Blog Posts", value: stats.totalBlogPosts, subtitle: `${stats.publishedPosts} published`, icon: FileText, trend: "neutral" },
    { id: "subscribers", title: "Subscribers", value: stats.newsletterSubscribers, icon: Activity, trend: "neutral" },
    { id: "medications", title: "Medications", value: stats.totalMedications, subtitle: `${stats.highAlertMeds} high-alert`, icon: Pill, trend: "neutral" },
    { id: "tickets", title: "Support", value: stats.totalTickets, subtitle: `${stats.openTickets} open`, icon: MessageSquare, trend: stats.openTickets > 5 ? "alert" : "neutral" },
  ];

  const renderDetailContent = () => {
    if (detailLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#d2d2d7] border-t-[#1d1d1f]"></div>
        </div>
      );
    }

    if (detailData.length === 0) {
      return <p className="text-center text-[#86868b] py-12 text-[15px]">No data available</p>;
    }

    switch (selectedCard?.id) {
      case "users":
        return (
          <div className="space-y-2">
            {detailData.map((user: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#007aff] to-[#5856d6] flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#1d1d1f]">{user.full_name || "No name"}</p>
                    <p className="text-[13px] text-[#86868b]">{user.email}</p>
                  </div>
                </div>
                <span className="text-[13px] text-[#86868b]">
                  {format(new Date(user.created_at), "MMM d, yyyy")}
                </span>
              </div>
            ))}
          </div>
        );
      case "contacts":
        return (
          <div className="space-y-2">
            {detailData.map((contact: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-[#f5f5f7]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[15px] font-medium text-[#1d1d1f]">{contact.subject}</p>
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                    contact.status === "new" ? "bg-[#ff3b30]/10 text-[#ff3b30]" : "bg-[#34c759]/10 text-[#34c759]"
                  }`}>
                    {contact.status}
                  </span>
                </div>
                <p className="text-[13px] text-[#86868b]">{contact.name} • {contact.email}</p>
              </div>
            ))}
          </div>
        );
      case "pageviews":
        return (
          <div className="space-y-1">
            {detailData.map((view: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#f5f5f7]">
                <span className="text-[13px] font-mono text-[#1d1d1f]">{view.page_path}</span>
                <span className="text-[13px] text-[#86868b]">
                  {format(new Date(view.created_at), "HH:mm")}
                </span>
              </div>
            ))}
          </div>
        );
      case "blog":
        return (
          <div className="space-y-2">
            {detailData.map((post: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7]">
                <p className="text-[15px] font-medium text-[#1d1d1f] truncate flex-1">{post.title}</p>
                <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                  post.is_published ? "bg-[#34c759]/10 text-[#34c759]" : "bg-[#86868b]/10 text-[#86868b]"
                }`}>
                  {post.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        );
      case "medications":
        return (
          <div className="space-y-2">
            {detailData.map((med: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7]">
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">{med.generic_name}</p>
                  <p className="text-[13px] text-[#86868b]">{med.drug_class}</p>
                </div>
                {med.high_alert && (
                  <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-[#ff3b30]/10 text-[#ff3b30]">
                    High Alert
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      case "tickets":
        return (
          <div className="space-y-2">
            {detailData.map((ticket: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-[#f5f5f7]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[15px] font-medium text-[#1d1d1f] truncate flex-1">{ticket.subject}</p>
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                    ticket.status === "open" ? "bg-[#ff3b30]/10 text-[#ff3b30]" : "bg-[#34c759]/10 text-[#34c759]"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#86868b]">
                  <span className="capitalize">{ticket.priority} priority</span>
                  <span>•</span>
                  <span>{format(new Date(ticket.created_at), "MMM d")}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case "subscribers":
        return (
          <div className="space-y-2">
            {detailData.map((sub: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7]">
                <span className="text-[15px] text-[#1d1d1f]">{sub.email}</span>
                <div className="flex items-center gap-2">
                  {sub.is_active ? (
                    <CheckCircle className="h-4 w-4 text-[#34c759]" />
                  ) : (
                    <XCircle className="h-4 w-4 text-[#ff3b30]" />
                  )}
                  <span className="text-[13px] text-[#86868b]">
                    {format(new Date(sub.subscribed_at), "MMM d")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-[#fafafa] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const contactResponseRate = stats.totalContacts > 0 ? Math.round((stats.respondedContacts / stats.totalContacts) * 100) : 0;
  const ticketResolutionRate = stats.totalTickets > 0 ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Live indicator */}
      {isLive && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#34c759] animate-pulse"></div>
          <span className="text-[13px] text-[#86868b]">Live updates enabled</span>
        </div>
      )}

      {/* Hero Stats - Large numbers on clean white */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
          <p className="text-[13px] text-[#86868b] font-medium tracking-[-0.01em]">Errors Prevented</p>
          <p className="text-[44px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-tight mt-2">{stats.errorsPrevented.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <Shield className="h-3.5 w-3.5 text-[#30d158]" />
            <span className="text-[13px] text-[#30d158] font-medium">Safety impact</span>
          </div>
        </div>
        <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
          <p className="text-[13px] text-[#86868b] font-medium tracking-[-0.01em]">Calculations</p>
          <p className="text-[44px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-tight mt-2">{stats.totalCalculations.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <TrendingUp className="h-3.5 w-3.5 text-[#007aff]" />
            <span className="text-[13px] text-[#007aff] font-medium">Clinical usage</span>
          </div>
        </div>
        <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
          <p className="text-[13px] text-[#86868b] font-medium tracking-[-0.01em]">Weekly Views</p>
          <p className="text-[44px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-tight mt-2">{stats.weekPageViews.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <Eye className="h-3.5 w-3.5 text-[#5856d6]" />
            <span className="text-[13px] text-[#5856d6] font-medium">Engagement</span>
          </div>
        </div>
        <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
          <p className="text-[13px] text-[#86868b] font-medium tracking-[-0.01em]">Active Today</p>
          <p className="text-[44px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-tight mt-2">{stats.activeUsersToday.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <Users className="h-3.5 w-3.5 text-[#ff9500]" />
            <span className="text-[13px] text-[#ff9500] font-medium">Daily active</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.01em] mb-6">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[15px] text-[#6e6e73]">Contact Response Rate</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">{contactResponseRate}%</span>
            </div>
            <div className="h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#30d158] rounded-full transition-all duration-500"
                style={{ width: `${contactResponseRate}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[15px] text-[#6e6e73]">Ticket Resolution Rate</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">{ticketResolutionRate}%</span>
            </div>
            <div className="h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#007aff] rounded-full transition-all duration-500"
                style={{ width: `${ticketResolutionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div>
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.01em] mb-5">Trends</h3>
        {trendLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[300px] bg-[#fafafa] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* User Growth */}
            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-[#007aff]/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-[#007aff]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">New Users</p>
                  <p className="text-[13px] text-[#86868b]">Last 14 days</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#007aff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '12px',
                        fontSize: '13px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                      }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#007aff" strokeWidth={2} fill="url(#userGradient)" name="Users" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Page Views */}
            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-[#5856d6]/10 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-[#5856d6]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">Page Views</p>
                  <p className="text-[13px] text-[#86868b]">Last 14 days</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '12px',
                        fontSize: '13px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                      }}
                    />
                    <Bar dataKey="pageViews" fill="#5856d6" radius={[4, 4, 0, 0]} name="Views" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-[#ff9500]/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-[#ff9500]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">Support Tickets</p>
                  <p className="text-[13px] text-[#86868b]">Last 14 days</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '12px',
                        fontSize: '13px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                      }}
                    />
                    <Line type="monotone" dataKey="tickets" stroke="#ff9500" strokeWidth={2} dot={{ fill: "#ff9500", strokeWidth: 2, r: 3 }} name="Tickets" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Errors Prevented */}
            <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0]">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-xl bg-[#30d158]/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-[#30d158]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">Errors Prevented</p>
                  <p className="text-[13px] text-[#86868b]">Last 14 days</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#30d158" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#30d158" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#86868b' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '12px',
                        fontSize: '13px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                      }}
                    />
                    <Area type="monotone" dataKey="errors" stroke="#30d158" strokeWidth={2} fill="url(#errorGradient)" name="Errors" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div>
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.01em] mb-5">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <button 
              key={stat.id} 
              className="bg-[#fafafa] rounded-2xl p-5 text-left hover:bg-white hover:shadow-md transition-all duration-200 group border border-[#f0f0f0]"
              onClick={() => handleCardClick({ id: stat.id, title: stat.title, icon: stat.icon })}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-5 w-5 text-[#86868b]" />
                <ArrowRight className="h-4 w-4 text-[#c7c7cc] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[28px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">{stat.value.toLocaleString()}</p>
              <p className="text-[13px] text-[#86868b] mt-1">{stat.title}</p>
              {stat.subtitle && (
                <p className="text-[11px] text-[#86868b] mt-0.5 flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-[#30d158]" />}
                  {stat.trend === "alert" && <AlertTriangle className="h-3 w-3 text-[#ff9500]" />}
                  {stat.subtitle}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Required */}
      {(stats.pendingContacts > 0 || stats.openTickets > 3) && (
        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-[#ff9500]/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-[#ff9500]" />
            </div>
            <div>
              <p className="text-[17px] font-semibold text-[#1d1d1f]">Action Required</p>
              <p className="text-[13px] text-[#86868b]">Items needing your attention</p>
            </div>
          </div>
          <div className="space-y-3">
            {stats.pendingContacts > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fafafa] border border-[#f0f0f0]">
                <Mail className="h-5 w-5 text-[#007aff]" />
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-[#1d1d1f]">{stats.pendingContacts} pending contact submissions</p>
                </div>
              </div>
            )}
            {stats.openTickets > 3 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#fafafa] border border-[#f0f0f0]">
                <MessageSquare className="h-5 w-5 text-[#ff9500]" />
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-[#1d1d1f]">{stats.openTickets} open support tickets</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border border-[#f0f0f0] rounded-2xl shadow-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-[22px] font-semibold text-[#1d1d1f] tracking-[-0.02em] flex items-center gap-3">
              {selectedCard && <selectedCard.icon className="h-6 w-6 text-[#007aff]" />}
              {selectedCard?.title}
            </DialogTitle>
            <DialogDescription className="text-[15px] text-[#86868b]">
              Recent entries and detailed information
            </DialogDescription>
          </DialogHeader>
          {renderDetailContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};