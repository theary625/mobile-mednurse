import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const nyhaClasses = [
  {
    value: 1,
    title: 'NYHA Class I',
    description: 'No limitation of physical activity',
    details: 'Ordinary physical activity does not cause undue fatigue, palpitation, dyspnea, or angina',
    prognosis: 'Best prognosis',
    colorClass: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    value: 2,
    title: 'NYHA Class II',
    description: 'Slight limitation of physical activity',
    details: 'Comfortable at rest. Ordinary physical activity results in fatigue, palpitation, dyspnea, or angina',
    prognosis: '1-year mortality ~10%',
    colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    value: 3,
    title: 'NYHA Class III',
    description: 'Marked limitation of physical activity',
    details: 'Comfortable at rest. Less than ordinary activity causes fatigue, palpitation, dyspnea, or angina',
    prognosis: '1-year mortality ~20%',
    colorClass: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    value: 4,
    title: 'NYHA Class IV',
    description: 'Unable to carry on any physical activity without discomfort',
    details: 'Symptoms of heart failure at rest. Any physical activity causes increased discomfort',
    prognosis: '1-year mortality ~50%',
    colorClass: 'bg-red-100 text-red-800 border-red-200'
  }
];

const NYHAClassCalculator: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const selected = nyhaClasses.find(n => n.value === selectedClass);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">NYHA Functional Classification</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Heart failure symptom severity classification
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <RadioGroup
          value={selectedClass?.toString()}
          onValueChange={(value) => setSelectedClass(parseInt(value))}
          className="space-y-4"
        >
          {nyhaClasses.map((nyha) => (
            <div
              key={nyha.value}
              className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                selectedClass === nyha.value ? nyha.colorClass : 'bg-muted/30 border-transparent hover:border-primary/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={nyha.value.toString()} id={`nyha-${nyha.value}`} className="mt-1" />
                <Label htmlFor={`nyha-${nyha.value}`} className="cursor-pointer flex-1">
                  <p className="font-semibold">{nyha.title}</p>
                  <p className="text-sm font-medium mt-1">{nyha.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{nyha.details}</p>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>

        {selected && (
          <div className={`p-6 rounded-lg border ${selected.colorClass}`}>
            <div className="text-center">
              <p className="text-3xl font-bold">{selected.title}</p>
              <p className="text-sm mt-2">{selected.description}</p>
              <p className="text-lg mt-2 font-semibold">{selected.prognosis}</p>
            </div>
          </div>
        )}

        <Button onClick={() => setSelectedClass(null)} variant="outline" className="w-full">
          Reset
        </Button>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Application</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Guides therapy intensity and treatment goals</li>
              <li>Used in clinical trial eligibility criteria</li>
              <li>Helps determine need for advanced therapies (ICD, CRT, transplant)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NYHAClassCalculator;
