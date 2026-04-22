import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, AlertTriangle } from 'lucide-react';

interface ICHResult {
  total: number;
  mortality30Day: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

const gcsOptions = [
  { value: 0, label: 'GCS 13-15 (0 points)' },
  { value: 1, label: 'GCS 5-12 (1 point)' },
  { value: 2, label: 'GCS 3-4 (2 points)' },
];

const ageOptions = [
  { value: 0, label: 'Age < 80 years (0 points)' },
  { value: 1, label: 'Age ≥ 80 years (1 point)' },
];

const volumeOptions = [
  { value: 0, label: 'ICH Volume < 30 mL (0 points)' },
  { value: 1, label: 'ICH Volume ≥ 30 mL (1 point)' },
];

const ivhOptions = [
  { value: 0, label: 'No IVH (0 points)' },
  { value: 1, label: 'IVH present (1 point)' },
];

const locationOptions = [
  { value: 0, label: 'Supratentorial (0 points)' },
  { value: 1, label: 'Infratentorial (1 point)' },
];

const ICHScoreCalculator = () => {
  const [gcs, setGcs] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [ivh, setIvh] = useState<number | null>(null);
  const [location, setLocation] = useState<number | null>(null);

  const calculateResult = (): ICHResult | null => {
    if (gcs === null || age === null || volume === null || ivh === null || location === null) return null;
    
    const total = gcs + age + volume + ivh + location;
    let mortality30Day: string;
    let severity: 'low' | 'moderate' | 'high' | 'critical';

    switch (total) {
      case 0:
        mortality30Day = '0%';
        severity = 'low';
        break;
      case 1:
        mortality30Day = '13%';
        severity = 'low';
        break;
      case 2:
        mortality30Day = '26%';
        severity = 'moderate';
        break;
      case 3:
        mortality30Day = '72%';
        severity = 'high';
        break;
      case 4:
        mortality30Day = '97%';
        severity = 'critical';
        break;
      case 5:
      case 6:
        mortality30Day = '100%';
        severity = 'critical';
        break;
      default:
        mortality30Day = 'N/A';
        severity = 'low';
    }

    return { total, mortality30Day, severity };
  };

  const result = calculateResult();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success/10 border-success/30 text-success';
      case 'moderate': return 'bg-warning/10 border-warning/30 text-warning';
      case 'high': return 'bg-orange-500/10 border-orange-500/30 text-orange-600';
      case 'critical': return 'bg-destructive/10 border-destructive/30 text-destructive';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg">ICH Score</CardTitle>
            <CardDescription>Predicts 30-day mortality in intracerebral hemorrhage</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GCS */}
        <div>
          <Label className="text-sm font-medium">Glasgow Coma Scale</Label>
          <Select value={gcs?.toString()} onValueChange={(v) => setGcs(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select GCS range" />
            </SelectTrigger>
            <SelectContent>
              {gcsOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Age */}
        <div>
          <Label className="text-sm font-medium">Age</Label>
          <Select value={age?.toString()} onValueChange={(v) => setAge(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select age range" />
            </SelectTrigger>
            <SelectContent>
              {ageOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ICH Volume */}
        <div>
          <Label className="text-sm font-medium">ICH Volume (ABC/2 method)</Label>
          <Select value={volume?.toString()} onValueChange={(v) => setVolume(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select volume range" />
            </SelectTrigger>
            <SelectContent>
              {volumeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* IVH */}
        <div>
          <Label className="text-sm font-medium">Intraventricular Hemorrhage (IVH)</Label>
          <Select value={ivh?.toString()} onValueChange={(v) => setIvh(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select IVH status" />
            </SelectTrigger>
            <SelectContent>
              {ivhOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <Label className="text-sm font-medium">ICH Origin</Label>
          <Select value={location?.toString()} onValueChange={(v) => setLocation(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((opt) => (
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
              <span className="text-sm font-medium">ICH Score</span>
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                30-Day Mortality: {result.mortality30Day}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{result.total}/6</div>
            {result.total >= 4 && (
              <div className="flex items-center gap-2 text-sm opacity-80">
                <AlertTriangle className="w-4 h-4" />
                Consider goals of care discussion
              </div>
            )}
          </div>
        )}

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>0:</strong> 0% mortality</p>
            <p><strong>1:</strong> 13% mortality</p>
            <p><strong>2:</strong> 26% mortality</p>
            <p><strong>3:</strong> 72% mortality</p>
            <p><strong>4:</strong> 97% mortality</p>
            <p><strong>5-6:</strong> 100% mortality</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ICHScoreCalculator;
