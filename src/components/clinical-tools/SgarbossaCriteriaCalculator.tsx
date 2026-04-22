import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Badge } from '@/components/ui/badge';

const SgarbossaCriteriaCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState({
    concordantST: false,
    discordantST: false,
    stDepression: false,
  });
  const [showResults, setShowResults] = useState(false);

  const criteriaItems = [
    { 
      key: 'concordantST', 
      label: 'Concordant ST elevation ≥1 mm', 
      points: 5,
      description: 'ST elevation in leads with positive QRS complex'
    },
    { 
      key: 'stDepression', 
      label: 'ST depression ≥1 mm in V1, V2, or V3', 
      points: 3,
      description: 'Concordant ST depression in anterior leads'
    },
    { 
      key: 'discordantST', 
      label: 'Discordant ST elevation ≥5 mm', 
      points: 2,
      description: 'ST elevation ≥5mm in leads with negative QRS (less specific)'
    },
  ];

  const calculateScore = () => {
    let score = 0;
    if (criteria.concordantST) score += 5;
    if (criteria.stDepression) score += 3;
    if (criteria.discordantST) score += 2;
    return score;
  };

  const getInterpretation = (score: number) => {
    if (score >= 3) {
      return {
        result: 'Positive',
        likelihood: 'High likelihood of acute MI',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-500',
        recommendations: [
          'Treat as STEMI equivalent',
          'Emergent cardiology consultation',
          'Consider immediate reperfusion therapy (PCI or thrombolytics)',
          'Serial troponins and ECGs',
          'Continuous monitoring'
        ]
      };
    }
    return {
      result: 'Negative',
      likelihood: 'Lower likelihood, but does NOT rule out MI',
      color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
      badgeColor: 'bg-yellow-500',
      recommendations: [
        'Low score does NOT exclude acute MI',
        'Sensitivity is only ~36% (high specificity ~96%)',
        'Consider modified Smith criteria for better sensitivity',
        'Serial troponins essential',
        'Repeat ECG in 15-30 minutes',
        'Maintain high clinical suspicion'
      ]
    };
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setCriteria({
      concordantST: false,
      discordantST: false,
      stDepression: false,
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Sgarbossa's Criteria
        </CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Diagnose Acute MI in Left Bundle Branch Block (LBBB)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Weighted criteria to identify acute MI in patients with <strong>LBBB</strong> or <strong>ventricular paced rhythm</strong> where standard STEMI criteria don't apply.
          </p>
        </div>

        <div className="space-y-3">
          {criteriaItems.map((item) => (
            <div key={item.key} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                id={item.key}
                checked={criteria[item.key as keyof typeof criteria]}
                onCheckedChange={(checked) =>
                  setCriteria(prev => ({ ...prev, [item.key]: checked === true }))
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor={item.key} className="text-sm font-semibold cursor-pointer">
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Badge variant="secondary" className="shrink-0">+{item.points}</Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Evaluate Criteria
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score} points</p>
                <Badge className={interpretation.badgeColor}>{interpretation.result}</Badge>
                <p className="text-sm font-medium">{interpretation.likelihood}</p>
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
                <p className="font-semibold">Scoring (≥3 points suggests MI):</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Concordant ST elevation ≥1mm: <strong>5 points</strong> (most specific)</li>
                  <li>• ST depression V1-V3 ≥1mm: <strong>3 points</strong></li>
                  <li>• Discordant ST elevation ≥5mm: <strong>2 points</strong> (least specific)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Important Limitations:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Low sensitivity (~36%) - negative score does NOT rule out MI</li>
                  <li>• Smith-modified criteria may improve sensitivity</li>
                  <li>• Always correlate with troponins and clinical presentation</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Sgarbossa EB, et al. Electrocardiographic diagnosis of acute MI in the presence of LBBB. N Engl J Med. 1996;334(8):481-487.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SgarbossaCriteriaCalculator;
