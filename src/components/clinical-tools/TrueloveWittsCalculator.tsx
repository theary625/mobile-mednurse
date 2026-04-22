import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Activity } from 'lucide-react';

const TrueloveWittsCalculator: React.FC = () => {
  const [bowelMovements, setBowelMovements] = useState<string>('');
  const [bloodInStool, setBloodInStool] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [hemoglobin, setHemoglobin] = useState<string>('');
  const [esr, setEsr] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const criteria = {
    bowelMovements: [
      { value: 'mild', label: '<4 per day', points: 'mild' },
      { value: 'moderate', label: '4-6 per day', points: 'moderate' },
      { value: 'severe', label: '>6 per day', points: 'severe' },
    ],
    bloodInStool: [
      { value: 'mild', label: 'None or small amounts', points: 'mild' },
      { value: 'moderate', label: 'Moderate', points: 'moderate' },
      { value: 'severe', label: 'Visible blood', points: 'severe' },
    ],
    temperature: [
      { value: 'mild', label: 'Afebrile (<37.5°C / <99.5°F)', points: 'mild' },
      { value: 'moderate', label: 'Low-grade (37.5-37.8°C)', points: 'moderate' },
      { value: 'severe', label: '>37.8°C (>100°F) on 2 of 4 days', points: 'severe' },
    ],
    heartRate: [
      { value: 'mild', label: '<90 bpm', points: 'mild' },
      { value: 'moderate', label: '90-100 bpm', points: 'moderate' },
      { value: 'severe', label: '>90 bpm', points: 'severe' },
    ],
    hemoglobin: [
      { value: 'mild', label: '>11.5 g/dL', points: 'mild' },
      { value: 'moderate', label: '10.5-11.5 g/dL', points: 'moderate' },
      { value: 'severe', label: '<10.5 g/dL (or need for transfusion)', points: 'severe' },
    ],
    esr: [
      { value: 'mild', label: '<20 mm/hr', points: 'mild' },
      { value: 'moderate', label: '20-30 mm/hr', points: 'moderate' },
      { value: 'severe', label: '>30 mm/hr', points: 'severe' },
    ],
  };

  const calculateSeverity = () => {
    const values = [bowelMovements, bloodInStool, temperature, heartRate, hemoglobin, esr];
    const severeCount = values.filter(v => v === 'severe').length;
    const moderateCount = values.filter(v => v === 'moderate').length;
    const mildCount = values.filter(v => v === 'mild').length;

    // Classic Truelove-Witts criteria
    // Severe: ≥6 bloody stools/day PLUS any one of: pulse >90, temp >37.8°C, Hgb <10.5, ESR >30
    if (bowelMovements === 'severe' && (heartRate === 'severe' || temperature === 'severe' || hemoglobin === 'severe' || esr === 'severe')) {
      return 'severe';
    }
    
    // Mild: <4 stools/day with minimal or no blood, no systemic disturbance, normal ESR
    if (bowelMovements === 'mild' && bloodInStool === 'mild' && temperature === 'mild' && heartRate === 'mild' && hemoglobin === 'mild' && esr === 'mild') {
      return 'mild';
    }

    // Moderate: Intermediate between mild and severe
    return 'moderate';
  };

  const getInterpretation = (severity: string) => {
    switch (severity) {
      case 'mild':
        return {
          title: 'Mild Ulcerative Colitis',
          color: 'bg-green-100 border-green-200 text-green-800',
          management: [
            'Oral 5-ASA (mesalamine) as first-line therapy',
            'Topical 5-ASA (suppositories/enemas) for proctitis/left-sided disease',
            'Outpatient management appropriate',
            'Follow-up in 2-4 weeks to assess response'
          ],
          prognosis: 'Good prognosis with appropriate treatment. ~90% respond to oral 5-ASA.'
        };
      case 'moderate':
        return {
          title: 'Moderate Ulcerative Colitis',
          color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
          management: [
            'Oral 5-ASA at higher doses (4-4.8g/day)',
            'Consider oral corticosteroids (prednisone 40-60mg/day)',
            'Combination oral + topical 5-ASA therapy',
            'Close outpatient follow-up or short hospitalization',
            'Monitor for deterioration to severe disease'
          ],
          prognosis: 'Intermediate prognosis. May require step-up therapy if no response in 2 weeks.'
        };
      case 'severe':
        return {
          title: 'Severe Ulcerative Colitis',
          color: 'bg-red-100 border-red-200 text-red-800',
          management: [
            'Hospital admission required',
            'IV corticosteroids (hydrocortisone 100mg QID or methylprednisolone 60mg/day)',
            'NPO or clear liquids, DVT prophylaxis',
            'Exclude infection (C. diff, CMV)',
            'Daily clinical assessment and monitoring',
            'Early surgical consultation',
            'Consider rescue therapy (infliximab, cyclosporine) if no response in 3-5 days'
          ],
          prognosis: 'Risk of toxic megacolon and perforation. ~30% require colectomy during index admission. Mortality 1-2.9%.'
        };
      default:
        return null;
    }
  };

  const canCalculate = bowelMovements && bloodInStool && temperature && heartRate && hemoglobin && esr;
  const severity = calculateSeverity();
  const interpretation = canCalculate ? getInterpretation(severity) : null;

  const resetForm = () => {
    setBowelMovements('');
    setBloodInStool('');
    setTemperature('');
    setHeartRate('');
    setHemoglobin('');
    setEsr('');
    setShowResults(false);
  };

  const renderCriteriaGroup = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: typeof criteria.bowelMovements,
    idPrefix: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
            <RadioGroupItem value={option.value} id={`${idPrefix}-${option.value}`} />
            <Label htmlFor={`${idPrefix}-${option.value}`} className="cursor-pointer text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Truelove and Witts Severity Index
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Stratifies severity of ulcerative colitis to guide management
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {renderCriteriaGroup('Bowel Movements per Day', bowelMovements, setBowelMovements, criteria.bowelMovements, 'bm')}
        {renderCriteriaGroup('Blood in Stool', bloodInStool, setBloodInStool, criteria.bloodInStool, 'blood')}
        {renderCriteriaGroup('Temperature', temperature, setTemperature, criteria.temperature, 'temp')}
        {renderCriteriaGroup('Heart Rate', heartRate, setHeartRate, criteria.heartRate, 'hr')}
        {renderCriteriaGroup('Hemoglobin', hemoglobin, setHemoglobin, criteria.hemoglobin, 'hgb')}
        {renderCriteriaGroup('ESR (or CRP elevated)', esr, setEsr, criteria.esr, 'esr')}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Assess Severity
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center">
                <p className="text-3xl font-bold">{interpretation.title}</p>
                <p className="text-sm mt-2">{interpretation.prognosis}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Recommended Management:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {interpretation.management.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Original Truelove-Witts Criteria (1955)</p>
                <p className="mt-1">
                  <strong>Severe:</strong> ≥6 bloody stools/day AND at least one of: HR &gt;90, Temp &gt;37.8°C, Hgb &lt;10.5, ESR &gt;30
                </p>
                <p>
                  <strong>Mild:</strong> &lt;4 stools/day with small amounts of blood, no fever, no tachycardia, Hgb &gt;10.5, ESR &lt;30
                </p>
                <p>
                  <strong>Moderate:</strong> Between mild and severe
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Reference:</strong> Truelove SC, Witts LJ. Cortisone in ulcerative colitis; final report on a therapeutic trial. 
                Br Med J. 1955;2(4947):1041-1048. Also see ECCO Guidelines for UC management.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrueloveWittsCalculator;
