import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, Search, Mail, Phone, Calendar, Eye, Edit, 
  UserCheck, UserX, Clock, TrendingUp, Heart, Stethoscope,
  GraduationCap, Building2, Radio, Filter, MoreHorizontal,
  CheckCircle, AlertCircle, Star, Zap, Crown, Diamond
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ClientProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  clinician_profile?: {
    clinical_role: string | null;
    specialty: string | null;
    practice_setting: string | null;
    years_experience: number | null;
    onboarding_completed: boolean | null;
  };
  membership?: {
    plan: 'free' | 'pro' | 'premium' | 'enterprise';
    billing_status: 'active' | 'past_due' | 'cancelled' | 'trialing' | 'paused';
  };
}

interface ClientStats {
  total: number;
  active: number;
  newThisMonth: number;
  onboardingComplete: number;
}

const ROLE_LABELS: Record<string, string> = {
  nursing_student: "Nursing Student",
  nurse: "Nurse (RN)",
  advanced_nurse: "Advanced Practice Nurse",
  medical_student: "Medical Student",
  resident: "Resident Physician",
  attending: "Attending Physician",
  app: "APP",
};

const PLAN_CONFIG = {
  free: { icon: Star, label: "Free", color: "text-muted-foreground", bgColor: "bg-muted/50" },
  pro: { icon: Zap, label: "Pro", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  premium: { icon: Crown, label: "Premium", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  enterprise: { icon: Diamond, label: "Enterprise", color: "text-purple-500", bgColor: "bg-purple-500/10" },
};

const STATUS_CONFIG = {
  active: { label: "Active", color: "text-green-500", bgColor: "bg-green-500/10" },
  past_due: { label: "Past Due", color: "text-red-500", bgColor: "bg-red-500/10" },
  cancelled: { label: "Cancelled", color: "text-muted-foreground", bgColor: "bg-muted/50" },
  trialing: { label: "Trial", color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  paused: { label: "Paused", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
};

export const ClientsManagement = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [stats, setStats] = useState<ClientStats>({ total: 0, active: 0, newThisMonth: 0, onboardingComplete: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      // Get all user IDs that have enterprise roles (admin, moderator, support, super_admin)
      const { data: enterpriseUserIds } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["admin", "moderator", "support", "super_admin"]);

      const excludeIds = enterpriseUserIds?.map(r => r.user_id) || [];

      // Fetch profiles excluding enterprise users
      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
      
      if (excludeIds.length > 0) {
        // Filter out enterprise users
        query = query.not("user_id", "in", `(${excludeIds.join(",")})`);
      }

      const { data: profilesData, error } = await query;

      if (error) throw error;

      // Fetch clinician profiles and memberships for each client
      const clientsWithData: ClientProfile[] = [];
      for (const profile of profilesData || []) {
        const { data: clinicianData } = await supabase
          .from("clinician_profiles")
          .select("clinical_role, specialty, practice_setting, years_experience, onboarding_completed")
          .eq("user_id", profile.user_id)
          .maybeSingle();

        const { data: membershipData } = await supabase
          .from("user_memberships")
          .select("plan, billing_status")
          .eq("user_id", profile.user_id)
          .maybeSingle();

        clientsWithData.push({
          ...profile,
          clinician_profile: clinicianData || undefined,
          membership: membershipData || undefined,
        });
      }

      setClients(clientsWithData);

      // Calculate stats
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const newStats: ClientStats = {
        total: clientsWithData.length,
        active: clientsWithData.filter(c => 
          c.membership?.billing_status === 'active' || c.membership?.billing_status === 'trialing'
        ).length,
        newThisMonth: clientsWithData.filter(c => 
          new Date(c.created_at) >= monthStart
        ).length,
        onboardingComplete: clientsWithData.filter(c => 
          c.clinician_profile?.onboarding_completed
        ).length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchClients();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsLive(true);
      });

    return () => {
      supabase.removeChannel(channel);
      setIsLive(false);
    };
  }, [fetchClients]);

  const filteredClients = clients.filter(c => {
    const matchesSearch = !searchQuery || 
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || c.clinician_profile?.clinical_role === filterRole;
    const matchesPlan = filterPlan === "all" || c.membership?.plan === filterPlan;
    return matchesSearch && matchesRole && matchesPlan;
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
            <Heart className="h-6 w-6 text-primary" />
            Clients & Members
          </h2>
          <p className="text-muted-foreground">Manage app users and their subscriptions</p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant="outline" className="text-green-600 border-green-500 bg-green-500/10 animate-pulse">
              <Radio className="h-3 w-3 mr-1.5" />
              Live Updates
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-3xl font-bold text-purple-600">{stats.newThisMonth}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Onboarding Complete</p>
                <p className="text-3xl font-bold text-amber-600">{stats.onboardingComplete}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Clinical Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Subscription Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Client Directory
            </span>
            <Badge variant="secondary">{filteredClients.length} clients</Badge>
          </CardTitle>
          <CardDescription>View and manage all registered app users</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No clients found matching your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => {
                const planConfig = client.membership?.plan 
                  ? PLAN_CONFIG[client.membership.plan] 
                  : PLAN_CONFIG.free;
                const statusConfig = client.membership?.billing_status 
                  ? STATUS_CONFIG[client.membership.billing_status] 
                  : null;
                const PlanIcon = planConfig.icon;

                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(client.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.full_name || "No name"}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {client.clinician_profile?.clinical_role && (
                            <Badge variant="outline" className="text-xs">
                              <GraduationCap className="h-3 w-3 mr-1" />
                              {ROLE_LABELS[client.clinician_profile.clinical_role] || client.clinician_profile.clinical_role}
                            </Badge>
                          )}
                          {client.clinician_profile?.specialty && (
                            <Badge variant="outline" className="text-xs">
                              <Building2 className="h-3 w-3 mr-1" />
                              {client.clinician_profile.specialty.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-2 justify-end">
                          <Badge variant="outline" className={`${planConfig.color} ${planConfig.bgColor}`}>
                            <PlanIcon className="h-3 w-3 mr-1" />
                            {planConfig.label}
                          </Badge>
                          {statusConfig && (
                            <Badge variant="outline" className={`${statusConfig.color} ${statusConfig.bgColor}`}>
                              {statusConfig.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedClient?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(selectedClient?.full_name || null)}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedClient?.full_name || "No name"}</span>
                <p className="text-sm font-normal text-muted-foreground">{selectedClient?.email}</p>
              </div>
            </DialogTitle>
            <DialogDescription>Client profile details</DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6 py-4">
              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedClient.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedClient.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {format(new Date(selectedClient.created_at), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Profile */}
              {selectedClient.clinician_profile && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Clinical Profile</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">
                        {ROLE_LABELS[selectedClient.clinician_profile.clinical_role || ""] || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Specialty</p>
                      <p className="text-sm font-medium">
                        {selectedClient.clinician_profile.specialty?.replace(/_/g, " ") || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Practice Setting</p>
                      <p className="text-sm font-medium">
                        {selectedClient.clinician_profile.practice_setting?.replace(/_/g, " ") || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="text-sm font-medium">
                        {selectedClient.clinician_profile.years_experience 
                          ? `${selectedClient.clinician_profile.years_experience} years`
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedClient.clinician_profile.onboarding_completed ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Onboarding Complete
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        Onboarding Pending
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Subscription */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Subscription</h4>
                {selectedClient.membership ? (
                  <div className="flex items-center gap-3">
                    {(() => {
                      const planConfig = PLAN_CONFIG[selectedClient.membership.plan];
                      const statusConfig = STATUS_CONFIG[selectedClient.membership.billing_status];
                      const PlanIcon = planConfig.icon;
                      return (
                        <>
                          <Badge variant="outline" className={`${planConfig.color} ${planConfig.bgColor}`}>
                            <PlanIcon className="h-3 w-3 mr-1" />
                            {planConfig.label} Plan
                          </Badge>
                          <Badge variant="outline" className={`${statusConfig.color} ${statusConfig.bgColor}`}>
                            {statusConfig.label}
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No active subscription</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManagement;
