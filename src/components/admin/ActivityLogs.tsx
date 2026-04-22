import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, RefreshCw, ChevronLeft, ChevronRight, User, Clock, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

const ITEMS_PER_PAGE = 20;

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionFilter, entityFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (actionFilter !== 'all') {
        query = query.eq('action_type', actionFilter);
      }

      if (entityFilter !== 'all') {
        query = query.eq('entity_type', entityFilter);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const logsData = (data || []) as ActivityLog[];
      setLogs(logsData);
      setTotalCount(count || 0);

      // Fetch profiles for users in logs
      const userIds = [...new Set(logsData.map(log => log.user_id))];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);

        const profilesMap: Record<string, Profile> = {};
        (profilesData || []).forEach(p => {
          profilesMap[p.user_id] = p;
        });
        setProfiles(profilesMap);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    if (action.includes('deleted') || action.includes('removed')) return 'destructive';
    if (action.includes('created') || action.includes('added')) return 'default';
    if (action.includes('updated') || action.includes('changed')) return 'secondary';
    return 'outline';
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'user':
      case 'role':
      case 'client':
        return <User className="h-4 w-4" />;
      case 'settings':
        return <History className="h-4 w-4" />;
      case 'membership':
        return <History className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const formatActionType = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDetails = (details: Record<string, unknown> | null): string => {
    if (!details) return '-';
    
    const parts: string[] = [];
    
    if (details.target_email) parts.push(`User: ${details.target_email}`);
    if (details.target_name) parts.push(`User: ${details.target_name}`);
    if (details.role) parts.push(`Role: ${details.role}`);
    if (details.old_status && details.new_status) {
      parts.push(`${details.old_status} → ${details.new_status}`);
    }
    if (details.old_priority && details.new_priority) {
      parts.push(`Priority: ${details.old_priority} → ${details.new_priority}`);
    }
    if (details.medication_name) parts.push(`Medication: ${details.medication_name}`);
    if (details.ticket_subject) parts.push(`Subject: ${details.ticket_subject}`);
    
    // Handle settings changes
    if (details.changes_count) {
      parts.push(`${details.changes_count} setting(s) changed`);
    }
    if (details.categories_changed && Array.isArray(details.categories_changed)) {
      parts.push(`Categories: ${(details.categories_changed as string[]).join(', ')}`);
    }
    if (details.changes && typeof details.changes === 'object') {
      const changeEntries = Object.entries(details.changes as Record<string, string>).slice(0, 2);
      changeEntries.forEach(([key, value]) => {
        parts.push(`${key}: ${value}`);
      });
    }
    
    return parts.length > 0 ? parts.join(' | ') : JSON.stringify(details).slice(0, 100);
  };

  const formatValueChanges = (
    previousValue: Record<string, unknown> | null,
    newValue: Record<string, unknown> | null
  ): string | null => {
    if (!previousValue && !newValue) return null;
    
    const changes: string[] = [];
    const allKeys = new Set([
      ...Object.keys(previousValue || {}),
      ...Object.keys(newValue || {})
    ]);
    
    allKeys.forEach(key => {
      const prev = previousValue?.[key];
      const next = newValue?.[key];
      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        const prevStr = prev !== undefined ? String(prev).slice(0, 30) : '(none)';
        const nextStr = next !== undefined ? String(next).slice(0, 30) : '(none)';
        changes.push(`${key}: ${prevStr} → ${nextStr}`);
      }
    });
    
    return changes.length > 0 ? changes.slice(0, 3).join(', ') : null;
  };

  const getUserName = (userId: string): string => {
    const profile = profiles[userId];
    return profile?.full_name || profile?.email || userId.slice(0, 8) + '...';
  };

  const filteredLogs = logs.filter(log => {
    const userName = getUserName(log.user_id).toLowerCase();
    const details = formatDetails(log.details).toLowerCase();
    return userName.includes(searchTerm.toLowerCase()) || 
           details.includes(searchTerm.toLowerCase()) ||
           log.action_type.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const actionTypes = [
    'role_added', 'role_removed', 'profile_updated',
    'ticket_status_changed', 'ticket_priority_changed', 'ticket_assigned',
    'medication_created', 'medication_updated', 'medication_deleted',
    'blog_published', 'blog_updated', 'settings_updated',
    'testimonial_created', 'testimonial_updated', 'testimonial_deleted'
  ];

  const entityTypes = ['user', 'role', 'ticket', 'medication', 'blog_post', 'settings', 'testimonial'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Activity Logs
            </CardTitle>
            <CardDescription>
              Track admin actions and changes across the platform ({totalCount} total)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actionTypes.map(action => (
                <SelectItem key={action} value={action}>
                  {formatActionType(action)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entityTypes.map(entity => (
                <SelectItem key={entity} value={entity}>
                  {entity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {logs.length === 0 ? "No activity logs yet" : "No logs match your filters"}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.created_at), 'MMM d, HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {getUserName(log.user_id)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action_type)}>
                        {formatActionType(log.action_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {getEntityIcon(log.entity_type)}
                        <span className="capitalize">{log.entity_type.replace(/_/g, ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground truncate block max-w-[250px]">
                          {formatDetails(log.details)}
                        </span>
                        {(log.previous_value || log.new_value) && (
                          <span className="text-xs text-primary/70 truncate block max-w-[250px]">
                            {formatValueChanges(log.previous_value, log.new_value)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
