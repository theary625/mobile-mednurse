import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Shield, Info, RefreshCw } from 'lucide-react';

interface RiskFactor {
  id: string;
  label: string;
  points: number;
  description?: string;
}

const riskFactors: RiskFactor[] = [
  { id: 'hypertension', label: 'Hypertension (uncontrolled, SBP >160)', points: 1 },
  { id: 'renal', label: 'Abnormal Renal Function (dialysis, transplant, Cr >2.3)', points: 1 },
  { id: 'liver', label: 'Abnormal Liver Function (cirrhosis, bilirubin >2x, AST/ALT >3x)', points: 1 },
  { id: 'stroke', label: 'Prior Stroke', points: 1 },
  { id: 'bleeding', label: 'Prior Major Bleeding or Predisposition', points: 1 },
  { id: 'labile', label: 'Labile INRs (<60% time in therapeutic range)', points: 1 },
  { id: 'elderly', label: 'Age >65 years', points: 1 },
  { id: 'drugs', label: 'Drugs (antiplatelet agents, NSAIDs)', points: 1 },
  { id: 'alcohol', label: 'Alcohol excess (≥8 drinks/week)', points: 1 },
];

const BleedingRiskScoreCalculator = () => {
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const toggleFactor = (id: string) => {
    setSelectedFactors(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const totalScore = selectedFactors.reduce((sum, id) => {
    const factor = riskFactors.find(f => f.id === id);
    return sum + (factor?.points || 0);
  }, 0);

  const getInterpretation = () => {
    if (totalScore === 0) {
      return {
        risk: 'Low',
        annualRate: '0.8%',
        recommendation: 'Low bleeding risk. Anticoagulation generally recommended if indicated.',
        color: 'text-success',
        bgColor: 'bg-success/5 border-success/30',
      };
    } else if (totalScore <= 2) {
      return {
        risk: 'Moderate',
        annualRate: '1.9-3.7%',
        recommendation: 'Moderate bleeding risk. Weigh benefits vs risks. Consider modifiable risk factors.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500/5 border-yellow-500/30',
      };
    } else {
      return {
        risk: 'High',
        annualRate: '>8.4%',
        recommendation: 'High bleeding risk. Careful consideration needed. Address modifiable factors. Consider alternatives or closer monitoring.',
        color: 'text-destructive',
        bgColor: 'bg-destructive/5 border-destructive/30',
      };
    }
  };

  const interpretation = getInterpretation();

  const clearAll = () => setSelectedFactors([]);

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rose-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-lg">HAS-BLED Score</CardTitle>
            <CardDescription>Bleeding risk in atrial fibrillation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {/* Score Display */}
        <div className={`p-4 rounded-xl border-2 ${interpretation.bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">HAS-BLED Score</p>
              <p className="text-4xl font-bold">{totalScore}</p>
            </div>
            <div className="text-right">
              <Badge className={`${interpretation.color} bg-transparent border ${interpretation.bgColor.split(' ')[1]} rounded-lg`}>
                {interpretation.risk} Risk
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Annual major bleed: {interpretation.annualRate}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Factors Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">Risk Factors</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="h-8 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          </div>
          
          <div className="space-y-2">
            {riskFactors.map((factor) => (
              <div 
                key={factor.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedFactors.includes(factor.id) 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                }`}
                onClick={() => toggleFactor(factor.id)}
              >
                <Checkbox 
                  checked={selectedFactors.includes(factor.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.label}</span>
                    <Badge variant="outline" className="rounded-lg text-xs">
                      +{factor.points}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretation */}
        <div className={`p-4 rounded-xl border-2 ${interpretation.bgColor}`}>
          <div className="flex items-start gap-2">
            {totalScore >= 3 && <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />}
            <div>
              <p className="font-semibold mb-1">{interpretation.risk} Bleeding Risk</p>
              <p className="text-sm text-muted-foreground">{interpretation.recommendation}</p>
            </div>
          </div>
        </div>

        {/* HAS-BLED Mnemonic */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="font-medium text-sm mb-2">HAS-BLED Mnemonic</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span><strong>H</strong> - Hypertension</span>
            <span><strong>B</strong> - Bleeding history</span>
            <span><strong>A</strong> - Abnormal renal/liver</span>
            <span><strong>L</strong> - Labile INRs</span>
            <span><strong>S</strong> - Stroke history</span>
            <span><strong>E</strong> - Elderly (&gt;65)</span>
            <span></span>
            <span><strong>D</strong> - Drugs/alcohol</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            HAS-BLED identifies modifiable bleeding risk factors but should not be used alone to exclude patients from anticoagulation. High score = optimize modifiable factors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BleedingRiskScoreCalculator;
