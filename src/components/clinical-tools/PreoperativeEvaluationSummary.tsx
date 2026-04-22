import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, AlertTriangle, Activity, FileText, Download, Printer } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// RCRI criteria
const rcriCriteria = [
  { id: 'ischemic_heart', label: 'History of ischemic heart disease' },
  { id: 'heart_failure', label: 'History of congestive heart failure' },
  { id: 'cvd', label: 'History of cerebrovascular disease (TIA/stroke)' },
  { id: 'insulin', label: 'Insulin therapy for diabetes' },
  { id: 'creatinine', label: 'Preoperative creatinine > 2.0 mg/dL' },
];

// Surgery types for Gupta MICA
const surgeryTypes = [
  { value: 'anorectal', label: 'Anorectal', coefficient: -0.1499 },
  { value: 'aortic', label: 'Aortic', coefficient: 1.0600 },
  { value: 'bariatric', label: 'Bariatric', coefficient: -0.2820 },
  { value: 'brain', label: 'Brain', coefficient: 0.6640 },
  { value: 'breast', label: 'Breast', coefficient: -1.1900 },
  { value: 'cardiac', label: 'Cardiac', coefficient: 0.6000 },
  { value: 'ent', label: 'ENT (except thyroid/parathyroid)', coefficient: -0.0823 },
  { value: 'foregut_hepatopancreatobiliary', label: 'Foregut or hepatopancreatobiliary', coefficient: 0.5050 },
  { value: 'gallbladder_appendix_adrenals_spleen', label: 'Gallbladder, appendix, adrenals, or spleen', coefficient: -0.2050 },
  { value: 'hernia', label: 'Hernia (ventral, inguinal, femoral)', coefficient: -0.5480 },
  { value: 'hip_fracture', label: 'Hip fracture repair', coefficient: 0.4280 },
  { value: 'hysterectomy', label: 'Hysterectomy', coefficient: -0.5550 },
  { value: 'knee', label: 'Knee', coefficient: -0.8060 },
  { value: 'lower_extremity_revasc', label: 'Lower extremity revascularization', coefficient: 0.6940 },
  { value: 'lung', label: 'Lung', coefficient: 0.6710 },
  { value: 'neck', label: 'Neck', coefficient: 0.1870 },
  { value: 'obstetric', label: 'Obstetric', coefficient: -1.2800 },
  { value: 'orthopedic_other', label: 'Orthopedic other', coefficient: -0.3430 },
  { value: 'other_abdomen', label: 'Other abdomen', coefficient: 0.2780 },
  { value: 'peripheral_vascular', label: 'Peripheral vascular (non-LER)', coefficient: 0.4680 },
  { value: 'skin', label: 'Skin', coefficient: -0.6420 },
  { value: 'spine', label: 'Spine', coefficient: 0.0130 },
  { value: 'non_esophageal_thoracic', label: 'Non-esophageal thoracic', coefficient: 0.2980 },
  { value: 'thyroid_parathyroid', label: 'Thyroid/parathyroid', coefficient: -0.7050 },
  { value: 'urologic', label: 'Urologic', coefficient: -0.1070 },
  { value: 'venous', label: 'Venous', coefficient: -0.7400 },
  { value: 'esophageal', label: 'Esophageal', coefficient: 0.8500 },
];

// Surgery risk categories for RCRI
const surgeryRiskCategories = {
  high: { label: 'High-Risk (≥5%)', examples: 'Aortic, major vascular, emergency' },
  intermediate: { label: 'Intermediate-Risk (1-5%)', examples: 'Intraperitoneal, intrathoracic, orthopedic' },
  low: { label: 'Low-Risk (<1%)', examples: 'Endoscopy, superficial, cataract' },
};

// Functional status options for Gupta
const functionalStatusOptions = [
  { value: 'independent', label: 'Independent' },
  { value: 'partially_dependent', label: 'Partially Dependent' },
  { value: 'totally_dependent', label: 'Totally Dependent' },
];

// ASA class options
const asaClassOptions = [
  { value: '1', label: 'ASA I - Normal healthy patient' },
  { value: '2', label: 'ASA II - Mild systemic disease' },
  { value: '3', label: 'ASA III - Severe systemic disease' },
  { value: '4', label: 'ASA IV - Severe systemic disease, constant threat to life' },
  { value: '5', label: 'ASA V - Moribund, not expected to survive' },
];

