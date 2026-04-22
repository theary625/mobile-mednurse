import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Activity, Info, AlertTriangle } from 'lucide-react';

interface qSOFAResult {
  total: number;
  interpretation: string;
  mortality: string;
  severity: 'low' | 'moderate' | 'high';
  recommendation: string;
}

const QSOFACalculator = () => {
  const [alteredMentation, setAlteredMentation] = useState(false);
  const [respiratoryRate, setRespiratoryRate] = useState(false);
  const [systolicBP, setSystolicBP] = useState(false);

  const calculateResult = (): qSOFAResult => {
    const total = (alteredMentation ? 1 : 0) + (respiratoryRate ? 1 : 0) + (systolicBP ? 1 : 0);
    
    let interpretation: string;
    let mortality: string;
    let severity: 'low' | 'moderate' | 'high';
    let recommendation: string;

    if (total < 2) {
      interpretation = 'Low risk - qSOFA negative';
      mortality = '~3%';
      severity = 'low';
      recommendation = 'Continue to monitor. Consider SIRS criteria if infection suspected.';
    } else if (total === 2) {
      interpretation = 'Moderate risk - qSOFA positive';
      mortality = '~24%';
      severity = 'moderate';
      recommendation = 'High risk of sepsis. Obtain lactate, blood cultures. Consider early antibiotics.';
    } else {
      interpretation = 'High risk - qSOFA positive';
      mortality = '~40%';
      severity = 'high';
      recommendation = 'High mortality risk. Urgent sepsis workup. Early goal-directed therapy.';
    }

    return { total, interpretation, mortality, severity, recommendation };
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
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <CardTitle className="text-lg">qSOFA (Quick SOFA)</CardTitle>
            <CardDescription>Bedside sepsis screening for patients with suspected infection</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Criteria */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <Checkbox 
              id="mentation" 
              checked={alteredMentation}
              onCheckedChange={(checked) => setAlteredMentation(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="mentation" className="text-sm font-medium cursor-pointer">
                Altered Mental Status
              </Label>
              <p className="text-xs text-muted-foreground">
                GCS &lt; 15 or any acute change in mental status
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <Checkbox 
              id="rr" 
              checked={respiratoryRate}
              onCheckedChange={(checked) => setRespiratoryRate(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="rr" className="text-sm font-medium cursor-pointer">
                Respiratory Rate ≥ 22/min
              </Label>
              <p className="text-xs text-muted-foreground">
                Tachypnea indicating respiratory compensation
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <Checkbox 
              id="sbp" 
              checked={systolicBP}
              onCheckedChange={(checked) => setSystolicBP(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="sbp" className="text-sm font-medium cursor-pointer">
                Systolic BP ≤ 100 mmHg
              </Label>
              <p className="text-xs text-muted-foreground">
                Hypotension suggesting cardiovascular dysfunction
              </p>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className={`p-4 rounded-lg border-2 ${getSeverityColor(result.severity)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">qSOFA Score</span>
            <Badge variant="outline" className={getSeverityColor(result.severity)}>
              Mortality: {result.mortality}
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-2">{result.total}/3</div>
          <p className="text-sm opacity-80 mb-2">{result.interpretation}</p>
          {result.total >= 2 && (
            <div className="flex items-start gap-2 text-sm mt-2 p-2 bg-background/50 rounded">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{result.recommendation}</span>
            </div>
          )}
        </div>

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>Score ≥ 2:</strong> Associated with poor outcomes in patients with suspected infection</p>
            <p className="mt-1"><strong>Note:</strong> qSOFA is for bedside screening; full SOFA score needed for sepsis diagnosis</p>
            <p className="mt-1"><strong>Sepsis-3:</strong> Suspected infection + SOFA ≥ 2 = Sepsis</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QSOFACalculator;
