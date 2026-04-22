import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';

interface MagnesiumResult {
  severity: 'mild' | 'moderate' | 'severe';
  ivDose: string;
  oralDose: string;
  infusionRate: string;
  monitoring: string;
}

const MagnesiumReplacementCalculator: React.FC = () => {
  const [currentMg, setCurrentMg] = useState('');
  const [indication, setIndication] = useState<'replacement' | 'eclampsia' | 'torsades'>('replacement');
  const [result, setResult] = useState<MagnesiumResult | null>(null);

  const calculate = () => {
    // Handle special indications
    if (indication === 'eclampsia') {
      setResult({
        severity: 'severe',
        ivDose: 'Loading: 4-6g IV over 20-30 min',
        oralDose: 'N/A - IV only for eclampsia',
        infusionRate: 'Maintenance: 1-2g/hr IV',
        monitoring: 'Continuous monitoring: reflexes, respiratory rate, urine output. Target Mg 4-7 mEq/L.'
      });
      return;
    }

    if (indication === 'torsades') {
      setResult({
        severity: 'severe',
        ivDose: '1-2g IV push over 1-2 min',
        oralDose: 'N/A - IV only for torsades',
        infusionRate: 'May repeat in 5-15 min if needed. Infusion: 1-2g/hr if recurrent.',
        monitoring: 'Continuous cardiac monitoring. Have defibrillator ready.'
      });
      return;
    }

    // Standard replacement based on level
    const mg = parseFloat(currentMg);
    if (!mg || mg <= 0 || mg >= 3) return;

    let severity: 'mild' | 'moderate' | 'severe';
    let ivDose: string;
    let oralDose: string;
    let infusionRate: string;
    let monitoring: string;

    if (mg >= 1.8) {
      setResult(null);
      return;
    } else if (mg >= 1.5) {
      severity = 'mild';
      ivDose = '1-2g MgSO4 IV';
      oralDose = 'Magnesium oxide 400-800mg PO daily';
      infusionRate = 'Infuse over 1-2 hours';
      monitoring = 'Recheck in 24 hours';
    } else if (mg >= 1.0) {
      severity = 'moderate';
      ivDose = '2-4g MgSO4 IV';
      oralDose = 'IV preferred, can add oral supplementation';
      infusionRate = 'Infuse over 2-4 hours';
      monitoring = 'Recheck in 6-12 hours';
    } else {
      severity = 'severe';
      ivDose = '4-6g MgSO4 IV (may need repeated doses)';
      oralDose = 'IV replacement required';
      infusionRate = 'First 2g over 1 hour, then 1g/hr';
      monitoring = 'Continuous cardiac monitoring. Recheck q4-6h.';
    }

    setResult({
      severity,
      ivDose,
      oralDose,
      infusionRate,
      monitoring
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-amber-50 border-amber-200';
      case 'severe': return 'bg-red-50 border-red-200';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Magnesium Replacement Calculator</CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Hypomagnesemia, eclampsia & torsades dosing
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Administration Warning</p>
            <p>Rapid IV magnesium can cause hypotension and cardiac arrest. Monitor closely during infusion.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="indication">Indication</Label>
            <Select value={indication} onValueChange={(v) => setIndication(v as 'replacement' | 'eclampsia' | 'torsades')}>
              <SelectTrigger id="indication">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="replacement">Standard Replacement (Hypomagnesemia)</SelectItem>
                <SelectItem value="eclampsia">Eclampsia / Pre-eclampsia</SelectItem>
                <SelectItem value="torsades">Torsades de Pointes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {indication === 'replacement' && (
            <div>
              <Label htmlFor="current-mg">Current Magnesium (mg/dL)</Label>
              <Input
                id="current-mg"
                type="number"
                value={currentMg}
                onChange={(e) => setCurrentMg(e.target.value)}
                placeholder="e.g., 1.4"
                min="0"
                max="3"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">Normal range: 1.8-2.4 mg/dL</p>
            </div>
          )}
        </div>

        <Button onClick={calculate} disabled={indication === 'replacement' && !currentMg} className="w-full">
          {indication === 'replacement' ? 'Calculate Replacement' : 'Show Protocol'}
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className={`p-4 rounded-lg border ${getSeverityColor(result.severity)}`}>
              {indication === 'replacement' && (
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    result.severity === 'mild' ? 'bg-green-200 text-green-800' :
                    result.severity === 'moderate' ? 'bg-amber-200 text-amber-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {result.severity} Hypomagnesemia
                  </span>
                </div>
              )}
              
              {indication !== 'replacement' && (
                <h3 className="font-bold text-lg mb-3">
                  {indication === 'eclampsia' ? 'Eclampsia Protocol' : 'Torsades Protocol'}
                </h3>
              )}
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IV Dose</p>
                  <p className="font-bold text-primary">{result.ivDose}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Infusion Rate</p>
                  <p className="font-bold">{result.infusionRate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Oral Option</p>
                  <p className="font-semibold">{result.oralDose}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monitoring</p>
                  <p className="font-semibold">{result.monitoring}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">MgSO4 Reference</p>
          <div className="text-sm space-y-1">
            <p>• 1g MgSO4 = 8.12 mEq = 4 mmol magnesium</p>
            <p>• 1g MgSO4 typically diluted in 100mL NS or D5W</p>
            <p>• Max infusion rate (non-emergent): 1g/hr</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• Correct Mg before K+ - hypomagnesemia causes refractory hypokalemia</li>
                <li>• Reduce dose in renal impairment (CrCl &lt;30: reduce by 50%)</li>
                <li>• Signs of toxicity: loss of reflexes, respiratory depression, bradycardia</li>
                <li>• Antidote for Mg toxicity: Calcium gluconate 1g IV</li>
                <li>• Oral absorption is poor (~30-40%) - IV preferred for moderate/severe</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MagnesiumReplacementCalculator;
