import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Star } from 'lucide-react';
import {
  SpriteAllSystemsIcon, SpriteNeurologicalIcon, SpritePsychiatricIcon, SpriteCardiovascularIcon,
  SpriteRespiratoryIcon, SpriteSepsisIcon, SpriteCriticalIcon, SpriteTraumaIcon,
  SpriteHematologyIcon, SpritePediatricIcon, SpriteRenalIcon, SpriteOncologyIcon,
  SpriteGeneralIcon, SpriteNursingIcon, SpriteObGynIcon
} from '@/components/icons/MedicalSystemIcons';
import { useFavoriteTools } from '@/hooks/useFavoriteTools';
import { useToast } from '@/hooks/use-toast';
import GCSCalculator from './GCSCalculator';
import NIHSSCalculator from './NIHSSCalculator';
import CHADS2VASCCalculator from './CHADS2VASCCalculator';
import LAMSCalculator from './LAMSCalculator';
import ICHScoreCalculator from './ICHScoreCalculator';
import HuntHessCalculator from './HuntHessCalculator';
import QSOFACalculator from './QSOFACalculator';
import SLAMSCalculator from './SLAMSCalculator';
import RACECalculator from './RACECalculator';
import MRSCalculator from './MRSCalculator';
import ABCD2Calculator from './ABCD2Calculator';
import FisherScaleCalculator from './FisherScaleCalculator';
import HASBLEDCalculator from './HASBLEDCalculator';
import SIRSCalculator from './SIRSCalculator';
import WellsScoreCalculator from './WellsScoreCalculator';
import CURB65Calculator from './CURB65Calculator';
import TraumaScoresCalculator from './TraumaScoresCalculator';
import APACHEIICalculator from './APACHEIICalculator';
import AaGradientCalculator from './AaGradientCalculator';
import BODEIndexCalculator from './BODEIndexCalculator';
import MMRCDyspneaCalculator from './MMRCDyspneaCalculator';
import SOFACalculator from './SOFACalculator';
import BloodCompatibilityCalculator from './BloodCompatibilityCalculator';
import MENZACalculator from './MENZACalculator';
import PHQ9Calculator from './PHQ9Calculator';
import GAD7Calculator from './GAD7Calculator';
import CAMCalculator from './CAMCalculator';
import CIWAArCalculator from './CIWAArCalculator';
import CSSRSCalculator from './CSSRSCalculator';
import MoCACalculator from './MoCACalculator';
import HEARTScoreCalculator from './HEARTScoreCalculator';
import TIMIScoreCalculator from './TIMIScoreCalculator';
import KillipClassCalculator from './KillipClassCalculator';
import NYHAClassCalculator from './NYHAClassCalculator';
import RCRICalculator from './RCRICalculator';
import FraminghamRiskCalculator from './FraminghamRiskCalculator';
import DukeCriteriaCalculator from './DukeCriteriaCalculator';
import GRACEScoreCalculator from './GRACEScoreCalculator';
import APGARCalculator from './APGARCalculator';
import PediatricGCSCalculator from './PediatricGCSCalculator';
import PEWSCalculator from './PEWSCalculator';
import PediatricDosageCalculator from './PediatricDosageCalculator';
import PALSCodeNarrator from './PALSCodeNarrator';
import PediatricResuscitationTape from './PediatricResuscitationTape';
import CKDEPICalculator from './CKDEPICalculator';
import AKIKDIGOCalculator from './AKIKDIGOCalculator';
import CockcroftGaultCalculator from './CockcroftGaultCalculator';
import ECOGCalculator from './ECOGCalculator';
import KarnofskyCalculator from './KarnofskyCalculator';
import G8ScreeningCalculator from './G8ScreeningCalculator';
import ESASCalculator from './ESASCalculator';
import PaPScoreCalculator from './PaPScoreCalculator';
import PPSCalculator from './PPSCalculator';
import CPRMetronome from './CPRMetronome';

