import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, Activity } from 'lucide-react';

const UCEISCalculator: React.FC = () => {
  const [vascular, setVascular] = useState<string>('');
  const [bleeding, setBleeding] = useState<string>('');
  const [erosions, setErosions] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const criteria = {
    vascular: [
      { value: '0', label: 'Normal', description: 'Normal vascular pattern' },
      { value: '1', label: 'Patchy obliteration', description: 'Patchy obliteration of vascular pattern' },
      { value: '2', label: 'Obliterated', description: 'Complete obliteration of vascular pattern' },
    ],
    bleeding: [
      { value: '0', label: 'None', description: 'No visible blood' },
      { value: '1', label: 'Mucosal', description: 'Some spots or streaks of coagulated blood on surface, washable' },
      { value: '2', label: 'Luminal mild', description: 'Some free liquid blood in lumen' },
      { value: '3', label: 'Luminal moderate/severe', description: 'Frank blood in lumen, or visible oozing' },
    ],
    erosions: [
      { value: '0', label: 'None', description: 'Normal mucosa, no erosions or ulcers' },
      { value: '1', label: 'Erosions', description: 'Erosions (white/yellow lesions ≤5mm)' },
      { value: '2', label: 'Superficial ulcer', description: 'Superficial ulceration (fibrin-covered lesions >5mm but discrete)' },
      { value: '3', label: 'Deep ulcer', description: 'Deep ulceration (deeper excavated lesions with raised edges)' },
    ]
  };

  const calculateScore = () => {
    return parseInt(vascular || '0') + parseInt(bleeding || '0') + parseInt(erosions || '0');
  };

  const getInterpretation = (score: number) => {
    if (score <= 1) {
      return { severity: 'Remission', color: 'bg-green-100 text-green-800 border-green-200' };
    } else if (score <= 4) {
      return { severity: 'Mild', color: 'bg-lime-100 text-lime-800 border-lime-200' };
    } else if (score <= 6) {
      return { severity: 'Moderate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { severity: 'Severe', color: 'bg-red-100 text-red-800 border-red-200' };
    }
  };

  const canCalculate = vascular !== '' && bleeding !== '' && erosions !== '';
  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setVascular('');
    setBleeding('');
    setErosions('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          UCEIS (Ulcerative Colitis Endoscopic Index of Severity)
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Standardized endoscopic assessment of ulcerative colitis severity
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Vascular Pattern */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Vascular Pattern (0-2 points)</Label>
          <RadioGroup value={vascular} onValueChange={setVascular} className="space-y-2">
            {criteria.vascular.map((item) => (
              <div key={item.value} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`vascular-${item.value}`} className="mt-1" />
                <div>
                  <Label htmlFor={`vascular-${item.value}`} className="cursor-pointer font-medium">
                    {item.label} ({item.value} pts)
                  </Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Bleeding */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Bleeding (0-3 points)</Label>
          <RadioGroup value={bleeding} onValueChange={setBleeding} className="space-y-2">
            {criteria.bleeding.map((item) => (
              <div key={item.value} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`bleeding-${item.value}`} className="mt-1" />
                <div>
                  <Label htmlFor={`bleeding-${item.value}`} className="cursor-pointer font-medium">
                    {item.label} ({item.value} pts)
                  </Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Erosions and Ulcers */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Erosions and Ulcers (0-3 points)</Label>
          <RadioGroup value={erosions} onValueChange={setErosions} className="space-y-2">
            {criteria.erosions.map((item) => (
              <div key={item.value} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`erosions-${item.value}`} className="mt-1" />
                <div>
                  <Label htmlFor={`erosions-${item.value}`} className="cursor-pointer font-medium">
                    {item.label} ({item.value} pts)
                  </Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate UCEIS Score
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold mt-1">UCEIS Score</p>
                <p className="text-xl font-bold mt-2">{interpretation.severity} Disease</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">UCEIS Score Interpretation (0-8)</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>0-1:</strong> Remission / Normal</li>
                  <li>• <strong>2-4:</strong> Mild disease</li>
                  <li>• <strong>5-6:</strong> Moderate disease</li>
                  <li>• <strong>7-8:</strong> Severe disease</li>
                </ul>
                <p className="mt-2 text-xs">Score components: Vascular pattern (0-2) + Bleeding (0-3) + Erosions/Ulcers (0-3)</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Travis SP, et al. Developing an instrument to assess the endoscopic severity of ulcerative colitis: 
                  the Ulcerative Colitis Endoscopic Index of Severity (UCEIS). Gut. 2012;61(4):535-542.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UCEISCalculator;
