import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const GBSProphylaxisCalculator: React.FC = () => {
  const [gbsStatus, setGbsStatus] = useState<string>('');
  const [gbsUti, setGbsUti] = useState(false);
  const [prevGbsBaby, setPrevGbsBaby] = useState(false);
  const [pretermLabor, setPreTermLabor] = useState(false);
  const [romDuration, setRomDuration] = useState<string>('');
  const [fever, setFever] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const determineIAP = () => {
    // Indications for Intrapartum Antibiotic Prophylaxis (IAP) per CDC/ACOG guidelines

    let indicated = false;
    let reason = '';
    let notes: string[] = [];

    // Absolute indications (regardless of GBS status)
    if (prevGbsBaby) {
      indicated = true;
      reason = 'Previous infant with invasive GBS disease';
      notes.push('IAP indicated regardless of current GBS culture status');
    } else if (gbsUti) {
      indicated = true;
      reason = 'GBS bacteriuria during current pregnancy';
      notes.push('Indicates heavy colonization; IAP indicated regardless of culture');
    } else if (gbsStatus === 'positive') {
      indicated = true;
      reason = 'Positive GBS vaginal-rectal culture at 36-37 weeks';
      notes.push('Standard indication for IAP');
    } else if (gbsStatus === 'unknown') {
      // Risk-based approach for unknown status
      if (pretermLabor) {
        indicated = true;
        reason = 'Unknown GBS status with preterm labor (<37 weeks)';
        notes.push('Preterm delivery is a risk factor for GBS disease');
      } else if (romDuration === 'prolonged') {
        indicated = true;
        reason = 'Unknown GBS status with prolonged ROM (≥18 hours)';
        notes.push('Prolonged membrane rupture increases transmission risk');
      } else if (fever) {
        indicated = true;
        reason = 'Unknown GBS status with intrapartum fever (≥100.4°F/38°C)';
        notes.push('Fever may indicate chorioamnionitis');
      }
    }

    // Not indicated scenarios
    if (gbsStatus === 'negative' && !prevGbsBaby && !gbsUti) {
      indicated = false;
      reason = 'Negative GBS culture at 36-37 weeks';
      notes.push('Culture valid for 5 weeks from collection');
      notes.push('Re-screen if delivery >5 weeks after culture');
    }

    // Cesarean before labor with intact membranes
    // This would need additional UI but noting as special case

    let severity = indicated ? 'indicated' : 'not-indicated';

    return {
      indicated,
      reason,
      notes,
      severity
    };
  };

  const result = showResults ? determineIAP() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'indicated':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'not-indicated':
        return 'bg-green-100 border-green-200 text-green-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-800';
    }
  };

  const resetForm = () => {
    setGbsStatus('');
    setGbsUti(false);
    setPrevGbsBaby(false);
    setPreTermLabor(false);
    setRomDuration('');
    setFever(false);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">GBS Prophylaxis Criteria</CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Intrapartum Antibiotic Prophylaxis (IAP) Decision Support
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* GBS Culture Status */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">GBS Vaginal-Rectal Culture Status (36-37 weeks)</Label>
          <RadioGroup value={gbsStatus} onValueChange={setGbsStatus} className="grid sm:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="positive" id="gbs-positive" />
              <Label htmlFor="gbs-positive" className="cursor-pointer font-medium">Positive</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="negative" id="gbs-negative" />
              <Label htmlFor="gbs-negative" className="cursor-pointer font-medium">Negative</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="unknown" id="gbs-unknown" />
              <Label htmlFor="gbs-unknown" className="cursor-pointer font-medium">Unknown/Not Done</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Absolute Indications */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">History (Absolute Indications)</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-red-50">
              <Checkbox
                id="prev-gbs-baby"
                checked={prevGbsBaby}
                onCheckedChange={(checked) => setPrevGbsBaby(checked as boolean)}
              />
              <Label htmlFor="prev-gbs-baby" className="cursor-pointer text-sm">
                Previous infant with invasive GBS disease
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-red-50">
              <Checkbox
                id="gbs-uti"
                checked={gbsUti}
                onCheckedChange={(checked) => setGbsUti(checked as boolean)}
              />
              <Label htmlFor="gbs-uti" className="cursor-pointer text-sm">
                GBS bacteriuria during this pregnancy
              </Label>
            </div>
          </div>
        </div>

        {/* Risk Factors (for unknown status) */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Risk Factors (if GBS status unknown)</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-amber-50">
              <Checkbox
                id="preterm"
                checked={pretermLabor}
                onCheckedChange={(checked) => setPreTermLabor(checked as boolean)}
              />
              <Label htmlFor="preterm" className="cursor-pointer text-sm">
                Preterm labor (&lt;37 weeks gestation)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-amber-50">
              <Checkbox
                id="fever"
                checked={fever}
                onCheckedChange={(checked) => setFever(checked as boolean)}
              />
              <Label htmlFor="fever" className="cursor-pointer text-sm">
                Intrapartum fever (≥100.4°F / 38°C)
              </Label>
            </div>
          </div>

          <div className="space-y-2 mt-3">
            <Label className="text-sm">Rupture of Membranes Duration</Label>
            <RadioGroup value={romDuration} onValueChange={setRomDuration} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="rom-normal" />
                <Label htmlFor="rom-normal" className="cursor-pointer text-sm">&lt;18 hours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prolonged" id="rom-prolonged" />
                <Label htmlFor="rom-prolonged" className="cursor-pointer text-sm">≥18 hours</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Determine IAP Need
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              {result.indicated ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <XCircle className="h-8 w-8" />
              )}
              <p className="text-2xl font-bold">
                {result.indicated ? 'IAP INDICATED' : 'IAP NOT INDICATED'}
              </p>
            </div>
            <p className="text-center font-medium">{result.reason}</p>
            {result.notes.length > 0 && (
              <ul className="mt-4 text-sm space-y-1 list-disc list-inside">
                {result.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Recommended IAP Regimen (CDC 2020):</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>First-line:</strong> Penicillin G 5 million units IV, then 2.5-3 million units q4h</li>
            <li><strong>Alternative:</strong> Ampicillin 2g IV, then 1g q4h</li>
            <li><strong>PCN allergy (low risk):</strong> Cefazolin 2g IV, then 1g q8h</li>
            <li><strong>PCN allergy (high risk):</strong> Vancomycin 20mg/kg IV q8h (max 2g/dose)</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Special Cases:</p>
            <ul className="mt-1 space-y-1">
              <li>• <strong>Planned cesarean before labor with intact membranes:</strong> IAP not needed regardless of GBS status</li>
              <li>• <strong>GBS culture valid:</strong> 5 weeks from collection date</li>
              <li>• <strong>Adequate prophylaxis:</strong> ≥4 hours before delivery</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Neonates exposed to GBS (maternal colonization) should be observed 
            for signs of sepsis. Duration and need for evaluation depends on maternal IAP adequacy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GBSProphylaxisCalculator;
