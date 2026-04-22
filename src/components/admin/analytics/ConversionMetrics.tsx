import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, FileText, Mail, MousePointerClick, Users, Info, Loader2 } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface ConversionMetricsProps {
  dateRange: string;
}

export const ConversionMetrics = ({ dateRange }: ConversionMetricsProps) => {
  const { traffic, conversions, loading } = useAnalyticsData(dateRange);

  const totalConversions =
    conversions.demoRequests + conversions.contactSubmissions + conversions.newsletterSignups;

  const conversionRate =
    traffic.totalSessions > 0
      ? ((totalConversions / traffic.totalSessions) * 100).toFixed(2)
      : "0.00";

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
          <h3 className="text-lg font-semibold text-foreground">Conversions & Forms</h3>
          <p className="text-sm text-muted-foreground">Turn traffic into leads — real data from your database</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">{conversionRate}% Overall Rate</span>
        </div>
      </div>

      {/* Key Conversion Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground mt-1">demos + contacts + newsletter</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demo Requests</CardTitle>
            <MousePointerClick className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{conversions.demoRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">booked this period</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{conversions.contactSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">submitted this period</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversions.newsletterSignups}</div>
            <p className="text-xs text-muted-foreground mt-1">new subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Users & Conversion Rate */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Registrations</CardTitle>
            <CardDescription>Total registered users in your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-4xl font-bold">{conversions.totalUsers}</div>
                <p className="text-sm text-muted-foreground mt-1">total registered users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion Breakdown</CardTitle>
            <CardDescription>Share of each conversion type</CardDescription>
          </CardHeader>
          <CardContent>
            {totalConversions === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No conversions in this period</p>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Demo Requests", value: conversions.demoRequests, color: "bg-emerald-500" },
                  { label: "Contact Forms", value: conversions.contactSubmissions, color: "bg-blue-500" },
                  { label: "Newsletter", value: conversions.newsletterSignups, color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.value} ({totalConversions > 0 ? Math.round((item.value / totalConversions) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full`}
                        style={{ width: totalConversions > 0 ? `${(item.value / totalConversions) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversion Rate Context</CardTitle>
          <CardDescription>How your conversion rate is calculated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <div className="text-3xl font-bold">{traffic.totalSessions.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">Total Sessions</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <div className="text-3xl font-bold">{totalConversions}</div>
              <p className="text-sm text-muted-foreground mt-1">Total Conversions</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <div className="text-3xl font-bold text-primary">{conversionRate}%</div>
              <p className="text-sm text-muted-foreground mt-1">Conversion Rate</p>
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
              <strong>Form funnel analytics</strong> (views → starts → completions, field drop-offs) and{" "}
              <strong>cost per lead</strong> require event tracking (GA4 or similar). Connect GA4 to enable these metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionMetrics;
