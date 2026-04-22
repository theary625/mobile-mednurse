import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Info, RotateCcw, SlidersHorizontal } from 'lucide-react';

const VASCalculator = () => {
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [showResults, setShowResults] = useState(false);

  const score = sliderValue[0];

  const getInterpretation = (value: number) => {
    if (value === 0) {
      return { category: 'No Pain', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', action: 'No intervention needed.' };
    } else if (value <= 30) {
      return { category: 'Mild Pain', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', action: 'Consider non-pharmacologic interventions. PRN mild analgesics if needed.' };
    } else if (value <= 60) {
      return { category: 'Moderate Pain', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800', action: 'Administer analgesics per protocol. Reassess in 30-60 minutes.' };
    } else {
      return { category: 'Severe Pain', color: 'bg-destructive/10 text-destructive border-destructive/30', action: 'Prompt analgesic intervention required. Consider multimodal approach.' };
    }
  };

  const getGradientPosition = (value: number) => {
    return `${value}%`;
  };

  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setSliderValue([0]);
    setShowResults(false);
  };

  // Convert to 0-10 scale for documentation
  const scoreOutOf10 = (score / 10).toFixed(1);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Visual Analog Scale (VAS)</CardTitle>
            <p className="text-teal-100 text-sm mt-1">Self-Report Pain Assessment (0-100mm)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Ask the patient to mark a point on the line that represents their current pain intensity. 
            The left end represents "No Pain" and the right end represents "Worst Pain Imaginable."
          </p>
        </div>

        <div className="space-y-6">
          <p className="font-semibold text-center text-foreground">Move the slider to indicate pain level:</p>
          
          <div className="space-y-4 px-2">
            {/* Visual gradient bar */}
            <div className="relative h-8 rounded-full overflow-hidden" style={{
              background: 'linear-gradient(to right, #22c55e 0%, #84cc16 20%, #eab308 40%, #f97316 60%, #ef4444 80%, #dc2626 100%)'
            }}>
              {/* Marker */}
              <div 
                className="absolute top-0 w-1 h-full bg-foreground shadow-lg transition-all"
                style={{ left: getGradientPosition(score) }}
              />
            </div>

            {/* Slider */}
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className="w-full"
            />

            {/* Labels */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>No Pain<br/><span className="text-xs">(0mm)</span></span>
              <span className="text-center">Moderate<br/><span className="text-xs">(50mm)</span></span>
              <span className="text-right">Worst Pain<br/><span className="text-xs">(100mm)</span></span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-lg text-muted-foreground"> mm</span>
            <p className="text-sm text-muted-foreground">({scoreOutOf10}/10 equivalent)</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Get Assessment
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold">{score} mm</p>
                <p className="text-lg text-muted-foreground">({scoreOutOf10}/10)</p>
                <p className="text-lg font-semibold mt-2">{interpretation.category}</p>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Documentation:</strong> "Patient marks VAS at {score}mm ({scoreOutOf10}/10). {interpretation.category}."
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">VAS Interpretation</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li><strong>0-4mm:</strong> No pain</li>
                  <li><strong>5-30mm:</strong> Mild pain</li>
                  <li><strong>31-60mm:</strong> Moderate pain</li>
                  <li><strong>61-100mm:</strong> Severe pain</li>
                </ul>
                <p className="mt-2 text-xs">Minimum clinically important difference (MCID): ~13mm</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Clinical Note:</strong> VAS is highly sensitive to change and useful for tracking pain over time. 
                A change of ≥13mm is generally considered clinically meaningful when assessing treatment response.
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Hawker GA, et al. Measures of adult pain. Arthritis Care Res. 2011;63(S11):S240-S252. VAS validated for adults who can mark on a continuous line.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VASCalculator;
