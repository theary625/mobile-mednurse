-- Drop and recreate practice_setting enum with comprehensive list
-- First, we need to handle existing data by creating a new enum and migrating

-- Create new comprehensive practice_setting enum
CREATE TYPE practice_setting_new AS ENUM (
  -- Acute Care Hospital Settings
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
  -- Surgical & Procedural Settings
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
  -- Women's, Maternal & Reproductive Settings
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
  -- Pediatric & Adolescent Settings
  'pediatric_unit',
  'pediatric_icu',
  'pediatric_emergency_department',
  'pediatric_step_down',
  'pediatric_oncology_unit',
  'pediatric_specialty_clinic',
  'school_based_health_center',
  -- Specialty Inpatient Units
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
  -- Outpatient & Ambulatory Care
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
  -- Behavioral, Mental Health & Social Care
  'inpatient_psychiatric_unit',
  'behavioral_health_unit',
  'substance_use_treatment_center',
  'detox_unit',
  'crisis_stabilization_unit',
  'partial_hospitalization_program',
  'intensive_outpatient_program',
  'outpatient_mental_health_clinic',
  'forensic_psychiatric_facility',
  -- Rehabilitation & Post Acute Care
  'inpatient_rehabilitation_facility',
  'acute_rehab_unit',
  'skilled_nursing_facility',
  'long_term_acute_care_hospital',
  'long_term_care_facility',
  'memory_care_unit',
  'stroke_rehabilitation_unit',
  'spinal_cord_injury_rehab',
  'traumatic_brain_injury_rehab',
  -- Community, Home & Population Health
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
  -- Diagnostic, Monitoring & Ancillary Settings
  'radiology_department',
  'mri_suite',
  'ct_suite',
  'nuclear_medicine',
  'cardiac_diagnostics',
  'eeg_lab',
  'sleep_lab',
  'pulmonary_function_lab',
  'vascular_lab',
  -- Virtual, Remote & Digital Care
  'telehealth_center',
  'virtual_icu',
  'remote_patient_monitoring_program',
  'nurse_advice_line',
  'triage_call_center',
  'digital_health_command_center',
  -- Non Bedside, Leadership & Systems
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
  -- Government, Military & Special Environments
  'correctional_facility',
  'military_treatment_facility',
  'veterans_affairs_facility',
  'disaster_response_team',
  'emergency_operations_center',
  'refugee_health_program',
  -- Education, Industry & Non Clinical
  'academic_institution',
  'simulation_lab',
  'nursing_school',
  'medical_device_company',
  'pharmaceutical_company',
  'health_technology_company',
  'insurance_organization',
  'regulatory_agency'
);

-- Map old values to new values and update the column
ALTER TABLE clinician_profiles 
  ALTER COLUMN practice_setting TYPE practice_setting_new 
  USING CASE practice_setting::text
    WHEN 'hospital' THEN 'medical_surgical_unit'::practice_setting_new
    WHEN 'clinic' THEN 'primary_care_clinic'::practice_setting_new
    WHEN 'ed' THEN 'emergency_department'::practice_setting_new
    WHEN 'icu' THEN 'critical_care_icu'::practice_setting_new
    WHEN 'operating_room' THEN 'operating_room'::practice_setting_new
    WHEN 'home_health' THEN 'home_health'::practice_setting_new
    WHEN 'long_term_care' THEN 'long_term_care_facility'::practice_setting_new
    WHEN 'academic' THEN 'academic_institution'::practice_setting_new
    ELSE NULL
  END;

-- Drop old enum and rename new one
DROP TYPE practice_setting;
ALTER TYPE practice_setting_new RENAME TO practice_setting;