import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const grades = [
  {
    value: '0',
    title: 'Grade 0',
    description: 'I only get breathless with strenuous exercise',
    severity: 'None',
    colorClass: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    value: '1',
    title: 'Grade 1',
    description: 'I get short of breath when hurrying on level ground or walking up a slight hill',
    severity: 'Mild',
    colorClass: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    value: '2',
    title: 'Grade 2',
    description: 'On level ground, I walk slower than people of the same age because of breathlessness, or have to stop for breath when walking at my own pace',
    severity: 'Moderate',
    colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    value: '3',
    title: 'Grade 3',
    description: 'I stop for breath after walking about 100 yards or after a few minutes on level ground',
    severity: 'Severe',
    colorClass: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    value: '4',
    title: 'Grade 4',
    description: 'I am too breathless to leave the house or I am breathless when dressing or undressing',
    severity: 'Very Severe',
    colorClass: 'bg-red-100 text-red-800 border-red-200'
  }
];

const MMRCDyspneaCalculator: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showResults, setShowResults] = useState(false);

  const getSelectedGradeData = () => {
    return grades.find(g => g.value === selectedGrade);
  };

  const getClinicalImplications = (grade: string) => {
    switch (grade) {
      case '0':
      case '1':
        return {
          goldGroup: 'Group A or B (if low exacerbation risk)',
          treatment: 'Short-acting bronchodilator PRN or long-acting bronchodilator',
          activity: 'Encourage regular physical activity'
        };
      case '2':
        return {
          goldGroup: 'Group B or E (depending on exacerbation history)',
          treatment: 'Long-acting bronchodilator (LABA or LAMA)',
          activity: 'Pulmonary rehabilitation recommended'
        };
      case '3':
        return {
          goldGroup: 'Group B or E',
          treatment: 'LABA + LAMA combination, consider ICS if eosinophilic',
          activity: 'Pulmonary rehabilitation strongly recommended'
        };
      case '4':
        return {
          goldGroup: 'Group E (likely)',
          treatment: 'Triple therapy (LABA + LAMA + ICS), consider roflumilast',
          activity: 'Home-based pulmonary rehabilitation, evaluate for oxygen therapy'
        };
      default:
        return null;
    }
  };

  const gradeData = getSelectedGradeData();
  const implications = getClinicalImplications(selectedGrade);

  const handleReset = () => {
    setSelectedGrade('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">mMRC Dyspnea Scale</CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Modified Medical Research Council Dyspnea Scale for COPD assessment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">
            Select the statement that best describes your breathlessness:
          </Label>
          
          <RadioGroup 
            value={selectedGrade} 
            onValueChange={setSelectedGrade}
            className="space-y-3"
          >
            {grades.map((grade) => (
              <div 
                key={grade.value}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedGrade === grade.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={grade.value} id={`grade-${grade.value}`} className="mt-1" />
                  <Label htmlFor={`grade-${grade.value}`} className="cursor-pointer flex-1">
                    <span className="font-semibold text-foreground">{grade.title}</span>
                    <p className="text-sm text-muted-foreground mt-1">{grade.description}</p>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!selectedGrade} className="flex-1">
            Show Assessment
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && gradeData && implications && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${gradeData.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{gradeData.title}</p>
                <p className="text-lg font-semibold">{gradeData.severity} Dyspnea</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">GOLD Assessment</p>
                <p className="text-sm text-muted-foreground">{implications.goldGroup}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Treatment Consideration</p>
                <p className="text-sm text-muted-foreground">{implications.treatment}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Activity Guidance</p>
                <p className="text-sm text-muted-foreground">{implications.activity}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Context</p>
                <ul className="mt-1 space-y-1">
                  <li>• mMRC is used with GOLD guidelines to categorize COPD severity</li>
                  <li>• Grade ≥2 indicates significant dyspnea requiring escalated therapy</li>
                  <li>• Combine with CAT score and exacerbation history for full GOLD assessment</li>
                  <li>• All patients with mMRC ≥2 should be referred for pulmonary rehabilitation</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold text-sm mb-2">GOLD 2024 ABE Assessment Tool</p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>Group A:</strong> mMRC 0-1, CAT &lt;10, 0-1 moderate exacerbations (no hospitalization)</p>
                <p><strong>Group B:</strong> mMRC ≥2 OR CAT ≥10, 0-1 moderate exacerbations (no hospitalization)</p>
                <p><strong>Group E:</strong> ≥2 moderate exacerbations OR ≥1 hospitalization (regardless of symptoms)</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MMRCDyspneaCalculator;
