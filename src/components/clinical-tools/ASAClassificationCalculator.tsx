import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Stethoscope } from 'lucide-react';

const ASAClassificationCalculator: React.FC = () => {
  const [classification, setClassification] = useState<string>('');
  const [isEmergency, setIsEmergency] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const classifications = [
    {
      value: '1',
      label: 'ASA I',
      title: 'Normal healthy patient',
      description: 'No organic, physiologic, or psychiatric disturbance; excludes very young and very old; healthy with good exercise tolerance',
      examples: 'Healthy, non-smoking, no or minimal alcohol use',
      mortality: '<0.1%'
    },
    {
      value: '2',
      label: 'ASA II',
      title: 'Mild systemic disease',
      description: 'No functional limitations; has a well-controlled disease of one body system',
      examples: 'Current smoker, social alcohol use, pregnancy, obesity (30<BMI<40), well-controlled DM/HTN, mild lung disease',
      mortality: '0.2%'
    },
    {
      value: '3',
      label: 'ASA III',
      title: 'Severe systemic disease',
      description: 'Some functional limitation; has a controlled disease of more than one body system or one major system',
      examples: 'Poorly controlled DM/HTN, COPD, morbid obesity (BMI≥40), active hepatitis, alcohol dependence, pacemaker, moderate reduction of ejection fraction, ESRD on dialysis, history (>3mo) of MI/CVA/TIA/CAD/stents',
      mortality: '1.8%'
    },
    {
      value: '4',
      label: 'ASA IV',
      title: 'Severe systemic disease - constant threat to life',
      description: 'Has at least one severe disease that is poorly controlled or at end stage',
      examples: 'Recent (<3mo) MI/CVA/TIA/CAD/stents, ongoing cardiac ischemia, severe valve dysfunction, severe reduction of ejection fraction, sepsis, DIC, ARD, ESRD not undergoing regularly scheduled dialysis',
      mortality: '7.8%'
    },
    {
      value: '5',
      label: 'ASA V',
      title: 'Moribund patient - not expected to survive without surgery',
      description: 'Not expected to survive 24 hours without surgery',
      examples: 'Ruptured abdominal/thoracic aneurysm, massive trauma, intracranial bleed with mass effect, ischemic bowel with cardiac pathology, multiorgan/system dysfunction',
      mortality: '9.4%'
    },
    {
      value: '6',
      label: 'ASA VI',
      title: 'Declared brain-dead organ donor',
      description: 'Patient declared brain dead for organ procurement',
      examples: 'Brain-dead patient being prepared for organ donation',
      mortality: 'N/A'
    }
  ];

  const getSeverityStyles = (value: string) => {
    switch (value) {
      case '1':
        return 'bg-green-100 border-green-200 text-green-800';
      case '2':
        return 'bg-lime-100 border-lime-200 text-lime-800';
      case '3':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case '4':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case '5':
        return 'bg-red-100 border-red-200 text-red-800';
      case '6':
        return 'bg-gray-100 border-gray-200 text-gray-800';
      default:
        return '';
    }
  };

  const selectedClass = classifications.find(c => c.value === classification);

  const resetForm = () => {
    setClassification('');
    setIsEmergency('');
    setShowResults(false);
  };

  const getDisplayClassification = () => {
    if (!selectedClass) return '';
    return isEmergency === 'yes' ? `ASA ${classification}E` : `ASA ${classification}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          ASA Physical Status Classification
        </CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Preoperative risk stratification for surgical patients
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Select ASA Classification:</Label>
          
          <RadioGroup value={classification} onValueChange={setClassification} className="space-y-3">
            {classifications.map((item) => (
              <div key={item.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={item.value} id={`asa-${item.value}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`asa-${item.value}`} className="font-semibold cursor-pointer">
                    {item.label}: {item.title}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Examples:</strong> {item.examples}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {classification && classification !== '6' && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Is this an emergency procedure?</Label>
            <RadioGroup value={isEmergency} onValueChange={setIsEmergency} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="emergency-no" />
                <Label htmlFor="emergency-no" className="cursor-pointer">No (Elective)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="emergency-yes" />
                <Label htmlFor="emergency-yes" className="cursor-pointer">Yes (Emergency - add "E")</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Emergency is defined as existing when delay in treatment would lead to significant increase in threat to life or body part
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={!classification || (classification !== '6' && !isEmergency)} 
            className="flex-1"
          >
            Classify Patient
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && selectedClass && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${getSeverityStyles(classification)}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{getDisplayClassification()}</p>
                <p className="text-lg font-semibold">{selectedClass.title}</p>
                <p className="text-sm">{selectedClass.description}</p>
                {selectedClass.mortality !== 'N/A' && (
                  <p className="text-sm font-medium mt-2">
                    Perioperative mortality risk: ~{selectedClass.mortality}
                  </p>
                )}
                {isEmergency === 'yes' && classification !== '6' && (
                  <p className="text-sm font-medium text-orange-700 mt-2">
                    ⚠️ Emergency case - higher risk expected
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">ASA Classification Guidelines</p>
                <ul className="mt-2 space-y-1">
                  <li>• Developed by American Society of Anesthesiologists</li>
                  <li>• Used for preoperative risk assessment and communication</li>
                  <li>• The "E" suffix indicates emergency surgery</li>
                  <li>• Mortality rates are approximate and vary by procedure type</li>
                  <li>• Consider combining with other risk scores (RCRI, ACS NSQIP) for comprehensive assessment</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Reference:</strong> ASA Physical Status Classification System (Last approved by ASA House of Delegates, October 2019). 
                Mortality data from Davenport DL, et al. National Surgical Quality Improvement Program (NSQIP) risk factors.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ASAClassificationCalculator;
