import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Info } from 'lucide-react';

interface PotassiumResult {
  deficit: string;
  ivDose: string;
  oralDose: string;
  maxRate: string;
  route: string;
  severity: 'mild' | 'moderate' | 'severe';
}

const PotassiumReplacementCalculator: React.FC = () => {
  const [currentK, setCurrentK] = useState('');
  const [access, setAccess] = useState<'peripheral' | 'central'>('peripheral');
  const [result, setResult] = useState<PotassiumResult | null>(null);

  const calculate = () => {
    const k = parseFloat(currentK);
    if (!k || k <= 0 || k >= 6) return;

    let severity: 'mild' | 'moderate' | 'severe';
    let ivDose: string;
    let oralDose: string;
    let deficit: string;
    let maxRate: string;
    let route: string;

    if (k >= 3.5) {
      // Normal range
      setResult(null);
      return;
    } else if (k >= 3.0) {
      // Mild: 3.0-3.4
      severity = 'mild';
      deficit = 'Approximately 100-200 mEq total body deficit';
      ivDose = '10-20 mEq IV';
      oralDose = '40-80 mEq PO (divided doses)';
      route = 'Oral preferred if tolerating PO';
      maxRate = access === 'peripheral' ? '10 mEq/hr via peripheral' : '20 mEq/hr via central';
    } else if (k >= 2.5) {
      // Moderate: 2.5-2.9
      severity = 'moderate';
      deficit = 'Approximately 200-400 mEq total body deficit';
      ivDose = '20-40 mEq IV';
      oralDose = '80-120 mEq PO (divided doses)';
      route = 'IV preferred, can supplement with PO';
      maxRate = access === 'peripheral' ? '10 mEq/hr via peripheral' : '20 mEq/hr via central';
    } else {
      // Severe: <2.5
      severity = 'severe';
      deficit = 'Approximately 400-800+ mEq total body deficit';
      ivDose = '40-80 mEq IV (may need repeated doses)';
      oralDose = 'IV replacement primary, PO supplementation';
      route = 'IV required - telemetry monitoring recommended';
      maxRate = access === 'central' ? 'Up to 40 mEq/hr via central with cardiac monitoring' : '10 mEq/hr - consider central access';
    }

    setResult({
      deficit,
      ivDose,
      oralDose,
      maxRate,
      route,
      severity
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
        <CardTitle className="text-xl font-bold">Potassium Replacement Calculator</CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Hypokalemia replacement protocol
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">High-Risk Electrolyte</p>
            <p>IV potassium can cause fatal arrhythmias. Always verify rate and monitor ECG for severe hypokalemia.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current-k">Current Potassium (mEq/L)</Label>
            <Input
              id="current-k"
              type="number"
              value={currentK}
              onChange={(e) => setCurrentK(e.target.value)}
              placeholder="e.g., 3.2"
              min="1"
              max="6"
              step="0.1"
            />
          </div>
          <div>
            <Label>IV Access Type</Label>
            <RadioGroup value={access} onValueChange={(v) => setAccess(v as 'peripheral' | 'central')} className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="peripheral" id="peripheral" />
                <Label htmlFor="peripheral" className="cursor-pointer">Peripheral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="central" id="central" />
                <Label htmlFor="central" className="cursor-pointer">Central</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={calculate} disabled={!currentK} className="w-full">
          Calculate Replacement
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className={`p-4 rounded-lg border ${getSeverityColor(result.severity)}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  result.severity === 'mild' ? 'bg-green-200 text-green-800' :
                  result.severity === 'moderate' ? 'bg-amber-200 text-amber-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {result.severity} Hypokalemia
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Deficit</p>
                  <p className="font-semibold">{result.deficit}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">IV Dose</p>
                    <p className="font-bold text-primary">{result.ivDose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Oral Dose</p>
                    <p className="font-bold">{result.oralDose}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Maximum Rate</p>
                  <p className="font-bold text-primary">{result.maxRate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recommended Route</p>
                  <p className="font-semibold">{result.route}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Quick Reference</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">K+ Level</th>
                  <th className="text-left py-1">Severity</th>
                  <th className="text-left py-1">Typical Replacement</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted-foreground/20">
                  <td className="py-1">3.0-3.4</td>
                  <td className="text-green-600">Mild</td>
                  <td>40-80 mEq PO or 10-20 mEq IV</td>
                </tr>
                <tr className="border-b border-muted-foreground/20">
                  <td className="py-1">2.5-2.9</td>
                  <td className="text-amber-600">Moderate</td>
                  <td>20-40 mEq IV ± PO</td>
                </tr>
                <tr>
                  <td className="py-1">&lt;2.5</td>
                  <td className="text-red-600">Severe</td>
                  <td>40-80 mEq IV + telemetry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• Correct hypomagnesemia first - refractory hypokalemia may be due to low Mg</li>
                <li>• Peripheral IV: max concentration 40 mEq/L</li>
                <li>• Central line: can give up to 80-100 mEq/L concentration</li>
                <li>• Recheck K+ 2-4 hours after replacement</li>
                <li>• 10 mEq IV raises serum K+ by ~0.1 mEq/L acutely</li>
                <li>• Avoid in renal failure without close monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PotassiumReplacementCalculator;
