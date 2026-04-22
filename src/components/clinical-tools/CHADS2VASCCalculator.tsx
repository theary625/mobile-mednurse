import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, CheckCircle2, Pill, ShieldAlert } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Separator } from '@/components/ui/separator';

interface CHADSItem {
  id: string;
  label: string;
  description: string;
  points: number;
}

const chadsItems: CHADSItem[] = [
  { id: 'chf', label: 'C - Congestive Heart Failure', description: 'History of CHF or LV dysfunction', points: 1 },
  { id: 'hypertension', label: 'H - Hypertension', description: 'BP consistently >140/90 or on treatment', points: 1 },
  { id: 'age75', label: 'A₂ - Age ≥75 years', description: 'Patient is 75 years or older', points: 2 },
  { id: 'diabetes', label: 'D - Diabetes Mellitus', description: 'On treatment or fasting glucose ≥126', points: 1 },
  { id: 'stroke', label: 'S₂ - Stroke/TIA/Thromboembolism', description: 'Prior stroke, TIA, or systemic embolism', points: 2 },
  { id: 'vascular', label: 'V - Vascular Disease', description: 'Prior MI, PAD, or aortic plaque', points: 1 },
  { id: 'age65', label: 'A - Age 65-74 years', description: 'Patient is between 65 and 74', points: 1 },
  { id: 'sex', label: 'Sc - Sex Category (Female)', description: 'Female sex', points: 1 },
];

interface AnticoagulationOption {
  name: string;
  dose: string;
  notes: string;
  renalConsideration?: string;
}

const CHADS2VASCCalculator = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalScore = chadsItems.reduce((sum, item) => {
    return sum + (selected[item.id] ? item.points : 0);
  }, 0);

  const isMaleWithScore1 = totalScore === 1 && selected['sex'];

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return {
        risk: 'Low',
        recommendation: 'No anticoagulation therapy recommended',
        annualStrokeRisk: '0%',
        severity: 'low' as const,
      };
    }
    if (score === 1) {
      return {
        risk: 'Low-Moderate',
        recommendation: isMaleWithScore1 
          ? 'Score of 1 in males from female sex alone = effectively 0. No anticoagulation recommended.'
          : 'Consider anticoagulation therapy based on individual risk factors',
        annualStrokeRisk: '1.3%',
        severity: 'lowMod' as const,
      };
    }
    if (score === 2) {
      return {
        risk: 'Moderate',
        recommendation: 'Oral anticoagulation recommended',
        annualStrokeRisk: '2.2%',
        severity: 'moderate' as const,
      };
    }
    const riskPercent = Math.min(score * 1.5 + 1, 15).toFixed(1);
    return {
      risk: 'High',
      recommendation: 'Oral anticoagulation strongly recommended',
      annualStrokeRisk: `${riskPercent}%+`,
      severity: 'high' as const,
    };
  };

  const getAnticoagulationOptions = (score: number): AnticoagulationOption[] => {
    if (score < 2 && !isMaleWithScore1) {
      if (score === 1) {
        return [
          { name: 'Apixaban', dose: '5mg BID', notes: 'Preferred if anticoagulation chosen', renalConsideration: '2.5mg BID if CrCl 15-25 or ≥2 of: age ≥80, weight ≤60kg, Cr ≥1.5' },
          { name: 'Rivaroxaban', dose: '20mg daily with food', notes: 'Alternative option', renalConsideration: '15mg daily if CrCl 15-50' },
        ];
      }
      return [];
    }
    
    return [
      { name: 'Apixaban (Eliquis)', dose: '5mg BID', notes: 'First-line DOAC; lowest bleeding risk', renalConsideration: '2.5mg BID if ≥2 of: age ≥80, weight ≤60kg, Cr ≥1.5 | Avoid if CrCl <15' },
      { name: 'Rivaroxaban (Xarelto)', dose: '20mg daily with food', notes: 'Once daily dosing; take with evening meal', renalConsideration: '15mg daily if CrCl 15-50 | Avoid if CrCl <15' },
      { name: 'Dabigatran (Pradaxa)', dose: '150mg BID', notes: 'Reversible with idarucizumab; higher GI bleeding', renalConsideration: '75mg BID if CrCl 15-30 | Avoid if CrCl <15' },
      { name: 'Edoxaban (Savaysa)', dose: '60mg daily', notes: 'Once daily; reduced dose common', renalConsideration: '30mg daily if CrCl 15-50 or weight ≤60kg' },
      { name: 'Warfarin (Coumadin)', dose: 'INR goal 2.0-3.0', notes: 'Consider if mechanical valve, severe MS, or DOAC contraindicated', renalConsideration: 'Safe in renal impairment; requires monitoring' },
    ];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success/10 border-success/30';
      case 'lowMod': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'moderate': return 'bg-warning/10 border-warning/30';
      case 'high': return 'bg-destructive/10 border-destructive/30';
      default: return '';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-success';
      case 'lowMod': return 'text-yellow-600';
      case 'moderate': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return '';
    }
  };

  const interpretation = getInterpretation(totalScore);
  const anticoagOptions = getAnticoagulationOptions(totalScore);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">CHA₂DS₂-VASc Score</CardTitle>
            <CardDescription>Stroke risk in atrial fibrillation with anticoagulation guidance</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Checkboxes */}
        <div className="space-y-3">
          {chadsItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selected[item.id] ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50'
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <Checkbox
                id={item.id}
                checked={selected[item.id] || false}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor={item.id} className="font-medium cursor-pointer">
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                +{item.points}
              </Badge>
            </div>
          ))}
        </div>

        {/* Result */}
        <div className={`p-4 rounded-lg border-2 ${getSeverityColor(interpretation.severity)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">CHA₂DS₂-VASc Score</span>
            <Badge variant="outline" className={getSeverityTextColor(interpretation.severity)}>
              {interpretation.risk} Risk
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-3">{totalScore}/9</div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Annual stroke risk:</span>
              <span className="font-medium">{interpretation.annualStrokeRisk}</span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`flex items-start gap-2 p-3 rounded-lg ${
          totalScore >= 2 ? 'bg-warning/10 border border-warning/30' : 'bg-muted/50'
        }`}>
          {totalScore >= 2 ? (
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5" />
          )}
          <p className={`text-sm ${totalScore >= 2 ? 'text-warning' : 'text-muted-foreground'}`}>
            {interpretation.recommendation}
          </p>
        </div>

        {/* Anticoagulation Recommendations */}
        {anticoagOptions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">Anticoagulation Options</h4>
              </div>
              
              <div className="space-y-2">
                {anticoagOptions.map((option, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{option.name}</span>
                      <Badge variant="secondary" className="text-xs">{option.dose}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{option.notes}</p>
                    {option.renalConsideration && (
                      <div className="flex items-start gap-1.5 mt-1.5 pt-1.5 border-t border-dashed">
                        <ShieldAlert className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">{option.renalConsideration}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalScore >= 2 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Before initiating:</strong> Calculate HAS-BLED score to assess bleeding risk. 
                    Check renal function, obtain baseline CBC, and review drug interactions.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>0:</strong> Low risk, no anticoagulation</p>
            <p><strong>1 (male):</strong> Low risk, consider individual factors</p>
            <p><strong>1 (female only):</strong> Effectively 0, no anticoagulation</p>
            <p><strong>≥2:</strong> Anticoagulation recommended (DOACs preferred over warfarin)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CHADS2VASCCalculator;
