import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, Target, MousePointerClick, ArrowUpRight, BarChart3, Loader2 } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface KPIDashboardProps {
  dateRange: string;
}

export const KPIDashboard = ({ dateRange }: KPIDashboardProps) => {
  const { traffic, conversions, loading } = useAnalyticsData(dateRange);

  const totalConversions =
    conversions.demoRequests + conversions.contactSubmissions + conversions.newsletterSignups;

  const conversionRate =
    traffic.totalSessions > 0
      ? ((totalConversions / traffic.totalSessions) * 100).toFixed(2)
      : "0.00";

  // Split daily trend into two halves for comparison
  const half = Math.floor(traffic.dailyTrend.length / 2);
  const firstHalfViews = traffic.dailyTrend
    .slice(0, half)
    .reduce((sum, d) => sum + d.views, 0);
  const secondHalfViews = traffic.dailyTrend
    .slice(half)
    .reduce((sum, d) => sum + d.views, 0);
  const trafficTrend =
    firstHalfViews > 0
      ? (((secondHalfViews - firstHalfViews) / firstHalfViews) * 100).toFixed(1)
      : null;

  // Group daily into up to 4 "weeks"
  const weeklyTrends: { week: string; views: number; sessions: number }[] = [];
  if (traffic.dailyTrend.length > 0) {
    const chunkSize = Math.ceil(traffic.dailyTrend.length / 4);
    for (let i = 0; i < 4; i++) {
      const chunk = traffic.dailyTrend.slice(i * chunkSize, (i + 1) * chunkSize);
      if (chunk.length === 0) continue;
      weeklyTrends.push({
        week: `W${i + 1}`,
        views: chunk.reduce((s, d) => s + d.views, 0),
        sessions: chunk.reduce((s, d) => s + d.sessions, 0),
      });
    }
  }

  const topPage = traffic.topPages[0];
  const topSource = traffic.sourceBreakdown[0];

  // Data-driven insights
  const insights: { type: "positive" | "neutral" | "warning"; text: string }[] = [];
  if (traffic.totalPageViews > 0) {
    insights.push({ type: "positive", text: `${traffic.totalPageViews.toLocaleString()} page views recorded in the last ${dateRange} days` });
  }
  if (topPage) {
    insights.push({ type: "positive", text: `Most visited page: ${topPage.path} (${topPage.views.toLocaleString()} views)` });
  }
  if (topSource) {
    insights.push({ type: "neutral", text: `Top traffic source: ${topSource.name} (${topSource.percentage}% of traffic)` });
  }
  if (conversions.demoRequests > 0) {
    insights.push({ type: "positive", text: `${conversions.demoRequests} demo request${conversions.demoRequests !== 1 ? "s" : ""} in this period` });
  }
  if (trafficTrend !== null) {
    const trend = parseFloat(trafficTrend);
    insights.push({
      type: trend >= 0 ? "positive" : "warning",
      text: `Traffic ${trend >= 0 ? "up" : "down"} ${Math.abs(trend)}% comparing first half vs second half of period`,
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading live data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Executive Summary</h3>
          <p className="text-sm text-muted-foreground">Live data snapshot for fast decisions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">Last {dateRange} days</span>
        </div>
      </div>

      {/* Key KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{traffic.totalPageViews.toLocaleString()}</div>
            {trafficTrend !== null && (
              <div className="flex items-center gap-1 mt-1">
                {parseFloat(trafficTrend) >= 0
                  ? <TrendingUp className="h-3 w-3 text-emerald-500" />
                  : <TrendingDown className="h-3 w-3 text-red-500" />}
                <span className={`text-xs font-medium ${parseFloat(trafficTrend) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {trafficTrend}% vs first half
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{traffic.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">unique sessions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{totalConversions} total conversions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demo Requests</CardTitle>
            <MousePointerClick className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversions.demoRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">booked this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend & Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Period Trend</CardTitle>
            <CardDescription>Views and sessions over time</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyTrends.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No data for this period</p>
            ) : (
              <div className="space-y-4">
                {weeklyTrends.map((week) => (
                  <div key={week.week} className="grid grid-cols-4 gap-4 py-2 border-b last:border-0">
                    <span className="text-sm font-medium">{week.week}</span>
                    <div className="text-sm col-span-2">
                      <span className="text-muted-foreground">Views: </span>
                      <span className="font-medium">{week.views.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-right">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                        {week.sessions} sess.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Insights</CardTitle>
            <CardDescription>Data-driven takeaways for this period</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No data available yet</p>
            ) : (
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      insight.type === "positive" ? "bg-emerald-500" :
                      insight.type === "warning" ? "bg-amber-500" : "bg-muted-foreground"
                    }`} />
                    <p className="text-sm">{insight.text}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performer / Conversions Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {topPage && (
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                Top Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{topPage.path}</p>
                  <p className="text-sm text-muted-foreground">Most visited page</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{topPage.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversions Summary</CardTitle>
            <CardDescription>All tracked actions this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Demo Requests", value: conversions.demoRequests },
                { label: "Contact Submissions", value: conversions.contactSubmissions },
                { label: "Newsletter Signups", value: conversions.newsletterSignups },
                { label: "Total Registered Users", value: conversions.totalUsers },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b last:border-0">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Top Pages by Traffic
          </CardTitle>
          <CardDescription>Most visited pages in this period</CardDescription>
        </CardHeader>
        <CardContent>
          {traffic.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No page view data for this period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-1 text-xs font-medium text-muted-foreground">Page</th>
                    <th className="text-right py-2 px-1 text-xs font-medium text-muted-foreground">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {traffic.topPages.slice(0, 8).map((page, idx) => (
                    <tr key={page.path} className="border-b last:border-0">
                      <td className="py-2 px-1 text-sm font-medium truncate max-w-[200px]">{page.path}</td>
                      <td className="py-2 px-1 text-sm text-right">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${idx === 0 ? "bg-emerald-100 text-emerald-700" : "bg-muted"}`}>
                          {page.views.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIDashboard;
