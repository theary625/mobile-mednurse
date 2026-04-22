import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const MallampatiScoreCalculator: React.FC = () => {
  const [score, setScore] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const getInterpretation = (classVal: string) => {
    switch (classVal) {
      case '1':
        return {
          class: 'Class I',
          description: 'Soft palate, uvula, fauces, pillars visible',
          difficulty: 'Easy intubation expected',
          severity: 'low',
          rate: '~1% difficult intubation'
        };
      case '2':
        return {
          class: 'Class II',
          description: 'Soft palate, uvula, fauces visible',
          difficulty: 'Low difficulty expected',
          severity: 'low',
          rate: '~2% difficult intubation'
        };
      case '3':
        return {
          class: 'Class III',
          description: 'Soft palate, base of uvula visible',
          difficulty: 'Moderate difficulty expected',
          severity: 'moderate',
          rate: '~10% difficult intubation'
        };
      case '4':
        return {
          class: 'Class IV',
          description: 'Only hard palate visible',
          difficulty: 'Difficult intubation likely',
          severity: 'high',
          rate: '~20-30% difficult intubation'
        };
      default:
        return null;
    }
  };

  const result = showResults && score ? getInterpretation(score) : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setScore('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Mallampati Score</CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Airway assessment for intubation difficulty prediction
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Patient Position: Sitting upright, mouth fully open, tongue protruded without phonation
          </Label>
          
          <RadioGroup value={score} onValueChange={setScore} className="space-y-3">
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="1" id="class-1" className="mt-1" />
              <div>
                <Label htmlFor="class-1" className="font-medium cursor-pointer">Class I</Label>
                <p className="text-sm text-muted-foreground">
                  Soft palate, uvula, fauces, anterior & posterior pillars visible
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="2" id="class-2" className="mt-1" />
              <div>
                <Label htmlFor="class-2" className="font-medium cursor-pointer">Class II</Label>
                <p className="text-sm text-muted-foreground">
                  Soft palate, uvula, fauces visible; pillars obscured
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="3" id="class-3" className="mt-1" />
              <div>
                <Label htmlFor="class-3" className="font-medium cursor-pointer">Class III</Label>
                <p className="text-sm text-muted-foreground">
                  Soft palate, base of uvula visible; fauces obscured
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="4" id="class-4" className="mt-1" />
              <div>
                <Label htmlFor="class-4" className="font-medium cursor-pointer">Class IV</Label>
                <p className="text-sm text-muted-foreground">
                  Only hard palate visible; soft palate completely obscured
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!score} className="flex-1">
            Assess Airway
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold">{result.class}</p>
              <p className="text-lg font-semibold">{result.difficulty}</p>
              <p className="text-sm">{result.description}</p>
              <p className="text-sm font-medium mt-2">{result.rate}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Examination Technique</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Patient sitting upright, facing examiner at eye level</li>
              <li>Mouth fully open, tongue protruded maximally</li>
              <li>No phonation (saying "ah" elevates the palate)</li>
              <li>Assess oropharyngeal structures visible</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Limitations:</strong> Mallampati alone has limited predictive value (sensitivity ~60%). 
            Combine with other predictors: thyromental distance, neck mobility, mouth opening, upper lip bite test, 
            and body habitus for comprehensive airway assessment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MallampatiScoreCalculator;
