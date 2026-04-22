import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Search, Target, Shield, ExternalLink, MousePointerClick, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrafficMetrics } from "./analytics/TrafficMetrics";
import { SEOPerformanceMetrics } from "./analytics/SEOPerformanceMetrics";
import { ConversionMetrics } from "./analytics/ConversionMetrics";
import { ComplianceTrustMetrics } from "./analytics/ComplianceTrustMetrics";
import { KPIDashboard } from "./analytics/KPIDashboard";
import { UserBehaviorMetrics } from "./analytics/UserBehaviorMetrics";
import { AudienceMetrics } from "./analytics/AudienceMetrics";

const WebsiteAnalytics = () => {
  const [dateRange, setDateRange] = useState("30");
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Website Analytics</h2>
            <p className="text-sm text-muted-foreground">Google Analytics 4 Integration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open GA4
          </Button>
        </div>
      </div>

      {/* Data Status */}
      <Card className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium">Live Data — Analytics Database</p>
                <p className="text-xs text-muted-foreground">
                  Showing real page views, sessions, and conversions. Extended metrics (bounce rate, scroll depth, geo) require GA4.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect GA4
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Tabs - 7 tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5 hidden sm:block" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="traffic" className="gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="h-3.5 w-3.5 hidden sm:block" />
            <span>Traffic</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-1.5 text-xs sm:text-sm">
            <Search className="h-3.5 w-3.5 hidden sm:block" />
            <span>SEO</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="gap-1.5 text-xs sm:text-sm">
            <MousePointerClick className="h-3.5 w-3.5 hidden sm:block" />
            <span>Behavior</span>
          </TabsTrigger>
          <TabsTrigger value="conversion" className="gap-1.5 text-xs sm:text-sm">
            <Target className="h-3.5 w-3.5 hidden sm:block" />
            <span>Conversion</span>
          </TabsTrigger>
          <TabsTrigger value="audience" className="gap-1.5 text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5 hidden sm:block" />
            <span>Audience</span>
          </TabsTrigger>
          <TabsTrigger value="trust" className="gap-1.5 text-xs sm:text-sm">
            <Shield className="h-3.5 w-3.5 hidden sm:block" />
            <span>Trust</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <KPIDashboard dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="traffic" className="mt-6">
          <TrafficMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <SEOPerformanceMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="behavior" className="mt-6">
          <UserBehaviorMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="conversion" className="mt-6">
          <ConversionMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="audience" className="mt-6">
          <AudienceMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="trust" className="mt-6">
          <ComplianceTrustMetrics dateRange={dateRange} />
        </TabsContent>
      </Tabs>

      {/* Analytics Stack Note */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Minimum Analytics Stack:</strong> Web analytics (GA4) + Heatmaps + SEO tracking + Conversion tracking
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No fluff. No vanity metrics. If a metric doesn't answer who came, why they came, what they did, and whether they converted — you don't need it.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteAnalytics;
