import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, MessageSquare, FileText, Pill, Mail, Globe, LayoutDashboard, Wrench, Quote, History, Crown, Database, Home, GraduationCap, ImageIcon } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import { AdminOverview } from "@/components/admin/AdminOverview";
import UsersManagement from "@/components/admin/UsersManagement";
import ClientsManagement from "@/components/admin/ClientsManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import WebsiteAnalytics from "@/components/admin/WebsiteAnalytics";
import ContactManagement from "@/components/admin/ContactManagement";
import SupportTickets from "@/components/admin/SupportTickets";
import PlatformSettings from "@/components/admin/PlatformSettings";
import BlogManagement from "@/components/admin/BlogManagement";
import MedicationsManagement from "@/components/admin/MedicationsManagement";
import MedicationDataSync from "@/components/admin/MedicationDataSync";
import DataQualityDashboard from "@/components/admin/DataQualityDashboard";
import ToolboxManagement from "@/components/admin/ToolboxManagement";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";
import ActivityLogs from "@/components/admin/ActivityLogs";
import { MembershipManagement } from "@/components/admin/MembershipManagement";
import LandingPageEditor from "@/components/admin/marketing/LandingPageEditor";
import MultiPageEditor from "@/components/admin/marketing/MultiPageEditor";
import MediaManagement from "@/components/admin/MediaManagement";
import CEManagement from "@/components/admin/CEManagement";
import CouponManagement from "@/components/admin/CouponManagement";
import DemoBookingsManagement from "@/components/admin/DemoBookingsManagement";
import { useToast } from "@/hooks/use-toast";

