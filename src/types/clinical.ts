// Clinical types matching database enums
export type ClinicalRole = 
  | 'nursing_student' 
  | 'nurse' 
  | 'advanced_nurse' 
  | 'medical_student' 
  | 'resident' 
  | 'attending' 
  | 'app';

export type ClinicalSpecialty = 
  // Adult & Medical Specialties
  | 'medical_surgical'
  | 'general_internal_medicine'
  | 'neuro'
  | 'cardiac'
  | 'pulmonology'
  | 'gi'
  | 'nephrology'
  | 'endocrinology'
  | 'rheumatology'
  | 'id'
  | 'hematology'
  | 'oncology'
  | 'palliative_care'
  | 'pain_management'
  | 'geriatrics'
  // Critical & Acute Care
  | 'icu'
  | 'cardiothoracic_icu'
  | 'neuro_icu'
  | 'surgical_icu'
  | 'medical_icu'
  | 'trauma'
  | 'em'
  | 'rapid_response'
  | 'burn_unit'
  // Women's Health & Reproductive
  | 'ob'
  | 'labor_delivery'
  | 'postpartum'
  | 'high_risk_ob'
  | 'reproductive_health'
  | 'fertility'
  | 'gyn_oncology'
  // Pediatrics & Neonatal
  | 'pediatrics'
  | 'picu'
  | 'pediatric_em'
  | 'nicu'
  | 'newborn_nursery'
  | 'pediatric_oncology'
  | 'pediatric_cardiology'
  // Surgical & Procedural
  | 'perioperative'
  | 'operating_room'
  | 'pre_op'
  | 'pacu'
  | 'ambulatory_surgery'
  | 'endoscopy'
  | 'interventional_radiology'
  | 'cardiac_cath_lab'
  // Behavioral & Mental Health
  | 'psychiatric'
  | 'substance_use'
  | 'behavioral_health'
  | 'crisis_intervention'
  | 'forensic'
  // Community & Population Health
  | 'public_health'
  | 'community_health'
  | 'school_nursing'
  | 'occupational_health'
  | 'correctional'
  | 'home_health'
  | 'hospice'
  // Rehabilitation & Chronic Care
  | 'rehabilitation'
  | 'stroke_rehab'
  | 'spinal_cord_injury'
  | 'brain_injury'
  | 'physical_medicine'
  | 'long_term_care'
  | 'skilled_nursing'
  // Specialty & Support Services
  | 'dialysis'
  | 'infusion'
  | 'wound_ostomy'
  | 'diabetes_education'
  | 'lactation'
  | 'case_management'
  | 'care_coordination'
  // Diagnostic & Ancillary
  | 'radiology'
  | 'nuclear_medicine'
  | 'cardiac_diagnostics'
  | 'sleep_medicine'
  | 'pulmonary_function'
  // Leadership, Education & Non Bedside
  | 'nurse_educator'
  | 'clinical_nurse_specialist'
  | 'nurse_manager'
  | 'nurse_executive'
  | 'quality_improvement'
  | 'patient_safety'
  | 'risk_management'
  | 'research'
  | 'informatics'
  // General fallback
  | 'general'
  | 'respiratory';

