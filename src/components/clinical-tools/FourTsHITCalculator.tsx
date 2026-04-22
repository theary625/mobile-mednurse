import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, Droplet } from 'lucide-react';

const FourTsHITCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const criteria = [
    {
      id: 'thrombocytopenia',
      title: 'Thrombocytopenia',
      options: [
        { value: 0, label: 'Platelet fall <30% or nadir <10 × 10⁹/L' },
        { value: 1, label: 'Platelet fall 30-50% or nadir 10-19 × 10⁹/L' },
        { value: 2, label: 'Platelet fall >50% AND nadir ≥20 × 10⁹/L' },
      ]
    },
    {
      id: 'timing',
      title: 'Timing of platelet count fall',
      options: [
        { value: 0, label: 'Fall <4 days without recent heparin exposure' },
        { value: 1, label: 'Consistent with fall at 5-10 days but not clear (e.g., missing counts); or fall ≤1 day if prior heparin exposure within 30-100 days' },
        { value: 2, label: 'Clear fall 5-10 days; or fall ≤1 day if prior heparin exposure within 30 days' },
      ]
    },
    {
      id: 'thrombosis',
      title: 'Thrombosis or other sequelae',
      options: [
        { value: 0, label: 'None' },
        { value: 1, label: 'Progressive or recurrent thrombosis; non-necrotizing (erythematous) skin lesions; suspected thrombosis not yet proven' },
        { value: 2, label: 'New thrombosis (confirmed); skin necrosis; acute systemic reaction after IV heparin bolus' },
      ]
    },
    {
      id: 'other_causes',
      title: 'Other causes for thrombocytopenia',
      options: [
        { value: 0, label: 'Definite other cause present' },
        { value: 1, label: 'Possible other cause present' },
        { value: 2, label: 'No other cause evident' },
      ]
    },
  ];

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: parseInt(value) }));
  };

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 3) {
      return {
        probability: 'Low',
        risk: '<5%',
        recommendation: 'HIT is unlikely. Consider other causes of thrombocytopenia. Immunoassay may not be needed.',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score >= 4 && score <= 5) {
      return {
        probability: 'Intermediate',
        risk: '~14%',
        recommendation: 'HIT possible. Send immunoassay (ELISA). Consider alternative anticoagulation while awaiting results.',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        probability: 'High',
        risk: '~64%',
        recommendation: 'HIT likely. Stop all heparin immediately. Start non-heparin anticoagulant. Send confirmatory testing.',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Droplet className="h-5 w-5" />
          4Ts Score for HIT
        </CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Heparin-Induced Thrombocytopenia probability assessment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <p className="font-bold text-foreground">{criterion.title}</p>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(value) => handleChange(criterion.id, value)}
              className="space-y-2"
            >
              {criterion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`${criterion.id}-${option.value}`} />
                  <Label htmlFor={`${criterion.id}-${option.value}`} className="cursor-pointer text-sm">
                    {option.label} <span className="text-muted-foreground font-medium">({option.value} points)</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate HIT Probability
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{totalScore}/8</p>
                <p className="text-lg font-semibold">{interpretation.probability} Probability</p>
                <p className="text-xl font-bold mt-2">HIT Risk: {interpretation.risk}</p>
              </div>
              <p className="text-sm text-center font-medium">{interpretation.recommendation}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Score Interpretation</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>0-3:</strong> Low probability (&lt;5% risk of HIT)</li>
                  <li>• <strong>4-5:</strong> Intermediate probability (~14% risk)</li>
                  <li>• <strong>6-8:</strong> High probability (~64% risk)</li>
                </ul>
              </div>
            </div>

            {interpretation.probability === 'High' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">Immediate Actions Required</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Stop ALL heparin products (including flushes, coated catheters)</li>
                    <li>• Start non-heparin anticoagulant (argatroban, bivalirudin, fondaparinux)</li>
                    <li>• Send confirmatory testing (SRA or PF4 ELISA)</li>
                    <li>• Do NOT give warfarin until platelets recover</li>
                    <li>• Screen for thrombosis (DVT, PE, arterial)</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Lo GK, et al. Evaluation of pretest clinical score (4 T's) for the diagnosis of heparin-induced thrombocytopenia. 
                  J Thromb Haemost. 2006;4(4):759-765.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FourTsHITCalculator;
