import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle, Activity } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const medicalCriteria = [
  { 
    id: 'ischemic_heart', 
    label: 'History of ischemic heart disease',
    description: 'History of MI, positive exercise test, current chest pain (ischemia), nitrate therapy, or pathological Q waves on ECG'
  },
  { 
    id: 'heart_failure', 
    label: 'History of congestive heart failure',
    description: 'History of CHF, pulmonary edema, PND, bilateral rales/S3, or CXR with pulmonary vascular redistribution'
  },
  { 
    id: 'cvd', 
    label: 'History of cerebrovascular disease',
    description: 'History of TIA or stroke'
  },
  { 
    id: 'insulin', 
    label: 'Insulin therapy for diabetes',
    description: 'Preoperative treatment with insulin'
  },
  { 
    id: 'creatinine', 
    label: 'Preoperative creatinine > 2.0 mg/dL',
    description: 'Creatinine > 2.0 mg/dL (177 µmol/L)'
  }
];

const surgeryCategories = {
  high: {
    label: 'High-Risk Surgery (≥5% cardiac risk)',
    examples: [
      'Aortic surgery',
      'Major vascular surgery (abdominal aorta, carotid, peripheral arterial)',
      'Peripheral vascular surgery',
      'Open lower extremity revascularization or amputation',
      'Duodenocephalic pancreatectomy',
      'Liver resection, bile duct surgery',
      'Esophagectomy',
      'Repair of perforated bowel',
      'Adrenal resection',
      'Total cystectomy',
      'Pneumonectomy',
      'Lung or liver transplant',
    ]
  },
  intermediate: {
    label: 'Intermediate-Risk Surgery (1-5% cardiac risk)',
    examples: [
      'Intraperitoneal surgery (cholecystectomy, gastrectomy, colectomy)',
      'Intrathoracic surgery (lobectomy)',
      'Carotid endarterectomy',
      'Head and neck surgery',
      'Orthopedic surgery (hip/spine)',
      'Prostate surgery',
      'Renal transplant',
      'Endovascular aneurysm repair',
    ]
  },
  low: {
    label: 'Low-Risk Surgery (<1% cardiac risk)',
    examples: [
      'Superficial procedures',
      'Breast surgery',
      'Ambulatory surgery',
      'Endoscopic procedures',
      'Cataract surgery',
      'Minor plastic surgery',
      'Minor urological procedures (TURP)',
      'Minor orthopedic surgery (arthroscopy)',
      'Minor gynecological procedures',
    ]
  }
};

const metsActivities = [
  { mets: 1, activities: ['Eating, dressing, using toilet', 'Walking indoors around the house', 'Walking 1-2 blocks on level ground at 2-3 mph'] },
  { mets: 4, activities: ['Climbing a flight of stairs', 'Walking on level ground at 4 mph', 'Running a short distance', 'Heavy housework (scrubbing floors, moving furniture)'] },
  { mets: 7, activities: ['Climbing 2+ flights of stairs', 'Walking uphill', 'Playing singles tennis', 'Heavy yard work (digging, shoveling)'] },
  { mets: 10, activities: ['Strenuous sports (swimming, basketball, football)', 'Running/jogging at 6+ mph', 'Heavy labor'] }
];

