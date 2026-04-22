import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft, Save, Loader2, FileText, Activity, AlertTriangle,
  Stethoscope, Image, Eye, EyeOff, ChevronDown, Upload, Trash2,
  Volume2, Play, Sparkles, Video, ExternalLink, BookOpen, Settings,
  Droplets, Pill as PillIcon, Syringe, Wind, Cloud, Droplet,
} from "lucide-react";
import type { Json } from "@/integrations/supabase/types";
import {
  validateMedication, canPromoteToStatus, getCompletenessColor,
  type ContentStatus,
} from "@/lib/medicationValidation";
import StringListEditor from "@/components/admin/medication-editor/StringListEditor";
import KeyValueEditor from "@/components/admin/medication-editor/KeyValueEditor";
import InteractionEditor, { type DrugInteraction } from "@/components/admin/medication-editor/InteractionEditor";
import AdverseReactionsEditor, { type AdverseReactions } from "@/components/admin/medication-editor/AdverseReactionsEditor";
import SafetyBadgesEditor, { type SafetyBadge } from "@/components/admin/medication-editor/SafetyBadgesEditor";
import type { FullMedication } from "@/components/admin/MedicationEditDialog";

// ── Visibility ──
interface VisibilitySettings {
  hide_dosing: boolean; hide_adjustments: boolean; hide_safety_info: boolean;
  hide_administration: boolean; hide_safe_method: boolean; hide_rate_dilution: boolean;
  hide_line_compatibility: boolean; hide_monitoring: boolean; hide_hold_parameters: boolean;
  hide_required_resources: boolean; hide_crushing_info: boolean; hide_timing_rules: boolean;
  hide_patient_education: boolean; hide_red_flags: boolean; hide_expected_effect: boolean;
  hide_documentation_reminders: boolean; hide_safety_badges: boolean; hide_pause_triggers: boolean;
  hide_nursing_guide: boolean; hide_pharmacokinetics: boolean; hide_adverse_reactions: boolean;
  hide_drug_interactions: boolean; hide_clinical_pearls: boolean; hide_video: boolean;
  hide_pronunciation: boolean;
}
const defaultVisibility: VisibilitySettings = {
  hide_dosing: false, hide_adjustments: false, hide_safety_info: false,
  hide_administration: false, hide_safe_method: false, hide_rate_dilution: false,
  hide_line_compatibility: false, hide_monitoring: false, hide_hold_parameters: false,
  hide_required_resources: false, hide_crushing_info: false, hide_timing_rules: false,
  hide_patient_education: false, hide_red_flags: false, hide_expected_effect: false,
  hide_documentation_reminders: false, hide_safety_badges: false, hide_pause_triggers: false,
  hide_nursing_guide: false, hide_pharmacokinetics: false, hide_adverse_reactions: false,
  hide_drug_interactions: false, hide_clinical_pearls: false, hide_video: false,
  hide_pronunciation: false,
};

// ── Helpers ──
const jsonToObj = (json: Json | null): Record<string, any> => {
  if (!json || typeof json !== "object" || Array.isArray(json)) return {};
  return json as Record<string, any>;
};
const jsonToArr = (json: Json | null): any[] => {
  if (!json || !Array.isArray(json)) return [];
  return json;
};
const jsonToStrArr = (json: Json | null): string[] => {
  const arr = jsonToArr(json);
  return arr.filter((v): v is string => typeof v === "string");
};

const ROUTE_ICONS: Record<string, React.ElementType> = {
  iv: Droplets, po: PillIcon, oral: PillIcon, im: Syringe,
  subq: Syringe, sq: Syringe, subcutaneous: Syringe,
  topical: Droplet, inhaled: Wind, nebulized: Cloud, nasal: Droplet,
};
const getRouteIcon = (route: string): React.ElementType => ROUTE_ICONS[route.toLowerCase().replace(/\s+/g, "")] || PillIcon;

// ── Sections for sidebar ──
const SECTIONS = [
  { id: "basic", label: "Basic Info", icon: FileText },
  { id: "clinical", label: "Clinical", icon: Activity },
  { id: "safety", label: "Safety", icon: AlertTriangle },
  { id: "nursing", label: "Nursing", icon: Stethoscope },
  { id: "media", label: "Media", icon: Image },
  { id: "visibility", label: "Visibility", icon: Eye },
];

