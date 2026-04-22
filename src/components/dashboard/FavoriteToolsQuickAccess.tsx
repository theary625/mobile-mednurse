import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Wrench, Brain, Wind, Thermometer, ShieldAlert, Ambulance, Droplet, Baby, Beaker, Ribbon, Smile } from 'lucide-react';
import { BrandHeartIcon } from '@/components/icons/MedicalSystemIcons';
import { useFavoriteTools } from '@/hooks/useFavoriteTools';

// Tool metadata for display
const toolMetadata: Record<string, { name: string; fullName: string; system: string }> = {
  gcs: { name: 'GCS', fullName: 'Glasgow Coma Scale', system: 'neurological' },
  nihss: { name: 'NIHSS', fullName: 'NIH Stroke Scale', system: 'neurological' },
  lams: { name: 'LAMS', fullName: 'Los Angeles Motor Scale', system: 'neurological' },
  slams: { name: 'SLAMS', fullName: 'Stroke Severity Scale', system: 'neurological' },
  ich: { name: 'ICH Score', fullName: 'Intracerebral Hemorrhage Score', system: 'neurological' },
  hunthess: { name: 'Hunt & Hess', fullName: 'Subarachnoid Hemorrhage Grade', system: 'neurological' },
  race: { name: 'RACE', fullName: 'Rapid Arterial oCclusion Evaluation', system: 'neurological' },
  mrs: { name: 'mRS', fullName: 'Modified Rankin Scale', system: 'neurological' },
  abcd2: { name: 'ABCD²', fullName: 'TIA Stroke Risk Score', system: 'neurological' },
  fisher: { name: 'Fisher', fullName: 'Fisher Scale for SAH', system: 'neurological' },
  menza: { name: 'MMSE', fullName: 'Mini-Mental State Examination', system: 'neurological' },
  phq9: { name: 'PHQ-9', fullName: 'Depression Screening', system: 'psychiatric' },
  gad7: { name: 'GAD-7', fullName: 'Anxiety Screening', system: 'psychiatric' },
  cam: { name: 'CAM', fullName: 'Confusion Assessment Method', system: 'psychiatric' },
  ciwa: { name: 'CIWA-Ar', fullName: 'Alcohol Withdrawal Scale', system: 'psychiatric' },
  cssrs: { name: 'C-SSRS', fullName: 'Suicide Severity Rating Scale', system: 'psychiatric' },
  moca: { name: 'MoCA', fullName: 'Montreal Cognitive Assessment', system: 'psychiatric' },
  heart: { name: 'HEART', fullName: 'Chest Pain Risk Score', system: 'cardiovascular' },
  timi: { name: 'TIMI', fullName: 'ACS Risk Score', system: 'cardiovascular' },
  chads: { name: 'CHADS₂-VASc', fullName: 'AF Stroke Risk Score', system: 'cardiovascular' },
  hasbled: { name: 'HAS-BLED', fullName: 'Bleeding Risk Score', system: 'cardiovascular' },
  wells: { name: 'Wells', fullName: 'DVT/PE Probability Score', system: 'cardiovascular' },
  killip: { name: 'Killip', fullName: 'Heart Failure Post-MI', system: 'cardiovascular' },
  nyha: { name: 'NYHA', fullName: 'Heart Failure Classification', system: 'cardiovascular' },
  rcri: { name: 'RCRI', fullName: 'Perioperative Cardiac Risk', system: 'cardiovascular' },
  framingham: { name: 'Framingham', fullName: '10-Year CVD Risk', system: 'cardiovascular' },
  duke: { name: 'Duke Criteria', fullName: 'Infective Endocarditis', system: 'cardiovascular' },
  grace: { name: 'GRACE', fullName: 'ACS Mortality Risk', system: 'cardiovascular' },
  curb65: { name: 'CURB-65', fullName: 'Pneumonia Severity Score', system: 'respiratory' },
  aagradient: { name: 'A-a Gradient', fullName: 'Alveolar-arterial O₂ Gradient', system: 'respiratory' },
  bode: { name: 'BODE Index', fullName: 'COPD Mortality Prediction', system: 'respiratory' },
  mmrc: { name: 'mMRC', fullName: 'Dyspnea Scale', system: 'respiratory' },
  qsofa: { name: 'qSOFA', fullName: 'Quick SOFA Score', system: 'sepsis' },
  sirs: { name: 'SIRS', fullName: 'Systemic Inflammatory Response', system: 'sepsis' },
  sofa: { name: 'SOFA', fullName: 'Sequential Organ Failure Assessment', system: 'sepsis' },
  apache: { name: 'APACHE II', fullName: 'Acute Physiology Score', system: 'critical' },
  cprmetronome: { name: 'CPR Metronome', fullName: 'CPR Compression Timer', system: 'critical' },
  aclsnarrator: { name: 'ACLS Code Assist', fullName: 'Real-Time Code Guidance & Documentation', system: 'critical' },
  trauma: { name: 'Trauma Scores', fullName: 'RTS, ISS, TRISS Calculator', system: 'trauma' },
  blood: { name: 'Blood Type', fullName: 'Blood Compatibility Checker', system: 'hematology' },
  apgar: { name: 'APGAR', fullName: 'Newborn Assessment', system: 'pediatric' },
  pedsgcs: { name: 'Peds GCS', fullName: 'Pediatric Glasgow Coma Scale', system: 'pediatric' },
  pews: { name: 'PEWS', fullName: 'Pediatric Early Warning Score', system: 'pediatric' },
  pedsdose: { name: 'Peds Dosing', fullName: 'Weight-Based Dosage Calculator', system: 'pediatric' },
  ckdepi: { name: 'CKD-EPI', fullName: 'eGFR Calculator (2021)', system: 'renal' },
  akikdigo: { name: 'KDIGO AKI', fullName: 'AKI Staging Criteria', system: 'renal' },
  cockcroftgault: { name: 'Cockcroft-Gault', fullName: 'Creatinine Clearance', system: 'renal' },
  ecog: { name: 'ECOG', fullName: 'ECOG Performance Status', system: 'oncology' },
  karnofsky: { name: 'Karnofsky', fullName: 'Karnofsky Performance Status', system: 'oncology' },
  g8: { name: 'G8', fullName: 'G8 Geriatric Screening', system: 'oncology' },
  esas: { name: 'ESAS', fullName: 'Edmonton Symptom Assessment', system: 'oncology' },
  pap: { name: 'PaP', fullName: 'Palliative Prognostic Score', system: 'oncology' },
  pps: { name: 'PPS', fullName: 'Palliative Performance Scale', system: 'oncology' },
};

const systemIcons: Record<string, React.ElementType> = {
  neurological: Brain,
  psychiatric: Smile,
  cardiovascular: BrandHeartIcon,
  respiratory: Wind,
  sepsis: Thermometer,
  critical: ShieldAlert,
  trauma: Ambulance,
  hematology: Droplet,
  pediatric: Baby,
  renal: Beaker,
  oncology: Ribbon,
};

const FavoriteToolsQuickAccess = () => {
  const { favorites, loading } = useFavoriteTools();

  if (loading) return null;
  if (favorites.length === 0) return null;

  return (
    <section className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-warning fill-current" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Access Tools
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {favorites.map((toolId) => {
          const tool = toolMetadata[toolId];
          if (!tool) return null;
          
          const Icon = systemIcons[tool.system] || Wrench;
          
          return (
            <Link
              key={toolId}
              to={`/dashboard/toolbox?tool=${toolId}`}
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{tool.name}</p>
                <p className="text-xs text-muted-foreground truncate">{tool.fullName}</p>
              </div>
              <Star className="w-4 h-4 text-warning fill-current flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FavoriteToolsQuickAccess;
