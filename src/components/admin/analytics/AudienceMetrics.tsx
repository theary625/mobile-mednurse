import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet, Globe, Info, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface AudienceMetricsProps {
  dateRange: string;
}

export const AudienceMetrics = ({ dateRange }: AudienceMetricsProps) => {
  const { audience, traffic, loading } = useAnalyticsData(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading live data...</span>
      </div>
    );
  }

  const mobileData = audience.deviceBreakdown.find((d) => d.name === "Mobile");
  const desktopData = audience.deviceBreakdown.find((d) => d.name === "Desktop");
  const tabletData = audience.deviceBreakdown.find((d) => d.name === "Tablet");

  const mobilePct = mobileData?.percentage ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Audience & Technology</h3>
          <p className="text-sm text-muted-foreground">Device and browser data parsed from user agents</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">{mobilePct}% Mobile</span>
        </div>
      </div>

      {/* Device Distribution */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={desktopData && desktopData.percentage > 50 ? "border-l-4 border-l-primary" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desktopData?.percentage ?? 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">{(desktopData?.count ?? 0).toLocaleString()} page views</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile</CardTitle>
            <Smartphone className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{mobileData?.percentage ?? 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">{(mobileData?.count ?? 0).toLocaleString()} page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tablet</CardTitle>
            <Tablet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabletData?.percentage ?? 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">{(tabletData?.count ?? 0).toLocaleString()} page views</p>
          </CardContent>
        </Card>
      </div>

      {/* Browser & GA4 Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Browser Usage</CardTitle>
            <CardDescription>Parsed from user agent strings</CardDescription>
          </CardHeader>
          <CardContent>
            {audience.browserBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No data for this period</p>
            ) : (
              <div className="space-y-3">
                {audience.browserBreakdown.map((browser) => (
                  <div key={browser.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{browser.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{browser.count.toLocaleString()}</span>
                        <span className="text-sm font-medium">{browser.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={browser.percentage} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Country / city breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Info className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Requires GA4</p>
              <p className="text-xs text-muted-foreground text-center">
                Geographic data is not captured in the current page_views schema. Connect GA4 to see country and city data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total views context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session & View Totals</CardTitle>
          <CardDescription>Aggregated from page_views table (bots filtered)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <div className="text-3xl font-bold">{traffic.totalPageViews.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">Page Views</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <div className="text-3xl font-bold">{traffic.totalSessions.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">Unique Sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Not tracked note */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Language, screen size, operating system, and geographic data</strong> require{" "}
              <strong>Google Analytics 4</strong>. Device and browser data above are derived from user agent strings
              stored in your analytics database.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceMetrics;
