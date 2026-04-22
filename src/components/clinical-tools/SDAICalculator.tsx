import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Info } from 'lucide-react';

const SDAICalculator: React.FC = () => {
  const [tenderJoints, setTenderJoints] = useState('');
  const [swollenJoints, setSwollenJoints] = useState('');
  const [patientGlobal, setPatientGlobal] = useState<number[]>([0]);
  const [physicianGlobal, setPhysicianGlobal] = useState<number[]>([0]);
  const [crp, setCrp] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateSDAI = () => {
    const tj = parseFloat(tenderJoints) || 0;
    const sj = parseFloat(swollenJoints) || 0;
    const pg = patientGlobal[0];
    const phg = physicianGlobal[0];
    const crpVal = parseFloat(crp) || 0;

    // SDAI = TJC28 + SJC28 + PtGA (0-10) + PhGA (0-10) + CRP (mg/dL)
    return tj + sj + pg + phg + crpVal;
  };

  const getInterpretation = (score: number) => {
    if (score <= 3.3) {
      return {
        level: 'Remission',
        description: 'Disease is in remission',
        colorClass: 'bg-green-100 border-green-200 text-green-800'
      };
    } else if (score <= 11) {
      return {
        level: 'Low Disease Activity',
        description: 'Low disease activity - continue current therapy with monitoring',
        colorClass: 'bg-blue-100 border-blue-200 text-blue-800'
      };
    } else if (score <= 26) {
      return {
        level: 'Moderate Disease Activity',
        description: 'Moderate activity - consider adjusting therapy',
        colorClass: 'bg-yellow-100 border-yellow-200 text-yellow-800'
      };
    } else {
      return {
        level: 'High Disease Activity',
        description: 'High disease activity - therapy escalation recommended',
        colorClass: 'bg-red-100 border-red-200 text-red-800'
      };
    }
  };

  const sdai = calculateSDAI();
  const interpretation = getInterpretation(sdai);

  const resetForm = () => {
    setTenderJoints('');
    setSwollenJoints('');
    setPatientGlobal([0]);
    setPhysicianGlobal([0]);
    setCrp('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Simple Disease Activity Index (SDAI)</CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Composite measure for rheumatoid arthritis disease activity assessment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            SDAI combines joint counts, patient and physician assessments, and CRP for a comprehensive disease activity measure.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tender">Tender Joint Count (TJC28)</Label>
            <Input
              id="tender"
              type="number"
              min="0"
              max="28"
              value={tenderJoints}
              onChange={(e) => setTenderJoints(e.target.value)}
              placeholder="0-28"
            />
            <p className="text-xs text-muted-foreground mt-1">28-joint count</p>
          </div>
          <div>
            <Label htmlFor="swollen">Swollen Joint Count (SJC28)</Label>
            <Input
              id="swollen"
              type="number"
              min="0"
              max="28"
              value={swollenJoints}
              onChange={(e) => setSwollenJoints(e.target.value)}
              placeholder="0-28"
            />
            <p className="text-xs text-muted-foreground mt-1">28-joint count</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Patient Global Assessment (PtGA): {patientGlobal[0].toFixed(1)} cm</Label>
            <Slider
              value={patientGlobal}
              onValueChange={setPatientGlobal}
              max={10}
              step={0.5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 = Best</span>
              <span>10 = Worst</span>
            </div>
          </div>
          <div>
            <Label>Physician Global Assessment (PhGA): {physicianGlobal[0].toFixed(1)} cm</Label>
            <Slider
              value={physicianGlobal}
              onValueChange={setPhysicianGlobal}
              max={10}
              step={0.5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 = Best</span>
              <span>10 = Worst</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="crp">CRP (mg/dL)</Label>
          <Input
            id="crp"
            type="number"
            step="0.1"
            value={crp}
            onChange={(e) => setCrp(e.target.value)}
            placeholder="e.g., 1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">Note: Enter CRP in mg/dL (not mg/L)</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">Calculate SDAI</Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
            <div className="text-center">
              <p className="text-4xl font-bold">{sdai.toFixed(1)}</p>
              <p className="text-sm font-semibold mt-1">SDAI Score</p>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-current/20">
              <p className="text-xl font-bold">{interpretation.level}</p>
              <p className="text-sm mt-1">{interpretation.description}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">SDAI Thresholds:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="p-2 bg-green-100 rounded text-green-800 text-center">
              <p className="font-bold">≤3.3</p>
              <p className="text-xs">Remission</p>
            </div>
            <div className="p-2 bg-blue-100 rounded text-blue-800 text-center">
              <p className="font-bold">3.4-11</p>
              <p className="text-xs">Low</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded text-yellow-800 text-center">
              <p className="font-bold">11.1-26</p>
              <p className="text-xs">Moderate</p>
            </div>
            <div className="p-2 bg-red-100 rounded text-red-800 text-center">
              <p className="font-bold">&gt;26</p>
              <p className="text-xs">High</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Pearl</p>
            <p className="mt-1">SDAI is recommended by ACR/EULAR as a treat-to-target measure. Unlike CDAI, it includes CRP for objective inflammation assessment.</p>
            <p className="mt-2 text-xs">Reference: Smolen JS et al. Ann Rheum Dis 2003;62(8):789-794</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SDAICalculator;
