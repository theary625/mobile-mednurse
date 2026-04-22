import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info } from 'lucide-react';

const AIHScoreCalculator: React.FC = () => {
  const [ana, setAna] = useState<string | null>(null);
  const [sma, setSma] = useState<string | null>(null);
  const [lkm, setLkm] = useState<string | null>(null);
  const [sla, setSla] = useState<string | null>(null);
  const [igg, setIgg] = useState<string | null>(null);
  const [histology, setHistology] = useState<string | null>(null);
  const [viralHepatitis, setViralHepatitis] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    let score = 0;

    // ANA or SMA (mutually exclusive scoring with LKM)
    const anaScore = ana === '>=1:40' ? 1 : ana === '>=1:80' ? 2 : 0;
    const smaScore = sma === '>=1:40' ? 1 : sma === '>=1:80' ? 2 : 0;
    const lkmScore = lkm === '>=1:40' ? 2 : 0;
    const slaScore = sla === 'positive' ? 2 : 0;

    // Take highest of ANA/SMA or LKM (max 2 points for autoantibodies)
    score += Math.max(anaScore, smaScore, lkmScore, slaScore);

    // IgG
    if (igg === '>upper-limit') score += 1;
    if (igg === '>=1.1x') score += 2;

    // Histology
    if (histology === 'compatible') score += 1;
    if (histology === 'typical') score += 2;

    // Absence of viral hepatitis
    if (viralHepatitis === 'negative') score += 2;

    return score;
  };

  const getInterpretation = (score: number) => {
    if (score >= 7) {
      return {
        diagnosis: 'Definite AIH',
        description: 'Score ≥7 indicates definite autoimmune hepatitis',
        colorClass: 'bg-red-100 border-red-200 text-red-800',
        recommendations: [
          'Initiate immunosuppressive therapy (prednisone ± azathioprine)',
          'Consider liver biopsy if not done',
          'Screen for other autoimmune conditions',
          'Monitor liver function closely'
        ]
      };
    } else if (score >= 6) {
      return {
        diagnosis: 'Probable AIH',
        description: 'Score of 6 indicates probable autoimmune hepatitis',
        colorClass: 'bg-orange-100 border-orange-200 text-orange-800',
        recommendations: [
          'Consider liver biopsy for confirmation',
          'Discuss treatment options with patient',
          'Rule out other causes of hepatitis',
          'Close follow-up with repeat testing'
        ]
      };
    } else {
      return {
        diagnosis: 'AIH Unlikely',
        description: 'Score <6 makes autoimmune hepatitis unlikely',
        colorClass: 'bg-green-100 border-green-200 text-green-800',
        recommendations: [
          'Consider alternative diagnoses',
          'Additional workup for other liver diseases',
          'Monitor and retest if clinical suspicion remains'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setAna(null);
    setSma(null);
    setLkm(null);
    setSla(null);
    setIgg(null);
    setHistology(null);
    setViralHepatitis(null);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-700 to-yellow-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Simplified AIH Score</CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Simplified diagnostic criteria for autoimmune hepatitis (Hennes et al. 2008)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            The simplified AIH score uses autoantibodies, IgG levels, histology, and viral hepatitis status.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="font-semibold mb-3 block">ANA (Antinuclear Antibody)</Label>
            <RadioGroup value={ana || ''} onValueChange={setAna} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="negative" id="ana-neg" />
                <Label htmlFor="ana-neg">Negative or &lt;1:40</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value=">=1:40" id="ana-40" />
                <Label htmlFor="ana-40">≥1:40 (+1 point)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value=">=1:80" id="ana-80" />
                <Label htmlFor="ana-80">≥1:80 (+2 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-semibold mb-3 block">SMA (Smooth Muscle Antibody)</Label>
            <RadioGroup value={sma || ''} onValueChange={setSma} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="negative" id="sma-neg" />
                <Label htmlFor="sma-neg">Negative or &lt;1:40</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value=">=1:40" id="sma-40" />
                <Label htmlFor="sma-40">≥1:40 (+1 point)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value=">=1:80" id="sma-80" />
                <Label htmlFor="sma-80">≥1:80 (+2 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-semibold mb-3 block">Anti-LKM1 (Liver-Kidney Microsomal)</Label>
            <RadioGroup value={lkm || ''} onValueChange={setLkm} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="negative" id="lkm-neg" />
                <Label htmlFor="lkm-neg">Negative or &lt;1:40</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value=">=1:40" id="lkm-40" />
                <Label htmlFor="lkm-40">≥1:40 (+2 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-semibold mb-3 block">Anti-SLA (Soluble Liver Antigen)</Label>
            <RadioGroup value={sla || ''} onValueChange={setSla} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="negative" id="sla-neg" />
                <Label htmlFor="sla-neg">Negative</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="positive" id="sla-pos" />
                <Label htmlFor="sla-pos">Positive (+2 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="p-3 bg-muted/30 rounded text-sm text-muted-foreground">
            <strong>Note:</strong> Maximum 2 points for autoantibodies total. If multiple antibodies positive, only highest value counts.
          </div>

          <div>
            <Label className="font-semibold mb-3 block">IgG Level</Label>
            <RadioGroup value={igg || ''} onValueChange={setIgg} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="normal" id="igg-normal" />
                <Label htmlFor="igg-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value=">upper-limit" id="igg-upper" />
                <Label htmlFor="igg-upper">&gt;Upper limit of normal (+1 point)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value=">=1.1x" id="igg-11x" />
                <Label htmlFor="igg-11x">≥1.1× upper limit of normal (+2 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-semibold mb-3 block">Liver Histology</Label>
            <RadioGroup value={histology || ''} onValueChange={setHistology} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="atypical" id="histo-atyp" />
                <Label htmlFor="histo-atyp">Atypical</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="compatible" id="histo-compat" />
                <Label htmlFor="histo-compat">Compatible with AIH (+1 point)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="typical" id="histo-typical" />
                <Label htmlFor="histo-typical">Typical AIH (interface hepatitis) (+2 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="font-semibold mb-3 block">Viral Hepatitis (Hep A, B, C)</Label>
            <RadioGroup value={viralHepatitis || ''} onValueChange={setViralHepatitis} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="positive" id="viral-pos" />
                <Label htmlFor="viral-pos">Positive (active viral hepatitis)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="negative" id="viral-neg" />
                <Label htmlFor="viral-neg">Negative (+2 points)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">Calculate Score</Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold">{score}</p>
              <p className="text-sm font-semibold">Points (Max: 8)</p>
            </div>
            <div className="text-center mb-4 pt-4 border-t border-current/20">
              <p className="text-xl font-bold">{interpretation.diagnosis}</p>
              <p className="text-sm mt-1">{interpretation.description}</p>
            </div>
            <div className="pt-4 border-t border-current/20">
              <p className="font-semibold mb-2">Recommendations:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {interpretation.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Scoring Thresholds:</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-green-100 rounded text-green-800 text-center">
              <p className="font-bold">&lt;6</p>
              <p className="text-xs">AIH Unlikely</p>
            </div>
            <div className="p-2 bg-orange-100 rounded text-orange-800 text-center">
              <p className="font-bold">6</p>
              <p className="text-xs">Probable AIH</p>
            </div>
            <div className="p-2 bg-red-100 rounded text-red-800 text-center">
              <p className="font-bold">≥7</p>
              <p className="text-xs">Definite AIH</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Notes</p>
            <p className="mt-1">The simplified AIH score has 88% sensitivity and 97% specificity for AIH diagnosis. It is intended for patients without prior AIH treatment.</p>
            <p className="mt-2 text-xs">Reference: Hennes EM et al. Hepatology 2008;48(1):169-176</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIHScoreCalculator;
