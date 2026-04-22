import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
  Database,
  TrendingUp,
  Pill,
  FileWarning,
  Pencil,
  ClipboardCheck,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  validateMedication,
  calculateDataQualityMetrics,
  getCompletenessColor,
  type ContentStatus,
} from "@/lib/medicationValidation";
import MedicationEditDialog from "./MedicationEditDialog";

interface MedicationWithScore {
  id: string;
  generic_name: string;
  content_status: ContentStatus;
  completenessScore: number;
  missingFields: string[];
  high_alert: boolean;
}

export default function DataQualityDashboard() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<MedicationWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [qualityFilter, setQualityFilter] = useState<string>("all");
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [metrics, setMetrics] = useState({
    complete: 0,
    needsReview: 0,
    incomplete: 0,
    criticalGaps: 0,
    averageScore: 0,
    byStatus: { draft: 0, review: 0, approved: 0 } as Record<string, number>,
    autoApproveCount: 0,
    quickReviewCount: 0,
    fullReviewCount: 0,
    escalatedCount: 0,
  });

  const handleEdit = (medicationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigate(`/admin/medication/${medicationId}`);
  };

  const handleDeleteClick = (med: MedicationWithScore, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({ id: med.id, name: med.generic_name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      toast.success(`${deleteTarget.name} deleted successfully`);
      fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("Failed to delete medication");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .order("generic_name");

      if (error) throw error;

      const medsWithScores: MedicationWithScore[] = (data || []).map((med) => {
        const status = (med.content_status as ContentStatus) || "draft";
        const result = validateMedication(med as Record<string, unknown>, status);
        return {
          id: med.id,
          generic_name: med.generic_name,
          content_status: status,
          completenessScore: result.completenessScore,
          missingFields: result.missingFields.map((f) => f.label),
          high_alert: med.high_alert || false,
        };
      });

      setMedications(medsWithScores);
      const qualityMetrics = calculateDataQualityMetrics(data as Record<string, unknown>[]);
      const autoApproveCount = (data || []).filter(med => med.review_tier === 'auto_approve').length;
      const quickReviewCount = (data || []).filter(med => med.review_tier === 'quick_review').length;
      const fullReviewCount = (data || []).filter(med => med.review_tier === 'full_review').length;
      const escalatedCount = (data || []).filter(med => med.review_tier === 'escalated').length;
      setMetrics({ ...qualityMetrics, autoApproveCount, quickReviewCount, fullReviewCount, escalatedCount });
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();

    const handleFactoryComplete = () => {
      fetchMedications();
    };
    window.addEventListener('content-factory-complete', handleFactoryComplete);
    return () => window.removeEventListener('content-factory-complete', handleFactoryComplete);
  }, []);

  const filteredMedications = medications.filter((med) => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = trimmedQuery.length < 2 || med.generic_name.toLowerCase().includes(trimmedQuery);
    const matchesStatus = statusFilter === "all" || med.content_status === statusFilter;
    
    let matchesQuality = true;
    if (qualityFilter === "complete") matchesQuality = med.completenessScore >= 90;
    else if (qualityFilter === "needs-review") matchesQuality = med.completenessScore >= 70 && med.completenessScore < 90;
    else if (qualityFilter === "incomplete") matchesQuality = med.completenessScore >= 50 && med.completenessScore < 70;
    else if (qualityFilter === "critical") matchesQuality = med.completenessScore < 50;
    
    return matchesSearch && matchesStatus && matchesQuality;
  });

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">Approved</Badge>;
      case "review":
        return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">Review</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const getQualityIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (score >= 70) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if (score >= 50) return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Data Quality Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor medication data completeness and identify gaps
          </p>
        </div>
        <Button onClick={fetchMedications} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Data Completeness Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          className={`border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 cursor-pointer transition-all hover:shadow-md ${qualityFilter === "complete" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setQualityFilter(qualityFilter === "complete" ? "all" : "complete")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{metrics.complete}</p>
                <p className="text-xs text-muted-foreground">Complete (≥90%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 cursor-pointer transition-all hover:shadow-md ${qualityFilter === "needs-review" ? "ring-2 ring-amber-500" : ""}`}
          onClick={() => setQualityFilter(qualityFilter === "needs-review" ? "all" : "needs-review")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{metrics.needsReview}</p>
                <p className="text-xs text-muted-foreground">Needs Review (70-89%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20 cursor-pointer transition-all hover:shadow-md ${qualityFilter === "incomplete" ? "ring-2 ring-orange-500" : ""}`}
          onClick={() => setQualityFilter(qualityFilter === "incomplete" ? "all" : "incomplete")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <FileWarning className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{metrics.incomplete}</p>
                <p className="text-xs text-muted-foreground">Incomplete (50-69%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 cursor-pointer transition-all hover:shadow-md ${qualityFilter === "critical" ? "ring-2 ring-red-500" : ""}`}
          onClick={() => setQualityFilter(qualityFilter === "critical" ? "all" : "critical")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{metrics.criticalGaps}</p>
                <p className="text-xs text-muted-foreground">Critical (&lt;50%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Tier Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <ClipboardCheck className="w-4 h-4" />
          Review Tier Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{metrics.autoApproveCount}</p>
                  <p className="text-xs text-muted-foreground">Auto-Approve</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{metrics.quickReviewCount}</p>
                  <p className="text-xs text-muted-foreground">Quick Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{metrics.fullReviewCount}</p>
                  <p className="text-xs text-muted-foreground">Full Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">{metrics.escalatedCount}</p>
                  <p className="text-xs text-muted-foreground">Escalated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Average Score & Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Average Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold ${getCompletenessColor(metrics.averageScore)}`}>
                {metrics.averageScore}%
              </div>
              <div className="flex-1">
                <Progress 
                  value={metrics.averageScore} 
                  className="h-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pill className="w-4 h-4" />
              By Content Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{metrics.byStatus.draft || 0}</p>
                <p className="text-xs text-muted-foreground">Draft</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{metrics.byStatus.review || 0}</p>
                <p className="text-xs text-muted-foreground">Review</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{metrics.byStatus.approved || 0}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={qualityFilter} onValueChange={setQualityFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quality</SelectItem>
            <SelectItem value="complete">Complete (≥90%)</SelectItem>
            <SelectItem value="needs-review">Needs Review</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="critical">Critical Gaps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Medications Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completeness</TableHead>
                  <TableHead>Missing Fields</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading medications...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredMedications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No medications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMedications.map((med) => (
                    <TableRow 
                      key={med.id}
                      className="cursor-pointer"
                      onClick={() => handleEdit(med.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{med.generic_name}</span>
                          {med.high_alert && (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0">
                              High Alert
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(med.content_status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          {getQualityIcon(med.completenessScore)}
                          <Progress 
                            value={med.completenessScore} 
                            className="h-2 flex-1"
                          />
                          <span className={`text-sm font-medium ${getCompletenessColor(med.completenessScore)}`}>
                            {med.completenessScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {med.missingFields.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {med.missingFields.slice(0, 3).map((field, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {med.missingFields.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{med.missingFields.length - 3} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-green-600 text-sm">✓ Complete</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleEdit(med.id, e)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => handleDeleteClick(med, e)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <MedicationEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        medicationId={editingMedicationId}
        onSaved={() => {
          fetchMedications();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
