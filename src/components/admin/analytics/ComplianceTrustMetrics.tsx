import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileCheck, Lock, Eye, Info, Building2, Loader2, MousePointerClick, FileText } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface ComplianceTrustMetricsProps {
  dateRange: string;
}

export const ComplianceTrustMetrics = ({ dateRange }: ComplianceTrustMetricsProps) => {
  const { trustPages, conversions, traffic, loading } = useAnalyticsData(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading live data...</span>
      </div>
    );
  }

  const trustPageViews = trustPages.securityViews + trustPages.privacyViews + trustPages.editorialViews;
  const trustPct = traffic.totalPageViews > 0
    ? ((trustPageViews / traffic.totalPageViews) * 100).toFixed(1)
    : "0.0";

  // Trust pages from top pages list
  const trustTopPages = traffic.topPages.filter((p) =>
    ["/security", "/privacy", "/about", "/editorial", "/terms", "/compliance"].some((prefix) =>
      p.path.startsWith(prefix)
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Compliance & Trust Signals</h3>
          <p className="text-sm text-muted-foreground">Support enterprise sales — real page view data</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950">
          <Building2 className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Hospital-Ready Signals</span>
        </div>
      </div>

      {/* Key Trust Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Page</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trustPages.securityViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">views this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Privacy Page</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trustPages.privacyViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">views this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">About/Editorial</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trustPages.editorialViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">views this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demo Requests</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversions.demoRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">booked this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversions.contactSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">submitted this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Trust Traffic Summary & High-Intent Pages */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trust Page Traffic</CardTitle>
            <CardDescription>Share of total traffic going to trust pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary">
                <span className="text-2xl font-bold text-primary">{trustPct}%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">of all page views are trust-related</p>
            </div>
            <div className="space-y-3 mt-2">
              {[
                { label: "/security", value: trustPages.securityViews },
                { label: "/privacy", value: trustPages.privacyViews },
                { label: "/about & /editorial", value: trustPages.editorialViews },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold">{item.value.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">High-Intent Pages</CardTitle>
            <CardDescription>Pages that signal serious buyers</CardDescription>
          </CardHeader>
          <CardContent>
            {trustTopPages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Eye className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  No trust page traffic recorded in this period.<br />
                  These pages (/security, /privacy, /about) need visitors.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {trustTopPages.map((page, idx) => (
                  <div key={page.path} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground w-4">{idx + 1}</span>
                      <span className="text-sm font-medium">{page.path}</span>
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">{page.views.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Healthcare Buyer Note */}
      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Healthcare Buyer Insight</p>
              <p className="text-sm text-muted-foreground mt-1">
                Hospital procurement teams typically visit Security, Privacy, and Compliance pages 3× more than individual users.
                High engagement on these pages indicates enterprise-level interest. Track these view counts over time
                to measure growing buyer intent.
              </p>
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
              <strong>Document downloads, scroll depth, buyer journey paths, and repeat visitor tracking</strong> require
              event tracking (GA4) or a dedicated analytics platform. Page view counts above are real.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceTrustMetrics;
