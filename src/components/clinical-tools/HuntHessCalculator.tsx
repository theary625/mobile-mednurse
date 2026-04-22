import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, AlertTriangle } from 'lucide-react';

interface HuntHessResult {
  grade: number;
  description: string;
  surgicalRisk: string;
  mortality: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

const gradeOptions = [
  { 
    value: 1, 
    label: 'Grade 1: Asymptomatic or mild headache, slight nuchal rigidity',
    description: 'Asymptomatic or mild headache and slight nuchal rigidity',
    surgicalRisk: 'Low',
    mortality: '~1%'
  },
  { 
    value: 2, 
    label: 'Grade 2: Moderate-severe headache, nuchal rigidity, CN palsy',
    description: 'Moderate to severe headache, nuchal rigidity, no neurological deficit except cranial nerve palsy',
    surgicalRisk: 'Low',
    mortality: '~5%'
  },
  { 
    value: 3, 
    label: 'Grade 3: Drowsy, confusion, mild focal deficit',
    description: 'Drowsiness, confusion, or mild focal neurological deficit',
    surgicalRisk: 'Moderate',
    mortality: '~15-20%'
  },
  { 
    value: 4, 
    label: 'Grade 4: Stupor, moderate-severe hemiparesis, decerebrate rigidity',
    description: 'Stupor, moderate to severe hemiparesis, possible early decerebrate rigidity',
    surgicalRisk: 'High',
    mortality: '~30-40%'
  },
  { 
    value: 5, 
    label: 'Grade 5: Coma, decerebrate rigidity, moribund',
    description: 'Deep coma, decerebrate rigidity, moribund appearance',
    surgicalRisk: 'Very High',
    mortality: '~50-70%'
  },
];

const HuntHessCalculator = () => {
  const [grade, setGrade] = useState<number | null>(null);

  const calculateResult = (): HuntHessResult | null => {
    if (grade === null) return null;
    
    const selected = gradeOptions.find(opt => opt.value === grade);
    if (!selected) return null;

    let severity: 'low' | 'moderate' | 'high' | 'critical';
    switch (grade) {
      case 1:
      case 2:
        severity = 'low';
        break;
      case 3:
        severity = 'moderate';
        break;
      case 4:
        severity = 'high';
        break;
      case 5:
        severity = 'critical';
        break;
      default:
        severity = 'low';
    }

    return { 
      grade, 
      description: selected.description,
      surgicalRisk: selected.surgicalRisk,
      mortality: selected.mortality,
      severity 
    };
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
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Hunt & Hess Scale</CardTitle>
            <CardDescription>Classification of subarachnoid hemorrhage severity</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grade Selection */}
        <div>
          <Label className="text-sm font-medium">Clinical Grade</Label>
          <Select value={grade?.toString()} onValueChange={(v) => setGrade(parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select clinical presentation" />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((opt) => (
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
              <span className="text-sm font-medium">Hunt & Hess Grade</span>
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                Surgical Risk: {result.surgicalRisk}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">Grade {result.grade}</div>
            <p className="text-sm opacity-80 mb-2">{result.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <span>Estimated Mortality: {result.mortality}</span>
            </div>
            {result.grade >= 4 && (
              <div className="flex items-center gap-2 text-sm mt-2 opacity-80">
                <AlertTriangle className="w-4 h-4" />
                Poor-grade SAH - Consider early intervention vs. goals of care
              </div>
            )}
          </div>
        )}

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>Grade 1-2:</strong> Good grade - Early surgical intervention recommended</p>
            <p><strong>Grade 3:</strong> Intermediate - Case-by-case decision</p>
            <p><strong>Grade 4-5:</strong> Poor grade - High surgical risk, delayed intervention may be considered</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HuntHessCalculator;
