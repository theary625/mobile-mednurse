import { useState, useRef, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Image,
  Upload,
  Volume2,
  Play,
  Sparkles,
  Loader2,
  ChevronDown,
  Trash2,
  Droplets,
  Pill as PillIcon,
  Syringe,
  Wind,
  Cloud,
  Droplet,
  FileText,
  Activity,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  Settings,
  ClipboardList,
  Video,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import type { Json } from "@/integrations/supabase/types";
import {
  validateMedication,
  canPromoteToStatus,
  getCompletenessColor,
  getCompletenessBgColor,
  type ContentStatus,
} from "@/lib/medicationValidation";

// Full medication type matching database schema
export interface FullMedication {
  id: string;
  generic_name: string;
  brand_names: string[] | null;
  drug_class: string | null;
  route: string[] | null;
  high_alert: boolean | null;
  controlled_substance: boolean | null;
  double_check_required: boolean | null;
  clinical_pearls: string[] | null;
  ndc_code: string | null;
  manufacturer: string | null;
  dosage_form: string | null;
  strengths: string[] | null;
  image_url: string | null;
  video_url: string | null;
  pronunciation_audio_url: string | null;
  pronunciation_text: string | null;
  fda_link: string | null;
  fda_set_id: string | null;
  fda_label_url: string | null;
  fda_label_revision_date: string | null;
  content_status: string | null;
  sync_source: string | null;
  review_notes: string | null;
  // JSONB fields stored as strings for editing
  dosing_info: Json | null;
  adjustments: Json | null;
  safety_info: Json | null;
  administration_info: Json | null;
  safe_method: Json | null;
  rate_dilution: Json | null;
  line_compatibility: Json | null;
  monitoring: Json | null;
  hold_parameters: Json | null;
  required_resources: Json | null;
  crushing_info: Json | null;
  timing_rules: Json | null;
  patient_education: Json | null;
  red_flags: Json | null;
  expected_effect: Json | null;
  documentation_reminders: Json | null;
  safety_badges: Json | null;
  pause_triggers: Json | null;
  nursing_guide: Json | null;
  pharmacokinetics: Json | null;
  adverse_reactions: Json | null;
  drug_interactions_info: Json | null;
  visibility_settings: Json | null;
  created_at: string;
}

// Visibility settings interface
interface VisibilitySettings {
  hide_dosing: boolean;
  hide_adjustments: boolean;
  hide_safety_info: boolean;
  hide_administration: boolean;
  hide_safe_method: boolean;
  hide_rate_dilution: boolean;
  hide_line_compatibility: boolean;
  hide_monitoring: boolean;
  hide_hold_parameters: boolean;
  hide_required_resources: boolean;
  hide_crushing_info: boolean;
  hide_timing_rules: boolean;
  hide_patient_education: boolean;
  hide_red_flags: boolean;
  hide_expected_effect: boolean;
  hide_documentation_reminders: boolean;
  hide_safety_badges: boolean;
  hide_pause_triggers: boolean;
  hide_nursing_guide: boolean;
  hide_pharmacokinetics: boolean;
  hide_adverse_reactions: boolean;
  hide_drug_interactions: boolean;
  hide_clinical_pearls: boolean;
  hide_video: boolean;
  hide_pronunciation: boolean;
}

const defaultVisibility: VisibilitySettings = {
  hide_dosing: false,
  hide_adjustments: false,
  hide_safety_info: false,
  hide_administration: false,
  hide_safe_method: false,
  hide_rate_dilution: false,
  hide_line_compatibility: false,
  hide_monitoring: false,
  hide_hold_parameters: false,
  hide_required_resources: false,
  hide_crushing_info: false,
  hide_timing_rules: false,
  hide_patient_education: false,
  hide_red_flags: false,
  hide_expected_effect: false,
  hide_documentation_reminders: false,
  hide_safety_badges: false,
  hide_pause_triggers: false,
  hide_nursing_guide: false,
  hide_pharmacokinetics: false,
  hide_adverse_reactions: false,
  hide_drug_interactions: false,
  hide_clinical_pearls: false,
  hide_video: false,
  hide_pronunciation: false,
};

interface MedicationFormData {
  generic_name: string;
  brand_names: string;
  drug_class: string;
  route: string;
  high_alert: boolean;
  controlled_substance: boolean;
  double_check_required: boolean;
  clinical_pearls: string;
  ndc_code: string;
  manufacturer: string;
  dosage_form: string;
  strengths: string;
  image_url: string;
  video_url: string;
  pronunciation_audio_url: string;
  pronunciation_text: string;
  fda_link: string;
  fda_set_id: string;
  fda_label_url: string;
  fda_label_revision_date: string;
  content_status: string;
  sync_source: string;
  review_notes: string;
  // JSONB as strings
  dosing_info: string;
  adjustments: string;
  safety_info: string;
  administration_info: string;
  safe_method: string;
  rate_dilution: string;
  line_compatibility: string;
  monitoring: string;
  hold_parameters: string;
  required_resources: string;
  crushing_info: string;
  timing_rules: string;
  patient_education: string;
  red_flags: string;
  expected_effect: string;
  documentation_reminders: string;
  safety_badges: string;
  pause_triggers: string;
  nursing_guide: string;
  pharmacokinetics: string;
  adverse_reactions: string;
  drug_interactions_info: string;
}

const initialFormData: MedicationFormData = {
  generic_name: "",
  brand_names: "",
  drug_class: "",
  route: "",
  high_alert: false,
  controlled_substance: false,
  double_check_required: false,
  clinical_pearls: "",
  ndc_code: "",
  manufacturer: "",
  dosage_form: "",
  strengths: "",
  image_url: "",
  video_url: "",
  pronunciation_audio_url: "",
  pronunciation_text: "",
  fda_link: "",
  fda_set_id: "",
  fda_label_url: "",
  fda_label_revision_date: "",
  content_status: "draft",
  sync_source: "",
  review_notes: "",
  dosing_info: "",
  adjustments: "",
  safety_info: "",
  administration_info: "",
  safe_method: "",
  rate_dilution: "",
  line_compatibility: "",
  monitoring: "",
  hold_parameters: "",
  required_resources: "",
  crushing_info: "",
  timing_rules: "",
  patient_education: "",
  red_flags: "",
  expected_effect: "",
  documentation_reminders: "",
  safety_badges: "",
  pause_triggers: "",
  nursing_guide: "",
  pharmacokinetics: "",
  adverse_reactions: "",
  drug_interactions_info: "",
};

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

const getRouteIcon = (route: string): React.ElementType => {
  const key = route.toLowerCase().replace(/\s+/g, '');
  return ROUTE_ICONS[key] || PillIcon;
};

const jsonToString = (json: Json | null): string => {
  if (!json) return "";
  try {
    return JSON.stringify(json, null, 2);
  } catch {
    return "";
  }
};

const stringToJson = (str: string): Json | null => {
  if (!str.trim()) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicationId: string | null;
  onSaved: () => void;
  initialTab?: string;
}

export default function MedicationEditDialog({ open, onOpenChange, medicationId, onSaved, initialTab }: Props) {
  const [formData, setFormData] = useState<MedicationFormData>(initialFormData);
  const [originalStatus, setOriginalStatus] = useState<string>("draft");
  const [loading, setLoading] = useState(false);
  const [rawMedication, setRawMedication] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [isPreviewingPronunciation, setIsPreviewingPronunciation] = useState(false);
  const [generatingPronunciation, setGeneratingPronunciation] = useState(false);
  const [routeImages, setRouteImages] = useState<{ route: string; url: string }[]>([]);
  const [selectedRouteForUpload, setSelectedRouteForUpload] = useState("");
  const [uploadingRouteImage, setUploadingRouteImage] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || "basic");
  const [visibility, setVisibility] = useState<VisibilitySettings>(defaultVisibility);
  const routeImageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const isMobile = useIsMobile();

  // Reset tab when initialTab changes
  useEffect(() => {
    if (open && initialTab) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Calculate completeness score using raw DB data (matches list view)
  const validationResult = useMemo(() => {
    if (rawMedication) {
      return validateMedication(rawMedication, (formData.content_status as ContentStatus) || 'draft');
    }
    // Fallback for new medications (no DB record yet)
    const medData: Record<string, unknown> = {
      generic_name: formData.generic_name.trim(),
      brand_names: formData.brand_names ? formData.brand_names.split(",").map(b => b.trim()).filter(Boolean) : null,
      drug_class: formData.drug_class.trim() || null,
      route: formData.route ? formData.route.split(",").map(r => r.trim()).filter(Boolean) : null,
      clinical_pearls: formData.clinical_pearls ? formData.clinical_pearls.split("\n").map(p => p.trim()).filter(Boolean) : null,
      image_url: formData.image_url || null,
      pronunciation_text: formData.pronunciation_text.trim() || null,
      dosing_info: stringToJson(formData.dosing_info),
      adjustments: stringToJson(formData.adjustments),
      safety_info: stringToJson(formData.safety_info),
      administration_info: stringToJson(formData.administration_info),
      monitoring: stringToJson(formData.monitoring),
      hold_parameters: stringToJson(formData.hold_parameters),
      patient_education: stringToJson(formData.patient_education),
      nursing_guide: stringToJson(formData.nursing_guide),
      pharmacokinetics: stringToJson(formData.pharmacokinetics),
      adverse_reactions: stringToJson(formData.adverse_reactions),
      drug_interactions_info: stringToJson(formData.drug_interactions_info),
      content_status: formData.content_status,
    };
    return validateMedication(medData, (formData.content_status as ContentStatus) || 'draft');
  }, [rawMedication, formData]);

  // Fetch full medication data when editing
  useEffect(() => {
    if (open && medicationId) {
      fetchMedication();
    } else if (open && !medicationId) {
      setFormData(initialFormData);
      setOriginalStatus("draft");
      setRouteImages([]);
      setAudioFile(null);
      setVisibility(defaultVisibility);
      setRawMedication(null);
    }
  }, [open, medicationId]);

  const fetchMedication = async () => {
    if (!medicationId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("id", medicationId)
        .single();

      if (error) throw error;

      setRawMedication(data as Record<string, unknown>);
      const med = data as FullMedication;
      setFormData({
        generic_name: med.generic_name || "",
        brand_names: med.brand_names?.join(", ") || "",
        drug_class: med.drug_class || "",
        route: med.route?.join(", ") || "",
        high_alert: med.high_alert || false,
        controlled_substance: med.controlled_substance || false,
        double_check_required: med.double_check_required || false,
        clinical_pearls: med.clinical_pearls?.join("\n") || "",
        ndc_code: med.ndc_code || "",
        manufacturer: med.manufacturer || "",
        dosage_form: med.dosage_form || "",
        strengths: med.strengths?.join(", ") || "",
        image_url: med.image_url || "",
        video_url: med.video_url || "",
        pronunciation_audio_url: med.pronunciation_audio_url || "",
        pronunciation_text: med.pronunciation_text || "",
        fda_link: med.fda_link || "",
        fda_set_id: med.fda_set_id || "",
        fda_label_url: med.fda_label_url || "",
        fda_label_revision_date: med.fda_label_revision_date || "",
        content_status: med.content_status || "draft",
        sync_source: med.sync_source || "",
        review_notes: med.review_notes || "",
        dosing_info: jsonToString(med.dosing_info),
        adjustments: jsonToString(med.adjustments),
        safety_info: jsonToString(med.safety_info),
        administration_info: jsonToString(med.administration_info),
        safe_method: jsonToString(med.safe_method),
        rate_dilution: jsonToString(med.rate_dilution),
        line_compatibility: jsonToString(med.line_compatibility),
        monitoring: jsonToString(med.monitoring),
        hold_parameters: jsonToString(med.hold_parameters),
        required_resources: jsonToString(med.required_resources),
        crushing_info: jsonToString(med.crushing_info),
        timing_rules: jsonToString(med.timing_rules),
        patient_education: jsonToString(med.patient_education),
        red_flags: jsonToString(med.red_flags),
        expected_effect: jsonToString(med.expected_effect),
        documentation_reminders: jsonToString(med.documentation_reminders),
        safety_badges: jsonToString(med.safety_badges),
        pause_triggers: jsonToString(med.pause_triggers),
        nursing_guide: jsonToString(med.nursing_guide),
        pharmacokinetics: jsonToString(med.pharmacokinetics),
        adverse_reactions: jsonToString(med.adverse_reactions),
        drug_interactions_info: jsonToString(med.drug_interactions_info),
      });

      setOriginalStatus(med.content_status || "draft");

      // Load visibility settings
      if (med.visibility_settings && typeof med.visibility_settings === 'object' && !Array.isArray(med.visibility_settings)) {
        setVisibility({ ...defaultVisibility, ...(med.visibility_settings as unknown as Partial<VisibilitySettings>) });
      } else {
        setVisibility(defaultVisibility);
      }

      // Extract route images from nursing_guide
      if (med.nursing_guide) {
        const guide = med.nursing_guide as Record<string, unknown>;
        const images: { route: string; url: string }[] = [];
        for (const [key, value] of Object.entries(guide)) {
          const routeData = value as Record<string, unknown> | undefined;
          if (routeData?.image_url && typeof routeData.image_url === 'string') {
            images.push({ route: key, url: routeData.image_url });
          }
        }
        setRouteImages(images);
      }
    } catch (error) {
      console.error("Error fetching medication:", error);
      toast({
        title: "Error",
        description: "Failed to load medication data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.generic_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Generic name is required",
        variant: "destructive",
      });
      return;
    }

    // Check if trying to promote to approved status
    if (formData.content_status === 'approved') {
      const isNewPromotion = originalStatus !== 'approved';
      const promotionCheck = canPromoteToStatus(
        {
          generic_name: formData.generic_name.trim(),
          route: formData.route ? formData.route.split(",").map(r => r.trim()).filter(Boolean) : null,
          drug_class: formData.drug_class.trim() || null,
          dosing_info: stringToJson(formData.dosing_info),
          safety_info: stringToJson(formData.safety_info),
          nursing_guide: stringToJson(formData.nursing_guide),
          adverse_reactions: stringToJson(formData.adverse_reactions),
          hold_parameters: stringToJson(formData.hold_parameters),
          monitoring: stringToJson(formData.monitoring),
          patient_education: stringToJson(formData.patient_education),
        },
        'approved'
      );
      
      if (!promotionCheck.canPromote) {
        if (isNewPromotion) {
          toast({
            title: "Cannot Approve",
            description: `Missing required fields: ${promotionCheck.blockers.slice(0, 3).join(', ')}${promotionCheck.blockers.length > 3 ? '...' : ''}`,
            variant: "destructive",
          });
          return;
        } else {
          // Already approved — warn but allow save
          toast({
            title: "Warning",
            description: `Saved with incomplete fields: ${promotionCheck.blockers.slice(0, 3).join(', ')}${promotionCheck.blockers.length > 3 ? '...' : ''}`,
          });
        }
      }
    }

    // Show warnings for missing recommended fields
    if (validationResult.warnings.length > 0 && validationResult.completenessScore < 70) {
      toast({
        title: "Data Incomplete",
        description: `${validationResult.missingFields.length} fields are incomplete. Consider adding more data.`,
      });
    }

    setSaving(true);
    try {
      let audioUrl = formData.pronunciation_audio_url;

      // Upload audio if selected
      if (audioFile) {
        setUploadingAudio(true);
        const ext = audioFile.name.split(".").pop() || "mp3";
        const safeName = formData.generic_name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
        const fileName = `${Date.now()}-${safeName}.${ext}`;
        const filePath = `audio/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("medication-assets")
          .upload(filePath, audioFile, { upsert: true, contentType: audioFile.type || "audio/*" });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("medication-assets").getPublicUrl(filePath);
        audioUrl = urlData.publicUrl;
        setUploadingAudio(false);
      }

      // Build full medication data object
      const medicationData = {
        generic_name: formData.generic_name.trim(),
        brand_names: formData.brand_names ? formData.brand_names.split(",").map(b => b.trim()).filter(Boolean) : null,
        drug_class: formData.drug_class.trim() || null,
        route: formData.route ? formData.route.split(",").map(r => r.trim()).filter(Boolean) : null,
        high_alert: formData.high_alert,
        controlled_substance: formData.controlled_substance,
        double_check_required: formData.double_check_required,
        clinical_pearls: formData.clinical_pearls ? formData.clinical_pearls.split("\n").map(p => p.trim()).filter(Boolean) : null,
        ndc_code: formData.ndc_code.trim() || null,
        manufacturer: formData.manufacturer.trim() || null,
        dosage_form: formData.dosage_form.trim() || null,
        strengths: formData.strengths ? formData.strengths.split(",").map(s => s.trim()).filter(Boolean) : null,
        image_url: formData.image_url || null,
        video_url: formData.video_url.trim() || null,
        pronunciation_audio_url: audioUrl || null,
        pronunciation_text: formData.pronunciation_text.trim() || null,
        fda_link: formData.fda_link.trim() || null,
        fda_set_id: formData.fda_set_id.trim() || null,
        fda_label_url: formData.fda_label_url.trim() || null,
        fda_label_revision_date: formData.fda_label_revision_date.trim() || null,
        content_status: formData.content_status || "draft",
        sync_source: formData.sync_source.trim() || null,
        review_notes: formData.review_notes.trim() || null,
        dosing_info: stringToJson(formData.dosing_info),
        adjustments: stringToJson(formData.adjustments),
        safety_info: stringToJson(formData.safety_info),
        administration_info: stringToJson(formData.administration_info),
        safe_method: stringToJson(formData.safe_method),
        rate_dilution: stringToJson(formData.rate_dilution),
        line_compatibility: stringToJson(formData.line_compatibility),
        monitoring: stringToJson(formData.monitoring),
        hold_parameters: stringToJson(formData.hold_parameters),
        required_resources: stringToJson(formData.required_resources),
        crushing_info: stringToJson(formData.crushing_info),
        timing_rules: stringToJson(formData.timing_rules),
        patient_education: stringToJson(formData.patient_education),
        red_flags: stringToJson(formData.red_flags),
        expected_effect: stringToJson(formData.expected_effect),
        documentation_reminders: stringToJson(formData.documentation_reminders),
        safety_badges: stringToJson(formData.safety_badges),
        pause_triggers: stringToJson(formData.pause_triggers),
        nursing_guide: stringToJson(formData.nursing_guide),
        pharmacokinetics: stringToJson(formData.pharmacokinetics),
        adverse_reactions: stringToJson(formData.adverse_reactions),
        drug_interactions_info: stringToJson(formData.drug_interactions_info),
        visibility_settings: visibility as unknown as Json,
      };

      if (medicationId) {
        const { error } = await supabase.from("medications").update(medicationData).eq("id", medicationId);
        if (error) throw error;
        
        logActivity({
          actionType: 'medication_updated',
          entityType: 'medication',
          entityId: medicationId,
          details: { generic_name: formData.generic_name },
        });

        // Update rawMedication so completeness score reflects edits immediately
        setRawMedication(prev => prev ? { ...prev, ...medicationData } : medicationData as Record<string, unknown>);

        toast({ title: "Success", description: "Medication updated successfully" });
      } else {
        const { data: newMed, error } = await supabase.from("medications").insert(medicationData).select().single();
        if (error) throw error;
        
        logActivity({
          actionType: 'medication_created',
          entityType: 'medication',
          entityId: newMed?.id,
          details: { generic_name: formData.generic_name },
        });

        toast({ title: "Success", description: "Medication added successfully" });
      }

      onOpenChange(false);
      onSaved();
    } catch (error: any) {
      console.error("Error saving medication:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save medication",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setUploadingImage(false);
      setUploadingAudio(false);
    }
  };

  // Route image handlers
  const handleRouteImageUpload = async (file: File) => {
    if (!file || !medicationId || !selectedRouteForUpload) {
      toast({ title: "Missing information", description: "Select a route and file to upload", variant: "destructive" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setUploadingRouteImage(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const form = new FormData();
      form.append("file", file);
      form.append("medicationId", medicationId);
      form.append("medicationName", formData.generic_name);
      form.append("route", selectedRouteForUpload);

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-upload-medication-image`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form }
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || `Upload failed`);

      setRouteImages(prev => {
        const filtered = prev.filter(ri => ri.route.toLowerCase() !== selectedRouteForUpload.toLowerCase());
        return [...filtered, { route: selectedRouteForUpload, url: payload.publicUrl }];
      });
      toast({ title: "Route image uploaded", description: `Image added for ${selectedRouteForUpload} route` });
      setSelectedRouteForUpload("");
    } catch (error: any) {
      toast({ title: "Upload failed", description: error?.message || "Failed to upload", variant: "destructive" });
    } finally {
      setUploadingRouteImage(false);
    }
  };

  const handleRemoveRouteImage = async (route: string) => {
    if (!medicationId) return;
    try {
      const { data: med } = await supabase.from("medications").select("nursing_guide").eq("id", medicationId).single();
      if (med?.nursing_guide) {
        const guide = med.nursing_guide as Record<string, unknown>;
        for (const [key, value] of Object.entries(guide)) {
          if (key.toLowerCase() === route.toLowerCase()) {
            const routeData = value as Record<string, unknown>;
            if (routeData) delete routeData.image_url;
            guide[key] = routeData;
            break;
          }
        }
        await supabase.from("medications").update({ nursing_guide: guide as Json }).eq("id", medicationId);
      }
      setRouteImages(prev => prev.filter(ri => ri.route.toLowerCase() !== route.toLowerCase()));
      toast({ title: "Image removed", description: `Removed image for ${route} route` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove route image", variant: "destructive" });
    }
  };

  // Main image upload - uploads immediately when selected
  const handleMainImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!medicationId) {
      toast({ title: "Save first", description: "Save the medication before uploading an image", variant: "destructive" });
      return;
    }
    
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setUploadingImage(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const form = new FormData();
      form.append("file", file);
      form.append("medicationId", medicationId);
      form.append("medicationName", formData.generic_name);

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-upload-medication-image`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form }
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || `Upload failed`);

      updateField("image_url", payload.publicUrl);
      toast({ title: "Image uploaded", description: "Medication image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error?.message || "Failed to upload", variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  // Pronunciation handlers
  const generatePronunciation = async () => {
    if (!formData.generic_name.trim()) {
      toast({ title: "No medication name", description: "Enter a generic name first", variant: "destructive" });
      return;
    }
    setGeneratingPronunciation(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pronunciation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({ medicationName: formData.generic_name.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setFormData({ ...formData, pronunciation_text: data.pronunciation });
      toast({ title: "Pronunciation generated", description: `Generated: ${data.pronunciation}` });
    } catch (error: any) {
      toast({ title: "Generation failed", description: error?.message || "Failed", variant: "destructive" });
    } finally {
      setGeneratingPronunciation(false);
    }
  };

  const previewPronunciation = () => {
    if (!formData.generic_name.trim()) return;
    if ('speechSynthesis' in window) {
      setIsPreviewingPronunciation(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(formData.generic_name);
      utterance.rate = 0.8;
      utterance.onend = () => setIsPreviewingPronunciation(false);
      utterance.onerror = () => setIsPreviewingPronunciation(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateField = (field: keyof MedicationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-full h-[100dvh] sm:max-w-4xl sm:h-auto sm:max-h-[90vh] p-0 sm:p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full h-[100dvh] sm:max-w-4xl sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        {/* Sticky header on mobile */}
        <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 sm:px-6 sm:pt-6 sm:pb-4 sm:border-b-0">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
              {medicationId ? "Edit Medication" : "Add New Medication"}
              {formData.generic_name && !isMobile && (
                <span className="text-muted-foreground font-normal">— {formData.generic_name}</span>
              )}
            </DialogTitle>
            {formData.generic_name && isMobile && (
              <span className="text-sm font-normal text-muted-foreground truncate">
                {formData.generic_name}
              </span>
            )}
          </DialogHeader>
          
          {/* Completeness Bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Data Completeness</span>
                <span className={`text-xs font-medium ${getCompletenessColor(validationResult.completenessScore)}`}>
                  {validationResult.completenessScore}% ({validationResult.completedFields}/{validationResult.totalFields})
                </span>
              </div>
              <Progress 
                value={validationResult.completenessScore} 
                className="h-2"
              />
            </div>
            <Badge 
              variant={formData.content_status === 'approved' ? 'default' : 'secondary'}
              className="capitalize text-xs"
            >
              {formData.content_status || 'draft'}
            </Badge>
          </div>
          
          {/* Missing Fields Warning */}
          {validationResult.missingFields.length > 0 && validationResult.completenessScore < 70 && (
            <div className="mt-2 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              <span>
                Missing for {formData.content_status || 'draft'}: {validationResult.missingFields.slice(0, 3).map(f => f.label).join(', ')}
                {validationResult.missingFields.length > 3 && ` +${validationResult.missingFields.length - 3} more`}
              </span>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable tabs on mobile */}
          <div className="px-4 sm:px-6">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-6 sm:w-full h-auto p-1">
                <TabsTrigger value="basic" className="text-xs gap-1 px-3 py-2 whitespace-nowrap">
                  <FileText className="h-3 w-3" />
                  <span className="hidden sm:inline">Basic</span>
                  <span className="sm:hidden">Basic Info</span>
                </TabsTrigger>
                <TabsTrigger value="clinical" className="text-xs gap-1 px-3 py-2 whitespace-nowrap">
                  <Activity className="h-3 w-3" />
                  Clinical
                </TabsTrigger>
                <TabsTrigger value="safety" className="text-xs gap-1 px-3 py-2 whitespace-nowrap">
                  <AlertTriangle className="h-3 w-3" />
                  Safety
                </TabsTrigger>
                <TabsTrigger value="nursing" className="text-xs gap-1 px-3 py-2 whitespace-nowrap">
                  <Stethoscope className="h-3 w-3" />
                  Nursing
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs gap-1 px-3 py-2 whitespace-nowrap">
                  <Image className="h-3 w-3" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="visibility" className="text-xs gap-1 px-3 py-2 whitespace-nowrap">
                  <Eye className="h-3 w-3" />
                  Visibility
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-6">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="generic_name">Generic Name *</Label>
                  <Input id="generic_name" value={formData.generic_name} onChange={e => updateField("generic_name", e.target.value)} placeholder="e.g., Metoprolol" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand_names">Brand Names (comma-separated)</Label>
                  <Input id="brand_names" value={formData.brand_names} onChange={e => updateField("brand_names", e.target.value)} placeholder="e.g., Lopressor, Toprol-XL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drug_class">Drug Class</Label>
                  <Input id="drug_class" value={formData.drug_class} onChange={e => updateField("drug_class", e.target.value)} placeholder="e.g., Beta Blocker" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="route">Routes (comma-separated)</Label>
                  <Input id="route" value={formData.route} onChange={e => updateField("route", e.target.value)} placeholder="e.g., IV, PO" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage_form">Dosage Form</Label>
                  <Input id="dosage_form" value={formData.dosage_form} onChange={e => updateField("dosage_form", e.target.value)} placeholder="e.g., Tablet, Injectable" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strengths">Strengths (comma-separated)</Label>
                  <Input id="strengths" value={formData.strengths} onChange={e => updateField("strengths", e.target.value)} placeholder="e.g., 25mg, 50mg, 100mg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" value={formData.manufacturer} onChange={e => updateField("manufacturer", e.target.value)} placeholder="e.g., Pfizer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ndc_code">NDC Code</Label>
                  <Input id="ndc_code" value={formData.ndc_code} onChange={e => updateField("ndc_code", e.target.value)} placeholder="e.g., 0000-0000-00" />
                  <p className="text-xs text-muted-foreground italic">Note: NDC codes can vary by manufacturer and package size. Always check the specific product label.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="high_alert" checked={formData.high_alert} onCheckedChange={checked => updateField("high_alert", checked === true)} />
                  <Label htmlFor="high_alert" className="font-normal">High Alert Medication</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="double_check" checked={formData.double_check_required} onCheckedChange={checked => updateField("double_check_required", checked === true)} />
                  <Label htmlFor="double_check" className="font-normal">Requires Double Check</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="controlled" checked={formData.controlled_substance} onCheckedChange={checked => updateField("controlled_substance", checked === true)} />
                  <Label htmlFor="controlled" className="font-normal">Controlled Substance</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinical_pearls">Clinical Pearls (one per line)</Label>
                <Textarea id="clinical_pearls" value={formData.clinical_pearls} onChange={e => updateField("clinical_pearls", e.target.value)} placeholder="Enter clinical pearls, one per line" rows={4} />
              </div>

              {/* FDA Info Collapsible */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> FDA Information</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fda_link">FDA Link</Label>
                      <Input id="fda_link" value={formData.fda_link} onChange={e => updateField("fda_link", e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fda_set_id">FDA Set ID</Label>
                      <Input id="fda_set_id" value={formData.fda_set_id} onChange={e => updateField("fda_set_id", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fda_label_url">FDA Label URL</Label>
                      <Input id="fda_label_url" value={formData.fda_label_url} onChange={e => updateField("fda_label_url", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fda_label_revision_date">Label Revision Date</Label>
                      <Input id="fda_label_revision_date" value={formData.fda_label_revision_date} onChange={e => updateField("fda_label_revision_date", e.target.value)} placeholder="e.g., 2024-01" />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Admin/Status Info */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2"><Settings className="h-4 w-4" /> Status & Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="content_status">Content Status</Label>
                      <Select value={formData.content_status} onValueChange={v => updateField("content_status", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sync_source">Sync Source</Label>
                      <Input id="sync_source" value={formData.sync_source} onChange={e => updateField("sync_source", e.target.value)} placeholder="e.g., OpenFDA, Manual" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review_notes">Review Notes</Label>
                    <Textarea id="review_notes" value={formData.review_notes} onChange={e => updateField("review_notes", e.target.value)} rows={3} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            {/* Clinical Tab */}
            <TabsContent value="clinical" className="mt-0 space-y-4">
              <JsonFieldEditor label="Dosing Information" value={formData.dosing_info} onChange={v => updateField("dosing_info", v)} placeholder='{"adult": "...", "pediatric": "..."}' />
              <JsonFieldEditor label="Adjustments (Renal/Hepatic)" value={formData.adjustments} onChange={v => updateField("adjustments", v)} placeholder='{"renal": {...}, "hepatic": {...}}' />
              <JsonFieldEditor label="Pharmacokinetics" value={formData.pharmacokinetics} onChange={v => updateField("pharmacokinetics", v)} placeholder='{"absorption": "...", "distribution": "...", "metabolism": "...", "elimination": "..."}' />
              <JsonFieldEditor label="Drug Interactions" value={formData.drug_interactions_info} onChange={v => updateField("drug_interactions_info", v)} placeholder='[{"drug": "...", "severity": "...", "effect": "..."}]' />
            </TabsContent>

            {/* Safety Tab */}
            <TabsContent value="safety" className="mt-0 space-y-4">
              <JsonFieldEditor label="Safety Information" value={formData.safety_info} onChange={v => updateField("safety_info", v)} placeholder='{"contraindications": [...], "warnings": [...]}' />
              <JsonFieldEditor label="Red Flags" value={formData.red_flags} onChange={v => updateField("red_flags", v)} placeholder='["Stop if...", "Watch for..."]' />
              <JsonFieldEditor label="Adverse Reactions" value={formData.adverse_reactions} onChange={v => updateField("adverse_reactions", v)} placeholder='{"common": [...], "serious": [...]}' />
              <JsonFieldEditor label="Safety Badges" value={formData.safety_badges} onChange={v => updateField("safety_badges", v)} placeholder='[{"type": "high-alert", "label": "..."}]' />
              <JsonFieldEditor label="Pause Triggers" value={formData.pause_triggers} onChange={v => updateField("pause_triggers", v)} placeholder='["If HR < 60", "If SBP < 90"]' />
            </TabsContent>

            {/* Nursing Tab */}
            <TabsContent value="nursing" className="mt-0 space-y-4">
              <JsonFieldEditor label="Administration Info" value={formData.administration_info} onChange={v => updateField("administration_info", v)} placeholder='{"iv": {...}, "oral": {...}}' />
              <JsonFieldEditor label="Safe Method (5 Rights)" value={formData.safe_method} onChange={v => updateField("safe_method", v)} />
              <JsonFieldEditor label="Rate & Dilution" value={formData.rate_dilution} onChange={v => updateField("rate_dilution", v)} placeholder='{"standard": {...}, "max_rate": "..."}' />
              <JsonFieldEditor label="Line Compatibility" value={formData.line_compatibility} onChange={v => updateField("line_compatibility", v)} placeholder='{"compatible": [...], "incompatible": [...]}' />
              <JsonFieldEditor label="Monitoring" value={formData.monitoring} onChange={v => updateField("monitoring", v)} placeholder='{"vitals": [...], "labs": [...]}' />
              <JsonFieldEditor label="Hold Parameters" value={formData.hold_parameters} onChange={v => updateField("hold_parameters", v)} placeholder='["Hold if HR < 60", "Hold if K > 5.5"]' />
              <JsonFieldEditor label="Required Resources" value={formData.required_resources} onChange={v => updateField("required_resources", v)} />
              <JsonFieldEditor label="Crushing Info" value={formData.crushing_info} onChange={v => updateField("crushing_info", v)} placeholder='{"crushable": true, "alternatives": "..."}' />
              <JsonFieldEditor label="Timing Rules" value={formData.timing_rules} onChange={v => updateField("timing_rules", v)} placeholder='{"with_food": true, "frequency": "..."}' />
              <JsonFieldEditor label="Patient Education" value={formData.patient_education} onChange={v => updateField("patient_education", v)} placeholder='["Take with food", "Avoid grapefruit"]' />
              <JsonFieldEditor label="Expected Effect" value={formData.expected_effect} onChange={v => updateField("expected_effect", v)} />
              <JsonFieldEditor label="Documentation Reminders" value={formData.documentation_reminders} onChange={v => updateField("documentation_reminders", v)} />
              <JsonFieldEditor label="Nursing Guide (Full)" value={formData.nursing_guide} onChange={v => updateField("nursing_guide", v)} placeholder='{"IV": {...}, "Oral": {...}}' />
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="mt-0 space-y-4">
              {/* Main Image */}
              <div className="space-y-2 border rounded-lg p-4">
                <Label className="flex items-center gap-2"><Image className="h-4 w-4" />Main Medication Image</Label>
                <div className="flex items-center gap-3">
                  {formData.image_url && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleMainImageSelect} className="hidden" disabled={uploadingImage || !medicationId} />
                      <Button type="button" variant="outline" size="sm" asChild disabled={uploadingImage || !medicationId}>
                        <span className="gap-2">
                          {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          {uploadingImage ? "Uploading..." : formData.image_url ? "Replace" : "Upload"}
                        </span>
                      </Button>
                    </label>
                    {formData.image_url && (
                      <Button type="button" variant="ghost" size="sm" className="ml-2 text-destructive" onClick={() => updateField("image_url", "")}>Remove</Button>
                    )}
                  </div>
                </div>
                {!medicationId && <p className="text-xs text-muted-foreground">Save medication first to upload image</p>}
              </div>

              {/* Video URL */}
              <div className="space-y-2 border rounded-lg p-4">
                <Label htmlFor="video_url" className="flex items-center gap-2"><Video className="h-4 w-4" />Video URL</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="video_url" 
                    value={formData.video_url} 
                    onChange={e => updateField("video_url", e.target.value)} 
                    placeholder="https://youtube.com/watch?v=... or video URL" 
                    className="flex-1"
                  />
                  {formData.video_url && (
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={formData.video_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />Preview
                      </a>
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Add a YouTube, Vimeo, or direct video link for educational content</p>
              </div>

              {/* Route-Specific Images */}
              {medicationId && formData.route && (
                <div className="space-y-3 border rounded-lg p-4">
                  <Label className="flex items-center gap-2"><Image className="h-4 w-4" />Route-Specific Images</Label>
                  <p className="text-xs text-muted-foreground">Upload different images for each route (e.g., IV vial, oral tablets)</p>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs">Select Route</Label>
                      <Select value={selectedRouteForUpload} onValueChange={setSelectedRouteForUpload}>
                        <SelectTrigger><SelectValue placeholder="Choose route..." /></SelectTrigger>
                        <SelectContent>
                          {formData.route.split(",").map(r => r.trim()).filter(Boolean).map(route => {
                            const RouteIcon = getRouteIcon(route);
                            const hasImage = routeImages.some(ri => ri.route.toLowerCase() === route.toLowerCase());
                            return (
                              <SelectItem key={route} value={route}>
                                <span className="flex items-center gap-2">
                                  <RouteIcon className="h-4 w-4" />{route}
                                  {hasImage && <Badge variant="outline" className="ml-1 text-xs">Has image</Badge>}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <input ref={routeImageInputRef} type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) handleRouteImageUpload(file); e.target.value = ''; }} className="hidden" />
                    <Button type="button" variant="outline" size="sm" onClick={() => routeImageInputRef.current?.click()} disabled={!selectedRouteForUpload || uploadingRouteImage}>
                      {uploadingRouteImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      <span className="ml-1">Upload</span>
                    </Button>
                  </div>
                  {routeImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                      {routeImages.map(({ route, url }) => {
                        const RouteIcon = getRouteIcon(route);
                        return (
                          <div key={route} className="relative group rounded-lg border overflow-hidden bg-muted">
                            <img src={url} alt={`${route} route`} className="w-full h-20 object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <span className="flex items-center gap-1 text-xs text-white font-medium"><RouteIcon className="h-3 w-3" />{route}</span>
                            </div>
                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveRouteImage(route)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Audio */}
              <div className="space-y-2 border rounded-lg p-4">
                <Label className="flex items-center gap-2"><Volume2 className="h-4 w-4" />Pronunciation Audio</Label>
                <div className="flex items-center gap-2 mb-2">
                  <Button type="button" variant="secondary" size="sm" onClick={previewPronunciation} disabled={isPreviewingPronunciation || !formData.generic_name.trim()} className="gap-2">
                    <Play className={`h-4 w-4 ${isPreviewingPronunciation ? 'animate-pulse' : ''}`} />
                    {isPreviewingPronunciation ? 'Playing...' : 'Preview TTS'}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {(formData.pronunciation_audio_url || audioFile) && <audio controls className="h-10 max-w-[200px]" src={audioFile ? URL.createObjectURL(audioFile) : formData.pronunciation_audio_url} />}
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <input type="file" accept="audio/*" onChange={e => { const file = e.target.files?.[0]; if (file) setAudioFile(file); }} className="hidden" />
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span className="gap-2"><Upload className="h-4 w-4" />{audioFile ? "Change" : formData.pronunciation_audio_url ? "Replace" : "Upload"}</span>
                      </Button>
                    </label>
                    {(audioFile || formData.pronunciation_audio_url) && (
                      <Button type="button" variant="ghost" size="sm" className="ml-2 text-destructive" onClick={() => { setAudioFile(null); updateField("pronunciation_audio_url", ""); }}>Remove</Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Phonetic */}
              <div className="space-y-2 border rounded-lg p-4">
                <Label htmlFor="pronunciation_text">Phonetic Pronunciation</Label>
                <div className="flex gap-2">
                  <Input id="pronunciation_text" value={formData.pronunciation_text} onChange={e => updateField("pronunciation_text", e.target.value)} placeholder="e.g., meh-TOE-pro-lol" className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={generatePronunciation} disabled={generatingPronunciation || !formData.generic_name.trim()} className="shrink-0">
                    {generatingPronunciation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    <span className="ml-1 hidden sm:inline">{generatingPronunciation ? "..." : "Generate"}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Capitalize stressed syllable (e.g., meh-TOE-pro-lol)</p>
              </div>
            </TabsContent>

            {/* Visibility Tab */}
            <TabsContent value="visibility" className="mt-0 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Hide Features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="hide_all" className="text-sm font-medium">Hide All</Label>
                    <Switch 
                      id="hide_all" 
                      checked={Object.values(visibility).every(v => v === true)}
                      onCheckedChange={(checked) => {
                        const allHidden: VisibilitySettings = {
                          hide_dosing: checked,
                          hide_adjustments: checked,
                          hide_safety_info: checked,
                          hide_administration: checked,
                          hide_safe_method: checked,
                          hide_rate_dilution: checked,
                          hide_line_compatibility: checked,
                          hide_monitoring: checked,
                          hide_hold_parameters: checked,
                          hide_required_resources: checked,
                          hide_crushing_info: checked,
                          hide_timing_rules: checked,
                          hide_patient_education: checked,
                          hide_red_flags: checked,
                          hide_expected_effect: checked,
                          hide_documentation_reminders: checked,
                          hide_safety_badges: checked,
                          hide_pause_triggers: checked,
                          hide_nursing_guide: checked,
                          hide_pharmacokinetics: checked,
                          hide_adverse_reactions: checked,
                          hide_drug_interactions: checked,
                          hide_clinical_pearls: checked,
                          hide_video: checked,
                          hide_pronunciation: checked,
                        };
                        setVisibility(allHidden);
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle features to hide them from the user-facing medication view. Hidden features won't be displayed to end users.
                </p>
              </div>

              {/* Clinical Features */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Clinical Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_dosing" className="text-sm font-normal">Dosing Information</Label>
                    <Switch id="hide_dosing" checked={visibility.hide_dosing} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_dosing: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_adjustments" className="text-sm font-normal">Adjustments</Label>
                    <Switch id="hide_adjustments" checked={visibility.hide_adjustments} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_adjustments: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_pharmacokinetics" className="text-sm font-normal">Pharmacokinetics</Label>
                    <Switch id="hide_pharmacokinetics" checked={visibility.hide_pharmacokinetics} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_pharmacokinetics: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_drug_interactions" className="text-sm font-normal">Drug Interactions</Label>
                    <Switch id="hide_drug_interactions" checked={visibility.hide_drug_interactions} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_drug_interactions: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_clinical_pearls" className="text-sm font-normal">Clinical Pearls</Label>
                    <Switch id="hide_clinical_pearls" checked={visibility.hide_clinical_pearls} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_clinical_pearls: v }))} />
                  </div>
                </div>
              </div>

              {/* Safety Features */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Safety Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_safety_info" className="text-sm font-normal">Safety Info</Label>
                    <Switch id="hide_safety_info" checked={visibility.hide_safety_info} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_safety_info: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_red_flags" className="text-sm font-normal">Red Flags</Label>
                    <Switch id="hide_red_flags" checked={visibility.hide_red_flags} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_red_flags: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_adverse_reactions" className="text-sm font-normal">Adverse Reactions</Label>
                    <Switch id="hide_adverse_reactions" checked={visibility.hide_adverse_reactions} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_adverse_reactions: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_safety_badges" className="text-sm font-normal">Safety Badges</Label>
                    <Switch id="hide_safety_badges" checked={visibility.hide_safety_badges} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_safety_badges: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_monitoring" className="text-sm font-normal">Monitoring</Label>
                    <Switch id="hide_monitoring" checked={visibility.hide_monitoring} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_monitoring: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_hold_parameters" className="text-sm font-normal">Hold Parameters</Label>
                    <Switch id="hide_hold_parameters" checked={visibility.hide_hold_parameters} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_hold_parameters: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_pause_triggers" className="text-sm font-normal">Pause Triggers</Label>
                    <Switch id="hide_pause_triggers" checked={visibility.hide_pause_triggers} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_pause_triggers: v }))} />
                  </div>
                </div>
              </div>

              {/* Administration Features */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" /> Administration & Nursing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_administration" className="text-sm font-normal">Administration Info</Label>
                    <Switch id="hide_administration" checked={visibility.hide_administration} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_administration: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_safe_method" className="text-sm font-normal">Safe Method</Label>
                    <Switch id="hide_safe_method" checked={visibility.hide_safe_method} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_safe_method: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_rate_dilution" className="text-sm font-normal">Rate & Dilution</Label>
                    <Switch id="hide_rate_dilution" checked={visibility.hide_rate_dilution} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_rate_dilution: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_line_compatibility" className="text-sm font-normal">Line Compatibility</Label>
                    <Switch id="hide_line_compatibility" checked={visibility.hide_line_compatibility} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_line_compatibility: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_crushing_info" className="text-sm font-normal">Crushing Info</Label>
                    <Switch id="hide_crushing_info" checked={visibility.hide_crushing_info} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_crushing_info: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_timing_rules" className="text-sm font-normal">Timing Rules</Label>
                    <Switch id="hide_timing_rules" checked={visibility.hide_timing_rules} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_timing_rules: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_required_resources" className="text-sm font-normal">Required Resources</Label>
                    <Switch id="hide_required_resources" checked={visibility.hide_required_resources} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_required_resources: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_nursing_guide" className="text-sm font-normal">Nursing Guide</Label>
                    <Switch id="hide_nursing_guide" checked={visibility.hide_nursing_guide} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_nursing_guide: v }))} />
                  </div>
                </div>
              </div>

              {/* Patient & Media Features */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Patient Education & Media
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_patient_education" className="text-sm font-normal">Patient Education</Label>
                    <Switch id="hide_patient_education" checked={visibility.hide_patient_education} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_patient_education: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_expected_effect" className="text-sm font-normal">Expected Effect</Label>
                    <Switch id="hide_expected_effect" checked={visibility.hide_expected_effect} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_expected_effect: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_documentation_reminders" className="text-sm font-normal">Documentation Reminders</Label>
                    <Switch id="hide_documentation_reminders" checked={visibility.hide_documentation_reminders} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_documentation_reminders: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_video" className="text-sm font-normal">Video</Label>
                    <Switch id="hide_video" checked={visibility.hide_video} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_video: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide_pronunciation" className="text-sm font-normal">Pronunciation</Label>
                    <Switch id="hide_pronunciation" checked={visibility.hide_pronunciation} onCheckedChange={v => setVisibility(prev => ({ ...prev, hide_pronunciation: v }))} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Sticky footer */}
        <DialogFooter className="sticky bottom-0 bg-background border-t px-4 py-3 sm:px-6 sm:py-4 flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none">
            {saving ? "Saving..." : medicationId ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// JSON field editor component
function JsonFieldEditor({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (v: string) => {
    onChange(v);
    if (v.trim()) {
      try {
        JSON.parse(v);
        setError(null);
      } catch {
        setError("Invalid JSON");
      }
    } else {
      setError(null);
    }
  };

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            {label}
            {value && <Badge variant="secondary" className="ml-1 text-xs">Set</Badge>}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Textarea value={value} onChange={e => handleChange(e.target.value)} placeholder={placeholder} rows={6} className={`font-mono text-xs ${error ? 'border-destructive' : ''}`} />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </CollapsibleContent>
    </Collapsible>
  );
}
