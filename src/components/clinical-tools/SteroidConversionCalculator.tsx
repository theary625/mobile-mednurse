import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, RotateCcw, Info, ArrowRight } from 'lucide-react';

interface Steroid {
  name: string;
  equivalentDose: number; // Equivalent to 5mg prednisone
  glucocorticoidPotency: number;
  mineralocorticoidPotency: number;
  halfLife: string;
}

const steroids: Record<string, Steroid> = {
  hydrocortisone: {
    name: 'Hydrocortisone',
    equivalentDose: 20,
    glucocorticoidPotency: 1,
    mineralocorticoidPotency: 1,
    halfLife: '8-12 hours'
  },
  prednisone: {
    name: 'Prednisone',
    equivalentDose: 5,
    glucocorticoidPotency: 4,
    mineralocorticoidPotency: 0.8,
    halfLife: '12-36 hours'
  },
  prednisolone: {
    name: 'Prednisolone',
    equivalentDose: 5,
    glucocorticoidPotency: 4,
    mineralocorticoidPotency: 0.8,
    halfLife: '12-36 hours'
  },
  methylprednisolone: {
    name: 'Methylprednisolone',
    equivalentDose: 4,
    glucocorticoidPotency: 5,
    mineralocorticoidPotency: 0.5,
    halfLife: '12-36 hours'
  },
  triamcinolone: {
    name: 'Triamcinolone',
    equivalentDose: 4,
    glucocorticoidPotency: 5,
    mineralocorticoidPotency: 0,
    halfLife: '12-36 hours'
  },
  dexamethasone: {
    name: 'Dexamethasone',
    equivalentDose: 0.75,
    glucocorticoidPotency: 25,
    mineralocorticoidPotency: 0,
    halfLife: '36-54 hours'
  },
  betamethasone: {
    name: 'Betamethasone',
    equivalentDose: 0.6,
    glucocorticoidPotency: 25,
    mineralocorticoidPotency: 0,
    halfLife: '36-54 hours'
  },
  cortisone: {
    name: 'Cortisone',
    equivalentDose: 25,
    glucocorticoidPotency: 0.8,
    mineralocorticoidPotency: 0.8,
    halfLife: '8-12 hours'
  }
};

const SteroidConversionCalculator = () => {
  const [sourceSteroid, setSourceSteroid] = useState('');
  const [dose, setDose] = useState('');
  const [targetSteroid, setTargetSteroid] = useState('');

  const calculateConversion = () => {
    const d = parseFloat(dose);
    if (!sourceSteroid || !targetSteroid || !d || d <= 0) return null;

    const source = steroids[sourceSteroid];
    const target = steroids[targetSteroid];

    // Convert to prednisone equivalent, then to target
    const prednisoneEquivalent = (d / source.equivalentDose) * 5;
    const targetDose = (prednisoneEquivalent / 5) * target.equivalentDose;

    return {
      sourceInfo: source,
      targetInfo: target,
      sourceDose: d,
      targetDose: Math.round(targetDose * 100) / 100,
      prednisoneEquivalent: Math.round(prednisoneEquivalent * 100) / 100
    };
  };

  const result = calculateConversion();

  const resetForm = () => {
    setSourceSteroid('');
    setDose('');
    setTargetSteroid('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Steroid Conversion Calculator</CardTitle>
            <CardDescription className="text-teal-100">
              Glucocorticoid Dose Equivalencies
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p>Converts between equivalent glucocorticoid doses based on anti-inflammatory potency. 
              Mineralocorticoid effects vary and may need separate consideration.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Source Steroid</Label>
              <Select value={sourceSteroid} onValueChange={setSourceSteroid}>
                <SelectTrigger>
                  <SelectValue placeholder="Select steroid" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(steroids).map(([key, steroid]) => (
                    <SelectItem key={key} value={key}>{steroid.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dose (mg)</Label>
              <Input
                type="number"
                placeholder="Enter dose"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label>Target Steroid</Label>
              <Select value={targetSteroid} onValueChange={setTargetSteroid}>
                <SelectTrigger>
                  <SelectValue placeholder="Select steroid" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(steroids).map(([key, steroid]) => (
                    <SelectItem key={key} value={key}>{steroid.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 p-6 rounded-lg border border-teal-200 dark:border-teal-800">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{result.sourceInfo.name}</p>
                  <p className="text-2xl font-bold text-teal-600">{result.sourceDose} mg</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{result.targetInfo.name}</p>
                  <p className="text-2xl font-bold text-emerald-600">{result.targetDose} mg</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                (Equivalent to {result.prednisoneEquivalent} mg Prednisone)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">{result.sourceInfo.name}</h4>
                <div className="text-sm space-y-1">
                  <p>Glucocorticoid Potency: {result.sourceInfo.glucocorticoidPotency}×</p>
                  <p>Mineralocorticoid: {result.sourceInfo.mineralocorticoidPotency}×</p>
                  <p>Half-life: {result.sourceInfo.halfLife}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">{result.targetInfo.name}</h4>
                <div className="text-sm space-y-1">
                  <p>Glucocorticoid Potency: {result.targetInfo.glucocorticoidPotency}×</p>
                  <p>Mineralocorticoid: {result.targetInfo.mineralocorticoidPotency}×</p>
                  <p>Half-life: {result.targetInfo.halfLife}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equivalency Table */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
          <h4 className="font-semibold mb-3">Quick Reference: Equivalent Doses</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {Object.entries(steroids).map(([key, steroid]) => (
              <div key={key} className="flex justify-between">
                <span>{steroid.name}:</span>
                <span className="font-mono">{steroid.equivalentDose} mg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Note:</strong> Conversions are based on anti-inflammatory equivalencies. Clinical response may vary. 
          Consider indication, duration, and patient factors when switching steroids.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SteroidConversionCalculator;
