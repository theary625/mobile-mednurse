import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Info } from 'lucide-react';

interface LAMSResult {
  total: number;
  interpretation: string;
  severity: 'low' | 'moderate' | 'high';
  lvoLikelihood: string;
}

const facialDroopOptions = [
  { value: 0, label: '0 - Absent' },
  { value: 1, label: '1 - Present' },
];

const armDriftOptions = [
  { value: 0, label: '0 - Absent' },
  { value: 1, label: '1 - Drifts down' },
  { value: 2, label: '2 - Falls rapidly' },
];

const gripStrengthOptions = [
  { value: 0, label: '0 - Normal' },
  { value: 1, label: '1 - Weak grip' },
  { value: 2, label: '2 - No grip' },
];

const LAMSCalculator = () => {
  const [facialDroop, setFacialDroop] = useState<number | null>(null);
  const [armDrift, setArmDrift] = useState<number | null>(null);
  const [gripStrength, setGripStrength] = useState<number | null>(null);

  const calculateResult = (): LAMSResult | null => {
    if (facialDroop === null || armDrift === null || gripStrength === null) return null;
    
    const total = facialDroop + armDrift + gripStrength;
    let interpretation: string;
    let severity: 'low' | 'moderate' | 'high';
    let lvoLikelihood: string;

    if (total <= 2) {
      interpretation = 'Low probability of LVO';
      severity = 'low';
      lvoLikelihood = '~10%';
    } else if (total <= 3) {
      interpretation = 'Moderate probability of LVO';
      severity = 'moderate';
      lvoLikelihood = '~40%';
    } else {
      interpretation = 'High probability of LVO';
      severity = 'high';
      lvoLikelihood = '~80%';
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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">LAMS (Los Angeles Motor Scale)</CardTitle>
            <CardDescription>Prehospital screen for large vessel occlusion stroke</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Facial Droop */}
        <div>
          <Label className="text-sm font-medium">Facial Droop</Label>
          <Select value={facialDroop?.toString()} onValueChange={(v) => setFacialDroop(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select finding" />
            </SelectTrigger>
            <SelectContent>
              {facialDroopOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Arm Drift */}
        <div>
          <Label className="text-sm font-medium">Arm Drift</Label>
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

        {/* Grip Strength */}
        <div>
          <Label className="text-sm font-medium">Grip Strength</Label>
          <Select value={gripStrength?.toString()} onValueChange={(v) => setGripStrength(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select finding" />
            </SelectTrigger>
            <SelectContent>
              {gripStrengthOptions.map((opt) => (
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
              <span className="text-sm font-medium">LAMS Score</span>
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                LVO Likelihood: {result.lvoLikelihood}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{result.total}/5</div>
            <div className="text-sm opacity-80">
              {result.interpretation}
            </div>
          </div>
        )}

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>0-2:</strong> Low LVO probability (~10%)</p>
            <p><strong>3:</strong> Moderate LVO probability (~40%)</p>
            <p><strong>4-5:</strong> High LVO probability (~80%) - Consider thrombectomy-capable center</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LAMSCalculator;
