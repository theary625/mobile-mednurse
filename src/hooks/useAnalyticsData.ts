import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";

const isBot = (ua: string) =>
  /bot|crawler|spider|googlebot|applebot|adsbot|bingbot|meta-externalagent|LikeWise|facebookexternalhit|slurp|DuckDuckBot|baidu|YandexBot|Sogou|Exabot|facebot|ia_archiver/i.test(ua);

const isMobile = (ua: string) => /iPhone|Android.*Mobile|Mobile.*Android/i.test(ua);
const isTablet = (ua: string) => /iPad|Android(?!.*Mobile)/i.test(ua);

const getBrowser = (ua: string): string => {
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Chromium/i.test(ua)) return "Chromium";
  return "Other";
};

const classifyReferrer = (referrer: string | null): string => {
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    const host = url.hostname.replace("www.", "");
    if (/google\./i.test(host)) return "Google";
    if (/bing\./i.test(host)) return "Bing";
    if (/twitter\.com|x\.com/i.test(host)) return "Twitter/X";
    if (/linkedin\./i.test(host)) return "LinkedIn";
    if (/facebook\./i.test(host)) return "Facebook";
    if (/lovable\.|preview--/i.test(host)) return "Lovable/Preview";
    return host || "Direct";
  } catch {
    return "Direct";
  }
};

export interface AnalyticsData {
  traffic: {
    totalPageViews: number;
    totalSessions: number;
    topPages: { path: string; views: number }[];
    sourceBreakdown: { name: string; count: number; percentage: number }[];
    topReferrers: { domain: string; count: number }[];
    dailyTrend: { date: string; views: number; sessions: number }[];
  };
  conversions: {
    demoRequests: number;
    contactSubmissions: number;
    newsletterSignups: number;
    totalUsers: number;
  };
  audience: {
    deviceBreakdown: { name: string; count: number; percentage: number }[];
    browserBreakdown: { name: string; count: number; percentage: number }[];
  };
  trustPages: {
    securityViews: number;
    privacyViews: number;
    editorialViews: number;
  };
  loading: boolean;
  error: Error | null;
}

async function fetchAnalyticsData(dateRange: string): Promise<Omit<AnalyticsData, "loading" | "error">> {
  const days = parseInt(dateRange);
  const startDate = subDays(new Date(), days).toISOString();

  // Parallel fetch all data
  const [pageViewsResult, demosResult, contactsResult, newslettersResult, usersResult] =
    await Promise.all([
      supabase
        .from("page_views")
        .select("page_path, session_id, referrer, user_agent, created_at")
        .gte("created_at", startDate),
      supabase
        .from("demo_bookings")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startDate),
      supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startDate),
      supabase
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true })
        .gte("subscribed_at", startDate),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true }),
    ]);

  // Filter out bots
  const rawPageViews = (pageViewsResult.data || []).filter(
    (pv) => !pv.user_agent || !isBot(pv.user_agent)
  );

  // Sessions (distinct session_id)
  const sessionSet = new Set(rawPageViews.map((pv) => pv.session_id).filter(Boolean));
  const totalSessions = sessionSet.size;
  const totalPageViews = rawPageViews.length;

  // Top pages
  const pageCountMap = new Map<string, number>();
  for (const pv of rawPageViews) {
    const p = pv.page_path;
    pageCountMap.set(p, (pageCountMap.get(p) || 0) + 1);
  }
  const topPages = [...pageCountMap.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Source breakdown
  const sourceMap = new Map<string, number>();
  for (const pv of rawPageViews) {
    const source = classifyReferrer(pv.referrer);
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  }
  const sourceEntries = [...sourceMap.entries()].sort((a, b) => b[1] - a[1]);
  const sourceBreakdown = sourceEntries.map(([name, count]) => ({
    name,
    count,
    percentage: totalPageViews > 0 ? Math.round((count / totalPageViews) * 100 * 10) / 10 : 0,
  }));

  // Top referrers (external domains only)
  const referrerMap = new Map<string, number>();
  for (const pv of rawPageViews) {
    if (!pv.referrer) continue;
    try {
      const host = new URL(pv.referrer).hostname.replace("www.", "");
      if (host) referrerMap.set(host, (referrerMap.get(host) || 0) + 1);
    } catch {}
  }
  const topReferrers = [...referrerMap.entries()]
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Daily trend
  const dayMap = new Map<string, { views: number; sessions: Set<string> }>();
  for (const pv of rawPageViews) {
    const day = pv.created_at.split("T")[0];
    if (!dayMap.has(day)) dayMap.set(day, { views: 0, sessions: new Set() });
    const entry = dayMap.get(day)!;
    entry.views++;
    if (pv.session_id) entry.sessions.add(pv.session_id);
  }
  const dailyTrend = [...dayMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => ({ date, views: data.views, sessions: data.sessions.size }));

  // Device breakdown
  const deviceMap = new Map<string, number>();
  for (const pv of rawPageViews) {
    const ua = pv.user_agent || "";
    const device = isTablet(ua) ? "Tablet" : isMobile(ua) ? "Mobile" : "Desktop";
    deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
  }
  const deviceBreakdown = [...deviceMap.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalPageViews > 0 ? Math.round((count / totalPageViews) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Browser breakdown
  const browserMap = new Map<string, number>();
  for (const pv of rawPageViews) {
    const browser = getBrowser(pv.user_agent || "");
    browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
  }
  const browserBreakdown = [...browserMap.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalPageViews > 0 ? Math.round((count / totalPageViews) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Trust page views
  const trustPages = {
    securityViews: rawPageViews.filter((pv) => pv.page_path.startsWith("/security")).length,
    privacyViews: rawPageViews.filter((pv) => pv.page_path.startsWith("/privacy")).length,
    editorialViews: rawPageViews.filter(
      (pv) => pv.page_path.startsWith("/editorial") || pv.page_path.startsWith("/about")
    ).length,
  };

  return {
    traffic: {
      totalPageViews,
      totalSessions,
      topPages,
      sourceBreakdown,
      topReferrers,
      dailyTrend,
    },
    conversions: {
      demoRequests: demosResult.count || 0,
      contactSubmissions: contactsResult.count || 0,
      newsletterSignups: newslettersResult.count || 0,
      totalUsers: usersResult.count || 0,
    },
    audience: {
      deviceBreakdown,
      browserBreakdown,
    },
    trustPages,
  };
}

export function useAnalyticsData(dateRange: string): AnalyticsData {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-data", dateRange],
    queryFn: () => fetchAnalyticsData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  return {
    traffic: data?.traffic ?? {
      totalPageViews: 0,
      totalSessions: 0,
      topPages: [],
      sourceBreakdown: [],
      topReferrers: [],
      dailyTrend: [],
    },
    conversions: data?.conversions ?? {
      demoRequests: 0,
      contactSubmissions: 0,
      newsletterSignups: 0,
      totalUsers: 0,
    },
    audience: data?.audience ?? {
      deviceBreakdown: [],
      browserBreakdown: [],
    },
    trustPages: data?.trustPages ?? {
      securityViews: 0,
      privacyViews: 0,
      editorialViews: 0,
    },
    loading: isLoading,
    error: error as Error | null,
  };
}
