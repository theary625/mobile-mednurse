import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const HOMAIRCalculator: React.FC = () => {
  const [fastingInsulin, setFastingInsulin] = useState('');
  const [fastingGlucose, setFastingGlucose] = useState('');
  const [glucoseUnit, setGlucoseUnit] = useState<'mg' | 'mmol'>('mg');
  const [showResults, setShowResults] = useState(false);

  const calculateHOMAIR = () => {
    const insulin = parseFloat(fastingInsulin);
    let glucose = parseFloat(fastingGlucose);

    if (isNaN(insulin) || isNaN(glucose)) {
      return null;
    }

    // Convert mg/dL to mmol/L if needed
    if (glucoseUnit === 'mg') {
      glucose = glucose / 18.0;
    }

    // HOMA-IR = (Fasting Insulin × Fasting Glucose) / 22.5
    const homaIR = (insulin * glucose) / 22.5;

    // HOMA-B (Beta cell function) = (20 × Fasting Insulin) / (Fasting Glucose - 3.5)
    const homaB = glucose > 3.5 ? (20 * insulin) / (glucose - 3.5) : null;

    // Interpretation
    let interpretation = '';
    let severity = 'normal';

    if (homaIR < 1.0) {
      interpretation = 'Optimal insulin sensitivity';
      severity = 'optimal';
    } else if (homaIR < 1.9) {
      interpretation = 'Normal insulin sensitivity';
      severity = 'normal';
    } else if (homaIR < 2.9) {
      interpretation = 'Early insulin resistance';
      severity = 'mild';
    } else {
      interpretation = 'Significant insulin resistance';
      severity = 'high';
    }

    return {
      homaIR: homaIR.toFixed(2),
      homaB: homaB !== null ? homaB.toFixed(1) : null,
      interpretation,
      severity
    };
  };

  const result = showResults ? calculateHOMAIR() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'optimal':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'normal':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'mild':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const isValid = fastingInsulin && fastingGlucose;

  const resetForm = () => {
    setFastingInsulin('');
    setFastingGlucose('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">HOMA-IR Calculator</CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Homeostatic Model Assessment for Insulin Resistance
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="insulin">Fasting Insulin (µU/mL)</Label>
            <Input
              id="insulin"
              type="number"
              step="0.1"
              value={fastingInsulin}
              onChange={(e) => setFastingInsulin(e.target.value)}
              placeholder="e.g., 10"
            />
            <p className="text-xs text-muted-foreground">Normal: 2-25 µU/mL</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="glucose">Fasting Glucose</Label>
            <div className="flex gap-2">
              <Input
                id="glucose"
                type="number"
                step="0.1"
                value={fastingGlucose}
                onChange={(e) => setFastingGlucose(e.target.value)}
                placeholder={glucoseUnit === 'mg' ? '70-100' : '3.9-5.6'}
                className="flex-1"
              />
              <select
                value={glucoseUnit}
                onChange={(e) => setGlucoseUnit(e.target.value as 'mg' | 'mmol')}
                className="w-24 rounded-md border border-input bg-background px-3"
              >
                <option value="mg">mg/dL</option>
                <option value="mmol">mmol/L</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate HOMA-IR
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold">{result.homaIR}</p>
                <p className="text-sm font-semibold">HOMA-IR</p>
                <p className="text-xs">Insulin Resistance Index</p>
              </div>
              {result.homaB && (
                <div>
                  <p className="text-4xl font-bold">{result.homaB}%</p>
                  <p className="text-sm font-semibold">HOMA-B</p>
                  <p className="text-xs">Beta Cell Function</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-current/20 text-center">
              <p className="font-semibold">{result.interpretation}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Formula:</p>
          <p className="text-sm text-muted-foreground">
            HOMA-IR = (Fasting Insulin [µU/mL] × Fasting Glucose [mmol/L]) / 22.5
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">HOMA-IR Reference Values</p>
            <ul className="mt-1 space-y-1">
              <li>&lt;1.0: Optimal insulin sensitivity</li>
              <li>1.0-1.9: Normal</li>
              <li>2.0-2.9: Early insulin resistance</li>
              <li>≥3.0: Significant insulin resistance</li>
            </ul>
            <p className="mt-2 text-xs">Reference: Matthews et al. Diabetologia 1985;28:412-419</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Clinical Note:</strong> HOMA-IR requires fasting samples (8-12 hours). 
            Results may be less reliable in patients with very high or very low glucose levels, 
            or those on insulin therapy. Consider using in conjunction with other metabolic markers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HOMAIRCalculator;
