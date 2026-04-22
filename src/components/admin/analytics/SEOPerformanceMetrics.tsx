import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Zap, FileWarning, Globe, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { use404Statistics, formatRelativeTime } from "@/hooks/use404Statistics";

interface SEOPerformanceMetricsProps {
  dateRange: string;
}

// Mock SEO data - replace with actual Google Search Console / GA4 API
const mockSEOData = {
  organicTraffic: 5234,
  organicTrend: 18.2,
  impressions: 142567,
  impressionsTrend: 24.5,
  avgCTR: 3.67,
  avgPosition: 12.4,
  indexedPages: 47,
  crawlErrors: 2,
  brokenLinks: 3,
  uptime: 99.97,
  serverResponseTime: 0.42,
  topKeywords: [
    { keyword: "medication safety app", impressions: 12400, clicks: 892, ctr: 7.19, position: 4.2 },
    { keyword: "nursing medication calculator", impressions: 8900, clicks: 534, ctr: 6.0, position: 6.1 },
    { keyword: "drug interaction checker nurses", impressions: 7200, clicks: 421, ctr: 5.85, position: 8.3 },
    { keyword: "IV infusion calculator", impressions: 5600, clicks: 312, ctr: 5.57, position: 9.7 },
    { keyword: "medication error prevention", impressions: 4800, clicks: 289, ctr: 6.02, position: 7.4 },
  ],
};

const mockCoreWebVitals = {
  lcp: { value: 1.8, rating: "good", label: "Largest Contentful Paint" },
  fid: { value: 45, rating: "good", label: "First Input Delay" },
  cls: { value: 0.08, rating: "good", label: "Cumulative Layout Shift" },
  ttfb: { value: 0.42, rating: "good", label: "Time to First Byte" },
  fcp: { value: 1.2, rating: "good", label: "First Contentful Paint" },
};

const mockReliabilityData = {
  brokenLinks: [
    { url: "/old-features", referrer: "/blog/post-1", status: 404 },
    { url: "/legacy-pricing", referrer: "/about", status: 404 },
    { url: "/discontinued", referrer: "/features", status: 410 },
  ],
};

const mockPageSpeed = {
  mobile: 78,
  desktop: 92,
  avgLoadTime: "1.8s",
};

const getRatingColor = (rating: string) => {
  switch (rating) {
    case "good": return "text-emerald-600 bg-emerald-50";
    case "needs-improvement": return "text-amber-600 bg-amber-50";
    case "poor": return "text-red-600 bg-red-50";
    default: return "text-muted-foreground bg-muted";
  }
};

const getRatingIcon = (rating: string) => {
  switch (rating) {
    case "good": return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "needs-improvement": return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case "poor": return <XCircle className="h-4 w-4 text-red-600" />;
    default: return null;
  }
};