const getInterpretation = (score: number) => {
  if (score === 0) {
    return {
      risk: '0.4%',
      class: 'I',
      description: 'Very low risk',
      colorClass: 'bg-green-100 text-green-800 border-green-200'
    };
  } else if (score === 1) {
    return {
      risk: '0.9%',
      class: 'II',
      description: 'Low risk',
      colorClass: 'bg-green-100 text-green-800 border-green-200'
    };
  } else if (score === 2) {
    return {
      risk: '6.6%',
      class: 'III',
      description: 'Moderate risk',
      colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
  } else {
    return {
      risk: '≥11%',
      class: 'IV',
      description: 'High risk',
      colorClass: 'bg-red-100 text-red-800 border-red-200'
    };
  }
};

const RCRICalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [surgeryRisk, setSurgeryRisk] = useState<string>('');
  const [functionalCapacity, setFunctionalCapacity] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const calculateScore = () => {
    let score = medicalCriteria.filter(c => answers[c.id]).length;
    if (surgeryRisk === 'high') {
      score += 1;
    }
    return score;
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setAnswers({});
    setSurgeryRisk('');
    setFunctionalCapacity('');
    setShowResults(false);
  };

  const isValid = surgeryRisk !== '';
  const estimatedMETs = functionalCapacity ? parseInt(functionalCapacity) : null;
  const hasPoorFunctionalCapacity = estimatedMETs !== null && estimatedMETs < 4;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Revised Cardiac Risk Index (RCRI)</CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Lee Index – Perioperative cardiac risk assessment for non-cardiac surgery
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Surgery Risk Category */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Surgery Risk Category</Label>
          <RadioGroup value={surgeryRisk} onValueChange={setSurgeryRisk} className="space-y-3">
            {Object.entries(surgeryCategories).map(([key, category]) => (
              <Collapsible 
                key={key} 
                open={expandedCategory === key}
                onOpenChange={(open) => setExpandedCategory(open ? key : null)}
              >
                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                  <RadioGroupItem value={key} id={`surgery-${key}`} className="mt-1" />
                  <div className="flex-1">
                    <CollapsibleTrigger asChild>
                      <Label 
                        htmlFor={`surgery-${key}`} 
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-medium">{category.label}</span>
                        <span className="text-xs text-muted-foreground hover:text-foreground">
                          {expandedCategory === key ? 'Hide examples ▲' : 'Show examples ▼'}
                        </span>
                      </Label>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                        {category.examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </div>
                </div>
              </Collapsible>
            ))}
          </RadioGroup>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-4">
          <Label className="text-base font-semibold">Clinical Risk Factors (1 point each)</Label>
        </div>

        {/* Medical Criteria */}
        {medicalCriteria.map((criterion) => (
          <div key={criterion.id} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              id={criterion.id}
              checked={answers[criterion.id] || false}
              onCheckedChange={(checked) => setAnswers(prev => ({ ...prev, [criterion.id]: checked as boolean }))}
              className="mt-0.5"
            />
            <Label htmlFor={criterion.id} className="cursor-pointer flex-1">
              <p className="font-medium">{criterion.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{criterion.description}</p>
            </Label>
          </div>
        ))}

        {/* METs Functional Capacity Assessment */}
        <div className="border-t border-border pt-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Functional Capacity (METs) Assessment
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Estimate based on patient's ability to perform activities without symptoms
          </p>
        </div>

        <div className="space-y-3">
          <RadioGroup value={functionalCapacity} onValueChange={setFunctionalCapacity} className="space-y-3">
            {metsActivities.map((level) => (
              <div 
                key={level.mets} 
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  functionalCapacity === String(level.mets) 
                    ? level.mets >= 4 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                    : 'bg-muted/30 border-transparent'
                }`}
              >
                <RadioGroupItem value={String(level.mets)} id={`mets-${level.mets}`} className="mt-1" />
                <Label htmlFor={`mets-${level.mets}`} className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                      level.mets >= 4 ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'
                    }`}>
                      {level.mets >= 10 ? '≥10' : level.mets} METs
                    </span>
                    {level.mets >= 4 && <span className="text-xs text-green-600 font-medium">✓ Adequate</span>}
                    {level.mets < 4 && <span className="text-xs text-amber-600 font-medium">Poor capacity</span>}
                  </div>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                    {level.activities.map((activity, idx) => (
                      <li key={idx}>• {activity}</li>
                    ))}
                  </ul>
                </Label>
              </div>
            ))}
            <div className={`flex items-start space-x-3 p-4 rounded-lg border ${
              functionalCapacity === 'unknown' ? 'bg-gray-100 border-gray-300' : 'bg-muted/30 border-transparent'
            }`}>
              <RadioGroupItem value="unknown" id="mets-unknown" className="mt-1" />
              <Label htmlFor="mets-unknown" className="cursor-pointer flex-1">
                <span className="font-medium">Unknown / Unable to assess</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Patient cannot perform activities or functional status cannot be determined
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Risk
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}/6</p>
                <p className="text-lg font-semibold">RCRI Class {interpretation.class}</p>
              </div>
              <div className="space-y-2 text-sm text-center">
                <p><strong>Risk of major cardiac event:</strong> {interpretation.risk}</p>
                <p>{interpretation.description}</p>
              </div>
            </div>

            {/* Surgery risk context */}
            {surgeryRisk === 'low' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-semibold">Low-Risk Surgery Selected</p>
                  <p className="mt-1">
                    For low-risk surgeries (&lt;1% cardiac risk), further cardiac testing is generally 
                    not indicated regardless of clinical risk factors.
                  </p>
                </div>
              </div>
            )}

            {surgeryRisk !== 'low' && score >= 2 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Consider Further Evaluation</p>
                  <p className="mt-1">
                    Elevated RCRI score with elevated-risk surgery. Per ACC/AHA guidelines, consider 
                    functional capacity assessment and potentially non-invasive cardiac testing.
                  </p>
                </div>
              </div>
            )}

            {/* METs-based recommendations */}
            {functionalCapacity && (
              <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                functionalCapacity === 'unknown' 
                  ? 'bg-gray-50 border-gray-200' 
                  : hasPoorFunctionalCapacity 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-green-50 border-green-200'
              }`}>
                <Activity className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  functionalCapacity === 'unknown' 
                    ? 'text-gray-600' 
                    : hasPoorFunctionalCapacity 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                }`} />
                <div className={`text-sm ${
                  functionalCapacity === 'unknown' 
                    ? 'text-gray-800' 
                    : hasPoorFunctionalCapacity 
                      ? 'text-orange-800' 
                      : 'text-green-800'
                }`}>
                  <p className="font-semibold">
                    Functional Capacity: {
                      functionalCapacity === 'unknown' 
                        ? 'Unknown' 
                        : `${estimatedMETs}${estimatedMETs === 10 ? '+' : ''} METs (${hasPoorFunctionalCapacity ? 'Poor' : 'Adequate'})`
                    }
                  </p>
                  {functionalCapacity === 'unknown' && (
                    <p className="mt-1">
                      Unable to assess functional capacity. Per ACC/AHA guidelines, if clinical risk factors 
                      are elevated, consider pharmacologic stress testing before elevated-risk surgery.
                    </p>
                  )}
                  {hasPoorFunctionalCapacity && (
                    <p className="mt-1">
                      <strong>&lt;4 METs:</strong> Poor functional capacity. Combined with RCRI Class {interpretation.class}, 
                      {score >= 1 && surgeryRisk !== 'low' 
                        ? ' consider non-invasive cardiac testing (stress echo, nuclear imaging) before proceeding.'
                        : ' monitor closely perioperatively.'}
                    </p>
                  )}
                  {!hasPoorFunctionalCapacity && functionalCapacity !== 'unknown' && (
                    <p className="mt-1">
                      <strong>≥4 METs:</strong> Adequate functional capacity. Patients who can achieve ≥4 METs 
                      without symptoms generally have favorable perioperative outcomes. Proceed to surgery 
                      with appropriate risk reduction strategies.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ACC/AHA Algorithm Summary */}
            {surgeryRisk !== 'low' && score >= 1 && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="font-semibold text-sm text-indigo-800 mb-2">ACC/AHA 2014 Stepwise Approach</p>
                <ol className="text-xs text-indigo-700 space-y-1 list-decimal ml-4">
                  <li className={score >= 1 ? 'font-medium' : ''}>
                    RCRI ≥1: Clinical risk factors present ✓
                  </li>
                  <li className={functionalCapacity ? 'font-medium' : ''}>
                    Assess functional capacity: {
                      !functionalCapacity 
                        ? 'Not assessed' 
                        : functionalCapacity === 'unknown' 
                          ? 'Unknown' 
                          : `${estimatedMETs} METs`
                    }
                  </li>
                  <li>
                    {hasPoorFunctionalCapacity || functionalCapacity === 'unknown'
                      ? 'Consider pharmacologic stress testing if it will change management'
                      : 'Adequate capacity (≥4 METs) → Proceed to surgery'}
                  </li>
                </ol>
              </div>
            )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Major Cardiac Events Include:</p>
                <p className="mt-1">MI, pulmonary edema, VF, cardiac arrest, complete heart block</p>
                <p className="mt-2 text-xs">
                  Also known as the Lee Index. Part of ACC/AHA 2014 preoperative guidelines.
                </p>
                <p className="mt-1 text-xs">Reference: Lee TH et al. Circulation 1999;100:1043-1049</p>
              </div>
            </div>

            {/* RCRI vs Gupta MICA Comparison */}
            <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
              <p className="font-semibold text-sm text-violet-800 mb-2">RCRI vs Gupta MICA: Which to Use?</p>
              <div className="text-xs text-violet-700 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-violet-100/50 rounded">
                    <p className="font-semibold">RCRI (This Calculator)</p>
                    <ul className="mt-1 space-y-0.5 list-disc ml-3">
                      <li>Simple 6-point system</li>
                      <li>Validated in diverse populations</li>
                      <li>ACC/AHA guideline recommended</li>
                      <li>Best for quick stratification</li>
                      <li>Predicts major cardiac events</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-violet-100/50 rounded">
                    <p className="font-semibold">Gupta MICA</p>
                    <ul className="mt-1 space-y-0.5 list-disc ml-3">
                      <li>Continuous age variable</li>
                      <li>Surgery-specific coefficients</li>
                      <li>Includes functional status</li>
                      <li>Better discrimination for high-risk</li>
                      <li>Predicts MI or cardiac arrest only</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-2 italic">
                  💡 Consider using <strong>both</strong>: RCRI for guideline-based decision making, 
                  Gupta MICA for more granular risk estimation in borderline cases.
                </p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold text-sm mb-2">Score Breakdown:</p>
              <ul className="text-xs space-y-1">
                <li>• High-risk surgery: {surgeryRisk === 'high' ? '1 point' : '0 points'}</li>
                {medicalCriteria.map(c => (
                  <li key={c.id}>• {c.label}: {answers[c.id] ? '1 point' : '0 points'}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RCRICalculator;
