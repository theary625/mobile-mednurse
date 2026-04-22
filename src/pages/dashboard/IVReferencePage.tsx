import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Timer,
  ChevronRight,
  ChevronLeft,
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
    textClass: 'text-success',
    borderClass: 'border-success/20',
  },
  no: {
    label: 'Incompatible',
    icon: XCircle,
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    borderClass: 'border-destructive/20',
  },
  caution: {
    label: 'Use Caution',
    icon: AlertTriangle,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    borderClass: 'border-warning/20',
  },
};

const IV_MEDICATIONS: IVMedication[] = [
  { id: '1', name: 'Vancomycin', concentration: '5 mg/mL in NS or D5W', stability: '14 days refrigerated', lightSensitive: false, refrigerate: true, dripInfo: 'Infuse over 60 min (max 10 mg/min)' },
  { id: '2', name: 'Heparin', concentration: '100 units/mL', stability: '24 hours at room temp', lightSensitive: false, refrigerate: false, dripInfo: 'Continuous infusion per protocol' },
  { id: '3', name: 'Norepinephrine', concentration: '4 mg/250 mL D5W', stability: '24 hours', lightSensitive: true, refrigerate: false, dripInfo: 'Titrate 0.1–2 mcg/kg/min' },
  { id: '4', name: 'Potassium Chloride', concentration: '40 mEq/L', stability: '24 hours', lightSensitive: false, refrigerate: false, dripInfo: 'Max 10 mEq/hr peripheral, 20 mEq/hr central' },
  { id: '5', name: 'Furosemide', concentration: '10 mg/mL', stability: '24 hours at room temp', lightSensitive: true, refrigerate: false, pushRate: 'IV push over 1–2 min (max 4 mg/min)' },
];

const COMPATIBILITY_DATA: CompatibilityCheck[] = [
  { id: '1', drugA: 'Vancomycin', drugB: 'Heparin', compatible: 'yes' },
  { id: '2', drugA: 'Vancomycin', drugB: 'Ceftriaxone', compatible: 'no' },
  { id: '3', drugA: 'Dopamine', drugB: 'Sodium Bicarbonate', compatible: 'no' },
  { id: '4', drugA: 'Morphine', drugB: 'Ondansetron', compatible: 'yes' },
  { id: '5', drugA: 'Insulin', drugB: 'Potassium', compatible: 'caution' },
];

const IVReferencePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<IVMedication | null>(null);
  const [activeTab, setActiveTab] = useState('medications');

  const filteredMeds = IV_MEDICATIONS.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Detail view ── */
  if (selectedMed) {
    return (
      <div className="space-y-4">
        {/* Back */}
        <button
          onClick={() => setSelectedMed(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground active:text-foreground transition-colors -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to IV Meds
        </button>

        {/* Hero */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0e7490 0%, #0891b2 60%, #06b6d4 100%)" }}>
          <div className="relative p-5 overflow-hidden">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
            <div className="relative flex items-center gap-3">
              <div className="h-13 w-13 rounded-2xl bg-white/20 flex items-center justify-center p-2.5">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMed.name}</h2>
                <p className="text-white/70 text-sm">{selectedMed.concentration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Beaker className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Concentration</span>
              </div>
              <p className="font-semibold text-sm text-foreground leading-snug">{selectedMed.concentration}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Stability</span>
              </div>
              <p className="font-semibold text-sm text-foreground leading-snug">{selectedMed.stability}</p>
            </div>
          </div>

          {/* Storage */}
          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Storage Requirements</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMed.lightSensitive && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> Light Sensitive
                </Badge>
              )}
              {selectedMed.refrigerate && (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1 rounded-full">
                  <Thermometer className="w-3 h-3" /> Refrigerate
                </Badge>
              )}
              {!selectedMed.lightSensitive && !selectedMed.refrigerate && (
                <Badge className="bg-success/10 text-success border-success/20 gap-1 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Room Temperature OK
                </Badge>
              )}
            </div>
          </div>

          {/* Administration */}
          {(selectedMed.pushRate || selectedMed.dripInfo) && (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Timer className="h-3.5 w-3.5 text-cyan-600" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-600">Administration</span>
              </div>
              <p className="font-semibold text-sm text-foreground leading-relaxed">
                {selectedMed.pushRate || selectedMed.dripInfo}
              </p>
            </div>
          )}

          {/* Safety notice */}
          <div className="rounded-2xl bg-muted/50 p-3 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Always verify with pharmacy and institutional guidelines before administration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Browse view ── */
  return (
    <div className="space-y-4">
      {/* Hero header */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0e7490 0%, #0891b2 60%, #06b6d4 100%)" }}
      >
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
              <Droplet className="h-4 w-4 text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">IV Reference</span>
          </div>
          <h1 className="text-2xl font-bold text-white">IV Safety & Compatibility</h1>
          <p className="text-white/70 text-sm mt-1">Guidelines, compatibility & administration</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 rounded-2xl bg-muted/60 p-1 h-auto">
          <TabsTrigger value="medications" className="rounded-xl py-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
            IV Meds
          </TabsTrigger>
          <TabsTrigger value="compatibility" className="rounded-xl py-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Y-Site
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="rounded-xl py-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Push/Drip
          </TabsTrigger>
        </TabsList>

        {/* ── IV Medications tab ── */}
        <TabsContent value="medications" className="mt-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search IV medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/60 border-border/60 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500"
            />
          </div>

          {/* Medication list */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
            {filteredMeds.length === 0 ? (
              <div className="py-10 text-center">
                <Droplet className="h-10 w-10 mx-auto mb-2 text-muted-foreground/25" />
                <p className="text-sm text-muted-foreground">No medications found</p>
              </div>
            ) : (
              filteredMeds.map((med, i) => (
                <button
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/60 hover:bg-muted/30 transition-colors ${
                    i < filteredMeds.length - 1 ? "border-b border-border/40" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/15">
                    <Droplet className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{med.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{med.concentration}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {med.lightSensitive && (
                      <span className="flex h-5 items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 text-[10px] font-medium text-amber-600">
                        <AlertTriangle className="h-2.5 w-2.5" /> Light
                      </span>
                    )}
                    {med.refrigerate && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/15 text-xs">
                        ❄️
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Count */}
          <p className="text-xs text-muted-foreground text-center">
            {filteredMeds.length} medication{filteredMeds.length !== 1 ? "s" : ""}
          </p>
        </TabsContent>

        {/* ── Y-Site Compatibility tab ── */}
        <TabsContent value="compatibility" className="mt-4 space-y-3">
          {COMPATIBILITY_DATA.map((check) => {
            const config = compatibilityStyles[check.compatible];
            const Icon = config.icon;
            return (
              <div
                key={check.id}
                className={`rounded-2xl border p-4 flex items-center justify-between ${config.bgClass} ${config.borderClass}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Icon className={`h-5 w-5 flex-shrink-0 ${config.textClass}`} />
                  <span className="font-medium text-sm text-foreground truncate">
                    {check.drugA} + {check.drugB}
                  </span>
                </div>
                <span className={`text-xs font-semibold flex-shrink-0 ml-3 ${config.textClass}`}>
                  {config.label}
                </span>
              </div>
            );
          })}

          <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Full compatibility matrix coming soon. Always verify with pharmacy.
            </p>
          </div>
        </TabsContent>

        {/* ── Push/Drip Guidelines tab ── */}
        <TabsContent value="guidelines" className="mt-4 space-y-4">
          {/* IV Push */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-success/15">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">IV Push Guidelines</h3>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
              {IV_MEDICATIONS.filter(m => m.pushRate).map((med, i, arr) => (
                <div key={med.id} className={`px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-border/40" : ""}`}>
                  <p className="text-sm font-semibold text-foreground">{med.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{med.pushRate}</p>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-dashed border-border/60">
                <p className="text-xs text-muted-foreground text-center">More medications coming soon</p>
              </div>
            </div>
          </div>

          {/* Continuous Drip */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/15">
                <Droplet className="h-4 w-4 text-cyan-600" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Continuous Drip Guidelines</h3>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
              {IV_MEDICATIONS.filter(m => m.dripInfo && !m.pushRate).map((med, i, arr) => (
                <div key={med.id} className={`px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-border/40" : ""}`}>
                  <p className="text-sm font-semibold text-foreground">{med.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{med.dripInfo}</p>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-dashed border-border/60">
                <p className="text-xs text-muted-foreground text-center">More medications coming soon</p>
              </div>
            </div>
          </div>

          {/* Safety tip */}
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/15">
                <Sparkles className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">IV Safety Tip</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Always verify line patency and compatibility before administering IV medications. When in doubt, flush between medications.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IVReferencePage;
