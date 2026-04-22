import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Info, RotateCcw } from 'lucide-react';

const criteria = [
  {
    id: 'face',
    label: 'Face Drooping',
    description: 'Ask the person to smile. Does one side of the face droop or is it numb?',
  },
  {
    id: 'arms',
    label: 'Arm Weakness',
    description: 'Ask the person to raise both arms. Does one arm drift downward?',
  },
  {
    id: 'speech',
    label: 'Speech Difficulty',
    description: 'Ask the person to repeat a simple sentence. Is speech slurred or hard to understand?',
  },
];

const FASTCalculator = () => {
  const [scores, setScores] = useState<Record<string, string>>({});

  const allAnswered = criteria.every((c) => scores[c.id] !== undefined);
  const positiveCount = Object.values(scores).filter((v) => v === 'yes').length;
  const isPositive = positiveCount > 0;

  const handleReset = () => setScores({});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">FAST Stroke Assessment</CardTitle>
              <CardDescription>Face, Arms, Speech, Time — rapid stroke screening</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {criteria.map((item) => (
          <div key={item.id} className="space-y-2">
            <Label className="text-sm font-medium">{item.label}</Label>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            <RadioGroup
              value={scores[item.id]}
              onValueChange={(v) => setScores((prev) => ({ ...prev, [item.id]: v }))}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${item.id}-yes`} />
                <Label htmlFor={`${item.id}-yes`} className="text-sm cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${item.id}-no`} />
                <Label htmlFor={`${item.id}-no`} className="text-sm cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
        ))}

        {allAnswered && (
          <div
            className={`p-4 rounded-lg border-2 ${
              isPositive
                ? 'bg-destructive/10 border-destructive/30 text-destructive'
                : 'bg-success/10 border-success/30 text-success'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">FAST Result</span>
              <Badge
                variant="outline"
                className={
                  isPositive
                    ? 'bg-destructive/10 border-destructive/30 text-destructive'
                    : 'bg-success/10 border-success/30 text-success'
                }
              >
                {positiveCount}/3 positive
              </Badge>
            </div>
            <div className="text-lg font-bold mb-1">
              {isPositive ? 'FAST Positive — Call 911 / Activate Stroke Alert' : 'FAST Negative'}
            </div>
            <p className="text-sm opacity-80">
              {isPositive
                ? 'Time is critical. Note symptom onset time and activate emergency response immediately.'
                : 'No acute stroke signs detected. Continue monitoring and reassess as needed.'}
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-1">T = Time to call emergency services</p>
            <p>If ANY sign is positive, note the time of onset and call 911 immediately. Eligible for thrombolytics within 4.5 hours of symptom onset.</p>
            <p className="mt-1"><strong>Reference:</strong> American Stroke Association (ASA)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FASTCalculator;
