import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

interface Criterion {
  id: string;
  label: string;
  description: string;
  category: 'early' | 'severe';
}

const SepsisSETCalculator: React.FC = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const earlySigns: Criterion[] = [
    { id: 'temp', label: 'Temperature Abnormal', description: '>38°C (100.4°F) or <36°C (96.8°F)', category: 'early' },
    { id: 'hr', label: 'Heart Rate Elevated', description: '>90 bpm', category: 'early' },
    { id: 'rr', label: 'Respiratory Rate Elevated', description: '>20/min or PaCO2 <32 mmHg', category: 'early' },
    { id: 'wbc', label: 'WBC Abnormal', description: '>12,000 or <4,000 or >10% bands', category: 'early' },
    { id: 'confusion', label: 'Altered Mental Status', description: 'New confusion or decreased alertness', category: 'early' },
    { id: 'infection', label: 'Suspected Infection', description: 'Known or suspected source of infection', category: 'early' },
  ];

  const severeSigns: Criterion[] = [
    { id: 'hypotension', label: 'Hypotension', description: 'SBP <90 mmHg or MAP <65 mmHg', category: 'severe' },
    { id: 'lactate', label: 'Elevated Lactate', description: 'Lactate >2 mmol/L', category: 'severe' },
    { id: 'oliguria', label: 'Oliguria', description: 'Urine output <0.5 mL/kg/hr for 2 hours', category: 'severe' },
    { id: 'creatinine', label: 'Acute Kidney Injury', description: 'Creatinine rise >0.5 mg/dL', category: 'severe' },
    { id: 'bilirubin', label: 'Hyperbilirubinemia', description: 'Bilirubin >2 mg/dL', category: 'severe' },
    { id: 'coag', label: 'Coagulopathy', description: 'INR >1.5 or aPTT >60 sec', category: 'severe' },
    { id: 'plt', label: 'Thrombocytopenia', description: 'Platelets <100,000', category: 'severe' },
    { id: 'mottling', label: 'Skin Mottling', description: 'Mottled or cyanotic skin', category: 'severe' },
  ];

  const toggleCriterion = (id: string) => {
    setSelectedCriteria(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const getInterpretation = () => {
    const earlyCount = selectedCriteria.filter(id => 
      earlySigns.find(c => c.id === id)
    ).length;
    
    const severeCount = selectedCriteria.filter(id => 
      severeSigns.find(c => c.id === id)
    ).length;
    
    const hasInfection = selectedCriteria.includes('infection');
    const hasHypotension = selectedCriteria.includes('hypotension');
    const hasLactate = selectedCriteria.includes('lactate');

    if (hasHypotension && hasLactate && hasInfection) {
      return {
        diagnosis: 'SEPTIC SHOCK',
        recommendation: 'Immediate aggressive resuscitation. Vasopressors likely needed.',
        severity: 'critical',
        action: 'Hour-1 Bundle: Blood cultures, lactate, antibiotics, 30 mL/kg crystalloid'
      };
    } else if ((hasHypotension || hasLactate || severeCount >= 2) && hasInfection) {
      return {
        diagnosis: 'Severe Sepsis / Sepsis with Organ Dysfunction',
        recommendation: 'Initiate sepsis bundle immediately. Consider ICU admission.',
        severity: 'high',
        action: 'Hour-1 Bundle: Cultures, lactate, antibiotics, fluids'
      };
    } else if (earlyCount >= 2 && hasInfection) {
      return {
        diagnosis: 'Possible Sepsis (SIRS + Infection)',
        recommendation: 'Monitor closely. Consider early antibiotics and fluid resuscitation.',
        severity: 'moderate',
        action: 'Obtain cultures, check lactate, monitor for deterioration'
      };
    } else if (earlyCount >= 2) {
      return {
        diagnosis: 'SIRS Present',
        recommendation: 'Evaluate for underlying cause. Monitor for infection development.',
        severity: 'low',
        action: 'Investigate source, repeat assessment'
      };
    } else {
      return {
        diagnosis: 'Low Suspicion',
        recommendation: 'Sepsis unlikely based on current findings. Continue monitoring.',
        severity: 'low',
        action: 'Monitor vitals, reassess if condition changes'
      };
    }
  };

  const result = showResults ? getInterpretation() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'critical':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setSelectedCriteria([]);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Sepsis SET (Screening & Education Tool)</CardTitle>
        <p className="text-orange-100 text-sm mt-1">
          Early sepsis recognition and severity assessment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold text-orange-700">
              Early Warning Signs (SIRS Criteria)
            </Label>
            <div className="mt-3 space-y-2">
              {earlySigns.map((criterion) => (
                <div
                  key={criterion.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={criterion.id}
                    checked={selectedCriteria.includes(criterion.id)}
                    onCheckedChange={() => toggleCriterion(criterion.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={criterion.id} className="font-medium cursor-pointer text-sm">
                      {criterion.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{criterion.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold text-red-700">
              Organ Dysfunction / Severe Signs
            </Label>
            <div className="mt-3 space-y-2">
              {severeSigns.map((criterion) => (
                <div
                  key={criterion.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={criterion.id}
                    checked={selectedCriteria.includes(criterion.id)}
                    onCheckedChange={() => toggleCriterion(criterion.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={criterion.id} className="font-medium cursor-pointer text-sm">
                      {criterion.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{criterion.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Assess Sepsis Risk
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">{result.diagnosis}</p>
              <p className="text-sm">{result.recommendation}</p>
              <p className="text-base font-bold mt-4 uppercase">{result.action}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Surviving Sepsis Hour-1 Bundle</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Measure lactate (re-measure if initial &gt;2 mmol/L)</li>
              <li>Obtain blood cultures before antibiotics</li>
              <li>Administer broad-spectrum antibiotics</li>
              <li>Begin 30 mL/kg crystalloid for hypotension or lactate ≥4</li>
              <li>Apply vasopressors if MAP &lt;65 after fluid resuscitation</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Time is Critical:</strong> Each hour delay in antibiotic administration 
            increases mortality by ~4%. Early recognition and treatment saves lives.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SepsisSETCalculator;
