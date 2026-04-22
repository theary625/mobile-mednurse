import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Ruler, Syringe, Stethoscope, AlertTriangle, Baby, Scale, ExternalLink, BookOpen, Heart, Wind, Droplets } from 'lucide-react';
import PediatricResusGuide from './PediatricResusGuide';

// 2024 GMVEMSC Pediatric Dose Chart — Broselow color zones
const COLOR_ZONES = [
  { color: 'Gray',   bgClass: 'bg-gray-400',   textClass: 'text-gray-900', minLength: 46, maxLength: 54, weightKg: 4,    ageRange: 'Newborn – 3 mo',  weightRange: '3–5 kg',   lbs: '6.6–11 lbs' },
  { color: 'Pink',   bgClass: 'bg-pink-400',   textClass: 'text-pink-900', minLength: 54, maxLength: 60, weightKg: 6.5,  ageRange: '3–5 months',      weightRange: '6–7 kg',   lbs: '13–15 lbs' },
  { color: 'Red',    bgClass: 'bg-red-500',    textClass: 'text-white',    minLength: 60, maxLength: 67, weightKg: 8.5,  ageRange: '6–11 months',     weightRange: '8–9 kg',   lbs: '17–20 lbs' },
  { color: 'Purple', bgClass: 'bg-purple-600', textClass: 'text-white',    minLength: 67, maxLength: 74, weightKg: 10.5, ageRange: '12–23 months',    weightRange: '10–11 kg', lbs: '22–24 lbs' },
  { color: 'Yellow', bgClass: 'bg-yellow-400', textClass: 'text-yellow-900', minLength: 74, maxLength: 82, weightKg: 13, ageRange: '2 y/o',           weightRange: '12–14 kg', lbs: '26.5–31 lbs' },
  { color: 'White',  bgClass: 'bg-white border-2 border-gray-300', textClass: 'text-gray-900', minLength: 82, maxLength: 92, weightKg: 17, ageRange: '3–4 y/o', weightRange: '15–18 kg', lbs: '33–40 lbs' },
  { color: 'Blue',   bgClass: 'bg-blue-500',   textClass: 'text-white',    minLength: 92, maxLength: 102, weightKg: 21, ageRange: '5–6 y/o',          weightRange: '19–23 kg', lbs: '42–50 lbs' },
  { color: 'Orange', bgClass: 'bg-orange-500', textClass: 'text-white',    minLength: 102, maxLength: 111, weightKg: 27, ageRange: '7–9 y/o',          weightRange: '24–29 kg', lbs: '53–64 lbs' },
  { color: 'Green',  bgClass: 'bg-green-500',  textClass: 'text-white',    minLength: 111, maxLength: 123, weightKg: 33, ageRange: '10–11 y/o',         weightRange: '30–36 kg', lbs: '66–80 lbs' },
];

// Vitals per zone (from 2024 PDF)
const VITALS_BY_ZONE: Record<string, { heartRate: string; respRate: string; minSBP: string; ventRate: string }> = {
  Gray:   { heartRate: '100–205 bpm',  respRate: '30–60/min',  minSBP: '> 60 (0–1 mo) / > 70 (1–3 mo)', ventRate: '40–60 bpm (newborn) / 20–30 bpm (infant)' },
  Pink:   { heartRate: '100–180 bpm',  respRate: '30–60/min',  minSBP: '> 70',  ventRate: '20–30 bpm' },
  Red:    { heartRate: '100–180 bpm',  respRate: '30–60/min',  minSBP: '> 70',  ventRate: '20–30 bpm' },
  Purple: { heartRate: '98–140 bpm',   respRate: '20–40/min',  minSBP: '> 72',  ventRate: '20–30 bpm' },
  Yellow: { heartRate: '98–140 bpm',   respRate: '20–40/min',  minSBP: '> 74',  ventRate: '20–30 bpm' },
  White:  { heartRate: '80–120 bpm',   respRate: '20–30/min',  minSBP: '> 78',  ventRate: '20–30 bpm' },
  Blue:   { heartRate: '75–118 bpm',   respRate: '20–30/min',  minSBP: '> 82',  ventRate: '20–30 bpm' },
  Orange: { heartRate: '75–118 bpm',   respRate: '16–24/min',  minSBP: '> 88',  ventRate: '20–30 bpm' },
  Green:  { heartRate: '60–100 bpm',   respRate: '12–20/min',  minSBP: '> 90',  ventRate: '20–30 bpm' },
};

