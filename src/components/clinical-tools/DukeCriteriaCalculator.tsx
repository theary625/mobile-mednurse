import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const majorCriteria = [
  {
    id: 'blood_culture_1',
    label: 'Blood cultures positive for typical organisms',
    description: 'Viridans streptococci, S. bovis, HACEK group, S. aureus, or community-acquired enterococci in absence of primary focus - 2 separate cultures OR persistently positive'
  },
  {
    id: 'blood_culture_2',
    label: 'Single positive blood culture for Coxiella burnetii',
    description: 'Or anti-phase 1 IgG antibody titer >1:800'
  },
  {
    id: 'echo_vegetation',
    label: 'Echocardiogram positive - oscillating mass',
    description: 'Oscillating intracardiac mass on valve or supporting structures, in path of regurgitant jets, or on implanted material'
  },
  {
    id: 'echo_abscess',
    label: 'Echocardiogram positive - abscess',
    description: 'Periannular abscess'
  },
  {
    id: 'echo_dehiscence',
    label: 'New prosthetic valve dehiscence',
    description: 'New partial dehiscence of prosthetic valve'
  },
  {
    id: 'new_regurg',
    label: 'New valvular regurgitation',
    description: 'New valvular regurgitation (worsening or changing of pre-existing murmur not sufficient)'
  }
];

const minorCriteria = [
  { id: 'predisposition', label: 'Predisposing heart condition or IVDU' },
  { id: 'fever', label: 'Fever ≥38°C (100.4°F)' },
  { id: 'vascular', label: 'Vascular phenomena', description: 'Major arterial emboli, septic pulmonary infarcts, mycotic aneurysm, intracranial hemorrhage, conjunctival hemorrhages, Janeway lesions' },
  { id: 'immunologic', label: 'Immunologic phenomena', description: 'Glomerulonephritis, Osler nodes, Roth spots, rheumatoid factor' },
  { id: 'micro_evidence', label: 'Microbiological evidence', description: 'Positive blood culture not meeting major criteria, or serologic evidence of active infection with organism consistent with IE' }
];

const DukeCriteriaCalculator: React.FC = () => {
  const [majorAnswers, setMajorAnswers] = useState<Record<string, boolean>>({});
  const [minorAnswers, setMinorAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const majorCount = majorCriteria.filter(c => majorAnswers[c.id]).length;
  const minorCount = minorCriteria.filter(c => minorAnswers[c.id]).length;

  const getDiagnosis = () => {
    // Definite IE: 2 major, or 1 major + 3 minor, or 5 minor
    if (majorCount >= 2) {
      return { diagnosis: 'Definite Infective Endocarditis', colorClass: 'bg-red-100 text-red-800 border-red-200' };
    }
    if (majorCount >= 1 && minorCount >= 3) {
      return { diagnosis: 'Definite Infective Endocarditis', colorClass: 'bg-red-100 text-red-800 border-red-200' };
    }
    if (minorCount >= 5) {
      return { diagnosis: 'Definite Infective Endocarditis', colorClass: 'bg-red-100 text-red-800 border-red-200' };
    }
    
    // Possible IE: 1 major + 1 minor, or 3 minor
    if (majorCount >= 1 && minorCount >= 1) {
      return { diagnosis: 'Possible Infective Endocarditis', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
    if (minorCount >= 3) {
      return { diagnosis: 'Possible Infective Endocarditis', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }

    return { diagnosis: 'IE Rejected', colorClass: 'bg-green-100 text-green-800 border-green-200' };
  };

  const result = getDiagnosis();

  const handleReset = () => {
    setMajorAnswers({});
    setMinorAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Modified Duke Criteria</CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Diagnosis of Infective Endocarditis
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Major Criteria</h3>
          {majorCriteria.map((criterion) => (
            <div key={criterion.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                id={criterion.id}
                checked={majorAnswers[criterion.id] || false}
                onCheckedChange={(checked) => setMajorAnswers(prev => ({ ...prev, [criterion.id]: checked as boolean }))}
                className="mt-0.5"
              />
              <Label htmlFor={criterion.id} className="cursor-pointer flex-1">
                <p className="font-medium text-sm">{criterion.label}</p>
                <p className="text-xs text-muted-foreground">{criterion.description}</p>
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Minor Criteria</h3>
          {minorCriteria.map((criterion) => (
            <div key={criterion.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                id={criterion.id}
                checked={minorAnswers[criterion.id] || false}
                onCheckedChange={(checked) => setMinorAnswers(prev => ({ ...prev, [criterion.id]: checked as boolean }))}
                className="mt-0.5"
              />
              <Label htmlFor={criterion.id} className="cursor-pointer flex-1">
                <p className="font-medium text-sm">{criterion.label}</p>
                {criterion.description && <p className="text-xs text-muted-foreground">{criterion.description}</p>}
              </Label>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Evaluate Criteria
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${result.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-2xl font-bold">{result.diagnosis}</p>
                <p className="text-sm mt-2">
                  {majorCount} Major + {minorCount} Minor Criteria
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Diagnostic Criteria</p>
                <ul className="mt-1 space-y-1">
                  <li><strong>Definite:</strong> 2 major, or 1 major + 3 minor, or 5 minor</li>
                  <li><strong>Possible:</strong> 1 major + 1 minor, or 3 minor</li>
                  <li><strong>Rejected:</strong> Firm alternative diagnosis, resolution with ≤4 days antibiotics, no pathologic evidence at surgery/autopsy</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DukeCriteriaCalculator;
