import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Info, CheckCircle2 } from 'lucide-react';

const CorrectionFactorCalculator = () => {
  const [tdd, setTdd] = useState('');
  const [method, setMethod] = useState<'1800' | '1500' | '1700'>('1800');
  const [result, setResult] = useState<{
    isf: number;
    icRatio: number;
    explanation: string;
  } | null>(null);

  const calculate = () => {
    const totalDailyDose = parseFloat(tdd);
    if (isNaN(totalDailyDose) || totalDailyDose === 0) return;

    // ISF calculation based on selected rule
    const ruleValue = parseInt(method);
    const isf = ruleValue / totalDailyDose;

    // I:C Ratio using 450-500 rule (using 500)
    const icRatio = 500 / totalDailyDose;

    const explanations: Record<string, string> = {
      '1800': 'The 1800 Rule is commonly used for rapid-acting insulin (lispro, aspart, glulisine).',
      '1500': 'The 1500 Rule is traditionally used for regular insulin.',
      '1700': 'The 1700 Rule is a middle-ground approach used in some protocols.'
    };

    setResult({
      isf: Math.round(isf),
      icRatio: Math.round(icRatio),
      explanation: explanations[method]
    });
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Correction Factor Calculator</CardTitle>
            <CardDescription>Calculate ISF and I:C Ratio</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="p-3 bg-muted/50 rounded-xl space-y-1">
          <p className="text-xs font-medium">ISF = Rule ÷ TDD</p>
          <p className="text-xs text-muted-foreground">
            ISF = How much 1 unit of insulin lowers blood glucose (mg/dL)
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium">Total Daily Dose (units)</Label>
          <Input
            type="number"
            placeholder="50"
            value={tdd}
            onChange={(e) => setTdd(e.target.value)}
            className="mt-2 h-11 rounded-xl"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Sum of all basal + bolus insulin in 24 hours
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium">Calculation Rule</Label>
          <Select value={method} onValueChange={(v: '1800' | '1500' | '1700') => setMethod(v)}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1800">1800 Rule (Rapid-Acting)</SelectItem>
              <SelectItem value="1700">1700 Rule (Alternative)</SelectItem>
              <SelectItem value="1500">1500 Rule (Regular Insulin)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Factors
        </Button>

        {result && (
          <div className="p-5 rounded-2xl border-2 border-teal-500/30 bg-teal-500/5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-background rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Insulin Sensitivity Factor (ISF)</p>
                <p className="text-2xl font-bold text-teal-600">{result.isf} mg/dL</p>
                <p className="text-xs text-muted-foreground mt-1">per 1 unit insulin</p>
              </div>
              <div className="p-3 bg-background rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Insulin:Carb Ratio (I:C)</p>
                <p className="text-2xl font-bold text-teal-600">1:{result.icRatio}</p>
                <p className="text-xs text-muted-foreground mt-1">1 unit per {result.icRatio}g carbs</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-teal-500/10 rounded-xl">
              <Info className="w-4 h-4 text-teal-600 mt-0.5" />
              <p className="text-xs text-muted-foreground">{result.explanation}</p>
            </div>
            <div className="flex items-start gap-2 p-3 bg-success/10 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
              <p className="text-xs text-muted-foreground">
                These are starting estimates. Adjust based on patient response and glucose patterns.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CorrectionFactorCalculator;