// METs activities
const metsActivities = [
  { mets: 1, label: '1 MET', activities: 'Eating, dressing, walking indoors' },
  { mets: 4, label: '4 METs', activities: 'Climbing stairs, walking 4 mph, heavy housework' },
  { mets: 7, label: '7 METs', activities: 'Climbing 2+ flights, singles tennis, heavy yard work' },
  { mets: 10, label: '≥10 METs', activities: 'Strenuous sports, running 6+ mph' },
];

const getRCRIInterpretation = (score: number) => {
  if (score === 0) return { risk: '0.4%', class: 'I', description: 'Very low risk', color: 'text-green-700 bg-green-50 border-green-200' };
  if (score === 1) return { risk: '0.9%', class: 'II', description: 'Low risk', color: 'text-green-700 bg-green-50 border-green-200' };
  if (score === 2) return { risk: '6.6%', class: 'III', description: 'Moderate risk', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
  return { risk: '≥11%', class: 'IV', description: 'High risk', color: 'text-red-700 bg-red-50 border-red-200' };
};

const getGuptaRiskCategory = (risk: number) => {
  if (risk < 0.5) return { category: 'Very Low', color: 'text-green-700 bg-green-50 border-green-200' };
  if (risk < 1) return { category: 'Low', color: 'text-green-700 bg-green-50 border-green-200' };
  if (risk < 2) return { category: 'Intermediate', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
  return { category: 'High', color: 'text-red-700 bg-red-50 border-red-200' };
};

const PreoperativeEvaluationSummary: React.FC = () => {
  // Patient demographics
  const [age, setAge] = useState<string>('');
  
  // RCRI inputs
  const [rcriAnswers, setRcriAnswers] = useState<Record<string, boolean>>({});
  const [surgeryRisk, setSurgeryRisk] = useState<string>('');
  
  // Gupta MICA inputs
  const [surgeryType, setSurgeryType] = useState<string>('');
  const [functionalStatus, setFunctionalStatus] = useState<string>('');
  const [asaClass, setAsaClass] = useState<string>('');
  const [creatinine, setCreatinine] = useState<string>('');
  
  // METs
  const [mets, setMets] = useState<string>('');
  
  const [showReport, setShowReport] = useState(false);

  // Calculate RCRI score
  const rcriScore = useMemo(() => {
    let score = rcriCriteria.filter(c => rcriAnswers[c.id]).length;
    if (surgeryRisk === 'high') score += 1;
    return score;
  }, [rcriAnswers, surgeryRisk]);

  // Calculate Gupta MICA risk
  const guptaRisk = useMemo(() => {
    if (!age || !surgeryType || !functionalStatus || !asaClass || !creatinine) return null;
    
    const ageNum = parseFloat(age);
    const creatNum = parseFloat(creatinine);
    const selectedSurgery = surgeryTypes.find(s => s.value === surgeryType);
    
    if (!selectedSurgery || isNaN(ageNum) || isNaN(creatNum)) return null;
    
    // Gupta MICA formula
    let logit = -5.25;
    logit += selectedSurgery.coefficient;
    logit += 0.02 * ageNum;
    
    if (functionalStatus === 'partially_dependent') logit += 0.65;
    else if (functionalStatus === 'totally_dependent') logit += 1.03;
    
    if (asaClass === '2') logit += 0.34;
    else if (asaClass === '3') logit += 0.82;
    else if (asaClass === '4') logit += 1.34;
    else if (asaClass === '5') logit += 2.00;
    
    if (creatNum > 1.5) logit += 0.61;
    
    const probability = Math.exp(logit) / (1 + Math.exp(logit)) * 100;
    return probability;
  }, [age, surgeryType, functionalStatus, asaClass, creatinine]);

  const rcriInterpretation = getRCRIInterpretation(rcriScore);
  const guptaCategory = guptaRisk !== null ? getGuptaRiskCategory(guptaRisk) : null;
  const metsValue = mets ? parseInt(mets) : null;
  const hasPoorFunctionalCapacity = metsValue !== null && metsValue < 4;

  const canGenerateReport = surgeryRisk !== '' && age !== '' && surgeryType !== '' && 
    functionalStatus !== '' && asaClass !== '' && creatinine !== '';

  const resetForm = () => {
    setAge('');
    setRcriAnswers({});
    setSurgeryRisk('');
    setSurgeryType('');
    setFunctionalStatus('');
    setAsaClass('');
    setCreatinine('');
    setMets('');
    setShowReport(false);
  };

  const getOverallRecommendation = useCallback(() => {
    const highRiskRCRI = rcriScore >= 2;
    const highRiskGupta = guptaRisk !== null && guptaRisk >= 1;
    const poorMETs = hasPoorFunctionalCapacity;
    const lowSurgeryRisk = surgeryRisk === 'low';

    if (lowSurgeryRisk) {
      return {
        level: 'proceed',
        text: 'Low-risk surgery: Proceed to surgery. Further cardiac testing generally not indicated regardless of clinical risk factors.',
        color: 'bg-green-50 border-green-200 text-green-800'
      };
    }

    if (highRiskRCRI && highRiskGupta && poorMETs) {
      return {
        level: 'high-risk',
        text: 'Multiple elevated risk indicators. Strongly consider non-invasive cardiac testing (stress echo, nuclear imaging) before proceeding. Cardiology consultation recommended.',
        color: 'bg-red-50 border-red-200 text-red-800'
      };
    }

    if ((highRiskRCRI || highRiskGupta) && poorMETs) {
      return {
        level: 'moderate-risk',
        text: 'Elevated risk with poor functional capacity. Consider pharmacologic stress testing if it will change management. Optimize medical therapy perioperatively.',
        color: 'bg-amber-50 border-amber-200 text-amber-800'
      };
    }

    if (highRiskRCRI || highRiskGupta) {
      return {
        level: 'elevated',
        text: 'Elevated perioperative risk. Ensure adequate functional capacity (≥4 METs). Optimize medical therapy and consider beta-blockade per guidelines.',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      };
    }

    return {
      level: 'low-risk',
      text: 'Low perioperative cardiac risk. Proceed to surgery with standard monitoring and risk reduction strategies.',
      color: 'bg-green-50 border-green-200 text-green-800'
    };
  }, [rcriScore, guptaRisk, hasPoorFunctionalCapacity, surgeryRisk]);

  const exportToPDF = useCallback(() => {
    const recommendation = getOverallRecommendation();
    const selectedSurgery = surgeryTypes.find(s => s.value === surgeryType);
    const selectedASA = asaClassOptions.find(a => a.value === asaClass);
    const identifiedRiskFactors = rcriCriteria.filter(c => rcriAnswers[c.id]);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Export Failed',
        description: 'Please allow pop-ups to export the report.',
        variant: 'destructive',
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preoperative Cardiac Risk Evaluation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; padding: 20px; color: #1a1a1a; }
          .header { border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px; }
          .header h1 { font-size: 22px; color: #4f46e5; margin-bottom: 5px; }
          .header .subtitle { font-size: 13px; color: #6b7280; }
          .header .generated { font-size: 11px; color: #9ca3af; text-align: right; }
          .section { margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; }
          .section-title { font-weight: bold; font-size: 13px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 10px; }
          .recommendation { padding: 12px; border-radius: 6px; margin-bottom: 16px; }
          .recommendation.high-risk { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
          .recommendation.moderate-risk { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
          .recommendation.elevated { background: #fefce8; border: 1px solid #fef08a; color: #854d0e; }
          .recommendation.low-risk, .recommendation.proceed { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
          .scores-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
          .score-card { text-align: center; padding: 15px; border-radius: 6px; }
          .score-card.low { background: #f0fdf4; border: 1px solid #bbf7d0; }
          .score-card.moderate { background: #fefce8; border: 1px solid #fef08a; }
          .score-card.high { background: #fef2f2; border: 1px solid #fecaca; }
          .score-card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.75; }
          .score-card .value { font-size: 26px; font-weight: bold; margin: 5px 0; }
          .score-card .sublabel { font-size: 11px; font-weight: 600; }
          .score-card .detail { font-size: 10px; opacity: 0.75; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .info-row { margin-bottom: 6px; }
          .info-row strong { color: #374151; }
          .list { list-style: none; }
          .list li { margin-bottom: 4px; }
          .list li:before { content: "• "; color: #6b7280; }
          ol { margin-left: 20px; }
          ol li { margin-bottom: 4px; }
          .stepwise { background: #eef2ff; border: 1px solid #c7d2fe; padding: 12px; border-radius: 6px; margin-bottom: 16px; }
          .references { background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; }
          .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; }
          .signature-line { border-bottom: 1px solid #9ca3af; width: 200px; height: 30px; margin-top: 8px; }
          @media print { body { padding: 10px; } .section { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h1>Preoperative Cardiac Risk Evaluation</h1>
              <div class="subtitle">Combined RCRI + Gupta MICA + METs Assessment per ACC/AHA Guidelines</div>
            </div>
            <div class="generated">
              <div>Generated: ${new Date().toLocaleString()}</div>
              <div>MedNurse Clinical Tools</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="grid-2">
            <div class="info-row"><strong>Age:</strong> ${age} years</div>
            <div class="info-row"><strong>Creatinine:</strong> ${creatinine} mg/dL</div>
            <div class="info-row"><strong>Surgery Type:</strong> ${selectedSurgery?.label || 'Not specified'}</div>
            <div class="info-row"><strong>Surgery Risk:</strong> ${surgeryRiskCategories[surgeryRisk as keyof typeof surgeryRiskCategories]?.label || 'Not specified'}</div>
            <div class="info-row"><strong>Functional Status:</strong> ${functionalStatusOptions.find(f => f.value === functionalStatus)?.label || 'Not specified'}</div>
            <div class="info-row"><strong>ASA Class:</strong> ${selectedASA?.label || 'Not specified'}</div>
          </div>
        </div>

        <div class="recommendation ${recommendation.level}">
          <strong>Clinical Recommendation:</strong><br/>
          ${recommendation.text}
        </div>

        <div class="scores-grid">
          <div class="score-card ${rcriScore <= 1 ? 'low' : rcriScore === 2 ? 'moderate' : 'high'}">
            <div class="label">RCRI (Lee Index)</div>
            <div class="value">${rcriScore}/6</div>
            <div class="sublabel">Class ${rcriInterpretation.class}</div>
            <div class="detail">Risk: ${rcriInterpretation.risk}</div>
          </div>
          ${guptaRisk !== null ? `
          <div class="score-card ${guptaRisk < 1 ? 'low' : guptaRisk < 2 ? 'moderate' : 'high'}">
            <div class="label">Gupta MICA</div>
            <div class="value">${guptaRisk.toFixed(2)}%</div>
            <div class="sublabel">${guptaCategory?.category || ''} Risk</div>
            <div class="detail">30-day MI/Cardiac Arrest</div>
          </div>
          ` : ''}
          ${metsValue !== null ? `
          <div class="score-card ${metsValue >= 4 ? 'low' : 'moderate'}">
            <div class="label">Functional Capacity</div>
            <div class="value">${metsValue >= 10 ? '≥10' : metsValue} METs</div>
            <div class="sublabel">${hasPoorFunctionalCapacity ? 'Poor' : 'Adequate'}</div>
            <div class="detail">${hasPoorFunctionalCapacity ? 'Consider stress testing' : 'Favorable prognosis'}</div>
          </div>
          ` : ''}
        </div>

        <div class="stepwise">
          <div style="font-weight: bold; margin-bottom: 8px; color: #4338ca;">ACC/AHA 2014 Stepwise Assessment</div>
          <ol>
            <li>Surgery Risk: ${surgeryRiskCategories[surgeryRisk as keyof typeof surgeryRiskCategories]?.label || 'Not specified'}</li>
            <li>RCRI Score: ${rcriScore} point${rcriScore !== 1 ? 's' : ''} → Class ${rcriInterpretation.class} (${rcriInterpretation.risk} risk)</li>
            <li>Gupta MICA: ${guptaRisk !== null ? `${guptaRisk.toFixed(2)}%` : 'Incomplete data'}</li>
            <li>Functional Capacity: ${metsValue !== null ? `${metsValue} METs (${hasPoorFunctionalCapacity ? '<4, poor' : '≥4, adequate'})` : 'Not assessed'}</li>
          </ol>
        </div>

        <div class="section">
          <div class="section-title">Identified Risk Factors</div>
          <ul class="list">
            ${identifiedRiskFactors.length > 0 ? identifiedRiskFactors.map(c => `<li>${c.label}</li>`).join('') : ''}
            ${surgeryRisk === 'high' ? '<li>High-risk surgery</li>' : ''}
            ${parseFloat(creatinine) > 1.5 ? '<li>Elevated creatinine (&gt;1.5 mg/dL)</li>' : ''}
            ${functionalStatus !== 'independent' ? `<li>${functionalStatus === 'partially_dependent' ? 'Partially' : 'Totally'} dependent functional status</li>` : ''}
            ${parseInt(asaClass) >= 3 ? `<li>ASA Class ${asaClass}</li>` : ''}
            ${identifiedRiskFactors.length === 0 && surgeryRisk !== 'high' && parseFloat(creatinine) <= 1.5 ? '<li style="color: #6b7280;">No major clinical risk factors identified</li>' : ''}
          </ul>
        </div>

        <div class="references">
          <div style="font-weight: bold; margin-bottom: 8px; color: #1e40af;">References</div>
          <ul class="list">
            <li>Lee TH et al. Circulation 1999;100:1043-1049 (RCRI/Lee Index)</li>
            <li>Gupta PK et al. Circulation 2011;124:381-387 (MICA Calculator)</li>
            <li>Fleisher LA et al. Circulation 2014;130:e278-e333 (ACC/AHA Guidelines)</li>
          </ul>
        </div>

        <div class="footer">
          <div class="grid-2">
            <div>
              <strong>Provider Signature:</strong>
              <div class="signature-line"></div>
            </div>
            <div>
              <strong>Date/Time:</strong>
              <div class="signature-line"></div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            This document is generated for documentation purposes. Verify all information before inclusion in medical records.
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);

    toast({
      title: 'PDF Export Ready',
      description: 'Use "Save as PDF" in the print dialog to save.',
    });
  }, [age, creatinine, surgeryType, surgeryRisk, functionalStatus, asaClass, rcriAnswers, rcriScore, rcriInterpretation, guptaRisk, guptaCategory, metsValue, hasPoorFunctionalCapacity, getOverallRecommendation]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Preoperative Cardiac Risk Evaluation
        </CardTitle>
        <p className="text-indigo-100 text-sm mt-1">
          Combined RCRI + Gupta MICA + METs Assessment per ACC/AHA Guidelines
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Patient Demographics */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Patient Information</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className="text-sm">Age (years)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 65"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="creatinine" className="text-sm">Creatinine (mg/dL)</Label>
              <Input
                id="creatinine"
                type="number"
                step="0.1"
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
                placeholder="e.g., 1.2"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Surgery Information */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Planned Surgery</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RCRI Surgery Risk */}
            <div>
              <Label className="text-sm mb-2 block">Surgery Risk Category (RCRI)</Label>
              <Select value={surgeryRisk} onValueChange={setSurgeryRisk}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(surgeryRiskCategories).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <span className="font-medium">{cat.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">({cat.examples})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gupta Surgery Type */}
            <div>
              <Label className="text-sm mb-2 block">Specific Surgery Type (Gupta)</Label>
              <Select value={surgeryType} onValueChange={setSurgeryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select surgery type" />
                </SelectTrigger>
                <SelectContent>
                  {surgeryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Clinical Status */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Clinical Status</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Functional Status</Label>
              <Select value={functionalStatus} onValueChange={setFunctionalStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select functional status" />
                </SelectTrigger>
                <SelectContent>
                  {functionalStatusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm mb-2 block">ASA Physical Status</Label>
              <Select value={asaClass} onValueChange={setAsaClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ASA class" />
                </SelectTrigger>
                <SelectContent>
                  {asaClassOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* RCRI Risk Factors */}
        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4" />
            RCRI Clinical Risk Factors
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rcriCriteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={criterion.id}
                  checked={rcriAnswers[criterion.id] || false}
                  onCheckedChange={(checked) => setRcriAnswers(prev => ({ ...prev, [criterion.id]: checked as boolean }))}
                />
                <Label htmlFor={criterion.id} className="cursor-pointer text-sm">
                  {criterion.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* METs Assessment */}
        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Functional Capacity (METs)
          </Label>
          <RadioGroup value={mets} onValueChange={setMets} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metsActivities.map((level) => (
              <div 
                key={level.mets}
                className={`p-3 rounded-lg border cursor-pointer ${
                  mets === String(level.mets) 
                    ? level.mets >= 4 ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'
                    : 'bg-muted/30 border-transparent hover:border-muted-foreground/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={String(level.mets)} id={`mets-${level.mets}`} />
                  <Label htmlFor={`mets-${level.mets}`} className="cursor-pointer">
                    <span className={`font-bold text-sm ${level.mets >= 4 ? 'text-green-700' : 'text-amber-700'}`}>
                      {level.label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{level.activities}</p>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowReport(true)} disabled={!canGenerateReport} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {/* Report Output */}
        {showReport && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Preoperative Cardiac Risk Summary
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="ghost" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            {/* Overall Recommendation */}
            {(() => {
              const recommendation = getOverallRecommendation();
              return (
                <div className={`p-4 rounded-lg border ${recommendation.color}`}>
                  <div className="flex items-start gap-3">
                    {recommendation.level === 'high-risk' && <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                    {recommendation.level === 'proceed' && <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="font-semibold mb-1">Clinical Recommendation</p>
                      <p className="text-sm">{recommendation.text}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Risk Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* RCRI Card */}
              <div className={`p-4 rounded-lg border ${rcriInterpretation.color}`}>
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wide opacity-75">RCRI (Lee Index)</p>
                  <p className="text-3xl font-bold mt-1">{rcriScore}/6</p>
                  <p className="text-sm font-semibold">Class {rcriInterpretation.class}</p>
                  <p className="text-xs mt-1">Risk: {rcriInterpretation.risk}</p>
                  <p className="text-xs opacity-75">{rcriInterpretation.description}</p>
                </div>
              </div>

              {/* Gupta MICA Card */}
              {guptaRisk !== null && guptaCategory && (
                <div className={`p-4 rounded-lg border ${guptaCategory.color}`}>
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wide opacity-75">Gupta MICA</p>
                    <p className="text-3xl font-bold mt-1">{guptaRisk.toFixed(2)}%</p>
                    <p className="text-sm font-semibold">{guptaCategory.category} Risk</p>
                    <p className="text-xs mt-1 opacity-75">30-day MI/Cardiac Arrest</p>
                  </div>
                </div>
              )}

              {/* METs Card */}
              {metsValue !== null && (
                <div className={`p-4 rounded-lg border ${hasPoorFunctionalCapacity ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wide opacity-75">Functional Capacity</p>
                    <p className="text-3xl font-bold mt-1">{metsValue >= 10 ? '≥10' : metsValue} METs</p>
                    <p className="text-sm font-semibold">{hasPoorFunctionalCapacity ? 'Poor' : 'Adequate'}</p>
                    <p className="text-xs mt-1 opacity-75">{hasPoorFunctionalCapacity ? 'Consider stress testing' : 'Favorable prognosis'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ACC/AHA Stepwise Summary */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="font-semibold text-sm text-indigo-800 mb-2">ACC/AHA 2014 Stepwise Assessment</p>
              <ol className="text-xs text-indigo-700 space-y-1 list-decimal ml-4">
                <li>Surgery Risk: {surgeryRiskCategories[surgeryRisk as keyof typeof surgeryRiskCategories]?.label || 'Not specified'}</li>
                <li>RCRI Score: {rcriScore} point{rcriScore !== 1 ? 's' : ''} → Class {rcriInterpretation.class} ({rcriInterpretation.risk} risk)</li>
                <li>Gupta MICA: {guptaRisk !== null ? `${guptaRisk.toFixed(2)}%` : 'Incomplete data'}</li>
                <li>Functional Capacity: {metsValue !== null ? `${metsValue} METs (${hasPoorFunctionalCapacity ? '<4, poor' : '≥4, adequate'})` : 'Not assessed'}</li>
              </ol>
            </div>

            {/* Risk Factor Summary */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold text-sm mb-2">Identified Risk Factors</p>
              <ul className="text-xs space-y-1">
                {rcriCriteria.filter(c => rcriAnswers[c.id]).map(c => (
                  <li key={c.id}>• {c.label}</li>
                ))}
                {surgeryRisk === 'high' && <li>• High-risk surgery</li>}
                {parseFloat(creatinine) > 1.5 && <li>• Elevated creatinine (&gt;1.5 mg/dL)</li>}
                {functionalStatus !== 'independent' && <li>• {functionalStatus === 'partially_dependent' ? 'Partially' : 'Totally'} dependent functional status</li>}
                {parseInt(asaClass) >= 3 && <li>• ASA Class {asaClass}</li>}
                {rcriCriteria.filter(c => rcriAnswers[c.id]).length === 0 && surgeryRisk !== 'high' && (
                  <li className="text-muted-foreground">No major clinical risk factors identified</li>
                )}
              </ul>
            </div>

            {/* References */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-sm text-blue-800 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                References
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Lee TH et al. Circulation 1999;100:1043-1049 (RCRI/Lee Index)</li>
                <li>• Gupta PK et al. Circulation 2011;124:381-387 (MICA Calculator)</li>
                <li>• Fleisher LA et al. Circulation 2014;130:e278-e333 (ACC/AHA Guidelines)</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreoperativeEvaluationSummary;
