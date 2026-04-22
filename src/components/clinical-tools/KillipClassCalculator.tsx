import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const killipClasses = [
  {
    value: 1,
    title: 'Killip Class I',
    description: 'No clinical signs of heart failure',
    findings: 'No S3, no lung rales',
    mortality: '6%',
    colorClass: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    value: 2,
    title: 'Killip Class II',
    description: 'Mild to moderate heart failure',
    findings: 'S3 gallop, lung rales < 50% of lung fields, or elevated JVP',
    mortality: '17%',
    colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    value: 3,
    title: 'Killip Class III',
    description: 'Severe heart failure / Pulmonary edema',
    findings: 'Rales > 50% of lung fields (frank pulmonary edema)',
    mortality: '38%',
    colorClass: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    value: 4,
    title: 'Killip Class IV',
    description: 'Cardiogenic shock',
    findings: 'SBP < 90 mmHg with signs of hypoperfusion (oliguria, cyanosis, diaphoresis)',
    mortality: '81%',
    colorClass: 'bg-red-100 text-red-800 border-red-200'
  }
];

const KillipClassCalculator: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const selected = killipClasses.find(k => k.value === selectedClass);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Killip Classification</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Heart failure classification after acute myocardial infarction
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <RadioGroup
          value={selectedClass?.toString()}
          onValueChange={(value) => setSelectedClass(parseInt(value))}
          className="space-y-4"
        >
          {killipClasses.map((killip) => (
            <div
              key={killip.value}
              className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                selectedClass === killip.value ? killip.colorClass : 'bg-muted/30 border-transparent hover:border-primary/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={killip.value.toString()} id={`killip-${killip.value}`} className="mt-1" />
                <Label htmlFor={`killip-${killip.value}`} className="cursor-pointer flex-1">
                  <p className="font-semibold">{killip.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{killip.description}</p>
                  <p className="text-xs mt-2"><strong>Findings:</strong> {killip.findings}</p>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>

        {selected && (
          <div className={`p-6 rounded-lg border ${selected.colorClass}`}>
            <div className="text-center">
              <p className="text-3xl font-bold">{selected.title}</p>
              <p className="text-lg mt-2">30-Day Mortality: <strong>{selected.mortality}</strong></p>
            </div>
          </div>
        )}

        <Button onClick={() => setSelectedClass(null)} variant="outline" className="w-full">
          Reset
        </Button>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Pearl</p>
            <p className="mt-1">Killip class is a key component of the TIMI and GRACE risk scores for ACS.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KillipClassCalculator;
