import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, RotateCcw } from 'lucide-react';

const MRSCalculator = () => {
  const [score, setScore] = useState<number | null>(null);

  const scaleOptions = [
    {
      value: 0,
      label: 'No symptoms',
      description: 'No symptoms at all'
    },
    {
      value: 1,
      label: 'No significant disability',
      description: 'Despite symptoms, able to carry out all usual duties and activities'
    },
    {
      value: 2,
      label: 'Slight disability',
      description: 'Unable to carry out all previous activities but able to look after own affairs without assistance'
    },
    {
      value: 3,
      label: 'Moderate disability',
      description: 'Requiring some help, but able to walk without assistance'
    },
    {
      value: 4,
      label: 'Moderately severe disability',
      description: 'Unable to walk without assistance and unable to attend to own bodily needs without assistance'
    },
    {
      value: 5,
      label: 'Severe disability',
      description: 'Bedridden, incontinent, and requiring constant nursing care and attention'
    },
    {
      value: 6,
      label: 'Dead',
      description: 'Death'
    }
  ];

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return { level: 'No disability', color: 'bg-green-500 text-white', category: 'Excellent outcome' };
    } else if (score <= 2) {
      return { level: 'Functional independence', color: 'bg-emerald-500 text-white', category: 'Good outcome' };
    } else if (score === 3) {
      return { level: 'Dependent but ambulatory', color: 'bg-warning text-warning-foreground', category: 'Moderate outcome' };
    } else if (score <= 5) {
      return { level: 'Dependent', color: 'bg-destructive text-destructive-foreground', category: 'Poor outcome' };
    } else {
      return { level: 'Deceased', color: 'bg-gray-700 text-white', category: 'Death' };
    }
  };

  const resetCalculator = () => {
    setScore(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Modified Rankin Scale (mRS)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Standardized measure of disability and functional independence after stroke
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select the level that best describes the patient's condition:</label>
            <div className="grid gap-2">
              {scaleOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={score === option.value ? "default" : "outline"}
                  onClick={() => setScore(option.value)}
                  className="h-auto py-3 px-4 justify-start text-left whitespace-normal"
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="font-bold text-lg min-w-[24px]">{option.value}</span>
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs opacity-80 mt-0.5">{option.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={resetCalculator} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </CardContent>
      </Card>

      {score !== null && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">mRS Score</p>
                <p className="text-5xl font-bold">{score}</p>
              </div>
              
              <Badge className={`${getInterpretation(score).color} text-sm px-4 py-2`}>
                {getInterpretation(score).level}
              </Badge>
              
              <p className="text-sm font-medium">
                {getInterpretation(score).category}
              </p>

              {score <= 2 && (
                <p className="text-sm text-muted-foreground">
                  mRS 0-2 is often used as the threshold for "good functional outcome" in stroke trials
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-4 h-4" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• mRS is the most widely used outcome measure in stroke clinical trials</li>
            <li>• mRS 0-2 typically defines "functional independence" or "good outcome"</li>
            <li>• mRS 3-5 indicates dependency requiring assistance</li>
            <li>• Assessment should focus on patient's current functional status, not pre-stroke baseline</li>
            <li>• Structured mRS interview improves inter-rater reliability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MRSCalculator;
