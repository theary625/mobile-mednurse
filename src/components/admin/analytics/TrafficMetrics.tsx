import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Loader2, Info } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface TrafficMetricsProps {
  dateRange: string;
}

export const TrafficMetrics = ({ dateRange }: TrafficMetricsProps) => {
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
          <h3 className="text-lg font-semibold text-foreground">Traffic & Acquisition</h3>
          <p className="text-sm text-muted-foreground">Where visitors come from — real data from your analytics database</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950">
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Live Data</span>
        </div>
      </div>

      {/* Key Traffic Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{traffic.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">unique sessions (bot-filtered)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{traffic.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">total views this period</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bounce Rate / Duration</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">Requires GA4</div>
            <p className="text-xs text-muted-foreground mt-1">Connect GA4 to track session depth</p>
          </CardContent>
        </Card>
      </div>

      {/* Source Breakdown & Top Referrers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traffic by Source</CardTitle>
            <CardDescription>Classified from referrer field</CardDescription>
          </CardHeader>
          <CardContent>
            {traffic.sourceBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No data for this period</p>
            ) : (
              <div className="space-y-3">
                {traffic.sourceBreakdown.slice(0, 8).map((source) => (
                  <div key={source.name} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{source.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-sm text-muted-foreground">{source.count.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">{source.percentage}%</span>
                        </div>
                      </div>
                      <div className="bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Referring Domains</CardTitle>
            <CardDescription>External sources sending traffic</CardDescription>
          </CardHeader>
          <CardContent>
            {traffic.topReferrers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No referral traffic recorded</p>
            ) : (
              <div className="space-y-2">
                {traffic.topReferrers.map((ref, idx) => (
                  <div key={ref.domain} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-4">{idx + 1}</span>
                      <span className="text-sm font-medium truncate max-w-[200px]">{ref.domain}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{ref.count.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Pages by Views</CardTitle>
          <CardDescription>Most visited pages in this period</CardDescription>
        </CardHeader>
        <CardContent>
          {traffic.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No page view data for this period</p>
          ) : (
            <div className="space-y-2">
              {traffic.topPages.map((page, idx) => (
                <div key={page.path} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-4">{idx + 1}</span>
                    <span className="text-sm font-medium truncate max-w-[280px]">{page.path}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${idx === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Not tracked note */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Extended metrics</strong> (bounce rate, exit rate, avg. session duration, pages/session) require{" "}
              <strong>Google Analytics 4</strong>. Use the "Connect GA4" button at the top to enable these.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficMetrics;