import ACLSCodeNarrator from './ACLSCodeNarrator';
// New calculators
import MAPCalculator from './MAPCalculator';
import ASCVDCalculator from './ASCVDCalculator';
import CalciumCorrectionCalculator from './CalciumCorrectionCalculator';
import FIB4Calculator from './FIB4Calculator';
import QTcCalculator from './QTcCalculator';
import MDRDCalculator from './MDRDCalculator';
import IBWCalculator from './IBWCalculator';
import BMICalculator from '@/components/calculators/BMICalculator';
import EDDCalculator from '@/components/calculators/EDDCalculator';
import { useErrorsPreventedFeedback } from '@/hooks/useErrorsPreventedFeedback';
// New calculators (2024 additions)
import PECARNCalculator from './PECARNCalculator';
import PREVENTCalculator from './PREVENTCalculator';
import PSIPortCalculator from './PSIPortCalculator';
import GuptaMICACalculator from './GuptaMICACalculator';
import DASICalculator from './DASICalculator';
import AnionGapCalculator from './AnionGapCalculator';
import PaduaScoreCalculator from './PaduaScoreCalculator';
import OsmolalityCalculator from './OsmolalityCalculator';
import HOMAIRCalculator from './HOMAIRCalculator';
import MELDNaCalculator from './MELDNaCalculator';
import FreeWaterDeficitCalculator from './FreeWaterDeficitCalculator';
import FENaCalculator from './FENaCalculator';
import ARISCATCalculator from './ARISCATCalculator';
import ABGCalculator from './ABGCalculator';
// New calculators (plan batch)
import MaintenanceFluidsCalculator from './MaintenanceFluidsCalculator';
import SodiumCorrectionCalculator from './SodiumCorrectionCalculator';
import CentorScoreCalculator from './CentorScoreCalculator';
import SteroidConversionCalculator from './SteroidConversionCalculator';
import PERCRuleCalculator from './PERCRuleCalculator';
import LDLCalculator from './LDLCalculator';
import CapriniScoreCalculator from './CapriniScoreCalculator';
import MMECalculator from './MMECalculator';
import ChildPughCalculator from './ChildPughCalculator';
import STOPBANGCalculator from './STOPBANGCalculator';
// Nursing tools
import BradenScaleCalculator from './BradenScaleCalculator';
import MorseFallScaleCalculator from './MorseFallScaleCalculator';
import NEWS2Calculator from './NEWS2Calculator';
import RASSCalculator from './RASSCalculator';
import COWSCalculator from './COWSCalculator';
import FLACCScaleCalculator from './FLACCScaleCalculator';
import IVDripRateCalculator from './IVDripRateCalculator';
import AldreteScoreCalculator from './AldreteScoreCalculator';
import CAMICUCalculator from './CAMICUCalculator';
import MUSTCalculator from './MUSTCalculator';
import FinneganNASCalculator from './FinneganNASCalculator';
import CPOTCalculator from './CPOTCalculator';
import PAINADCalculator from './PAINADCalculator';
import WongBakerFacesCalculator from './WongBakerFacesCalculator';
import IntakeOutputCalculator from './IntakeOutputCalculator';
import TubeFeedingCalculator from './TubeFeedingCalculator';
import NRSCalculator from './NRSCalculator';
import VASCalculator from './VASCalculator';
// OB/GYN tools
import BishopScoreCalculator from './BishopScoreCalculator';
import BiophysicalProfileCalculator from './BiophysicalProfileCalculator';
import VBACCalculator from './VBACCalculator';
import PPHRiskCalculator from './PPHRiskCalculator';
import GestationalAgeCalculator from './GestationalAgeCalculator';
import FetalWeightCalculator from './FetalWeightCalculator';
import PreeclampsiaRiskCalculator from './PreeclampsiaRiskCalculator';
import GBSProphylaxisCalculator from './GBSProphylaxisCalculator';
import OvulationCalendar from './OvulationCalendar';
import ContractionTimer from './ContractionTimer';
import KickCounter from './KickCounter';
// Dysphagia screening tools
import EAT10Calculator from './EAT10Calculator';
import GUSSCalculator from './GUSSCalculator';
import YaleSwallowCalculator from './YaleSwallowCalculator';
import WaterSwallowTestCalculator from './WaterSwallowTestCalculator';
import TORBSSTCalculator from './TORBSSTCalculator';
import MASACalculator from './MASACalculator';
import FOISCalculator from './FOISCalculator';
import PASCalculator from './PASCalculator';
import IDDSIReferenceChart from './IDDSIReferenceChart';
// New calculators (batch 2)
import HELPS2BCalculator from './HELPS2BCalculator';
import FourATCalculator from './FourATCalculator';
import FourPEPSCalculator from './FourPEPSCalculator';
import FourCMortalityCalculator from './FourCMortalityCalculator';
import FourTsHITCalculator from './FourTsHITCalculator';
import SixMinuteWalkCalculator from './SixMinuteWalkCalculator';
import AAPPedHypertensionCalculator from './AAPPedHypertensionCalculator';
// New calculators (batch 3)
import UISSCalculator from './UISSCalculator';
import CAPRACalculator from './CAPRACalculator';
import UCEISCalculator from './UCEISCalculator';
import UKELDCalculator from './UKELDCalculator';
import UrinaryProteinCalculator from './UrinaryProteinCalculator';
import UrineAnionGapCalculator from './UrineAnionGapCalculator';
import UrineOutputCalculator from './UrineOutputCalculator';
import TrueUrineOutputCalculator from './TrueUrineOutputCalculator';
import UASCalculator from './UASCalculator';
import CarbCounterCalculator from './CarbCounterCalculator';
// New calculators (batch 4)
import MallampatiScoreCalculator from './MallampatiScoreCalculator';
import SETNETCalculator from './SETNETCalculator';
import SepsisSETCalculator from './SepsisSETCalculator';
import MELDPELDCalculator from './MELDPELDCalculator';
// New calculators (batch 5)
import ASAClassificationCalculator from './ASAClassificationCalculator';
import TrueloveWittsCalculator from './TrueloveWittsCalculator';
import TrunkImpairmentScaleCalculator from './TrunkImpairmentScaleCalculator';
import BISAPScoreCalculator from './BISAPScoreCalculator';
import RansonCriteriaCalculator from './RansonCriteriaCalculator';
import GlasgowImrieCalculator from './GlasgowImrieCalculator';
// New calculators (batch 6)
import SCORTENCalculator from './SCORTENCalculator';
import SgarbossaCriteriaCalculator from './SgarbossaCriteriaCalculator';
import ShockIndexCalculator from './ShockIndexCalculator';
import SIPACalculator from './SIPACalculator';
import SMASTCalculator from './SMASTCalculator';
import ShapiroRuleCalculator from './ShapiroRuleCalculator';
// New calculators (batch 7)
import SEXSHOCKCalculator from './SEXSHOCKCalculator';
import ShanghaiScoreCalculator from './ShanghaiScoreCalculator';
import ShorrScoreCalculator from './ShorrScoreCalculator';
import SMASTGCalculator from './SMASTGCalculator';
// New calculators (batch 8)
import DILQTSCalculator from './DILQTSCalculator';
import PreoperativeEvaluationSummary from './PreoperativeEvaluationSummary';
// New calculators (batch 9)
import MFISCalculator from './MFISCalculator';
import SickleCellExchangeCalculator from './SickleCellExchangeCalculator';
import SimonBroomeCalculator from './SimonBroomeCalculator';
import SDAICalculator from './SDAICalculator';
import SAPS2Calculator from './SAPS2Calculator';
import SAPS3Calculator from './SAPS3Calculator';
import AIHScoreCalculator from './AIHScoreCalculator';
import FASTCalculator from './FASTCalculator';
import BEFASTCalculator from './BEFASTCalculator';
import ErrorsPreventedPrompt from '@/components/dashboard/ErrorsPreventedPrompt';

