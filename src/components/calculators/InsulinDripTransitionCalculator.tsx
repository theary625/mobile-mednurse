import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const InsulinDripTransitionCalculator = () => {
  const [dripRate, setDripRate] = useState('');
  const [hoursStable, setHoursStable] = useState('');
  const [patientEating, setPatientEating] = useState<'yes' | 'no' | 'tpn'>('yes');
  const [result, setResult] = useState<{
    estimatedTDD: number;
    basalDose: number;
    bolusDose: number;
    overlapTime: string;
    instructions: string[];
    warnings: string[];
  } | null>(null);

  const calculate = () => {
    const rate = parseFloat(dripRate);
    const hours = parseFloat(hoursStable);

    if (isNaN(rate)) return;

    // Estimated 24h requirement from drip rate (typically use last 6-8 hours if stable)
    const estimated24h = rate * 24;
    
    // Reduce by 20% for safety when transitioning
    const adjustedTDD = estimated24h * 0.8;

    let basalDose: number;
    let bolusDose: number;
    let overlapTime: string;
    let instructions: string[] = [];
    let warnings: string[] = [];

    if (patientEating === 'yes') {
      // Eating: 50% basal, 50% bolus divided TID with meals
      basalDose = Math.round(adjustedTDD * 0.5);
      bolusDose = Math.round((adjustedTDD * 0.5) / 3);
      overlapTime = '2-4 hours';
      instructions = [
        `Give ${basalDose} units of long-acting insulin subcutaneously`,
        `Give ${bolusDose} units of rapid-acting insulin with each meal (TID)`,
        'Continue insulin drip for 2-4 hours after long-acting given',
        'Check BG before each meal and at bedtime'
      ];
    } else if (patientEating === 'no') {
      // NPO: 100% basal, divided BID
      basalDose = Math.round(adjustedTDD / 2);
      bolusDose = 0;
      overlapTime = '2-4 hours';
      instructions = [
        `Give ${basalDose} units of long-acting insulin BID (e.g., Glargine BID or NPH BID)`,
        'No bolus insulin while NPO',
        'Continue insulin drip for 2-4 hours after first basal dose',
        'Add correction scale for BG > 180 mg/dL'
      ];
    } else {
      // TPN: Basal + correction only
      basalDose = Math.round(adjustedTDD * 0.6);
      bolusDose = 0;
      overlapTime = '4-6 hours';
      instructions = [
        `Give ${basalDose} units of long-acting insulin daily`,
        'Add Regular insulin to TPN if needed (typically 0.1 units/g dextrose)',
        'Continue insulin drip for 4-6 hours after transition',
        'Use correction scale for BG > 180 mg/dL'
      ];
    }

    // Safety warnings
    if (hours && hours < 6) {
      warnings.push('Drip rate may not be representative if stable < 6 hours. Consider longer stabilization.');
    }
    if (rate > 10) {
      warnings.push('High drip rate - patient may be insulin resistant. Monitor closely after transition.');
    }
    if (adjustedTDD > 100) {
      warnings.push('High total daily dose. Ensure patient is clinically stable before transition.');
    }

    setResult({
      estimatedTDD: Math.round(adjustedTDD),
      basalDose,
      bolusDose,
      overlapTime,
      instructions,
      warnings
    });
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden md:col-span-2">
      <CardHeader className="bg-gradient-to-r from-rose-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Insulin Drip to SQ Transition</CardTitle>
            <CardDescription>Calculate subcutaneous insulin regimen from IV drip</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Current Drip Rate (units/hr)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="2.5"
              value={dripRate}
              onChange={(e) => setDripRate(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Hours at Stable Rate</Label>
            <Input
              type="number"
              placeholder="8"
              value={hoursStable}
              onChange={(e) => setHoursStable(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-1">Ideally 6-8+ hours</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Patient Nutritional Status</Label>
            <Select value={patientEating} onValueChange={(v: 'yes' | 'no' | 'tpn') => setPatientEating(v)}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Eating Regular Meals</SelectItem>
                <SelectItem value="no">NPO</SelectItem>
                <SelectItem value="tpn">TPN/Tube Feeds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Transition Regimen
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/20">
                <p className="text-xs text-muted-foreground mb-1">Estimated TDD</p>
                <p className="text-2xl font-bold text-rose-600">{result.estimatedTDD} units</p>
                <p className="text-xs text-muted-foreground mt-1">(80% of projected 24h requirement)</p>
              </div>
              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                <p className="text-xs text-muted-foreground mb-1">Basal Insulin</p>
                <p className="text-2xl font-bold text-blue-600">{result.basalDose} units</p>
                <p className="text-xs text-muted-foreground mt-1">Long-acting SQ</p>
              </div>
              <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
                <p className="text-xs text-muted-foreground mb-1">Bolus Insulin</p>
                <p className="text-2xl font-bold text-purple-600">
                  {result.bolusDose > 0 ? `${result.bolusDose} units/meal` : 'None'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Rapid-acting with meals</p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <p className="font-medium">Transition Instructions</p>
                <Badge variant="outline" className="ml-auto rounded-lg">
                  Overlap: {result.overlapTime}
                </Badge>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {result.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>

            {result.warnings.length > 0 && (
              <div className="space-y-2">
                {result.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-warning/10 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                    <p className="text-xs text-muted-foreground">{warning}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-success/10 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Critical: Do not stop insulin drip until subcutaneous basal insulin has had time to reach therapeutic levels ({result.overlapTime} overlap recommended).
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsulinDripTransitionCalculator;
