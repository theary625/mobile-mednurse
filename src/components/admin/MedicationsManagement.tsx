import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { Plus, Pencil, Trash2, Search, Pill, AlertTriangle, Shield, Lock, CheckCircle, Download, Upload, ChevronLeft, ChevronRight, Filter, X, Image, Loader2, CircleAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Droplets, Pill as PillIcon, Syringe, Wind, Cloud, Droplet } from "lucide-react";
import MedicationEditDialog from "./MedicationEditDialog";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(200, 70%, 50%)",
  "hsl(150, 60%, 45%)",
  "hsl(45, 90%, 50%)",
  "hsl(280, 65%, 55%)",
  "hsl(350, 70%, 55%)",
  "hsl(180, 55%, 45%)",
  "hsl(30, 80%, 50%)",
  "hsl(220, 60%, 60%)",
  "hsl(100, 50%, 45%)",
];

interface Medication {
  id: string;
  generic_name: string;
  brand_names: string[] | null;
  drug_class: string | null;
  route: string[] | null;
  high_alert: boolean | null;
  controlled_substance: boolean | null;
  double_check_required: boolean | null;
  created_at: string;
  image_url: string | null;
  pronunciation_audio_url: string | null;
  pronunciation_text: string | null;
  // Completeness fields
  dosing_info: unknown | null;
  administration_info: unknown | null;
  monitoring: unknown | null;
  hold_parameters: unknown | null;
  adverse_reactions: unknown | null;
  nursing_guide: unknown | null;
  patient_education: unknown | null;
  red_flags: unknown | null;
  documentation_reminders: unknown | null;
  expected_effect: unknown | null;
  clinical_pearls: string[] | null;
  drug_interactions_info: unknown | null;
  dosage_form: string | null;
  strengths: string[] | null;
}

interface MedicationFormData {
  generic_name: string;
  brand_names: string;
  drug_class: string;
  route: string;
  high_alert: boolean;
  controlled_substance: boolean;
  double_check_required: boolean;
  image_url: string;
  pronunciation_audio_url: string;
  pronunciation_text: string;
}

const initialFormData: MedicationFormData = {
  generic_name: "",
  brand_names: "",
  drug_class: "",
  route: "",
  high_alert: false,
  controlled_substance: false,
  double_check_required: false,
  image_url: "",
  pronunciation_audio_url: "",
  pronunciation_text: "",
};

interface ImportItem {
  data: Record<string, string>;
  isDuplicate: boolean;
  existingId?: string;
  matchedName?: string;
}

// --- Completeness helpers ---
const COMPLETENESS_CHECKS: { key: keyof Medication; label: string }[] = [
  { key: "dosing_info",             label: "Dosing" },
  { key: "administration_info",     label: "Administration" },
  { key: "monitoring",              label: "Monitoring" },
  { key: "hold_parameters",         label: "Hold Parameters" },
  { key: "adverse_reactions",       label: "Adverse Reactions" },
  { key: "nursing_guide",           label: "Nursing Guide" },
  { key: "patient_education",       label: "Patient Education" },
  { key: "red_flags",               label: "Red Flags" },
  { key: "documentation_reminders", label: "Documentation" },
  { key: "expected_effect",         label: "Expected Effect" },
  { key: "clinical_pearls",         label: "Clinical Pearls" },
  { key: "drug_interactions_info",  label: "Drug Interactions" },
  { key: "drug_class",              label: "Drug Class" },
  { key: "route",                   label: "Route" },
  { key: "brand_names",             label: "Brand Names" },
  { key: "dosage_form",             label: "Dosage Form" },
  { key: "strengths",               label: "Strengths" },
  { key: "image_url",               label: "Image" },
];

function getMissingFields(med: Medication): string[] {
  return COMPLETENESS_CHECKS
    .filter(({ key }) => {
      const val = med[key];
      if (val === null || val === undefined) return true;
      if (Array.isArray(val) && val.length === 0) return true;
      if (typeof val === "string" && val.trim() === "") return true;
      return false;
    })
    .map(({ label }) => label);
}