export const toolsBySystem = {
  neurological: {
    label: 'Neurological',
    icon: SpriteNeurologicalIcon,
    tools: [
      { id: 'gcs', name: 'GCS', fullName: 'Glasgow Coma Scale', component: GCSCalculator },
      { id: 'nihss', name: 'NIHSS', fullName: 'NIH Stroke Scale', component: NIHSSCalculator },
      { id: 'lams', name: 'LAMS', fullName: 'Los Angeles Motor Scale', component: LAMSCalculator },
      { id: 'slams', name: 'SLAMS', fullName: 'Stroke Severity Scale', component: SLAMSCalculator },
      { id: 'ich', name: 'ICH Score', fullName: 'Intracerebral Hemorrhage Score', component: ICHScoreCalculator },
      { id: 'hunthess', name: 'Hunt & Hess', fullName: 'Subarachnoid Hemorrhage Grade', component: HuntHessCalculator },
      { id: 'race', name: 'RACE', fullName: 'Rapid Arterial oCclusion Evaluation', component: RACECalculator },
      { id: 'mrs', name: 'mRS', fullName: 'Modified Rankin Scale', component: MRSCalculator },
      { id: 'abcd2', name: 'ABCD²', fullName: 'TIA Stroke Risk Score', component: ABCD2Calculator },
      { id: 'fisher', name: 'Fisher', fullName: 'Fisher Scale for SAH', component: FisherScaleCalculator },
      { id: 'menza', name: 'MMSE', fullName: 'Mini-Mental State Examination', component: MENZACalculator },
      { id: '2helps2b', name: '2HELPS2B', fullName: 'Seizure Risk in cEEG Patients', component: HELPS2BCalculator },
      { id: 'setnet', name: 'SET-NET', fullName: 'Stroke Emergency Triage Tool', component: SETNETCalculator },
      { id: 'tis', name: 'TIS', fullName: 'Trunk Impairment Scale', component: TrunkImpairmentScaleCalculator },
      { id: 'fast', name: 'FAST', fullName: 'Face Arms Speech Time', component: FASTCalculator },
      { id: 'befast', name: 'BE-FAST', fullName: 'Balance Eyes Face Arms Speech Time', component: BEFASTCalculator },
    ]
  },
  psychiatric: {
    label: 'Psychiatric',
    icon: SpritePsychiatricIcon,
    tools: [
      { id: 'phq9', name: 'PHQ-9', fullName: 'Depression Screening', component: PHQ9Calculator },
      { id: 'gad7', name: 'GAD-7', fullName: 'Anxiety Screening', component: GAD7Calculator },
      { id: 'cam', name: 'CAM', fullName: 'Confusion Assessment Method', component: CAMCalculator },
      { id: '4at', name: '4AT', fullName: '4 A\'s Test for Delirium', component: FourATCalculator },
      { id: 'ciwa', name: 'CIWA-Ar', fullName: 'Alcohol Withdrawal Scale', component: CIWAArCalculator },
      { id: 'cssrs', name: 'C-SSRS', fullName: 'Suicide Severity Rating Scale', component: CSSRSCalculator },
      { id: 'moca', name: 'MoCA', fullName: 'Montreal Cognitive Assessment', component: MoCACalculator },
      { id: 'smast', name: 'SMAST', fullName: 'Short Michigan Alcoholism Screening Test', component: SMASTCalculator },
      { id: 'smastg', name: 'SMAST-G', fullName: 'Geriatric Alcoholism Screening Test', component: SMASTGCalculator },
    ]
  },
  cardiovascular: {
    label: 'Cardiovascular',
    icon: SpriteCardiovascularIcon,
    tools: [
      { id: 'heart', name: 'HEART', fullName: 'Chest Pain Risk Score', component: HEARTScoreCalculator },
      { id: 'timi', name: 'TIMI', fullName: 'ACS Risk Score', component: TIMIScoreCalculator },
      { id: 'chads', name: 'CHADS₂-VASc', fullName: 'AF Stroke Risk Score', component: CHADS2VASCCalculator },
      { id: 'hasbled', name: 'HAS-BLED', fullName: 'Bleeding Risk Score', component: HASBLEDCalculator },
      { id: 'wells', name: 'Wells', fullName: 'DVT/PE Probability Score', component: WellsScoreCalculator },
      { id: '4peps', name: '4PEPS', fullName: '4-Level PE Probability Score', component: FourPEPSCalculator },
      { id: 'killip', name: 'Killip', fullName: 'Heart Failure Post-MI', component: KillipClassCalculator },
      { id: 'nyha', name: 'NYHA', fullName: 'Heart Failure Classification', component: NYHAClassCalculator },
      { id: 'rcri', name: 'RCRI', fullName: 'Perioperative Cardiac Risk', component: RCRICalculator },
      { id: 'framingham', name: 'Framingham', fullName: '10-Year CVD Risk', component: FraminghamRiskCalculator },
      { id: 'duke', name: 'Duke Criteria', fullName: 'Infective Endocarditis', component: DukeCriteriaCalculator },
      { id: 'grace', name: 'GRACE', fullName: 'ACS Mortality Risk', component: GRACEScoreCalculator },
      { id: 'map', name: 'MAP', fullName: 'Mean Arterial Pressure', component: MAPCalculator },
      { id: 'ascvd', name: 'ASCVD', fullName: '10-Year ASCVD Risk (2013)', component: ASCVDCalculator },
      { id: 'qtc', name: 'QTc', fullName: 'Corrected QT Interval', component: QTcCalculator },
      { id: 'prevent', name: 'PREVENT', fullName: '10/30-Year CVD Risk (AHA 2023)', component: PREVENTCalculator },
      { id: 'guptamica', name: 'Gupta MICA', fullName: 'Perioperative MI/Cardiac Arrest Risk', component: GuptaMICACalculator },
      { id: 'dasi', name: 'DASI', fullName: 'Duke Activity Status Index', component: DASICalculator },
      { id: 'perc', name: 'PERC', fullName: 'PE Rule-out Criteria', component: PERCRuleCalculator },
      { id: 'ldl', name: 'LDL', fullName: 'LDL Cholesterol (Friedewald)', component: LDLCalculator },
      { id: 'sgarbossa', name: 'Sgarbossa', fullName: 'MI Diagnosis in LBBB', component: SgarbossaCriteriaCalculator },
      { id: 'sexshock', name: 'SEX-SHOCK', fullName: 'Cardiogenic Shock Risk in ACS', component: SEXSHOCKCalculator },
      { id: 'shanghai', name: 'Shanghai Score', fullName: 'Brugada Syndrome Risk Stratification', component: ShanghaiScoreCalculator },
      { id: 'dilqts', name: 'DILQTS', fullName: 'Drug-Induced Long QT Syndrome Risk', component: DILQTSCalculator },
      { id: 'simonbroome', name: 'Simon Broome', fullName: 'Familial Hypercholesterolemia Criteria', component: SimonBroomeCalculator },
      { id: 'preop', name: 'Preop Summary', fullName: 'Combined RCRI + Gupta MICA + METs Report', component: PreoperativeEvaluationSummary },
    ]
  },
  respiratory: {
    label: 'Respiratory',
    icon: SpriteRespiratoryIcon,
    tools: [
      { id: 'curb65', name: 'CURB-65', fullName: 'Pneumonia Severity Score', component: CURB65Calculator },
      { id: 'aagradient', name: 'A-a Gradient', fullName: 'Alveolar-arterial O₂ Gradient', component: AaGradientCalculator },
      { id: 'bode', name: 'BODE Index', fullName: 'COPD Mortality Prediction', component: BODEIndexCalculator },
      { id: 'mmrc', name: 'mMRC', fullName: 'Dyspnea Scale', component: MMRCDyspneaCalculator },
      { id: 'psiport', name: 'PSI/PORT', fullName: 'Pneumonia Severity Index', component: PSIPortCalculator },
      { id: 'ariscat', name: 'ARISCAT', fullName: 'Postoperative Pulmonary Complications Risk', component: ARISCATCalculator },
      { id: 'stopbang', name: 'STOP-BANG', fullName: 'Obstructive Sleep Apnea Screening', component: STOPBANGCalculator },
      { id: 'abg', name: 'ABG', fullName: 'Arterial Blood Gas Interpreter', component: ABGCalculator },
      { id: 'mallampati', name: 'Mallampati', fullName: 'Airway Assessment Score', component: MallampatiScoreCalculator },
      { id: 'asa', name: 'ASA Class', fullName: 'ASA Physical Status Classification', component: ASAClassificationCalculator },
    ]
  },
  sepsis: {
    label: 'Sepsis & Infection',
    icon: SpriteSepsisIcon,
    tools: [
      { id: 'qsofa', name: 'qSOFA', fullName: 'Quick SOFA Score', component: QSOFACalculator },
      { id: 'sirs', name: 'SIRS', fullName: 'Systemic Inflammatory Response', component: SIRSCalculator },
      { id: 'sofa', name: 'SOFA', fullName: 'Sequential Organ Failure Assessment', component: SOFACalculator },
      { id: 'centor', name: 'Centor', fullName: 'Strep Pharyngitis Score (McIsaac)', component: CentorScoreCalculator },
      { id: '4c', name: '4C Score', fullName: '4C Mortality Score for COVID-19', component: FourCMortalityCalculator },
      { id: 'sepsiseset', name: 'Sepsis SET', fullName: 'Sepsis Screening & Education Tool', component: SepsisSETCalculator },
      { id: 'shapiro', name: 'Shapiro Rule', fullName: 'Blood Culture Decision Rule', component: ShapiroRuleCalculator },
      { id: 'shorr', name: 'Shorr Score', fullName: 'MRSA Pneumonia Risk Score', component: ShorrScoreCalculator },
    ]
  },
  critical: {
    label: 'Critical Care',
    icon: SpriteCriticalIcon,
    tools: [
      { id: 'apache', name: 'APACHE II', fullName: 'Acute Physiology Score', component: APACHEIICalculator },
      { id: 'saps2', name: 'SAPS II', fullName: 'Simplified Acute Physiology Score II', component: SAPS2Calculator },
      { id: 'saps3', name: 'SAPS 3', fullName: 'Simplified Acute Physiology Score 3', component: SAPS3Calculator },
      { id: 'cprmetronome', name: 'CPR Metronome', fullName: 'CPR Compression Timer', component: CPRMetronome },
      { id: 'aclsnarrator', name: 'ACLS Code Assist', fullName: 'Real-Time Code Guidance & Documentation', component: ACLSCodeNarrator },
      { id: 'shockindex', name: 'Shock Index', fullName: 'Occult Shock Indicator (HR/SBP)', component: ShockIndexCalculator },
      { id: 'scorten', name: 'SCORTEN', fullName: 'TEN/SJS Mortality Risk', component: SCORTENCalculator },
    ]
  },
  trauma: {
    label: 'Trauma',
    icon: SpriteTraumaIcon,
    tools: [
      { id: 'trauma', name: 'Trauma Scores', fullName: 'RTS, ISS, TRISS Calculator', component: TraumaScoresCalculator },
    ]
  },
  hematology: {
    label: 'Hematology',
    icon: SpriteHematologyIcon,
    tools: [
      { id: 'blood', name: 'Blood Type', fullName: 'Blood Compatibility Checker', component: BloodCompatibilityCalculator },
      { id: 'padua', name: 'Padua Score', fullName: 'VTE Risk in Medical Patients', component: PaduaScoreCalculator },
      { id: 'caprini', name: 'Caprini', fullName: 'Surgical VTE Risk Score (2005)', component: CapriniScoreCalculator },
      { id: '4ts', name: '4Ts HIT', fullName: '4Ts Score for Heparin-Induced Thrombocytopenia', component: FourTsHITCalculator },
      { id: 'sicklecell', name: 'Sickle Cell Exchange', fullName: 'RBC Exchange Volume Calculator', component: SickleCellExchangeCalculator },
    ]
  },
  pediatric: {
    label: 'Pediatric',
    icon: SpritePediatricIcon,
    tools: [
      { id: 'apgar', name: 'APGAR', fullName: 'Newborn Assessment', component: APGARCalculator },
      { id: 'pedsgcs', name: 'Peds GCS', fullName: 'Pediatric Glasgow Coma Scale', component: PediatricGCSCalculator },
      { id: 'pews', name: 'PEWS', fullName: 'Pediatric Early Warning Score', component: PEWSCalculator },
      { id: 'pedsdose', name: 'Peds Dosing', fullName: 'Weight-Based Dosage Calculator', component: PediatricDosageCalculator },
      { id: 'palsnarrator', name: 'PALS Narrator', fullName: 'Pediatric Code Real-Time Guidance', component: PALSCodeNarrator },
      { id: 'pedsresustape', name: 'Resus Tape', fullName: 'Pediatric Resuscitation Tape (Broselow)', component: PediatricResuscitationTape },
      { id: 'edd', name: 'EDD', fullName: 'Pregnancy Due Date Calculator', component: EDDCalculator },
      { id: 'pecarn', name: 'PECARN', fullName: 'Pediatric Head Injury Algorithm', component: PECARNCalculator },
      { id: 'maintenance', name: 'Maintenance Fluids', fullName: 'IV Fluids (4-2-1 Rule)', component: MaintenanceFluidsCalculator },
      { id: 'finnegan', name: 'Finnegan NAS', fullName: 'Neonatal Abstinence Scoring', component: FinneganNASCalculator },
      { id: 'aappeds', name: 'AAP Peds HTN', fullName: 'AAP Pediatric Hypertension Guidelines', component: AAPPedHypertensionCalculator },
      { id: 'sipa', name: 'SIPA', fullName: 'Pediatric Age-Adjusted Shock Index', component: SIPACalculator },
    ]
  },
  renal: {
    label: 'Renal',
    icon: SpriteRenalIcon,
    tools: [
      { id: 'ckdepi', name: 'CKD-EPI', fullName: 'eGFR Calculator (2021)', component: CKDEPICalculator },
      { id: 'akikdigo', name: 'KDIGO AKI', fullName: 'AKI Staging Criteria', component: AKIKDIGOCalculator },
      { id: 'cockcroftgault', name: 'Cockcroft-Gault', fullName: 'Creatinine Clearance', component: CockcroftGaultCalculator },
      { id: 'mdrd', name: 'MDRD', fullName: 'MDRD GFR Equation', component: MDRDCalculator },
      { id: 'calciumcorrection', name: 'Ca Correction', fullName: 'Calcium Correction for Albumin', component: CalciumCorrectionCalculator },
      { id: 'aniongap', name: 'Anion Gap', fullName: 'Serum Anion Gap Calculator', component: AnionGapCalculator },
      { id: 'osmolality', name: 'Osmolality', fullName: 'Serum Osmolality/Gap Calculator', component: OsmolalityCalculator },
      { id: 'fena', name: 'FENa', fullName: 'Fractional Excretion of Sodium', component: FENaCalculator },
      { id: 'freewaterdeficit', name: 'Free Water', fullName: 'Free Water Deficit in Hypernatremia', component: FreeWaterDeficitCalculator },
      { id: 'nacorrection', name: 'Na Correction', fullName: 'Sodium Correction for Hyperglycemia', component: SodiumCorrectionCalculator },
      { id: 'urinaryprotein', name: 'Urine PCR', fullName: 'Urinary Protein Excretion (PCR)', component: UrinaryProteinCalculator },
      { id: 'urineanion', name: 'Urine AG', fullName: 'Urine Anion Gap', component: UrineAnionGapCalculator },
    ]
  },
  oncology: {
    label: 'Oncology',
    icon: SpriteOncologyIcon,
    tools: [
      { id: 'ecog', name: 'ECOG', fullName: 'ECOG Performance Status', component: ECOGCalculator },
      { id: 'karnofsky', name: 'Karnofsky', fullName: 'Karnofsky Performance Status', component: KarnofskyCalculator },
      { id: 'g8', name: 'G8', fullName: 'G8 Geriatric Screening', component: G8ScreeningCalculator },
      { id: 'esas', name: 'ESAS', fullName: 'Edmonton Symptom Assessment', component: ESASCalculator },
      { id: 'pap', name: 'PaP', fullName: 'Palliative Prognostic Score', component: PaPScoreCalculator },
      { id: 'pps', name: 'PPS', fullName: 'Palliative Performance Scale', component: PPSCalculator },
      { id: 'uiss', name: 'UISS', fullName: 'UCLA Integrated Staging System (RCC)', component: UISSCalculator },
      { id: 'capra', name: 'CAPRA', fullName: 'UCSF-CAPRA Score (Prostate Cancer)', component: CAPRACalculator },
    ]
  },
  general: {
    label: 'General',
    icon: SpriteGeneralIcon,
    tools: [
      { id: 'bmi', name: 'BMI/BSA', fullName: 'Body Mass Index & Surface Area', component: BMICalculator },
      { id: 'ibw', name: 'IBW/ABW', fullName: 'Ideal & Adjusted Body Weight', component: IBWCalculator },
      { id: 'fib4', name: 'FIB-4', fullName: 'Liver Fibrosis Index', component: FIB4Calculator },
      { id: 'homair', name: 'HOMA-IR', fullName: 'Insulin Resistance Index', component: HOMAIRCalculator },
      { id: 'meldna', name: 'MELD-Na', fullName: 'End-Stage Liver Disease Score', component: MELDNaCalculator },
      { id: 'childpugh', name: 'Child-Pugh', fullName: 'Cirrhosis Severity Score', component: ChildPughCalculator },
      { id: 'steroid', name: 'Steroid Conversion', fullName: 'Glucocorticoid Dose Equivalencies', component: SteroidConversionCalculator },
      { id: 'mme', name: 'MME', fullName: 'Morphine Milligram Equivalents', component: MMECalculator },
      { id: '6mwd', name: '6MWD', fullName: '6-Minute Walk Distance', component: SixMinuteWalkCalculator },
      { id: 'ukeld', name: 'UKELD', fullName: 'UK Model for End-Stage Liver Disease', component: UKELDCalculator },
      { id: 'meldpeld', name: 'MELD-PELD', fullName: 'Liver Transplant Priority (Adult & Peds)', component: MELDPELDCalculator },
      { id: 'uceis', name: 'UCEIS', fullName: 'Ulcerative Colitis Endoscopic Index', component: UCEISCalculator },
      { id: 'truelovewitts', name: 'Truelove-Witts', fullName: 'Ulcerative Colitis Severity Index', component: TrueloveWittsCalculator },
      { id: 'bisap', name: 'BISAP', fullName: 'Acute Pancreatitis Severity Score', component: BISAPScoreCalculator },
      { id: 'ranson', name: 'Ranson', fullName: 'Ranson Criteria for Pancreatitis', component: RansonCriteriaCalculator },
      { id: 'glasgowimrie', name: 'Glasgow-Imrie', fullName: 'Glasgow-Imrie Score for Pancreatitis', component: GlasgowImrieCalculator },
      { id: 'uas', name: 'UAS', fullName: 'Urticaria Activity Score', component: UASCalculator },
      { id: 'aih', name: 'AIH Score', fullName: 'Simplified Autoimmune Hepatitis Score', component: AIHScoreCalculator },
      { id: 'sdai', name: 'SDAI', fullName: 'Simple Disease Activity Index (RA)', component: SDAICalculator },
      { id: 'mfis', name: 'MFIS', fullName: 'Modified Fatigue Impact Scale', component: MFISCalculator },
    ]
  },
  nursing: {
    label: 'Nursing Assessments',
    icon: SpriteNursingIcon,
    tools: [
      { id: 'braden', name: 'Braden Scale', fullName: 'Pressure Injury Risk Assessment', component: BradenScaleCalculator },
      { id: 'morse', name: 'Morse Fall', fullName: 'Fall Risk Assessment', component: MorseFallScaleCalculator },
      { id: 'news2', name: 'NEWS2', fullName: 'National Early Warning Score 2', component: NEWS2Calculator },
      { id: 'rass', name: 'RASS', fullName: 'Richmond Agitation-Sedation Scale', component: RASSCalculator },
      { id: 'cows', name: 'COWS', fullName: 'Clinical Opiate Withdrawal Scale', component: COWSCalculator },
      { id: 'flacc', name: 'FLACC', fullName: 'Pediatric Pain Assessment', component: FLACCScaleCalculator },
      { id: 'ivdrip', name: 'IV Drip Rate', fullName: 'IV Infusion Calculator (gtt/min)', component: IVDripRateCalculator },
      { id: 'aldrete', name: 'Aldrete', fullName: 'Post-Anesthesia Recovery Score', component: AldreteScoreCalculator },
      { id: 'cpot', name: 'CPOT', fullName: 'Critical-Care Pain Observation Tool', component: CPOTCalculator },
      { id: 'painad', name: 'PAINAD', fullName: 'Pain Assessment in Advanced Dementia', component: PAINADCalculator },
      { id: 'wongbaker', name: 'Wong-Baker FACES', fullName: 'Self-Report Pain Scale', component: WongBakerFacesCalculator },
      { id: 'camicu', name: 'CAM-ICU', fullName: 'ICU Delirium Screening', component: CAMICUCalculator },
      { id: 'must', name: 'MUST', fullName: 'Malnutrition Screening Tool', component: MUSTCalculator },
      { id: 'intakeoutput', name: 'I/O Calculator', fullName: 'Intake & Output Tracker', component: IntakeOutputCalculator },
      { id: 'urineoutput', name: 'Urine Output', fullName: 'Urine Output & Fluid Balance (24hr)', component: UrineOutputCalculator },
      { id: 'trueurineoutput', name: 'True UO (CBI)', fullName: 'True Urine Output with Bladder Irrigation', component: TrueUrineOutputCalculator },
      { id: 'tubefeeding', name: 'Tube Feeding', fullName: 'Enteral Nutrition Rate Calculator', component: TubeFeedingCalculator },
      { id: 'carbcounter', name: 'Carb Counter', fullName: 'Carbohydrate Counter for Meal Planning', component: CarbCounterCalculator },
      { id: 'nrs', name: 'NRS', fullName: 'Numeric Pain Rating Scale (0-10)', component: NRSCalculator },
      { id: 'vas', name: 'VAS', fullName: 'Visual Analog Scale (0-100mm)', component: VASCalculator },
      { id: 'eat10', name: 'EAT-10', fullName: 'Eating Assessment Tool (Dysphagia)', component: EAT10Calculator },
      { id: 'guss', name: 'GUSS', fullName: 'Gugging Swallowing Screen', component: GUSSCalculator },
      { id: 'yaleswallow', name: 'Yale Swallow', fullName: 'Yale Swallow Protocol', component: YaleSwallowCalculator },
      { id: 'waterswallow', name: '3-oz Water Test', fullName: 'Burke Water Swallow Test', component: WaterSwallowTestCalculator },
      { id: 'torbsst', name: 'TOR-BSST', fullName: 'Toronto Bedside Swallowing Screen', component: TORBSSTCalculator },
      { id: 'masa', name: 'MASA', fullName: 'Mann Assessment of Swallowing Ability', component: MASACalculator },
      { id: 'fois', name: 'FOIS', fullName: 'Functional Oral Intake Scale', component: FOISCalculator },
      { id: 'pas', name: 'PAS', fullName: 'Penetration-Aspiration Scale', component: PASCalculator },
      { id: 'iddsi', name: 'IDDSI', fullName: 'Diet Texture Framework Reference', component: IDDSIReferenceChart },
    ]
  },
  obstetrics: {
    label: 'Obstetrics & Gynecology',
    icon: SpriteObGynIcon,
    tools: [
      { id: 'gestationalage', name: 'Gestational Age', fullName: 'GA & EDD Calculator', component: GestationalAgeCalculator },
      { id: 'efw', name: 'Fetal Weight', fullName: 'EFW Hadlock Formula', component: FetalWeightCalculator },
      { id: 'ovulation', name: 'Ovulation Calendar', fullName: 'Fertility & Ovulation Tracker', component: OvulationCalendar },
      { id: 'contraction', name: 'Contraction Timer', fullName: 'Labor Contraction Tracker', component: ContractionTimer },
      { id: 'kickcounter', name: 'Kick Counter', fullName: 'Fetal Movement Tracker', component: KickCounter },
      { id: 'bishop', name: 'Bishop Score', fullName: 'Cervical Readiness for Induction', component: BishopScoreCalculator },
      { id: 'bpp', name: 'BPP', fullName: 'Biophysical Profile (Fetal Wellbeing)', component: BiophysicalProfileCalculator },
      { id: 'preeclampsia', name: 'Preeclampsia Risk', fullName: 'Aspirin Prophylaxis Criteria', component: PreeclampsiaRiskCalculator },
      { id: 'gbs', name: 'GBS Prophylaxis', fullName: 'Intrapartum Antibiotic Criteria', component: GBSProphylaxisCalculator },
      { id: 'vbac', name: 'VBAC', fullName: 'TOLAC Success Calculator', component: VBACCalculator },
      { id: 'pph', name: 'PPH Risk', fullName: 'Postpartum Hemorrhage Risk Assessment', component: PPHRiskCalculator },
    ]
  },
};