// Equipment sizes by color zone (from 2024 PDF)
const EQUIPMENT_BY_ZONE: Record<string, {
  ettSize: string;
  ettDepth: string;
  laryngoscope: string;
  oralAirway: string;
  nasalAirway: string;
  kingAirway: string;
  iGel: string;
  suctionCatheter: string;
  ioNeedle: string;
}> = {
  Gray:   { ettSize: '2.5–3.5',        ettDepth: '9–10.5 cm',    laryngoscope: '0–1 straight', oralAirway: '40–50 mm', nasalAirway: '14 F',  kingAirway: '0',   iGel: '—',   suctionCatheter: '6–8 Fr',  ioNeedle: 'Pink (15mm)' },
  Pink:   { ettSize: '3.0–3.5',        ettDepth: '10–11 cm',     laryngoscope: '0–1 straight', oralAirway: '40–50 mm', nasalAirway: '14 F',  kingAirway: '1',   iGel: '1.5', suctionCatheter: '6–8 Fr',  ioNeedle: 'Pink (15mm)' },
  Red:    { ettSize: '3.0–3.5',        ettDepth: '10–11 cm',     laryngoscope: '0–1 straight', oralAirway: '40–50 mm', nasalAirway: '14 F',  kingAirway: '1',   iGel: '1.5', suctionCatheter: '6–8 Fr',  ioNeedle: 'Pink (15mm)' },
  Purple: { ettSize: '4.0',            ettDepth: '11–12 cm',     laryngoscope: '1–1.5 straight', oralAirway: '60 mm',  nasalAirway: '18 F',  kingAirway: '1',   iGel: '—',   suctionCatheter: '8 Fr',    ioNeedle: 'Blue (15mm)' },
  Yellow: { ettSize: '4.5',            ettDepth: '12.5–13.5 cm', laryngoscope: '2',             oralAirway: '60 mm',  nasalAirway: '20 F',  kingAirway: '2',   iGel: '2.0', suctionCatheter: '10 Fr',   ioNeedle: 'Blue (15mm)' },
  White:  { ettSize: '5.0',            ettDepth: '14–15 cm',     laryngoscope: '2',             oralAirway: '60 mm',  nasalAirway: '22 F',  kingAirway: '2',   iGel: '2.0', suctionCatheter: '10 Fr',   ioNeedle: 'Blue (15mm)' },
  Blue:   { ettSize: '5.5',            ettDepth: '15.5–16.5 cm', laryngoscope: '2',             oralAirway: '70 mm',  nasalAirway: '24 F',  kingAirway: '2',   iGel: '2.0', suctionCatheter: '10 Fr',   ioNeedle: 'Blue (15mm)' },
  Orange: { ettSize: '6.0',            ettDepth: '17–18 cm',     laryngoscope: '2',             oralAirway: '80 mm',  nasalAirway: '26 F',  kingAirway: '2.5', iGel: '—',   suctionCatheter: '10 Fr',   ioNeedle: 'Blue (15mm)' },
  Green:  { ettSize: '6.5',            ettDepth: '18.5–19.5 cm', laryngoscope: '3',             oralAirway: '80 mm',  nasalAirway: '26 F',  kingAirway: '2.5', iGel: '—',   suctionCatheter: '10–12 Fr', ioNeedle: 'Blue (15mm)' },
};

