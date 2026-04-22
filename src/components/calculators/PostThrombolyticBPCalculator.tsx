import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info, Activity } from 'lucide-react';

interface BPRecommendation {
  status: 'safe' | 'elevated' | 'critical';
  action: string;
  medication?: string;
  frequency: string;
}

const PostThrombolyticBPCalculator = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [result, setResult] = useState<BPRecommendation | null>(null);

  const assessBP = () => {
    const sbp = parseInt(systolic);
    const dbp = parseInt(diastolic);

    if (isNaN(sbp) || isNaN(dbp)) return;

    let recommendation: BPRecommendation;

    if (sbp >= 180 || dbp >= 105) {
      recommendation = {
        status: 'critical',
        action: 'IMMEDIATE INTERVENTION REQUIRED',
        medication: 'Labetalol 10-20mg IV over 1-2 min, may repeat or Nicardipine infusion 5mg/hr, titrate by 2.5mg/hr q5-15min (max 15mg/hr)',
        frequency: 'Continuous BP monitoring'
      };
    } else if (sbp >= 140 || dbp >= 90) {
      recommendation = {
        status: 'elevated',
        action: 'CLOSE MONITORING - Consider treatment if persistent',
        medication: 'Consider Labetalol 10mg IV if SBP >150 persists',
        frequency: 'BP every 15 minutes for 2 hours'
      };
    } else {
      recommendation = {
        status: 'safe',
        action: 'TARGET ACHIEVED - Continue monitoring',
        frequency: 'BP every 15 min × 2hr, then every 30 min × 6hr, then hourly × 16hr'
      };
    }

    setResult(recommendation);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'critical':
        return { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive' };
      case 'elevated':
        return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' };
      default:
        return { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success' };
    }
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-info/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-info" />
          </div>
          <div>
            <CardTitle className="text-lg">Post-Thrombolytic BP Management</CardTitle>
            <CardDescription>Target: SBP &lt;180, DBP &lt;105 mmHg</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="p-3 rounded-xl bg-warning/5 border border-warning/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-xs text-warning font-medium">
              Strict BP control required for 24 hours post-thrombolytic administration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="systolic" className="text-sm font-medium">Systolic (mmHg)</Label>
            <Input
              id="systolic"
              type="number"
              placeholder="140"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="mt-2 h-11 rounded-xl text-lg font-mono"
            />
          </div>
          <div>
            <Label htmlFor="diastolic" className="text-sm font-medium">Diastolic (mmHg)</Label>
            <Input
              id="diastolic"
              type="number"
              placeholder="90"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="mt-2 h-11 rounded-xl text-lg font-mono"
            />
          </div>
        </div>

        <Button onClick={assessBP} className="w-full h-11 rounded-xl">
          Assess BP & Get Recommendation
        </Button>

        {result && (
          <div className={`p-5 rounded-2xl border-2 ${getStatusStyles(result.status).border} ${getStatusStyles(result.status).bg} space-y-4`}>
            <div className="flex items-center gap-2">
              {result.status === 'safe' ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <AlertTriangle className={`w-5 h-5 ${getStatusStyles(result.status).text}`} />
              )}
              <span className={`font-semibold ${getStatusStyles(result.status).text}`}>
                {result.action}
              </span>
            </div>

            {result.medication && (
              <div className="p-3 rounded-xl bg-background/80">
                <p className="text-xs text-muted-foreground mb-1 font-medium">MEDICATION</p>
                <p className="text-sm">{result.medication}</p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-background/80">
              <p className="text-xs text-muted-foreground mb-1 font-medium">MONITORING</p>
              <p className="text-sm">{result.frequency}</p>
            </div>
          </div>
        )}

        {/* BP Thresholds Reference */}
        <div className="p-4 rounded-xl bg-muted/50 space-y-2">
          <p className="text-sm font-semibold mb-2">Post-tPA BP Thresholds</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-success/10 text-center">
              <p className="font-medium text-success">&lt;140/90</p>
              <p className="text-muted-foreground">Optimal</p>
            </div>
            <div className="p-2 rounded-lg bg-warning/10 text-center">
              <p className="font-medium text-warning">140-179/90-104</p>
              <p className="text-muted-foreground">Monitor</p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10 text-center">
              <p className="font-medium text-destructive">≥180/105</p>
              <p className="text-muted-foreground">Treat</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-info/5 rounded-xl">
          <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Goal: Maintain BP &lt;180/105 for 24 hours post-thrombolysis to reduce hemorrhagic transformation risk.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostThrombolyticBPCalculator;
