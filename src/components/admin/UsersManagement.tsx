import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserCog, Mail, Calendar, Shield, Plus, X, Pencil, Phone, User, ChevronLeft, ChevronRight, Crown, Building2, Bot } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

// Demo account identifier - ONLY Edith is the demo account
const DEMO_ACCOUNT_EMAIL = 'edith@mednurse.com';

type AppRole = 'super_admin' | 'admin' | 'moderator' | 'support' | 'user';

// Roles that can be assigned (super_admin is not assignable via UI)
const ASSIGNABLE_ROLES: AppRole[] = ['admin', 'moderator', 'support', 'user'];
// All roles including super_admin for display purposes
const ALL_ROLES: AppRole[] = ['super_admin', 'admin', 'moderator', 'support', 'user'];

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: AppRole;
}

interface UsersManagementProps {
  userRole: AppRole;
  isSuperAdmin?: boolean;
}

const ITEMS_PER_PAGE = 20;

const UsersManagement = ({ userRole, isSuperAdmin = false }: UsersManagementProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRoles, setNewStaffRoles] = useState<AppRole[]>(['user']);
  const [addingStaff, setAddingStaff] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Edit profile state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Paginated fetch for profiles
      const { data: profilesData, error: profilesError, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (profilesError) throw profilesError;

      // Fetch roles for the current page of users only
      const userIds = (profilesData || []).map(p => p.user_id);
      let rolesData: UserRole[] = [];
      
      if (userIds.length > 0) {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (rolesError) throw rolesError;
        rolesData = roles || [];
      }

      setProfiles(profilesData || []);
      setUserRoles(rolesData);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserRoles = (userId: string): AppRole[] => {
    return userRoles
      .filter(r => r.user_id === userId)
      .map(r => r.role);
  };

  const getHighestRole = (userId: string): AppRole => {
    const roles = getUserRoles(userId);
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('moderator')) return 'moderator';
    if (roles.includes('support')) return 'support';
    return 'user';
  };

  const handleOpenDialog = (profile: Profile) => {
    setSelectedUser(profile);
    setSelectedRoles(getUserRoles(profile.user_id));
    setDialogOpen(true);
  };

  const handleRoleToggle = (role: AppRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser || (userRole !== 'admin' && userRole !== 'super_admin')) return;

    setSaving(true);
    try {
      const currentRoles = getUserRoles(selectedUser.user_id);
      
      // Roles to add
      const rolesToAdd = selectedRoles.filter(r => !currentRoles.includes(r));
      // Roles to remove
      const rolesToRemove = currentRoles.filter(r => !selectedRoles.includes(r));

      // Add new roles
      for (const role of rolesToAdd) {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: selectedUser.user_id, role });
        if (error) throw error;
        
        // Log role added
        logActivity({
          actionType: 'role_added',
          entityType: 'role',
          entityId: selectedUser.user_id,
          details: {
            role,
            target_email: selectedUser.email,
            target_name: selectedUser.full_name,
          },
        });
      }

      // Remove old roles
      for (const role of rolesToRemove) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.user_id)
          .eq('role', role);
        if (error) throw error;
        
        // Log role removed
        logActivity({
          actionType: 'role_removed',
          entityType: 'role',
          entityId: selectedUser.user_id,
          details: {
            role,
            target_email: selectedUser.email,
            target_name: selectedUser.full_name,
          },
        });
      }

      toast({
        title: "Roles updated",
        description: `User roles have been updated successfully.`,
      });

      fetchUsers();
      setDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating roles:', error);
      toast({
        title: "Error",
        description: "Failed to update user roles.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickRemoveRole = async (userId: string, role: AppRole) => {
    if (userRole !== 'admin' && userRole !== 'super_admin') return;
    
    // Find the profile for logging
    const profile = profiles.find(p => p.user_id === userId);
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
      
      // Log role removed
      logActivity({
        actionType: 'role_removed',
        entityType: 'role',
        entityId: userId,
        details: {
          role,
          target_email: profile?.email,
          target_name: profile?.full_name,
        },
      });
      
      toast({
        title: "Role removed",
        description: `Removed ${role} role from user.`,
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role.",
        variant: "destructive",
      });
    }
  };

  const handleAddStaff = async () => {
    if (!newStaffEmail.trim() || (userRole !== 'admin' && userRole !== 'super_admin')) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStaffEmail.trim())) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (newStaffRoles.length === 0) {
      toast({
        title: "No roles selected",
        description: "Please select at least one role for the staff member.",
        variant: "destructive",
      });
      return;
    }

    setAddingStaff(true);
    try {
      // Check if user already exists by email
      const existingProfile = profiles.find(
        p => p.email?.toLowerCase() === newStaffEmail.trim().toLowerCase()
      );

      if (existingProfile) {
        // User already exists, just assign roles
        for (const role of newStaffRoles) {
          const existingRole = userRoles.find(
            r => r.user_id === existingProfile.user_id && r.role === role
          );
          if (!existingRole) {
            const { error } = await supabase
              .from('user_roles')
              .insert({ user_id: existingProfile.user_id, role });
            if (error) throw error;
          }
        }
        
        toast({
          title: "Roles assigned",
          description: `Assigned roles to existing user ${newStaffEmail}.`,
        });
      } else {
        // User doesn't exist yet - we'll create a placeholder profile entry
        // In a real app, you'd send an invite email here
        toast({
          title: "User not found",
          description: "This email is not registered yet. The user needs to sign up first, then you can assign roles.",
          variant: "destructive",
        });
        setAddingStaff(false);
        return;
      }

      fetchUsers();
      setAddStaffDialogOpen(false);
      setNewStaffEmail("");
      setNewStaffRoles(['user']);
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: "Error",
        description: "Failed to add staff member.",
        variant: "destructive",
      });
    } finally {
      setAddingStaff(false);
    }
  };

  const handleNewStaffRoleToggle = (role: AppRole) => {
    setNewStaffRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleOpenEditDialog = (profile: Profile) => {
    setEditingProfile(profile);
    // Parse first and last name from full_name if individual fields aren't set
    const nameParts = profile.full_name?.split(' ') || [];
    setEditFirstName(nameParts[0] || '');
    setEditLastName(nameParts.slice(1).join(' ') || '');
    setEditEmail(profile.email || '');
    setEditPhone(profile.phone || '');
    setEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editingProfile || (userRole !== 'admin' && userRole !== 'super_admin')) return;

    // Validate email format if changed
    const emailChanged = editEmail.trim().toLowerCase() !== (editingProfile.email || '').toLowerCase();
    if (emailChanged && editEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editEmail.trim())) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
    }

    setSavingProfile(true);
    try {
      const fullName = [editFirstName, editLastName].filter(Boolean).join(' ');
      
      // Update profile table
      const profileUpdate: Record<string, string | null> = {
        first_name: editFirstName || null,
        last_name: editLastName || null,
        full_name: fullName || null,
        phone: editPhone || null,
      };

      // If email changed, update it in profiles table too
      if (emailChanged && editEmail.trim()) {
        profileUpdate.email = editEmail.trim().toLowerCase();
      }

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('user_id', editingProfile.user_id);

      if (error) throw error;

      // Log the activity
      logActivity({
        actionType: 'profile_updated',
        entityType: 'user',
        entityId: editingProfile.user_id,
        details: {
          target_email: editEmail || editingProfile.email,
          target_name: fullName,
          email_changed: emailChanged,
        },
      });

      toast({
        title: "Profile updated",
        description: emailChanged 
          ? "User profile and email have been updated." 
          : "User profile has been updated successfully.",
      });

      fetchUsers();
      setEditDialogOpen(false);
      setEditingProfile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Enterprise roles that qualify a user for the Enterprise Team
  const enterpriseRoles: AppRole[] = ['super_admin', 'admin', 'moderator', 'support'];
  
  // Filter to only show enterprise team members (those with enterprise roles OR the demo account)
  const enterpriseProfiles = profiles.filter(profile => {
    const isDemoAccount = profile.email?.toLowerCase() === DEMO_ACCOUNT_EMAIL;
    const hasEnterpriseRole = getUserRoles(profile.user_id).some(role => enterpriseRoles.includes(role));
    return isDemoAccount || hasEnterpriseRole;
  });

  const filteredProfiles = enterpriseProfiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      case 'support': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'moderator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'support': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Check if current user can assign a specific role
  const canAssignRole = (role: AppRole): boolean => {
    if (role === 'super_admin') return false; // super_admin can never be assigned via UI
    if (role === 'admin') return isSuperAdmin; // Only super_admin can assign admin
    return userRole === 'admin' || userRole === 'super_admin'; // admin/super_admin can assign other roles
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Enterprise Team
          </CardTitle>
          <CardDescription>
            Manage MedNurse enterprise staff and their access roles.
            {isSuperAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Crown className="h-3 w-3" />
                Super Admin Access
              </span>
            )}
          </CardDescription>
        </div>
        {(userRole === 'admin' || userRole === 'super_admin') && (
          <Button onClick={() => setAddStaffDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-accent/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
          <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">
              {userRoles.filter(r => r.role === 'admin').length}
            </p>
            <p className="text-sm text-red-600 dark:text-red-500">Admins</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {userRoles.filter(r => r.role === 'moderator').length}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-500">Moderators</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {userRoles.filter(r => r.role === 'support').length}
            </p>
            <p className="text-sm text-green-600 dark:text-green-500">Support</p>
          </div>
        </div>

        {/* Users List */}
        {isMobile ? (
          /* Mobile Card View */
          <div className="space-y-3">
            {filteredProfiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              filteredProfiles.map((profile) => {
                const roles = getUserRoles(profile.user_id);
                const isDemoAccount = profile.email?.toLowerCase() === DEMO_ACCOUNT_EMAIL;
                return (
                  <div key={profile.id} className="border rounded-lg p-4 bg-card space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDemoAccount ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-primary/10'}`}>
                        {isDemoAccount ? (
                          <Bot className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <span className="text-base font-medium text-primary">
                            {profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">{profile.full_name || 'No name'}</p>
                          {isDemoAccount && (
                            <Badge className="bg-amber-500 text-white hover:bg-amber-600 text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              Demo Account
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          {profile.email || 'No email'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Joined {format(new Date(profile.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {roles.length === 0 ? (
                        <Badge variant="outline">No roles</Badge>
                      ) : (
                        roles.map((role) => (
                          <Badge key={role} variant={getRoleBadgeVariant(role)}>
                            {role}
                          </Badge>
                        ))
                      )}
                    </div>
                    {(userRole === 'admin' || userRole === 'super_admin') && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleOpenEditDialog(profile)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleOpenDialog(profile)}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Roles
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile) => {
                    const roles = getUserRoles(profile.user_id);
                    const isDemoAccount = profile.email?.toLowerCase() === DEMO_ACCOUNT_EMAIL;
                    return (
                      <TableRow key={profile.id} className={isDemoAccount ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDemoAccount ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-primary/10'}`}>
                              {isDemoAccount ? (
                                <Bot className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              ) : (
                                <span className="text-sm font-medium text-primary">
                                  {profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?'}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">{profile.full_name || 'No name'}</p>
                                {isDemoAccount && (
                                  <Badge className="bg-amber-500 text-white hover:bg-amber-600 text-xs">
                                    <Bot className="h-3 w-3 mr-1" />
                                    Demo Account
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {profile.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {roles.length === 0 ? (
                              <Badge variant="outline">No roles</Badge>
                            ) : (
                              roles.map((role) => (
                                <Badge 
                                  key={role} 
                                  variant={getRoleBadgeVariant(role)}
                                  className="group cursor-default"
                                >
                                  {role}
                                  {(userRole === 'admin' || userRole === 'super_admin') && roles.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickRemoveRole(profile.user_id, role);
                                      }}
                                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(profile.created_at), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {(userRole === 'admin' || userRole === 'super_admin') && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditDialog(profile)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDialog(profile)}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Roles
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(totalCount / ITEMS_PER_PAGE) > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Role Management Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage User Roles</DialogTitle>
              <DialogDescription>
                Select roles for {selectedUser?.full_name || selectedUser?.email}. Users can have multiple roles.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Show existing super_admin badge if user has it (read-only) */}
              {getUserRoles(selectedUser?.user_id || '').includes('super_admin') && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                  <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-purple-800 dark:text-purple-300">Super Admin</span>
                  <span className="text-xs text-purple-600 dark:text-purple-400 ml-auto">Cannot be modified</span>
                </div>
              )}

              <div className="space-y-3">
                {ASSIGNABLE_ROLES.map((role) => {
                  const canAssign = canAssignRole(role);
                  const isChecked = selectedRoles.includes(role);
                  
                  return (
                    <div 
                      key={role}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isChecked 
                          ? getRoleColor(role) + ' border-transparent' 
                          : 'bg-background hover:bg-accent/50'
                      } ${!canAssign ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={role}
                          checked={isChecked}
                          onCheckedChange={() => canAssign && handleRoleToggle(role)}
                          disabled={!canAssign}
                        />
                        <label 
                          htmlFor={role} 
                          className={`font-medium capitalize ${canAssign ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                          {role}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {role === 'admin' && (canAssign ? 'Full access to all features' : 'Only Super Admin can assign')}
                        {role === 'moderator' && 'Manage content and users'}
                        {role === 'support' && 'Handle support tickets'}
                        {role === 'user' && 'Standard user access'}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {selectedRoles.length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ User will have no roles assigned
                </p>
              )}
              
              <Button 
                onClick={handleSaveRoles} 
                className="w-full"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Save Roles
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Staff Dialog */}
        <Dialog open={addStaffDialogOpen} onOpenChange={setAddStaffDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
              <DialogDescription>
                Assign roles to an existing user by their email address.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="staff@example.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Roles</label>
                <div className="space-y-3">
                  {ALL_ROLES.filter(r => r !== 'user').map((role) => (
                    <div 
                      key={role}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        newStaffRoles.includes(role) 
                          ? getRoleColor(role) + ' border-transparent' 
                          : 'bg-background hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`new-${role}`}
                          checked={newStaffRoles.includes(role)}
                          onCheckedChange={() => handleNewStaffRoleToggle(role)}
                        />
                        <label 
                          htmlFor={`new-${role}`} 
                          className="font-medium capitalize cursor-pointer"
                        >
                          {role}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {role === 'admin' && 'Full access to all features'}
                        {role === 'moderator' && 'Manage content and users'}
                        {role === 'support' && 'Handle support tickets'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {newStaffRoles.filter(r => r !== 'user').length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ Select at least one staff role (admin, moderator, or support)
                </p>
              )}
              
              <Button 
                onClick={handleAddStaff} 
                className="w-full"
                disabled={addingStaff || !newStaffEmail.trim() || newStaffRoles.filter(r => r !== 'user').length === 0}
              >
                {addingStaff ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Profile</DialogTitle>
              <DialogDescription>
                Update profile information for {editingProfile?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-first-name"
                      placeholder="First name"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input
                    id="edit-last-name"
                    placeholder="Last name"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="user@example.com"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: This updates the email in the profile. The user's login email remains unchanged.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSaveProfile} 
                className="w-full"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;