import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, ArrowUp, ArrowDown, Minus, AlertTriangle, Info } from 'lucide-react';

interface WarfarinResult {
  recommendation: string;
  doseAdjustment: string;
  newWeeklyDose: number;
  suggestedDailyDose: string;
  nextINR: string;
  urgency: 'routine' | 'attention' | 'urgent' | 'critical';
}

const WarfarinCalculator = () => {
  const [currentINR, setCurrentINR] = useState('');
  const [targetINR, setTargetINR] = useState('2.5');
  const [currentDose, setCurrentDose] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('7');
  const [result, setResult] = useState<WarfarinResult | null>(null);

  const calculate = () => {
    const inr = parseFloat(currentINR);
    const target = parseFloat(targetINR);
    const dose = parseFloat(currentDose);
    const days = parseFloat(daysPerWeek);
    
    if (isNaN(inr) || isNaN(dose) || isNaN(days)) return;

    const currentWeeklyDose = dose * days;
    let adjustmentPercent = 0;
    let recommendation = '';
    let nextINR = '';
    let urgency: WarfarinResult['urgency'] = 'routine';

    // INR-based dosing algorithm
    if (inr < 1.5) {
      adjustmentPercent = 15;
      recommendation = 'Significantly subtherapeutic - increase dose';
      nextINR = '5-7 days';
      urgency = 'attention';
    } else if (inr >= 1.5 && inr < 1.8) {
      adjustmentPercent = 10;
      recommendation = 'Subtherapeutic - increase dose';
      nextINR = '7-14 days';
      urgency = 'attention';
    } else if (inr >= 1.8 && inr < 2.0) {
      adjustmentPercent = 5;
      recommendation = 'Below target - small increase';
      nextINR = '7-14 days';
      urgency = 'routine';
    } else if (inr >= 2.0 && inr <= 3.0) {
      adjustmentPercent = 0;
      recommendation = 'Therapeutic - maintain current dose';
      nextINR = '4 weeks (stable) or per protocol';
      urgency = 'routine';
    } else if (inr > 3.0 && inr <= 3.5) {
      adjustmentPercent = -5;
      recommendation = 'Slightly elevated - small decrease';
      nextINR = '7-14 days';
      urgency = 'routine';
    } else if (inr > 3.5 && inr <= 4.0) {
      adjustmentPercent = -10;
      recommendation = 'Elevated - hold 1 dose, then decrease';
      nextINR = '5-7 days';
      urgency = 'attention';
    } else if (inr > 4.0 && inr <= 5.0) {
      adjustmentPercent = -15;
      recommendation = 'High - hold 1-2 doses, decrease weekly dose';
      nextINR = '3-5 days';
      urgency = 'urgent';
    } else if (inr > 5.0 && inr <= 9.0) {
      adjustmentPercent = -20;
      recommendation = 'Very high - hold doses, consider vitamin K 1-2.5mg PO';
      nextINR = '1-2 days';
      urgency = 'urgent';
    } else {
      adjustmentPercent = -30;
      recommendation = 'CRITICAL - hold warfarin, give vitamin K, assess for bleeding';
      nextINR = '6-12 hours';
      urgency = 'critical';
    }

    // Adjust for different target ranges (mechanical valve, etc.)
    if (target === 3.0) {
      // Higher target range (2.5-3.5)
      if (inr >= 2.5 && inr <= 3.5) {
        adjustmentPercent = 0;
        recommendation = 'Therapeutic - maintain current dose';
        urgency = 'routine';
      }
    }

    const newWeeklyDose = Math.round(currentWeeklyDose * (1 + adjustmentPercent / 100) * 10) / 10;
    const avgDailyDose = Math.round((newWeeklyDose / 7) * 10) / 10;

    // Create practical daily dosing schedule
    let suggestedDailyDose = `${avgDailyDose}mg daily`;
    if (newWeeklyDose % 7 !== 0) {
      const baseDose = Math.floor(newWeeklyDose / 7);
      const remainder = newWeeklyDose - baseDose * 7;
      suggestedDailyDose = `${baseDose}mg most days, ${baseDose + 1}mg on ${Math.round(remainder)} days`;
    }

    setResult({
      recommendation,
      doseAdjustment: adjustmentPercent === 0 ? 'No change' : 
        `${adjustmentPercent > 0 ? '+' : ''}${adjustmentPercent}%`,
      newWeeklyDose,
      suggestedDailyDose,
      nextINR,
      urgency,
    });
  };

  const getUrgencyStyles = (urgency: WarfarinResult['urgency']) => {
    switch (urgency) {
      case 'routine':
        return 'border-success/30 bg-success/5';
      case 'attention':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'urgent':
        return 'border-orange-500/30 bg-orange-500/5';
      case 'critical':
        return 'border-destructive/30 bg-destructive/5';
    }
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Warfarin Dose Adjustment</CardTitle>
            <CardDescription>INR-based dosing recommendations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Current INR</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="2.5"
              value={currentINR}
              onChange={(e) => setCurrentINR(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Target INR</Label>
            <Select value={targetINR} onValueChange={setTargetINR}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2.5">2.0-3.0 (Standard)</SelectItem>
                <SelectItem value="3.0">2.5-3.5 (Mechanical Valve)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Current Daily Dose (mg)</Label>
            <Input
              type="number"
              step="0.5"
              placeholder="5"
              value={currentDose}
              onChange={(e) => setCurrentDose(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Days/Week Taking</Label>
            <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="6">6 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Adjustment
        </Button>

        {result && (
          <div className={`p-5 rounded-2xl border-2 ${getUrgencyStyles(result.urgency)}`}>
            {result.urgency === 'critical' && (
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-semibold text-destructive">CRITICAL INR</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {result.doseAdjustment.includes('+') && <ArrowUp className="w-5 h-5 text-blue-600" />}
                {result.doseAdjustment.includes('-') && <ArrowDown className="w-5 h-5 text-orange-600" />}
                {result.doseAdjustment === 'No change' && <Minus className="w-5 h-5 text-success" />}
                <span className="font-medium">{result.recommendation}</span>
              </div>

              <div className="p-3 bg-background/50 rounded-xl">
                <p className="text-sm text-muted-foreground">Weekly Dose Adjustment</p>
                <p className="text-xl font-bold">{result.doseAdjustment}</p>
              </div>

              <div className="p-3 bg-background/50 rounded-xl">
                <p className="text-sm text-muted-foreground">New Weekly Total</p>
                <p className="text-2xl font-bold">{result.newWeeklyDose} mg/week</p>
                <p className="text-sm text-muted-foreground mt-1">{result.suggestedDailyDose}</p>
              </div>

              <Badge variant="outline" className="rounded-lg">
                Repeat INR: {result.nextINR}
              </Badge>
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Consider patient factors: diet changes, interacting medications, adherence, illness. Always verify with clinical judgment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarfarinCalculator;
