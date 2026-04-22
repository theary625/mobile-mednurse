import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tablets, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';

interface DOACResult {
  drug: string;
  indication: string;
  recommendedDose: string;
  adjustmentReason: string;
  status: 'standard' | 'reduced' | 'avoid' | 'contraindicated';
  warnings: string[];
}

const DOACRenalCalculator = () => {
  const [crcl, setCrcl] = useState('');
  const [drug, setDrug] = useState('');
  const [indication, setIndication] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<DOACResult | null>(null);

  const calculate = () => {
    const crclValue = parseFloat(crcl);
    const ageValue = parseFloat(age);
    const weightValue = parseFloat(weight);
    
    if (isNaN(crclValue) || !drug || !indication) return;

    let recommendedDose = '';
    let adjustmentReason = '';
    let status: DOACResult['status'] = 'standard';
    const warnings: string[] = [];

    // Apixaban (Eliquis)
    if (drug === 'apixaban') {
      if (indication === 'afib') {
        // Check for dose reduction criteria (2 of 3: age ≥80, weight ≤60kg, SCr ≥1.5)
        let reductionCriteria = 0;
        if (ageValue >= 80) reductionCriteria++;
        if (weightValue <= 60) reductionCriteria++;
        // Assume SCr if CrCl very low
        if (crclValue < 25) reductionCriteria++;

        if (crclValue < 15) {
          recommendedDose = 'Not recommended (limited data)';
          adjustmentReason = 'CrCl < 15 mL/min';
          status = 'avoid';
        } else if (crclValue < 25 || reductionCriteria >= 2) {
          recommendedDose = '2.5 mg twice daily';
          adjustmentReason = reductionCriteria >= 2 ? '≥2 dose reduction criteria met' : 'CrCl < 25 mL/min';
          status = 'reduced';
        } else {
          recommendedDose = '5 mg twice daily';
          adjustmentReason = 'Standard dose';
          status = 'standard';
        }
      } else if (indication === 'vte') {
        if (crclValue < 25) {
          recommendedDose = 'Use with caution (limited data)';
          adjustmentReason = 'CrCl < 25 mL/min';
          status = 'avoid';
        } else {
          recommendedDose = '10 mg BID x 7 days, then 5 mg BID';
          adjustmentReason = 'No renal adjustment for CrCl ≥25';
          status = 'standard';
        }
      }
    }

    // Rivaroxaban (Xarelto)
    else if (drug === 'rivaroxaban') {
      if (indication === 'afib') {
        if (crclValue < 15) {
          recommendedDose = 'Avoid use';
          adjustmentReason = 'CrCl < 15 mL/min';
          status = 'contraindicated';
        } else if (crclValue <= 50) {
          recommendedDose = '15 mg once daily with food';
          adjustmentReason = 'CrCl 15-50 mL/min';
          status = 'reduced';
        } else {
          recommendedDose = '20 mg once daily with food';
          adjustmentReason = 'CrCl > 50 mL/min';
          status = 'standard';
        }
      } else if (indication === 'vte') {
        if (crclValue < 30) {
          recommendedDose = 'Avoid if CrCl < 30';
          adjustmentReason = 'CrCl < 30 mL/min';
          status = 'avoid';
        } else {
          recommendedDose = '15 mg BID x 21 days, then 20 mg daily';
          adjustmentReason = 'No adjustment for CrCl ≥30';
          status = 'standard';
        }
      }
    }

    // Dabigatran (Pradaxa)
    else if (drug === 'dabigatran') {
      if (indication === 'afib') {
        if (crclValue < 15) {
          recommendedDose = 'Contraindicated';
          adjustmentReason = 'CrCl < 15 mL/min';
          status = 'contraindicated';
        } else if (crclValue < 30) {
          recommendedDose = '75 mg twice daily';
          adjustmentReason = 'CrCl 15-30 mL/min';
          status = 'reduced';
          warnings.push('Consider alternative agent');
        } else if (crclValue <= 50) {
          recommendedDose = '150 mg twice daily (or 75 mg if on P-gp inhibitor)';
          adjustmentReason = 'CrCl 30-50 with P-gp inhibitor interaction';
          status = 'standard';
        } else {
          recommendedDose = '150 mg twice daily';
          adjustmentReason = 'CrCl > 50 mL/min';
          status = 'standard';
        }
      } else if (indication === 'vte') {
        if (crclValue < 30) {
          recommendedDose = 'Avoid use';
          adjustmentReason = 'CrCl < 30 mL/min';
          status = 'avoid';
        } else {
          recommendedDose = '150 mg twice daily (after 5-10 days parenteral)';
          adjustmentReason = 'CrCl ≥30 mL/min';
          status = 'standard';
        }
      }
    }

    // Edoxaban (Savaysa)
    else if (drug === 'edoxaban') {
      if (indication === 'afib') {
        if (crclValue < 15) {
          recommendedDose = 'Not recommended';
          adjustmentReason = 'CrCl < 15 mL/min';
          status = 'contraindicated';
        } else if (crclValue <= 50) {
          recommendedDose = '30 mg once daily';
          adjustmentReason = 'CrCl 15-50 mL/min';
          status = 'reduced';
        } else if (crclValue > 95) {
          recommendedDose = 'Avoid use - reduced efficacy';
          adjustmentReason = 'CrCl > 95 mL/min';
          status = 'avoid';
          warnings.push('Reduced efficacy in patients with CrCl > 95');
        } else {
          recommendedDose = '60 mg once daily';
          adjustmentReason = 'CrCl 51-95 mL/min';
          status = 'standard';
        }
      } else if (indication === 'vte') {
        if (crclValue < 15) {
          recommendedDose = 'Not recommended';
          adjustmentReason = 'CrCl < 15 mL/min';
          status = 'contraindicated';
        } else if (crclValue <= 50 || weightValue <= 60) {
          recommendedDose = '30 mg once daily (after 5-10 days parenteral)';
          adjustmentReason = 'CrCl ≤50 or weight ≤60 kg';
          status = 'reduced';
        } else {
          recommendedDose = '60 mg once daily (after 5-10 days parenteral)';
          adjustmentReason = 'Standard dosing';
          status = 'standard';
        }
      }
    }

    const drugNames: Record<string, string> = {
      apixaban: 'Apixaban (Eliquis)',
      rivaroxaban: 'Rivaroxaban (Xarelto)',
      dabigatran: 'Dabigatran (Pradaxa)',
      edoxaban: 'Edoxaban (Savaysa)',
    };

    const indicationNames: Record<string, string> = {
      afib: 'Atrial Fibrillation',
      vte: 'VTE Treatment/Prevention',
    };

    setResult({
      drug: drugNames[drug],
      indication: indicationNames[indication],
      recommendedDose,
      adjustmentReason,
      status,
      warnings,
    });
  };

  const getStatusStyles = (status: DOACResult['status']) => {
    switch (status) {
      case 'standard':
        return { border: 'border-success/30 bg-success/5', icon: CheckCircle2, color: 'text-success' };
      case 'reduced':
        return { border: 'border-yellow-500/30 bg-yellow-500/5', icon: AlertTriangle, color: 'text-yellow-600' };
      case 'avoid':
        return { border: 'border-orange-500/30 bg-orange-500/5', icon: AlertTriangle, color: 'text-orange-600' };
      case 'contraindicated':
        return { border: 'border-destructive/30 bg-destructive/5', icon: XCircle, color: 'text-destructive' };
    }
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
            <Tablets className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <CardTitle className="text-lg">DOAC Renal Dosing</CardTitle>
            <CardDescription>CrCl-based dose adjustments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div>
          <Label className="text-sm font-medium">DOAC Medication</Label>
          <Select value={drug} onValueChange={setDrug}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue placeholder="Select DOAC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apixaban">Apixaban (Eliquis)</SelectItem>
              <SelectItem value="rivaroxaban">Rivaroxaban (Xarelto)</SelectItem>
              <SelectItem value="dabigatran">Dabigatran (Pradaxa)</SelectItem>
              <SelectItem value="edoxaban">Edoxaban (Savaysa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Indication</Label>
          <Select value={indication} onValueChange={setIndication}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue placeholder="Select indication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="afib">Atrial Fibrillation</SelectItem>
              <SelectItem value="vte">VTE Treatment/Prevention</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">CrCl (mL/min)</Label>
            <Input
              type="number"
              placeholder="60"
              value={crcl}
              onChange={(e) => setCrcl(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Age (years)</Label>
            <Input
              type="number"
              placeholder="65"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Weight (kg)</Label>
            <Input
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Dose
        </Button>

        {result && (
          <div className={`p-5 rounded-2xl border-2 ${getStatusStyles(result.status).border}`}>
            <div className="flex items-center gap-2 mb-3">
              {(() => {
                const StatusIcon = getStatusStyles(result.status).icon;
                return <StatusIcon className={`w-5 h-5 ${getStatusStyles(result.status).color}`} />;
              })()}
              <span className="font-semibold">{result.drug}</span>
              <Badge variant="outline" className="ml-auto rounded-lg">{result.indication}</Badge>
            </div>

            <div className="p-4 bg-background/50 rounded-xl mb-3">
              <p className="text-sm text-muted-foreground">Recommended Dose</p>
              <p className="text-xl font-bold">{result.recommendedDose}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.adjustmentReason}</p>
            </div>

            {result.warnings.length > 0 && (
              <div className="space-y-2">
                {result.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-700">{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Always verify with current prescribing information. Consider drug interactions (P-gp inhibitors, CYP3A4).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DOACRenalCalculator;