export type PracticeSetting = 
  // Acute Care Hospital Settings
  | 'emergency_department'
  | 'trauma_center'
  | 'observation_unit'
  | 'critical_care_icu'
  | 'medical_icu'
  | 'surgical_icu'
  | 'neuro_icu'
  | 'cardiac_icu'
  | 'cardiothoracic_icu'
  | 'coronary_care_unit'
  | 'step_down_unit'
  | 'progressive_care_unit'
  | 'medical_surgical_unit'
  | 'telemetry_unit'
  | 'stroke_unit'
  | 'burn_unit'
  | 'isolation_unit'
  | 'negative_pressure_unit'
  | 'overflow_surge_unit'
  // Surgical & Procedural Settings
  | 'operating_room'
  | 'hybrid_or'
  | 'preoperative_unit'
  | 'post_anesthesia_care_unit'
  | 'same_day_surgery'
  | 'ambulatory_surgery_center'
  | 'endoscopy_suite'
  | 'cardiac_cath_lab'
  | 'electrophysiology_lab'
  | 'interventional_radiology'
  | 'interventional_neurology_suite'
  | 'pain_procedure_suite'
  // Women's, Maternal & Reproductive Settings
  | 'labor_and_delivery'
  | 'postpartum_mother_baby'
  | 'high_risk_obstetrics_unit'
  | 'antepartum_unit'
  | 'ob_triage'
  | 'neonatal_icu'
  | 'newborn_nursery'
  | 'lactation_services'
  | 'fertility_clinic'
  | 'gynecologic_oncology_unit'
  // Pediatric & Adolescent Settings
  | 'pediatric_unit'
  | 'pediatric_icu'
  | 'pediatric_emergency_department'
  | 'pediatric_step_down'
  | 'pediatric_oncology_unit'
  | 'pediatric_specialty_clinic'
  | 'school_based_health_center'
  // Specialty Inpatient Units
  | 'oncology_unit'
  | 'hematology_unit'
  | 'bone_marrow_transplant_unit'
  | 'transplant_unit'
  | 'dialysis_unit'
  | 'renal_unit'
  | 'pulmonary_unit'
  | 'infectious_disease_unit'
  | 'immunocompromised_unit'
  | 'hiv_care_unit'
  // Outpatient & Ambulatory Care
  | 'primary_care_clinic'
  | 'specialty_clinic'
  | 'urgent_care_center'
  | 'ambulatory_care_center'
  | 'infusion_center'
  | 'dialysis_center'
  | 'oncology_clinic'
  | 'cardiology_clinic'
  | 'neurology_clinic'
  | 'gi_clinic'
  | 'endocrinology_clinic'
  | 'rheumatology_clinic'
  | 'pain_management_clinic'
  | 'wound_care_clinic'
  | 'anticoagulation_clinic'
  // Behavioral, Mental Health & Social Care
  | 'inpatient_psychiatric_unit'
  | 'behavioral_health_unit'
  | 'substance_use_treatment_center'
  | 'detox_unit'
  | 'crisis_stabilization_unit'
  | 'partial_hospitalization_program'
  | 'intensive_outpatient_program'
  | 'outpatient_mental_health_clinic'
  | 'forensic_psychiatric_facility'
  // Rehabilitation & Post Acute Care
  | 'inpatient_rehabilitation_facility'
  | 'acute_rehab_unit'
  | 'skilled_nursing_facility'
  | 'long_term_acute_care_hospital'
  | 'long_term_care_facility'
  | 'memory_care_unit'
  | 'stroke_rehabilitation_unit'
  | 'spinal_cord_injury_rehab'
  | 'traumatic_brain_injury_rehab'
  // Community, Home & Population Health
  | 'home_health'
  | 'hospice'
  | 'palliative_care_program'
  | 'visiting_nurse_service'
  | 'community_health_center'
  | 'public_health_department'
  | 'school_health_office'
  | 'occupational_health_clinic'
  | 'employer_based_clinic'
  | 'mobile_health_unit'
  // Diagnostic, Monitoring & Ancillary Settings
  | 'radiology_department'
  | 'mri_suite'
  | 'ct_suite'
  | 'nuclear_medicine'
  | 'cardiac_diagnostics'
  | 'eeg_lab'
  | 'sleep_lab'
  | 'pulmonary_function_lab'
  | 'vascular_lab'
  // Virtual, Remote & Digital Care
  | 'telehealth_center'
  | 'virtual_icu'
  | 'remote_patient_monitoring_program'
  | 'nurse_advice_line'
  | 'triage_call_center'
  | 'digital_health_command_center'
  // Non Bedside, Leadership & Systems
  | 'case_management_office'
  | 'care_coordination_department'
  | 'utilization_review'
  | 'quality_improvement_department'
  | 'patient_safety_office'
  | 'risk_management'
  | 'infection_prevention'
  | 'clinical_education_department'
  | 'nursing_administration'
  | 'research_office'
  | 'informatics_department'
  // Government, Military & Special Environments
  | 'correctional_facility'
  | 'military_treatment_facility'
  | 'veterans_affairs_facility'
  | 'disaster_response_team'
  | 'emergency_operations_center'
  | 'refugee_health_program'
  // Education, Industry & Non Clinical
  | 'academic_institution'
  | 'simulation_lab'
  | 'nursing_school'
  | 'medical_device_company'
  | 'pharmaceutical_company'
  | 'health_technology_company'
  | 'insurance_organization'
  | 'regulatory_agency';

export type ShiftType = 'day' | 'night' | 'rotating' | 'prn';

