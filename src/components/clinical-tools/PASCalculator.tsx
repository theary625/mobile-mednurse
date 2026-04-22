import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Video } from 'lucide-react';

const pasLevels = [
  {
    score: 1,
    name: 'Material does not enter airway',
    category: 'No Penetration/Aspiration',
    severity: 'Normal',
    colorClass: 'bg-green-100 border-green-300 text-green-800',
  },
  {
    score: 2,
    name: 'Material enters airway, remains above vocal folds, ejected',
    category: 'Penetration',
    severity: 'Normal',
    colorClass: 'bg-green-100 border-green-300 text-green-800',
  },
  {
    score: 3,
    name: 'Material enters airway, remains above vocal folds, NOT ejected',
    category: 'Penetration',
    severity: 'Mild',
    colorClass: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  },
  {
    score: 4,
    name: 'Material enters airway, contacts vocal folds, ejected',
    category: 'Penetration',
    severity: 'Mild',
    colorClass: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  },
  {
    score: 5,
    name: 'Material enters airway, contacts vocal folds, NOT ejected',
    category: 'Penetration',
    severity: 'Moderate',
    colorClass: 'bg-orange-100 border-orange-300 text-orange-800',
  },
  {
    score: 6,
    name: 'Material passes glottis, enters trachea, ejected into larynx or out of airway',
    category: 'Aspiration',
    severity: 'Moderate',
    colorClass: 'bg-orange-100 border-orange-300 text-orange-800',
  },
  {
    score: 7,
    name: 'Material passes glottis, enters trachea, NOT ejected despite effort',
    category: 'Aspiration',
    severity: 'Severe',
    colorClass: 'bg-red-100 border-red-300 text-red-800',
  },
  {
    score: 8,
    name: 'Material passes glottis, enters trachea, NO effort to eject (silent aspiration)',
    category: 'Silent Aspiration',
    severity: 'Severe',
    colorClass: 'bg-red-100 border-red-300 text-red-800',
  },
];

const PASCalculator: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<string>('');
  const [consistency, setConsistency] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const currentLevel = selectedScore ? pasLevels.find(l => l.score === parseInt(selectedScore)) : null;

  const getInterpretation = () => {
    const score = parseInt(selectedScore);
    if (score <= 2) {
      return {
        risk: 'No significant aspiration risk',
        recommendation: 'Consider diet advancement if clinically appropriate',
        safety: 'Safe swallow observed',
      };
    } else if (score <= 5) {
      return {
        risk: 'Penetration observed - aspiration risk present',
        recommendation: 'Consider modified diet, compensatory strategies, or therapy',
        safety: 'Material entered airway but did not pass vocal folds',
      };
    } else if (score === 6) {
      return {
        risk: 'Aspiration with clearance',
        recommendation: 'Modified diet, thickened liquids, SLP follow-up, consider repeat study',
        safety: 'Material entered trachea but patient was able to clear',
      };
    } else {
      return {
        risk: 'Significant aspiration risk',
        recommendation: 'NPO or highly modified diet, intensive SLP intervention, consider alternative nutrition',
        safety: score === 8 ? 'SILENT ASPIRATION - No protective response' : 'Aspiration without effective clearance',
      };
    }
  };

  const interpretation = currentLevel ? getInterpretation() : null;

  const handleReset = () => {
    setSelectedScore('');
    setConsistency('');
    setShowResults(false);
  };

  const consistencies = ['Thin liquid', 'Nectar-thick', 'Honey-thick', 'Pudding', 'Puree', 'Soft solid', 'Regular solid'];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Video className="h-5 w-5" />
          PAS - Penetration-Aspiration Scale
        </CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          8-point scale for scoring FEES/MBS instrumental swallow studies
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Score the worst (highest number) penetration-aspiration event 
            observed during instrumental evaluation (FEES or videofluoroscopy/MBS) for each consistency tested.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-medium">Consistency Tested (Optional)</Label>
            <RadioGroup
              value={consistency}
              onValueChange={setConsistency}
              className="flex flex-wrap gap-3"
            >
              {consistencies.map((c) => (
                <div key={c} className="flex items-center space-x-2">
                  <RadioGroupItem value={c} id={`consistency-${c}`} />
                  <Label htmlFor={`consistency-${c}`} className="text-sm cursor-pointer">{c}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Select PAS Score</h3>
          <RadioGroup
            value={selectedScore}
            onValueChange={(v) => { setSelectedScore(v); setShowResults(true); }}
            className="space-y-3"
          >
            {pasLevels.map((level) => (
              <div
                key={level.score}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedScore === level.score.toString()
                    ? level.colorClass + ' border-opacity-100'
                    : 'bg-muted/30 border-transparent hover:border-muted'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={level.score.toString()} id={`pas-${level.score}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`pas-${level.score}`} className="cursor-pointer">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg">Score {level.score}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          level.category === 'Silent Aspiration' ? 'bg-red-200 text-red-800' :
                          level.category === 'Aspiration' ? 'bg-orange-200 text-orange-800' :
                          level.category === 'Penetration' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {level.category}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {level.severity}
                        </span>
                      </div>
                      <p className="text-sm mt-2">{level.name}</p>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showResults && currentLevel && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border-2 ${currentLevel.colorClass}`}>
              <div className="text-center">
                <p className="text-5xl font-bold">PAS {currentLevel.score}</p>
                <p className="text-lg font-semibold mt-2">{currentLevel.category}</p>
                {consistency && (
                  <p className="text-sm mt-1 opacity-80">Consistency: {consistency}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Risk Assessment</p>
                <p className="text-sm text-muted-foreground">{interpretation.risk}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Safety Status</p>
                <p className="text-sm text-muted-foreground">{interpretation.safety}</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold text-sm mb-1">Recommendation</p>
              <p className="text-sm text-muted-foreground">{interpretation.recommendation}</p>
            </div>

            {currentLevel.score === 8 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">⚠️ Silent Aspiration Detected</p>
                  <p className="mt-1">
                    Patient aspirated without any protective cough reflex. This is the highest risk 
                    category and requires immediate intervention. Consider NPO status and alternative 
                    nutrition until treatment plan is established.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Reset / New Consistency
          </Button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">PAS Interpretation Guide</p>
            <ul className="mt-1 space-y-1">
              <li>• Scores 1-2: Normal (no penetration or penetration with clearance)</li>
              <li>• Scores 3-5: Penetration (material above vocal folds)</li>
              <li>• Scores 6-8: Aspiration (material below vocal folds)</li>
              <li>• Score 8: Silent aspiration - most dangerous, no protective response</li>
              <li>• Report worst score per consistency during instrumental exam</li>
              <li>• Developed by Rosenbek et al. (1996) for FEES and MBS</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PASCalculator;
