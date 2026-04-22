import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, AlertTriangle, Info, Scale, Droplet, Baby, FlaskConical, Wind, Siren, Syringe, HeartPulse, ChevronDown, Activity, Pill, Search, Clock, Zap, ShieldCheck } from 'lucide-react';
import { CalculatorIcon, LungsIcon } from '@/components/icons/MedicalSystemIcons';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ClinicianProfile } from '@/types/clinical';
import { useErrorsPreventedFeedback } from '@/hooks/useErrorsPreventedFeedback';
import ErrorsPreventedPrompt from '@/components/dashboard/ErrorsPreventedPrompt';
import TPACalculator from '@/components/calculators/TPACalculator';
import TNKCalculator from '@/components/calculators/TNKCalculator';
import DoorToNeedleCalculator from '@/components/calculators/DoorToNeedleCalculator';
import BleedingRiskCalculator from '@/components/calculators/BleedingRiskCalculator';
import PostThrombolyticBPCalculator from '@/components/calculators/PostThrombolyticBPCalculator';
import BasalInsulinCalculator from '@/components/calculators/BasalInsulinCalculator';
import BolusInsulinCalculator from '@/components/calculators/BolusInsulinCalculator';
import CorrectionFactorCalculator from '@/components/calculators/CorrectionFactorCalculator';
import SlidingScaleCalculator from '@/components/calculators/SlidingScaleCalculator';
import InsulinDripTransitionCalculator from '@/components/calculators/InsulinDripTransitionCalculator';
import HeparinCalculator from '@/components/calculators/HeparinCalculator';
import APTTTitrationCalculator from '@/components/calculators/APTTTitrationCalculator';
import WarfarinCalculator from '@/components/calculators/WarfarinCalculator';
import DOACRenalCalculator from '@/components/calculators/DOACRenalCalculator';
import BleedingRiskScoreCalculator from '@/components/calculators/BleedingRiskScoreCalculator';
import TylenolCalculator from '@/components/calculators/TylenolCalculator';
import MotrinCalculator from '@/components/calculators/MotrinCalculator';
import LevophedCalculator from '@/components/calculators/LevophedCalculator';
import TemperatureConverter from '@/components/calculators/TemperatureConverter';
import BMICalculator from '@/components/calculators/BMICalculator';
import WeightConverter from '@/components/calculators/WeightConverter';
import DepoCalculator from '@/components/calculators/DepoCalculator';
import BishopScoreCalculator from '@/components/calculators/BishopScoreCalculator';
import EDDCalculator from '@/components/calculators/EDDCalculator';
import MagnesiumSulfateOBCalculator from '@/components/calculators/MagnesiumSulfateOBCalculator';
import OxytocinCalculator from '@/components/calculators/OxytocinCalculator';

interface CalculatePageProps {
  profile: ClinicianProfile | null;
}

type SafetyLevel = 'safe' | 'caution' | 'unsafe' | null;

interface CalculatorItem {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType | null;
}

interface CalculatorCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  calculators: CalculatorItem[];
}

