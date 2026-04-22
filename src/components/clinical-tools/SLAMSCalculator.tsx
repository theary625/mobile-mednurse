import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Info } from 'lucide-react';

interface SLAMSResult {
  total: number;
  interpretation: string;
  severity: 'low' | 'moderate' | 'high';
  lvoLikelihood: string;
}

const smileGrimaceOptions = [
  { value: 0, label: '0 - Normal/symmetric' },
  { value: 1, label: '1 - Asymmetric (facial droop)' },
];

const legDriftOptions = [
  { value: 0, label: '0 - No drift' },
  { value: 1, label: '1 - Drifts but doesn\'t hit bed' },
  { value: 2, label: '2 - Drifts and hits bed or no movement' },
];

const armDriftOptions = [
  { value: 0, label: '0 - No drift' },
  { value: 1, label: '1 - Drifts but doesn\'t hit bed' },
  { value: 2, label: '2 - Drifts and hits bed or no movement' },
];

const speechOptions = [
  { value: 0, label: '0 - Normal' },
  { value: 1, label: '1 - Slurred but understandable' },
  { value: 2, label: '2 - Unintelligible or mute' },
];

const SLAMSCalculator = () => {
  const [smileGrimace, setSmileGrimace] = useState<number | null>(null);
  const [legDrift, setLegDrift] = useState<number | null>(null);
  const [armDrift, setArmDrift] = useState<number | null>(null);
  const [speech, setSpeech] = useState<number | null>(null);

  const calculateResult = (): SLAMSResult | null => {
    if (smileGrimace === null || legDrift === null || armDrift === null || speech === null) return null;
    
    const total = smileGrimace + legDrift + armDrift + speech;
    let interpretation: string;
    let severity: 'low' | 'moderate' | 'high';
    let lvoLikelihood: string;

    if (total <= 2) {
      interpretation = 'Low probability of severe stroke/LVO';
      severity = 'low';
      lvoLikelihood = 'Low';
    } else if (total <= 4) {
      interpretation = 'Moderate probability of LVO stroke';
      severity = 'moderate';
      lvoLikelihood = 'Moderate';
    } else {
      interpretation = 'High probability of LVO stroke';
      severity = 'high';
      lvoLikelihood = 'High';
    }

    return { total, interpretation, severity, lvoLikelihood };
  };

  const result = calculateResult();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success/10 border-success/30 text-success';
      case 'moderate': return 'bg-warning/10 border-warning/30 text-warning';
      case 'high': return 'bg-destructive/10 border-destructive/30 text-destructive';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-lg">SLAMS (Stroke - Leg - Arm - sMile - Speech)</CardTitle>
            <CardDescription>Prehospital stroke severity assessment</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Smile/Grimace */}
        <div>
          <Label className="text-sm font-medium">Smile/Grimace (Facial Symmetry)</Label>
          <Select value={smileGrimace?.toString()} onValueChange={(v) => setSmileGrimace(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select finding" />
            </SelectTrigger>
            <SelectContent>
              {smileGrimaceOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Leg Drift */}
        <div>
          <Label className="text-sm font-medium">Leg Drift (Weakness)</Label>
          <Select value={legDrift?.toString()} onValueChange={(v) => setLegDrift(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select finding" />
            </SelectTrigger>
            <SelectContent>
              {legDriftOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Arm Drift */}
        <div>
          <Label className="text-sm font-medium">Arm Drift (Weakness)</Label>
          <Select value={armDrift?.toString()} onValueChange={(v) => setArmDrift(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select finding" />
            </SelectTrigger>
            <SelectContent>
              {armDriftOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speech */}
        <div>
          <Label className="text-sm font-medium">Speech</Label>
          <Select value={speech?.toString()} onValueChange={(v) => setSpeech(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select finding" />
            </SelectTrigger>
            <SelectContent>
              {speechOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Result */}
        {result && (
          <div className={`p-4 rounded-lg border-2 ${getSeverityColor(result.severity)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">SLAMS Score</span>
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                LVO Likelihood: {result.lvoLikelihood}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{result.total}/7</div>
            <div className="text-sm opacity-80">
              {result.interpretation}
            </div>
          </div>
        )}

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>0-2:</strong> Low probability of LVO</p>
            <p><strong>3-4:</strong> Moderate probability - Consider comprehensive stroke center</p>
            <p><strong>5-7:</strong> High probability of LVO - Route to thrombectomy-capable center</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SLAMSCalculator;