// Medication dosing per 2024 GMVEMSC Dose Calculations (Page 19)
const MEDICATIONS = [
  { name: 'Epinephrine IV/IO (1:10,000)',  dose: 0.01,  unit: 'mg/kg',   concentration: '0.1 mg/mL (10 mL)',  maxDose: 1.0,   route: 'IV/IO',          notes: 'Cardiac arrest' },
  { name: 'Epinephrine IM (1:1,000)',      dose: 0.01,  unit: 'mg/kg',   concentration: '1 mg/mL (1 mL)',     maxDose: 0.5,   route: 'IM',             notes: 'Anaphylaxis' },
  { name: 'Adenosine (1st dose)',          dose: 0.1,   unit: 'mg/kg',   concentration: '3 mg/mL',            maxDose: 6,     route: 'Rapid IV push',  notes: 'SVT' },
  { name: 'Adenosine (2nd dose)',          dose: 0.2,   unit: 'mg/kg',   concentration: '3 mg/mL',            maxDose: 12,    route: 'Rapid IV push',  notes: 'SVT' },
  { name: 'Amiodarone',                   dose: 5,     unit: 'mg/kg',   concentration: '50 mg/mL',           maxDose: 300,   route: 'IV/IO',          notes: 'VF/pVT' },
  { name: 'Atropine',                     dose: 0.02,  unit: 'mg/kg',   concentration: '0.1 mg/mL',          minDose: 0.1, maxDose: 0.5, route: 'IV/IO', notes: 'Bradycardia' },
  { name: 'Calcium Chloride 10%',         dose: 20,    unit: 'mg/kg',   concentration: '100 mg/mL',          maxDose: 500,   route: 'Slow IV/IO',     notes: 'Hypocalcemia, hyperkalemia' },
  { name: 'Dextrose 10%',                 dose: 5,     unit: 'mL/kg',   concentration: '0.1 g/mL',           maxDose: 250,   route: 'IV/IO',          notes: 'Hypoglycemia' },
  { name: 'Diphenhydramine',              dose: 1,     unit: 'mg/kg',   concentration: '50 mg/mL',           maxDose: 50,    route: 'IV/IM',          notes: 'Allergic reaction' },
  { name: 'Fentanyl',                     dose: 1,     unit: 'mcg/kg',  concentration: '50 mcg/mL',          maxDose: 100,   route: 'IV/IO/IN/IM',    notes: 'Pain (+ 0.1 mL added to IN vol.)' },
  { name: 'Ipratropium (Atrovent)',       dose: 0,     unit: 'fixed',   concentration: '0.5 mg/2.5 mL',      maxDose: 0.5, fixedDose: 0.5, fixedUnit: 'mg', fixedVol: 2.5, route: 'Nebulized', notes: 'Bronchospasm' },
  { name: 'Ketamine IV',                  dose: 1,     unit: 'mg/kg',   concentration: '50 mg/mL',           maxDose: 100,   route: 'IV',             notes: 'Emergency sedation (≥8 y/o)' },
  { name: 'Ketamine IM',                  dose: 5,     unit: 'mg/kg',   concentration: '50 mg/mL',           maxDose: 250,   route: 'IM',             notes: 'Emergency sedation (≥8 y/o)' },
  { name: 'Lidocaine IV/IO',              dose: 1,     unit: 'mg/kg',   concentration: '20 mg/mL',           maxDose: 100,   route: 'IV/IO',          notes: 'VF/pVT alternative' },
  { name: 'Methylprednisolone',           dose: 2,     unit: 'mg/kg',   concentration: '125 mg/2 mL',        maxDose: 125,   route: 'IV',             notes: 'Asthma, inflammation' },
  { name: 'Midazolam IV/IO',              dose: 0.1,   unit: 'mg/kg',   concentration: '5 mg/mL',            maxDose: 2.5,   route: 'IV/IO',          notes: 'Seizure' },
  { name: 'Midazolam IN/IM',              dose: 0.2,   unit: 'mg/kg',   concentration: '5 mg/mL',            maxDose: 10,    route: 'IN/IM',          notes: 'Seizure (IM max 5 mg)' },
  { name: 'Naloxone',                     dose: 0.1,   unit: 'mg/kg',   concentration: '1 mg/mL',            maxDose: 2,     route: 'IV/IO/IN',       notes: 'Opioid reversal (>20 kg: 2 mg flat)' },
  { name: 'Ondansetron',                  dose: 0.1,   unit: 'mg/kg',   concentration: '2 mg/mL',            maxDose: 4,     route: 'IV/PO',          notes: 'Nausea/vomiting' },
  { name: 'Sodium Bicarbonate',           dose: 1,     unit: 'mEq/kg',  concentration: '1 mEq/mL',           maxDose: 100,   route: 'Slow IV/IO',     notes: 'Metabolic acidosis' },
  { name: 'Albuterol',                    dose: 0,     unit: 'fixed',   concentration: '2.5 mg/3 mL',        maxDose: 2.5, fixedDose: 2.5, fixedUnit: 'mg', fixedVol: 3, route: 'Nebulized', notes: 'Bronchospasm (max 3 doses)' },
] as const;