// Sidebar Item Component
const SidebarItem = ({
  title,
  subtitle,
  active,
  last,
  onClick
}: {
  title: string;
  subtitle?: string;
  active?: boolean;
  last?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full px-4 py-3 text-left transition hover:bg-muted ${
        !last ? 'border-b border-border' : ''
      } ${active ? 'bg-navy/5 dark:bg-navy/10' : 'bg-transparent'}`}
    >
      {active && (
        <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-navy dark:bg-primary" />
      )}
      <div className="pl-2">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {subtitle && (
          <div className="mt-0.5 text-sm text-muted-foreground">{subtitle}</div>
        )}
      </div>
    </button>
  );
};

// Quick Start Card Component
const QuickCard = ({
  title,
  subtitle,
  icon,
  onClick
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-border/80 hover:shadow focus:outline-none focus:ring-2 focus:ring-navy/20 dark:focus:ring-primary/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-muted transition group-hover:bg-muted/80">
          {icon}
        </span>
      </div>
    </button>
  );
};

const CalculatePage = ({ profile }: CalculatePageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('emergency');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Check if we're in direct calculator mode (from medication page)
  const directCalcMode = searchParams.get('calc');

  // Define calculator categories
  const categories: CalculatorCategory[] = useMemo(() => [
    {
      id: 'emergency',
      name: 'Emergency & Stroke',
      icon: <Siren className="w-4 h-4" />,
      color: 'text-crimson',
      calculators: [
        { id: 'tpa', name: 'tPA Calculator', description: 'Alteplase dosing for stroke', component: TPACalculator },
        { id: 'tnk', name: 'TNK Calculator', description: 'Tenecteplase dosing', component: TNKCalculator },
        { id: 'door-to-needle', name: 'Door-to-Needle Timer', description: 'Thrombolysis timing', component: DoorToNeedleCalculator },
        { id: 'post-thrombolytic-bp', name: 'Post-Thrombolytic BP', description: 'BP management post-tPA', component: PostThrombolyticBPCalculator },
        { id: 'bleeding-risk', name: 'Bleeding Risk Assessment', description: 'Thrombolytic contraindications', component: BleedingRiskCalculator },
      ]
    },
    {
      id: 'insulin',
      name: 'Insulin & Diabetes',
      icon: <Syringe className="w-4 h-4" />,
      color: 'text-blue-600 dark:text-blue-400',
      calculators: [
        { id: 'basal-insulin', name: 'Basal Insulin', description: 'Starting basal dose', component: BasalInsulinCalculator },
        { id: 'bolus-insulin', name: 'Bolus Insulin', description: 'Mealtime insulin dosing', component: BolusInsulinCalculator },
        { id: 'correction-factor', name: 'Correction Factor', description: 'ISF & I:C ratio', component: CorrectionFactorCalculator },
        { id: 'sliding-scale', name: 'Sliding Scale', description: 'Generate sliding scale', component: SlidingScaleCalculator },
        { id: 'insulin-drip-transition', name: 'IV to SQ Transition', description: 'Drip transition dosing', component: InsulinDripTransitionCalculator },
      ]
    },
    {
      id: 'anticoag',
      name: 'Anticoagulation',
      icon: <HeartPulse className="w-4 h-4" />,
      color: 'text-red-600 dark:text-red-400',
      calculators: [
        { id: 'heparin', name: 'Heparin Calculator', description: 'Weight-based heparin', component: HeparinCalculator },
        { id: 'aptt-titration', name: 'aPTT Titration', description: 'Heparin dose adjustment', component: APTTTitrationCalculator },
        { id: 'warfarin', name: 'Warfarin Dosing', description: 'INR-based adjustments', component: WarfarinCalculator },
        { id: 'doac-renal', name: 'DOAC Renal Dosing', description: 'CrCl-based DOAC dosing', component: DOACRenalCalculator },
        { id: 'bleeding-risk-score', name: 'HAS-BLED Score', description: 'Bleeding risk assessment', component: BleedingRiskScoreCalculator },
      ]
    },
    {
      id: 'critical-care',
      name: 'Critical Care',
      icon: <Siren className="w-4 h-4" />,
      color: 'text-red-700 dark:text-red-400',
      calculators: [
        { id: 'levophed', name: 'Levophed (Norepinephrine)', description: 'Vasopressor dosing', component: LevophedCalculator },
      ]
    },
    {
      id: 'dosing',
      name: 'General Dosing',
      icon: <Pill className="w-4 h-4" />,
      color: 'text-navy dark:text-primary',
      calculators: [
        { id: 'weight-based', name: 'Weight-Based Dosing', description: 'mg/kg calculations', component: null },
        { id: 'pediatric', name: 'Pediatric Dose', description: "Clark's Rule", component: null },
        { id: 'tylenol', name: 'Tylenol (Acetaminophen)', description: 'Pain & fever dosing', component: TylenolCalculator },
        { id: 'motrin', name: 'Motrin (Ibuprofen)', description: 'NSAID dosing', component: MotrinCalculator },
        { id: 'temperature', name: 'Temperature Converter', description: '°F ↔ °C conversion', component: TemperatureConverter },
        { id: 'weight-converter', name: 'Weight Converter', description: 'lbs ↔ kg conversion', component: WeightConverter },
      ]
    },
    {
      id: 'renal',
      name: 'Renal Function',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-info',
      calculators: [
        { id: 'crcl', name: 'Creatinine Clearance', description: 'Cockcroft-Gault', component: null },
      ]
    },
    {
      id: 'body',
      name: 'Body Metrics',
      icon: <Scale className="w-4 h-4" />,
      color: 'text-success',
      calculators: [
        { id: 'bsa', name: 'Body Surface Area', description: 'Mosteller formula', component: null },
        { id: 'ibw-abw', name: 'IBW / ABW', description: 'Ideal & Adjusted weight', component: null },
        { id: 'bmi', name: 'BMI Calculator', description: 'Body Mass Index', component: BMICalculator },
      ]
    },
    {
      id: 'iv',
      name: 'IV Rates',
      icon: <Droplet className="w-4 h-4" />,
      color: 'text-info',
      calculators: [
        { id: 'drip-rate', name: 'IV Drip Rate', description: 'mL/hr and gtts/min', component: null },
      ]
    },
    {
      id: 'labs',
      name: 'Lab Corrections',
      icon: <FlaskConical className="w-4 h-4" />,
      color: 'text-destructive',
      calculators: [
        { id: 'corrected-calcium', name: 'Corrected Calcium', description: 'Albumin adjustment', component: null },
      ]
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      icon: <LungsIcon size={16} className="w-4 h-4" />,
      color: 'text-accent',
      calculators: [
        { id: 'aa-gradient', name: 'A-a Gradient', description: 'Alveolar-arterial O₂', component: null },
      ]
    },
    {
      id: 'obgyn',
      name: 'OB/GYN',
      icon: <Baby className="w-4 h-4" />,
      color: 'text-pink-600',
      calculators: [
        { id: 'edd', name: 'EDD Calculator', description: 'Estimated due date & gestational age', component: EDDCalculator },
        { id: 'bishop-score', name: 'Bishop Score', description: 'Cervical readiness assessment', component: BishopScoreCalculator },
        { id: 'depo', name: 'Depo-Provera Calculator', description: 'Injection scheduling & grace periods', component: DepoCalculator },
        { id: 'oxytocin', name: 'Oxytocin Calculator', description: 'Labor induction & PPH protocols', component: OxytocinCalculator },
        { id: 'mag-sulfate-ob', name: 'Magnesium Sulfate (OB)', description: 'Preeclampsia & fetal neuroprotection', component: MagnesiumSulfateOBCalculator },
      ]
    },
  ], []);

  // Find calculator info for direct mode
  const directCalcInfo = useMemo(() => {
    if (!directCalcMode) return null;
    for (const category of categories) {
      const calc = category.calculators.find(c => c.id === directCalcMode);
      if (calc && calc.component) {
        return { calc, category };
      }
    }
    return null;
  }, [directCalcMode, categories]);

  // Handle calc query parameter
  useEffect(() => {
    const calcParam = searchParams.get('calc');
    if (calcParam && !directCalcInfo) {
      for (const category of categories) {
        const calc = category.calculators.find(c => c.id === calcParam);
        if (calc) {
          setExpandedCategory(category.id);
          setSelectedCalculator(calcParam);
          setSearchParams({}, { replace: true });
          break;
        }
      }
    }
  }, [searchParams, categories, setSearchParams, directCalcInfo]);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Calculator State (preserved from original)
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState(profile?.preferred_units === 'imperial' ? 'lb' : 'kg');
  const [dosePerKg, setDosePerKg] = useState('');
  const [frequency, setFrequency] = useState('');
  const [calculatedDose, setCalculatedDose] = useState<number | null>(null);
  const [safetyLevel, setSafetyLevel] = useState<SafetyLevel>(null);
  const [age, setAge] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sex, setSex] = useState('male');
  const [crcl, setCrcl] = useState<number | null>(null);
  const [bsaHeight, setBsaHeight] = useState('');
  const [bsaWeight, setBsaWeight] = useState('');
  const [bsa, setBsa] = useState<number | null>(null);
  const [ibwHeight, setIbwHeight] = useState('');
  const [ibwSex, setIbwSex] = useState('male');
  const [ibw, setIbw] = useState<number | null>(null);
  const [abw, setAbw] = useState<number | null>(null);
  const [dripVolume, setDripVolume] = useState('');
  const [dripTime, setDripTime] = useState('');
  const [dropFactor, setDropFactor] = useState('20');
  const [dripRate, setDripRate] = useState<{ mlHr: number; gttsMin: number } | null>(null);
  const [pedWeight, setPedWeight] = useState('');
  const [adultDose, setAdultDose] = useState('');
  const [pedDose, setPedDose] = useState<number | null>(null);
  const [totalCalcium, setTotalCalcium] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [correctedCalcium, setCorrectedCalcium] = useState<number | null>(null);
  const [fio2, setFio2] = useState('');
  const [pao2, setPao2] = useState('');
  const [paco2, setPaco2] = useState('');
  const [aaGradient, setAaGradient] = useState<number | null>(null);

  const { feedback, triggerFeedback, closeFeedback } = useErrorsPreventedFeedback();

  // All calculation functions preserved
  const calculateDose = () => {
    const w = parseFloat(weight);
    const d = parseFloat(dosePerKg);
    if (isNaN(w) || isNaN(d)) return;
    const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
    const dose = weightInKg * d;
    setCalculatedDose(Math.round(dose * 100) / 100);
    if (dose > 0 && dose < 1000) setSafetyLevel('safe');
    else if (dose >= 1000 && dose < 2000) setSafetyLevel('caution');
    else setSafetyLevel('unsafe');
    triggerFeedback('dose_calculation');
  };

  const calculateCrCl = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const cr = parseFloat(creatinine);
    if (isNaN(a) || isNaN(w) || isNaN(cr) || cr === 0) return;
    const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
    let result = ((140 - a) * weightInKg) / (72 * cr);
    if (sex === 'female') result *= 0.85;
    setCrcl(Math.round(result * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const calculateBSA = () => {
    const h = parseFloat(bsaHeight);
    const w = parseFloat(bsaWeight);
    if (isNaN(h) || isNaN(w)) return;
    const result = Math.sqrt((h * w) / 3600);
    setBsa(Math.round(result * 100) / 100);
    triggerFeedback('dose_calculation');
  };

  const calculateIBW = () => {
    const h = parseFloat(ibwHeight);
    const w = parseFloat(weight);
    if (isNaN(h)) return;
    let idealWeight: number;
    if (ibwSex === 'male') idealWeight = 50 + 2.3 * (h - 60);
    else idealWeight = 45.5 + 2.3 * (h - 60);
    setIbw(Math.round(idealWeight * 10) / 10);
    if (!isNaN(w)) {
      const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
      const adjustedWeight = idealWeight + 0.4 * (weightInKg - idealWeight);
      setAbw(Math.round(adjustedWeight * 10) / 10);
    }
    triggerFeedback('dose_calculation');
  };

  const calculateDripRate = () => {
    const vol = parseFloat(dripVolume);
    const time = parseFloat(dripTime);
    const df = parseFloat(dropFactor);
    if (isNaN(vol) || isNaN(time) || isNaN(df) || time === 0) return;
    const mlPerHour = vol / time;
    const gttsPerMin = (vol * df) / (time * 60);
    setDripRate({ mlHr: Math.round(mlPerHour * 10) / 10, gttsMin: Math.round(gttsPerMin * 10) / 10 });
    triggerFeedback('dose_calculation');
  };

  const calculatePedDose = () => {
    const w = parseFloat(pedWeight);
    const adult = parseFloat(adultDose);
    if (isNaN(w) || isNaN(adult)) return;
    const dose = (w / 70) * adult;
    setPedDose(Math.round(dose * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const calculateCorrectedCalcium = () => {
    const ca = parseFloat(totalCalcium);
    const alb = parseFloat(albumin);
    if (isNaN(ca) || isNaN(alb)) return;
    const corrected = ca + 0.8 * (4.0 - alb);
    setCorrectedCalcium(Math.round(corrected * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const calculateAaGradient = () => {
    const fi = parseFloat(fio2) / 100;
    const pao = parseFloat(pao2);
    const paco = parseFloat(paco2);
    if (isNaN(fi) || isNaN(pao) || isNaN(paco)) return;
    const pao2Calc = (fi * (760 - 47)) - (paco / 0.8);
    const gradient = pao2Calc - pao;
    setAaGradient(Math.round(gradient * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const getSafetyColor = (level: SafetyLevel) => {
    switch (level) {
      case 'safe': return 'border-success bg-success/5';
      case 'caution': return 'border-warning bg-warning/5';
      case 'unsafe': return 'border-destructive bg-destructive/5';
      default: return '';
    }
  };

  const getCrClInterpretation = (value: number) => {
    if (value >= 90) return { label: 'Normal', color: 'text-success' };
    if (value >= 60) return { label: 'Mild Impairment', color: 'text-success' };
    if (value >= 30) return { label: 'Moderate Impairment', color: 'text-warning' };
    if (value >= 15) return { label: 'Severe Impairment', color: 'text-destructive' };
    return { label: 'Kidney Failure', color: 'text-destructive' };
  };

  const getAaGradientInterpretation = (value: number, patientAge: number = 25) => {
    const expectedMax = (patientAge / 4) + 4;
    if (value <= expectedMax) return { label: 'Normal', color: 'text-success' };
    if (value <= expectedMax + 10) return { label: 'Mildly Elevated', color: 'text-warning' };
    return { label: 'Elevated', color: 'text-destructive' };
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const selectCalculator = (calcId: string) => {
    setSelectedCalculator(calcId);
  };

  // Render inline calculators (preserved from original)
  const renderInlineCalculator = (calcId: string) => {
    switch (calcId) {
      case 'weight-based':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-glow to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalculatorIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Weight-Based Dosing</CardTitle>
                  <CardDescription>Calculate dose based on patient weight</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight" className="text-sm font-medium">Patient Weight</Label>
                  <Input id="weight" type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-2 h-11 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="weightUnit" className="text-sm font-medium">Unit</Label>
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="dosePerKg" className="text-sm font-medium">Dose (mg/kg)</Label>
                <Input id="dosePerKg" type="number" placeholder="e.g., 10" value={dosePerKg} onChange={(e) => setDosePerKg(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="frequency" className="text-sm font-medium">Frequency (optional)</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue placeholder="Select frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="bid">BID (twice daily)</SelectItem>
                    <SelectItem value="tid">TID (three times daily)</SelectItem>
                    <SelectItem value="qid">QID (four times daily)</SelectItem>
                    <SelectItem value="q6h">Q6H</SelectItem>
                    <SelectItem value="q8h">Q8H</SelectItem>
                    <SelectItem value="q12h">Q12H</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateDose} className="w-full h-11 rounded-xl">Calculate Dose</Button>
              {calculatedDose !== null && (
                <div className={`p-5 rounded-2xl border-2 ${getSafetyColor(safetyLevel)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Calculated Dose</span>
                    {safetyLevel === 'safe' && <Badge className="bg-success text-success-foreground gap-1 rounded-lg"><CheckCircle2 className="w-3 h-3" /> Safe Range</Badge>}
                    {safetyLevel === 'caution' && <Badge className="bg-warning text-warning-foreground gap-1 rounded-lg"><AlertTriangle className="w-3 h-3" /> Review</Badge>}
                    {safetyLevel === 'unsafe' && <Badge variant="destructive" className="gap-1 rounded-lg"><AlertTriangle className="w-3 h-3" /> Unsafe</Badge>}
                  </div>
                  <p className="text-3xl font-bold">{calculatedDose} mg</p>
                  {frequency && <p className="text-sm text-muted-foreground mt-2">{frequency.toUpperCase()}</p>}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'pediatric':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Baby className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pediatric Dose</CardTitle>
                  <CardDescription>Clark's Rule calculation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div>
                <Label htmlFor="pedWeight" className="text-sm font-medium">Child Weight (kg)</Label>
                <Input id="pedWeight" type="number" placeholder="20" value={pedWeight} onChange={(e) => setPedWeight(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="adultDose" className="text-sm font-medium">Adult Dose (mg)</Label>
                <Input id="adultDose" type="number" placeholder="500" value={adultDose} onChange={(e) => setAdultDose(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={calculatePedDose} className="w-full h-11 rounded-xl">Calculate Pediatric Dose</Button>
              {pedDose !== null && (
                <div className="p-5 rounded-2xl border border-border/50 bg-muted/30">
                  <span className="text-sm text-muted-foreground">Pediatric Dose</span>
                  <p className="text-3xl font-bold mt-2">{pedDose} mg</p>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-xl">
                <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">Clark's Rule: (Child weight kg ÷ 70) × Adult dose. Always verify with pediatric references.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'crcl':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-info-glow to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-info-glow flex items-center justify-center">
                  <CalculatorIcon className="w-5 h-5 text-info" />
                </div>
                <div>
                  <CardTitle className="text-lg">Creatinine Clearance</CardTitle>
                  <CardDescription>Cockcroft-Gault equation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="text-sm font-medium">Age (years)</Label>
                  <Input id="age" type="number" placeholder="65" value={age} onChange={(e) => setAge(e.target.value)} className="mt-2 h-11 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="sex" className="text-sm font-medium">Sex</Label>
                  <Select value={sex} onValueChange={setSex}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Weight</Label>
                  <Input type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-2 h-11 rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Unit</Label>
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="creatinine" className="text-sm font-medium">Serum Creatinine (mg/dL)</Label>
                <Input id="creatinine" type="number" step="0.1" placeholder="1.0" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={calculateCrCl} className="w-full h-11 rounded-xl">Calculate CrCl</Button>
              {crcl !== null && (
                <div className="p-5 rounded-2xl border border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Estimated CrCl</span>
                    <span className={`text-sm font-semibold ${getCrClInterpretation(crcl).color}`}>{getCrClInterpretation(crcl).label}</span>
                  </div>
                  <p className="text-3xl font-bold">{crcl} mL/min</p>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-primary-glow rounded-xl">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">CrCl ≥90: Normal • 60-89: Mild • 30-59: Moderate • 15-29: Severe • &lt;15: Failure</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'bsa':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-success/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle className="text-lg">Body Surface Area</CardTitle>
                  <CardDescription>Mosteller formula</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div>
                <Label className="text-sm font-medium">Height (cm)</Label>
                <Input type="number" placeholder="170" value={bsaHeight} onChange={(e) => setBsaHeight(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Weight (kg)</Label>
                <Input type="number" placeholder="70" value={bsaWeight} onChange={(e) => setBsaWeight(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={calculateBSA} className="w-full h-11 rounded-xl">Calculate BSA</Button>
              {bsa !== null && (
                <div className="p-5 rounded-2xl border border-border/50 bg-muted/30">
                  <span className="text-sm text-muted-foreground">Body Surface Area</span>
                  <p className="text-3xl font-bold mt-2">{bsa} m²</p>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-success/5 rounded-xl">
                <Info className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">Used for chemotherapy dosing. Average adult BSA: 1.7-2.0 m²</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'ibw-abw':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-warning/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <CardTitle className="text-lg">IBW / ABW</CardTitle>
                  <CardDescription>Ideal & Adjusted Body Weight</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Height (inches)</Label>
                  <Input type="number" placeholder="68" value={ibwHeight} onChange={(e) => setIbwHeight(e.target.value)} className="mt-2 h-11 rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Sex</Label>
                  <Select value={ibwSex} onValueChange={setIbwSex}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Actual Weight (optional, for ABW)</Label>
                <Input type="number" placeholder="80 kg" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={calculateIBW} className="w-full h-11 rounded-xl">Calculate IBW/ABW</Button>
              {ibw !== null && (
                <div className="p-5 rounded-2xl border border-border/50 bg-muted/30 space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Ideal Body Weight</span>
                    <p className="text-2xl font-bold">{ibw} kg</p>
                  </div>
                  {abw !== null && (
                    <div className="pt-3 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">Adjusted Body Weight</span>
                      <p className="text-2xl font-bold">{abw} kg</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-warning/5 rounded-xl">
                <Info className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">Devine formula. ABW = IBW + 0.4 × (Actual - IBW). Use for aminoglycosides.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'drip-rate':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-info/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-info" />
                </div>
                <div>
                  <CardTitle className="text-lg">IV Drip Rate</CardTitle>
                  <CardDescription>mL/hr and gtts/min calculation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div>
                <Label className="text-sm font-medium">Total Volume (mL)</Label>
                <Input type="number" placeholder="1000" value={dripVolume} onChange={(e) => setDripVolume(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Infusion Time (hours)</Label>
                <Input type="number" placeholder="8" value={dripTime} onChange={(e) => setDripTime(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Drop Factor (gtts/mL)</Label>
                <Select value={dropFactor} onValueChange={setDropFactor}>
                  <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 (Macro)</SelectItem>
                    <SelectItem value="15">15 (Macro)</SelectItem>
                    <SelectItem value="20">20 (Macro)</SelectItem>
                    <SelectItem value="60">60 (Micro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateDripRate} className="w-full h-11 rounded-xl">Calculate Drip Rate</Button>
              {dripRate !== null && (
                <div className="p-5 rounded-2xl border border-border/50 bg-muted/30 space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Flow Rate</span>
                    <p className="text-2xl font-bold">{dripRate.mlHr} mL/hr</p>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Drip Rate</span>
                    <p className="text-2xl font-bold">{dripRate.gttsMin} gtts/min</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'corrected-calcium':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-destructive/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-lg">Corrected Calcium</CardTitle>
                  <CardDescription>Adjusted for albumin</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div>
                <Label className="text-sm font-medium">Total Calcium (mg/dL)</Label>
                <Input type="number" step="0.1" placeholder="8.5" value={totalCalcium} onChange={(e) => setTotalCalcium(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Albumin (g/dL)</Label>
                <Input type="number" step="0.1" placeholder="3.0" value={albumin} onChange={(e) => setAlbumin(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={calculateCorrectedCalcium} className="w-full h-11 rounded-xl">Calculate Corrected Calcium</Button>
              {correctedCalcium !== null && (
                <div className="p-5 rounded-2xl border border-border/50 bg-muted/30">
                  <span className="text-sm text-muted-foreground">Corrected Calcium</span>
                  <p className="text-3xl font-bold mt-2">{correctedCalcium} mg/dL</p>
                  <p className="text-xs text-muted-foreground mt-2">Normal range: 8.5-10.5 mg/dL</p>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-xl">
                <Info className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">Formula: Total Ca + 0.8 × (4.0 - Albumin)</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'aa-gradient':
        return (
          <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Wind className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">A-a Gradient</CardTitle>
                  <CardDescription>Alveolar-arterial oxygen gradient</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div>
                <Label className="text-sm font-medium">FiO₂ (%)</Label>
                <Input type="number" placeholder="21" value={fio2} onChange={(e) => setFio2(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">PaO₂ (mmHg)</Label>
                <Input type="number" placeholder="95" value={pao2} onChange={(e) => setPao2(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">PaCO₂ (mmHg)</Label>
                <Input type="number" placeholder="40" value={paco2} onChange={(e) => setPaco2(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={calculateAaGradient} className="w-full h-11 rounded-xl">Calculate A-a Gradient</Button>
              {aaGradient !== null && (
                <div className="p-5 rounded-2xl border border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">A-a Gradient</span>
                    <span className={`text-sm font-semibold ${getAaGradientInterpretation(aaGradient).color}`}>{getAaGradientInterpretation(aaGradient).label}</span>
                  </div>
                  <p className="text-3xl font-bold">{aaGradient} mmHg</p>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-xl">
                <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">Expected normal: (Age/4) + 4. Elevation suggests V/Q mismatch or diffusion impairment.</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const renderSelectedCalculator = () => {
    if (!selectedCalculator) {
      // New Empty State Design
      return (
        <div className="grid place-items-center px-4 py-10 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card shadow-sm">
            <CalculatorIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            Choose a calculator to begin
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Built for speed. Designed for safety.
          </p>
          {/* Safety banner */}
          <div className="mt-7 w-full max-w-xl rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/5 dark:bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-navy dark:text-primary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">
                  Safety checks active
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Weight limits · Dose caps · Unit validation
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    for (const category of categories) {
      const calc = category.calculators.find(c => c.id === selectedCalculator);
      if (calc) {
        if (calc.component) {
          const Component = calc.component;
          return <Component />;
        } else {
          return renderInlineCalculator(selectedCalculator);
        }
      }
    }
    return null;
  };

  // Direct calculator mode
  if (directCalcInfo) {
    const { calc, category } = directCalcInfo;
    const Component = calc.component!;
    
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Medication
        </Button>
        
        <div className="mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm font-medium mb-3">
            {category.icon}
            <span>{category.name}</span>
          </div>
        </div>
        
        <Component />
        
        {feedback && (
          <ErrorsPreventedPrompt
            onClose={closeFeedback}
            interactionType={feedback.interactionType}
          />
        )}
      </div>
    );
  }

  // Filter calculators based on search
  const filteredResults = searchQuery.trim()
    ? categories.flatMap(category =>
        category.calculators
          .filter(calc =>
            calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(calc => ({ calc, category }))
      )
    : [];

  return (
    <div className="min-h-screen bg-cream -m-6 -mt-4">
      {/* Soft background wash */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-crimson/10 blur-3xl" />
        <div className="absolute top-16 right-0 h-72 w-72 rounded-full bg-navy/10 dark:bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Page header */}
        <div className="mt-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Calculate
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Dose calculators with built-in safety checks
          </p>
        </div>

        {/* Main layout */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Calculator Categories
                </h2>
              </div>
              
              {/* Search */}
              <div className="mt-3">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-navy/20 dark:focus-within:ring-primary/20">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    placeholder="Search calculators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <kbd className="hidden sm:inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                    ⌘ K
                  </kbd>
                </div>
              </div>

              {/* Search Results or Categories */}
              <ScrollArea className="h-[calc(100vh-380px)] mt-4">
                {searchQuery.trim() ? (
                  // Search results
                  <div className="space-y-1">
                    {filteredResults.length > 0 ? (
                      filteredResults.map(({ calc, category }) => (
                        <button
                          key={calc.id}
                          onClick={() => {
                            selectCalculator(calc.id);
                            setExpandedCategory(category.id);
                            setSearchQuery('');
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                            selectedCalculator === calc.id
                              ? 'bg-navy dark:bg-primary text-white dark:text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={selectedCalculator === calc.id ? 'text-white dark:text-primary-foreground' : category.color}>
                              {category.icon}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{calc.name}</p>
                              <p className={`text-xs ${
                                selectedCalculator === calc.id ? 'text-white/70 dark:text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>{calc.description}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No calculators found</p>
                    )}
                  </div>
                ) : (
                  // Category accordion
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Collapsible
                        key={category.id}
                        open={expandedCategory === category.id}
                        onOpenChange={() => toggleCategory(category.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-2xl border border-border bg-muted px-3 py-3 text-left shadow-sm transition hover:bg-muted/80"
                          >
                            <span className="flex items-center gap-2">
                              <span className="grid h-8 w-8 place-items-center rounded-xl bg-card shadow-sm">
                                <span className={category.color}>{category.icon}</span>
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                {category.name}
                              </span>
                            </span>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${
                              expandedCategory === category.id ? 'rotate-180' : ''
                            }`} />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-3 rounded-2xl border border-border bg-card overflow-hidden">
                            {category.calculators.map((calc, index) => (
                              <SidebarItem
                                key={calc.id}
                                title={calc.name}
                                subtitle={calc.description}
                                active={selectedCalculator === calc.id}
                                last={index === category.calculators.length - 1}
                                onClick={() => selectCalculator(calc.id)}
                              />
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </aside>

          {/* Right canvas */}
          <main className="lg:col-span-8">
            <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur min-h-[600px]">
              {!selectedCalculator && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Quick Start</h2>
                  </div>
                  
                  {/* Quick start cards */}
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <QuickCard
                      title="tPA Calculator"
                      subtitle="Alteplase dosing for stroke"
                      icon={<Clock className="h-4 w-4 text-navy dark:text-primary" />}
                      onClick={() => {
                        setExpandedCategory('emergency');
                        selectCalculator('tpa');
                      }}
                    />
                    <QuickCard
                      title="TNK Calculator"
                      subtitle="Tenecteplase dosing"
                      icon={<Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
                      onClick={() => {
                        setExpandedCategory('emergency');
                        selectCalculator('tnk');
                      }}
                    />
                    <QuickCard
                      title="BP Post–tPA"
                      subtitle="BP management post-tPA"
                      icon={<Activity className="h-4 w-4 text-crimson" />}
                      onClick={() => {
                        setExpandedCategory('emergency');
                        selectCalculator('post-thrombolytic-bp');
                      }}
                    />
                  </div>

                  <div className="mt-6 border-t border-border/70" />
                </>
              )}

              {/* Calculator display area */}
              <div className={selectedCalculator ? '' : 'mt-6'}>
                {renderSelectedCalculator()}
              </div>

              {/* Footer hint */}
              {!selectedCalculator && (
                <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                    Clinical calculators
                  </span>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Errors Prevented Feedback Prompt */}
      {feedback && (
        <ErrorsPreventedPrompt
          interactionType={feedback.interactionType}
          medicationId={feedback.medicationId}
          toolId={feedback.toolId}
          onClose={closeFeedback}
        />
      )}
    </div>
  );
};

export default CalculatePage;
