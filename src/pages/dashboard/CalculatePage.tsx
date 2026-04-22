import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CheckCircle2, AlertTriangle, Info, Scale, Droplet, Baby, FlaskConical,
  Siren, Syringe, HeartPulse, Activity, Pill, Search,
  ShieldCheck, ArrowLeft, ChevronRight, X,
} from 'lucide-react';
import { CalculatorIcon, LungsIcon } from '@/components/icons/MedicalSystemIcons';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
  shortName: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  calculators: CalculatorItem[];
}

const CalculatePage = ({ profile }: CalculatePageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('emergency');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const directCalcMode = searchParams.get('calc');

  const categories: CalculatorCategory[] = useMemo(() => [
    {
      id: 'emergency',
      name: 'Emergency & Stroke',
      shortName: 'Emergency',
      icon: <Siren className="w-4 h-4" />,
      color: 'text-red-500',
      bgColor: 'bg-red-500/15',
      calculators: [
        { id: 'tpa', name: 'tPA Calculator', description: 'Alteplase dosing for stroke', component: TPACalculator },
        { id: 'tnk', name: 'TNK Calculator', description: 'Tenecteplase dosing', component: TNKCalculator },
        { id: 'door-to-needle', name: 'Door-to-Needle Timer', description: 'Thrombolysis timing', component: DoorToNeedleCalculator },
        { id: 'post-thrombolytic-bp', name: 'Post-Thrombolytic BP', description: 'BP management post-tPA', component: PostThrombolyticBPCalculator },
        { id: 'bleeding-risk', name: 'Bleeding Risk Assessment', description: 'Thrombolytic contraindications', component: BleedingRiskCalculator },
      ],
    },
    {
      id: 'insulin',
      name: 'Insulin & Diabetes',
      shortName: 'Insulin',
      icon: <Syringe className="w-4 h-4" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/15',
      calculators: [
        { id: 'basal-insulin', name: 'Basal Insulin', description: 'Starting basal dose', component: BasalInsulinCalculator },
        { id: 'bolus-insulin', name: 'Bolus Insulin', description: 'Mealtime insulin dosing', component: BolusInsulinCalculator },
        { id: 'correction-factor', name: 'Correction Factor', description: 'ISF & I:C ratio', component: CorrectionFactorCalculator },
        { id: 'sliding-scale', name: 'Sliding Scale', description: 'Generate sliding scale', component: SlidingScaleCalculator },
        { id: 'insulin-drip-transition', name: 'IV to SQ Transition', description: 'Drip transition dosing', component: InsulinDripTransitionCalculator },
      ],
    },
    {
      id: 'anticoag',
      name: 'Anticoagulation',
      shortName: 'Anticoag',
      icon: <HeartPulse className="w-4 h-4" />,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/15',
      calculators: [
        { id: 'heparin', name: 'Heparin Calculator', description: 'Weight-based heparin', component: HeparinCalculator },
        { id: 'aptt-titration', name: 'aPTT Titration', description: 'Heparin dose adjustment', component: APTTTitrationCalculator },
        { id: 'warfarin', name: 'Warfarin Dosing', description: 'INR-based adjustments', component: WarfarinCalculator },
        { id: 'doac-renal', name: 'DOAC Renal Dosing', description: 'CrCl-based DOAC dosing', component: DOACRenalCalculator },
        { id: 'bleeding-risk-score', name: 'HAS-BLED Score', description: 'Bleeding risk assessment', component: BleedingRiskScoreCalculator },
      ],
    },
    {
      id: 'critical-care',
      name: 'Critical Care',
      shortName: 'Critical',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/15',
      calculators: [
        { id: 'levophed', name: 'Levophed (Norepinephrine)', description: 'Vasopressor dosing', component: LevophedCalculator },
      ],
    },
    {
      id: 'dosing',
      name: 'General Dosing',
      shortName: 'Dosing',
      icon: <Pill className="w-4 h-4" />,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/15',
      calculators: [
        { id: 'weight-based', name: 'Weight-Based Dosing', description: 'mg/kg calculations', component: null },
        { id: 'pediatric', name: 'Pediatric Dose', description: "Clark's Rule", component: null },
        { id: 'tylenol', name: 'Tylenol (Acetaminophen)', description: 'Pain & fever dosing', component: TylenolCalculator },
        { id: 'motrin', name: 'Motrin (Ibuprofen)', description: 'NSAID dosing', component: MotrinCalculator },
        { id: 'temperature', name: 'Temperature Converter', description: '°F ↔ °C conversion', component: TemperatureConverter },
        { id: 'weight-converter', name: 'Weight Converter', description: 'lbs ↔ kg conversion', component: WeightConverter },
      ],
    },
    {
      id: 'body',
      name: 'Body Metrics',
      shortName: 'Body',
      icon: <Scale className="w-4 h-4" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/15',
      calculators: [
        { id: 'bsa', name: 'Body Surface Area', description: 'Mosteller formula', component: null },
        { id: 'ibw-abw', name: 'IBW / ABW', description: 'Ideal & Adjusted weight', component: null },
        { id: 'bmi', name: 'BMI Calculator', description: 'Body Mass Index', component: BMICalculator },
      ],
    },
    {
      id: 'iv',
      name: 'IV Rates',
      shortName: 'IV Rates',
      icon: <Droplet className="w-4 h-4" />,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/15',
      calculators: [
        { id: 'drip-rate', name: 'IV Drip Rate', description: 'mL/hr and gtts/min', component: null },
      ],
    },
    {
      id: 'labs',
      name: 'Lab Corrections',
      shortName: 'Labs',
      icon: <FlaskConical className="w-4 h-4" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/15',
      calculators: [
        { id: 'corrected-calcium', name: 'Corrected Calcium', description: 'Albumin adjustment', component: null },
        { id: 'crcl', name: 'Creatinine Clearance', description: 'Cockcroft-Gault', component: null },
      ],
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      shortName: 'Resp',
      icon: <LungsIcon size={16} className="w-4 h-4" />,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/15',
      calculators: [
        { id: 'aa-gradient', name: 'A-a Gradient', description: 'Alveolar-arterial O₂', component: null },
      ],
    },
    {
      id: 'obgyn',
      name: 'OB/GYN',
      shortName: 'OB/GYN',
      icon: <Baby className="w-4 h-4" />,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/15',
      calculators: [
        { id: 'edd', name: 'EDD Calculator', description: 'Estimated due date & gestational age', component: EDDCalculator },
        { id: 'bishop-score', name: 'Bishop Score', description: 'Cervical readiness assessment', component: BishopScoreCalculator },
        { id: 'depo', name: 'Depo-Provera', description: 'Injection scheduling & grace periods', component: DepoCalculator },
        { id: 'oxytocin', name: 'Oxytocin Calculator', description: 'Labor induction & PPH protocols', component: OxytocinCalculator },
        { id: 'mag-sulfate-ob', name: 'Magnesium Sulfate (OB)', description: 'Preeclampsia & fetal neuroprotection', component: MagnesiumSulfateOBCalculator },
      ],
    },
  ], []);

  const directCalcInfo = useMemo(() => {
    if (!directCalcMode) return null;
    for (const category of categories) {
      const calc = category.calculators.find(c => c.id === directCalcMode);
      if (calc && calc.component) return { calc, category };
    }
    return null;
  }, [directCalcMode, categories]);

  useEffect(() => {
    const calcParam = searchParams.get('calc');
    if (calcParam && !directCalcInfo) {
      for (const category of categories) {
        const calc = category.calculators.find(c => c.id === calcParam);
        if (calc) {
          setSelectedCategory(category.id);
          setSelectedCalculator(calcParam);
          setSearchParams({}, { replace: true });
          break;
        }
      }
    }
  }, [searchParams, categories, setSearchParams, directCalcInfo]);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  // ── Calculator state ──────────────────────────────────────────────────────
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

  // ── Calculation helpers ───────────────────────────────────────────────────
  const calculateDose = () => {
    const w = parseFloat(weight), d = parseFloat(dosePerKg);
    if (isNaN(w) || isNaN(d)) return;
    const wKg = weightUnit === 'lb' ? w * 0.453592 : w;
    const dose = wKg * d;
    setCalculatedDose(Math.round(dose * 100) / 100);
    setSafetyLevel(dose < 1000 ? 'safe' : dose < 2000 ? 'caution' : 'unsafe');
    triggerFeedback('dose_calculation');
  };

  const calculateCrCl = () => {
    const a = parseFloat(age), w = parseFloat(weight), cr = parseFloat(creatinine);
    if (isNaN(a) || isNaN(w) || isNaN(cr) || cr === 0) return;
    const wKg = weightUnit === 'lb' ? w * 0.453592 : w;
    let result = ((140 - a) * wKg) / (72 * cr);
    if (sex === 'female') result *= 0.85;
    setCrcl(Math.round(result * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const calculateBSA = () => {
    const h = parseFloat(bsaHeight), w = parseFloat(bsaWeight);
    if (isNaN(h) || isNaN(w)) return;
    setBsa(Math.round(Math.sqrt((h * w) / 3600) * 100) / 100);
    triggerFeedback('dose_calculation');
  };

  const calculateIBW = () => {
    const h = parseFloat(ibwHeight), w = parseFloat(weight);
    if (isNaN(h)) return;
    const ideal = ibwSex === 'male' ? 50 + 2.3 * (h - 60) : 45.5 + 2.3 * (h - 60);
    setIbw(Math.round(ideal * 10) / 10);
    if (!isNaN(w)) {
      const wKg = weightUnit === 'lb' ? w * 0.453592 : w;
      setAbw(Math.round((ideal + 0.4 * (wKg - ideal)) * 10) / 10);
    }
    triggerFeedback('dose_calculation');
  };

  const calculateDripRate = () => {
    const vol = parseFloat(dripVolume), time = parseFloat(dripTime), df = parseFloat(dropFactor);
    if (isNaN(vol) || isNaN(time) || isNaN(df) || time === 0) return;
    setDripRate({ mlHr: Math.round((vol / time) * 10) / 10, gttsMin: Math.round(((vol * df) / (time * 60)) * 10) / 10 });
    triggerFeedback('dose_calculation');
  };

  const calculatePedDose = () => {
    const w = parseFloat(pedWeight), adult = parseFloat(adultDose);
    if (isNaN(w) || isNaN(adult)) return;
    setPedDose(Math.round(((w / 70) * adult) * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const calculateCorrectedCalcium = () => {
    const ca = parseFloat(totalCalcium), alb = parseFloat(albumin);
    if (isNaN(ca) || isNaN(alb)) return;
    setCorrectedCalcium(Math.round((ca + 0.8 * (4.0 - alb)) * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const calculateAaGradient = () => {
    const fi = parseFloat(fio2) / 100, pao = parseFloat(pao2), paco = parseFloat(paco2);
    if (isNaN(fi) || isNaN(pao) || isNaN(paco)) return;
    setAaGradient(Math.round(((fi * (760 - 47)) - (paco / 0.8) - pao) * 10) / 10);
    triggerFeedback('dose_calculation');
  };

  const getSafetyColor = (level: SafetyLevel) => {
    if (level === 'safe') return 'border-green-500 bg-green-500/5';
    if (level === 'caution') return 'border-amber-500 bg-amber-500/5';
    if (level === 'unsafe') return 'border-red-500 bg-red-500/5';
    return '';
  };

  const getCrClLabel = (v: number) => {
    if (v >= 90) return { label: 'Normal', color: 'text-green-500' };
    if (v >= 60) return { label: 'Mild', color: 'text-green-500' };
    if (v >= 30) return { label: 'Moderate', color: 'text-amber-500' };
    if (v >= 15) return { label: 'Severe', color: 'text-red-500' };
    return { label: 'Failure', color: 'text-red-500' };
  };

  // ── Inline calculators ────────────────────────────────────────────────────
  const renderInlineCalculator = (calcId: string) => {
    switch (calcId) {
      case 'weight-based':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weight</Label>
                <Input type="number" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit</Label>
                <Select value={weightUnit} onValueChange={setWeightUnit}>
                  <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="lb">lb</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dose (mg/kg)</Label>
              <Input type="number" placeholder="e.g. 10" value={dosePerKg} onChange={e => setDosePerKg(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {['Once', 'BID', 'TID', 'QID', 'Q6H', 'Q8H', 'Q12H'].map(f => <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={calculateDose} className="w-full h-12 rounded-xl text-base font-semibold">Calculate Dose</Button>
            {calculatedDose !== null && (
              <div className={`p-4 rounded-2xl border-2 ${getSafetyColor(safetyLevel)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Result</span>
                  {safetyLevel === 'safe' && <Badge className="bg-green-500 text-white gap-1 rounded-lg text-xs"><CheckCircle2 className="w-3 h-3" /> Safe</Badge>}
                  {safetyLevel === 'caution' && <Badge className="bg-amber-500 text-white gap-1 rounded-lg text-xs"><AlertTriangle className="w-3 h-3" /> Review</Badge>}
                  {safetyLevel === 'unsafe' && <Badge variant="destructive" className="gap-1 rounded-lg text-xs"><AlertTriangle className="w-3 h-3" /> Unsafe</Badge>}
                </div>
                <p className="text-4xl font-bold">{calculatedDose} mg</p>
                {frequency && <p className="text-sm text-muted-foreground mt-1">{frequency.toUpperCase()}</p>}
              </div>
            )}
          </div>
        );
      case 'pediatric':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Child Weight (kg)</Label>
              <Input type="number" placeholder="20" value={pedWeight} onChange={e => setPedWeight(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Adult Dose (mg)</Label>
              <Input type="number" placeholder="500" value={adultDose} onChange={e => setAdultDose(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <Button onClick={calculatePedDose} className="w-full h-12 rounded-xl text-base font-semibold">Calculate Dose</Button>
            {pedDose !== null && (
              <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pediatric Dose</p>
                <p className="text-4xl font-bold">{pedDose} mg</p>
              </div>
            )}
            <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-xl">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">Clark's Rule: (Child kg ÷ 70) × Adult dose. Always verify with pediatric references.</p>
            </div>
          </div>
        );
      case 'crcl':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Age (yrs)</Label>
                <Input type="number" placeholder="65" value={age} onChange={e => setAge(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sex</Label>
                <Select value={sex} onValueChange={setSex}>
                  <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weight</Label>
                <Input type="number" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit</Label>
                <Select value={weightUnit} onValueChange={setWeightUnit}>
                  <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="lb">lb</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Creatinine (mg/dL)</Label>
              <Input type="number" step="0.1" placeholder="1.0" value={creatinine} onChange={e => setCreatinine(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <Button onClick={calculateCrCl} className="w-full h-12 rounded-xl text-base font-semibold">Calculate CrCl</Button>
            {crcl !== null && (
              <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated CrCl</p>
                  <span className={`text-sm font-semibold ${getCrClLabel(crcl).color}`}>{getCrClLabel(crcl).label}</span>
                </div>
                <p className="text-4xl font-bold">{crcl} <span className="text-xl font-medium text-muted-foreground">mL/min</span></p>
              </div>
            )}
          </div>
        );
      case 'bsa':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Height (cm)</Label>
              <Input type="number" placeholder="170" value={bsaHeight} onChange={e => setBsaHeight(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weight (kg)</Label>
              <Input type="number" placeholder="70" value={bsaWeight} onChange={e => setBsaWeight(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <Button onClick={calculateBSA} className="w-full h-12 rounded-xl text-base font-semibold">Calculate BSA</Button>
            {bsa !== null && (
              <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Body Surface Area</p>
                <p className="text-4xl font-bold">{bsa} <span className="text-xl font-medium text-muted-foreground">m²</span></p>
              </div>
            )}
          </div>
        );
      case 'ibw-abw':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Height (in)</Label>
                <Input type="number" placeholder="68" value={ibwHeight} onChange={e => setIbwHeight(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sex</Label>
                <Select value={ibwSex} onValueChange={setIbwSex}>
                  <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Actual Weight (for ABW)</Label>
              <Input type="number" placeholder="80 kg" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <Button onClick={calculateIBW} className="w-full h-12 rounded-xl text-base font-semibold">Calculate IBW / ABW</Button>
            {ibw !== null && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">IBW</p>
                  <p className="text-2xl font-bold">{ibw} kg</p>
                </div>
                {abw !== null && (
                  <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">ABW</p>
                    <p className="text-2xl font-bold">{abw} kg</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'drip-rate':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Volume (mL)</Label>
              <Input type="number" placeholder="1000" value={dripVolume} onChange={e => setDripVolume(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Infusion Time (hrs)</Label>
              <Input type="number" placeholder="8" value={dripTime} onChange={e => setDripTime(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Drop Factor</Label>
              <Select value={dropFactor} onValueChange={setDropFactor}>
                <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 gtts/mL (Macro)</SelectItem>
                  <SelectItem value="15">15 gtts/mL (Macro)</SelectItem>
                  <SelectItem value="20">20 gtts/mL (Macro)</SelectItem>
                  <SelectItem value="60">60 gtts/mL (Micro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={calculateDripRate} className="w-full h-12 rounded-xl text-base font-semibold">Calculate Rate</Button>
            {dripRate !== null && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Flow Rate</p>
                  <p className="text-2xl font-bold">{dripRate.mlHr} <span className="text-sm font-medium">mL/hr</span></p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Drip Rate</p>
                  <p className="text-2xl font-bold">{dripRate.gttsMin} <span className="text-sm font-medium">gtts/min</span></p>
                </div>
              </div>
            )}
          </div>
        );
      case 'corrected-calcium':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Calcium (mg/dL)</Label>
              <Input type="number" step="0.1" placeholder="8.5" value={totalCalcium} onChange={e => setTotalCalcium(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Albumin (g/dL)</Label>
              <Input type="number" step="0.1" placeholder="3.0" value={albumin} onChange={e => setAlbumin(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <Button onClick={calculateCorrectedCalcium} className="w-full h-12 rounded-xl text-base font-semibold">Calculate</Button>
            {correctedCalcium !== null && (
              <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Corrected Calcium</p>
                <p className="text-4xl font-bold">{correctedCalcium} <span className="text-xl font-medium text-muted-foreground">mg/dL</span></p>
                <p className="text-xs text-muted-foreground mt-1">Normal: 8.5–10.5 mg/dL</p>
              </div>
            )}
            <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-xl">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">Formula: Total Ca + 0.8 × (4.0 − Albumin)</p>
            </div>
          </div>
        );
      case 'aa-gradient':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">FiO₂ (%)</Label>
              <Input type="number" placeholder="21" value={fio2} onChange={e => setFio2(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">PaO₂ (mmHg)</Label>
              <Input type="number" placeholder="95" value={pao2} onChange={e => setPao2(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">PaCO₂ (mmHg)</Label>
              <Input type="number" placeholder="40" value={paco2} onChange={e => setPaco2(e.target.value)} className="mt-1.5 h-12 rounded-xl text-base" />
            </div>
            <Button onClick={calculateAaGradient} className="w-full h-12 rounded-xl text-base font-semibold">Calculate A-a Gradient</Button>
            {aaGradient !== null && (
              <div className="p-4 rounded-2xl border border-border/50 bg-muted/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">A-a Gradient</p>
                <p className="text-4xl font-bold">{aaGradient} <span className="text-xl font-medium text-muted-foreground">mmHg</span></p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getCalculatorContent = (calcId: string) => {
    for (const cat of categories) {
      const calc = cat.calculators.find(c => c.id === calcId);
      if (calc) {
        if (calc.component) {
          const Comp = calc.component;
          return { name: calc.name, description: calc.description, category: cat, node: <Comp /> };
        }
        const node = renderInlineCalculator(calcId);
        if (node) return { name: calc.name, description: calc.description, category: cat, node };
      }
    }
    return null;
  };

  // ── Direct calc mode (from medication page) ───────────────────────────────
  if (directCalcInfo) {
    const { calc, category } = directCalcInfo;
    const Comp = calc.component!;
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Medication
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm font-medium">
          <span className={category.color}>{category.icon}</span>
          <span>{category.name}</span>
        </div>
        <Comp />
        {feedback && <ErrorsPreventedPrompt onClose={closeFeedback} interactionType={feedback.interactionType} />}
      </div>
    );
  }

  // ── Search results ────────────────────────────────────────────────────────
  const searchResults = searchQuery.trim()
    ? categories.flatMap(cat =>
        cat.calculators
          .filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(c => ({ calc: c, category: cat }))
      )
    : [];

  const activeCat = categories.find(c => c.id === selectedCategory) ?? categories[0];

  // ── Active calculator view ────────────────────────────────────────────────
  if (selectedCalculator) {
    const content = getCalculatorContent(selectedCalculator);
    return (
      <div className="flex flex-col min-h-0">
        {/* Calculator header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setSelectedCalculator(null)}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-muted hover:bg-muted/80 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground truncate">{content?.name}</h2>
            <p className="text-xs text-muted-foreground truncate">{content?.description}</p>
          </div>
          {content?.category && (
            <span className={`ml-auto flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-xl ${content.category.bgColor}`}>
              <span className={content.category.color}>{content.category.icon}</span>
            </span>
          )}
        </div>

        {/* Calculator content */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          {content?.node ?? (
            <div className="py-8 text-center text-muted-foreground">
              <CalculatorIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Coming soon</p>
            </div>
          )}
        </div>

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
  }

  // ── Main browser view ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      {showSearch ? (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={searchInputRef}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Search all calculators…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        /* Category chips + search icon row */
        <div className="flex items-center gap-2">
          <div
            ref={categoryScrollRef}
            className="flex gap-2 overflow-x-auto pb-1 flex-1 no-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.bgColor} ${cat.color} ring-1 ring-current/30`
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span className={selectedCategory === cat.id ? cat.color : 'text-muted-foreground'}>
                  {cat.icon}
                </span>
                {cat.shortName}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Search results */}
      {searchQuery.trim() && (
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          {searchResults.length > 0 ? (
            searchResults.map(({ calc, category }, i) => (
              <button
                key={calc.id}
                onClick={() => { setSelectedCalculator(calc.id); setSelectedCategory(category.id); setSearchQuery(''); setShowSearch(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${i < searchResults.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${category.bgColor}`}>
                  <span className={category.color}>{category.icon}</span>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{calc.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{calc.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 ml-auto" />
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No calculators found</p>
          )}
        </div>
      )}

      {/* Category header */}
      {!searchQuery.trim() && (
        <>
          <div className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${activeCat.bgColor}`}>
              <span className={activeCat.color}>{activeCat.icon}</span>
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground leading-tight">{activeCat.name}</h2>
              <p className="text-xs text-muted-foreground">{activeCat.calculators.length} calculators</p>
            </div>
          </div>

          {/* Calculator list */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
            {activeCat.calculators.map((calc, i) => (
              <button
                key={calc.id}
                onClick={() => setSelectedCalculator(calc.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/40 active:bg-muted/60 transition-colors ${i < activeCat.calculators.length - 1 ? 'border-b border-border/40' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{calc.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{calc.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Safety notice */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
            <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">Safety checks active · Weight limits · Dose caps · Unit validation</p>
          </div>
        </>
      )}

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