export default function MedicationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const isNew = !id || id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [rawMedication, setRawMedication] = useState<Record<string, unknown> | null>(null);
  const [visibility, setVisibility] = useState<VisibilitySettings>(defaultVisibility);

  // ── Basic fields ──
  const [genericName, setGenericName] = useState("");
  const [brandNames, setBrandNames] = useState("");
  const [drugClass, setDrugClass] = useState("");
  const [route, setRoute] = useState("");
  const [highAlert, setHighAlert] = useState(false);
  const [controlledSubstance, setControlledSubstance] = useState(false);
  const [doubleCheckRequired, setDoubleCheckRequired] = useState(false);
  const [clinicalPearls, setClinicalPearls] = useState<string[]>([]);
  const [ndcCode, setNdcCode] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [strengths, setStrengths] = useState("");
  const [contentStatus, setContentStatus] = useState("draft");
  const [originalStatus, setOriginalStatus] = useState("draft");
  const [syncSource, setSyncSource] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [fdaLink, setFdaLink] = useState("");
  const [fdaSetId, setFdaSetId] = useState("");
  const [fdaLabelUrl, setFdaLabelUrl] = useState("");
  const [fdaLabelRevisionDate, setFdaLabelRevisionDate] = useState("");

  // ── Media ──
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pronunciationAudioUrl, setPronunciationAudioUrl] = useState("");
  const [pronunciationText, setPronunciationText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [generatingPronunciation, setGeneratingPronunciation] = useState(false);
  const [isPreviewingPronunciation, setIsPreviewingPronunciation] = useState(false);
  const [routeImages, setRouteImages] = useState<{ route: string; url: string }[]>([]);
  const [selectedRouteForUpload, setSelectedRouteForUpload] = useState("");
  const [uploadingRouteImage, setUploadingRouteImage] = useState(false);
  const routeImageInputRef = useRef<HTMLInputElement>(null);

  // ── Structured clinical fields ──
  const [dosingInfo, setDosingInfo] = useState<Record<string, string>>({});
  const [adjustments, setAdjustments] = useState<Record<string, string>>({});
  const [pharmacokinetics, setPharmacokinetics] = useState<Record<string, string>>({});
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);

  // ── Safety ──
  const [safetyContraindications, setSafetyContraindications] = useState<string[]>([]);
  const [safetyWarnings, setSafetyWarnings] = useState<string[]>([]);
  const [safetyPrecautions, setSafetyPrecautions] = useState<string[]>([]);
  const [boxedWarning, setBoxedWarning] = useState("");
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [adverseReactions, setAdverseReactions] = useState<AdverseReactions>({ common: [], serious: [] });
  const [safetyBadges, setSafetyBadges] = useState<SafetyBadge[]>([]);
  const [pauseTriggers, setPauseTriggers] = useState<string[]>([]);

  // ── Nursing ──
  const [monitoringVitals, setMonitoringVitals] = useState<string[]>([]);
  const [monitoringLabs, setMonitoringLabs] = useState<string[]>([]);
  const [holdParameters, setHoldParameters] = useState<string[]>([]);
  const [patientEducation, setPatientEducation] = useState<string[]>([]);
  const [crushable, setCrushable] = useState(false);
  const [crushAlternatives, setCrushAlternatives] = useState("");
  const [withFood, setWithFood] = useState(false);
  const [emptyStomach, setEmptyStomach] = useState(false);
  const [timingFrequency, setTimingFrequency] = useState("");
  const [rateDilution, setRateDilution] = useState<Record<string, string>>({});
  const [lineCompatible, setLineCompatible] = useState<string[]>([]);
  const [lineIncompatible, setLineIncompatible] = useState<string[]>([]);
  const [expectedEffect, setExpectedEffect] = useState<Record<string, string>>({});
  const [documentationReminders, setDocumentationReminders] = useState<string[]>([]);
  const [requiredResources, setRequiredResources] = useState<string[]>([]);
  const [safeMethodJson, setSafeMethodJson] = useState("");
  const [administrationJson, setAdministrationJson] = useState("");
  const [nursingGuideJson, setNursingGuideJson] = useState("");

  // ── Scroll refs for section navigation ──
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    basic: useRef<HTMLDivElement>(null),
    clinical: useRef<HTMLDivElement>(null),
    safety: useRef<HTMLDivElement>(null),
    nursing: useRef<HTMLDivElement>(null),
    media: useRef<HTMLDivElement>(null),
    visibility: useRef<HTMLDivElement>(null),
  };

  // ── Build data for validation ──
  const buildMedicationData = () => ({
    generic_name: genericName.trim(),
    brand_names: brandNames ? brandNames.split(",").map(b => b.trim()).filter(Boolean) : null,
    drug_class: drugClass.trim() || null,
    route: route ? route.split(",").map(r => r.trim()).filter(Boolean) : null,
    high_alert: highAlert,
    controlled_substance: controlledSubstance,
    double_check_required: doubleCheckRequired,
    clinical_pearls: clinicalPearls.length > 0 ? clinicalPearls : null,
    ndc_code: ndcCode.trim() || null,
    manufacturer: manufacturer.trim() || null,
    dosage_form: dosageForm.trim() || null,
    strengths: strengths ? strengths.split(",").map(s => s.trim()).filter(Boolean) : null,
    image_url: imageUrl || null,
    video_url: videoUrl.trim() || null,
    pronunciation_audio_url: pronunciationAudioUrl || null,
    pronunciation_text: pronunciationText.trim() || null,
    fda_link: fdaLink.trim() || null,
    fda_set_id: fdaSetId.trim() || null,
    fda_label_url: fdaLabelUrl.trim() || null,
    fda_label_revision_date: fdaLabelRevisionDate.trim() || null,
    content_status: contentStatus || "draft",
    sync_source: syncSource.trim() || null,
    review_notes: reviewNotes.trim() || null,
    dosing_info: Object.values(dosingInfo).some(v => v.trim()) ? dosingInfo as unknown as Json : null,
    adjustments: Object.values(adjustments).some(v => v.trim()) ? adjustments as unknown as Json : null,
    pharmacokinetics: Object.values(pharmacokinetics).some(v => v.trim()) ? pharmacokinetics as unknown as Json : null,
    drug_interactions_info: drugInteractions.length > 0 ? drugInteractions as unknown as Json : null,
    safety_info: (safetyContraindications.length > 0 || safetyWarnings.length > 0 || safetyPrecautions.length > 0 || boxedWarning.trim())
      ? { contraindications: safetyContraindications, warnings: safetyWarnings, precautions: safetyPrecautions, boxed_warning: boxedWarning.trim() || undefined } as unknown as Json
      : null,
    red_flags: redFlags.length > 0 ? redFlags as unknown as Json : null,
    adverse_reactions: (adverseReactions.common.length > 0 || adverseReactions.serious.length > 0) ? adverseReactions as unknown as Json : null,
    safety_badges: safetyBadges.length > 0 ? safetyBadges as unknown as Json : null,
    pause_triggers: pauseTriggers.length > 0 ? pauseTriggers as unknown as Json : null,
    monitoring: (monitoringVitals.length > 0 || monitoringLabs.length > 0) ? { vitals: monitoringVitals, labs: monitoringLabs } as unknown as Json : null,
    hold_parameters: holdParameters.length > 0 ? holdParameters as unknown as Json : null,
    patient_education: patientEducation.length > 0 ? patientEducation as unknown as Json : null,
    crushing_info: (crushable || crushAlternatives.trim()) ? { crushable, alternatives: crushAlternatives.trim() || undefined } as unknown as Json : null,
    timing_rules: (withFood || emptyStomach || timingFrequency.trim()) ? { with_food: withFood, empty_stomach: emptyStomach, frequency: timingFrequency.trim() || undefined } as unknown as Json : null,
    rate_dilution: Object.values(rateDilution).some(v => v.trim()) ? rateDilution as unknown as Json : null,
    line_compatibility: (lineCompatible.length > 0 || lineIncompatible.length > 0) ? { compatible: lineCompatible, incompatible: lineIncompatible } as unknown as Json : null,
    expected_effect: Object.values(expectedEffect).some(v => v.trim()) ? expectedEffect as unknown as Json : null,
    documentation_reminders: documentationReminders.length > 0 ? documentationReminders as unknown as Json : null,
    required_resources: requiredResources.length > 0 ? requiredResources as unknown as Json : null,
    safe_method: safeMethodJson.trim() ? safeJsonParse(safeMethodJson) : null,
    administration_info: administrationJson.trim() ? safeJsonParse(administrationJson) : null,
    nursing_guide: nursingGuideJson.trim() ? safeJsonParse(nursingGuideJson) : null,
    visibility_settings: visibility as unknown as Json,
  });

  const safeJsonParse = (str: string): Json | null => {
    try { return JSON.parse(str); } catch { return null; }
  };

  const validationResult = useMemo(() => {
    if (rawMedication) {
      return validateMedication(rawMedication, (contentStatus as ContentStatus) || "draft");
    }
    return validateMedication(buildMedicationData() as Record<string, unknown>, (contentStatus as ContentStatus) || "draft");
  }, [rawMedication, contentStatus, genericName, dosingInfo, safetyContraindications, adverseReactions, holdParameters, monitoringVitals, patientEducation]);

  // ── Load medication ──
  useEffect(() => {
    if (!isNew && id) fetchMedication(id);
  }, [id]);

  const fetchMedication = async (medId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("medications").select("*").eq("id", medId).single();
      if (error) throw error;
      setRawMedication(data as Record<string, unknown>);
      const med = data as FullMedication;
      
      // Basic
      setGenericName(med.generic_name || "");
      setBrandNames(med.brand_names?.join(", ") || "");
      setDrugClass(med.drug_class || "");
      setRoute(med.route?.join(", ") || "");
      setHighAlert(med.high_alert || false);
      setControlledSubstance(med.controlled_substance || false);
      setDoubleCheckRequired(med.double_check_required || false);
      setClinicalPearls(med.clinical_pearls || []);
      setNdcCode(med.ndc_code || "");
      setManufacturer(med.manufacturer || "");
      setDosageForm(med.dosage_form || "");
      setStrengths(med.strengths?.join(", ") || "");
      setContentStatus(med.content_status || "draft");
      setOriginalStatus(med.content_status || "draft");
      setSyncSource(med.sync_source || "");
      setReviewNotes(med.review_notes || "");
      setFdaLink(med.fda_link || "");
      setFdaSetId(med.fda_set_id || "");
      setFdaLabelUrl(med.fda_label_url || "");
      setFdaLabelRevisionDate(med.fda_label_revision_date || "");

      // Media
      setImageUrl(med.image_url || "");
      setVideoUrl(med.video_url || "");
      setPronunciationAudioUrl(med.pronunciation_audio_url || "");
      setPronunciationText(med.pronunciation_text || "");

      // Clinical - structured
      const di = jsonToObj(med.dosing_info);
      setDosingInfo({ standard: di.standard || di.adult || "", pediatric: di.pediatric || "", max_dose: di.max_dose || di.max || "", geriatric: di.geriatric || "", notes: di.notes || "" });
      const adj = jsonToObj(med.adjustments);
      setAdjustments({ renal: typeof adj.renal === "string" ? adj.renal : JSON.stringify(adj.renal || ""), hepatic: typeof adj.hepatic === "string" ? adj.hepatic : JSON.stringify(adj.hepatic || ""), notes: adj.notes || "" });
      const pk = jsonToObj(med.pharmacokinetics);
      setPharmacokinetics({ half_life: pk.half_life || pk.halfLife || "", onset: pk.onset || "", duration: pk.duration || "", metabolism: pk.metabolism || "", excretion: pk.excretion || pk.elimination || "", absorption: pk.absorption || "", distribution: pk.distribution || "" });
      
      // Drug interactions
      const interactions = jsonToArr(med.drug_interactions_info);
      setDrugInteractions(interactions.map((ix: any) => ({ drug: ix.drug || "", severity: ix.severity || "moderate", effect: ix.effect || "", recommendation: ix.recommendation || "" })));

      // Safety
      const si = jsonToObj(med.safety_info);
      setSafetyContraindications(Array.isArray(si.contraindications) ? si.contraindications.filter((v: any) => typeof v === "string") : []);
      setSafetyWarnings(Array.isArray(si.warnings) ? si.warnings.filter((v: any) => typeof v === "string") : []);
      setSafetyPrecautions(Array.isArray(si.precautions) ? si.precautions.filter((v: any) => typeof v === "string") : []);
      setBoxedWarning(typeof si.boxed_warning === "string" ? si.boxed_warning : "");
      setRedFlags(jsonToStrArr(med.red_flags));
      const ar = jsonToObj(med.adverse_reactions);
      setAdverseReactions({
        common: Array.isArray(ar.common) ? ar.common.filter((v: any) => typeof v === "string") : [],
        serious: Array.isArray(ar.serious) ? ar.serious.filter((v: any) => typeof v === "string") : [],
      });
      setSafetyBadges(jsonToArr(med.safety_badges).map((b: any) => ({ type: b.type || "warning", label: b.label || "" })));
      setPauseTriggers(jsonToStrArr(med.pause_triggers));

      // Nursing
      const mon = jsonToObj(med.monitoring);
      setMonitoringVitals(Array.isArray(mon.vitals) ? mon.vitals.filter((v: any) => typeof v === "string") : []);
      setMonitoringLabs(Array.isArray(mon.labs) ? mon.labs.filter((v: any) => typeof v === "string") : []);
      setHoldParameters(jsonToStrArr(med.hold_parameters));
      setPatientEducation(jsonToStrArr(med.patient_education));
      const ci = jsonToObj(med.crushing_info);
      setCrushable(!!ci.crushable);
      setCrushAlternatives(ci.alternatives || "");
      const tr = jsonToObj(med.timing_rules);
      setWithFood(!!tr.with_food);
      setEmptyStomach(!!tr.empty_stomach);
      setTimingFrequency(tr.frequency || "");
      const rd = jsonToObj(med.rate_dilution);
      setRateDilution({ standard_dilution: rd.standard_dilution || rd.standard || "", max_rate: rd.max_rate || "", infusion_time: rd.infusion_time || "", notes: rd.notes || "" });
      const lc = jsonToObj(med.line_compatibility);
      setLineCompatible(Array.isArray(lc.compatible) ? lc.compatible.filter((v: any) => typeof v === "string") : []);
      setLineIncompatible(Array.isArray(lc.incompatible) ? lc.incompatible.filter((v: any) => typeof v === "string") : []);
      const ee = jsonToObj(med.expected_effect);
      setExpectedEffect({ therapeutic: ee.therapeutic || "", onset_time: ee.onset_time || "", duration: ee.duration || "" });
      setDocumentationReminders(jsonToStrArr(med.documentation_reminders));
      setRequiredResources(jsonToStrArr(med.required_resources));

      // Keep complex JSON fields as raw JSON for now
      setSafeMethodJson(med.safe_method ? JSON.stringify(med.safe_method, null, 2) : "");
      setAdministrationJson(med.administration_info ? JSON.stringify(med.administration_info, null, 2) : "");
      setNursingGuideJson(med.nursing_guide ? JSON.stringify(med.nursing_guide, null, 2) : "");

      // Visibility
      if (med.visibility_settings && typeof med.visibility_settings === "object" && !Array.isArray(med.visibility_settings)) {
        setVisibility({ ...defaultVisibility, ...(med.visibility_settings as unknown as Partial<VisibilitySettings>) });
      }

      // Route images from nursing guide
      if (med.nursing_guide) {
        const guide = med.nursing_guide as Record<string, unknown>;
        const imgs: { route: string; url: string }[] = [];
        for (const [key, value] of Object.entries(guide)) {
          const rd = value as Record<string, unknown> | undefined;
          if (rd?.image_url && typeof rd.image_url === "string") imgs.push({ route: key, url: rd.image_url });
        }
        setRouteImages(imgs);
      }
    } catch (error) {
      console.error("Error fetching medication:", error);
      toast({ title: "Error", description: "Failed to load medication", variant: "destructive" });
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  // ── Save ──
  const handleSave = async () => {
    if (!genericName.trim()) {
      toast({ title: "Validation Error", description: "Generic name is required", variant: "destructive" });
      return;
    }

    const medicationData = buildMedicationData();

    // Check promotion to approved
    if (contentStatus === "approved") {
      const isNewPromotion = originalStatus !== "approved";
      const promotionCheck = canPromoteToStatus(medicationData as Record<string, unknown>, "approved");
      if (!promotionCheck.canPromote) {
        if (isNewPromotion) {
          toast({ title: "Cannot Approve", description: `Missing: ${promotionCheck.blockers.slice(0, 3).join(", ")}`, variant: "destructive" });
          return;
        } else {
          toast({ title: "Warning", description: `Saved with incomplete fields: ${promotionCheck.blockers.slice(0, 3).join(", ")}` });
        }
      }
    }

    setSaving(true);
    try {
      let audioUrl = pronunciationAudioUrl;
      if (audioFile) {
        setUploadingAudio(true);
        const ext = audioFile.name.split(".").pop() || "mp3";
        const safeName = genericName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
        const fileName = `${Date.now()}-${safeName}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("medication-assets").upload(`audio/${fileName}`, audioFile, { upsert: true, contentType: audioFile.type || "audio/*" });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("medication-assets").getPublicUrl(`audio/${fileName}`);
        audioUrl = urlData.publicUrl;
        setUploadingAudio(false);
      }

      const saveData = { ...medicationData, pronunciation_audio_url: audioUrl || null };

      if (!isNew && id) {
        const { error } = await supabase.from("medications").update(saveData).eq("id", id);
        if (error) throw error;
        logActivity({ actionType: "medication_updated", entityType: "medication", entityId: id, details: { generic_name: genericName } });
        setRawMedication(prev => prev ? { ...prev, ...saveData } : saveData as Record<string, unknown>);
        toast({ title: "Success", description: "Medication updated successfully" });
      } else {
        const { data: newMed, error } = await supabase.from("medications").insert(saveData).select().single();
        if (error) throw error;
        logActivity({ actionType: "medication_created", entityType: "medication", entityId: newMed?.id, details: { generic_name: genericName } });
        toast({ title: "Success", description: "Medication added successfully" });
        navigate(`/admin/medication/${newMed.id}`, { replace: true });
      }
    } catch (error: any) {
      console.error("Error saving medication:", error);
      toast({ title: "Error", description: error?.message || "Failed to save medication", variant: "destructive" });
    } finally {
      setSaving(false);
      setUploadingImage(false);
      setUploadingAudio(false);
    }
  };

  // ── Image upload ──
  const handleMainImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isNew) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Invalid file", variant: "destructive" }); return; }
    setUploadingImage(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated");
      const form = new FormData();
      form.append("file", file);
      form.append("medicationId", id!);
      form.append("medicationName", genericName);
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-upload-medication-image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || "Upload failed");
      setImageUrl(payload.publicUrl);
      toast({ title: "Image uploaded" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error?.message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  // ── Route image upload ──
  const handleRouteImageUpload = async (file: File) => {
    if (!file || isNew || !selectedRouteForUpload) return;
    setUploadingRouteImage(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated");
      const form = new FormData();
      form.append("file", file);
      form.append("medicationId", id!);
      form.append("medicationName", genericName);
      form.append("route", selectedRouteForUpload);
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-upload-medication-image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || "Upload failed");
      setRouteImages(prev => [...prev.filter(ri => ri.route.toLowerCase() !== selectedRouteForUpload.toLowerCase()), { route: selectedRouteForUpload, url: payload.publicUrl }]);
      toast({ title: "Route image uploaded" });
      setSelectedRouteForUpload("");
    } catch (error: any) {
      toast({ title: "Upload failed", description: error?.message, variant: "destructive" });
    } finally {
      setUploadingRouteImage(false);
    }
  };

  const generatePronunciation = async () => {
    if (!genericName.trim()) return;
    setGeneratingPronunciation(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pronunciation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ medicationName: genericName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPronunciationText(data.pronunciation);
      toast({ title: "Pronunciation generated", description: data.pronunciation });
    } catch (error: any) {
      toast({ title: "Failed", description: error?.message, variant: "destructive" });
    } finally {
      setGeneratingPronunciation(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background border-b px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold truncate">
                {isNew ? "New Medication" : genericName || "Edit Medication"}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Progress value={validationResult.completenessScore} className="h-1.5 w-24" />
                <span className={`text-xs font-medium ${getCompletenessColor(validationResult.completenessScore)}`}>
                  {validationResult.completenessScore}%
                </span>
                <Badge variant={contentStatus === "approved" ? "default" : "secondary"} className="capitalize text-xs">
                  {contentStatus}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin")} className="hidden sm:flex">Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <nav className="hidden md:flex flex-col w-48 shrink-0 border-r py-4 px-2 sticky top-[65px] h-[calc(100vh-65px)]">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors ${activeSection === s.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          {/* BASIC */}
          <section ref={sectionRefs.basic} id="section-basic">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Generic Name *</Label>
                <Input value={genericName} onChange={(e) => setGenericName(e.target.value)} placeholder="e.g., Metoprolol" />
              </div>
              <div className="space-y-2">
                <Label>Brand Names (comma-separated)</Label>
                <Input value={brandNames} onChange={(e) => setBrandNames(e.target.value)} placeholder="e.g., Lopressor, Toprol-XL" />
              </div>
              <div className="space-y-2">
                <Label>Drug Class</Label>
                <Input value={drugClass} onChange={(e) => setDrugClass(e.target.value)} placeholder="e.g., Beta Blocker" />
              </div>
              <div className="space-y-2">
                <Label>Routes (comma-separated)</Label>
                <Input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="e.g., IV, PO" />
              </div>
              <div className="space-y-2">
                <Label>Dosage Form</Label>
                <Input value={dosageForm} onChange={(e) => setDosageForm(e.target.value)} placeholder="e.g., Tablet, Injectable" />
              </div>
              <div className="space-y-2">
                <Label>Strengths (comma-separated)</Label>
                <Input value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="e.g., 25mg, 50mg" />
              </div>
              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>NDC Code</Label>
                <Input value={ndcCode} onChange={(e) => setNdcCode(e.target.value)} />
                <p className="text-xs text-muted-foreground italic">NDC codes vary by manufacturer and package size.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Checkbox checked={highAlert} onCheckedChange={(c) => setHighAlert(c === true)} />
                <Label className="font-normal">High Alert</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={doubleCheckRequired} onCheckedChange={(c) => setDoubleCheckRequired(c === true)} />
                <Label className="font-normal">Double Check Required</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={controlledSubstance} onCheckedChange={(c) => setControlledSubstance(c === true)} />
                <Label className="font-normal">Controlled Substance</Label>
              </div>
            </div>
            <div className="pt-4">
              <StringListEditor label="Clinical Pearls" items={clinicalPearls} onChange={setClinicalPearls} placeholder="Add a clinical pearl..." />
            </div>

            {/* FDA & Status collapsed */}
            <Collapsible className="mt-4">
              <CollapsibleTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                  <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> FDA Information</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">FDA Link</Label><Input value={fdaLink} onChange={(e) => setFdaLink(e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">FDA Set ID</Label><Input value={fdaSetId} onChange={(e) => setFdaSetId(e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">FDA Label URL</Label><Input value={fdaLabelUrl} onChange={(e) => setFdaLabelUrl(e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Label Revision Date</Label><Input value={fdaLabelRevisionDate} onChange={(e) => setFdaLabelRevisionDate(e.target.value)} /></div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="mt-3">
              <CollapsibleTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                  <span className="flex items-center gap-2"><Settings className="h-4 w-4" /> Status & Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Content Status</Label>
                    <Select value={contentStatus} onValueChange={setContentStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs">Sync Source</Label><Input value={syncSource} onChange={(e) => setSyncSource(e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Review Notes</Label><Textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={3} /></div>
              </CollapsibleContent>
            </Collapsible>
          </section>

          {/* CLINICAL */}
          <section ref={sectionRefs.clinical} id="section-clinical" className="border-t pt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5" /> Clinical Data
            </h2>
            <div className="space-y-6">
              <KeyValueEditor
                label="Dosing Information"
                fields={[
                  { key: "standard", label: "Standard / Adult Dose", placeholder: "e.g., 25-100mg PO BID" },
                  { key: "pediatric", label: "Pediatric Dose", placeholder: "e.g., 1-2 mg/kg/day" },
                  { key: "max_dose", label: "Maximum Dose", placeholder: "e.g., 400mg/day" },
                  { key: "geriatric", label: "Geriatric Dose", placeholder: "" },
                  { key: "notes", label: "Notes", multiline: true, placeholder: "Additional dosing notes..." },
                ]}
                values={dosingInfo}
                onChange={setDosingInfo}
              />
              <KeyValueEditor
                label="Adjustments (Renal/Hepatic)"
                fields={[
                  { key: "renal", label: "Renal Adjustment", multiline: true, placeholder: "CrCl < 30: reduce dose by 50%" },
                  { key: "hepatic", label: "Hepatic Adjustment", multiline: true, placeholder: "Mild: no adjustment" },
                  { key: "notes", label: "Notes", placeholder: "" },
                ]}
                values={adjustments}
                onChange={setAdjustments}
              />
              <KeyValueEditor
                label="Pharmacokinetics"
                fields={[
                  { key: "absorption", label: "Absorption", placeholder: "" },
                  { key: "distribution", label: "Distribution", placeholder: "" },
                  { key: "metabolism", label: "Metabolism", placeholder: "" },
                  { key: "excretion", label: "Excretion / Elimination", placeholder: "" },
                  { key: "half_life", label: "Half-Life", placeholder: "e.g., 3-7 hours" },
                  { key: "onset", label: "Onset", placeholder: "e.g., 1-2 hours (PO)" },
                  { key: "duration", label: "Duration", placeholder: "" },
                ]}
                values={pharmacokinetics}
                onChange={setPharmacokinetics}
              />
              <InteractionEditor interactions={drugInteractions} onChange={setDrugInteractions} />
            </div>
          </section>

          {/* SAFETY */}
          <section ref={sectionRefs.safety} id="section-safety" className="border-t pt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5" /> Safety
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Boxed Warning</Label>
                <Textarea value={boxedWarning} onChange={(e) => setBoxedWarning(e.target.value)} placeholder="FDA Black Box Warning text..." rows={3} className="border-destructive/50" />
              </div>
              <StringListEditor label="Contraindications" items={safetyContraindications} onChange={setSafetyContraindications} placeholder="e.g., Hypersensitivity to drug" />
              <StringListEditor label="Warnings" items={safetyWarnings} onChange={setSafetyWarnings} placeholder="e.g., May cause bradycardia" />
              <StringListEditor label="Precautions" items={safetyPrecautions} onChange={setSafetyPrecautions} placeholder="e.g., Use with caution in diabetes" />
              <StringListEditor label="Red Flags" items={redFlags} onChange={setRedFlags} placeholder="e.g., Stop if HR < 50" />
              <AdverseReactionsEditor reactions={adverseReactions} onChange={setAdverseReactions} />
              <SafetyBadgesEditor badges={safetyBadges} onChange={setSafetyBadges} />
              <StringListEditor label="Pause Triggers" items={pauseTriggers} onChange={setPauseTriggers} placeholder="e.g., If SBP < 90" />
            </div>
          </section>

          {/* NURSING */}
          <section ref={sectionRefs.nursing} id="section-nursing" className="border-t pt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5" /> Nursing
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StringListEditor label="Vitals to Monitor" items={monitoringVitals} onChange={setMonitoringVitals} placeholder="e.g., Heart rate" />
                <StringListEditor label="Labs to Monitor" items={monitoringLabs} onChange={setMonitoringLabs} placeholder="e.g., Potassium" />
              </div>
              <StringListEditor label="Hold Parameters" items={holdParameters} onChange={setHoldParameters} placeholder="e.g., Hold if HR < 60" />
              <StringListEditor label="Patient Education" items={patientEducation} onChange={setPatientEducation} placeholder="e.g., Take with food" />

              {/* Crushing */}
              <Card>
                <CardHeader className="py-3"><CardTitle className="text-sm">Crushing Info</CardTitle></CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-2">
                    <Switch checked={crushable} onCheckedChange={setCrushable} />
                    <Label className="font-normal text-sm">Crushable</Label>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Alternatives if not crushable</Label>
                    <Input value={crushAlternatives} onChange={(e) => setCrushAlternatives(e.target.value)} placeholder="e.g., Liquid formulation available" className="text-sm" />
                  </div>
                </CardContent>
              </Card>

              {/* Timing */}
              <Card>
                <CardHeader className="py-3"><CardTitle className="text-sm">Timing Rules</CardTitle></CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2"><Switch checked={withFood} onCheckedChange={setWithFood} /><Label className="font-normal text-sm">With Food</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={emptyStomach} onCheckedChange={setEmptyStomach} /><Label className="font-normal text-sm">Empty Stomach</Label></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Frequency</Label>
                    <Input value={timingFrequency} onChange={(e) => setTimingFrequency(e.target.value)} placeholder="e.g., Every 6 hours" className="text-sm" />
                  </div>
                </CardContent>
              </Card>

              <KeyValueEditor
                label="Rate & Dilution"
                fields={[
                  { key: "standard_dilution", label: "Standard Dilution", placeholder: "e.g., 5mg/100mL NS" },
                  { key: "max_rate", label: "Max Rate", placeholder: "e.g., 5mg/min" },
                  { key: "infusion_time", label: "Infusion Time", placeholder: "e.g., 30-60 min" },
                  { key: "notes", label: "Notes", multiline: true, placeholder: "" },
                ]}
                values={rateDilution}
                onChange={setRateDilution}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StringListEditor label="Line Compatible" items={lineCompatible} onChange={setLineCompatible} placeholder="e.g., Normal Saline" />
                <StringListEditor label="Line Incompatible" items={lineIncompatible} onChange={setLineIncompatible} placeholder="e.g., Sodium Bicarbonate" />
              </div>

              <KeyValueEditor
                label="Expected Effect"
                fields={[
                  { key: "therapeutic", label: "Therapeutic Effect", multiline: true, placeholder: "e.g., Decreased heart rate and blood pressure" },
                  { key: "onset_time", label: "Onset Time", placeholder: "e.g., 1-2 hours" },
                  { key: "duration", label: "Duration", placeholder: "e.g., 6-12 hours" },
                ]}
                values={expectedEffect}
                onChange={setExpectedEffect}
              />

              <StringListEditor label="Documentation Reminders" items={documentationReminders} onChange={setDocumentationReminders} placeholder="e.g., Document HR before and after" />
              <StringListEditor label="Required Resources" items={requiredResources} onChange={setRequiredResources} placeholder="e.g., Cardiac monitor" />

              {/* Complex JSON fields kept as advanced editors */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2">Administration Info (JSON)</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Textarea value={administrationJson} onChange={(e) => setAdministrationJson(e.target.value)} rows={8} className="font-mono text-xs" placeholder='{"iv": {...}, "oral": {...}}' />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2">Safe Method / 5 Rights (JSON)</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Textarea value={safeMethodJson} onChange={(e) => setSafeMethodJson(e.target.value)} rows={6} className="font-mono text-xs" />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2">Full Nursing Guide (JSON)</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Textarea value={nursingGuideJson} onChange={(e) => setNursingGuideJson(e.target.value)} rows={10} className="font-mono text-xs" placeholder='{"IV": {...}, "Oral": {...}}' />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </section>

          {/* MEDIA */}
          <section ref={sectionRefs.media} id="section-media" className="border-t pt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Image className="h-5 w-5" /> Media
            </h2>
            <div className="space-y-4">
              {/* Main Image */}
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <Label className="flex items-center gap-2"><Image className="h-4 w-4" />Main Image</Label>
                  <div className="flex items-center gap-3">
                    {imageUrl && <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted"><img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /></div>}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleMainImageSelect} className="hidden" disabled={uploadingImage || isNew} />
                        <Button type="button" variant="outline" size="sm" asChild disabled={uploadingImage || isNew}>
                          <span className="gap-2">{uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{uploadingImage ? "Uploading..." : imageUrl ? "Replace" : "Upload"}</span>
                        </Button>
                      </label>
                      {imageUrl && <Button type="button" variant="ghost" size="sm" className="ml-2 text-destructive" onClick={() => setImageUrl("")}>Remove</Button>}
                    </div>
                  </div>
                  {isNew && <p className="text-xs text-muted-foreground">Save medication first to upload image</p>}
                </CardContent>
              </Card>

              {/* Video */}
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <Label className="flex items-center gap-2"><Video className="h-4 w-4" />Video URL</Label>
                  <div className="flex items-center gap-2">
                    <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." className="flex-1" />
                    {videoUrl && <Button type="button" variant="outline" size="sm" asChild><a href={videoUrl} target="_blank" rel="noopener noreferrer" className="gap-2"><ExternalLink className="h-4 w-4" />Preview</a></Button>}
                  </div>
                </CardContent>
              </Card>

              {/* Route Images */}
              {!isNew && route && (
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <Label className="flex items-center gap-2"><Image className="h-4 w-4" />Route-Specific Images</Label>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs">Select Route</Label>
                        <Select value={selectedRouteForUpload} onValueChange={setSelectedRouteForUpload}>
                          <SelectTrigger><SelectValue placeholder="Choose route..." /></SelectTrigger>
                          <SelectContent>
                            {route.split(",").map(r => r.trim()).filter(Boolean).map(r => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <input ref={routeImageInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleRouteImageUpload(f); e.target.value = ""; }} className="hidden" />
                      <Button type="button" variant="outline" size="sm" onClick={() => routeImageInputRef.current?.click()} disabled={!selectedRouteForUpload || uploadingRouteImage}>
                        {uploadingRouteImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        <span className="ml-1">Upload</span>
                      </Button>
                    </div>
                    {routeImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                        {routeImages.map(({ route: r, url }) => (
                          <div key={r} className="relative group rounded-lg border overflow-hidden bg-muted">
                            <img src={url} alt={`${r} route`} className="w-full h-20 object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <span className="text-xs text-white font-medium">{r}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Audio */}
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <Label className="flex items-center gap-2"><Volume2 className="h-4 w-4" />Pronunciation Audio</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => {
                      if (!genericName.trim() || !("speechSynthesis" in window)) return;
                      setIsPreviewingPronunciation(true);
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(genericName);
                      u.rate = 0.8;
                      u.onend = () => setIsPreviewingPronunciation(false);
                      u.onerror = () => setIsPreviewingPronunciation(false);
                      window.speechSynthesis.speak(u);
                    }} disabled={isPreviewingPronunciation || !genericName.trim()} className="gap-2">
                      <Play className={`h-4 w-4 ${isPreviewingPronunciation ? "animate-pulse" : ""}`} />
                      {isPreviewingPronunciation ? "Playing..." : "Preview TTS"}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    {(pronunciationAudioUrl || audioFile) && <audio controls className="h-10 max-w-[200px]" src={audioFile ? URL.createObjectURL(audioFile) : pronunciationAudioUrl} />}
                    <label className="cursor-pointer">
                      <input type="file" accept="audio/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setAudioFile(f); }} className="hidden" />
                      <Button type="button" variant="outline" size="sm" asChild><span className="gap-2"><Upload className="h-4 w-4" />{audioFile ? "Change" : pronunciationAudioUrl ? "Replace" : "Upload"}</span></Button>
                    </label>
                    {(audioFile || pronunciationAudioUrl) && <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => { setAudioFile(null); setPronunciationAudioUrl(""); }}>Remove</Button>}
                  </div>
                </CardContent>
              </Card>

              {/* Phonetic */}
              <Card>
                <CardContent className="pt-4 space-y-2">
                  <Label>Phonetic Pronunciation</Label>
                  <div className="flex gap-2">
                    <Input value={pronunciationText} onChange={(e) => setPronunciationText(e.target.value)} placeholder="e.g., meh-TOE-pro-lol" className="flex-1" />
                    <Button type="button" variant="outline" size="sm" onClick={generatePronunciation} disabled={generatingPronunciation || !genericName.trim()} className="shrink-0">
                      {generatingPronunciation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      <span className="ml-1 hidden sm:inline">{generatingPronunciation ? "..." : "Generate"}</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Capitalize stressed syllable</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* VISIBILITY */}
          <section ref={sectionRefs.visibility} id="section-visibility" className="border-t pt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5" /> Visibility Settings
            </h2>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Toggle Feature Visibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Hide All</Label>
                  <Switch
                    checked={Object.values(visibility).every(v => v === true)}
                    onCheckedChange={(checked) => {
                      const all: VisibilitySettings = Object.fromEntries(
                        Object.keys(defaultVisibility).map(k => [k, checked])
                      ) as unknown as VisibilitySettings;
                      setVisibility(all);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(visibility).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <Label className="text-sm font-normal capitalize">{key.replace("hide_", "").replace(/_/g, " ")}</Label>
                    <Switch checked={value} onCheckedChange={(v) => setVisibility(prev => ({ ...prev, [key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
