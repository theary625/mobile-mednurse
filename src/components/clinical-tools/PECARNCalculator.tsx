import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

type AgeGroup = '<2' | '>=2' | '';

const PECARNCalculator: React.FC = () => {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('');
  const [showResults, setShowResults] = useState(false);
  
  // Under 2 years criteria
  const [gcsUnder2, setGcsUnder2] = useState<string>('');
  const [palpableSkullFracture, setPalpableSkullFracture] = useState<string>('');
  const [alteredMentalStatus, setAlteredMentalStatus] = useState<string>('');
  const [scalpHematoma, setScalpHematoma] = useState<string>('');
  const [locUnder2, setLocUnder2] = useState<string>('');
  const [actingNormally, setActingNormally] = useState<string>('');
  const [severeMechanism, setSevereMechanism] = useState<string>('');
  
  // 2 years and older criteria
  const [gcsOver2, setGcsOver2] = useState<string>('');
  const [signsBasilarFracture, setSignsBasilarFracture] = useState<string>('');
  const [alteredMentalStatusOver2, setAlteredMentalStatusOver2] = useState<string>('');
  const [locOver2, setLocOver2] = useState<string>('');
  const [vomiting, setVomiting] = useState<string>('');
  const [severeHeadache, setSevereHeadache] = useState<string>('');
  const [severeMechanismOver2, setSevereMechanismOver2] = useState<string>('');

  const calculateRisk = () => {
    if (ageGroup === '<2') {
      // High risk criteria for <2 years
      if (gcsUnder2 === 'yes' || palpableSkullFracture === 'yes' || alteredMentalStatus === 'yes') {
        return {
          category: 'high',
          risk: '4.4%',
          recommendation: 'CT recommended',
          description: 'High risk for clinically important traumatic brain injury (ciTBI)'
        };
      }
      // Intermediate risk criteria for <2 years
      if (scalpHematoma === 'yes' || locUnder2 === 'yes' || actingNormally === 'no' || severeMechanism === 'yes') {
        return {
          category: 'intermediate',
          risk: '0.9%',
          recommendation: 'Observation vs CT based on clinical judgment',
          description: 'Intermediate risk - Consider observation for 4-6 hours vs CT'
        };
      }
      // Low risk
      return {
        category: 'low',
        risk: '<0.02%',
        recommendation: 'CT not recommended',
        description: 'Very low risk for ciTBI - CT not routinely indicated'
      };
    } else if (ageGroup === '>=2') {
      // High risk criteria for >=2 years
      if (gcsOver2 === 'yes' || signsBasilarFracture === 'yes' || alteredMentalStatusOver2 === 'yes') {
        return {
          category: 'high',
          risk: '4.3%',
          recommendation: 'CT recommended',
          description: 'High risk for clinically important traumatic brain injury (ciTBI)'
        };
      }
      // Intermediate risk criteria for >=2 years
      if (locOver2 === 'yes' || vomiting === 'yes' || severeHeadache === 'yes' || severeMechanismOver2 === 'yes') {
        return {
          category: 'intermediate',
          risk: '0.9%',
          recommendation: 'Observation vs CT based on clinical judgment',
          description: 'Intermediate risk - Consider observation for 4-6 hours vs CT'
        };
      }
      // Low risk
      return {
        category: 'low',
        risk: '<0.05%',
        recommendation: 'CT not recommended',
        description: 'Very low risk for ciTBI - CT not routinely indicated'
      };
    }
    return null;
  };

  const result = showResults ? calculateRisk() : null;

  const getRiskStyles = (category: string) => {
    switch (category) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'intermediate':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      default:
        return '';
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'high':
        return <AlertTriangle className="h-6 w-6" />;
      case 'intermediate':
        return <AlertCircle className="h-6 w-6" />;
      case 'low':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const isUnder2Valid = ageGroup === '<2' && gcsUnder2 && palpableSkullFracture && alteredMentalStatus && 
    scalpHematoma && locUnder2 && actingNormally && severeMechanism;
  
  const isOver2Valid = ageGroup === '>=2' && gcsOver2 && signsBasilarFracture && alteredMentalStatusOver2 && 
    locOver2 && vomiting && severeHeadache && severeMechanismOver2;

  const isValid = isUnder2Valid || isOver2Valid;

  const resetForm = () => {
    setAgeGroup('');
    setShowResults(false);
    setGcsUnder2('');
    setPalpableSkullFracture('');
    setAlteredMentalStatus('');
    setScalpHematoma('');
    setLocUnder2('');
    setActingNormally('');
    setSevereMechanism('');
    setGcsOver2('');
    setSignsBasilarFracture('');
    setAlteredMentalStatusOver2('');
    setLocOver2('');
    setVomiting('');
    setSevereHeadache('');
    setSevereMechanismOver2('');
  };

  const RadioQuestion = ({ label, value, onChange, description }: { label: string; value: string; onChange: (v: string) => void; description?: string }) => (
    <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${label}-yes`} />
          <Label htmlFor={`${label}-yes`} className="text-sm">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${label}-no`} />
          <Label htmlFor={`${label}-no`} className="text-sm">No</Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">PECARN Pediatric Head Injury Algorithm</CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Predicts need for CT imaging after pediatric head injury
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Age Group Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Patient Age Group</Label>
          <RadioGroup value={ageGroup} onValueChange={(v) => { setAgeGroup(v as AgeGroup); setShowResults(false); }} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="<2" id="under2" />
              <Label htmlFor="under2">Under 2 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value=">=2" id="over2" />
              <Label htmlFor="over2">2 years and older</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Under 2 Years Criteria */}
        {ageGroup === '<2' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">High Risk Criteria</h3>
            <RadioQuestion 
              label="GCS ≤14 or other signs of altered mental status?" 
              value={gcsUnder2} 
              onChange={setGcsUnder2}
            />
            <RadioQuestion 
              label="Palpable skull fracture?" 
              value={palpableSkullFracture} 
              onChange={setPalpableSkullFracture}
            />
            <RadioQuestion 
              label="Altered mental status (agitation, somnolence, repetitive questioning, slow response)?" 
              value={alteredMentalStatus} 
              onChange={setAlteredMentalStatus}
            />
            
            <h3 className="font-semibold text-lg border-b pb-2 pt-4">Intermediate Risk Criteria</h3>
            <RadioQuestion 
              label="Occipital, parietal, or temporal scalp hematoma?" 
              value={scalpHematoma} 
              onChange={setScalpHematoma}
              description="Non-frontal location"
            />
            <RadioQuestion 
              label="Loss of consciousness ≥5 seconds?" 
              value={locUnder2} 
              onChange={setLocUnder2}
            />
            <RadioQuestion 
              label="Acting normally according to parents?" 
              value={actingNormally} 
              onChange={setActingNormally}
            />
            <RadioQuestion 
              label="Severe mechanism of injury?" 
              value={severeMechanism} 
              onChange={setSevereMechanism}
              description="MVC with patient ejection, death of another passenger, or rollover; pedestrian or bicyclist without helmet struck by motorized vehicle; fall >3 feet (>0.9m); head struck by high-impact object"
            />
          </div>
        )}

        {/* 2 Years and Older Criteria */}
        {ageGroup === '>=2' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">High Risk Criteria</h3>
            <RadioQuestion 
              label="GCS ≤14?" 
              value={gcsOver2} 
              onChange={setGcsOver2}
            />
            <RadioQuestion 
              label="Signs of basilar skull fracture?" 
              value={signsBasilarFracture} 
              onChange={setSignsBasilarFracture}
              description="Hemotympanum, raccoon eyes, Battle's sign, CSF otorrhea/rhinorrhea"
            />
            <RadioQuestion 
              label="Altered mental status (agitation, somnolence, repetitive questioning, slow response)?" 
              value={alteredMentalStatusOver2} 
              onChange={setAlteredMentalStatusOver2}
            />
            
            <h3 className="font-semibold text-lg border-b pb-2 pt-4">Intermediate Risk Criteria</h3>
            <RadioQuestion 
              label="Any loss of consciousness?" 
              value={locOver2} 
              onChange={setLocOver2}
            />
            <RadioQuestion 
              label="Any vomiting?" 
              value={vomiting} 
              onChange={setVomiting}
            />
            <RadioQuestion 
              label="Severe headache?" 
              value={severeHeadache} 
              onChange={setSevereHeadache}
            />
            <RadioQuestion 
              label="Severe mechanism of injury?" 
              value={severeMechanismOver2} 
              onChange={setSevereMechanismOver2}
              description="MVC with patient ejection, death of another passenger, or rollover; pedestrian or bicyclist without helmet struck by motorized vehicle; fall >5 feet (>1.5m); head struck by high-impact object"
            />
          </div>
        )}

        {ageGroup && (
          <div className="flex gap-4 pt-4">
            <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
              Calculate Risk
            </Button>
            <Button onClick={resetForm} variant="outline">
              Reset
            </Button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={`p-6 rounded-lg border ${getRiskStyles(result.category)}`}>
            <div className="flex items-center gap-3 mb-4">
              {getRiskIcon(result.category)}
              <div>
                <p className="text-xl font-bold capitalize">{result.category} Risk</p>
                <p className="text-sm">ciTBI Risk: {result.risk}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">{result.recommendation}</p>
              <p className="text-sm">{result.description}</p>
            </div>
          </div>
        )}

        {/* Clinical Notes */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">PECARN Clinical Decision Rule</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>ciTBI = clinically important traumatic brain injury</li>
              <li>Validated in children with GCS 14-15 after blunt head trauma</li>
              <li>Intermediate risk: Physician judgment for observation vs CT</li>
              <li>Consider parental preference and ability to return</li>
            </ul>
            <p className="mt-2 text-xs">Reference: Kuppermann et al. Lancet 2009;374:1160-70</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PECARNCalculator;
