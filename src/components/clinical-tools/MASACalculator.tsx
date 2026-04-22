import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface MASAItem {
  id: string;
  name: string;
  maxScore: number;
  options: { value: number; label: string }[];
}

const masaItems: MASAItem[] = [
  {
    id: 'alertness',
    name: '1. Alertness',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Alert' },
      { value: 8, label: '8 - Drowsy/fatigued' },
      { value: 5, label: '5 - Obtunded' },
      { value: 2, label: '2 - Comatose' },
    ]
  },
  {
    id: 'cooperation',
    name: '2. Cooperation',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Full cooperation' },
      { value: 8, label: '8 - Partial cooperation' },
      { value: 5, label: '5 - Minimal cooperation' },
      { value: 2, label: '2 - No cooperation' },
    ]
  },
  {
    id: 'auditory',
    name: '3. Auditory Comprehension',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal' },
      { value: 8, label: '8 - Follows 2-step commands' },
      { value: 5, label: '5 - Follows 1-step commands' },
      { value: 2, label: '2 - Cannot follow commands' },
    ]
  },
  {
    id: 'respiration',
    name: '4. Respiration',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - Normal' },
      { value: 4, label: '4 - Slightly abnormal' },
      { value: 2, label: '2 - Moderately abnormal' },
      { value: 1, label: '1 - Severely abnormal' },
    ]
  },
  {
    id: 'respiratoryRate',
    name: '5. Respiratory Rate for Swallowing',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - Normal (<25/min)' },
      { value: 3, label: '3 - Abnormal (≥25/min)' },
      { value: 1, label: '1 - On ventilator' },
    ]
  },
  {
    id: 'aphasia',
    name: '6. Aphasia',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - No aphasia' },
      { value: 8, label: '8 - Mild (word-finding only)' },
      { value: 5, label: '5 - Moderate' },
      { value: 2, label: '2 - Severe/global' },
    ]
  },
  {
    id: 'apraxia',
    name: '7. Apraxia of Speech',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - None' },
      { value: 8, label: '8 - Mild' },
      { value: 5, label: '5 - Moderate' },
      { value: 2, label: '2 - Severe' },
    ]
  },
  {
    id: 'dysarthria',
    name: '8. Dysarthria',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - None' },
      { value: 8, label: '8 - Mild' },
      { value: 5, label: '5 - Moderate' },
      { value: 2, label: '2 - Severe/anarthric' },
    ]
  },
  {
    id: 'saliva',
    name: '9. Saliva',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - Normal' },
      { value: 4, label: '4 - Mild excess/dry' },
      { value: 2, label: '2 - Moderate pooling/dryness' },
      { value: 1, label: '1 - Severe drooling/xerostomia' },
    ]
  },
  {
    id: 'lipSeal',
    name: '10. Lip Seal',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - Normal' },
      { value: 4, label: '4 - Mild weakness' },
      { value: 2, label: '2 - Moderate weakness' },
      { value: 1, label: '1 - No seal' },
    ]
  },
  {
    id: 'tongueMovement',
    name: '11. Tongue Movement',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal' },
      { value: 8, label: '8 - Mildly reduced' },
      { value: 5, label: '5 - Moderately reduced' },
      { value: 2, label: '2 - Severely reduced/absent' },
    ]
  },
  {
    id: 'tongueStrength',
    name: '12. Tongue Strength',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal' },
      { value: 8, label: '8 - Mild weakness' },
      { value: 5, label: '5 - Moderate weakness' },
      { value: 2, label: '2 - Severe weakness' },
    ]
  },
  {
    id: 'tongueCoordination',
    name: '13. Tongue Coordination',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal' },
      { value: 8, label: '8 - Mildly reduced' },
      { value: 5, label: '5 - Moderately reduced' },
      { value: 2, label: '2 - Severely reduced' },
    ]
  },
  {
    id: 'oralPrep',
    name: '14. Oral Preparation',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal' },
      { value: 8, label: '8 - Mild difficulty' },
      { value: 5, label: '5 - Moderate difficulty' },
      { value: 2, label: '2 - Unable' },
    ]
  },
  {
    id: 'gag',
    name: '15. Gag Reflex',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - Normal' },
      { value: 4, label: '4 - Reduced' },
      { value: 2, label: '2 - Absent unilaterally' },
      { value: 1, label: '1 - Absent bilaterally' },
    ]
  },
  {
    id: 'palate',
    name: '16. Palate Movement',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - Normal' },
      { value: 4, label: '4 - Mildly reduced' },
      { value: 2, label: '2 - Moderately reduced' },
      { value: 1, label: '1 - Absent' },
    ]
  },
  {
    id: 'bolusClearance',
    name: '17. Bolus Clearance',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Complete clearance' },
      { value: 8, label: '8 - Minimal residue' },
      { value: 5, label: '5 - Moderate residue' },
      { value: 2, label: '2 - Severe residue' },
    ]
  },
  {
    id: 'oralTransit',
    name: '18. Oral Transit Time',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal (<1 sec)' },
      { value: 8, label: '8 - Mildly delayed (1-2 sec)' },
      { value: 5, label: '5 - Moderately delayed (2-5 sec)' },
      { value: 2, label: '2 - Severely delayed (>5 sec)' },
    ]
  },
  {
    id: 'coughReflex',
    name: '19. Cough Reflex',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - Normal' },
      { value: 4, label: '4 - Weakened' },
      { value: 2, label: '2 - Severely weakened' },
      { value: 1, label: '1 - Absent' },
    ]
  },
  {
    id: 'voluntaryCough',
    name: '20. Voluntary Cough',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Strong, effective' },
      { value: 8, label: '8 - Mildly reduced' },
      { value: 5, label: '5 - Weak, ineffective' },
      { value: 2, label: '2 - Absent' },
    ]
  },
  {
    id: 'voice',
    name: '21. Voice',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal' },
      { value: 8, label: '8 - Mild hoarseness' },
      { value: 5, label: '5 - Wet/gurgly quality' },
      { value: 2, label: '2 - Aphonic/severely impaired' },
    ]
  },
  {
    id: 'tracheostomy',
    name: '22. Tracheostomy',
    maxScore: 5,
    options: [
      { value: 5, label: '5 - No tracheostomy' },
      { value: 3, label: '3 - Cuffed trach, deflated' },
      { value: 1, label: '1 - Cuffed trach, inflated' },
    ]
  },
  {
    id: 'pharyngealPhase',
    name: '23. Pharyngeal Phase',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal initiation' },
      { value: 8, label: '8 - Mildly delayed' },
      { value: 5, label: '5 - Moderately delayed' },
      { value: 2, label: '2 - Severely delayed/absent' },
    ]
  },
  {
    id: 'pharyngealResponse',
    name: '24. Pharyngeal Response',
    maxScore: 10,
    options: [
      { value: 10, label: '10 - Normal' },
      { value: 8, label: '8 - Mild abnormality' },
      { value: 5, label: '5 - Moderate abnormality' },
      { value: 2, label: '2 - Severe abnormality' },
    ]
  },
];

const MASACalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = masaItems.reduce((sum, item) => sum + item.maxScore, 0); // 200
  const allAnswered = Object.keys(answers).length === masaItems.length;

  const getInterpretation = () => {
    if (totalScore >= 178) {
      return {
        severity: 'No Dysphagia',
        risk: 'Minimal aspiration risk',
        diet: 'Normal diet appropriate',
        colorClass: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
      };
    } else if (totalScore >= 168) {
      return {
        severity: 'Mild Dysphagia',
        risk: 'Low aspiration risk',
        diet: 'Soft diet, thin liquids with supervision',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Info,
      };
    } else if (totalScore >= 138) {
      return {
        severity: 'Moderate Dysphagia',
        risk: 'Moderate aspiration risk',
        diet: 'Modified diet (minced/puree), thickened liquids, SLP consult',
        colorClass: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: AlertTriangle,
      };
    } else {
      return {
        severity: 'Severe Dysphagia',
        risk: 'High aspiration risk',
        diet: 'NPO or therapeutic feeding only, instrumental eval (FEES/MBS) recommended',
        colorClass: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertTriangle,
      };
    }
  };

  const interpretation = getInterpretation();

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const categoryGroups = [
    { name: 'General', items: masaItems.slice(0, 5) },
    { name: 'Speech & Language', items: masaItems.slice(5, 8) },
    { name: 'Oral Motor', items: masaItems.slice(8, 14) },
    { name: 'Reflexes & Movement', items: masaItems.slice(14, 18) },
    { name: 'Airway & Pharyngeal', items: masaItems.slice(18, 24) },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">MASA - Mann Assessment of Swallowing Ability</CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Comprehensive 24-item clinical dysphagia evaluation for stroke and neurological patients
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Rate each item based on clinical observation. 
            Total score range: 0-200. Lower scores indicate more severe dysphagia.
          </p>
        </div>

        {!showResults && (
          <div className="space-y-8">
            {categoryGroups.map((group) => (
              <div key={group.name} className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">{group.name}</h3>
                <div className="grid gap-4">
                  {group.items.map((item) => (
                    <div key={item.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
                      <Label className="text-sm font-medium">{item.name}</Label>
                      <RadioGroup
                        value={answers[item.id]?.toString() || ''}
                        onValueChange={(value) => setAnswers({ ...answers, [item.id]: parseInt(value) })}
                        className="grid gap-2 sm:grid-cols-2"
                      >
                        {item.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} />
                            <Label htmlFor={`${item.id}-${option.value}`} className="text-sm cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {!showResults && (
            <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
              Calculate MASA Score
            </Button>
          )}
          {showResults && (
            <Button onClick={() => setShowResults(false)} variant="outline" className="flex-1">
              Edit Responses
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold">{totalScore}/{maxScore}</p>
                <p className="text-lg font-semibold mt-2">{interpretation.severity}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Aspiration Risk</p>
                <p className="text-sm text-muted-foreground">{interpretation.risk}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Diet Recommendation</p>
                <p className="text-sm text-muted-foreground">{interpretation.diet}</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold text-sm mb-2">Score Breakdown by Category</p>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {categoryGroups.map((group) => {
                  const categoryScore = group.items.reduce((sum, item) => sum + (answers[item.id] || 0), 0);
                  const categoryMax = group.items.reduce((sum, item) => sum + item.maxScore, 0);
                  return (
                    <div key={group.name} className="text-sm">
                      <span className="font-medium">{group.name}:</span> {categoryScore}/{categoryMax}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">MASA Interpretation Guide</p>
                <ul className="mt-1 space-y-1">
                  <li>• 178-200: No dysphagia / Normal swallowing</li>
                  <li>• 168-177: Mild dysphagia</li>
                  <li>• 138-167: Moderate dysphagia</li>
                  <li>• &lt;138: Severe dysphagia</li>
                  <li>• MASA sensitivity: 73%, specificity: 89% for aspiration</li>
                  <li>• Validated in acute stroke populations</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Considerations</p>
                <ul className="mt-1 space-y-1">
                  <li>• MASA is a clinical bedside tool; does not replace instrumental evaluation</li>
                  <li>• Consider FEES or MBS for patients with moderate-severe dysphagia</li>
                  <li>• Reassess with diet upgrades or clinical changes</li>
                  <li>• Document individual item scores to track specific deficits</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MASACalculator;
