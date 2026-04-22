import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, RotateCcw, Smile } from 'lucide-react';

const faces = [
  { 
    value: 0, 
    label: 'No Hurt', 
    emoji: '😊',
    color: 'bg-green-100 hover:bg-green-200 border-green-300 dark:bg-green-950/50 dark:hover:bg-green-900/50 dark:border-green-700',
    selectedColor: 'bg-green-500 border-green-600 text-white',
    description: 'Very happy, no pain at all'
  },
  { 
    value: 2, 
    label: 'Hurts Little Bit', 
    emoji: '🙂',
    color: 'bg-lime-100 hover:bg-lime-200 border-lime-300 dark:bg-lime-950/50 dark:hover:bg-lime-900/50 dark:border-lime-700',
    selectedColor: 'bg-lime-500 border-lime-600 text-white',
    description: 'Hurts just a little bit'
  },
  { 
    value: 4, 
    label: 'Hurts Little More', 
    emoji: '😐',
    color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 dark:bg-yellow-950/50 dark:hover:bg-yellow-900/50 dark:border-yellow-700',
    selectedColor: 'bg-yellow-500 border-yellow-600 text-white',
    description: 'Hurts a little more'
  },
  { 
    value: 6, 
    label: 'Hurts Even More', 
    emoji: '🙁',
    color: 'bg-orange-100 hover:bg-orange-200 border-orange-300 dark:bg-orange-950/50 dark:hover:bg-orange-900/50 dark:border-orange-700',
    selectedColor: 'bg-orange-500 border-orange-600 text-white',
    description: 'Hurts even more'
  },
  { 
    value: 8, 
    label: 'Hurts Whole Lot', 
    emoji: '😢',
    color: 'bg-red-100 hover:bg-red-200 border-red-300 dark:bg-red-950/50 dark:hover:bg-red-900/50 dark:border-red-700',
    selectedColor: 'bg-red-500 border-red-600 text-white',
    description: 'Hurts a whole lot'
  },
  { 
    value: 10, 
    label: 'Hurts Worst', 
    emoji: '😭',
    color: 'bg-red-200 hover:bg-red-300 border-red-400 dark:bg-red-900/50 dark:hover:bg-red-800/50 dark:border-red-600',
    selectedColor: 'bg-red-700 border-red-800 text-white',
    description: 'Hurts as much as you can imagine'
  }
];

const WongBakerFacesCalculator = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return { 
        pain: 'No Pain', 
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', 
        action: 'No intervention needed. Continue to monitor.' 
      };
    } else if (score <= 2) {
      return { 
        pain: 'Mild Pain', 
        color: 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950/50 dark:text-lime-200 dark:border-lime-800', 
        action: 'Consider non-pharmacologic interventions (distraction, comfort measures).' 
      };
    } else if (score <= 4) {
      return { 
        pain: 'Mild-Moderate Pain', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', 
        action: 'Consider mild analgesics. Reassess in 30-60 minutes.' 
      };
    } else if (score <= 6) {
      return { 
        pain: 'Moderate Pain', 
        color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800', 
        action: 'Administer appropriate analgesia per protocol. Reassess post-intervention.' 
      };
    } else if (score <= 8) {
      return { 
        pain: 'Severe Pain', 
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-800', 
        action: 'Prompt analgesic intervention required. Consider multimodal approach.' 
      };
    } else {
      return { 
        pain: 'Worst Possible Pain', 
        color: 'bg-destructive/10 text-destructive border-destructive/30', 
        action: 'Urgent pain management needed. Notify provider immediately.' 
      };
    }
  };

  const selectedFace = faces.find(f => f.value === selectedScore);
  const interpretation = selectedScore !== null ? getInterpretation(selectedScore) : null;

  const handleReset = () => {
    setSelectedScore(null);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Smile className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Wong-Baker FACES® Scale</CardTitle>
            <p className="text-cyan-100 text-sm mt-1">Self-Report Pain Rating Scale (Ages 3+)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Ask the patient: "Point to the face that shows how much you hurt right now." 
            Explain that the first face shows no pain and the last face shows the worst pain imaginable.
            Suitable for children ≥3 years and adults who can self-report.
          </p>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-center text-foreground">Select the face that best describes your current pain:</p>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {faces.map((face) => (
              <button
                key={face.value}
                onClick={() => setSelectedScore(face.value)}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedScore === face.value 
                    ? face.selectedColor 
                    : face.color
                }`}
              >
                <div className="text-4xl md:text-5xl mb-2">{face.emoji}</div>
                <div className={`text-lg font-bold ${selectedScore === face.value ? '' : 'text-foreground'}`}>
                  {face.value}
                </div>
                <div className={`text-xs ${selectedScore === face.value ? '' : 'text-muted-foreground'}`}>
                  {face.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={selectedScore === null} 
            className="flex-1"
          >
            Get Pain Assessment
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && selectedScore !== null && interpretation && selectedFace && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{selectedFace.emoji}</div>
                <p className="text-4xl font-bold">{selectedScore}/10</p>
                <p className="text-lg font-semibold">{interpretation.pain}</p>
                <p className="text-sm opacity-80">{selectedFace.description}</p>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Pain Scale Interpretation</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>0: No hurt</li>
                  <li>2: Hurts little bit</li>
                  <li>4: Hurts little more</li>
                  <li>6: Hurts even more</li>
                  <li>8: Hurts whole lot</li>
                  <li>10: Hurts worst</li>
                </ul>
                <p className="mt-2 text-xs">Note: Goal is typically to maintain pain at ≤4 for comfort.</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Documentation tip:</strong> Record as "Patient self-reports pain {selectedScore}/10 using Wong-Baker FACES scale, 
                describing pain as '{selectedFace.label.toLowerCase()}'."
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Wong-Baker FACES Foundation. Wong-Baker FACES® Pain Rating Scale. www.WongBakerFACES.org. Originally published in Whaley & Wong's Nursing Care of Infants and Children. ©1983.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WongBakerFacesCalculator;
