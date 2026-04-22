import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, RotateCcw, Hash } from 'lucide-react';

const painLevels = [
  { value: 0, label: 'No Pain', color: 'bg-green-500 hover:bg-green-600', selectedColor: 'ring-4 ring-green-300' },
  { value: 1, label: 'Minimal', color: 'bg-green-400 hover:bg-green-500', selectedColor: 'ring-4 ring-green-200' },
  { value: 2, label: 'Mild', color: 'bg-lime-400 hover:bg-lime-500', selectedColor: 'ring-4 ring-lime-200' },
  { value: 3, label: 'Mild', color: 'bg-yellow-300 hover:bg-yellow-400', selectedColor: 'ring-4 ring-yellow-200' },
  { value: 4, label: 'Moderate', color: 'bg-yellow-400 hover:bg-yellow-500', selectedColor: 'ring-4 ring-yellow-300' },
  { value: 5, label: 'Moderate', color: 'bg-amber-400 hover:bg-amber-500', selectedColor: 'ring-4 ring-amber-300' },
  { value: 6, label: 'Moderate', color: 'bg-orange-400 hover:bg-orange-500', selectedColor: 'ring-4 ring-orange-300' },
  { value: 7, label: 'Severe', color: 'bg-orange-500 hover:bg-orange-600', selectedColor: 'ring-4 ring-orange-400' },
  { value: 8, label: 'Severe', color: 'bg-red-400 hover:bg-red-500', selectedColor: 'ring-4 ring-red-300' },
  { value: 9, label: 'Very Severe', color: 'bg-red-500 hover:bg-red-600', selectedColor: 'ring-4 ring-red-400' },
  { value: 10, label: 'Worst Possible', color: 'bg-red-600 hover:bg-red-700', selectedColor: 'ring-4 ring-red-500' },
];

const NRSCalculator = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return { category: 'No Pain', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', action: 'No intervention needed.' };
    } else if (score <= 3) {
      return { category: 'Mild Pain', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', action: 'Consider non-pharmacologic interventions. PRN mild analgesics if needed.' };
    } else if (score <= 6) {
      return { category: 'Moderate Pain', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800', action: 'Administer analgesics per protocol. Reassess in 30-60 minutes.' };
    } else {
      return { category: 'Severe Pain', color: 'bg-destructive/10 text-destructive border-destructive/30', action: 'Prompt analgesic intervention. Consider multimodal approach. Reassess frequently.' };
    }
  };

  const selectedLevel = painLevels.find(p => p.value === selectedScore);
  const interpretation = selectedScore !== null ? getInterpretation(selectedScore) : null;

  const handleReset = () => {
    setSelectedScore(null);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Hash className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Numeric Pain Rating Scale (NRS)</CardTitle>
            <p className="text-indigo-100 text-sm mt-1">Self-Report Pain Assessment (0-10)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Ask the patient: "On a scale of 0 to 10, with 0 being no pain and 10 being the worst pain imaginable, what is your current pain level?"
          </p>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-center text-foreground">Select pain level (0-10):</p>
          
          <div className="flex justify-center gap-1 flex-wrap">
            {painLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedScore(level.value)}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105 ${level.color} ${
                  selectedScore === level.value ? level.selectedColor : ''
                }`}
              >
                {level.value}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>No Pain</span>
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
            <span>Worst</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={selectedScore === null} className="flex-1">
            Get Assessment
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && selectedScore !== null && interpretation && selectedLevel && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold">{selectedScore}/10</p>
                <p className="text-lg font-semibold mt-2">{interpretation.category}</p>
                <p className="text-sm opacity-80">{selectedLevel.label} pain</p>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Documentation:</strong> "Patient rates pain {selectedScore}/10 on NRS. {interpretation.category}."
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Pain Scale Categories</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li><strong>0:</strong> No pain</li>
                  <li><strong>1-3:</strong> Mild pain</li>
                  <li><strong>4-6:</strong> Moderate pain</li>
                  <li><strong>7-10:</strong> Severe pain</li>
                </ul>
                <p className="mt-2 text-xs">Treatment goal: typically maintain pain ≤4</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> McCaffery M, Beebe A. Pain: Clinical Manual for Nursing Practice. Mosby, 1989. NRS is validated for use in adults and children ≥8 years who can self-report.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NRSCalculator;
