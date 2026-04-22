import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Beaker, RotateCcw, Info, AlertTriangle } from 'lucide-react';

const MDRDCalculator = () => {
  const [creatinine, setCreatinine] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [race, setRace] = useState<string>('');

  // 4-variable MDRD: 175 × (SCr)^-1.154 × (Age)^-0.203 × 0.742 [if female] × 1.212 [if Black]
  const calculateMDRD = () => {
    const scr = parseFloat(creatinine);
    const ageVal = parseFloat(age);
    
    if (scr > 0 && ageVal > 0 && sex && race) {
      let gfr = 175 * Math.pow(scr, -1.154) * Math.pow(ageVal, -0.203);
      
      if (sex === 'female') {
        gfr *= 0.742;
      }
      
      if (race === 'black') {
        gfr *= 1.212;
      }
      
      return gfr;
    }
    return null;
  };

  const gfr = calculateMDRD();

  const getCKDStage = (gfr: number) => {
    if (gfr >= 90) return { 
      stage: 'G1', 
      description: 'Normal or High',
      color: 'text-green-600', 
      bg: 'bg-green-100'
    };
    if (gfr >= 60) return { 
      stage: 'G2', 
      description: 'Mildly Decreased',
      color: 'text-green-600', 
      bg: 'bg-green-100'
    };
    if (gfr >= 45) return { 
      stage: 'G3a', 
      description: 'Mild-Moderate Decrease',
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100'
    };
    if (gfr >= 30) return { 
      stage: 'G3b', 
      description: 'Moderate-Severe Decrease',
      color: 'text-orange-600', 
      bg: 'bg-orange-100'
    };
    if (gfr >= 15) return { 
      stage: 'G4', 
      description: 'Severely Decreased',
      color: 'text-red-500', 
      bg: 'bg-red-100'
    };
    return { 
      stage: 'G5', 
      description: 'Kidney Failure',
      color: 'text-destructive', 
      bg: 'bg-destructive/10'
    };
  };

  const reset = () => {
    setCreatinine('');
    setAge('');
    setSex('');
    setRace('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Beaker className="h-6 w-6" />
          MDRD GFR Calculator
        </CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          4-Variable MDRD Equation
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
            <Input
              id="creatinine"
              type="number"
              step="0.1"
              placeholder="1.0"
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              placeholder="65"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sex</Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Race</Label>
            <Select value={race} onValueChange={setRace}>
              <SelectTrigger>
                <SelectValue placeholder="Select race" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="other">Non-Black</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {gfr !== null && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${getCKDStage(gfr).bg} text-center`}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Estimated GFR</p>
              <p className="text-4xl font-bold">{gfr.toFixed(0)} mL/min/1.73m²</p>
              <p className={`font-semibold mt-1 ${getCKDStage(gfr).color}`}>
                CKD Stage {getCKDStage(gfr).stage}
              </p>
              <p className="text-sm text-muted-foreground">
                {getCKDStage(gfr).description}
              </p>
            </div>
          </div>
        )}

        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Limitations</p>
            <p className="text-xs mt-1">
              CKD-EPI (2021) is now preferred. MDRD underestimates GFR in healthy patients and at higher GFR values.
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">MDRD Formula</p>
              <p className="mt-1 font-mono text-xs">
                GFR = 175 × SCr^-1.154 × Age^-0.203 × 0.742 [female] × 1.212 [Black]
              </p>
              <div className="mt-2 text-xs">
                <p className="font-medium">CKD Stages by GFR:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• G1: ≥90 (Normal)</li>
                  <li>• G2: 60-89 (Mildly ↓)</li>
                  <li>• G3a: 45-59 (Mild-Mod ↓)</li>
                  <li>• G3b: 30-44 (Mod-Severe ↓)</li>
                  <li>• G4: 15-29 (Severely ↓)</li>
                  <li>• G5: &lt;15 (Kidney Failure)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MDRDCalculator;