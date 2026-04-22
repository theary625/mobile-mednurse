import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NaloxoneCalculator: React.FC = () => {
  const [scenario, setScenario] = useState<'acute' | 'partial' | 'infusion'>('acute');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Naloxone (Narcan) Calculator</CardTitle>
        <p className="text-orange-100 text-sm mt-1">
          Opioid reversal dosing guide
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Precipitated Withdrawal Risk</p>
            <p>Naloxone can precipitate acute withdrawal in opioid-dependent patients. Titrate to respiratory status, not consciousness.</p>
          </div>
        </div>

        <Tabs value={scenario} onValueChange={(v) => setScenario(v as typeof scenario)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="acute">Acute Reversal</TabsTrigger>
            <TabsTrigger value="partial">Partial Reversal</TabsTrigger>
            <TabsTrigger value="infusion">Infusion</TabsTrigger>
          </TabsList>

          <TabsContent value="acute" className="space-y-4 pt-4">
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <h3 className="font-bold text-red-800 text-lg mb-3">Complete Opioid Reversal</h3>
              <p className="text-sm text-red-700 mb-3">For life-threatening respiratory depression or cardiac arrest</p>
              
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Initial Dose</p>
                  <p className="font-bold text-xl text-primary">0.4-2 mg IV/IM/SC/IN</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Repeat Dose</p>
                  <p className="font-bold">May repeat every 2-3 minutes</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Maximum</p>
                  <p className="font-bold">Up to 10 mg total (if no response, consider other causes)</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Route-Specific Notes</h4>
              <ul className="text-sm space-y-1">
                <li><strong>IV:</strong> Fastest onset (1-2 min), preferred route</li>
                <li><strong>IM/SC:</strong> Onset 2-5 min if no IV access</li>
                <li><strong>Intranasal:</strong> 4 mg (2 mg each nostril), onset 3-5 min</li>
                <li><strong>Endotracheal:</strong> 2-2.5× IV dose</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="partial" className="space-y-4 pt-4">
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg">
              <h3 className="font-bold text-amber-800 text-lg mb-3">Titrated / Partial Reversal</h3>
              <p className="text-sm text-amber-700 mb-3">For opioid-dependent patients to avoid withdrawal</p>
              
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Preparation</p>
                  <p className="font-bold">Dilute 0.4 mg in 10 mL NS = 0.04 mg/mL</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Initial Dose</p>
                  <p className="font-bold text-xl text-primary">0.04-0.08 mg IV (1-2 mL)</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Titration</p>
                  <p className="font-bold">Repeat every 1-2 min until adequate respirations (RR ≥12)</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Goal of Partial Reversal</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Respiratory rate ≥12 breaths/min</li>
                <li>• SpO2 ≥92% on room air</li>
                <li>• Patient may remain sedated but arousable</li>
                <li>• Avoid complete awakening to prevent withdrawal</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="infusion" className="space-y-4 pt-4">
            <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
              <h3 className="font-bold text-blue-800 text-lg mb-3">Continuous Infusion</h3>
              <p className="text-sm text-blue-700 mb-3">For long-acting opioid overdose (methadone, fentanyl patches, extended-release)</p>
              
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Preparation</p>
                  <p className="font-bold">2 mg Naloxone in 500 mL NS = 4 mcg/mL</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Calculate Infusion Rate</p>
                  <p className="font-bold text-primary">⅔ of initial bolus dose per hour</p>
                  <p className="text-sm text-muted-foreground mt-1">If 0.4 mg bolus effective → start at 0.25 mg/hr</p>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-sm font-medium text-muted-foreground">Titration</p>
                  <p className="font-bold">Adjust rate by 0.1-0.2 mg/hr to maintain respirations</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Infusion Quick Reference</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Rate (mg/hr)</th>
                    <th className="text-right py-1">mL/hr (4 mcg/mL mix)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted-foreground/20">
                    <td className="py-1">0.25</td>
                    <td className="text-right">62.5</td>
                  </tr>
                  <tr className="border-b border-muted-foreground/20">
                    <td className="py-1">0.4</td>
                    <td className="text-right">100</td>
                  </tr>
                  <tr className="border-b border-muted-foreground/20">
                    <td className="py-1">0.6</td>
                    <td className="text-right">150</td>
                  </tr>
                  <tr>
                    <td className="py-1">1.0</td>
                    <td className="text-right">250</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• Duration: 30-90 min (shorter than most opioids - monitor for re-sedation)</li>
                <li>• Methadone/fentanyl patch: may need prolonged monitoring (24-72 hrs)</li>
                <li>• Withdrawal signs: tachycardia, hypertension, vomiting, agitation</li>
                <li>• If no response to 10mg, reassess diagnosis</li>
                <li>• Observe minimum 4 hours after last dose</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NaloxoneCalculator;
