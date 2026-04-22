import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

const GuptaMICACalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [functionalStatus, setFunctionalStatus] = useState('');
  const [asaClass, setAsaClass] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [surgeryType, setSurgeryType] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateRisk = () => {
    const ageVal = parseFloat(age);
    const creatVal = parseFloat(creatinine);

    if (isNaN(ageVal) || !functionalStatus || !asaClass || isNaN(creatVal) || !surgeryType) {
      return null;
    }

    // Gupta MICA calculator coefficients (simplified)
    // Based on logistic regression from ACS NSQIP data
    let logOdds = -5.25; // Intercept

    // Age (continuous, per year)
    logOdds += ageVal * 0.02;

    // Functional status
    switch (functionalStatus) {
      case 'independent':
        logOdds += 0;
        break;
      case 'partially':
        logOdds += 0.65;
        break;
      case 'totally':
        logOdds += 0.94;
        break;
    }

    // ASA Class
    switch (asaClass) {
      case '1':
        logOdds += 0;
        break;
      case '2':
        logOdds += 0.34;
        break;
      case '3':
        logOdds += 0.98;
        break;
      case '4':
        logOdds += 1.92;
        break;
      case '5':
        logOdds += 2.38;
        break;
    }

    // Creatinine >1.5 mg/dL
    if (creatVal > 1.5) {
      logOdds += 0.61;
    }

    // Surgery type
    switch (surgeryType) {
      case 'anes':
        logOdds += -0.35; // Anesthesia/pain procedures
        break;
      case 'thoracic':
        logOdds += 1.05;
        break;
      case 'vascular':
        logOdds += 1.24;
        break;
      case 'abdominal':
        logOdds += 0.67;
        break;
      case 'neuro':
        logOdds += 0.55;
        break;
      case 'ortho':
        logOdds += -0.08;
        break;
      case 'ent':
        logOdds += -0.11;
        break;
      case 'plastics':
        logOdds += -0.25;
        break;
      case 'urology':
        logOdds += 0.12;
        break;
      default:
        logOdds += 0;
    }

    // Convert log-odds to probability
    const probability = 100 / (1 + Math.exp(-logOdds));
    
    // Risk category
    let category = '';
    let colorClass = '';
    if (probability < 0.5) {
      category = 'Low';
      colorClass = 'bg-green-100 border-green-200 text-green-800';
    } else if (probability < 1) {
      category = 'Average';
      colorClass = 'bg-yellow-100 border-yellow-200 text-yellow-800';
    } else if (probability < 2) {
      category = 'Elevated';
      colorClass = 'bg-orange-100 border-orange-200 text-orange-800';
    } else {
      category = 'High';
      colorClass = 'bg-red-100 border-red-200 text-red-800';
    }

    return {
      risk: probability.toFixed(2),
      category,
      colorClass
    };
  };

  const result = showResults ? calculateRisk() : null;
  const isValid = age && functionalStatus && asaClass && creatinine && surgeryType;

  const resetForm = () => {
    setAge('');
    setFunctionalStatus('');
    setAsaClass('');
    setCreatinine('');
    setSurgeryType('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Gupta Perioperative MICA Calculator</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Predicts risk of perioperative MI or cardiac arrest within 30 days of surgery
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input 
              id="age" 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              placeholder="18-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creat">Creatinine (mg/dL)</Label>
            <Input 
              id="creat" 
              type="number" 
              step="0.1"
              value={creatinine} 
              onChange={(e) => setCreatinine(e.target.value)} 
              placeholder="e.g., 1.0"
            />
            <p className="text-xs text-muted-foreground">&gt;1.5 mg/dL adds risk</p>
          </div>

          <div className="space-y-3">
            <Label>Functional Status</Label>
            <RadioGroup value={functionalStatus} onValueChange={setFunctionalStatus} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="independent" id="independent" />
                <Label htmlFor="independent">Independent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partially" id="partially" />
                <Label htmlFor="partially">Partially dependent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="totally" id="totally" />
                <Label htmlFor="totally">Totally dependent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>ASA Physical Status Class</Label>
            <RadioGroup value={asaClass} onValueChange={setAsaClass} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="asa1" />
                <Label htmlFor="asa1">I - Healthy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="asa2" />
                <Label htmlFor="asa2">II - Mild systemic disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="asa3" />
                <Label htmlFor="asa3">III - Severe systemic disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="asa4" />
                <Label htmlFor="asa4">IV - Life-threatening disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="asa5" />
                <Label htmlFor="asa5">V - Moribund</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="surgery">Type of Surgery</Label>
            <Select value={surgeryType} onValueChange={setSurgeryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select surgery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anes">Anesthesia/Pain procedures</SelectItem>
                <SelectItem value="thoracic">Thoracic</SelectItem>
                <SelectItem value="vascular">Vascular</SelectItem>
                <SelectItem value="abdominal">Abdominal (general surgery)</SelectItem>
                <SelectItem value="neuro">Neurosurgery</SelectItem>
                <SelectItem value="ortho">Orthopedic</SelectItem>
                <SelectItem value="ent">ENT/Head & Neck</SelectItem>
                <SelectItem value="plastics">Plastic surgery</SelectItem>
                <SelectItem value="urology">Urology</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Risk
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-6 rounded-lg border ${result.colorClass}`}>
            <div className="text-center">
              <p className="text-4xl font-bold">{result.risk}%</p>
              <p className="text-lg font-semibold mt-2">
                30-Day Risk of MI or Cardiac Arrest
              </p>
              <p className="text-sm mt-1">{result.category} Risk</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Gupta MICA Risk Factors</p>
            <ul className="mt-1 space-y-1">
              <li>• Age (continuous)</li>
              <li>• Functional status (independent → dependent)</li>
              <li>• ASA physical status classification</li>
              <li>• Creatinine &gt;1.5 mg/dL</li>
              <li>• Type of surgery (vascular/thoracic = highest risk)</li>
            </ul>
            <p className="mt-2 text-xs">Reference: Gupta PK et al. Circulation 2011;124:381-387</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Clinical Note:</strong> This calculator predicts perioperative myocardial infarction 
            or cardiac arrest (MICA). It was derived from ACS NSQIP data and is intended for preoperative 
            risk stratification. Consider additional testing or optimization for elevated-risk patients.
          </p>
        </div>

        {/* Gupta MICA vs RCRI Comparison */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="font-semibold text-sm text-rose-800 mb-2">Gupta MICA vs RCRI: Which to Use?</p>
          <div className="text-xs text-rose-700 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-rose-100/50 rounded">
                <p className="font-semibold">Gupta MICA (This Calculator)</p>
                <ul className="mt-1 space-y-0.5 list-disc ml-3">
                  <li>Continuous age variable</li>
                  <li>Surgery-specific coefficients</li>
                  <li>Includes functional status</li>
                  <li>Better discrimination for high-risk</li>
                  <li>Predicts MI or cardiac arrest only</li>
                </ul>
              </div>
              <div className="p-2 bg-rose-100/50 rounded">
                <p className="font-semibold">RCRI (Lee Index)</p>
                <ul className="mt-1 space-y-0.5 list-disc ml-3">
                  <li>Simple 6-point system</li>
                  <li>Validated in diverse populations</li>
                  <li>ACC/AHA guideline recommended</li>
                  <li>Best for quick stratification</li>
                  <li>Predicts major cardiac events</li>
                </ul>
              </div>
            </div>
            <p className="mt-2 italic">
              💡 <strong>When to choose Gupta MICA:</strong> Vascular/thoracic surgery, elderly patients, 
              or when functional status is a concern. Use RCRI for guideline-based decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuptaMICACalculator;
