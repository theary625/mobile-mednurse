import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ShanghaiScoreCalculator: React.FC = () => {
  const [ecgCriteria, setEcgCriteria] = useState<Record<string, string>>({
    spontaneousType1: '',
    feverType1: '',
    drugType1: '',
    type2or3: '',
  });
  const [clinicalHistory, setClinicalHistory] = useState<Record<string, string>>({
    unexplainedArrest: '',
    nocturnalAgonalBreathing: '',
    suspectedArrhythmicSyncope: '',
    unclearSyncope: '',
    afibFlutter: '',
  });
  const [familyHistory, setFamilyHistory] = useState<Record<string, string>>({
    familyType1: '',
    familySCD: '',
    unexplainedSCDFamily: '',
  });
  const [geneticTest, setGeneticTest] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    let score = 0;

    // ECG (only highest scoring applies)
    if (ecgCriteria.spontaneousType1 === 'yes') score += 3.5;
    else if (ecgCriteria.feverType1 === 'yes') score += 3;
    else if (ecgCriteria.drugType1 === 'yes') score += 2;
    else if (ecgCriteria.type2or3 === 'yes') score += 0.5;

    // Clinical history (all applicable)
    if (clinicalHistory.unexplainedArrest === 'yes') score += 3;
    if (clinicalHistory.nocturnalAgonalBreathing === 'yes') score += 2;
    if (clinicalHistory.suspectedArrhythmicSyncope === 'yes') score += 2;
    if (clinicalHistory.unclearSyncope === 'yes') score += 1;
    if (clinicalHistory.afibFlutter === 'yes') score += 0.5;

    // Family history (only highest scoring applies)
    if (familyHistory.familyType1 === 'yes') score += 2;
    else if (familyHistory.familySCD === 'yes') score += 1;
    else if (familyHistory.unexplainedSCDFamily === 'yes') score += 0.5;

    // Genetic test
    if (geneticTest === 'pathogenic') score += 0.5;

    return score;
  };

  const getInterpretation = (score: number) => {
    if (score >= 3.5) {
      return {
        diagnosis: 'Probable/Definite Brugada Syndrome',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-600',
        recommendations: [
          'High likelihood of Brugada syndrome',
          'Referral to electrophysiology specialist',
          'Consider ICD evaluation based on risk factors',
          'Family screening recommended',
          'Avoid drugs on Brugada contraindicated list',
          'Fever management education'
        ]
      };
    } else if (score >= 2) {
      return {
        diagnosis: 'Possible Brugada Syndrome',
        color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-500',
        recommendations: [
          'Moderate suspicion for Brugada syndrome',
          'Consider drug challenge (ajmaline/flecainide) if ECG inconclusive',
          'Electrophysiology consultation recommended',
          'Family screening may be considered',
          'Educate on fever management'
        ]
      };
    } else {
      return {
        diagnosis: 'Brugada Syndrome Unlikely',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        recommendations: [
          'Low probability of Brugada syndrome',
          'Consider alternative diagnoses',
          'Drug challenge may be considered if high clinical suspicion',
          'Reassess if new symptoms develop'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setEcgCriteria({ spontaneousType1: '', feverType1: '', drugType1: '', type2or3: '' });
    setClinicalHistory({ unexplainedArrest: '', nocturnalAgonalBreathing: '', suspectedArrhythmicSyncope: '', unclearSyncope: '', afibFlutter: '' });
    setFamilyHistory({ familyType1: '', familySCD: '', unexplainedSCDFamily: '' });
    setGeneticTest('');
    setShowResults(false);
  };

  const RadioOption = ({ label, points, value, onChange, groupKey }: { label: string; points: string; value: string; onChange: (v: string) => void; groupKey: string }) => (
    <div className="p-3 border rounded-lg">
      <Label className="text-sm font-medium flex justify-between">
        <span>{label}</span>
        <span className="text-muted-foreground">{points}</span>
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${groupKey}-no`} />
          <Label htmlFor={`${groupKey}-no`} className="font-normal">No</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${groupKey}-yes`} />
          <Label htmlFor={`${groupKey}-yes`} className="font-normal">Yes</Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Shanghai Score for Brugada Syndrome
        </CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          Risk stratification in suspected Brugada syndrome
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Consensus scoring system for diagnosis of Brugada syndrome based on ECG, clinical history, family history, and genetic testing.
          </p>
        </div>

        {/* ECG Criteria */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">ECG Findings (select highest applicable)</h3>
          <RadioOption
            label="Spontaneous Type 1 Brugada ECG pattern"
            points="+3.5 pts"
            value={ecgCriteria.spontaneousType1}
            onChange={(v) => setEcgCriteria(prev => ({ ...prev, spontaneousType1: v }))}
            groupKey="ecg-spont"
          />
          <RadioOption
            label="Fever-induced Type 1 Brugada ECG"
            points="+3.0 pts"
            value={ecgCriteria.feverType1}
            onChange={(v) => setEcgCriteria(prev => ({ ...prev, feverType1: v }))}
            groupKey="ecg-fever"
          />
          <RadioOption
            label="Drug-induced Type 1 Brugada ECG"
            points="+2.0 pts"
            value={ecgCriteria.drugType1}
            onChange={(v) => setEcgCriteria(prev => ({ ...prev, drugType1: v }))}
            groupKey="ecg-drug"
          />
          <RadioOption
            label="Type 2 or Type 3 Brugada ECG pattern"
            points="+0.5 pts"
            value={ecgCriteria.type2or3}
            onChange={(v) => setEcgCriteria(prev => ({ ...prev, type2or3: v }))}
            groupKey="ecg-type23"
          />
        </div>

        {/* Clinical History */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Clinical History</h3>
          <RadioOption
            label="Unexplained cardiac arrest or documented VF/polymorphic VT"
            points="+3.0 pts"
            value={clinicalHistory.unexplainedArrest}
            onChange={(v) => setClinicalHistory(prev => ({ ...prev, unexplainedArrest: v }))}
            groupKey="clin-arrest"
          />
          <RadioOption
            label="Nocturnal agonal breathing"
            points="+2.0 pts"
            value={clinicalHistory.nocturnalAgonalBreathing}
            onChange={(v) => setClinicalHistory(prev => ({ ...prev, nocturnalAgonalBreathing: v }))}
            groupKey="clin-nocturnal"
          />
          <RadioOption
            label="Suspected arrhythmic syncope"
            points="+2.0 pts"
            value={clinicalHistory.suspectedArrhythmicSyncope}
            onChange={(v) => setClinicalHistory(prev => ({ ...prev, suspectedArrhythmicSyncope: v }))}
            groupKey="clin-syncope"
          />
          <RadioOption
            label="Syncope of unclear mechanism"
            points="+1.0 pt"
            value={clinicalHistory.unclearSyncope}
            onChange={(v) => setClinicalHistory(prev => ({ ...prev, unclearSyncope: v }))}
            groupKey="clin-unclear"
          />
          <RadioOption
            label="Atrial fibrillation or flutter (<30 years)"
            points="+0.5 pts"
            value={clinicalHistory.afibFlutter}
            onChange={(v) => setClinicalHistory(prev => ({ ...prev, afibFlutter: v }))}
            groupKey="clin-afib"
          />
        </div>

        {/* Family History */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Family History (select highest applicable)</h3>
          <RadioOption
            label="First or second degree relative with Type 1 Brugada ECG"
            points="+2.0 pts"
            value={familyHistory.familyType1}
            onChange={(v) => setFamilyHistory(prev => ({ ...prev, familyType1: v }))}
            groupKey="fam-type1"
          />
          <RadioOption
            label="Family member with definite Brugada and SCD"
            points="+1.0 pt"
            value={familyHistory.familySCD}
            onChange={(v) => setFamilyHistory(prev => ({ ...prev, familySCD: v }))}
            groupKey="fam-scd"
          />
          <RadioOption
            label="Unexplained SCD (<45 years) in first/second degree relative"
            points="+0.5 pts"
            value={familyHistory.unexplainedSCDFamily}
            onChange={(v) => setFamilyHistory(prev => ({ ...prev, unexplainedSCDFamily: v }))}
            groupKey="fam-unexplained"
          />
        </div>

        {/* Genetic Testing */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Genetic Testing</h3>
          <div className="p-3 border rounded-lg">
            <Label className="text-sm font-medium flex justify-between">
              <span>Pathogenic SCN5A mutation</span>
              <span className="text-muted-foreground">+0.5 pts</span>
            </Label>
            <RadioGroup
              value={geneticTest}
              onValueChange={setGeneticTest}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="genetic-no" />
                <Label htmlFor="genetic-no" className="font-normal">No / Not tested</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pathogenic" id="genetic-yes" />
                <Label htmlFor="genetic-yes" className="font-normal">Yes (pathogenic)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            className="flex-1"
          >
            Calculate Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score.toFixed(1)}</p>
                <p className="text-sm">points</p>
                <Badge className={interpretation.badgeColor}>{interpretation.diagnosis}</Badge>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Clinical Recommendations:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {interpretation.recommendations.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Interpretation:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• <strong>≥3.5 points:</strong> Probable/Definite Brugada syndrome</li>
                  <li>• <strong>2-3.4 points:</strong> Possible Brugada syndrome</li>
                  <li>• <strong>&lt;2 points:</strong> Non-diagnostic</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Type 1 ECG: coved ST elevation ≥2mm in ≥1 lead V1-V3</li>
                  <li>• Drug challenge contraindicated in patients with Type 1 spontaneous ECG</li>
                  <li>• Patients should avoid drugs listed on brugadadrugs.org</li>
                  <li>• Aggressive fever treatment is recommended</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Antzelevitch C, et al. Heart Rhythm. 2016;13(10):e295-e324.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShanghaiScoreCalculator;
