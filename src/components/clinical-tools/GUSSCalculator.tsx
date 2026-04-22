import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

type Phase = 'preliminary' | 'direct';

const GUSSCalculator: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('preliminary');
  const [preliminary, setPreliminary] = useState({
    alertness: '',
    cough: '',
    saliva: '',
  });
  const [semisolid, setSemisolid] = useState({
    swallow: '',
    cough: '',
    drooling: '',
    voice: '',
  });
  const [liquid, setLiquid] = useState({
    swallow: '',
    cough: '',
    drooling: '',
    voice: '',
  });
  const [solid, setSolid] = useState({
    swallow: '',
    cough: '',
    drooling: '',
    voice: '',
  });
  const [showResults, setShowResults] = useState(false);

  const prelimScore = 
    (preliminary.alertness === 'yes' ? 1 : 0) +
    (preliminary.cough === 'yes' ? 1 : 0) +
    (preliminary.saliva === 'yes' ? 1 : 0);

  const semisolidScore =
    (semisolid.swallow === 'yes' ? 2 : semisolid.swallow === 'delayed' ? 1 : 0) +
    (semisolid.cough === 'no' ? 1 : 0) +
    (semisolid.drooling === 'no' ? 1 : 0) +
    (semisolid.voice === 'no' ? 1 : 0);

  const liquidScore =
    (liquid.swallow === 'yes' ? 2 : liquid.swallow === 'delayed' ? 1 : 0) +
    (liquid.cough === 'no' ? 1 : 0) +
    (liquid.drooling === 'no' ? 1 : 0) +
    (liquid.voice === 'no' ? 1 : 0);

  const solidScore =
    (solid.swallow === 'yes' ? 2 : solid.swallow === 'delayed' ? 1 : 0) +
    (solid.cough === 'no' ? 1 : 0) +
    (solid.drooling === 'no' ? 1 : 0) +
    (solid.voice === 'no' ? 1 : 0);

  const totalScore = prelimScore + semisolidScore + liquidScore + solidScore;

  const canProceedToDirect = prelimScore === 3;
  const canProceedToLiquid = semisolidScore === 5;
  const canProceedToSolid = liquidScore === 5;

  const getInterpretation = () => {
    if (totalScore === 20) {
      return {
        severity: 'No Dysphagia',
        risk: 'Minimal aspiration risk',
        diet: 'Normal diet',
        colorClass: 'bg-green-100 text-green-800 border-green-200',
      };
    } else if (totalScore >= 15) {
      return {
        severity: 'Mild Dysphagia',
        risk: 'Low aspiration risk',
        diet: 'Soft diet, thin liquids with SLP evaluation',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      };
    } else if (totalScore >= 10) {
      return {
        severity: 'Moderate Dysphagia',
        risk: 'Moderate aspiration risk',
        diet: 'Pureed diet, thickened liquids, SLP consult',
        colorClass: 'bg-orange-100 text-orange-800 border-orange-200',
      };
    } else {
      return {
        severity: 'Severe Dysphagia',
        risk: 'High aspiration risk',
        diet: 'NPO, consider alternative nutrition, urgent SLP/instrumental eval',
        colorClass: 'bg-red-100 text-red-800 border-red-200',
      };
    }
  };

  const interpretation = getInterpretation();

  const handleReset = () => {
    setPhase('preliminary');
    setPreliminary({ alertness: '', cough: '', saliva: '' });
    setSemisolid({ swallow: '', cough: '', drooling: '', voice: '' });
    setLiquid({ swallow: '', cough: '', drooling: '', voice: '' });
    setSolid({ swallow: '', cough: '', drooling: '', voice: '' });
    setShowResults(false);
  };

  const renderPreliminary = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Part 1: Preliminary Assessment (Indirect)</h3>
      <p className="text-sm text-muted-foreground">Assess WITHOUT giving food or liquid</p>
      
      <div className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <Label className="font-medium">Patient is alert and vigilant (GCS 15, cooperative)?</Label>
          <RadioGroup value={preliminary.alertness} onValueChange={(v) => setPreliminary({...preliminary, alertness: v})} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="alert-yes" />
              <Label htmlFor="alert-yes">Yes (1 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="alert-no" />
              <Label htmlFor="alert-no">No (0 pt)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <Label className="font-medium">Can cough voluntarily and/or clear throat?</Label>
          <RadioGroup value={preliminary.cough} onValueChange={(v) => setPreliminary({...preliminary, cough: v})} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="cough-yes" />
              <Label htmlFor="cough-yes">Yes (1 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="cough-no" />
              <Label htmlFor="cough-no">No (0 pt)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <Label className="font-medium">Can swallow saliva successfully (no drooling)?</Label>
          <RadioGroup value={preliminary.saliva} onValueChange={(v) => setPreliminary({...preliminary, saliva: v})} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="saliva-yes" />
              <Label htmlFor="saliva-yes">Yes (1 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="saliva-no" />
              <Label htmlFor="saliva-no">No (0 pt)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="font-medium">Preliminary Score: {prelimScore}/3</p>
        {prelimScore === 3 ? (
          <p className="text-sm text-green-600 mt-1">✓ Proceed to direct swallow testing</p>
        ) : preliminary.alertness && preliminary.cough && preliminary.saliva ? (
          <p className="text-sm text-red-600 mt-1">✗ Do not proceed - patient at high risk. Score as severe dysphagia.</p>
        ) : null}
      </div>
    </div>
  );

  const renderDirectTest = (
    title: string,
    instruction: string,
    state: typeof semisolid,
    setState: React.Dispatch<React.SetStateAction<typeof semisolid>>,
    prefix: string
  ) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{instruction}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <Label className="font-medium">Successful swallow?</Label>
          <RadioGroup value={state.swallow} onValueChange={(v) => setState({...state, swallow: v})} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${prefix}-swallow-yes`} />
              <Label htmlFor={`${prefix}-swallow-yes`}>Yes (2 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delayed" id={`${prefix}-swallow-delayed`} />
              <Label htmlFor={`${prefix}-swallow-delayed`}>Delayed (1 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${prefix}-swallow-no`} />
              <Label htmlFor={`${prefix}-swallow-no`}>No (0 pt)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <Label className="font-medium">Involuntary cough?</Label>
          <RadioGroup value={state.cough} onValueChange={(v) => setState({...state, cough: v})} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${prefix}-cough-no`} />
              <Label htmlFor={`${prefix}-cough-no`}>No (1 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${prefix}-cough-yes`} />
              <Label htmlFor={`${prefix}-cough-yes`}>Yes (0 pt)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <Label className="font-medium">Drooling?</Label>
          <RadioGroup value={state.drooling} onValueChange={(v) => setState({...state, drooling: v})} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${prefix}-drool-no`} />
              <Label htmlFor={`${prefix}-drool-no`}>No (1 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${prefix}-drool-yes`} />
              <Label htmlFor={`${prefix}-drool-yes`}>Yes (0 pt)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <Label className="font-medium">Voice change (wet/gurgly)?</Label>
          <RadioGroup value={state.voice} onValueChange={(v) => setState({...state, voice: v})} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${prefix}-voice-no`} />
              <Label htmlFor={`${prefix}-voice-no`}>No (1 pt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${prefix}-voice-yes`} />
              <Label htmlFor={`${prefix}-voice-yes`}>Yes (0 pt)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">GUSS - Gugging Swallowing Screen</CardTitle>
        <p className="text-indigo-100 text-sm mt-1">
          Bedside dysphagia screening for acute stroke patients
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {phase === 'preliminary' && renderPreliminary()}

        {phase === 'direct' && (
          <div className="space-y-8">
            {renderDirectTest(
              'Part 2a: Semi-solid Swallow (Pudding consistency)',
              'Give ⅓ to ½ teaspoon pudding consistency food, observe for 5 swallows',
              semisolid,
              setSemisolid,
              'semi'
            )}

            {canProceedToLiquid && renderDirectTest(
              'Part 2b: Liquid Swallow',
              'Start with 3ml, 5ml, 10ml, then 50ml water',
              liquid,
              setLiquid,
              'liquid'
            )}

            {canProceedToSolid && renderDirectTest(
              'Part 2c: Solid Swallow',
              'Give small piece of dry bread or cracker',
              solid,
              setSolid,
              'solid'
            )}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {phase === 'preliminary' && canProceedToDirect && (
            <Button onClick={() => setPhase('direct')} className="flex-1">
              Proceed to Direct Testing
            </Button>
          )}
          {phase === 'preliminary' && !canProceedToDirect && preliminary.alertness && preliminary.cough && preliminary.saliva && (
            <Button onClick={() => setShowResults(true)} variant="destructive" className="flex-1">
              Show Results (Severe Dysphagia)
            </Button>
          )}
          {phase === 'direct' && (
            <Button onClick={() => setShowResults(true)} className="flex-1">
              Calculate Total Score
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold">{totalScore}/20</p>
                <p className="text-lg font-semibold mt-2">{interpretation.severity}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Aspiration Risk</p>
                <p className="text-sm text-muted-foreground">{interpretation.risk}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg col-span-2">
                <p className="font-semibold text-sm mb-1">Diet Recommendation</p>
                <p className="text-sm text-muted-foreground">{interpretation.diet}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">GUSS Scoring</p>
                <ul className="mt-1 space-y-1">
                  <li>• 20 points: Normal swallowing, minimal aspiration risk</li>
                  <li>• 15-19: Mild dysphagia, low aspiration risk</li>
                  <li>• 10-14: Moderate dysphagia, moderate risk</li>
                  <li>• 0-9: Severe dysphagia, high aspiration risk</li>
                  <li>• Validated for acute stroke patients within first days</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GUSSCalculator;
