import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Brain } from 'lucide-react';

const CAMICUCalculator = () => {
  const [rassScore, setRassScore] = useState<number | null>(null);
  const [feature1, setFeature1] = useState<boolean | null>(null);
  const [feature2, setFeature2] = useState<boolean | null>(null);
  const [feature3, setFeature3] = useState<boolean | null>(null);
  const [feature4, setFeature4] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);

  const canAssess = rassScore !== null && rassScore >= -3;
  
  const allAnswered = rassScore !== null && (
    rassScore < -3 || (feature1 !== null && feature2 !== null && (feature2 === false || feature3 !== null || feature4 !== null))
  );

  const calculateResult = () => {
    if (rassScore === null) return null;
    
    // RASS -4 or -5: Patient is comatose, cannot assess for delirium
    if (rassScore < -3) {
      return { result: 'Unable to Assess', reason: 'Patient is comatose (RASS -4 or -5). Cannot assess for delirium.' };
    }

    // Feature 1 must be positive
    if (!feature1) {
      return { result: 'CAM-ICU Negative', reason: 'Feature 1 (Acute Onset/Fluctuation) is absent.' };
    }

    // Feature 2 must be positive
    if (!feature2) {
      return { result: 'CAM-ICU Negative', reason: 'Feature 2 (Inattention) is absent.' };
    }

    // Feature 1 + 2 positive, need Feature 3 OR 4
    if (feature3 || feature4) {
      return { result: 'CAM-ICU Positive', reason: 'Delirium Present: Features 1 + 2 + (3 or 4) are positive.' };
    }

    return { result: 'CAM-ICU Negative', reason: 'Feature 3 (Altered LOC) and Feature 4 (Disorganized Thinking) are both absent.' };
  };

  const result = calculateResult();

  const handleReset = () => {
    setRassScore(null);
    setFeature1(null);
    setFeature2(null);
    setFeature3(null);
    setFeature4(null);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">CAM-ICU</CardTitle>
            <p className="text-violet-100 text-sm mt-1">Confusion Assessment Method for the ICU</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Step 1: RASS Assessment */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <p className="font-semibold text-foreground">Step 1: Assess RASS Level</p>
          <p className="text-sm text-muted-foreground">Determine if patient is assessable (RASS ≥ -3)</p>
          <RadioGroup
            value={rassScore?.toString()}
            onValueChange={(val) => setRassScore(parseInt(val))}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="-5" id="rass--5" />
              <Label htmlFor="rass--5" className="cursor-pointer text-sm">-5 to -4: Comatose</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="-3" id="rass--3" />
              <Label htmlFor="rass--3" className="cursor-pointer text-sm">-3 to +4: Assessable</Label>
            </div>
          </RadioGroup>
        </div>

        {rassScore !== null && rassScore < -3 && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-muted-foreground">Patient is comatose (RASS -4 or -5). Stop here—cannot assess for delirium.</p>
          </div>
        )}

        {canAssess && (
          <>
            {/* Feature 1: Acute Onset or Fluctuating Course */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold text-foreground">Feature 1: Acute Onset or Fluctuating Course</p>
              <p className="text-sm text-muted-foreground">
                Is there an acute change from mental status baseline? OR<br />
                Has the patient&apos;s mental status fluctuated during the past 24 hours?
              </p>
              <RadioGroup
                value={feature1?.toString()}
                onValueChange={(val) => setFeature1(val === 'true')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="f1-yes" />
                  <Label htmlFor="f1-yes">Yes (Positive)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="f1-no" />
                  <Label htmlFor="f1-no">No (Negative)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Feature 2: Inattention */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold text-foreground">Feature 2: Inattention (ASE Letters or Pictures)</p>
              <p className="text-sm text-muted-foreground">
                &quot;Squeeze my hand when I say the letter A&quot; (read: S-A-V-E-A-H-A-A-R-T)<br />
                <strong>Positive if:</strong> &lt;8 correct responses (errors = not squeezing on &apos;A&apos; or squeezing on other letters)
              </p>
              <RadioGroup
                value={feature2?.toString()}
                onValueChange={(val) => setFeature2(val === 'true')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="f2-yes" />
                  <Label htmlFor="f2-yes">Positive (&lt;8 correct)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="f2-no" />
                  <Label htmlFor="f2-no">Negative (≥8 correct)</Label>
                </div>
              </RadioGroup>
            </div>

            {feature1 && feature2 && (
              <>
                {/* Feature 3: Altered Level of Consciousness */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <p className="font-semibold text-foreground">Feature 3: Altered Level of Consciousness</p>
                  <p className="text-sm text-muted-foreground">
                    Current RASS is anything other than 0 (alert and calm)
                  </p>
                  <RadioGroup
                    value={feature3?.toString()}
                    onValueChange={(val) => setFeature3(val === 'true')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="f3-yes" />
                      <Label htmlFor="f3-yes">Yes (RASS ≠ 0)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="f3-no" />
                      <Label htmlFor="f3-no">No (RASS = 0)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Feature 4: Disorganized Thinking */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <p className="font-semibold text-foreground">Feature 4: Disorganized Thinking</p>
                  <p className="text-sm text-muted-foreground">
                    Ask 4 yes/no questions + 1 command:<br />
                    1. Will a stone float on water?<br />
                    2. Are there fish in the sea?<br />
                    3. Does one pound weigh more than two pounds?<br />
                    4. Can you use a hammer to pound a nail?<br />
                    Command: &quot;Hold up this many fingers&quot; (show 2), then &quot;Do the same with your other hand&quot;<br />
                    <strong>Positive if:</strong> &gt;1 error
                  </p>
                  <RadioGroup
                    value={feature4?.toString()}
                    onValueChange={(val) => setFeature4(val === 'true')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="f4-yes" />
                      <Label htmlFor="f4-yes">Positive (&gt;1 error)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="f4-no" />
                      <Label htmlFor="f4-no">Negative (≤1 error)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </>
        )}

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Determine Result
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && result && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${
              result.result === 'CAM-ICU Positive' 
                ? 'bg-destructive/10 text-destructive border-destructive/30'
                : result.result === 'CAM-ICU Negative'
                ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800'
                : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
            }`}>
              <div className="text-center mb-4">
                <p className="text-2xl font-bold">{result.result}</p>
              </div>
              <p className="text-sm text-center">{result.reason}</p>
            </div>

            {result.result === 'CAM-ICU Positive' && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Delirium Detected</p>
                  <p>Implement delirium management protocols: investigate causes (infection, metabolic, medications), reduce sedation, promote sleep, early mobilization, reorient patient.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">CAM-ICU Algorithm</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>If RASS -4/-5: Stop—patient is comatose</li>
                  <li>Feature 1 + Feature 2 must be positive</li>
                  <li>Then need Feature 3 OR Feature 4 positive = Delirium</li>
                  <li>Reassess at least once per shift</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Ely EW, et al. Evaluation of delirium in critically ill patients: validation of the Confusion Assessment Method for the Intensive Care Unit (CAM-ICU). Crit Care Med. 2001;29(7):1370-1379.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAMICUCalculator;
