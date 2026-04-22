import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, CheckCircle, XCircle } from 'lucide-react';

const YaleSwallowCalculator: React.FC = () => {
  const [cognitive, setCognitive] = useState('');
  const [trialResult, setTrialResult] = useState('');
  const [showResults, setShowResults] = useState(false);

  const isPassed = cognitive === 'pass' && trialResult === 'pass';
  const canCalculate = cognitive !== '' && (cognitive === 'fail' || trialResult !== '');

  const handleReset = () => {
    setCognitive('');
    setTrialResult('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Yale Swallow Protocol</CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          Pass/Fail bedside dysphagia screening for aspiration risk
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Yale Swallow Protocol:</strong> A two-step pass/fail screening. Patient must pass BOTH 
            steps to be cleared for oral intake. Any failure requires SLP evaluation.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Cognitive Screen */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 1: Cognitive/Behavioral Prerequisites</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Patient must meet ALL of the following criteria to proceed:
              </p>
              <ul className="text-sm space-y-2 mb-4 ml-4">
                <li>• Alert and able to sit upright (at least 60°)</li>
                <li>• Able to follow simple commands</li>
                <li>• Can manage own oral secretions (no continuous drooling)</li>
                <li>• No current respiratory distress</li>
              </ul>
            </div>
            
            <RadioGroup value={cognitive} onValueChange={setCognitive} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="cog-pass" />
                <Label htmlFor="cog-pass" className="text-green-700 font-medium">PASS - All criteria met</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="cog-fail" />
                <Label htmlFor="cog-fail" className="text-red-700 font-medium">FAIL - One or more criteria not met</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Step 2: Water Swallow Trial (only if Step 1 passed) */}
          {cognitive === 'pass' && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Step 2: 3-oz Water Swallow Trial</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Give patient 3 oz (90ml) of water to drink without interruption. Observe during and 
                  immediately after (up to 1 minute).
                </p>
                <p className="text-sm font-medium mb-2">Pass criteria (ALL must be met):</p>
                <ul className="text-sm space-y-2 mb-4 ml-4">
                  <li>• Able to drink entire amount without stopping</li>
                  <li>• No coughing during or after</li>
                  <li>• No wet/gurgly voice quality after</li>
                </ul>
              </div>

              <RadioGroup value={trialResult} onValueChange={setTrialResult} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pass" id="trial-pass" />
                  <Label htmlFor="trial-pass" className="text-green-700 font-medium">PASS - All criteria met</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fail" id="trial-fail" />
                  <Label htmlFor="trial-fail" className="text-red-700 font-medium">FAIL - Any criteria failed</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {cognitive === 'fail' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>⚠️ Do not proceed to water trial.</strong> Patient failed cognitive prerequisites. 
                Refer to Speech-Language Pathology for comprehensive evaluation.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Show Result
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${isPassed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                {isPassed ? (
                  <CheckCircle className="h-12 w-12" />
                ) : (
                  <XCircle className="h-12 w-12" />
                )}
                <p className="text-4xl font-bold">{isPassed ? 'PASS' : 'FAIL'}</p>
              </div>
              <p className="text-center text-lg font-medium">
                {isPassed 
                  ? 'Safe to initiate oral diet with thin liquids' 
                  : 'NPO - Refer to Speech-Language Pathology'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className={`p-4 rounded-lg ${cognitive === 'pass' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="font-semibold text-sm mb-1">Step 1: Cognitive Screen</p>
                <p className="text-sm">{cognitive === 'pass' ? '✓ Passed' : '✗ Failed'}</p>
              </div>
              <div className={`p-4 rounded-lg ${trialResult === 'pass' ? 'bg-green-50 border border-green-200' : trialResult === 'fail' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="font-semibold text-sm mb-1">Step 2: Water Trial</p>
                <p className="text-sm">
                  {trialResult === 'pass' ? '✓ Passed' : trialResult === 'fail' ? '✗ Failed' : 'Not administered'}
                </p>
              </div>
            </div>

            {isPassed && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-sm text-green-800 mb-2">✓ Recommendations for Passed Screen:</p>
                <ul className="text-sm text-green-700 space-y-1 ml-4">
                  <li>• May initiate regular diet with thin liquids</li>
                  <li>• Continue to monitor for signs of aspiration</li>
                  <li>• Reassess if patient's status changes</li>
                  <li>• SLP referral if concerns arise during meals</li>
                </ul>
              </div>
            )}

            {!isPassed && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-sm text-red-800 mb-2">⚠️ Recommendations for Failed Screen:</p>
                <ul className="text-sm text-red-700 space-y-1 ml-4">
                  <li>• Keep patient NPO until SLP evaluation</li>
                  <li>• Place urgent SLP consult</li>
                  <li>• Consider instrumental evaluation (FEES/MBS)</li>
                  <li>• Monitor for signs of aspiration pneumonia</li>
                </ul>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• Yale Protocol has 96.5% sensitivity, 97.9% NPV for aspiration</li>
                  <li>• Validated for acute care, stroke, and general medical populations</li>
                  <li>• Quick to administer (3-5 minutes)</li>
                  <li>• Does not replace comprehensive SLP evaluation for complex patients</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default YaleSwallowCalculator;
