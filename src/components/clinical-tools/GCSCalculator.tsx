import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Info } from 'lucide-react';

interface GCSResult {
  total: number;
  eye: number;
  verbal: number;
  motor: number;
  interpretation: string;
  severity: 'mild' | 'moderate' | 'severe';
}

const eyeOptions = [
  { value: 4, label: '4 - Spontaneous' },
  { value: 3, label: '3 - To verbal command' },
  { value: 2, label: '2 - To pain' },
  { value: 1, label: '1 - No response' },
];

const verbalOptions = [
  { value: 5, label: '5 - Oriented' },
  { value: 4, label: '4 - Confused' },
  { value: 3, label: '3 - Inappropriate words' },
  { value: 2, label: '2 - Incomprehensible sounds' },
  { value: 1, label: '1 - No response' },
];

const motorOptions = [
  { value: 6, label: '6 - Obeys commands' },
  { value: 5, label: '5 - Localizes pain' },
  { value: 4, label: '4 - Withdraws from pain' },
  { value: 3, label: '3 - Abnormal flexion' },
  { value: 2, label: '2 - Extension' },
  { value: 1, label: '1 - No response' },
];

const GCSCalculator = () => {
  const [eye, setEye] = useState<number | null>(null);
  const [verbal, setVerbal] = useState<number | null>(null);
  const [motor, setMotor] = useState<number | null>(null);

  const calculateResult = (): GCSResult | null => {
    if (eye === null || verbal === null || motor === null) return null;
    
    const total = eye + verbal + motor;
    let interpretation: string;
    let severity: 'mild' | 'moderate' | 'severe';

    if (total >= 13) {
      interpretation = 'Mild brain injury';
      severity = 'mild';
    } else if (total >= 9) {
      interpretation = 'Moderate brain injury';
      severity = 'moderate';
    } else {
      interpretation = 'Severe brain injury (Coma)';
      severity = 'severe';
    }

    return { total, eye, verbal, motor, interpretation, severity };
  };

  const result = calculateResult();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-success/10 border-success/30 text-success';
      case 'moderate': return 'bg-warning/10 border-warning/30 text-warning';
      case 'severe': return 'bg-destructive/10 border-destructive/30 text-destructive';
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
            <CardTitle className="text-lg">Glasgow Coma Scale (GCS)</CardTitle>
            <CardDescription>Assess level of consciousness</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Eye Opening */}
        <div>
          <Label className="text-sm font-medium">Eye Opening (E)</Label>
          <Select value={eye?.toString()} onValueChange={(v) => setEye(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select response" />
            </SelectTrigger>
            <SelectContent>
              {eyeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verbal Response */}
        <div>
          <Label className="text-sm font-medium">Verbal Response (V)</Label>
          <Select value={verbal?.toString()} onValueChange={(v) => setVerbal(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select response" />
            </SelectTrigger>
            <SelectContent>
              {verbalOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Motor Response */}
        <div>
          <Label className="text-sm font-medium">Motor Response (M)</Label>
          <Select value={motor?.toString()} onValueChange={(v) => setMotor(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select response" />
            </SelectTrigger>
            <SelectContent>
              {motorOptions.map((opt) => (
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
              <span className="text-sm font-medium">GCS Score</span>
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                {result.interpretation}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{result.total}/15</div>
            <div className="text-sm opacity-80">
              E{result.eye} + V{result.verbal} + M{result.motor}
            </div>
          </div>
        )}

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>13-15:</strong> Mild injury</p>
            <p><strong>9-12:</strong> Moderate injury</p>
            <p><strong>3-8:</strong> Severe injury (Coma)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GCSCalculator;
