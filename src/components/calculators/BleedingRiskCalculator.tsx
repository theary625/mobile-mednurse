import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Shield, Info } from 'lucide-react';

interface Contraindication {
  id: string;
  label: string;
  type: 'absolute' | 'relative';
  description?: string;
}

const contraindications: Contraindication[] = [
  // Absolute contraindications
  { id: 'ich_history', label: 'History of intracranial hemorrhage', type: 'absolute' },
  { id: 'active_bleeding', label: 'Active internal bleeding', type: 'absolute' },
  { id: 'recent_surgery', label: 'Intracranial/spinal surgery within 3 months', type: 'absolute' },
  { id: 'stroke_3mo', label: 'Ischemic stroke within 3 months', type: 'absolute' },
  { id: 'head_trauma', label: 'Significant head trauma within 3 months', type: 'absolute' },
  { id: 'gi_bleed', label: 'GI bleed within 21 days', type: 'absolute' },
  { id: 'bp_uncontrolled', label: 'Uncontrolled BP (>185/110 despite treatment)', type: 'absolute' },
  { id: 'platelets', label: 'Platelets < 100,000', type: 'absolute' },
  { id: 'inr', label: 'INR > 1.7 or PT > 15 seconds', type: 'absolute' },
  { id: 'heparin', label: 'Heparin within 48 hours with elevated aPTT', type: 'absolute' },
  { id: 'doac', label: 'DOAC use within 48 hours (or elevated drug level)', type: 'absolute' },
  
  // Relative contraindications
  { id: 'minor_surgery', label: 'Major surgery within 14 days', type: 'relative' },
  { id: 'gi_hemorrhage', label: 'GI/urinary tract hemorrhage within 21 days', type: 'relative' },
  { id: 'mi_recent', label: 'Recent MI within 3 months', type: 'relative' },
  { id: 'seizure', label: 'Seizure at stroke onset', type: 'relative' },
  { id: 'glucose_low', label: 'Glucose < 50 or > 400 mg/dL', type: 'relative' },
  { id: 'pregnancy', label: 'Pregnancy', type: 'relative' },
  { id: 'age', label: 'Age > 80 years', type: 'relative' },
  { id: 'nihss_minor', label: 'Minor or rapidly improving symptoms', type: 'relative' },
];

const BleedingRiskCalculator = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const absoluteCount = selectedItems.filter(id => 
    contraindications.find(c => c.id === id)?.type === 'absolute'
  ).length;

  const relativeCount = selectedItems.filter(id => 
    contraindications.find(c => c.id === id)?.type === 'relative'
  ).length;

  const getRecommendation = () => {
    if (absoluteCount > 0) {
      return {
        status: 'contraindicated',
        label: 'THROMBOLYSIS CONTRAINDICATED',
        color: 'text-destructive',
        bg: 'bg-destructive',
        message: `${absoluteCount} absolute contraindication(s) present. Do NOT administer thrombolytics.`
      };
    }
    if (relativeCount >= 3) {
      return {
        status: 'caution',
        label: 'HIGH RISK - USE EXTREME CAUTION',
        color: 'text-warning',
        bg: 'bg-warning',
        message: `${relativeCount} relative contraindications present. Carefully weigh risks vs benefits.`
      };
    }
    if (relativeCount > 0) {
      return {
        status: 'caution',
        label: 'RELATIVE CONTRAINDICATIONS PRESENT',
        color: 'text-warning',
        bg: 'bg-warning',
        message: `${relativeCount} relative contraindication(s) present. Consider risk/benefit carefully.`
      };
    }
    return {
      status: 'clear',
      label: 'NO CONTRAINDICATIONS IDENTIFIED',
      color: 'text-success',
      bg: 'bg-success',
      message: 'Patient may be eligible for thrombolytic therapy. Proceed with clinical judgment.'
    };
  };

  const recommendation = getRecommendation();
  const absoluteItems = contraindications.filter(c => c.type === 'absolute');
  const relativeItems = contraindications.filter(c => c.type === 'relative');

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-destructive/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg">Bleeding Risk Checklist</CardTitle>
            <CardDescription>Thrombolytic contraindication screening</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {/* Recommendation Banner */}
        <div className={`p-4 rounded-xl ${
          recommendation.status === 'contraindicated' ? 'bg-destructive/10 border-2 border-destructive/30' :
          recommendation.status === 'caution' ? 'bg-warning/10 border-2 border-warning/30' :
          'bg-success/10 border-2 border-success/30'
        }`}>
          <div className="flex items-start gap-3">
            {recommendation.status === 'clear' ? (
              <Shield className="w-5 h-5 text-success mt-0.5" />
            ) : (
              <AlertTriangle className={`w-5 h-5 ${recommendation.color} mt-0.5`} />
            )}
            <div>
              <p className={`font-semibold ${recommendation.color}`}>
                {recommendation.label}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {recommendation.message}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-destructive/5 text-center">
            <p className="text-2xl font-bold text-destructive">{absoluteCount}</p>
            <p className="text-xs text-muted-foreground">Absolute</p>
          </div>
          <div className="p-3 rounded-xl bg-warning/5 text-center">
            <p className="text-2xl font-bold text-warning">{relativeCount}</p>
            <p className="text-xs text-muted-foreground">Relative</p>
          </div>
        </div>

        {/* Absolute Contraindications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-destructive text-destructive-foreground">Absolute</Badge>
            <span className="text-sm text-muted-foreground">— Do NOT give thrombolytics</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {absoluteItems.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedItems.includes(item.id) 
                    ? 'bg-destructive/10 border border-destructive/30' 
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-0.5"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Relative Contraindications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-warning text-warning-foreground">Relative</Badge>
            <span className="text-sm text-muted-foreground">— Weigh risks vs benefits</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {relativeItems.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedItems.includes(item.id) 
                    ? 'bg-warning/10 border border-warning/30' 
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-0.5"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset */}
        <Button 
          variant="outline" 
          onClick={() => setSelectedItems([])}
          className="w-full rounded-xl"
        >
          Clear All
        </Button>

        <div className="flex items-start gap-3 p-4 bg-info/5 rounded-xl">
          <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            This checklist is a screening tool. Final treatment decisions should be made by the treating physician based on clinical judgment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BleedingRiskCalculator;
