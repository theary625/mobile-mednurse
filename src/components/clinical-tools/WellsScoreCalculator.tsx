import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Info } from 'lucide-react';

const WellsScoreCalculator = () => {
  const [scoreType, setScoreType] = useState<'dvt' | 'pe'>('dvt');
  
  // DVT criteria
  const [dvtCriteria, setDvtCriteria] = useState({
    activeCancer: false,
    paralysis: false,
    bedridden: false,
    tenderness: false,
    legSwelling: false,
    calfSwelling: false,
    pittingEdema: false,
    collateralVeins: false,
    previousDVT: false,
    alternativeDiagnosis: false,
  });

  // PE criteria
  const [peCriteria, setPeCriteria] = useState({
    dvtSymptoms: false,
    alternativeLessLikely: false,
    heartRate: false,
    immobilization: false,
    previousDVTPE: false,
    hemoptysis: false,
    malignancy: false,
  });

  const dvtItems = [
    { key: 'activeCancer', label: 'Active cancer (treatment within 6 months or palliative)', points: 1 },
    { key: 'paralysis', label: 'Paralysis, paresis, or recent cast immobilization of lower extremity', points: 1 },
    { key: 'bedridden', label: 'Bedridden >3 days or major surgery within 12 weeks', points: 1 },
    { key: 'tenderness', label: 'Localized tenderness along deep venous system', points: 1 },
    { key: 'legSwelling', label: 'Entire leg swollen', points: 1 },
    { key: 'calfSwelling', label: 'Calf swelling >3 cm compared to asymptomatic leg', points: 1 },
    { key: 'pittingEdema', label: 'Pitting edema confined to symptomatic leg', points: 1 },
    { key: 'collateralVeins', label: 'Collateral superficial veins (non-varicose)', points: 1 },
    { key: 'previousDVT', label: 'Previously documented DVT', points: 1 },
    { key: 'alternativeDiagnosis', label: 'Alternative diagnosis at least as likely as DVT', points: -2 },
  ];

  const peItems = [
    { key: 'dvtSymptoms', label: 'Clinical signs/symptoms of DVT (leg swelling, pain with palpation)', points: 3 },
    { key: 'alternativeLessLikely', label: 'PE is #1 diagnosis, or equally likely', points: 3 },
    { key: 'heartRate', label: 'Heart rate >100 bpm', points: 1.5 },
    { key: 'immobilization', label: 'Immobilization ≥3 days or surgery in previous 4 weeks', points: 1.5 },
    { key: 'previousDVTPE', label: 'Previous DVT/PE', points: 1.5 },
    { key: 'hemoptysis', label: 'Hemoptysis', points: 1 },
    { key: 'malignancy', label: 'Malignancy (treatment within 6 months or palliative)', points: 1 },
  ];

  const calculateDVTScore = () => {
    let score = 0;
    dvtItems.forEach(item => {
      if (dvtCriteria[item.key as keyof typeof dvtCriteria]) {
        score += item.points;
      }
    });
    return score;
  };

  const calculatePEScore = () => {
    let score = 0;
    peItems.forEach(item => {
      if (peCriteria[item.key as keyof typeof peCriteria]) {
        score += item.points;
      }
    });
    return score;
  };

  const getDVTInterpretation = (score: number) => {
    if (score <= 0) {
      return {
        risk: 'Low',
        probability: '~5%',
        color: 'bg-green-500',
        recommendation: 'D-dimer testing recommended. If negative, DVT can be ruled out.',
      };
    } else if (score <= 2) {
      return {
        risk: 'Moderate',
        probability: '~17%',
        color: 'bg-yellow-500',
        recommendation: 'D-dimer testing or ultrasound recommended.',
      };
    } else {
      return {
        risk: 'High',
        probability: '~53%',
        color: 'bg-red-500',
        recommendation: 'Ultrasound recommended. Consider empiric anticoagulation while awaiting results.',
      };
    }
  };

  const getPEInterpretation = (score: number) => {
    if (score <= 1) {
      return {
        risk: 'Low',
        probability: '~1.3%',
        color: 'bg-green-500',
        recommendation: 'D-dimer testing recommended. If negative (by PERC or D-dimer), PE can be ruled out.',
      };
    } else if (score <= 4) {
      return {
        risk: 'Moderate',
        probability: '~16.2%',
        color: 'bg-yellow-500',
        recommendation: 'D-dimer testing recommended. If positive, CT-PA indicated.',
      };
    } else {
      return {
        risk: 'High',
        probability: '~37.5%',
        color: 'bg-red-500',
        recommendation: 'CT-PA recommended. Consider empiric anticoagulation while awaiting results.',
      };
    }
  };

  const dvtScore = calculateDVTScore();
  const peScore = calculatePEScore();
  const dvtInterpretation = getDVTInterpretation(dvtScore);
  const peInterpretation = getPEInterpretation(peScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Wells Score Calculator
        </CardTitle>
        <CardDescription>
          Clinical prediction rule for estimating DVT and PE probability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={scoreType} onValueChange={(v) => setScoreType(v as 'dvt' | 'pe')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dvt">Wells DVT</TabsTrigger>
            <TabsTrigger value="pe">Wells PE</TabsTrigger>
          </TabsList>

          <TabsContent value="dvt" className="space-y-4 mt-4">
            <div className="space-y-3">
              {dvtItems.map((item) => (
                <div key={item.key} className="flex items-start space-x-3">
                  <Checkbox
                    id={`dvt-${item.key}`}
                    checked={dvtCriteria[item.key as keyof typeof dvtCriteria]}
                    onCheckedChange={(checked) =>
                      setDvtCriteria(prev => ({ ...prev, [item.key]: checked }))
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor={`dvt-${item.key}`} className="text-sm cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                  <Badge variant={item.points < 0 ? 'destructive' : 'secondary'} className="shrink-0">
                    {item.points > 0 ? '+' : ''}{item.points}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Score:</span>
                <Badge className={`text-lg px-4 py-1 ${dvtInterpretation.color}`}>
                  {dvtScore}
                </Badge>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Risk Category:</span>
                  <Badge className={dvtInterpretation.color}>{dvtInterpretation.risk}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">DVT Probability:</span>
                  <span>{dvtInterpretation.probability}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {dvtInterpretation.recommendation}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pe" className="space-y-4 mt-4">
            <div className="space-y-3">
              {peItems.map((item) => (
                <div key={item.key} className="flex items-start space-x-3">
                  <Checkbox
                    id={`pe-${item.key}`}
                    checked={peCriteria[item.key as keyof typeof peCriteria]}
                    onCheckedChange={(checked) =>
                      setPeCriteria(prev => ({ ...prev, [item.key]: checked }))
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor={`pe-${item.key}`} className="text-sm cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    +{item.points}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Score:</span>
                <Badge className={`text-lg px-4 py-1 ${peInterpretation.color}`}>
                  {peScore}
                </Badge>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Risk Category:</span>
                  <Badge className={peInterpretation.color}>{peInterpretation.risk}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">PE Probability:</span>
                  <span>{peInterpretation.probability}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {peInterpretation.recommendation}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Clinical Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Wells criteria are validated for outpatient/ED settings</li>
                <li>Should be used in conjunction with clinical judgment</li>
                <li>Consider PERC rule for very low-risk PE patients</li>
                <li>D-dimer cutoffs may need age adjustment (age × 10 for patients &gt;50)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellsScoreCalculator;
