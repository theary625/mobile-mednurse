import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Droplet, 
  Search,
  Sparkles,
  Clock,
  Thermometer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Beaker,
  Timer
} from 'lucide-react';

interface IVMedication {
  id: string;
  name: string;
  concentration: string;
  stability: string;
  lightSensitive: boolean;
  refrigerate: boolean;
  pushRate?: string;
  dripInfo?: string;
}

interface CompatibilityCheck {
  id: string;
  drugA: string;
  drugB: string;
  compatible: 'yes' | 'no' | 'caution';
}

const compatibilityStyles = {
  yes: {
    label: 'Compatible',
    icon: CheckCircle,
    bgClass: 'bg-success/10',
    textClass: 'text-success'
  },
  no: {
    label: 'Incompatible',
    icon: XCircle,
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive'
  },
  caution: {
    label: 'Use Caution',
    icon: AlertTriangle,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning'
  }
};

const IVReferencePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<IVMedication | null>(null);

  const [ivMedications] = useState<IVMedication[]>([
    {
      id: '1',
      name: 'Vancomycin',
      concentration: '5 mg/mL in NS or D5W',
      stability: '14 days refrigerated',
      lightSensitive: false,
      refrigerate: true,
      dripInfo: 'Infuse over 60 min (max 10 mg/min)',
    },
    {
      id: '2',
      name: 'Heparin',
      concentration: '100 units/mL',
      stability: '24 hours at room temp',
      lightSensitive: false,
      refrigerate: false,
      dripInfo: 'Continuous infusion per protocol',
    },
    {
      id: '3',
      name: 'Norepinephrine',
      concentration: '4 mg/250 mL D5W',
      stability: '24 hours',
      lightSensitive: true,
      refrigerate: false,
      dripInfo: 'Titrate 0.1-2 mcg/kg/min',
    },
    {
      id: '4',
      name: 'Potassium Chloride',
      concentration: '40 mEq/L',
      stability: '24 hours',
      lightSensitive: false,
      refrigerate: false,
      dripInfo: 'Max 10 mEq/hr peripheral, 20 mEq/hr central',
    },
    {
      id: '5',
      name: 'Furosemide',
      concentration: '10 mg/mL',
      stability: '24 hours at room temp',
      lightSensitive: true,
      refrigerate: false,
      pushRate: 'IV push over 1-2 min (max 4 mg/min)',
    }
  ]);

  const [compatibilityData] = useState<CompatibilityCheck[]>([
    { id: '1', drugA: 'Vancomycin', drugB: 'Heparin', compatible: 'yes' },
    { id: '2', drugA: 'Vancomycin', drugB: 'Ceftriaxone', compatible: 'no' },
    { id: '3', drugA: 'Dopamine', drugB: 'Sodium Bicarbonate', compatible: 'no' },
    { id: '4', drugA: 'Morphine', drugB: 'Ondansetron', compatible: 'yes' },
    { id: '5', drugA: 'Insulin', drugB: 'Potassium', compatible: 'caution' },
  ]);

  const filteredMeds = ivMedications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-info/10 text-info rounded-full text-sm font-medium mb-3">
          <Droplet className="w-4 h-4" />
          <span>IV Reference</span>
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
          IV Safety & Compatibility
        </h1>
        <p className="text-muted-foreground mt-2">
          IV medication guidelines, compatibility, and administration reference
        </p>
      </div>

      <Tabs defaultValue="medications" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="medications" className="rounded-lg data-[state=active]:bg-background">
            IV Medications
          </TabsTrigger>
          <TabsTrigger value="compatibility" className="rounded-lg data-[state=active]:bg-background">
            Y-Site Compatibility
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="rounded-lg data-[state=active]:bg-background">
            Push/Drip Rates
          </TabsTrigger>
        </TabsList>

        {/* IV Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Medication List */}
            <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search IV medications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-2 space-y-1">
                    {filteredMeds.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => setSelectedMed(med)}
                        className={`w-full p-3 rounded-xl text-left transition-colors ${
                          selectedMed?.id === med.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{med.name}</span>
                          <div className="flex gap-1">
                            {med.lightSensitive && (
                              <Badge variant="outline" className="text-xs">
                                Light ⚠️
                              </Badge>
                            )}
                            {med.refrigerate && (
                              <Badge variant="outline" className="text-xs">
                                ❄️
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {med.concentration}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Medication Details */}
            <div className="lg:col-span-2">
              {selectedMed ? (
                <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-info/10 to-transparent">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                        <Droplet className="w-5 h-5 text-info" />
                      </div>
                      {selectedMed.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Quick Info Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Beaker className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Concentration</span>
                        </div>
                        <p className="font-medium text-foreground">{selectedMed.concentration}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Stability</span>
                        </div>
                        <p className="font-medium text-foreground">{selectedMed.stability}</p>
                      </div>
                    </div>

                    {/* Storage Requirements */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Storage Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMed.lightSensitive && (
                          <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Light Sensitive
                          </Badge>
                        )}
                        {selectedMed.refrigerate && (
                          <Badge className="bg-info/10 text-info border-info/20 gap-1">
                            <Thermometer className="w-3 h-3" />
                            Refrigerate
                          </Badge>
                        )}
                        {!selectedMed.lightSensitive && !selectedMed.refrigerate && (
                          <Badge className="bg-success/10 text-success border-success/20 gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Room Temperature OK
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Administration Info */}
                    {(selectedMed.pushRate || selectedMed.dripInfo) && (
                      <div className="p-4 rounded-xl bg-primary-glow border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Timer className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">Administration</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedMed.pushRate || selectedMed.dripInfo}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/50 shadow-soft rounded-2xl h-full flex items-center justify-center">
                  <CardContent className="text-center py-16">
                    <Droplet className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                    <p className="text-muted-foreground">Select a medication to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Y-Site Compatibility Tab */}
        <TabsContent value="compatibility" className="space-y-6">
          <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-info/10 to-transparent">
              <CardTitle className="text-lg">Y-Site Compatibility Quick Check</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {compatibilityData.map((check) => {
                  const config = compatibilityStyles[check.compatible];
                  return (
                    <div
                      key={check.id}
                      className={`p-4 rounded-xl ${config.bgClass} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <config.icon className={`w-5 h-5 ${config.textClass}`} />
                        <span className="font-medium text-foreground">
                          {check.drugA} + {check.drugB}
                        </span>
                      </div>
                      <Badge variant="outline" className={`${config.textClass} border-current`}>
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Full compatibility matrix coming soon. Always verify with pharmacy.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push/Drip Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-success/10 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  IV Push Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {ivMedications.filter(m => m.pushRate).map((med) => (
                  <div key={med.id} className="p-3 rounded-xl bg-muted/50">
                    <p className="font-medium text-foreground">{med.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{med.pushRate}</p>
                  </div>
                ))}
                <div className="p-3 rounded-xl border border-dashed border-border text-center">
                  <p className="text-sm text-muted-foreground">More medications coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-info/10 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-info" />
                  Continuous Drip Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {ivMedications.filter(m => m.dripInfo && !m.pushRate).map((med) => (
                  <div key={med.id} className="p-3 rounded-xl bg-muted/50">
                    <p className="font-medium text-foreground">{med.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{med.dripInfo}</p>
                  </div>
                ))}
                <div className="p-3 rounded-xl border border-dashed border-border text-center">
                  <p className="text-sm text-muted-foreground">More medications coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tip */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary-glow via-card to-card shadow-soft rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">IV Safety Tip</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Always verify line patency and compatibility before administering IV medications. When in doubt, flush between medications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IVReferencePage;
