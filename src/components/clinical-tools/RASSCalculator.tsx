import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Brain } from 'lucide-react';

const rassLevels = [
  { value: 4, label: 'Combative', desc: 'Overtly combative, violent, immediate danger to staff', color: 'bg-destructive/20 text-destructive' },
  { value: 3, label: 'Very Agitated', desc: 'Pulls or removes tubes/catheters; aggressive', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-200' },
  { value: 2, label: 'Agitated', desc: 'Frequent non-purposeful movement, fights ventilator', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200' },
  { value: 1, label: 'Restless', desc: 'Anxious, apprehensive, movements not aggressive', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200' },
  { value: 0, label: 'Alert & Calm', desc: 'Spontaneously pays attention to caregiver', color: 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-200' },
  { value: -1, label: 'Drowsy', desc: 'Not fully alert, sustained awakening to voice (>10 sec)', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200' },
  { value: -2, label: 'Light Sedation', desc: 'Briefly awakens to voice (<10 sec)', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200' },
  { value: -3, label: 'Moderate Sedation', desc: 'Movement or eye opening to voice, no eye contact', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-200' },
  { value: -4, label: 'Deep Sedation', desc: 'No response to voice, movement/eye opening to physical stimulation', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200' },
  { value: -5, label: 'Unarousable', desc: 'No response to voice or physical stimulation', color: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200' }
];

const RASSCalculator = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const getInterpretation = (score: number) => {
    if (score >= 1) {
      return { 
        category: 'Agitation', 
        action: 'Consider cause (pain, delirium, hypoxia, etc.). May need intervention.',
        target: 'Target RASS 0 to -1 for most ICU patients'
      };
    } else if (score === 0) {
      return { 
        category: 'Alert & Calm', 
        action: 'Ideal awake state. Continue current management.',
        target: 'This is the typical goal for awake patients'
      };
    } else if (score >= -2) {
      return { 
        category: 'Light Sedation', 
        action: 'May be appropriate for ventilated patients. Perform CAM-ICU.',
        target: 'Target RASS -1 to -2 for mechanically ventilated patients'
      };
    } else if (score >= -3) {
      return { 
        category: 'Moderate Sedation', 
        action: 'Consider lightening sedation if possible. SAT/SBT protocols.',
        target: 'Deep sedation associated with worse outcomes'
      };
    } else {
      return { 
        category: 'Deep Sedation', 
        action: 'Reduce sedation if clinically safe. Associated with prolonged MV.',
        target: 'Avoid unless specifically indicated (ARDS, therapeutic hypothermia)'
      };
    }
  };

  const selectedLevel = rassLevels.find(l => l.value === selectedScore);
  const interpretation = selectedScore !== null ? getInterpretation(selectedScore) : null;

  const handleReset = () => {
    setSelectedScore(null);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">RASS Calculator</CardTitle>
            <p className="text-indigo-100 text-sm mt-1">Richmond Agitation-Sedation Scale</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Assessment Steps:</strong><br />
            1. Observe patient (alert, restless, agitated?)<br />
            2. If not alert, call patient&apos;s name and say &quot;open your eyes and look at me&quot;<br />
            3. If no response to verbal stimulation, physically stimulate (shoulder shake, trapezius squeeze)
          </p>
        </div>

        <div className="space-y-3">
          <Label className="font-semibold">Select RASS Level:</Label>
          <RadioGroup
            value={selectedScore?.toString()}
            onValueChange={(val) => setSelectedScore(parseInt(val))}
            className="space-y-2"
          >
            {rassLevels.map((level) => (
              <div key={level.value} className={`flex items-start space-x-2 p-3 rounded-lg ${selectedScore === level.value ? level.color : 'hover:bg-muted/50'}`}>
                <RadioGroupItem value={level.value.toString()} id={`rass-${level.value}`} className="mt-1" />
                <Label htmlFor={`rass-${level.value}`} className="cursor-pointer flex-1">
                  <span className="font-semibold">{level.value >= 0 ? '+' : ''}{level.value}: {level.label}</span>
                  <p className="text-sm text-muted-foreground">{level.desc}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={selectedScore === null} className="flex-1">
            Interpret RASS
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && selectedScore !== null && selectedLevel && interpretation && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${selectedLevel.color}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{selectedScore >= 0 ? '+' : ''}{selectedScore}</p>
                <p className="text-lg font-semibold">{selectedLevel.label}</p>
                <p className="text-sm">{interpretation.category}</p>
              </div>
              <div className="text-sm space-y-2">
                <p><strong>Action:</strong> {interpretation.action}</p>
                <p><strong>Target:</strong> {interpretation.target}</p>
              </div>
            </div>

            {selectedScore >= 2 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Significant Agitation</p>
                  <p>Assess for underlying causes: pain, delirium, hypoxia, full bladder, drug withdrawal. Ensure patient and staff safety.</p>
                </div>
              </div>
            )}

            {selectedScore <= -4 && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-800 dark:text-orange-200">
                  <p className="font-semibold">Deep Sedation Alert</p>
                  <p>Deep sedation (RASS ≤-4) associated with increased mortality, prolonged mechanical ventilation, and delirium. Consider sedation reduction.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Clinical Pearls</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Assess RASS before administering sedatives</li>
                  <li>Target lightest sedation level possible (RASS 0 to -2)</li>
                  <li>If RASS ≥-3, perform CAM-ICU for delirium screening</li>
                  <li>Document RASS at least every 4 hours</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Sessler CN, et al. The Richmond Agitation-Sedation Scale. Am J Respir Crit Care Med. 2002;166(10):1338-1344.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RASSCalculator;