// Flatten all tools for search
const allTools = Object.entries(toolsBySystem).flatMap(([systemKey, system]) =>
  system.tools.map(tool => ({ ...tool, system: systemKey, systemLabel: system.label }))
);

const ClinicalToolsHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | null>(searchParams.get('tool'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('all');
  const [visibleToolIds, setVisibleToolIds] = useState<Set<string> | null>(null);
  const { feedback, triggerFeedback, closeFeedback } = useErrorsPreventedFeedback();
  const { favorites, toggleFavorite, isFavorite, canAddMore, maxFavorites } = useFavoriteTools();
  const { toast } = useToast();

  // Handle URL parameter for deep linking from dashboard
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    if (toolParam && allTools.find(t => t.id === toolParam)) {
      setActiveTab(toolParam);
    }
  }, [searchParams]);

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('toolbox-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch tool visibility settings from database
  useEffect(() => {
    const fetchToolSettings = async () => {
      const { data, error } = await supabase
        .from('clinical_tool_settings')
        .select('tool_id, is_visible');
      
      if (!error && data) {
        const visibleIds = new Set(
          data.filter(t => t.is_visible).map(t => t.tool_id)
        );
        setVisibleToolIds(visibleIds);
      } else {
        // If fetch fails, show all tools
        setVisibleToolIds(new Set(allTools.map(t => t.id)));
      }
    };

    fetchToolSettings();
  }, []);

  // Filter tools based on search, selected system, and visibility
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSystem = selectedSystem === 'all' || tool.system === selectedSystem;
      const isVisible = visibleToolIds === null || visibleToolIds.has(tool.id);
      return matchesSearch && matchesSystem && isVisible;
    });
  }, [searchQuery, selectedSystem, visibleToolIds]);

  // Group filtered tools by system
  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof filteredTools> = {};
    filteredTools.forEach(tool => {
      if (!groups[tool.system]) {
        groups[tool.system] = [];
      }
      groups[tool.system].push(tool);
    });
    return groups;
  }, [filteredTools]);

  const handleToolSelect = (toolId: string) => {
    setActiveTab(toolId);
    setSearchParams({ tool: toolId });
  };

  const handleBack = () => {
    triggerFeedback('clinical_tool');
    setActiveTab(null);
    setSearchParams({});
  };

  const handleToggleFavorite = async (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    const result = await toggleFavorite(toolId);
    
    if (!result.success) {
      toast({
        title: "Cannot add favorite",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: result.action === 'added' ? "Added to favorites" : "Removed from favorites",
        description: result.action === 'added' 
          ? "Tool added to your dashboard Quick Access" 
          : "Tool removed from Quick Access",
      });
    }
  };

  // Find the active tool's component
  const activeTool = activeTab ? allTools.find(t => t.id === activeTab) : null;
  const ActiveComponent = activeTool?.component;

  // Total tool count
  const totalToolCount = allTools.filter(t => visibleToolIds === null || visibleToolIds.has(t.id)).length;

  return (
    <div className="space-y-6">
      {activeTab && ActiveComponent ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to all tools
            </button>
          </div>
          <ActiveComponent />
        </div>
      ) : (
        <>
          {/* Sticky Search Bar */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 -mt-1 pt-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="toolbox-search"
                placeholder="Search by name, scale, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-28 h-11 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground/60 bg-muted/50 border border-border/40 rounded-md px-1.5 py-0.5 tabular-nums">
                  {totalToolCount} tools
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground/60 bg-muted/50 border border-border/40 rounded-md">
                  {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}K
                </kbd>
              </div>
            </div>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-2">
                {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {/* System Sidebar + Grid Layout */}
          <div className="flex gap-6">
            {/* Left: System Navigation — Desktop */}
            <nav className="hidden md:flex flex-col gap-px w-44 flex-shrink-0 sticky top-16 self-start max-h-[calc(100vh-5rem)] overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedSystem('all')}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-300 text-left ${
                  selectedSystem === 'all'
                    ? 'bg-crimson text-white shadow-md'
                    : 'text-muted-foreground hover:bg-crimson hover:text-white hover:shadow-sm'
                }`}
              >
                <SpriteAllSystemsIcon className="w-4 h-4 flex-shrink-0" />
                All Systems
              </button>
              {Object.entries(toolsBySystem).sort(([, a], [, b]) => a.label.localeCompare(b.label)).map(([key, system]) => {
                const Icon = system.icon;
                const count = system.tools.filter(t => visibleToolIds === null || visibleToolIds.has(t.id)).length;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedSystem(key);
                      const el = document.getElementById(`system-${key}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-300 text-left group ${
                      selectedSystem === key
                        ? 'bg-crimson text-white shadow-md'
                        : 'text-muted-foreground hover:bg-crimson hover:text-white hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate flex-1">{system.label}</span>
                    <span className={`text-[11px] tabular-nums ${
                      selectedSystem === key ? 'text-white/70' : 'text-muted-foreground/40 group-hover:text-white/70'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile: Jump-to Dropdown */}
            <div className="md:hidden w-full">
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border/60 bg-muted/30 text-sm font-medium text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="all">All Systems ({totalToolCount})</option>
                {Object.entries(toolsBySystem).sort(([, a], [, b]) => a.label.localeCompare(b.label)).map(([key, system]) => {
                  const count = system.tools.filter(t => visibleToolIds === null || visibleToolIds.has(t.id)).length;
                  return (
                    <option key={key} value={key}>{system.label} ({count})</option>
                  );
                })}
              </select>
            </div>

            {/* Right: Tool Grid */}
            <div className="flex-1 min-w-0">
              {filteredTools.length === 0 ? (
                <Card className="py-16 border-border/50 shadow-soft rounded-2xl">
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="font-medium text-foreground">No tools found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedTools).sort(([keyA], [keyB]) => {
                    const labelA = toolsBySystem[keyA as keyof typeof toolsBySystem]?.label || keyA;
                    const labelB = toolsBySystem[keyB as keyof typeof toolsBySystem]?.label || keyB;
                    return labelA.localeCompare(labelB);
                  }).map(([systemKey, tools]) => {
                    const system = toolsBySystem[systemKey as keyof typeof toolsBySystem];
                    const Icon = system.icon;
                    
                    return (
                      <div key={systemKey} id={`system-${systemKey}`} className="space-y-2.5 scroll-mt-20">
                        {/* System Header */}
                        <div className="flex items-center gap-2.5 bg-muted/40 rounded-lg px-3 py-2">
                          <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                          <h2 className="text-sm font-semibold text-foreground">{system.label}</h2>
                          <span className="text-[11px] text-muted-foreground tabular-nums ml-auto">{tools.length}</span>
                        </div>
                        
                        {/* Tools Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5">
                          {[...tools].sort((a, b) => a.name.localeCompare(b.name)).map((tool) => {
                            const isFav = isFavorite(tool.id);
                            return (
                              <button
                                key={tool.id}
                                onClick={() => handleToolSelect(tool.id)}
                                className="flex flex-col items-center justify-center gap-1 p-2 aspect-square rounded-lg border border-border/40 bg-card hover:border-primary/30 hover:bg-accent/30 transition-all duration-150 cursor-pointer group relative text-center"
                              >
                                {/* Abbreviation */}
                                <span className="text-sm font-bold text-primary">{tool.name}</span>
                                {/* Full Name */}
                                <span className="text-[11px] text-muted-foreground leading-tight line-clamp-2 text-center">{tool.fullName}</span>
                                {/* Favorite */}
                                <span
                                  onClick={(e) => handleToggleFavorite(e, tool.id)}
                                  className={`absolute top-1.5 right-1.5 p-1 rounded-md transition-all shrink-0 ${
                                    isFav 
                                      ? 'text-warning' 
                                      : 'text-muted-foreground/20 opacity-0 group-hover:opacity-100 hover:text-foreground'
                                  }`}
                                  title={isFav ? 'Remove from favorites' : canAddMore ? 'Add to favorites' : `Max ${maxFavorites} favorites`}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Errors Prevented Feedback */}
      {feedback && (
        <ErrorsPreventedPrompt
          interactionType={feedback.interactionType}
          toolId={feedback.toolId}
          onClose={closeFeedback}
        />
      )}
    </div>
  );
};

export default ClinicalToolsHub;
