import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, RotateCcw } from 'lucide-react';

const FisherScaleCalculator = () => {
  const [grade, setGrade] = useState<number | null>(null);

  const gradeOptions = [
    {
      value: 1,
      label: 'Grade I',
      description: 'No blood detected on CT',
      vasospasmRisk: '21%',
      riskLevel: 'Low'
    },
    {
      value: 2,
      label: 'Grade II',
      description: 'Diffuse thin layer of subarachnoid blood (<1mm thick)',
      vasospasmRisk: '25%',
      riskLevel: 'Low-Moderate'
    },
    {
      value: 3,
      label: 'Grade III',
      description: 'Localized clot and/or thick layer of subarachnoid blood (>1mm thick)',
      vasospasmRisk: '37%',
      riskLevel: 'High'
    },
    {
      value: 4,
      label: 'Grade IV',
      description: 'Intraventricular or intracerebral blood with diffuse or no SAH',
      vasospasmRisk: '31%',
      riskLevel: 'Moderate-High'
    }
  ];

  const getInterpretation = (grade: number) => {
    switch (grade) {
      case 1:
        return { color: 'bg-green-500 text-white', risk: 'Lower vasospasm risk' };
      case 2:
        return { color: 'bg-yellow-500 text-white', risk: 'Low-moderate vasospasm risk' };
      case 3:
        return { color: 'bg-destructive text-destructive-foreground', risk: 'Highest vasospasm risk' };
      case 4:
        return { color: 'bg-orange-500 text-white', risk: 'Moderate-high vasospasm risk' };
      default:
        return { color: 'bg-muted text-muted-foreground', risk: '' };
    }
  };

  const selectedOption = gradeOptions.find(opt => opt.value === grade);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Fisher Scale for SAH
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Grades subarachnoid hemorrhage on CT to predict risk of cerebral vasospasm
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select CT findings:</label>
            <div className="grid gap-2">
              {gradeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={grade === option.value ? "default" : "outline"}
                  onClick={() => setGrade(option.value)}
                  className="h-auto py-3 px-4 justify-start text-left whitespace-normal"
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="font-bold text-lg min-w-[24px]">{option.value}</span>
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs opacity-80 mt-0.5">{option.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => setGrade(null)} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </CardContent>
      </Card>

      {grade !== null && selectedOption && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fisher Grade</p>
                <p className="text-5xl font-bold">{grade}</p>
              </div>
              
              <Badge className={`${getInterpretation(grade).color} text-sm px-4 py-2`}>
                {getInterpretation(grade).risk}
              </Badge>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium mb-1">Vasospasm Risk</p>
                <p className="text-2xl font-bold">{selectedOption.vasospasmRisk}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on original Fisher et al. data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-4 h-4" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Original Fisher Scale was designed for non-contrast CT within 5 days of SAH</li>
            <li>• Grade III has the highest risk of clinically significant vasospasm</li>
            <li>• Modified Fisher Scale adds distinction for IVH with thick SAH</li>
            <li>• Vasospasm typically occurs days 4-14 after SAH (peak days 7-10)</li>
            <li>• All SAH patients require monitoring regardless of grade</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FisherScaleCalculator;
