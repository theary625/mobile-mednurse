import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { CalendarDays, Building2, Mail, Phone, Clock, Globe, Search, Trash2, Eye, RefreshCw, AlertCircle, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DemoTimeSlotManager from "./DemoTimeSlotManager";
import DemoBlockedDatesManager from "./DemoBlockedDatesManager";
import DemoEmailTemplateManager from "./DemoEmailTemplateManager";
import DemoTimezoneManager from "./DemoTimezoneManager";
import DemoSmtpSettingsManager from "./DemoSmtpSettingsManager";

interface DemoBooking {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  scheduled_date: string;
  scheduled_time: string;
  timezone: string;
  status: string;
  message: string | null;
  created_at: string;
}

const DemoBookingsManagement = () => {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<DemoBooking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("demo_bookings")
      .select("*")
      .order("scheduled_date", { ascending: false });

    if (error) {
      toast({ title: "Error loading bookings", description: error.message, variant: "destructive" });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("demo_bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    const { error } = await supabase
      .from("demo_bookings")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting booking", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Booking has been deleted." });
      fetchBookings();
      if (selectedBooking?.id === id) {
        setDialogOpen(false);
        setSelectedBooking(null);
      }
    }
  };

  const handleView = (booking: DemoBooking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="gap-1 text-green-600 border-green-600"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.company || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
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
      {/* Time Slot Manager */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Manage Available Time Slots
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <DemoTimeSlotManager />
        </CollapsibleContent>
      </Collapsible>

      {/* Blocked Dates Manager */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Manage Blocked Dates
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <DemoBlockedDatesManager />
        </CollapsibleContent>
      </Collapsible>

      {/* Email Template Manager */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Manage Confirmation Email Template
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <DemoEmailTemplateManager />
        </CollapsibleContent>
      </Collapsible>

      {/* Timezone Manager */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Manage Timezones
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <DemoTimezoneManager />
        </CollapsibleContent>
      </Collapsible>

      {/* SMTP Email Settings */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              SMTP Email Settings
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <DemoSmtpSettingsManager />
        </CollapsibleContent>
      </Collapsible>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Demo Bookings
              </CardTitle>
              <CardDescription>
                View and manage scheduled demo bookings ({bookings.length} total)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchBookings} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {bookings.length === 0 ? "No demo bookings yet" : "No bookings match your search"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {booking.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.company ? (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            {booking.company}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(booking.scheduled_date), "MMM d, yyyy")} · {booking.scheduled_time}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1 text-xs mt-0.5">
                            <Globe className="h-3 w-3" />
                            {booking.timezone.replace("America/", "").replace("_", " ")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}</p>
                          <p className="text-muted-foreground text-xs">
                            {format(new Date(booking.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(booking)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(booking.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Demo Booking Details</DialogTitle>
            <DialogDescription>
              From {selectedBooking?.name} ({selectedBooking?.email})
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <Select
                  value={selectedBooking.status}
                  onValueChange={(v) => updateStatus(selectedBooking.id, v)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Name</h4>
                  <p>{selectedBooking.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Email</h4>
                  <p className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedBooking.email}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Company</h4>
                  <p>{selectedBooking.company || <span className="text-muted-foreground">Not provided</span>}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Phone</h4>
                  <p className="flex items-center gap-1">
                    {selectedBooking.phone ? (
                      <><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedBooking.phone}</>
                    ) : (
                      <span className="text-muted-foreground">Not provided</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Schedule Info */}
              <div>
                <h4 className="text-sm font-medium mb-1">Scheduled Date & Time</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(selectedBooking.scheduled_date), "PPPP")} at {selectedBooking.scheduled_time}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Globe className="h-3.5 w-3.5" />
                    {selectedBooking.timezone}
                  </p>
                </div>
              </div>

              {/* Message */}
              {selectedBooking.message && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Message</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{selectedBooking.message}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-sm text-muted-foreground">
                <p>Submitted: {format(new Date(selectedBooking.created_at), "PPpp")}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={() => window.open(`mailto:${selectedBooking.email}?subject=Re: Demo Booking`)}
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => handleDelete(selectedBooking.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoBookingsManagement;
