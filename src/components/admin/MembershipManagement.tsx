import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  Crown, Diamond, Star, Sparkles, Users, CreditCard, 
  Calendar, AlertCircle, CheckCircle, Clock, Search,
  TrendingUp, Gem, Award, Shield, Zap, Lock, Radio,
  DollarSign, BarChart3, ArrowRight
} from "lucide-react";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { toast } from "sonner";
import { 
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

interface Membership {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'premium' | 'enterprise';
  billing_status: 'active' | 'past_due' | 'cancelled' | 'trialing' | 'paused';
  started_at: string;
  expires_at: string | null;
  trial_ends_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

interface MembershipStats {
  total: number;
  free: number;
  pro: number;
  premium: number;
  enterprise: number;
  active: number;
  pastDue: number;
  trialing: number;
  cancelled: number;
}

interface TrendDataPoint {
  date: string;
  label: string;
  signups?: number;
  upgrades?: number;
}

interface DetailCard {
  id: string;
  title: string;
  icon: React.ElementType;
}

const PLAN_CONFIG = {
  free: {
    icon: Star,
    label: "Free",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-border",
  },
  pro: {
    icon: Zap,
    label: "Pro",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  premium: {
    icon: Crown,
    label: "Premium",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  enterprise: {
    icon: Diamond,
    label: "Enterprise",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
};

const STATUS_CONFIG = {
  active: { label: "Active", color: "text-green-500", bgColor: "bg-green-500/10", icon: CheckCircle },
  past_due: { label: "Past Due", color: "text-red-500", bgColor: "bg-red-500/10", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "text-muted-foreground", bgColor: "bg-muted/50", icon: AlertCircle },
  trialing: { label: "Trial", color: "text-cyan-500", bgColor: "bg-cyan-500/10", icon: Clock },
  paused: { label: "Paused", color: "text-yellow-500", bgColor: "bg-yellow-500/10", icon: Clock },
};

export const MembershipManagement = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [stats, setStats] = useState<MembershipStats>({
    total: 0, free: 0, pro: 0, premium: 0, enterprise: 0, active: 0, pastDue: 0, trialing: 0, cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<DetailCard | null>(null);
  const [detailData, setDetailData] = useState<Membership[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isActive] = useState(false); // System is not active yet

  const fetchMemberships = useCallback(async () => {
    try {
      const { data: membershipData, error } = await supabase
        .from("user_memberships")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for each membership
      const membershipsWithProfiles: Membership[] = [];
      for (const membership of membershipData || []) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("user_id", membership.user_id)
          .maybeSingle();
        
        membershipsWithProfiles.push({
          ...membership,
          profile: profile || undefined,
        });
      }

      setMemberships(membershipsWithProfiles);

      // Calculate stats
      const newStats: MembershipStats = {
        total: membershipsWithProfiles.length,
        free: membershipsWithProfiles.filter(m => m.plan === 'free').length,
        pro: membershipsWithProfiles.filter(m => m.plan === 'pro').length,
        premium: membershipsWithProfiles.filter(m => m.plan === 'premium').length,
        enterprise: membershipsWithProfiles.filter(m => m.plan === 'enterprise').length,
        active: membershipsWithProfiles.filter(m => m.billing_status === 'active').length,
        pastDue: membershipsWithProfiles.filter(m => m.billing_status === 'past_due').length,
        trialing: membershipsWithProfiles.filter(m => m.billing_status === 'trialing').length,
        cancelled: membershipsWithProfiles.filter(m => m.billing_status === 'cancelled').length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast.error("Failed to load memberships");
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
      
      const { data: membershipData } = await supabase
        .from("user_memberships")
        .select("created_at, plan")
        .gte("created_at", twoWeeksAgo.toISOString());

      const trendPoints: TrendDataPoint[] = dateRange.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayStart = startOfDay(date);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const signups = membershipData?.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate >= dayStart && itemDate < dayEnd;
        }).length || 0;

        const upgrades = membershipData?.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate >= dayStart && itemDate < dayEnd && item.plan !== 'free';
        }).length || 0;

        return {
          date: dateStr,
          label: format(date, "MMM d"),
          signups,
          upgrades,
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
    fetchMemberships();
    fetchTrendData();
  }, [fetchMemberships, fetchTrendData]);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('admin-memberships-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_memberships' }, () => {
        fetchMemberships();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsLive(true);
      });

    return () => {
      supabase.removeChannel(channel);
      setIsLive(false);
    };
  }, [fetchMemberships]);

  const fetchDetailData = async (cardId: string) => {
    setDetailLoading(true);
    try {
      let data: Membership[] = [];
      switch (cardId) {
        case "premium":
          data = memberships.filter(m => m.plan === 'premium').slice(0, 10);
          break;
        case "pro":
          data = memberships.filter(m => m.plan === 'pro').slice(0, 10);
          break;
        case "active":
          data = memberships.filter(m => m.billing_status === 'active').slice(0, 10);
          break;
        case "trialing":
          data = memberships.filter(m => m.billing_status === 'trialing').slice(0, 10);
          break;
        case "pastDue":
          data = memberships.filter(m => m.billing_status === 'past_due').slice(0, 10);
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

  const filteredMemberships = memberships.filter(m => {
    const matchesSearch = !searchQuery || 
      m.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "all" || m.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || m.billing_status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleUpdatePlan = async (membershipId: string, newPlan: 'free' | 'pro' | 'premium' | 'enterprise') => {
    if (!isActive) {
      toast.info("Membership system is not active yet");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("user_memberships")
        .update({ plan: newPlan })
        .eq("id", membershipId);
      
      if (error) throw error;
      toast.success("Plan updated successfully");
      fetchMemberships();
      setSelectedMembership(null);
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan");
    }
  };

  // Calculate rates
  const paidConversionRate = stats.total > 0 
    ? Math.round(((stats.pro + stats.premium + stats.enterprise) / stats.total) * 100) 
    : 0;
  const activeRetentionRate = stats.total > 0 
    ? Math.round((stats.active / stats.total) * 100) 
    : 0;
  const trialConversionRate = stats.trialing > 0 
    ? Math.round((stats.active / (stats.active + stats.trialing)) * 100) 
    : 0;

  const statCards = [
    {
      id: "total",
      title: "Total Subscribers",
      value: stats.total,
      subtitle: `${stats.free} free tier`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trend: "neutral",
    },
    {
      id: "premium",
      title: "Premium Members",
      value: stats.premium,
      subtitle: "Top tier subscribers",
      icon: Crown,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trend: stats.premium > 0 ? "up" : "neutral",
    },
    {
      id: "pro",
      title: "Pro Members",
      value: stats.pro,
      subtitle: "Professional users",
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trend: stats.pro > 0 ? "up" : "neutral",
    },
    {
      id: "active",
      title: "Active Subscriptions",
      value: stats.active,
      subtitle: "Currently billing",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      trend: "neutral",
    },
    {
      id: "trialing",
      title: "Trial Users",
      value: stats.trialing,
      subtitle: "In trial period",
      icon: Clock,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      trend: "neutral",
    },
    {
      id: "pastDue",
      title: "Past Due",
      value: stats.pastDue,
      subtitle: "Payment issues",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      trend: stats.pastDue > 0 ? "alert" : "neutral",
    },
  ];

  const renderDetailContent = () => {
    if (detailLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (detailData.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No data available</p>;
    }

    return (
      <div className="space-y-3">
        {detailData.map((membership, i) => {
          const planConfig = PLAN_CONFIG[membership.plan];
          const statusConfig = STATUS_CONFIG[membership.billing_status];
          const PlanIcon = planConfig.icon;
          return (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${planConfig.bgColor} flex items-center justify-center`}>
                  <PlanIcon className={`h-5 w-5 ${planConfig.color}`} />
                </div>
                <div>
                  <p className="font-medium">{membership.profile?.full_name || "No name"}</p>
                  <p className="text-sm text-muted-foreground">{membership.profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${statusConfig.color} ${statusConfig.bgColor}`}>
                  {statusConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(membership.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            Membership Management
          </h2>
          <p className="text-muted-foreground">Manage user subscriptions and billing status</p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant="outline" className="text-green-600 border-green-500 bg-green-500/10 animate-pulse">
              <Radio className="h-3 w-3 mr-1.5" />
              Live Updates
            </Badge>
          )}
          <Badge variant="outline" className="text-amber-600 border-amber-500 bg-amber-500/10">
            <Lock className="h-3 w-3 mr-1.5" />
            Coming Soon
          </Badge>
        </div>
      </div>

      {/* Performance Summary Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Subscription Health Overview
          </CardTitle>
          <CardDescription>Key subscription metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{stats.total}</div>
              <p className="text-sm text-muted-foreground mt-1">Total Subscribers</p>
              <Badge variant="outline" className="mt-2 text-blue-600 border-blue-600">
                <Users className="h-3 w-3 mr-1" />
                All Plans
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-500">{stats.premium + stats.enterprise}</div>
              <p className="text-sm text-muted-foreground mt-1">Premium Tier</p>
              <Badge variant="outline" className="mt-2 text-amber-600 border-amber-600">
                <Crown className="h-3 w-3 mr-1" />
                Top Tier
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">{stats.active}</div>
              <p className="text-sm text-muted-foreground mt-1">Active Billing</p>
              <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Revenue
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-500">{stats.trialing}</div>
              <p className="text-sm text-muted-foreground mt-1">Trial Users</p>
              <Badge variant="outline" className="mt-2 text-cyan-600 border-cyan-600">
                <Clock className="h-3 w-3 mr-1" />
                Potential
              </Badge>
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Paid Conversion Rate</span>
                <span className="text-sm text-muted-foreground">{paidConversionRate}%</span>
              </div>
              <Progress value={paidConversionRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Retention Rate</span>
                <span className="text-sm text-muted-foreground">{activeRetentionRate}%</span>
              </div>
              <Progress value={activeRetentionRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Trial Conversion Rate</span>
                <span className="text-sm text-muted-foreground">{trialConversionRate}%</span>
              </div>
              <Progress value={trialConversionRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Charts Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Subscription Trends (Last 14 Days)
        </h3>
        {trendLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Signups Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  New Signups
                </CardTitle>
                <CardDescription>Daily new subscription signups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="signups" 
                        stroke="hsl(217, 91%, 60%)" 
                        strokeWidth={2}
                        fill="url(#signupGradient)" 
                        name="Signups"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Paid Upgrades Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  Paid Upgrades
                </CardTitle>
                <CardDescription>Daily paid plan conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }} 
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar 
                        dataKey="upgrades" 
                        fill="hsl(38, 92%, 50%)" 
                        radius={[4, 4, 0, 0]}
                        name="Upgrades"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card 
                key={card.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                onClick={() => handleCardClick({ id: card.id, title: card.title, icon: card.icon })}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      {card.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {card.trend === "alert" && <AlertCircle className="h-3 w-3 text-red-500" />}
                      {card.subtitle}
                    </p>
                  )}
                  <div className="flex items-center justify-end mt-2">
                    <span className="text-xs text-primary flex items-center gap-1 hover:underline">
                      View details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Alert for action required */}
      {(stats.pastDue > 0 || stats.trialing > 5) && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div className="flex-1">
                <p className="font-medium">Action Required</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pastDue > 0 && `${stats.pastDue} subscription(s) with payment issues. `}
                  {stats.trialing > 5 && `${stats.trialing} users in trial period need follow-up.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            Member Subscriptions
          </CardTitle>
          <CardDescription>
            {filteredMemberships.length} members found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMemberships.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-10 w-10 text-primary/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No memberships yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                When users subscribe to plans, they'll appear here. The membership system is currently being built.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMemberships.map((membership) => {
                const planConfig = PLAN_CONFIG[membership.plan];
                const statusConfig = STATUS_CONFIG[membership.billing_status];
                const PlanIcon = planConfig.icon;
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setSelectedMembership(membership)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${planConfig.bgColor} border ${planConfig.borderColor}`}>
                        <PlanIcon className={`h-5 w-5 ${planConfig.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{membership.profile?.full_name || "Unknown User"}</p>
                        <p className="text-sm text-muted-foreground">{membership.profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={`${planConfig.color} ${planConfig.bgColor}`}>
                        {planConfig.label}
                      </Badge>
                      <Badge variant="outline" className={`${statusConfig.color} ${statusConfig.bgColor}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground hidden md:block">
                        {format(new Date(membership.started_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Detail Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCard && <selectedCard.icon className="h-5 w-5 text-primary" />}
              {selectedCard?.title}
            </DialogTitle>
            <DialogDescription>
              Recent entries for this category
            </DialogDescription>
          </DialogHeader>
          {renderDetailContent()}
        </DialogContent>
      </Dialog>

      {/* Membership Detail Dialog */}
      <Dialog open={!!selectedMembership} onOpenChange={() => setSelectedMembership(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Membership Details</DialogTitle>
            <DialogDescription>
              View and manage subscription information
            </DialogDescription>
          </DialogHeader>
          {selectedMembership && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${PLAN_CONFIG[selectedMembership.plan].bgColor} border ${PLAN_CONFIG[selectedMembership.plan].borderColor}`}>
                  {(() => {
                    const PlanIcon = PLAN_CONFIG[selectedMembership.plan].icon;
                    return <PlanIcon className={`h-8 w-8 ${PLAN_CONFIG[selectedMembership.plan].color}`} />;
                  })()}
                </div>
                <div>
                  <p className="text-xl font-semibold">{selectedMembership.profile?.full_name || "Unknown User"}</p>
                  <p className="text-muted-foreground">{selectedMembership.profile?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                  <p className="font-semibold capitalize">{selectedMembership.plan}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Billing Status</p>
                  <p className="font-semibold capitalize">{selectedMembership.billing_status.replace('_', ' ')}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Started</p>
                  <p className="font-semibold">{format(new Date(selectedMembership.started_at), "MMM d, yyyy")}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Expires</p>
                  <p className="font-semibold">
                    {selectedMembership.expires_at 
                      ? format(new Date(selectedMembership.expires_at), "MMM d, yyyy")
                      : "Never"}
                  </p>
                </div>
              </div>

              {isActive && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Change Plan</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(PLAN_CONFIG) as Array<keyof typeof PLAN_CONFIG>).map((plan) => (
                      <Button
                        key={plan}
                        variant={selectedMembership.plan === plan ? "default" : "outline"}
                        size="sm"
                        className="capitalize"
                        onClick={() => handleUpdatePlan(selectedMembership.id, plan)}
                      >
                        {plan}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!isActive && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Membership system not active</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Plan changes will be available once the membership system is fully activated.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
