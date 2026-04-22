import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, AlertTriangle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RansonCriteriaCalculator: React.FC = () => {
  const [etiology, setEtiology] = useState<'gallstone' | 'other'>('other');
  const [admissionCriteria, setAdmissionCriteria] = useState({
    age: false,
    wbc: false,
    glucose: false,
    ldh: false,
    ast: false,
  });
  const [fortyEightHourCriteria, setFortyEightHourCriteria] = useState({
    hctDrop: false,
    bunRise: false,
    calcium: false,
    pao2: false,
    baseDeficit: false,
    fluidSequestration: false,
  });
  const [showResults, setShowResults] = useState(false);

  const admissionItems = etiology === 'gallstone' ? [
    { key: 'age', label: 'Age > 70 years' },
    { key: 'wbc', label: 'WBC > 18,000/mm³' },
    { key: 'glucose', label: 'Glucose > 220 mg/dL (>12.2 mmol/L)' },
    { key: 'ldh', label: 'LDH > 400 U/L' },
    { key: 'ast', label: 'AST > 250 U/L' },
  ] : [
    { key: 'age', label: 'Age > 55 years' },
    { key: 'wbc', label: 'WBC > 16,000/mm³' },
    { key: 'glucose', label: 'Glucose > 200 mg/dL (>11.1 mmol/L)' },
    { key: 'ldh', label: 'LDH > 350 U/L' },
    { key: 'ast', label: 'AST > 250 U/L' },
  ];

  const fortyEightHourItems = etiology === 'gallstone' ? [
    { key: 'hctDrop', label: 'Hematocrit drop > 10%' },
    { key: 'bunRise', label: 'BUN rise > 2 mg/dL (>0.7 mmol/L)' },
    { key: 'calcium', label: 'Calcium < 8 mg/dL (<2 mmol/L)' },
    { key: 'pao2', label: 'PaO₂ < 60 mmHg' },
    { key: 'baseDeficit', label: 'Base deficit > 5 mEq/L' },
    { key: 'fluidSequestration', label: 'Fluid sequestration > 4 L' },
  ] : [
    { key: 'hctDrop', label: 'Hematocrit drop > 10%' },
    { key: 'bunRise', label: 'BUN rise > 5 mg/dL (>1.8 mmol/L)' },
    { key: 'calcium', label: 'Calcium < 8 mg/dL (<2 mmol/L)' },
    { key: 'pao2', label: 'PaO₂ < 60 mmHg' },
    { key: 'baseDeficit', label: 'Base deficit > 4 mEq/L' },
    { key: 'fluidSequestration', label: 'Fluid sequestration > 6 L' },
  ];

  const calculateScore = () => {
    const admissionScore = Object.values(admissionCriteria).filter(Boolean).length;
    const fortyEightScore = Object.values(fortyEightHourCriteria).filter(Boolean).length;
    return admissionScore + fortyEightScore;
  };

  const getInterpretation = (score: number) => {
    if (score <= 2) {
      return {
        mortality: '~2%',
        risk: 'Mild',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        severity: 'Mild pancreatitis',
        recommendations: [
          'Low mortality risk',
          'Standard supportive care',
          'IV fluids, pain control, NPO initially',
          'Monitor for clinical deterioration',
          'Consider oral diet advancement when improving'
        ]
      };
    } else if (score <= 4) {
      return {
        mortality: '~15%',
        risk: 'Moderate',
        color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-500',
        severity: 'Moderately severe pancreatitis',
        recommendations: [
          'Significant mortality risk',
          'Close monitoring in step-down or ICU',
          'Aggressive IV fluid resuscitation',
          'Consider CT imaging for complications',
          'Early enteral nutrition if tolerated',
          'GI/surgical consultation'
        ]
      };
    } else if (score <= 6) {
      return {
        mortality: '~40%',
        risk: 'High',
        color: 'bg-orange-100 border-orange-200 text-orange-800',
        badgeColor: 'bg-orange-500',
        severity: 'Severe pancreatitis',
        recommendations: [
          'High mortality risk',
          'ICU admission required',
          'Aggressive resuscitation and monitoring',
          'CT with contrast to evaluate necrosis',
          'Multidisciplinary team management',
          'Consider interventional radiology if needed'
        ]
      };
    } else {
      return {
        mortality: '~100%',
        risk: 'Critical',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-700',
        severity: 'Critical pancreatitis',
        recommendations: [
          'Extremely high mortality',
          'Maximum ICU support',
          'Aggressive organ support',
          'Early surgical/IR consultation',
          'Goals of care discussion appropriate',
          'Family meeting recommended'
        ]
      };
    }
  };

  const score = calculateScore();
  const admissionScore = Object.values(admissionCriteria).filter(Boolean).length;
  const fortyEightScore = Object.values(fortyEightHourCriteria).filter(Boolean).length;
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setAdmissionCriteria({
      age: false,
      wbc: false,
      glucose: false,
      ldh: false,
      ast: false,
    });
    setFortyEightHourCriteria({
      hctDrop: false,
      bunRise: false,
      calcium: false,
      pao2: false,
      baseDeficit: false,
      fluidSequestration: false,
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Ranson Criteria
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Acute Pancreatitis Severity & Mortality Prediction
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Etiology Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Etiology</Label>
          <div className="flex gap-4">
            <Button
              variant={etiology === 'other' ? 'default' : 'outline'}
              onClick={() => { setEtiology('other'); resetForm(); }}
              className="flex-1"
            >
              Non-Gallstone (Alcohol, Other)
            </Button>
            <Button
              variant={etiology === 'gallstone' ? 'default' : 'outline'}
              onClick={() => { setEtiology('gallstone'); resetForm(); }}
              className="flex-1"
            >
              Gallstone Pancreatitis
            </Button>
          </div>
        </div>

        <Tabs defaultValue="admission" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admission">At Admission ({admissionScore}/5)</TabsTrigger>
            <TabsTrigger value="48hour">At 48 Hours ({fortyEightScore}/6)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admission" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">Assess on admission:</p>
            {admissionItems.map((item) => (
              <div key={item.key} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={`adm-${item.key}`}
                  checked={admissionCriteria[item.key as keyof typeof admissionCriteria]}
                  onCheckedChange={(checked) =>
                    setAdmissionCriteria(prev => ({ ...prev, [item.key]: checked === true }))
                  }
                  className="mt-0.5"
                />
                <Label htmlFor={`adm-${item.key}`} className="text-sm cursor-pointer flex-1">
                  {item.label}
                </Label>
                <Badge variant="secondary" className="shrink-0">+1</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="48hour" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">Assess at 48 hours after admission:</p>
            {fortyEightHourItems.map((item) => (
              <div key={item.key} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={`48h-${item.key}`}
                  checked={fortyEightHourCriteria[item.key as keyof typeof fortyEightHourCriteria]}
                  onCheckedChange={(checked) =>
                    setFortyEightHourCriteria(prev => ({ ...prev, [item.key]: checked === true }))
                  }
                  className="mt-0.5"
                />
                <Label htmlFor={`48h-${item.key}`} className="text-sm cursor-pointer flex-1">
                  {item.label}
                </Label>
                <Badge variant="secondary" className="shrink-0">+1</Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate Ranson Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}/11</p>
                <p className="text-sm">Admission: {admissionScore}/5 | 48-Hour: {fortyEightScore}/6</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge className={interpretation.badgeColor}>{interpretation.risk} Risk</Badge>
                </div>
                <p className="text-lg font-semibold">{interpretation.severity}</p>
                <p className="text-sm">Predicted Mortality: {interpretation.mortality}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Clinical Recommendations:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {interpretation.recommendations.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Mortality by Score:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• 0-2: ~2% mortality (mild)</li>
                  <li>• 3-4: ~15% mortality (moderate)</li>
                  <li>• 5-6: ~40% mortality (severe)</li>
                  <li>• ≥7: ~100% mortality (critical)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Requires 48 hours for complete assessment</li>
                  <li>• Different thresholds for gallstone vs. non-gallstone etiology</li>
                  <li>• Consider BISAP score for faster bedside assessment</li>
                  <li>• CT severity index (Balthazar) complements clinical scoring</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Ranson JH et al. Prognostic signs and the role of operative management 
                  in acute pancreatitis. Surg Gynecol Obstet. 1974;139(1):69-81.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RansonCriteriaCalculator;
