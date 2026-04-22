import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Search,
  Clock,
  Sparkles,
  XCircle,
  AlertCircle,
  Info,
  Ban,
  X,
  ChevronRight,
} from 'lucide-react';

interface InteractionResult {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor';
  description: string;
  clinicalSignificance: string;
}

interface RecentCheck {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor';
  checkedAt: string;
}

const severityConfig = {
  contraindicated: {
    label: 'Contraindicated',
    icon: Ban,
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    borderClass: 'border-destructive/30',
    badgeStyle: { background: 'hsl(0 84% 60%)' },
  },
  major: {
    label: 'Major',
    icon: XCircle,
    bgClass: 'bg-destructive/8',
    textClass: 'text-destructive',
    borderClass: 'border-destructive/20',
    badgeStyle: { background: 'hsl(0 70% 50%)' },
  },
  moderate: {
    label: 'Moderate',
    icon: AlertTriangle,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    borderClass: 'border-warning/30',
    badgeStyle: { background: 'hsl(38 92% 50%)' },
  },
  minor: {
    label: 'Minor',
    icon: Info,
    bgClass: 'bg-info/10',
    textClass: 'text-info',
    borderClass: 'border-info/30',
    badgeStyle: { background: 'hsl(217 91% 60%)' },
  },
};

const RECENT_CHECKS: RecentCheck[] = [
  { id: '1', drugA: 'Warfarin', drugB: 'Aspirin', severity: 'major', checkedAt: '2 hours ago' },
  { id: '2', drugA: 'Metformin', drugB: 'Lisinopril', severity: 'minor', checkedAt: '5 hours ago' },
  { id: '3', drugA: 'Fluoxetine', drugB: 'Tramadol', severity: 'contraindicated', checkedAt: 'Yesterday' },
];

const InteractionsPage = () => {
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckInteraction = () => {
    if (!drugA || !drugB) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        id: '1',
        drugA,
        drugB,
        severity: 'moderate',
        description: 'Concurrent use may increase the risk of bleeding. Monitor for signs and symptoms of bleeding.',
        clinicalSignificance:
          'The antiplatelet effects may be enhanced when these medications are used together. Consider dose adjustments or alternative therapy if clinically significant bleeding occurs.',
      });
      setLoading(false);
    }, 800);
  };

  const clearResults = () => {
    setDrugA('');
    setDrugB('');
    setResult(null);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(30%, -30%)' }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <AlertTriangle className="w-3 h-3" />
            Drug Interactions
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Interaction Checker</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Check for potential drug-drug interactions before administration
          </p>
        </div>
      </div>

      {/* Checker Card */}
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        {/* Card Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border/40 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(38 92% 50% / 0.12)' }}>
            <Search className="w-4 h-4 text-warning" />
          </div>
          <span className="font-semibold text-foreground text-sm">Check Drug Interaction</span>
        </div>

        <div className="p-4 space-y-3">
          {/* Drug A */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide pl-1">
              First Medication
            </label>
            <div className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden transition-all focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/15">
              <div className="flex items-center justify-center w-11 h-12 text-muted-foreground flex-shrink-0">
                <span className="text-xs font-bold text-muted-foreground">A</span>
              </div>
              <Input
                placeholder="Search medication..."
                value={drugA}
                onChange={(e) => setDrugA(e.target.value)}
                className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
              {drugA && (
                <button
                  type="button"
                  onClick={() => setDrugA('')}
                  className="flex items-center justify-center w-10 h-12 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Drug B */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide pl-1">
              Second Medication
            </label>
            <div className="relative flex items-center bg-muted/60 border border-border rounded-xl overflow-hidden transition-all focus-within:border-warning focus-within:ring-2 focus-within:ring-warning/15">
              <div className="flex items-center justify-center w-11 h-12 text-muted-foreground flex-shrink-0">
                <span className="text-xs font-bold text-muted-foreground">B</span>
              </div>
              <Input
                placeholder="Search medication..."
                value={drugB}
                onChange={(e) => setDrugB(e.target.value)}
                className="border-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
              {drugB && (
                <button
                  type="button"
                  onClick={() => setDrugB('')}
                  className="flex items-center justify-center w-10 h-12 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleCheckInteraction}
              disabled={!drugA || !drugB || loading}
              className="flex-1 h-12 rounded-xl text-white font-semibold text-base shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'hsl(38 92% 50%)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Check Interaction
                </>
              )}
            </Button>
            {(drugA || drugB || result) && (
              <Button
                variant="outline"
                onClick={clearResults}
                className="h-12 px-4 rounded-xl"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Empty state */}
          {!result && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Enter two medications above to check for interactions</p>
            </div>
          )}

          {/* Result */}
          {result && (() => {
            const cfg = severityConfig[result.severity];
            const IconComp = cfg.icon;
            return (
              <div className="pt-2 space-y-3">
                <div className={`rounded-xl border p-4 ${cfg.bgClass} ${cfg.borderClass}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-5 h-5 ${cfg.textClass}`} />
                      <span className="font-semibold text-foreground text-sm">Interaction Found</span>
                    </div>
                    <Badge
                      className="text-white text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={cfg.badgeStyle}
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1.5">
                    {result.drugA} + {result.drugB}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.description}
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-brand" />
                    <span className="text-sm font-semibold text-foreground">Clinical Significance</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.clinicalSignificance}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Severity Legend */}
      <div className="bg-card rounded-2xl border border-border/50 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Severity Legend</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(severityConfig).map(([key, cfg]) => (
            <div key={key} className={`flex items-center gap-2 p-3 rounded-xl ${cfg.bgClass}`}>
              <cfg.icon className={`w-4 h-4 flex-shrink-0 ${cfg.textClass}`} />
              <span className="text-xs font-medium text-foreground">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Checks */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-border/40 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="font-semibold text-foreground text-sm">Recent Checks</span>
        </div>
        <div className="divide-y divide-border/40">
          {RECENT_CHECKS.map((check) => {
            const cfg = severityConfig[check.severity];
            const IconComp = cfg.icon;
            return (
              <button
                key={check.id}
                onClick={() => {
                  setDrugA(check.drugA);
                  setDrugB(check.drugB);
                  setResult(null);
                }}
                className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-muted/50 transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bgClass}`}>
                  <IconComp className={`w-4 h-4 ${cfg.textClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {check.drugA} + {check.drugB}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{check.checkedAt}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    className="text-white text-xs px-2 py-0.5 rounded-full"
                    style={cfg.badgeStyle}
                  >
                    {cfg.label}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Tip */}
      <div className="bg-card rounded-2xl border border-border/50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-brand" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Clinical Tip</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Always verify interactions with multiple sources. Consider patient-specific factors when evaluating clinical significance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionsPage;