type Medication = typeof MEDICATIONS[number];

// Defibrillation / Cardioversion per 2024 PDF
const ELECTRICAL_THERAPY = [
  { name: 'Defibrillation 1st',  joules: 2,  unit: 'J/kg', max: 360 },
  { name: 'Defibrillation 2nd',  joules: 4,  unit: 'J/kg', max: 360 },
  { name: 'Defibrillation 3rd',  joules: 6,  unit: 'J/kg', max: 360 },
  { name: 'Defibrillation 4th',  joules: 8,  unit: 'J/kg', max: 360 },
  { name: 'Defibrillation 5th',  joules: 10, unit: 'J/kg', max: 360 },
  { name: 'Cardioversion 1st',   joules: 1,  unit: 'J/kg', max: 360 },
  { name: 'Cardioversion 2nd',   joules: 2,  unit: 'J/kg', max: 360 },
];

const PediatricResuscitationTape = () => {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<'length' | 'weight'>('length');
  const [length, setLength] = useState<string>('');
  const [manualWeight, setManualWeight] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showGuide, setShowGuide] = useState(false);

  const handleMedicationClick = (medName: string) => {
    const cleanName = medName.split('(')[0].split(' IV')[0].split(' IM')[0].split(' IN')[0].trim();
    navigate(`/dashboard/meds?med=${encodeURIComponent(cleanName)}`);
  };

  const lengthNum = parseFloat(length);
  const manualWeightNum = parseFloat(manualWeight);

  const zoneByLength = COLOR_ZONES.find(
    z => lengthNum >= z.minLength && lengthNum < z.maxLength
  );

  const zoneByWeight = manualWeightNum > 0
    ? COLOR_ZONES.reduce((prev, curr) =>
        Math.abs(curr.weightKg - manualWeightNum) < Math.abs(prev.weightKg - manualWeightNum) ? curr : prev
      )
    : null;

  const selectedZone = inputMode === 'length' ? zoneByLength : zoneByWeight;
  const equipment = selectedZone ? EQUIPMENT_BY_ZONE[selectedZone.color] : null;
  const vitals = selectedZone ? VITALS_BY_ZONE[selectedZone.color] : null;

  const weight = inputMode === 'weight' && manualWeightNum > 0
    ? manualWeightNum
    : (selectedZone?.weightKg || 0);

  const fluidBolus = Math.min(weight * 20, 500);

  const calculateDose = (med: Medication) => {
    if (!weight) return null;
    if ('fixedDose' in med && med.fixedDose) return med.fixedDose;
    let dose = weight * med.dose;
    if ('minDose' in med && med.minDose && dose < med.minDose) dose = med.minDose;
    if (med.maxDose && dose > med.maxDose) dose = med.maxDose;
    return dose;
  };

  const calculateVolume = (med: Medication, dose: number) => {
    if ('fixedVol' in med && med.fixedVol) return med.fixedVol;
    if (med.unit === 'mL/kg') return dose;
    const concMatch = med.concentration.match(/(\d+\.?\d*)\s*(mg|mcg|mEq)\/(?:\d+\.?\d*\s*)?mL/);
    if (!concMatch) return null;
    const concValue = parseFloat(concMatch[1]);
    // Handle concentrations like "125 mg/2 mL"
    const denomMatch = med.concentration.match(/(\d+\.?\d*)\s*(?:mg|mcg|mEq)\/(\d+\.?\d*)\s*mL/);
    if (denomMatch) {
      const num = parseFloat(denomMatch[1]);
      const denom = parseFloat(denomMatch[2]);
      return dose / (num / denom);
    }
    return dose / concValue;
  };

  const getDoseUnit = (med: Medication) => {
    if ('fixedUnit' in med && med.fixedUnit) return med.fixedUnit;
    return med.unit.split('/')[0];
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-soft rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Pediatric Resuscitation Tape</CardTitle>
              <p className="text-sm text-muted-foreground">2024 GMVEMSC Pediatric Dose Chart — Broselow-style</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(true)}
            className="mt-4 gap-2"
          >
            <BookOpen className="w-4 h-4" />
            How to Use
          </Button>
          <PediatricResusGuide open={showGuide} onOpenChange={setShowGuide} />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Mode Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
            <button
              onClick={() => setInputMode('length')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'length'
                  ? 'bg-[#C62828] text-white'
                  : 'hover:text-[#C62828]'
              }`}
            >
              <Ruler className="w-4 h-4 inline mr-2" />
              By Length
            </button>
            <button
              onClick={() => setInputMode('weight')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'weight'
                  ? 'bg-[#C62828] text-white'
                  : 'hover:text-[#C62828]'
              }`}
            >
              <Scale className="w-4 h-4 inline mr-2" />
              By Weight
            </button>
          </div>

          {/* Length Input */}
          {inputMode === 'length' && (
            <div className="space-y-2">
              <Label htmlFor="length" className="text-base font-medium">Patient Length (cm)</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="length"
                  type="number"
                  placeholder="Enter length in cm (46-123)"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="text-lg rounded-xl max-w-xs"
                  min={46}
                  max={150}
                />
                {selectedZone && (
                  <Badge className={`${selectedZone.bgClass} ${selectedZone.textClass} px-4 py-2 text-base font-bold`}>
                    {selectedZone.color} Zone
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Measure from head to heel with child supine</p>
            </div>
          )}

          {/* Weight Input */}
          {inputMode === 'weight' && (
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-base font-medium">Patient Weight (kg)</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight in kg (3-36)"
                  value={manualWeight}
                  onChange={(e) => setManualWeight(e.target.value)}
                  className="text-lg rounded-xl max-w-xs"
                  min={1}
                  max={80}
                  step={0.1}
                />
                {selectedZone && (
                  <Badge className={`${selectedZone.bgClass} ${selectedZone.textClass} px-4 py-2 text-base font-bold`}>
                    {selectedZone.color} Zone
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Uses actual weight for precise dosing calculations</p>
            </div>
          )}

          {/* Color Zone Visual */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Color Zones</Label>
            <div className="flex gap-1 rounded-xl overflow-hidden">
              {COLOR_ZONES.map((zone) => (
                <div
                  key={zone.color}
                  className={`flex-1 h-8 ${zone.bgClass} ${
                    selectedZone?.color === zone.color ? 'ring-2 ring-primary ring-offset-2' : ''
                  } transition-all cursor-pointer flex items-center justify-center`}
                  onClick={() => {
                    if (inputMode === 'length') {
                      setLength(String(zone.minLength + 2));
                    } else {
                      setManualWeight(String(zone.weightKg));
                    }
                  }}
                  title={`${zone.color}: ${zone.ageRange}, ${zone.weightRange}`}
                >
                  <span className={`text-[10px] font-bold ${zone.textClass} hidden sm:inline`}>
                    {zone.weightKg}kg
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {selectedZone ? (
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="bg-muted/30 border-0">
                  <CardContent className="p-4 text-center">
                    <Scale className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold text-primary">
                      {inputMode === 'weight' ? manualWeightNum.toFixed(1) : selectedZone.weightKg} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inputMode === 'weight' ? 'Actual Weight' : `Est. Weight (${selectedZone.weightRange})`}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-0">
                  <CardContent className="p-4 text-center">
                    <Baby className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{selectedZone.ageRange}</p>
                    <p className="text-xs text-muted-foreground">Est. Age</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-0">
                  <CardContent className="p-4 text-center">
                    <Stethoscope className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{equipment?.ettSize}</p>
                    <p className="text-xs text-muted-foreground">ETT Size (mm)</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-0">
                  <CardContent className="p-4 text-center">
                    <Droplets className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{fluidBolus} mL</p>
                    <p className="text-xs text-muted-foreground">Fluid Bolus (NS)</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-xl">
                  <TabsTrigger value="overview" className="rounded-lg hover:text-[#C62828] data-[state=active]:bg-[#C62828] data-[state=active]:text-white">Overview</TabsTrigger>
                  <TabsTrigger value="vitals" className="rounded-lg hover:text-[#C62828] data-[state=active]:bg-[#C62828] data-[state=active]:text-white">Vitals</TabsTrigger>
                  <TabsTrigger value="medications" className="rounded-lg hover:text-[#C62828] data-[state=active]:bg-[#C62828] data-[state=active]:text-white">Medications</TabsTrigger>
                  <TabsTrigger value="equipment" className="rounded-lg hover:text-[#C62828] data-[state=active]:bg-[#C62828] data-[state=active]:text-white">Equipment</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <Alert className="border-primary/30 bg-primary/5">
                    <Syringe className="h-4 w-4" />
                    <AlertTitle>Quick Reference — {selectedZone.color} Zone ({selectedZone.weightRange})</AlertTitle>
                    <AlertDescription className="mt-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Epinephrine IV/IO:</span> {Math.min(weight * 0.01, 1).toFixed(2)} mg ({Math.min(weight * 0.1, 10).toFixed(1)} mL)</div>
                        <div><span className="font-medium">Amiodarone:</span> {Math.min(weight * 5, 300)} mg ({Math.min(weight * 5 / 50, 6).toFixed(1)} mL)</div>
                        <div><span className="font-medium">Defib 1st/2nd:</span> {Math.min(weight * 2, 360)} / {Math.min(weight * 4, 360)} J</div>
                        <div><span className="font-medium">Cardioversion:</span> {Math.min(weight * 1, 360)} / {Math.min(weight * 2, 360)} J</div>
                        <div><span className="font-medium">ETT:</span> {equipment?.ettSize} mm — Depth: {equipment?.ettDepth}</div>
                        <div><span className="font-medium">Fluid Bolus:</span> {fluidBolus} mL (20 mL/kg, max 500)</div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Electrical Therapy */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Defibrillation & Cardioversion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {ELECTRICAL_THERAPY.map((therapy) => {
                          const energy = Math.min(Math.round(weight * therapy.joules), therapy.max);
                          return (
                            <div key={therapy.name} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                              <span className="font-medium text-sm">{therapy.name}</span>
                              <div className="text-right">
                                <span className="text-lg font-bold text-primary">{energy} J</span>
                                <span className="text-xs text-muted-foreground ml-2">({therapy.joules} {therapy.unit})</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vitals" className="mt-4">
                  {vitals && (
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Heart className="w-4 h-4 text-destructive" />
                          Vital Signs — {selectedZone.color} Zone
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-border/30">
                            <span className="font-medium text-sm flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" /> Heart Rate
                            </span>
                            <span className="font-bold text-primary">{vitals.heartRate}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/30">
                            <span className="font-medium text-sm flex items-center gap-2">
                              <Wind className="w-4 h-4 text-blue-500" /> Respiratory Rate
                            </span>
                            <span className="font-bold text-primary">{vitals.respRate}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-border/30">
                            <span className="font-medium text-sm">Min. SBP (mmHg)</span>
                            <span className="font-bold text-primary">{vitals.minSBP}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium text-sm">Ventilation Rate</span>
                            <span className="font-bold text-primary">{vitals.ventRate}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {MEDICATIONS.map((med) => {
                      const dose = calculateDose(med);
                      const volume = dose ? calculateVolume(med, dose) : null;
                      const unit = getDoseUnit(med);
                      return (
                        <Card
                          key={med.name}
                          className="border-border/30 overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                          onClick={() => handleMedicationClick(med.name)}
                        >
                          <CardContent className="p-0">
                            <div className="p-3 pb-2 flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{med.name}</p>
                                <p className="text-xs text-muted-foreground">{med.concentration}</p>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 border-y border-blue-200 dark:border-blue-800">
                              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                <span className="font-bold">Indication:</span> {med.notes}
                              </p>
                            </div>

                            <div className="px-3 py-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#E57373] text-white font-bold px-3 py-1">
                                  {med.route}
                                </Badge>
                                {med.unit !== 'fixed' && (
                                  <span className="text-xs text-muted-foreground">({med.dose} {med.unit})</span>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  {dose !== null ? (Number.isInteger(dose) ? dose : dose.toFixed(2)) : '—'} {unit}
                                </p>
                                {volume !== null && (
                                  <p className="text-sm font-medium text-muted-foreground">
                                    = {volume.toFixed(2)} mL
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="equipment" className="mt-4">
                  {equipment && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(equipment).map(([key, value]) => {
                        const labels: Record<string, string> = {
                          ettSize: 'ETT Size (mm)',
                          ettDepth: 'ETT Depth',
                          laryngoscope: 'Laryngoscope Blade',
                          oralAirway: 'Oral Airway (OPA)',
                          nasalAirway: 'Nasal Airway (NPA)',
                          kingAirway: 'King Airway',
                          iGel: 'i-gel',
                          suctionCatheter: 'Suction Catheter',
                          ioNeedle: 'IO Needle',
                        };
                        return (
                          <div key={key} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">{labels[key] || key}</span>
                            <span className="font-semibold text-primary">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (inputMode === 'length' && length && lengthNum > 0) ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Out of Range</AlertTitle>
              <AlertDescription>
                Enter a length between 46–123 cm. For larger children, switch to weight-based mode.
              </AlertDescription>
            </Alert>
          ) : (inputMode === 'weight' && manualWeight && manualWeightNum > 80) ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Weight Exceeds Pediatric Range</AlertTitle>
              <AlertDescription>
                This tool covers pediatric patients ≤ 15 y/o per the 2024 GMVEMSC Dose Chart. Consider adult protocols for larger patients.
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Clinical Pearls */}
          {selectedZone && (
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">Clinical Pearls</AlertTitle>
              <AlertDescription className="mt-2 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <p>• If actual weight is available, use the corresponding color zone for dosage calculations.</p>
                <p>• If child appears to have a large body habitus, consider using a higher color/age zone for dosing. Use measured length zone for equipment.</p>
                <p>• Defibrillation and cardioversion Joules should be rounded up to the available setting.</p>
                <p>• Fentanyl IN is first choice for pediatrics. An additional 0.1 mL is added to IN volumes for needle/syringe dead space.</p>
                <p>• Ketamine: emergency sedation only (not for pain). Limited use in patients age ≥ 8 y/o. Max 250 mg IM.</p>
                <p>• Patient must be ≥ 8 y/o for surgical airway. Field termination does not apply to pediatric patients.</p>
              </AlertDescription>
            </Alert>
          )}

          {/* References */}
          <div className="pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              <strong>Reference:</strong> 2024 GMVEMSC Pediatric Dose Chart (Pedi-Wheel / Broselow Tape). 
              All dosages based on listed concentrations — confirm prior to using volumes. 
              Maximum pediatric dose = adult dose unless otherwise specified. Pediatric patients are ≤ 15 y/o.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PediatricResuscitationTape;