export interface ClinicianProfile {
  id: string;
  user_id: string;
  clinical_role: ClinicalRole;
  specialty?: ClinicalSpecialty;
  practice_setting?: PracticeSetting;
  patient_population?: string;
  shift_type?: ShiftType;
  preferred_units: string;
  years_experience?: number;
  education?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// ============= Nurse-First Medication Types =============

export interface SafeMethod {
  preferred_method: string;
  push_or_infusion_time: string;
  pump_required: boolean;
}

export interface RateDilution {
  iv_push_rate?: string;
  infusion_duration?: string;
  dilution_required: boolean;
  dilution_instructions?: string;
}

export interface LineCompatibility {
  peripheral_allowed: boolean;
  central_preferred: boolean;
  dedicated_line_required: boolean;
  flush_before_after: boolean;
  y_site_restrictions?: string[];
}

export interface MonitoringRequirements {
  vitals_required: boolean;
  cardiac_monitoring: boolean;
  oxygen_monitoring: boolean;
  neuro_checks: boolean;
  timing: string;
}

export interface HoldParameters {
  bp_limits?: string;
  hr_limits?: string;
  rr_limits?: string;
  lab_limits?: string[];
}

export interface RequiredResources {
  iv_pump: boolean;
  filter_required: boolean;
  special_tubing?: string;
  ppe_required?: string;
  antidote?: string;
}

export interface CrushingInfo {
  crush_allowed: boolean;
  split_allowed: boolean;
  do_not_crush_warning?: string;
}

export interface TimingRules {
  food_interaction?: string;
  separation_from_meds?: string;
  time_sensitive?: string;
}

export interface PatientEducation {
  purpose: string;
  expected_feelings?: string;
  report_immediately?: string[];
}

export interface RedFlags {
  early_danger_signs: string[];
  immediate_action: string[];
}

export interface ExpectedEffect {
  onset_timeframe: string;
  reassessment_target: string;
}

export interface DocumentationReminders {
  pre_admin_assessment: string;
  monitoring_documented: string;
  patient_response: string;
}

export interface SafetyBadges {
  weight_based: boolean;
  renal_dosing: boolean;
  titration: boolean;
  high_alert: boolean;
}

export interface PauseTriggers {
  duplicate_therapy_check: boolean;
  max_dose_check: boolean;
  contraindicated_vitals: string[];
  allergy_match: boolean;
}

export interface Medication {
  id: string;
  generic_name: string;
  brand_names?: string[];
  drug_class?: string;
  strengths?: string[];
  dosage_form?: string;
  ndc_code?: string;
  manufacturer?: string;
  high_alert: boolean;
  controlled_substance: boolean;
  dosing_info?: Record<string, unknown>;
  adjustments?: Record<string, unknown>;
  safety_info?: Record<string, unknown>;
  administration_info?: Record<string, unknown>;
  clinical_pearls?: string[];
  created_at: string;
  // New nurse-first fields
  route?: string[];
  safe_method?: SafeMethod;
  rate_dilution?: RateDilution;
  line_compatibility?: LineCompatibility;
  monitoring?: MonitoringRequirements;
  hold_parameters?: HoldParameters;
  required_resources?: RequiredResources;
  crushing_info?: CrushingInfo;
  timing_rules?: TimingRules;
  patient_education?: PatientEducation;
  red_flags?: RedFlags;
  expected_effect?: ExpectedEffect;
  documentation_reminders?: DocumentationReminders;
  safety_badges?: SafetyBadges;
  pause_triggers?: PauseTriggers;
  double_check_required?: boolean;
  // Media fields
  image_url?: string;
  pronunciation_audio_url?: string;
  pronunciation_text?: string;
  // Four-part nursing guide (route-specific)
  nursing_guide?: NursingGuide;
  // FDA reference link
  fda_link?: string;
  // Pharmacokinetics (ADME)
  pharmacokinetics?: Pharmacokinetics;
}

// ============= Four-Part Nursing Guide Types =============

export interface NursingGuideAppropriateness {
  hold_if: string[];
  required_labs?: string[];
  allergy_alerts?: string[];
}

export interface NursingGuideSpecialPrep {
  has_special_requirements: boolean;
  notes?: string;
  filter_needle?: boolean;
  light_protection?: boolean;
  specific_syringe?: string;
  dilution?: string;
  reconstitution?: string;
}

export interface NursingGuideAdministration {
  rate?: string;
  max_rate?: string;
  why_rate_matters?: string;
  line_type?: string;
  flush?: string;
  timing?: string;
  with_food?: string;
  special_notes?: string;
}

export interface NursingGuidePostAdmin {
  reassess_timing: string;
  expected_response: string;
  watch_for: string[];
  document?: string[];
}

export interface NursingGuidePatientTeaching {
  tell_patient: string;
  report_immediately: string[];
  what_to_expect?: string;
}

export interface NursingGuideRouteContent {
  appropriateness: NursingGuideAppropriateness;
  special_prep: NursingGuideSpecialPrep;
  administration: NursingGuideAdministration;
  post_admin: NursingGuidePostAdmin;
  patient_teaching: NursingGuidePatientTeaching;
}

export interface NursingGuide {
  IV_Push?: NursingGuideRouteContent;
  IV_Infusion?: NursingGuideRouteContent;
  IM?: NursingGuideRouteContent;
  SubQ?: NursingGuideRouteContent;
  PO?: NursingGuideRouteContent;
  [key: string]: NursingGuideRouteContent | undefined;
}

// ============= Pharmacokinetics Types =============

export interface PharmacokineticAbsorption {
  oral_bioavailability?: string;
  onset_of_action?: Record<string, string>;
  peak_effect?: Record<string, string>;
  food_effect?: string;
}

export interface PharmacokineticDistribution {
  volume_of_distribution?: string;
  protein_binding?: string;
  crosses_placenta?: boolean;
  enters_breast_milk?: boolean;
  tissue_distribution?: string;
}

export interface PharmacokineticMetabolism {
  primary_site?: string;
  metabolites?: string;
  percent_metabolized?: string;
  cyp_involvement?: string;
}

export interface PharmacokineticExcretion {
  primary_route?: string;
  percent_unchanged_urine?: string;
  percent_feces?: string;
  renal_clearance?: string;
}

export interface PharmacokineticHalfLife {
  normal_renal_function?: string;
  renal_impairment?: string;
  hepatic_impairment?: string;
  neonates?: string;
  elderly?: string;
}

export interface Pharmacokinetics {
  absorption?: PharmacokineticAbsorption;
  distribution?: PharmacokineticDistribution;
  metabolism?: PharmacokineticMetabolism;
  excretion?: PharmacokineticExcretion;
  half_life?: PharmacokineticHalfLife;
  duration_of_action?: Record<string, string>;
  dialysis?: Record<string, string>;
}

export interface ClinicalTool {
  id: string;
  name: string;
  category: string;
  description?: string;
  formula?: Record<string, unknown>;
  inputs?: ToolInput[];
  interpretation?: Interpretation[];
  roles_applicable?: ClinicalRole[];
  created_at: string;
}

export interface ToolInput {
  name: string;
  label: string;
  type: 'number' | 'select' | 'checkbox';
  options?: (number | string)[];
}

export interface Interpretation {
  range: [number, number];
  label: string;
}

export interface SafetyAlert {
  id: string;
  user_id: string;
  alert_type: 'dose_range' | 'interaction' | 'renal' | 'hepatic' | 'high_alert' | 'timing';
  severity: 'info' | 'warning' | 'critical';
  medication_id?: string;
  message: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  created_at: string;
}

// Role display helpers
export const roleLabels: Record<ClinicalRole, string> = {
  nursing_student: 'Nursing Student',
  nurse: 'Registered Nurse',
  advanced_nurse: 'Advanced Practice Nurse',
  medical_student: 'Medical Student',
  resident: 'Resident Physician',
  attending: 'Attending Physician',
  app: 'Advanced Practice Provider'
};

// Grouped specialty labels for better organization in UI
export const specialtyGroups = {
  'Adult & Medical Specialties': [
    'medical_surgical',
    'general_internal_medicine',
    'neuro',
    'cardiac',
    'pulmonology',
    'gi',
    'nephrology',
    'endocrinology',
    'rheumatology',
    'id',
    'hematology',
    'oncology',
    'palliative_care',
    'pain_management',
    'geriatrics',
  ],
  'Critical & Acute Care': [
    'icu',
    'cardiothoracic_icu',
    'neuro_icu',
    'surgical_icu',
    'medical_icu',
    'trauma',
    'em',
    'rapid_response',
    'burn_unit',
  ],
  "Women's Health & Reproductive": [
    'ob',
    'labor_delivery',
    'postpartum',
    'high_risk_ob',
    'reproductive_health',
    'fertility',
    'gyn_oncology',
  ],
  'Pediatrics & Neonatal': [
    'pediatrics',
    'picu',
    'pediatric_em',
    'nicu',
    'newborn_nursery',
    'pediatric_oncology',
    'pediatric_cardiology',
  ],
  'Surgical & Procedural': [
    'perioperative',
    'operating_room',
    'pre_op',
    'pacu',
    'ambulatory_surgery',
    'endoscopy',
    'interventional_radiology',
    'cardiac_cath_lab',
  ],
  'Behavioral & Mental Health': [
    'psychiatric',
    'substance_use',
    'behavioral_health',
    'crisis_intervention',
    'forensic',
  ],
  'Community & Population Health': [
    'public_health',
    'community_health',
    'school_nursing',
    'occupational_health',
    'correctional',
    'home_health',
    'hospice',
  ],
  'Rehabilitation & Chronic Care': [
    'rehabilitation',
    'stroke_rehab',
    'spinal_cord_injury',
    'brain_injury',
    'physical_medicine',
    'long_term_care',
    'skilled_nursing',
  ],
  'Specialty & Support Services': [
    'dialysis',
    'infusion',
    'wound_ostomy',
    'diabetes_education',
    'lactation',
    'case_management',
    'care_coordination',
  ],
  'Diagnostic & Ancillary': [
    'radiology',
    'nuclear_medicine',
    'cardiac_diagnostics',
    'sleep_medicine',
    'pulmonary_function',
  ],
  'Leadership, Education & Non-Bedside': [
    'nurse_educator',
    'clinical_nurse_specialist',
    'nurse_manager',
    'nurse_executive',
    'quality_improvement',
    'patient_safety',
    'risk_management',
    'research',
    'informatics',
  ],
  'General': [
    'general',
    'respiratory',
  ],
} as const;

export const specialtyLabels: Record<ClinicalSpecialty, string> = {
  // Adult & Medical Specialties
  medical_surgical: 'Medical Surgical Nursing',
  general_internal_medicine: 'General Internal Medicine',
  neuro: 'Neurology / Stroke',
  cardiac: 'Cardiology',
  pulmonology: 'Pulmonology / Respiratory',
  gi: 'Gastroenterology',
  nephrology: 'Nephrology',
  endocrinology: 'Endocrinology',
  rheumatology: 'Rheumatology',
  id: 'Infectious Disease',
  hematology: 'Hematology',
  oncology: 'Oncology',
  palliative_care: 'Palliative Care',
  pain_management: 'Pain Management',
  geriatrics: 'Geriatrics',
  // Critical & Acute Care
  icu: 'Critical Care / ICU',
  cardiothoracic_icu: 'Cardiothoracic ICU',
  neuro_icu: 'Neuro ICU',
  surgical_icu: 'Surgical ICU',
  medical_icu: 'Medical ICU',
  trauma: 'Trauma Nursing',
  em: 'Emergency Medicine',
  rapid_response: 'Rapid Response / Code Team',
  burn_unit: 'Burn Unit Nursing',
  // Women's Health & Reproductive
  ob: 'OB/GYN',
  labor_delivery: 'Labor and Delivery',
  postpartum: 'Postpartum / Mother Baby',
  high_risk_ob: 'High Risk Obstetrics',
  reproductive_health: 'Reproductive Health',
  fertility: 'Fertility Nursing',
  gyn_oncology: 'Gynecologic Oncology',
  // Pediatrics & Neonatal
  pediatrics: 'Pediatrics',
  picu: 'Pediatric ICU',
  pediatric_em: 'Pediatric Emergency',
  nicu: 'Neonatal ICU',
  newborn_nursery: 'Newborn Nursery',
  pediatric_oncology: 'Pediatric Oncology',
  pediatric_cardiology: 'Pediatric Cardiology',
  // Surgical & Procedural
  perioperative: 'Perioperative Nursing',
  operating_room: 'Operating Room',
  pre_op: 'Pre-Op Nursing',
  pacu: 'Post Anesthesia Care Unit',
  ambulatory_surgery: 'Ambulatory Surgery',
  endoscopy: 'Endoscopy',
  interventional_radiology: 'Interventional Radiology',
  cardiac_cath_lab: 'Cardiac Cath Lab',
  // Behavioral & Mental Health
  psychiatric: 'Psychiatric Mental Health',
  substance_use: 'Substance Use Disorder',
  behavioral_health: 'Behavioral Health',
  crisis_intervention: 'Crisis Intervention',
  forensic: 'Forensic Nursing',
  // Community & Population Health
  public_health: 'Public Health Nursing',
  community_health: 'Community Health',
  school_nursing: 'School Nursing',
  occupational_health: 'Occupational Health',
  correctional: 'Correctional Nursing',
  home_health: 'Home Health',
  hospice: 'Hospice',
  // Rehabilitation & Chronic Care
  rehabilitation: 'Rehabilitation Nursing',
  stroke_rehab: 'Stroke Rehabilitation',
  spinal_cord_injury: 'Spinal Cord Injury',
  brain_injury: 'Brain Injury',
  physical_medicine: 'Physical Medicine',
  long_term_care: 'Long Term Care',
  skilled_nursing: 'Skilled Nursing Facility',
  // Specialty & Support Services
  dialysis: 'Dialysis',
  infusion: 'Infusion Nursing',
  wound_ostomy: 'Wound Ostomy Continence',
  diabetes_education: 'Diabetes Education',
  lactation: 'Lactation Consulting',
  case_management: 'Case Management',
  care_coordination: 'Care Coordination',
  // Diagnostic & Ancillary
  radiology: 'Radiology Nursing',
  nuclear_medicine: 'Nuclear Medicine',
  cardiac_diagnostics: 'Cardiac Diagnostics',
  sleep_medicine: 'Sleep Medicine',
  pulmonary_function: 'Pulmonary Function Lab',
  // Leadership, Education & Non Bedside
  nurse_educator: 'Nurse Educator',
  clinical_nurse_specialist: 'Clinical Nurse Specialist',
  nurse_manager: 'Nurse Manager',
  nurse_executive: 'Nurse Executive',
  quality_improvement: 'Quality Improvement',
  patient_safety: 'Patient Safety',
  risk_management: 'Risk Management',
  research: 'Research Nursing',
  informatics: 'Informatics Nursing',
  // General fallback
  general: 'General / Internal Medicine',
  respiratory: 'Respiratory / Pulmonology',
};

// Grouped setting labels for better organization in UI
export const settingGroups = {
  'Acute Care Hospital Settings': [
    'emergency_department',
    'trauma_center',
    'observation_unit',
    'critical_care_icu',
    'medical_icu',
    'surgical_icu',
    'neuro_icu',
    'cardiac_icu',
    'cardiothoracic_icu',
    'coronary_care_unit',
    'step_down_unit',
    'progressive_care_unit',
    'medical_surgical_unit',
    'telemetry_unit',
    'stroke_unit',
    'burn_unit',
    'isolation_unit',
    'negative_pressure_unit',
    'overflow_surge_unit',
  ],
  'Surgical & Procedural Settings': [
    'operating_room',
    'hybrid_or',
    'preoperative_unit',
    'post_anesthesia_care_unit',
    'same_day_surgery',
    'ambulatory_surgery_center',
    'endoscopy_suite',
    'cardiac_cath_lab',
    'electrophysiology_lab',
    'interventional_radiology',
    'interventional_neurology_suite',
    'pain_procedure_suite',
  ],
  "Women's, Maternal & Reproductive Settings": [
    'labor_and_delivery',
    'postpartum_mother_baby',
    'high_risk_obstetrics_unit',
    'antepartum_unit',
    'ob_triage',
    'neonatal_icu',
    'newborn_nursery',
    'lactation_services',
    'fertility_clinic',
    'gynecologic_oncology_unit',
  ],
  'Pediatric & Adolescent Settings': [
    'pediatric_unit',
    'pediatric_icu',
    'pediatric_emergency_department',
    'pediatric_step_down',
    'pediatric_oncology_unit',
    'pediatric_specialty_clinic',
    'school_based_health_center',
  ],
  'Specialty Inpatient Units': [
    'oncology_unit',
    'hematology_unit',
    'bone_marrow_transplant_unit',
    'transplant_unit',
    'dialysis_unit',
    'renal_unit',
    'pulmonary_unit',
    'infectious_disease_unit',
    'immunocompromised_unit',
    'hiv_care_unit',
  ],
  'Outpatient & Ambulatory Care': [
    'primary_care_clinic',
    'specialty_clinic',
    'urgent_care_center',
    'ambulatory_care_center',
    'infusion_center',
    'dialysis_center',
    'oncology_clinic',
    'cardiology_clinic',
    'neurology_clinic',
    'gi_clinic',
    'endocrinology_clinic',
    'rheumatology_clinic',
    'pain_management_clinic',
    'wound_care_clinic',
    'anticoagulation_clinic',
  ],
  'Behavioral, Mental Health & Social Care': [
    'inpatient_psychiatric_unit',
    'behavioral_health_unit',
    'substance_use_treatment_center',
    'detox_unit',
    'crisis_stabilization_unit',
    'partial_hospitalization_program',
    'intensive_outpatient_program',
    'outpatient_mental_health_clinic',
    'forensic_psychiatric_facility',
  ],
  'Rehabilitation & Post Acute Care': [
    'inpatient_rehabilitation_facility',
    'acute_rehab_unit',
    'skilled_nursing_facility',
    'long_term_acute_care_hospital',
    'long_term_care_facility',
    'memory_care_unit',
    'stroke_rehabilitation_unit',
    'spinal_cord_injury_rehab',
    'traumatic_brain_injury_rehab',
  ],
  'Community, Home & Population Health': [
    'home_health',
    'hospice',
    'palliative_care_program',
    'visiting_nurse_service',
    'community_health_center',
    'public_health_department',
    'school_health_office',
    'occupational_health_clinic',
    'employer_based_clinic',
    'mobile_health_unit',
  ],
  'Diagnostic, Monitoring & Ancillary Settings': [
    'radiology_department',
    'mri_suite',
    'ct_suite',
    'nuclear_medicine',
    'cardiac_diagnostics',
    'eeg_lab',
    'sleep_lab',
    'pulmonary_function_lab',
    'vascular_lab',
  ],
  'Virtual, Remote & Digital Care': [
    'telehealth_center',
    'virtual_icu',
    'remote_patient_monitoring_program',
    'nurse_advice_line',
    'triage_call_center',
    'digital_health_command_center',
  ],
  'Non Bedside, Leadership & Systems': [
    'case_management_office',
    'care_coordination_department',
    'utilization_review',
    'quality_improvement_department',
    'patient_safety_office',
    'risk_management',
    'infection_prevention',
    'clinical_education_department',
    'nursing_administration',
    'research_office',
    'informatics_department',
  ],
  'Government, Military & Special Environments': [
    'correctional_facility',
    'military_treatment_facility',
    'veterans_affairs_facility',
    'disaster_response_team',
    'emergency_operations_center',
    'refugee_health_program',
  ],
  'Education, Industry & Non Clinical': [
    'academic_institution',
    'simulation_lab',
    'nursing_school',
    'medical_device_company',
    'pharmaceutical_company',
    'health_technology_company',
    'insurance_organization',
    'regulatory_agency',
  ],
} as const;

export const settingLabels: Record<PracticeSetting, string> = {
  // Acute Care Hospital Settings
  emergency_department: 'Emergency Department',
  trauma_center: 'Trauma Center',
  observation_unit: 'Observation Unit',
  critical_care_icu: 'Critical Care Unit (ICU)',
  medical_icu: 'Medical ICU',
  surgical_icu: 'Surgical ICU',
  neuro_icu: 'Neuro ICU',
  cardiac_icu: 'Cardiac ICU',
  cardiothoracic_icu: 'Cardiothoracic ICU',
  coronary_care_unit: 'Coronary Care Unit',
  step_down_unit: 'Step Down Unit',
  progressive_care_unit: 'Progressive Care Unit',
  medical_surgical_unit: 'Medical Surgical Unit',
  telemetry_unit: 'Telemetry Unit',
  stroke_unit: 'Stroke Unit',
  burn_unit: 'Burn Unit',
  isolation_unit: 'Isolation Unit',
  negative_pressure_unit: 'Negative Pressure Unit',
  overflow_surge_unit: 'Overflow / Surge Unit',
  // Surgical & Procedural Settings
  operating_room: 'Operating Room',
  hybrid_or: 'Hybrid OR',
  preoperative_unit: 'Preoperative Unit',
  post_anesthesia_care_unit: 'Post Anesthesia Care Unit (PACU)',
  same_day_surgery: 'Same Day Surgery',
  ambulatory_surgery_center: 'Ambulatory Surgery Center',
  endoscopy_suite: 'Endoscopy Suite',
  cardiac_cath_lab: 'Cardiac Catheterization Lab',
  electrophysiology_lab: 'Electrophysiology Lab',
  interventional_radiology: 'Interventional Radiology',
  interventional_neurology_suite: 'Interventional Neurology Suite',
  pain_procedure_suite: 'Pain Procedure Suite',
  // Women's, Maternal & Reproductive Settings
  labor_and_delivery: 'Labor and Delivery',
  postpartum_mother_baby: 'Postpartum / Mother Baby Unit',
  high_risk_obstetrics_unit: 'High Risk Obstetrics Unit',
  antepartum_unit: 'Antepartum Unit',
  ob_triage: 'OB Triage',
  neonatal_icu: 'Neonatal ICU (NICU)',
  newborn_nursery: 'Newborn Nursery',
  lactation_services: 'Lactation Services',
  fertility_clinic: 'Fertility Clinic',
  gynecologic_oncology_unit: 'Gynecologic Oncology Unit',
  // Pediatric & Adolescent Settings
  pediatric_unit: 'Pediatric Unit',
  pediatric_icu: 'Pediatric ICU (PICU)',
  pediatric_emergency_department: 'Pediatric Emergency Department',
  pediatric_step_down: 'Pediatric Step Down',
  pediatric_oncology_unit: 'Pediatric Oncology Unit',
  pediatric_specialty_clinic: 'Pediatric Specialty Clinic',
  school_based_health_center: 'School Based Health Center',
  // Specialty Inpatient Units
  oncology_unit: 'Oncology Unit',
  hematology_unit: 'Hematology Unit',
  bone_marrow_transplant_unit: 'Bone Marrow Transplant Unit',
  transplant_unit: 'Transplant Unit',
  dialysis_unit: 'Dialysis Unit',
  renal_unit: 'Renal Unit',
  pulmonary_unit: 'Pulmonary Unit',
  infectious_disease_unit: 'Infectious Disease Unit',
  immunocompromised_unit: 'Immunocompromised Unit',
  hiv_care_unit: 'HIV Care Unit',
  // Outpatient & Ambulatory Care
  primary_care_clinic: 'Primary Care Clinic',
  specialty_clinic: 'Specialty Clinic',
  urgent_care_center: 'Urgent Care Center',
  ambulatory_care_center: 'Ambulatory Care Center',
  infusion_center: 'Infusion Center',
  dialysis_center: 'Dialysis Center',
  oncology_clinic: 'Oncology Clinic',
  cardiology_clinic: 'Cardiology Clinic',
  neurology_clinic: 'Neurology Clinic',
  gi_clinic: 'GI Clinic',
  endocrinology_clinic: 'Endocrinology Clinic',
  rheumatology_clinic: 'Rheumatology Clinic',
  pain_management_clinic: 'Pain Management Clinic',
  wound_care_clinic: 'Wound Care Clinic',
  anticoagulation_clinic: 'Anticoagulation Clinic',
  // Behavioral, Mental Health & Social Care
  inpatient_psychiatric_unit: 'Inpatient Psychiatric Unit',
  behavioral_health_unit: 'Behavioral Health Unit',
  substance_use_treatment_center: 'Substance Use Treatment Center',
  detox_unit: 'Detox Unit',
  crisis_stabilization_unit: 'Crisis Stabilization Unit',
  partial_hospitalization_program: 'Partial Hospitalization Program',
  intensive_outpatient_program: 'Intensive Outpatient Program',
  outpatient_mental_health_clinic: 'Outpatient Mental Health Clinic',
  forensic_psychiatric_facility: 'Forensic Psychiatric Facility',
  // Rehabilitation & Post Acute Care
  inpatient_rehabilitation_facility: 'Inpatient Rehabilitation Facility',
  acute_rehab_unit: 'Acute Rehab Unit',
  skilled_nursing_facility: 'Skilled Nursing Facility',
  long_term_acute_care_hospital: 'Long Term Acute Care Hospital',
  long_term_care_facility: 'Long Term Care Facility',
  memory_care_unit: 'Memory Care Unit',
  stroke_rehabilitation_unit: 'Stroke Rehabilitation Unit',
  spinal_cord_injury_rehab: 'Spinal Cord Injury Rehab',
  traumatic_brain_injury_rehab: 'Traumatic Brain Injury Rehab',
  // Community, Home & Population Health
  home_health: 'Home Health',
  hospice: 'Hospice',
  palliative_care_program: 'Palliative Care Program',
  visiting_nurse_service: 'Visiting Nurse Service',
  community_health_center: 'Community Health Center',
  public_health_department: 'Public Health Department',
  school_health_office: 'School Health Office',
  occupational_health_clinic: 'Occupational Health Clinic',
  employer_based_clinic: 'Employer Based Clinic',
  mobile_health_unit: 'Mobile Health Unit',
  // Diagnostic, Monitoring & Ancillary Settings
  radiology_department: 'Radiology Department',
  mri_suite: 'MRI Suite',
  ct_suite: 'CT Suite',
  nuclear_medicine: 'Nuclear Medicine',
  cardiac_diagnostics: 'Cardiac Diagnostics',
  eeg_lab: 'EEG Lab',
  sleep_lab: 'Sleep Lab',
  pulmonary_function_lab: 'Pulmonary Function Lab',
  vascular_lab: 'Vascular Lab',
  // Virtual, Remote & Digital Care
  telehealth_center: 'Telehealth Center',
  virtual_icu: 'Virtual ICU',
  remote_patient_monitoring_program: 'Remote Patient Monitoring Program',
  nurse_advice_line: 'Nurse Advice Line',
  triage_call_center: 'Triage Call Center',
  digital_health_command_center: 'Digital Health Command Center',
  // Non Bedside, Leadership & Systems
  case_management_office: 'Case Management Office',
  care_coordination_department: 'Care Coordination Department',
  utilization_review: 'Utilization Review',
  quality_improvement_department: 'Quality Improvement Department',
  patient_safety_office: 'Patient Safety Office',
  risk_management: 'Risk Management',
  infection_prevention: 'Infection Prevention',
  clinical_education_department: 'Clinical Education Department',
  nursing_administration: 'Nursing Administration',
  research_office: 'Research Office',
  informatics_department: 'Informatics Department',
  // Government, Military & Special Environments
  correctional_facility: 'Correctional Facility',
  military_treatment_facility: 'Military Treatment Facility',
  veterans_affairs_facility: 'Veterans Affairs Facility',
  disaster_response_team: 'Disaster Response Team',
  emergency_operations_center: 'Emergency Operations Center',
  refugee_health_program: 'Refugee Health Program',
  // Education, Industry & Non Clinical
  academic_institution: 'Academic Institution',
  simulation_lab: 'Simulation Lab',
  nursing_school: 'Nursing School',
  medical_device_company: 'Medical Device Company',
  pharmaceutical_company: 'Pharmaceutical Company',
  health_technology_company: 'Health Technology Company',
  insurance_organization: 'Insurance Organization',
  regulatory_agency: 'Regulatory Agency',
};

export const shiftLabels: Record<ShiftType, string> = {
  day: 'Day Shift',
  night: 'Night Shift',
  rotating: 'Rotating',
  prn: 'PRN / As Needed'
};