export const SEOPerformanceMetrics = ({ dateRange }: SEOPerformanceMetricsProps) => {
  // Fetch real 404 statistics from database
  const { totalErrors, uniquePaths, topMissingPages, isLoading: is404Loading } = use404Statistics(dateRange);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">SEO & Performance</h3>
          <p className="text-sm text-muted-foreground">Drive long-term growth and protect SEO</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">All Vitals Pass</span>
        </div>
      </div>

      {/* Key SEO Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSEOData.organicTraffic.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-600" />
              <span className="text-xs text-emerald-600">{mockSEOData.organicTrend}%</span>
              <span className="text-xs text-muted-foreground">vs previous</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(mockSEOData.impressions / 1000).toFixed(1)}K</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-600" />
              <span className="text-xs text-emerald-600">{mockSEOData.impressionsTrend}%</span>
              <span className="text-xs text-muted-foreground">search visibility</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSEOData.avgCTR}%</div>
            <p className="text-xs text-muted-foreground mt-1">Click-through rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSEOData.avgPosition}</div>
            <p className="text-xs text-muted-foreground mt-1">Search ranking</p>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals & Page Speed */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core Web Vitals</CardTitle>
            <CardDescription>Google's page experience metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockCoreWebVitals).map(([key, metric]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {getRatingIcon(metric.rating)}
                    <div>
                      <p className="text-sm font-medium">{metric.label}</p>
                      <p className="text-xs text-muted-foreground uppercase">{key}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${getRatingColor(metric.rating)}`}>
                    {metric.value}{key === 'cls' ? '' : key === 'fid' ? 'ms' : 's'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Page Speed Score</CardTitle>
            <CardDescription>Lighthouse performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-primary">{mockPageSpeed.mobile}</div>
                <p className="text-sm text-muted-foreground mt-1">Mobile</p>
                <Progress value={mockPageSpeed.mobile} className="mt-2" />
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-emerald-600">{mockPageSpeed.desktop}</div>
                <p className="text-sm text-muted-foreground mt-1">Desktop</p>
                <Progress value={mockPageSpeed.desktop} className="mt-2" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm font-medium">Average Load Time</span>
              <span className="text-sm font-bold text-primary">{mockPageSpeed.avgLoadTime}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg border">
                <div className="text-xl font-bold text-foreground">{mockSEOData.indexedPages}</div>
                <p className="text-xs text-muted-foreground">Indexed Pages</p>
              </div>
              <div className="p-3 rounded-lg border">
                <div className={`text-xl font-bold ${mockSEOData.crawlErrors > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {mockSEOData.crawlErrors}
                </div>
                <p className="text-xs text-muted-foreground">Crawl Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Reliability */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{mockSEOData.uptime}%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSEOData.serverResponseTime}s</div>
            <p className="text-xs text-muted-foreground mt-1">TTFB average</p>
          </CardContent>
        </Card>

        <Card className={mockSEOData.brokenLinks > 0 ? "border-amber-200 dark:border-amber-800" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broken Links</CardTitle>
            <FileWarning className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${mockSEOData.brokenLinks > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {mockSEOData.brokenLinks}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Internal link errors</p>
          </CardContent>
        </Card>

        <Card className={totalErrors > 3 ? "border-red-200 dark:border-red-800" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">404 Errors</CardTitle>
            {is404Loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalErrors > 3 ? 'text-red-600' : 'text-foreground'}`}>
              {is404Loading ? '...' : totalErrors}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {uniquePaths} unique paths
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Broken Links & 404 Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-amber-500" />
              Broken Link Details
            </CardTitle>
            <CardDescription>Internal links returning errors</CardDescription>
          </CardHeader>
          <CardContent>
            {mockReliabilityData.brokenLinks.length > 0 ? (
              <div className="space-y-3">
                {mockReliabilityData.brokenLinks.map((link, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate max-w-[180px]">{link.url}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">{link.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Linked from: <span className="font-medium">{link.referrer}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                <p className="text-sm">No broken links detected</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              404 Error Log
            </CardTitle>
            <CardDescription>Most hit missing pages</CardDescription>
          </CardHeader>
          <CardContent>
            {is404Loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : topMissingPages.length > 0 ? (
              <div className="space-y-2">
                {topMissingPages.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium truncate max-w-[180px]">{page.page_path}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(page.last_seen)}</span>
                      <span className="text-sm font-medium">{page.hits} hits</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                <p className="text-sm">No 404 errors recorded</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Ranking Keywords</CardTitle>
          <CardDescription>Keywords driving organic traffic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">#</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Keyword</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Impressions</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Clicks</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">CTR</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Position</th>
                </tr>
              </thead>
              <tbody>
                {mockSEOData.topKeywords.map((kw, idx) => (
                  <tr key={kw.keyword} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-2 text-sm text-muted-foreground">{idx + 1}</td>
                    <td className="py-3 px-2 text-sm font-medium">{kw.keyword}</td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{kw.impressions.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-right">{kw.clicks.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${kw.ctr > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                        {kw.ctr}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span className={`font-medium ${kw.position < 5 ? 'text-emerald-600' : kw.position < 10 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                        {kw.position}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOPerformanceMetrics;
