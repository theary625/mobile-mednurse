import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calculator, Info, Droplets } from 'lucide-react';

const AKIKDIGOCalculator = () => {
  const [baselineCreatinine, setBaselineCreatinine] = useState('');
  const [currentCreatinine, setCurrentCreatinine] = useState('');
  const [urineOutput, setUrineOutput] = useState('');
  const [hours, setHours] = useState('');
  const [weight, setWeight] = useState('');
  const [timeframe, setTimeframe] = useState<'48h' | '7d'>('48h');
  const [result, setResult] = useState<{
    stage: number;
    criteria: string[];
    color: string;
    description: string;
    management: string[];
  } | null>(null);

  const calculateAKI = () => {
    const baselineCr = parseFloat(baselineCreatinine);
    const currentCr = parseFloat(currentCreatinine);
    const uoMl = parseFloat(urineOutput);
    const hoursNum = parseFloat(hours);
    const weightKg = parseFloat(weight);

    if (!baselineCr || !currentCr) {
      return;
    }

    const criteria: string[] = [];
    let stage = 0;

    // Creatinine criteria
    const crIncrease = currentCr - baselineCr;
    const crRatio = currentCr / baselineCr;

    // Stage 1: ≥0.3 mg/dL increase within 48h OR 1.5-1.9x baseline within 7d
    if (timeframe === '48h' && crIncrease >= 0.3) {
      stage = Math.max(stage, 1);
      criteria.push(`Cr increase ≥0.3 mg/dL within 48h (+${crIncrease.toFixed(2)} mg/dL)`);
    }
    if (crRatio >= 1.5 && crRatio < 2) {
      stage = Math.max(stage, 1);
      criteria.push(`Cr 1.5-1.9x baseline (${crRatio.toFixed(1)}x)`);
    }

    // Stage 2: 2.0-2.9x baseline
    if (crRatio >= 2 && crRatio < 3) {
      stage = Math.max(stage, 2);
      criteria.push(`Cr 2.0-2.9x baseline (${crRatio.toFixed(1)}x)`);
    }

    // Stage 3: ≥3x baseline OR Cr ≥4.0 with acute rise ≥0.5 OR RRT initiation
    if (crRatio >= 3) {
      stage = Math.max(stage, 3);
      criteria.push(`Cr ≥3x baseline (${crRatio.toFixed(1)}x)`);
    }
    if (currentCr >= 4.0 && crIncrease >= 0.5) {
      stage = Math.max(stage, 3);
      criteria.push(`Cr ≥4.0 mg/dL with acute increase ≥0.5 mg/dL`);
    }

    // Urine output criteria
    if (uoMl && hoursNum && weightKg) {
      const uoRate = uoMl / hoursNum / weightKg; // mL/kg/hr

      if (uoRate < 0.5 && hoursNum >= 6 && hoursNum < 12) {
        stage = Math.max(stage, 1);
        criteria.push(`UO <0.5 mL/kg/hr for 6-12h (${uoRate.toFixed(2)} mL/kg/hr)`);
      }
      if (uoRate < 0.5 && hoursNum >= 12) {
        stage = Math.max(stage, 2);
        criteria.push(`UO <0.5 mL/kg/hr for ≥12h (${uoRate.toFixed(2)} mL/kg/hr)`);
      }
      if (uoRate < 0.3 && hoursNum >= 24) {
        stage = Math.max(stage, 3);
        criteria.push(`UO <0.3 mL/kg/hr for ≥24h (${uoRate.toFixed(2)} mL/kg/hr)`);
      }
      if (uoMl === 0 && hoursNum >= 12) {
        stage = Math.max(stage, 3);
        criteria.push(`Anuria for ≥12 hours`);
      }
    }

    let color: string;
    let description: string;
    let management: string[] = [];

    switch (stage) {
      case 0:
        color = 'bg-green-500';
        description = 'No AKI - Does not meet KDIGO criteria';
        management = ['Continue monitoring', 'Maintain euvolemia', 'Avoid nephrotoxins'];
        break;
      case 1:
        color = 'bg-yellow-500';
        description = 'Stage 1 AKI - Mild';
        management = [
          'Hold nephrotoxic medications (NSAIDs, aminoglycosides, contrast)',
          'Optimize volume status',
          'Monitor creatinine q12-24h',
          'Check urine output closely',
          'Review medication dosing'
        ];
        break;
      case 2:
        color = 'bg-orange-500';
        description = 'Stage 2 AKI - Moderate';
        management = [
          'All Stage 1 interventions',
          'Consider nephrology consult',
          'Evaluate for etiology (prerenal, intrinsic, postrenal)',
          'Renal ultrasound if obstruction suspected',
          'Monitor electrolytes q8-12h',
          'Avoid hypotension'
        ];
        break;
      case 3:
        color = 'bg-red-600';
        description = 'Stage 3 AKI - Severe';
        management = [
          'Urgent nephrology consult',
          'Consider ICU transfer if not already',
          'Evaluate for dialysis indications (AEIOU)',
          'Strict I/O monitoring',
          'Frequent electrolyte monitoring',
          'Consider central access for potential dialysis',
          'Avoid all nephrotoxins'
        ];
        break;
      default:
        color = 'bg-gray-500';
        description = 'Unable to determine';
        management = [];
    }

    setResult({ stage, criteria, color, description, management });
  };

  const resetCalculator = () => {
    setBaselineCreatinine('');
    setCurrentCreatinine('');
    setUrineOutput('');
    setHours('');
    setWeight('');
    setTimeframe('48h');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            KDIGO AKI Staging Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Kidney Disease: Improving Global Outcomes criteria for Acute Kidney Injury staging
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baselineCr">Baseline Creatinine (mg/dL)</Label>
              <Input
                id="baselineCr"
                type="number"
                step="0.01"
                placeholder="Known or estimated baseline"
                value={baselineCreatinine}
                onChange={(e) => setBaselineCreatinine(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use lowest Cr from past 3 months if available</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentCr">Current Creatinine (mg/dL)</Label>
              <Input
                id="currentCr"
                type="number"
                step="0.01"
                placeholder="Most recent value"
                value={currentCreatinine}
                onChange={(e) => setCurrentCreatinine(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Timeframe for Cr Change</Label>
              <Select value={timeframe} onValueChange={(v: '48h' | '7d') => setTimeframe(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="48h">Within 48 hours</SelectItem>
                  <SelectItem value="7d">Within 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) - for UO calculation</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Optional"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uo">Total Urine Output (mL)</Label>
              <Input
                id="uo"
                type="number"
                placeholder="Optional"
                value={urineOutput}
                onChange={(e) => setUrineOutput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Over how many hours?</Label>
              <Input
                id="hours"
                type="number"
                placeholder="6, 12, 24..."
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateAKI} className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
              Stage AKI
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Badge className={`text-2xl px-6 py-3 ${result.color} text-white`}>
                {result.stage === 0 ? 'No AKI' : `Stage ${result.stage}`}
              </Badge>
              <p className="text-lg mt-2">{result.description}</p>
            </div>

            {result.criteria.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="font-medium text-blue-800 dark:text-blue-200">Criteria Met:</p>
                <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 mt-1">
                  {result.criteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.stage > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Management Considerations:</p>
                  <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 mt-1">
                    {result.management.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {result.stage === 3 && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="font-medium text-red-800 dark:text-red-200">Dialysis Indications (AEIOU):</p>
                <ul className="list-disc list-inside text-red-700 dark:text-red-300 mt-1">
                  <li><strong>A</strong>cidosis - pH &lt;7.1 refractory to bicarb</li>
                  <li><strong>E</strong>lectrolytes - Severe hyperkalemia &gt;6.5 refractory</li>
                  <li><strong>I</strong>ngestion - Toxic alcohols, lithium, salicylates</li>
                  <li><strong>O</strong>verload - Volume unresponsive to diuretics</li>
                  <li><strong>U</strong>remia - Encephalopathy, pericarditis, bleeding</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            KDIGO AKI Staging Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Stage</th>
                  <th className="text-left p-2">Creatinine Criteria</th>
                  <th className="text-left p-2">Urine Output Criteria</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-yellow-500">1</Badge></td>
                  <td className="p-2">1.5-1.9x baseline OR ≥0.3 mg/dL increase</td>
                  <td className="p-2">&lt;0.5 mL/kg/hr for 6-12h</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-orange-500">2</Badge></td>
                  <td className="p-2">2.0-2.9x baseline</td>
                  <td className="p-2">&lt;0.5 mL/kg/hr for ≥12h</td>
                </tr>
                <tr>
                  <td className="p-2"><Badge className="bg-red-600">3</Badge></td>
                  <td className="p-2">≥3x baseline OR Cr ≥4.0 with ≥0.5 rise OR RRT</td>
                  <td className="p-2">&lt;0.3 mL/kg/hr for ≥24h OR anuria ≥12h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AKIKDIGOCalculator;
