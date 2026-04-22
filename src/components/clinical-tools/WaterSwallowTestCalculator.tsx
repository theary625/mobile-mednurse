import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const WaterSwallowTestCalculator: React.FC = () => {
  const [volume, setVolume] = useState('');
  const [coughing, setCoughing] = useState('');
  const [choking, setChoking] = useState('');
  const [wetVoice, setWetVoice] = useState('');
  const [reducedO2, setReducedO2] = useState('');
  const [showResults, setShowResults] = useState(false);

  const hasAnyPositive = coughing === 'yes' || choking === 'yes' || wetVoice === 'yes' || reducedO2 === 'yes';
  const allAnswered = volume !== '' && coughing !== '' && choking !== '' && wetVoice !== '' && reducedO2 !== '';

  const getSignsCount = () => {
    let count = 0;
    if (coughing === 'yes') count++;
    if (choking === 'yes') count++;
    if (wetVoice === 'yes') count++;
    if (reducedO2 === 'yes') count++;
    return count;
  };

  const getInterpretation = () => {
    const signs = getSignsCount();
    if (signs === 0) {
      return {
        result: 'PASS',
        risk: 'Low aspiration risk',
        recommendation: 'May proceed with oral intake. Start with supervised small sips and advance as tolerated.',
        colorClass: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
      };
    } else if (signs <= 2) {
      return {
        result: 'FAIL',
        risk: 'Moderate aspiration risk',
        recommendation: 'NPO pending SLP evaluation. Consider thickened liquids if urgent nutrition needed.',
        colorClass: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: AlertTriangle,
      };
    } else {
      return {
        result: 'FAIL',
        risk: 'High aspiration risk',
        recommendation: 'Strict NPO. Urgent SLP consult and consider instrumental evaluation (FEES/MBS).',
        colorClass: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertTriangle,
      };
    }
  };

  const interpretation = getInterpretation();

  const handleReset = () => {
    setVolume('');
    setCoughing('');
    setChoking('');
    setWetVoice('');
    setReducedO2('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">3-oz Water Swallow Test</CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Simple bedside screening for aspiration risk (Burke Dysphagia Screen)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Patient should be upright (≥60°) and alert. Give 3 oz (90 ml) 
            of room temperature water without interruption. Observe during and for 1 minute after completion.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-medium">Test volume administered:</Label>
            <RadioGroup value={volume} onValueChange={setVolume} className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3oz" id="vol-3oz" />
                <Label htmlFor="vol-3oz">Full 3 oz (90ml)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="vol-partial" />
                <Label htmlFor="vol-partial">Partial (could not complete)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="vol-none" />
                <Label htmlFor="vol-none">Unable to attempt</Label>
              </div>
            </RadioGroup>
          </div>

          {(volume === '3oz' || volume === 'partial') && (
            <>
              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <Label className="font-medium">Coughing during or after swallow?</Label>
                <RadioGroup value={coughing} onValueChange={setCoughing} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cough-no" />
                    <Label htmlFor="cough-no" className="text-green-700">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="cough-yes" />
                    <Label htmlFor="cough-yes" className="text-red-700">Yes</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <Label className="font-medium">Choking or gagging?</Label>
                <RadioGroup value={choking} onValueChange={setChoking} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="choke-no" />
                    <Label htmlFor="choke-no" className="text-green-700">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="choke-yes" />
                    <Label htmlFor="choke-yes" className="text-red-700">Yes</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <Label className="font-medium">Wet or gurgly voice after swallow?</Label>
                <RadioGroup value={wetVoice} onValueChange={setWetVoice} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="voice-no" />
                    <Label htmlFor="voice-no" className="text-green-700">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="voice-yes" />
                    <Label htmlFor="voice-yes" className="text-red-700">Yes</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <Label className="font-medium">O₂ saturation drop ≥2% during/after?</Label>
                <RadioGroup value={reducedO2} onValueChange={setReducedO2} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="o2-no" />
                    <Label htmlFor="o2-no" className="text-green-700">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="o2-yes" />
                    <Label htmlFor="o2-yes" className="text-red-700">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="na" id="o2-na" />
                    <Label htmlFor="o2-na">Not monitored</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {volume === 'none' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>⚠️ Test cannot be administered.</strong> Patient is at high risk for aspiration. 
                Keep NPO and consult Speech-Language Pathology.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={volume === '' || (volume !== 'none' && !allAnswered)} 
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
            {volume === 'none' ? (
              <div className="p-6 rounded-lg border bg-red-100 text-red-800 border-red-200">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <AlertTriangle className="h-12 w-12" />
                  <p className="text-4xl font-bold">FAIL</p>
                </div>
                <p className="text-center text-lg font-medium">
                  Unable to perform test - High aspiration risk presumed
                </p>
              </div>
            ) : (
              <>
                <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <interpretation.icon className="h-12 w-12" />
                    <p className="text-4xl font-bold">{interpretation.result}</p>
                  </div>
                  <p className="text-center text-lg font-medium">{interpretation.risk}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="font-semibold text-sm mb-2">Signs Observed: {getSignsCount()}/4</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className={coughing === 'yes' ? 'text-red-600' : 'text-green-600'}>
                      {coughing === 'yes' ? '✗' : '✓'} Coughing
                    </p>
                    <p className={choking === 'yes' ? 'text-red-600' : 'text-green-600'}>
                      {choking === 'yes' ? '✗' : '✓'} Choking/Gagging
                    </p>
                    <p className={wetVoice === 'yes' ? 'text-red-600' : 'text-green-600'}>
                      {wetVoice === 'yes' ? '✗' : '✓'} Wet Voice
                    </p>
                    <p className={reducedO2 === 'yes' ? 'text-red-600' : reducedO2 === 'na' ? 'text-gray-500' : 'text-green-600'}>
                      {reducedO2 === 'yes' ? '✗' : reducedO2 === 'na' ? '–' : '✓'} O₂ Desat
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${hasAnyPositive ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  <p className="font-semibold text-sm mb-2">Recommendation:</p>
                  <p className="text-sm">{interpretation.recommendation}</p>
                </div>
              </>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• 3-oz water swallow test has ~80% sensitivity for aspiration</li>
                  <li>• Silent aspiration may occur without overt signs</li>
                  <li>• Any positive sign should prompt SLP referral</li>
                  <li>• Monitor SpO₂ before, during, and after test when possible</li>
                  <li>• Combine with other clinical indicators for best accuracy</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaterSwallowTestCalculator;
