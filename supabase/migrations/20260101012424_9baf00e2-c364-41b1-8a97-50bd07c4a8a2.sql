-- Drop and recreate the clinical_specialty enum with all specialties
-- First create a new enum with all values
CREATE TYPE clinical_specialty_new AS ENUM (
  -- Adult & Medical Specialties
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
  -- Critical & Acute Care
  'icu',
  'cardiothoracic_icu',
  'neuro_icu',
  'surgical_icu',
  'medical_icu',
  'trauma',
  'em',
  'rapid_response',
  'burn_unit',
  -- Women's Health & Reproductive
  'ob',
  'labor_delivery',
  'postpartum',
  'high_risk_ob',
  'reproductive_health',
  'fertility',
  'gyn_oncology',
  -- Pediatrics & Neonatal
  'pediatrics',
  'picu',
  'pediatric_em',
  'nicu',
  'newborn_nursery',
  'pediatric_oncology',
  'pediatric_cardiology',
  -- Surgical & Procedural
  'perioperative',
  'operating_room',
  'pre_op',
  'pacu',
  'ambulatory_surgery',
  'endoscopy',
  'interventional_radiology',
  'cardiac_cath_lab',
  -- Behavioral & Mental Health
  'psychiatric',
  'substance_use',
  'behavioral_health',
  'crisis_intervention',
  'forensic',
  -- Community & Population Health
  'public_health',
  'community_health',
  'school_nursing',
  'occupational_health',
  'correctional',
  'home_health',
  'hospice',
  -- Rehabilitation & Chronic Care
  'rehabilitation',
  'stroke_rehab',
  'spinal_cord_injury',
  'brain_injury',
  'physical_medicine',
  'long_term_care',
  'skilled_nursing',
  -- Specialty & Support Services
  'dialysis',
  'infusion',
  'wound_ostomy',
  'diabetes_education',
  'lactation',
  'case_management',
  'care_coordination',
  -- Diagnostic & Ancillary
  'radiology',
  'nuclear_medicine',
  'cardiac_diagnostics',
  'sleep_medicine',
  'pulmonary_function',
  -- Leadership, Education & Non Bedside
  'nurse_educator',
  'clinical_nurse_specialist',
  'nurse_manager',
  'nurse_executive',
  'quality_improvement',
  'patient_safety',
  'risk_management',
  'research',
  'informatics',
  -- General fallback
  'general',
  'respiratory'
);

-- Update the clinician_profiles table to use text temporarily
ALTER TABLE clinician_profiles 
  ALTER COLUMN specialty TYPE text USING specialty::text;

-- Drop the old enum
DROP TYPE IF EXISTS clinical_specialty;

-- Rename new enum to original name
ALTER TYPE clinical_specialty_new RENAME TO clinical_specialty;

-- Convert back to enum
ALTER TABLE clinician_profiles 
  ALTER COLUMN specialty TYPE clinical_specialty USING specialty::clinical_specialty;