function CompletenessIndicator({ med }: { med: Medication }) {
  const missing = getMissingFields(med);
  const total = COMPLETENESS_CHECKS.length;
  const filled = total - missing.length;
  const pct = Math.round((filled / total) * 100);

  if (missing.length === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
        <CheckCircle className="h-3.5 w-3.5" />
        <span>100%</span>
      </div>
    );
  }

  const color = pct >= 80 ? "text-amber-500" : pct >= 50 ? "text-orange-500" : "text-destructive";
  const bgColor = pct >= 80 ? "bg-amber-500" : pct >= 50 ? "bg-orange-500" : "bg-destructive";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 text-xs font-medium cursor-help ${color}`}>
            <CircleAlert className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{pct}%</span>
            <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden hidden sm:block">
              <div className={`h-full rounded-full ${bgColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-[220px]">
          <p className="font-semibold mb-1 text-xs">Missing ({missing.length}/{total}):</p>
          <ul className="text-xs space-y-0.5">
            {missing.map(m => <li key={m} className="text-muted-foreground">• {m}</li>)}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const MedicationsManagement = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allMedicationsForStats, setAllMedicationsForStats] = useState<Medication[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [deletingMedication, setDeletingMedication] = useState<Medication | null>(null);
  const [importing, setImporting] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportItem[]>([]);
  const [importSkipDuplicates, setImportSkipDuplicates] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  // Advanced filters
  const [filterDrugClass, setFilterDrugClass] = useState<string>("all");
  const [filterHighAlert, setFilterHighAlert] = useState<string>("all");
  const [filterControlled, setFilterControlled] = useState<string>("all");
  const [filterRoute, setFilterRoute] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [quickUploadingMedId, setQuickUploadingMedId] = useState<string | null>(null);
  const [dragOverMedId, setDragOverMedId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickImageInputRef = useRef<HTMLInputElement>(null);
  const quickUploadMedRef = useRef<Medication | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Route icon mapping for visual identification
  const ROUTE_ICONS: Record<string, React.ElementType> = {
    'iv': Droplets,
    'po': PillIcon,
    'oral': PillIcon,
    'im': Syringe,
    'subq': Syringe,
    'sq': Syringe,
    'subcutaneous': Syringe,
    'topical': Droplet,
    'inhaled': Wind,
    'nebulized': Cloud,
    'nasal': Droplet,
  };

  // Helper to get icon for a route
  const getRouteIcon = (route: string): React.ElementType => {
    const key = route.toLowerCase().replace(/\s+/g, '');
    return ROUTE_ICONS[key] || PillIcon;
  };

  // Handle quick image upload from table
  const handleQuickImageUpload = async (file: File, medication: Medication) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setQuickUploadingMedId(medication.id);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const form = new FormData();
      form.append("file", file);
      form.append("medicationId", medication.id);
      form.append("medicationName", medication.generic_name);

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-upload-medication-image`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form }
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || `Upload failed`);

      toast({ title: "Image uploaded", description: `Image added for ${medication.generic_name}` });
      fetchMedications();
    } catch (error: any) {
      toast({ title: "Upload failed", description: error?.message || "Failed to upload", variant: "destructive" });
    } finally {
      setQuickUploadingMedId(null);
    }
  };

  const handleQuickImageClick = (medication: Medication) => {
    quickUploadMedRef.current = medication;
    quickImageInputRef.current?.click();
  };

  const handleQuickImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && quickUploadMedRef.current) handleQuickImageUpload(file, quickUploadMedRef.current);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent, medId: string) => { e.preventDefault(); e.stopPropagation(); setDragOverMedId(medId); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOverMedId(null); };
  const handleDrop = (e: React.DragEvent, medication: Medication) => {
    e.preventDefault(); e.stopPropagation(); setDragOverMedId(null);
    const file = e.dataTransfer.files?.[0];
    if (file) handleQuickImageUpload(file, medication);
  };

  // Keyboard shortcut (Ctrl/Cmd + K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounce search query and reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDrugClass, filterHighAlert, filterControlled, filterRoute]);

  // Fetch paginated medications
  useEffect(() => {
    fetchMedications();
  }, [currentPage, itemsPerPage, debouncedSearch, filterDrugClass, filterHighAlert, filterControlled, filterRoute]);

  // Fetch all medications for stats (only once on mount)
  useEffect(() => {
    fetchAllMedicationsForStats();
  }, []);

  const fetchAllMedicationsForStats = async () => {
    try {
      let allMeds: Medication[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;
      while (hasMore) {
        const { data, error } = await supabase
          .from("medications")
          .select("id, generic_name, brand_names, drug_class, route, high_alert, controlled_substance, double_check_required, created_at, image_url, pronunciation_audio_url, pronunciation_text, dosing_info, administration_info, monitoring, hold_parameters, adverse_reactions, nursing_guide, patient_education, red_flags, documentation_reminders, expected_effect, clinical_pearls, drug_interactions_info, dosage_form, strengths")
          .order("generic_name")
          .range(from, from + pageSize - 1);
        if (error) throw error;
        if (data && data.length > 0) {
          allMeds = [...allMeds, ...data];
          from += pageSize;
          hasMore = data.length === pageSize;
        } else {
          hasMore = false;
        }
      }
      setAllMedicationsForStats(allMeds);
    } catch (error) {
      console.error("Error fetching medications for stats:", error);
    }
  };

  const fetchMedications = async () => {
    try {
      setListLoading(true);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const COMPLETENESS_FIELDS = "id, generic_name, brand_names, drug_class, route, high_alert, controlled_substance, double_check_required, created_at, image_url, pronunciation_audio_url, pronunciation_text, dosing_info, administration_info, monitoring, hold_parameters, adverse_reactions, nursing_guide, patient_education, red_flags, documentation_reminders, expected_effect, clinical_pearls, drug_interactions_info, dosage_form, strengths";

      if (debouncedSearch) {
        // Use the search_medications RPC which searches generic_name, brand_names, and drug_class
        const { data: rpcData, error: rpcError } = await supabase
          .rpc("search_medications", { search_query: debouncedSearch, max_results: 200 })
          .select(COMPLETENESS_FIELDS);

        if (rpcError) throw rpcError;

        let results = (rpcData || []) as Medication[];

        // Apply additional filters client-side when searching
        if (filterDrugClass && filterDrugClass !== "all") results = results.filter(m => m.drug_class === filterDrugClass);
        if (filterHighAlert === "yes") results = results.filter(m => m.high_alert);
        else if (filterHighAlert === "no") results = results.filter(m => !m.high_alert);
        if (filterControlled === "yes") results = results.filter(m => m.controlled_substance);
        else if (filterControlled === "no") results = results.filter(m => !m.controlled_substance);
        if (filterRoute && filterRoute !== "all") results = results.filter(m => m.route?.includes(filterRoute));

        setTotalCount(results.length);
        setMedications(results.slice(from, to + 1));
      } else {
        let query = supabase
          .from("medications")
          .select(COMPLETENESS_FIELDS, { count: "exact" });

        if (filterDrugClass && filterDrugClass !== "all") query = query.eq("drug_class", filterDrugClass);
        if (filterHighAlert === "yes") query = query.eq("high_alert", true);
        else if (filterHighAlert === "no") query = query.eq("high_alert", false);
        if (filterControlled === "yes") query = query.eq("controlled_substance", true);
        else if (filterControlled === "no") query = query.eq("controlled_substance", false);
        if (filterRoute && filterRoute !== "all") query = query.contains("route", [filterRoute]);

        const { data, error, count } = await query.order("generic_name").range(from, to);
        if (error) throw error;
        setMedications((data || []) as Medication[]);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast({ title: "Error", description: "Failed to load medications", variant: "destructive" });
    } finally {
      setListLoading(false);
      setInitialLoading(false);
    }
  };

  const handleOpenDialog = (medication?: Medication) => {
    if (medication) {
      navigate(`/admin/medication/${medication.id}`);
    } else {
      navigate("/admin/medication/new");
    }
  };

  const handleDelete = async () => {
    if (!deletingMedication) return;

    try {
      const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", deletingMedication.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Medication deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setDeletingMedication(null);
      fetchMedications();
      fetchAllMedicationsForStats();
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Generic Name",
      "Brand Names",
      "Drug Class",
      "Routes",
      "High Alert",
      "Controlled Substance",
      "Double Check Required",
    ];

    const csvRows = [
      headers.join(","),
      ...allMedicationsForStats.map(med => [
        `"${med.generic_name.replace(/"/g, '""')}"`,
        `"${(med.brand_names || []).join("; ").replace(/"/g, '""')}"`,
        `"${(med.drug_class || "").replace(/"/g, '""')}"`,
        `"${(med.route || []).join("; ").replace(/"/g, '""')}"`,
        med.high_alert ? "Yes" : "No",
        med.controlled_substance ? "Yes" : "No",
        med.double_check_required ? "Yes" : "No",
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medications-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${allMedicationsForStats.length} medications to CSV`,
    });
  };

  const parseCSV = (text: string): Array<Record<string, string>> => {
    const lines = text.split("\n").filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
    const rows: Array<Record<string, string>> = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ""));
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ""));
      
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || "";
      });
      rows.push(row);
    }
    
    return rows;
  };

  const checkForDuplicates = (items: Array<Record<string, string>>): ImportItem[] => {
    // Get all existing medication names (normalized to lowercase for comparison)
    const existingMeds = allMedicationsForStats.map(med => ({
      id: med.id,
      name: med.generic_name.toLowerCase().trim(),
      originalName: med.generic_name
    }));

    const existingNameSet = new Map(existingMeds.map(m => [m.name, { id: m.id, originalName: m.originalName }]));

    return items.map(item => {
      const genericName = (item["generic name"] || item["generic_name"] || item["name"] || "").toLowerCase().trim();
      const existing = existingNameSet.get(genericName);
      
      return {
        data: item,
        isDuplicate: !!existing,
        existingId: existing?.id,
        matchedName: existing?.originalName
      };
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      
      if (parsed.length === 0) {
        toast({
          title: "Invalid CSV",
          description: "The file appears to be empty or incorrectly formatted",
          variant: "destructive",
        });
        return;
      }

      setCheckingDuplicates(true);
      setIsImportDialogOpen(true);
      
      const itemsWithDuplicateInfo = checkForDuplicates(parsed);
      setImportPreview(itemsWithDuplicateInfo);
      setCheckingDuplicates(false);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleImportConfirm = async () => {
    if (importPreview.length === 0) return;

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    try {
      for (const item of importPreview) {
        // Skip duplicates if option is enabled
        if (importSkipDuplicates && item.isDuplicate) {
          skippedCount++;
          continue;
        }

        const row = item.data;
        const genericName = row["generic name"] || row["generic_name"] || row["name"] || "";
        if (!genericName.trim()) {
          errorCount++;
          continue;
        }

        const medicationData = {
          generic_name: genericName.trim(),
          brand_names: (row["brand names"] || row["brand_names"] || "")
            .split(";")
            .map(b => b.trim())
            .filter(Boolean) || null,
          drug_class: (row["drug class"] || row["drug_class"] || row["class"] || "").trim() || null,
          route: (row["routes"] || row["route"] || "")
            .split(";")
            .map(r => r.trim())
            .filter(Boolean) || null,
          high_alert: ["yes", "true", "1"].includes((row["high alert"] || row["high_alert"] || "").toLowerCase()),
          controlled_substance: ["yes", "true", "1"].includes((row["controlled substance"] || row["controlled_substance"] || row["controlled"] || "").toLowerCase()),
          double_check_required: ["yes", "true", "1"].includes((row["double check required"] || row["double_check_required"] || row["double check"] || "").toLowerCase()),
        };

        const { error } = await supabase.from("medications").insert(medicationData);
        if (error) {
          errorCount++;
        } else {
          successCount++;
        }
      }

      const parts = [];
      if (successCount > 0) parts.push(`${successCount} imported`);
      if (skippedCount > 0) parts.push(`${skippedCount} duplicates skipped`);
      if (errorCount > 0) parts.push(`${errorCount} failed`);

      toast({
        title: "Import Complete",
        description: parts.join(", "),
      });

      setIsImportDialogOpen(false);
      setImportPreview([]);
      setImportSkipDuplicates(true);
      fetchMedications();
      fetchAllMedicationsForStats();
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: "An error occurred during import",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateHeaders = "Generic Name,Brand Names,Drug Class,Routes,High Alert,Controlled Substance,Double Check Required";
    const sampleRows = [
      '"Metoprolol","Lopressor; Toprol-XL","Beta Blocker","PO; IV",No,No,No',
      '"Heparin","","Anticoagulant","IV; SubQ",Yes,No,Yes',
      '"Morphine","MS Contin; Kadian","Opioid Analgesic","PO; IV; IM",Yes,Yes,Yes',
    ];
    const csvContent = [templateHeaders, ...sampleRows].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "medications-import-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Server-side pagination - medications are already filtered and paginated
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  // Memoized analytics calculations - prevents re-computation on every render
  const { totalMedications, highAlertCount, controlledCount, doubleCheckCount } = useMemo(() => ({
    totalMedications: allMedicationsForStats.length,
    highAlertCount: allMedicationsForStats.filter(m => m.high_alert).length,
    controlledCount: allMedicationsForStats.filter(m => m.controlled_substance).length,
    doubleCheckCount: allMedicationsForStats.filter(m => m.double_check_required).length,
  }), [allMedicationsForStats]);

  // Memoized unique drug classes with counts - avoids O(n²) in dropdown rendering
  const { drugClassesSorted, drugClassCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    allMedicationsForStats.forEach(m => {
      if (m.drug_class) {
        counts[m.drug_class] = (counts[m.drug_class] || 0) + 1;
      }
    });
    const sorted = Object.keys(counts).sort();
    return { drugClassesSorted: sorted, drugClassCounts: counts };
  }, [allMedicationsForStats]);

  // Memoized unique routes with counts
  const { routesSorted, routeCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    allMedicationsForStats.forEach(m => {
      if (m.route && Array.isArray(m.route)) {
        m.route.forEach(r => {
          if (r) {
            counts[r] = (counts[r] || 0) + 1;
          }
        });
      }
    });
    const sorted = Object.keys(counts).sort();
    return { routesSorted: sorted, routeCounts: counts };
  }, [allMedicationsForStats]);

  // Drug class distribution data for chart - use all medications
  const drugClassDistribution = useMemo(() => {
    const classCount: Record<string, number> = {};
    allMedicationsForStats.forEach(med => {
      const drugClass = med.drug_class || "Unclassified";
      classCount[drugClass] = (classCount[drugClass] || 0) + 1;
    });
    return Object.entries(classCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allMedicationsForStats]);

  const analyticsCards = [
    {
      title: "Total Medications",
      value: totalMedications,
      icon: Pill,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "High Alert",
      value: highAlertCount,
      subtitle: `${totalMedications > 0 ? ((highAlertCount / totalMedications) * 100).toFixed(1) : 0}% of total`,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Controlled Substances",
      value: controlledCount,
      subtitle: `${totalMedications > 0 ? ((controlledCount / totalMedications) * 100).toFixed(1) : 0}% of total`,
      icon: Lock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Double Check Required",
      value: doubleCheckCount,
      subtitle: `${totalMedications > 0 ? ((doubleCheckCount / totalMedications) * 100).toFixed(1) : 0}% of total`,
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar - Prominent at top */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search by generic or brand name... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button variant="outline" className="gap-2" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Import CSV
              </span>
            </Button>
          </label>
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Medication
          </Button>
        </div>
      </div>

      {/* Hidden file input for quick image upload */}
      <input
        ref={quickImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleQuickImageChange}
        className="hidden"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medications ({totalCount})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="space-y-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(filterDrugClass !== "all" || filterHighAlert !== "all" || filterControlled !== "all" || filterRoute !== "all") && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {[filterDrugClass !== "all", filterHighAlert !== "all", filterControlled !== "all", filterRoute !== "all"].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              {(filterDrugClass !== "all" || filterHighAlert !== "all" || filterControlled !== "all" || filterRoute !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterDrugClass("all");
                    setFilterHighAlert("all");
                    setFilterControlled("all");
                    setFilterRoute("all");
                  }}
                  className="gap-1 text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg border">
                <div className="space-y-1.5 min-w-[180px]">
                  <label className="text-sm font-medium">Drug Class</label>
                  <Select value={filterDrugClass} onValueChange={setFilterDrugClass}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">All Classes</SelectItem>
                      {drugClassesSorted.map((drugClass) => (
                        <SelectItem key={drugClass} value={drugClass}>
                          {drugClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 min-w-[140px]">
                  <label className="text-sm font-medium">High Alert</label>
                  <Select value={filterHighAlert} onValueChange={setFilterHighAlert}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="yes">High Alert Only</SelectItem>
                      <SelectItem value="no">Non-High Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 min-w-[140px]">
                  <label className="text-sm font-medium">Controlled</label>
                  <Select value={filterControlled} onValueChange={setFilterControlled}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="yes">Controlled Only</SelectItem>
                      <SelectItem value="no">Non-Controlled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 min-w-[140px]">
                  <label className="text-sm font-medium">Route</label>
                  <Select value={filterRoute} onValueChange={setFilterRoute}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All routes" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">All Routes</SelectItem>
                      {routesSorted.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route} ({routeCounts[route]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(filterDrugClass !== "all" || filterHighAlert !== "all" || filterControlled !== "all" || filterRoute !== "all") && !showFilters && (
              <div className="flex flex-wrap gap-2">
                {filterDrugClass !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Class: {filterDrugClass}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setFilterDrugClass("all")}
                    />
                  </Badge>
                )}
                {filterHighAlert !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    High Alert: {filterHighAlert === "yes" ? "Yes" : "No"}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setFilterHighAlert("all")}
                    />
                  </Badge>
                )}
                {filterControlled !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Controlled: {filterControlled === "yes" ? "Yes" : "No"}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setFilterControlled("all")}
                    />
                  </Badge>
                )}
                {filterRoute !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Route: {filterRoute}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => setFilterRoute("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Medications List - Always visible */}
          <>

          {/* Mobile Card View */}
          {isMobile ? (
            <div className="space-y-3">
              {listLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Searching...</span>
                </div>
              ) : medications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {debouncedSearch ? "No medications found matching your search" : "No medications in database"}
                </div>
              ) : (
                medications.map((med) => (
                  <div 
                    key={med.id}
                    className="border rounded-lg p-4 bg-card space-y-3"
                  >
                    {/* Header row with image, name, and actions */}
                    <div className="flex items-start gap-3">
                      <div
                        onClick={() => handleQuickImageClick(med)}
                        className="relative flex-shrink-0 cursor-pointer"
                        title={med.image_url ? "Tap to change image" : "Tap to add image"}
                      >
                        {quickUploadingMedId === med.id ? (
                          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        ) : med.image_url ? (
                          <img 
                            src={med.image_url} 
                            alt={med.generic_name} 
                            className="w-14 h-14 rounded-lg object-cover"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage({ url: med.image_url!, name: med.generic_name });
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{med.generic_name}</h3>
                        {med.brand_names && med.brand_names.length > 0 && (
                          <p className="text-sm text-muted-foreground truncate">
                            {med.brand_names.join(", ")}
                          </p>
                        )}
                        {med.drug_class && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {med.drug_class}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleOpenDialog(med)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeletingMedication(med);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Routes and Flags */}
                    <div className="flex flex-wrap gap-1.5">
                      {med.route && med.route.length > 0 && med.route.slice(0, 3).map((r) => {
                        const RouteIcon = getRouteIcon(r);
                        return (
                          <Badge key={r} variant="outline" className="text-xs gap-1 font-normal">
                            <RouteIcon className="h-3 w-3" />
                            {r}
                          </Badge>
                        );
                      })}
                      {med.route && med.route.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal">
                          +{med.route.length - 3}
                        </Badge>
                      )}
                      {med.high_alert && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          High Alert
                        </Badge>
                      )}
                      {med.double_check_required && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Double Check
                        </Badge>
                      )}
                      {med.controlled_substance && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Controlled
                        </Badge>
                      )}
                    </div>
                    <CompletenessIndicator med={med} />
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">Image</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead className="hidden lg:table-cell">Drug Class</TableHead>
                    <TableHead className="hidden sm:table-cell">Route</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="w-20">Complete</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Searching...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : medications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {debouncedSearch ? "No medications found matching your search" : "No medications in database"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    medications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell>
                          <div
                            onClick={() => handleQuickImageClick(med)}
                            onDragOver={(e) => handleDragOver(e, med.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, med)}
                            className={`relative group cursor-pointer rounded transition-all ${
                              dragOverMedId === med.id 
                                ? 'ring-2 ring-primary ring-offset-2 scale-110' 
                                : ''
                            }`}
                            title={med.image_url ? "Click or drop image to change" : "Click or drop image to add"}
                          >
                            {quickUploadingMedId === med.id ? (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              </div>
                            ) : dragOverMedId === med.id ? (
                              <div className="w-10 h-10 rounded bg-primary/20 border-2 border-dashed border-primary flex items-center justify-center">
                                <Upload className="h-4 w-4 text-primary" />
                              </div>
                            ) : med.image_url ? (
                              <div className="relative">
                                <img 
                                  src={med.image_url} 
                                  alt={med.generic_name} 
                                  className="w-10 h-10 rounded object-cover cursor-zoom-in"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImage({ url: med.image_url!, name: med.generic_name });
                                  }}
                                />
                                <div 
                                  className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                                >
                                  <Image className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors border-2 border-dashed border-transparent group-hover:border-primary/30">
                                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{med.generic_name}</span>
                            {med.brand_names && med.brand_names.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {med.brand_names.join(", ")}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {med.drug_class || "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {med.route && med.route.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {med.route.slice(0, 3).map((r) => {
                                const RouteIcon = getRouteIcon(r);
                                return (
                                  <Badge 
                                    key={r} 
                                    variant="outline" 
                                    className="text-xs gap-1 font-normal"
                                  >
                                    <RouteIcon className="h-3 w-3" />
                                    {r}
                                  </Badge>
                                );
                              })}
                              {med.route.length > 3 && (
                                <Badge variant="outline" className="text-xs font-normal">
                                  +{med.route.length - 3}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {med.high_alert && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                High Alert
                              </Badge>
                            )}
                            {med.double_check_required && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Double Check
                              </Badge>
                            )}
                            {med.controlled_substance && (
                              <Badge variant="outline" className="text-xs">
                                Controlled
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <CompletenessIndicator med={med} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(med)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingMedication(med);
                                setIsDeleteDialogOpen(true);
                              }}
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
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {totalCount === 0 ? 0 : startIndex + 1}-{endIndex} of {totalCount} medication{totalCount !== 1 ? "s" : ""}
              </span>
              <span className="text-muted-foreground/50">|</span>
              <div className="flex items-center gap-2">
                <span>Per page:</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="250">250</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                Last
              </Button>
            </div>
          </div>
          </>
        </CardContent>
      </Card>

      {/* Analytics Section - Collapsible at bottom */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setShowAnalytics(!showAnalytics)}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Analytics & Distribution</CardTitle>
            <Button variant="ghost" size="sm">
              {showAnalytics ? "Hide" : "Show"}
            </Button>
          </div>
        </CardHeader>
        {showAnalytics && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsCards.map((stat) => (
                <div key={stat.title} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  )}
                </div>
              ))}
            </div>

            {drugClassDistribution.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Distribution by Drug Class</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={drugClassDistribution.slice(0, 10)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {drugClassDistribution.slice(0, 10).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg shadow-lg p-2">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payload[0].value} medication{payload[0].value !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Medications per Class</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={drugClassDistribution.slice(0, 8)} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={120}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
                        />
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg shadow-lg p-2">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payload[0].value} medication{payload[0].value !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <MedicationEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        medicationId={editingMedication?.id || null}
        onSaved={() => {
          fetchMedications();
          fetchAllMedicationsForStats();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingMedication?.generic_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingMedication(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Import Medications from CSV</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto py-4">
            {checkingDuplicates ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span>Checking for duplicates...</span>
              </div>
            ) : (
              <>
                {/* Summary */}
                {(() => {
                  const duplicateCount = importPreview.filter(item => item.isDuplicate).length;
                  const newCount = importPreview.length - duplicateCount;
                  return (
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Badge variant="outline" className="text-sm py-1 px-3">
                        Total: {importPreview.length}
                      </Badge>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-sm py-1 px-3">
                        New: {newCount}
                      </Badge>
                      {duplicateCount > 0 && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-sm py-1 px-3">
                          Duplicates: {duplicateCount}
                        </Badge>
                      )}
                    </div>
                  );
                })()}

                {/* Skip duplicates option */}
                {importPreview.some(item => item.isDuplicate) && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <Checkbox 
                      id="skipDuplicates" 
                      checked={importSkipDuplicates}
                      onCheckedChange={(checked) => setImportSkipDuplicates(checked === true)}
                    />
                    <Label htmlFor="skipDuplicates" className="text-sm text-amber-800 dark:text-amber-200 cursor-pointer">
                      Skip duplicate medications (recommended)
                    </Label>
                  </div>
                )}

                <div className="rounded-md border overflow-auto max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead>Generic Name</TableHead>
                        <TableHead>Brand Names</TableHead>
                        <TableHead>Drug Class</TableHead>
                        <TableHead>Flags</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importPreview.slice(0, 50).map((item, idx) => {
                        const row = item.data;
                        const genericName = row["generic name"] || row["generic_name"] || row["name"] || "";
                        const brandNames = row["brand names"] || row["brand_names"] || "";
                        const drugClass = row["drug class"] || row["drug_class"] || row["class"] || "";
                        const highAlert = ["yes", "true", "1"].includes((row["high alert"] || row["high_alert"] || "").toLowerCase());
                        const controlled = ["yes", "true", "1"].includes((row["controlled substance"] || row["controlled_substance"] || row["controlled"] || "").toLowerCase());
                        
                        return (
                          <TableRow key={idx} className={item.isDuplicate ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}>
                            <TableCell>
                              {item.isDuplicate ? (
                                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                                  Duplicate
                                </Badge>
                              ) : (
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
                                  New
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {genericName || "—"}
                              {item.isDuplicate && item.matchedName && (
                                <span className="block text-xs text-muted-foreground">
                                  Matches: {item.matchedName}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{brandNames || "—"}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{drugClass || "—"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {highAlert && <Badge variant="destructive" className="text-xs">High Alert</Badge>}
                                {controlled && <Badge variant="outline" className="text-xs">Controlled</Badge>}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {importPreview.length > 50 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ...and {importPreview.length - 50} more medications
                  </p>
                )}
                <div className="mt-4 p-3 bg-muted rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Expected CSV columns:</p>
                    <p className="text-xs text-muted-foreground">
                      Generic Name, Brand Names (semicolon separated), Drug Class, Routes (semicolon separated), 
                      High Alert (Yes/No), Controlled Substance (Yes/No), Double Check Required (Yes/No)
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2 shrink-0">
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsImportDialogOpen(false); setImportPreview([]); setImportSkipDuplicates(true); }}>
              Cancel
            </Button>
            <Button 
              onClick={handleImportConfirm} 
              disabled={importing || checkingDuplicates}
            >
              {importing ? "Importing..." : (() => {
                const duplicateCount = importPreview.filter(item => item.isDuplicate).length;
                const toImport = importSkipDuplicates ? importPreview.length - duplicateCount : importPreview.length;
                return `Import ${toImport} Medication${toImport !== 1 ? 's' : ''}`;
              })()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>{lightboxImage?.name}</DialogTitle>
          </DialogHeader>
          {lightboxImage && (
            <div className="flex flex-col items-center gap-4">
              <img 
                src={lightboxImage.url} 
                alt={lightboxImage.name}
                className="max-h-[70vh] w-auto rounded-lg object-contain"
              />
              <p className="text-lg font-semibold text-foreground">{lightboxImage.name}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationsManagement;
