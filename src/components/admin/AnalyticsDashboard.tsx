import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Activity, Calendar, Pill } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface AnalyticsData {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  usersByRole: { role: string; count: number }[];
  recentSignups: { date: string; count: number }[];
}

interface MedicationStats {
  total: number;
  highAlert: number;
  byCategory: { drug_class: string; count: number }[];
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    usersByRole: [],
    recentSignups: [],
  });
  const [medicationStats, setMedicationStats] = useState<MedicationStats>({
    total: 0,
    highAlert: 0,
    byCategory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchMedicationStats();
  }, []);

  const fetchMedicationStats = async () => {
    try {
      // Get total medications using count
      const { count: total } = await supabase
        .from('medications')
        .select('*', { count: 'exact', head: true });

      // Get high-alert medications count
      const { count: highAlert } = await supabase
        .from('medications')
        .select('*', { count: 'exact', head: true })
        .eq('high_alert', true);

      // Get medications by category - only fetch drug_class column
      const { data: medications } = await supabase
        .from('medications')
        .select('drug_class');

      const categoryCounts = (medications || []).reduce((acc: Record<string, number>, { drug_class }) => {
        const category = drug_class || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const byCategory = Object.entries(categoryCounts)
        .map(([drug_class, count]) => ({ drug_class, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Only show top 20 categories for performance

      setMedicationStats({
        total: total || 0,
        highAlert: highAlert || 0,
        byCategory,
      });
    } catch (error) {
      console.error('Error fetching medication stats:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const weekAgo = subDays(today, 7);

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get new users today
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay(today).toISOString())
        .lte('created_at', endOfDay(today).toISOString());

      // Get new users this week
      const { count: newUsersThisWeek } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Get users by role
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role');

      const rolesCounts = (rolesData || []).reduce((acc: Record<string, number>, { role }) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const usersByRole = Object.entries(rolesCounts).map(([role, count]) => ({
        role,
        count: count as number,
      }));

      // Get recent signups (last 7 days)
      const { data: recentProfiles } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: true });

      const signupsByDate = (recentProfiles || []).reduce((acc: Record<string, number>, { created_at }) => {
        const date = format(new Date(created_at), 'MMM d');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const recentSignups = Object.entries(signupsByDate).map(([date, count]) => ({
        date,
        count: count as number,
      }));

      setAnalytics({
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        usersByRole,
        recentSignups,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.newUsersToday}</div>
            <p className="text-xs text-muted-foreground">Signups today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicationStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {medicationStats.highAlert} high-alert
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drug Categories</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicationStats.byCategory.length}</div>
            <p className="text-xs text-muted-foreground">Unique drug classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Users by Role
            </CardTitle>
            <CardDescription>Distribution of user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.usersByRole.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No role data available</p>
              ) : (
                analytics.usersByRole.map(({ role, count }) => (
                  <div key={role} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium capitalize">{role}</div>
                    <div className="flex-1 bg-accent rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{
                          width: `${(count / analytics.totalUsers) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">{count}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medications by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medications by Category
            </CardTitle>
            <CardDescription>Distribution by drug class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {medicationStats.byCategory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No medication data available</p>
              ) : (
                medicationStats.byCategory.map(({ drug_class, count }) => (
                  <div key={drug_class} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{drug_class}</div>
                      <div className="bg-accent rounded-full h-2 overflow-hidden mt-1">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{
                            width: `${(count / medicationStats.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-sm text-right font-medium text-muted-foreground">{count}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Signups
          </CardTitle>
          <CardDescription>User registrations over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentSignups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent signups</p>
            ) : (
              <div className="flex items-end gap-2 h-32">
                {analytics.recentSignups.map(({ date, count }) => {
                  const maxCount = Math.max(...analytics.recentSignups.map(s => s.count));
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary rounded-t transition-all"
                        style={{ height: `${height}%`, minHeight: count > 0 ? '8px' : '0' }}
                      />
                      <span className="text-xs text-muted-foreground">{date}</span>
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
