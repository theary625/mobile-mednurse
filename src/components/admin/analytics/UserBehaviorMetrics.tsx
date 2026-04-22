import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Info, Loader2, MousePointerClick } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface UserBehaviorMetricsProps {
  dateRange: string;
}

export const UserBehaviorMetrics = ({ dateRange }: UserBehaviorMetricsProps) => {
  const { traffic, loading } = useAnalyticsData(dateRange);

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
          <h3 className="text-lg font-semibold text-foreground">User Behavior & Page Performance</h3>
          <p className="text-sm text-muted-foreground">Understand which pages get traction</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">Page View Data</span>
        </div>
      </div>

      {/* Key Performance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{traffic.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total views this period</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time on Page</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">Requires GA4</div>
            <p className="text-xs text-muted-foreground mt-1">Session duration not tracked in page_views</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scroll Depth / Clicks</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">Requires Heatmap Tool</div>
            <p className="text-xs text-muted-foreground mt-1">e.g. Hotjar, Microsoft Clarity</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Pages by Views</CardTitle>
          <CardDescription>Pages getting the most traffic in this period</CardDescription>
        </CardHeader>
        <CardContent>
          {traffic.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No page view data for this period</p>
          ) : (
            <div className="space-y-3">
              {traffic.topPages.map((page, idx) => {
                const maxViews = traffic.topPages[0].views;
                const pct = maxViews > 0 ? (page.views / maxViews) * 100 : 0;
                return (
                  <div key={page.path}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground w-4">{idx + 1}</span>
                        <span className="text-sm font-medium truncate max-w-[260px]">{page.path}</span>
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">{page.views.toLocaleString()}</span>
                    </div>
                    <div className="bg-muted rounded-full h-2 overflow-hidden ml-6">
                      <div
                        className={`h-full rounded-full ${idx === 0 ? "bg-primary" : "bg-primary/40"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily trend */}
      {traffic.dailyTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Page Views</CardTitle>
            <CardDescription>Views per day in this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {traffic.dailyTrend.slice(-14).map((day) => {
                const maxViews = Math.max(...traffic.dailyTrend.map((d) => d.views), 1);
                const pct = (day.views / maxViews) * 100;
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 flex-shrink-0">
                      {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-primary/60 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{day.views}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not tracked note */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Rage clicks, navigation flow, scroll depth, exit rate, and time-on-page</strong> require a heatmap
              or event tracking tool (e.g. Hotjar, Microsoft Clarity, or GA4 with event tracking configured).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBehaviorMetrics;
