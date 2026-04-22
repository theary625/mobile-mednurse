import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Ambulance, Info, Calculator } from 'lucide-react';

// RTS Component
const RTSCalculator = ({ onScoreChange }: { onScoreChange?: (score: number) => void }) => {
  const [gcs, setGcs] = useState<string>('');
  const [sbp, setSbp] = useState<string>('');
  const [rr, setRr] = useState<string>('');

  const getGCSCode = (score: number) => {
    if (score >= 13) return 4;
    if (score >= 9) return 3;
    if (score >= 6) return 2;
    if (score >= 4) return 1;
    return 0;
  };

  const getSBPCode = (pressure: number) => {
    if (pressure > 89) return 4;
    if (pressure >= 76) return 3;
    if (pressure >= 50) return 2;
    if (pressure >= 1) return 1;
    return 0;
  };

  const getRRCode = (rate: number) => {
    if (rate >= 10 && rate <= 29) return 4;
    if (rate > 29) return 3;
    if (rate >= 6 && rate <= 9) return 2;
    if (rate >= 1 && rate <= 5) return 1;
    return 0;
  };

  const gcsNum = parseInt(gcs) || 0;
  const sbpNum = parseInt(sbp) || 0;
  const rrNum = parseInt(rr) || 0;

  const gcsCode = getGCSCode(gcsNum);
  const sbpCode = getSBPCode(sbpNum);
  const rrCode = getRRCode(rrNum);

  // RTS = 0.9368 GCS + 0.7326 SBP + 0.2908 RR
  const rtsScore = gcs && sbp && rr 
    ? (0.9368 * gcsCode + 0.7326 * sbpCode + 0.2908 * rrCode).toFixed(3)
    : null;

  useEffect(() => {
    if (rtsScore && onScoreChange) {
      onScoreChange(parseFloat(rtsScore));
    }
  }, [rtsScore, onScoreChange]);

  const getSurvivalProbability = (score: number) => {
    if (score >= 7.84) return '>96%';
    if (score >= 6) return '60-90%';
    if (score >= 4) return '30-60%';
    if (score >= 2) return '10-30%';
    return '<10%';
  };

  const getInterpretation = (score: number) => {
    if (score >= 7.84) return { text: 'Minor injury', color: 'bg-green-500' };
    if (score >= 6) return { text: 'Moderate injury', color: 'bg-yellow-500' };
    if (score >= 4) return { text: 'Serious injury', color: 'bg-orange-500' };
    return { text: 'Severe/Critical injury', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Glasgow Coma Scale (3-15)</Label>
          <Input
            type="number"
            min="3"
            max="15"
            placeholder="Enter GCS score"
            value={gcs}
            onChange={(e) => setGcs(e.target.value)}
          />
          {gcs && <Badge variant="outline">Code: {gcsCode}</Badge>}
        </div>

        <div className="space-y-2">
          <Label>Systolic Blood Pressure (mmHg)</Label>
          <Input
            type="number"
            min="0"
            placeholder="Enter SBP"
            value={sbp}
            onChange={(e) => setSbp(e.target.value)}
          />
          {sbp && <Badge variant="outline">Code: {sbpCode}</Badge>}
        </div>

        <div className="space-y-2">
          <Label>Respiratory Rate (breaths/min)</Label>
          <Input
            type="number"
            min="0"
            placeholder="Enter RR"
            value={rr}
            onChange={(e) => setRr(e.target.value)}
          />
          {rr && <Badge variant="outline">Code: {rrCode}</Badge>}
        </div>
      </div>

      {rtsScore && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">RTS Score:</span>
            <Badge className={`text-lg px-4 py-1 ${getInterpretation(parseFloat(rtsScore)).color}`}>
              {rtsScore}
            </Badge>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Interpretation:</span>
              <span>{getInterpretation(parseFloat(rtsScore)).text}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Survival Probability:</span>
              <span>{getSurvivalProbability(parseFloat(rtsScore))}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200">
        <p><strong>Formula:</strong> RTS = 0.9368(GCS) + 0.7326(SBP) + 0.2908(RR)</p>
        <p className="mt-1">Score range: 0-7.8408. Higher scores indicate better prognosis.</p>
      </div>
    </div>
  );
};

// ISS Component
const ISSCalculator = ({ onScoreChange }: { onScoreChange?: (score: number) => void }) => {
  const [regions, setRegions] = useState({
    headNeck: '0',
    face: '0',
    chest: '0',
    abdomen: '0',
    extremity: '0',
    external: '0',
  });

  const aisOptions = [
    { value: '0', label: '0 - No injury' },
    { value: '1', label: '1 - Minor' },
    { value: '2', label: '2 - Moderate' },
    { value: '3', label: '3 - Serious' },
    { value: '4', label: '4 - Severe' },
    { value: '5', label: '5 - Critical' },
    { value: '6', label: '6 - Unsurvivable' },
  ];

  const regionLabels = {
    headNeck: 'Head/Neck',
    face: 'Face',
    chest: 'Chest',
    abdomen: 'Abdomen/Pelvis',
    extremity: 'Extremity/Pelvis',
    external: 'External/Skin',
  };

  const scores = Object.values(regions).map(v => parseInt(v));
  const hasUnsurvivable = scores.includes(6);
  
  // Get top 3 highest scores
  const sortedScores = [...scores].sort((a, b) => b - a);
  const top3 = sortedScores.slice(0, 3);
  const issScore = hasUnsurvivable ? 75 : top3.reduce((sum, s) => sum + s * s, 0);

  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(issScore);
    }
  }, [issScore, onScoreChange]);

  const getInterpretation = (score: number) => {
    if (score === 75) return { text: 'Unsurvivable (AIS 6)', color: 'bg-gray-700' };
    if (score >= 25) return { text: 'Severe trauma', color: 'bg-red-500' };
    if (score >= 16) return { text: 'Major trauma', color: 'bg-orange-500' };
    if (score >= 9) return { text: 'Moderate trauma', color: 'bg-yellow-500' };
    return { text: 'Minor trauma', color: 'bg-green-500' };
  };

  const interpretation = getInterpretation(issScore);

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {Object.entries(regions).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <Label className="w-32 text-sm">{regionLabels[key as keyof typeof regionLabels]}</Label>
            <Select value={value} onValueChange={(v) => setRegions(prev => ({ ...prev, [key]: v }))}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aisOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">ISS Score:</span>
          <Badge className={`text-lg px-4 py-1 ${interpretation.color}`}>
            {issScore}/75
          </Badge>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Severity:</span>
            <Badge className={interpretation.color}>{interpretation.text}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Top 3 regions: {top3.join('² + ')}² = {issScore}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200">
        <p><strong>Formula:</strong> Sum of squares of 3 highest AIS scores</p>
        <p className="mt-1">Score range: 0-75. ISS ≥16 = major trauma, ≥25 = severe trauma</p>
      </div>
    </div>
  );
};

