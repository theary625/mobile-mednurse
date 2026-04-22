import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Stethoscope, RotateCcw, Info } from 'lucide-react';

const CentorScoreCalculator = () => {
  const [age, setAge] = useState<string>('');
  const [tonsillarExudate, setTonsillarExudate] = useState<string>('');
  const [tenderLymphNodes, setTenderLymphNodes] = useState<string>('');
  const [fever, setFever] = useState<string>('');
  const [cough, setCough] = useState<string>('');

  const calculateScore = () => {
    if (!age || !tonsillarExudate || !tenderLymphNodes || !fever || !cough) return null;

    let score = 0;

    // Age scoring (McIsaac modification)
    if (age === '3-14') score += 1;
    else if (age === '15-44') score += 0;
    else if (age === '45+') score -= 1;

    // Original Centor criteria
    if (tonsillarExudate === 'yes') score += 1;
    if (tenderLymphNodes === 'yes') score += 1;
    if (fever === 'yes') score += 1;
    if (cough === 'no') score += 1; // Absence of cough

    return Math.max(0, score); // Score cannot be negative
  };

  const score = calculateScore();

  const getInterpretation = () => {
    if (score === null) return null;

    const interpretations: Record<number, { probability: string; recommendation: string; color: string; bgColor: string }> = {
      0: {
        probability: '1-2.5%',
        recommendation: 'No testing or antibiotics needed',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30'
      },
      1: {
        probability: '5-10%',
        recommendation: 'No testing or antibiotics needed',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30'
      },
      2: {
        probability: '11-17%',
        recommendation: 'Consider rapid strep test; treat if positive',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30'
      },
      3: {
        probability: '28-35%',
        recommendation: 'Consider rapid strep test and/or culture; treat if positive',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30'
      },
      4: {
        probability: '51-53%',
        recommendation: 'Consider empiric treatment OR rapid strep test',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30'
      },
      5: {
        probability: '51-53%',
        recommendation: 'Consider empiric antibiotics',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30'
      }
    };

    return interpretations[Math.min(score, 5)];
  };

  const interpretation = getInterpretation();

  const resetForm = () => {
    setAge('');
    setTonsillarExudate('');
    setTenderLymphNodes('');
    setFever('');
    setCough('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Centor Score (Modified/McIsaac)</CardTitle>
            <CardDescription className="text-rose-100">
              Strep Pharyngitis Probability & Management
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p>Estimates probability of Group A Streptococcal pharyngitis to guide testing and treatment decisions.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Age */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Patient Age</Label>
            <RadioGroup value={age} onValueChange={setAge} className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="3-14" id="age-child" />
                <Label htmlFor="age-child" className="cursor-pointer">3-14 years (+1)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="15-44" id="age-adult" />
                <Label htmlFor="age-adult" className="cursor-pointer">15-44 years (0)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="45+" id="age-older" />
                <Label htmlFor="age-older" className="cursor-pointer">≥45 years (-1)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tonsillar Exudate */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tonsillar Exudate or Swelling?</Label>
            <RadioGroup value={tonsillarExudate} onValueChange={setTonsillarExudate} className="flex gap-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="yes" id="exudate-yes" />
                <Label htmlFor="exudate-yes" className="cursor-pointer">Yes (+1)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="no" id="exudate-no" />
                <Label htmlFor="exudate-no" className="cursor-pointer">No (0)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tender Anterior Cervical Lymph Nodes */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tender Anterior Cervical Lymphadenopathy?</Label>
            <RadioGroup value={tenderLymphNodes} onValueChange={setTenderLymphNodes} className="flex gap-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="yes" id="lymph-yes" />
                <Label htmlFor="lymph-yes" className="cursor-pointer">Yes (+1)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="no" id="lymph-no" />
                <Label htmlFor="lymph-no" className="cursor-pointer">No (0)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Fever */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">History of Fever (Temperature &gt;38°C/100.4°F)?</Label>
            <RadioGroup value={fever} onValueChange={setFever} className="flex gap-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="yes" id="fever-yes" />
                <Label htmlFor="fever-yes" className="cursor-pointer">Yes (+1)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="no" id="fever-no" />
                <Label htmlFor="fever-no" className="cursor-pointer">No (0)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Cough */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Cough Present?</Label>
            <RadioGroup value={cough} onValueChange={setCough} className="flex gap-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="no" id="cough-no" />
                <Label htmlFor="cough-no" className="cursor-pointer">No (+1)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="yes" id="cough-yes" />
                <Label htmlFor="cough-yes" className="cursor-pointer">Yes (0)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {score !== null && interpretation && (
          <div className={`p-6 rounded-lg border ${interpretation.bgColor}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Modified Centor Score</h3>
              <span className={`text-3xl font-bold ${interpretation.color}`}>{score}</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Probability of GAS Pharyngitis</p>
                <p className={`text-xl font-bold ${interpretation.color}`}>{interpretation.probability}</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm font-medium">Recommendation</p>
                <p className="text-sm mt-1">{interpretation.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>References:</strong></p>
          <p>Centor RM et al. Med Decis Making. 1981;1(3):239-246.</p>
          <p>McIsaac WJ et al. CMAJ. 1998;158(1):75-83.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CentorScoreCalculator;
