import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TORBSSTCalculator: React.FC = () => {
  const [alertness, setAlertness] = useState('');
  const [tongueMovement, setTongueMovement] = useState('');
  const [tonguePalsy, setTonguePalsy] = useState('');
  const [waterResult, setWaterResult] = useState('');
  const [showResults, setShowResults] = useState(false);

  // TOR-BSST fails if ANY criteria fails
  const passedAlertness = alertness === 'pass';
  const passedTongue = tongueMovement === 'pass';
  const passedPalsy = tonguePalsy === 'pass';
  const passedWater = waterResult === 'pass';

  const canProceedToWater = passedAlertness && passedTongue && passedPalsy;
  const allInitialAnswered = alertness !== '' && tongueMovement !== '' && tonguePalsy !== '';
  const testComplete = allInitialAnswered && (!canProceedToWater || waterResult !== '');

  const isPassed = passedAlertness && passedTongue && passedPalsy && passedWater;

  const handleReset = () => {
    setAlertness('');
    setTongueMovement('');
    setTonguePalsy('');
    setWaterResult('');
    setShowResults(false);
  };

  const getFailedItems = () => {
    const failed = [];
    if (!passedAlertness) failed.push('Alertness/Sitting');
    if (!passedTongue) failed.push('Tongue Movement');
    if (!passedPalsy) failed.push('Facial Palsy');
    if (!passedWater && waterResult !== '') failed.push('Water Swallow');
    return failed;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">TOR-BSST</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Toronto Bedside Swallowing Screening Test - Stroke-specific dysphagia screen
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>TOR-BSST:</strong> A validated 4-item screening tool specifically designed for acute stroke patients. 
            Failure of ANY item results in screen failure and NPO status pending SLP evaluation.
          </p>
        </div>

        <div className="space-y-4">
          {/* Item 1: Alertness */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div>
              <Label className="font-semibold text-base">1. Alertness & Positioning</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Patient is alert (GCS ≥13) and can sit upright at ≥60° for at least 15 minutes
              </p>
            </div>
            <RadioGroup value={alertness} onValueChange={setAlertness} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="alert-pass" />
                <Label htmlFor="alert-pass" className="text-green-700 font-medium">Pass</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="alert-fail" />
                <Label htmlFor="alert-fail" className="text-red-700 font-medium">Fail</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Item 2: Tongue Movement */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div>
              <Label className="font-semibold text-base">2. Tongue Movement</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Ask patient to protrude tongue and move it side to side. Can move tongue symmetrically?
              </p>
            </div>
            <RadioGroup value={tongueMovement} onValueChange={setTongueMovement} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="tongue-pass" />
                <Label htmlFor="tongue-pass" className="text-green-700 font-medium">Pass - Normal movement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="tongue-fail" />
                <Label htmlFor="tongue-fail" className="text-red-700 font-medium">Fail - Weakness/deviation</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Item 3: Facial Palsy */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div>
              <Label className="font-semibold text-base">3. Facial Palsy Assessment</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Ask patient to smile and puff cheeks. Is there significant facial asymmetry?
              </p>
            </div>
            <RadioGroup value={tonguePalsy} onValueChange={setTonguePalsy} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="palsy-pass" />
                <Label htmlFor="palsy-pass" className="text-green-700 font-medium">Pass - Symmetric/mild asymmetry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="palsy-fail" />
                <Label htmlFor="palsy-fail" className="text-red-700 font-medium">Fail - Significant asymmetry</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Item 4: Water Swallow - Only if items 1-3 pass */}
          {canProceedToWater && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div>
                <Label className="font-semibold text-base">4. Water Swallow Trial</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Give 50ml water in sequential sips (teaspoon amounts). Observe for coughing, choking, 
                  or voice change during and 1 minute after.
                </p>
              </div>
              <RadioGroup value={waterResult} onValueChange={setWaterResult} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pass" id="water-pass" />
                  <Label htmlFor="water-pass" className="text-green-700 font-medium">Pass - No signs of aspiration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fail" id="water-fail" />
                  <Label htmlFor="water-fail" className="text-red-700 font-medium">Fail - Signs of aspiration</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {!canProceedToWater && allInitialAnswered && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>⚠️ Do not proceed to water trial.</strong> Patient failed preliminary items. 
                Screen is FAILED. Keep NPO and consult Speech-Language Pathology.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={!testComplete} 
            className="flex-1"
          >
            Show Results
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
                  ? 'Low aspiration risk - May initiate oral diet' 
                  : 'High aspiration risk - NPO, consult SLP'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-3 rounded-lg text-center ${passedAlertness ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs font-medium mb-1">Alertness</p>
                <p className={`text-lg font-bold ${passedAlertness ? 'text-green-700' : 'text-red-700'}`}>
                  {passedAlertness ? '✓' : '✗'}
                </p>
              </div>
              <div className={`p-3 rounded-lg text-center ${passedTongue ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs font-medium mb-1">Tongue</p>
                <p className={`text-lg font-bold ${passedTongue ? 'text-green-700' : 'text-red-700'}`}>
                  {passedTongue ? '✓' : '✗'}
                </p>
              </div>
              <div className={`p-3 rounded-lg text-center ${passedPalsy ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs font-medium mb-1">Facial</p>
                <p className={`text-lg font-bold ${passedPalsy ? 'text-green-700' : 'text-red-700'}`}>
                  {passedPalsy ? '✓' : '✗'}
                </p>
              </div>
              <div className={`p-3 rounded-lg text-center ${passedWater ? 'bg-green-50 border border-green-200' : waterResult === '' ? 'bg-gray-50 border border-gray-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs font-medium mb-1">Water</p>
                <p className={`text-lg font-bold ${passedWater ? 'text-green-700' : waterResult === '' ? 'text-gray-400' : 'text-red-700'}`}>
                  {waterResult === '' ? '–' : passedWater ? '✓' : '✗'}
                </p>
              </div>
            </div>

            {!isPassed && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-sm text-red-800 mb-2">Failed Items:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {getFailedItems().map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
                <p className="text-sm text-red-800 mt-3">
                  <strong>Action Required:</strong> Keep patient NPO. Place urgent SLP consult for comprehensive 
                  swallowing evaluation.
                </p>
              </div>
            )}

            {isPassed && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-sm text-green-800 mb-2">✓ Screen Passed</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• May initiate oral diet with supervision</li>
                  <li>• Start with soft/modified texture as appropriate</li>
                  <li>• Continue monitoring for signs of aspiration</li>
                  <li>• Re-screen if neurological status changes</li>
                </ul>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">TOR-BSST Validation</p>
                <ul className="mt-1 space-y-1">
                  <li>• Sensitivity: 91.3% for aspiration detection</li>
                  <li>• Specificity: 66.7%</li>
                  <li>• Negative Predictive Value: 93.3%</li>
                  <li>• Specifically validated for acute stroke populations</li>
                  <li>• Can be administered by trained nurses</li>
                  <li>• Takes approximately 5-10 minutes to complete</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TORBSSTCalculator;