// TRISS Component
const TRISSCalculator = () => {
  const [rts, setRts] = useState<string>('');
  const [iss, setIss] = useState<string>('');
  const [age, setAge] = useState<'under55' | '55plus'>('under55');
  const [mechanism, setMechanism] = useState<'blunt' | 'penetrating'>('blunt');

  const rtsNum = parseFloat(rts) || 0;
  const issNum = parseInt(iss) || 0;
  const ageCode = age === 'under55' ? 0 : 1;

  // Coefficients for blunt and penetrating trauma
  const coefficients = {
    blunt: { b0: -0.4499, b1: 0.8085, b2: -0.0835, b3: -1.7430 },
    penetrating: { b0: -2.5355, b1: 0.9934, b2: -0.0651, b3: -1.1360 },
  };

  const c = coefficients[mechanism];
  const b = c.b0 + c.b1 * rtsNum + c.b2 * issNum + c.b3 * ageCode;
  const survivalProbability = rts && iss ? (1 / (1 + Math.exp(-b)) * 100).toFixed(1) : null;

  const getInterpretation = (prob: number) => {
    if (prob >= 90) return { text: 'Excellent prognosis', color: 'bg-green-500' };
    if (prob >= 75) return { text: 'Good prognosis', color: 'bg-lime-500' };
    if (prob >= 50) return { text: 'Moderate prognosis', color: 'bg-yellow-500' };
    if (prob >= 25) return { text: 'Poor prognosis', color: 'bg-orange-500' };
    return { text: 'Very poor prognosis', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>RTS Score (0-7.84)</Label>
          <Input
            type="number"
            step="0.001"
            min="0"
            max="7.84"
            placeholder="Enter RTS from RTS tab"
            value={rts}
            onChange={(e) => setRts(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>ISS Score (0-75)</Label>
          <Input
            type="number"
            min="0"
            max="75"
            placeholder="Enter ISS from ISS tab"
            value={iss}
            onChange={(e) => setIss(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Age Category</Label>
          <RadioGroup value={age} onValueChange={(v) => setAge(v as 'under55' | '55plus')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under55" id="under55" />
              <Label htmlFor="under55">Under 55 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="55plus" id="55plus" />
              <Label htmlFor="55plus">55 years or older</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Injury Mechanism</Label>
          <RadioGroup value={mechanism} onValueChange={(v) => setMechanism(v as 'blunt' | 'penetrating')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blunt" id="blunt" />
              <Label htmlFor="blunt">Blunt trauma</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="penetrating" id="penetrating" />
              <Label htmlFor="penetrating">Penetrating trauma</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {survivalProbability && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Survival Probability:</span>
            <Badge className={`text-lg px-4 py-1 ${getInterpretation(parseFloat(survivalProbability)).color}`}>
              {survivalProbability}%
            </Badge>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Prognosis:</span>
              <span>{getInterpretation(parseFloat(survivalProbability)).text}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {mechanism} trauma coefficients, age {age === 'under55' ? '<55' : '≥55'}
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200">
        <p><strong>TRISS</strong> combines RTS (physiologic) with ISS (anatomic) for survival prediction.</p>
        <p className="mt-1">Calculate RTS and ISS first using their respective tabs, then enter values here.</p>
      </div>
    </div>
  );
};

// Main Component
const TraumaScoresCalculator = () => {
  const [activeTab, setActiveTab] = useState('rts');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ambulance className="h-5 w-5 text-primary" />
          Trauma Scoring Tools
        </CardTitle>
        <CardDescription>
          RTS, ISS, and TRISS for trauma severity and survival prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rts" className="gap-1">
              <Calculator className="w-3 h-3" />
              RTS
            </TabsTrigger>
            <TabsTrigger value="iss" className="gap-1">
              <Calculator className="w-3 h-3" />
              ISS
            </TabsTrigger>
            <TabsTrigger value="triss" className="gap-1">
              <Calculator className="w-3 h-3" />
              TRISS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rts" className="mt-4">
            <RTSCalculator />
          </TabsContent>

          <TabsContent value="iss" className="mt-4">
            <ISSCalculator />
          </TabsContent>

          <TabsContent value="triss" className="mt-4">
            <TRISSCalculator />
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p><strong>RTS:</strong> Revised Trauma Score - physiologic assessment</p>
            <p><strong>ISS:</strong> Injury Severity Score - anatomic assessment</p>
            <p><strong>TRISS:</strong> Trauma Score - combines both for survival probability</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraumaScoresCalculator;