type AppRole = 'super_admin' | 'admin' | 'moderator' | 'support' | 'user';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        // Check if this is a connectivity error
        const errorMessage = error.message.toLowerCase();
        const isConnectionError = 
          errorMessage.includes('failed to fetch') ||
          errorMessage.includes('networkerror') ||
          errorMessage.includes('connection terminated') ||
          errorMessage.includes('timeout');

        if (isConnectionError) {
          toast({
            title: "Connection Error",
            description: "Unable to verify your permissions. Please check your connection and refresh the page.",
            variant: "destructive",
          });
          // Don't set role to user on connection error - keep loading state
          // This prevents misleading "Access Denied" messages
          setLoading(false);
          return;
        }
        throw error;
      }

      const roles = (data ?? []).map((r) => r.role as AppRole);

      // Check if user is super_admin
      const hasSuperAdmin = roles.includes("super_admin");
      setIsSuperAdmin(hasSuperAdmin);

      // Resolve the highest role for display purposes
      const resolved: AppRole = hasSuperAdmin
        ? "super_admin"
        : roles.includes("admin")
          ? "admin"
          : roles.includes("moderator")
            ? "moderator"
            : roles.includes("support")
              ? "support"
              : "user";

      setUserRole(resolved);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("user");
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && userRole && !['super_admin', 'admin', 'moderator', 'support'].includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [loading, user, userRole, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#e5e5e5] border-t-[#1d1d1f] mx-auto"></div>
          </div>
          <p className="text-[#86868b] text-[15px] font-normal tracking-[-0.01em]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userRole || !['super_admin', 'admin', 'moderator', 'support'].includes(userRole)) {
    return null;
  }

  // Helper to check admin-level access (super_admin or admin)
  const hasAdminAccess = userRole === 'super_admin' || userRole === 'admin';

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <AdminMobileHeader userRole={userRole} activeTab={activeTab} setActiveTab={setActiveTab} />
      <AdminSidebar userRole={userRole} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-0 lg:ml-72">
        {/* Clean minimal header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#f0f0f0]">
          <div className="max-w-6xl mx-auto px-8 lg:px-12 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                  {activeTab === 'overview' && 'Overview'}
                  {activeTab === 'landing' && 'Landing Page'}
                  {activeTab === 'pages' && 'Website Pages'}
                  {activeTab === 'media' && 'Media Library'}
                  {activeTab === 'users' && 'Enterprise Team'}
                  {activeTab === 'clients' && 'Clients & Members'}
                  {activeTab === 'membership' && 'Membership'}
                  {activeTab === 'coupons' && 'Coupon Codes'}
                  {activeTab === 'medications' && 'Medications'}
                  {activeTab === 'data-quality' && 'Data Quality'}
                  {activeTab === 'med-data' && 'Med Data Sync'}
                  {activeTab === 'toolbox' && 'Toolbox'}
                  {activeTab === 'ce-courses' && 'CE Courses'}
                  {activeTab === 'blog' && 'Blog'}
                  {activeTab === 'testimonials' && 'Testimonials'}
                  {activeTab === 'contact' && 'Contact'}
                  {activeTab === 'website' && 'Website Stats'}
                  {activeTab === 'analytics' && 'Analytics'}
                  {activeTab === 'support' && 'Support'}
                  {activeTab === 'activity' && 'Activity Logs'}
                  {activeTab === 'demo-bookings' && 'Demo Bookings'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5f5f5]">
                <div className="h-2 w-2 rounded-full bg-[#30d158]"></div>
                <span className="text-[13px] font-medium text-[#1d1d1f]">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Mobile Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 lg:hidden bg-[#f5f5f5] rounded-xl p-1">
              <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mail className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="website" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Globe className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-0">
              <AdminOverview />
            </TabsContent>

            <TabsContent value="landing" className="space-y-4 mt-0">
              <LandingPageEditor />
            </TabsContent>

            <TabsContent value="pages" className="space-y-4 mt-0">
              <MultiPageEditor />
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-0">
              <MediaManagement />
            </TabsContent>

            <TabsContent value="users" className="space-y-4 mt-0">
              <UsersManagement userRole={userRole} isSuperAdmin={isSuperAdmin} />
            </TabsContent>

            <TabsContent value="clients" className="space-y-4 mt-0">
              <ClientsManagement />
            </TabsContent>

            <TabsContent value="membership" className="space-y-4 mt-0">
              {hasAdminAccess ? (
                <MembershipManagement />
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Crown className="h-6 w-6 text-[#86868b]" />
                  </div>
                  <p className="text-[#86868b] text-[15px]">Only administrators can access membership management.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="coupons" className="space-y-4 mt-0">
              {hasAdminAccess ? (
                <CouponManagement />
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
                  <p className="text-[#86868b] text-[15px]">Only administrators can manage coupons.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="medications" className="space-y-4 mt-0">
              <MedicationsManagement />
            </TabsContent>

            <TabsContent value="data-quality" className="space-y-4 mt-0">
              {hasAdminAccess ? (
                <DataQualityDashboard />
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Database className="h-6 w-6 text-[#86868b]" />
                  </div>
                  <p className="text-[#86868b] text-[15px]">Only administrators can access data quality dashboard.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="med-data" className="space-y-4 mt-0">
              {hasAdminAccess ? (
                <MedicationDataSync />
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Database className="h-6 w-6 text-[#86868b]" />
                  </div>
                  <p className="text-[#86868b] text-[15px]">Only administrators can access medication data sync.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="toolbox" className="space-y-4 mt-0">
              <ToolboxManagement />
            </TabsContent>

            <TabsContent value="ce-courses" className="space-y-4 mt-0">
              {hasAdminAccess ? (
                <CEManagement />
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <GraduationCap className="h-6 w-6 text-[#86868b]" />
                  </div>
                  <p className="text-[#86868b] text-[15px]">Only administrators can manage CE courses.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="blog" className="space-y-4 mt-0">
              <BlogManagement />
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-4 mt-0">
              <TestimonialsManagement />
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-0">
              <ContactManagement />
            </TabsContent>

            <TabsContent value="website" className="space-y-4 mt-0">
              <WebsiteAnalytics />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-0">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="support" className="space-y-4 mt-0">
              <SupportTickets userRole={userRole} />
            </TabsContent>

            <TabsContent value="demo-bookings" className="space-y-4 mt-0">
              <DemoBookingsManagement />
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-0">
              {hasAdminAccess ? (
                <ActivityLogs />
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <History className="h-6 w-6 text-[#86868b]" />
                  </div>
                  <p className="text-[#86868b] text-[15px]">Only administrators can view activity logs.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-0">
              {hasAdminAccess ? (
                <PlatformSettings />
              ) : (
                <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Settings className="h-6 w-6 text-[#86868b]" />
                  </div>
                  <p className="text-[#86868b] text-[15px]">Only administrators can access platform settings.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;