import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, Beaker } from 'lucide-react';

const UrinaryProteinCalculator: React.FC = () => {
  const [urineProtein, setUrineProtein] = useState('');
  const [urineCreatinine, setUrineCreatinine] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculatePCR = () => {
    const protein = parseFloat(urineProtein); // mg/dL
    const creatinine = parseFloat(urineCreatinine); // mg/dL
    
    // Protein/Creatinine Ratio (PCR) = urine protein / urine creatinine
    // Result approximates 24-hour urine protein in g/day
    const pcr = protein / creatinine;
    
    return pcr;
  };

  const getInterpretation = (pcr: number) => {
    // PCR correlates with 24-hour proteinuria (g/day)
    if (pcr < 0.15) {
      return {
        category: 'Normal',
        proteinuria24h: '<150 mg/day',
        description: 'Normal protein excretion',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (pcr < 0.5) {
      return {
        category: 'Mild Proteinuria',
        proteinuria24h: '150-500 mg/day',
        description: 'Mild elevation, may be seen in early CKD, hypertension',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else if (pcr < 3.5) {
      return {
        category: 'Moderate Proteinuria',
        proteinuria24h: '0.5-3.5 g/day',
        description: 'Significant proteinuria; warrants nephrology evaluation',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else {
      return {
        category: 'Nephrotic Range',
        proteinuria24h: '>3.5 g/day',
        description: 'Nephrotic-range proteinuria; urgent nephrology referral',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const canCalculate = urineProtein && urineCreatinine && parseFloat(urineCreatinine) > 0;
  const pcr = canCalculate ? calculatePCR() : 0;
  const interpretation = getInterpretation(pcr);

  const handleReset = () => {
    setUrineProtein('');
    setUrineCreatinine('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          Urinary Protein Excretion Estimation
        </CardTitle>
        <p className="text-indigo-100 text-sm mt-1">
          Estimates 24-hour proteinuria using spot urine protein/creatinine ratio (PCR)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Urine Protein */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Spot Urine Protein (mg/dL)</Label>
            <Input
              type="number"
              step="0.1"
              value={urineProtein}
              onChange={(e) => setUrineProtein(e.target.value)}
              placeholder="e.g., 50"
            />
            <p className="text-xs text-muted-foreground">From random urine sample</p>
          </div>

          {/* Urine Creatinine */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Spot Urine Creatinine (mg/dL)</Label>
            <Input
              type="number"
              step="0.1"
              value={urineCreatinine}
              onChange={(e) => setUrineCreatinine(e.target.value)}
              placeholder="e.g., 100"
            />
            <p className="text-xs text-muted-foreground">From same urine sample</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate PCR
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center">
                <p className="text-4xl font-bold">{pcr.toFixed(2)}</p>
                <p className="text-lg font-semibold mt-1">Protein/Creatinine Ratio (g/g)</p>
                <p className="text-xl font-bold mt-2">{interpretation.category}</p>
                <p className="text-sm mt-2">Estimated 24-hr Proteinuria: {interpretation.proteinuria24h}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">PCR Interpretation</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>&lt;0.15 g/g:</strong> Normal (&lt;150 mg/day)</li>
                  <li>• <strong>0.15-0.5 g/g:</strong> Mild proteinuria (150-500 mg/day)</li>
                  <li>• <strong>0.5-3.5 g/g:</strong> Moderate proteinuria (0.5-3.5 g/day)</li>
                  <li>• <strong>&gt;3.5 g/g:</strong> Nephrotic range (&gt;3.5 g/day)</li>
                </ul>
                <p className="mt-2 text-xs">PCR from a spot urine correlates well with 24-hour urine protein collection and is preferred due to convenience.</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Formula:</strong> PCR = Urine Protein (mg/dL) ÷ Urine Creatinine (mg/dL)
              </p>
              <p className="text-xs text-green-700 mt-1">
                Result in g/g approximates 24-hour urine protein excretion in g/day.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• First morning urine sample preferred (less variability)</li>
                  <li>• May be less accurate in extremes of muscle mass</li>
                  <li>• For diabetics, use albumin/creatinine ratio (ACR) instead</li>
                  <li>• Reference: KDIGO CKD Guidelines 2012</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrinaryProteinCalculator;
