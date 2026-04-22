import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Search, 
  ArrowRight, 
  Clock, 
  Sparkles,
  XCircle,
  AlertCircle,
  Info,
  Ban
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
    badgeClass: 'bg-destructive text-destructive-foreground'
  },
  major: {
    label: 'Major',
    icon: XCircle,
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    badgeClass: 'bg-destructive/80 text-destructive-foreground'
  },
  moderate: {
    label: 'Moderate',
    icon: AlertTriangle,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    badgeClass: 'bg-warning text-warning-foreground'
  },
  minor: {
    label: 'Minor',
    icon: Info,
    bgClass: 'bg-info/10',
    textClass: 'text-info',
    badgeClass: 'bg-info text-info-foreground'
  }
};

const InteractionsPage = () => {
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentChecks] = useState<RecentCheck[]>([
    {
      id: '1',
      drugA: 'Warfarin',
      drugB: 'Aspirin',
      severity: 'major',
      checkedAt: '2 hours ago'
    },
    {
      id: '2',
      drugA: 'Metformin',
      drugB: 'Lisinopril',
      severity: 'minor',
      checkedAt: '5 hours ago'
    },
    {
      id: '3',
      drugA: 'Fluoxetine',
      drugB: 'Tramadol',
      severity: 'contraindicated',
      checkedAt: 'Yesterday'
    }
  ]);

  const handleCheckInteraction = () => {
    if (!drugA || !drugB) return;
    
    setLoading(true);
    // Simulate API call - will be replaced with actual DB query
    setTimeout(() => {
      setResult({
        id: '1',
        drugA,
        drugB,
        severity: 'moderate',
        description: 'Concurrent use may increase the risk of bleeding. Monitor for signs and symptoms of bleeding.',
        clinicalSignificance: 'The antiplatelet effects may be enhanced when these medications are used together. Consider dose adjustments or alternative therapy if clinically significant bleeding occurs.'
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warning/10 text-warning rounded-full text-sm font-medium mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span>Drug Interactions</span>
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
          Interaction Checker
        </h1>
        <p className="text-muted-foreground mt-2">
          Check for potential drug-drug interactions before administration
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interaction Checker Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-warning/10 to-transparent">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-warning" />
                Check Drug Interaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {/* Drug Input Section */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    First Medication
                  </label>
                  <Input
                    placeholder="Search medication..."
                    value={drugA}
                    onChange={(e) => setDrugA(e.target.value)}
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-muted mt-6">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Second Medication
                  </label>
                  <Input
                    placeholder="Search medication..."
                    value={drugB}
                    onChange={(e) => setDrugB(e.target.value)}
                    className="rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleCheckInteraction}
                  disabled={!drugA || !drugB || loading}
                  className="rounded-xl flex-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Checking...
                    </>
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
                    className="rounded-xl"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {/* Results Section */}
              {result && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Interaction Found</h3>
                      <Badge className={severityConfig[result.severity].badgeClass}>
                        {severityConfig[result.severity].label}
                      </Badge>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${severityConfig[result.severity].bgClass}`}>
                      <div className="flex items-start gap-3">
                        {(() => {
                          const IconComponent = severityConfig[result.severity].icon;
                          return <IconComponent className={`w-5 h-5 mt-0.5 ${severityConfig[result.severity].textClass}`} />;
                        })()}
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">
                            {result.drugA} + {result.drugB}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Card className="border-border/50">
                      <CardContent className="p-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Clinical Significance
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {result.clinicalSignificance}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {!result && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Enter two medications above to check for interactions</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Severity Legend */}
          <Card className="border-border/50 shadow-soft rounded-2xl">
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Severity Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(severityConfig).map(([key, config]) => (
                  <div key={key} className={`p-3 rounded-xl ${config.bgClass} flex items-center gap-2`}>
                    <config.icon className={`w-4 h-4 ${config.textClass}`} />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Checks Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-muted to-transparent">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Recent Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-3">
                  {recentChecks.map((check) => (
                    <button
                      key={check.id}
                      onClick={() => {
                        setDrugA(check.drugA);
                        setDrugB(check.drugB);
                      }}
                      className="w-full p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {check.drugA} + {check.drugB}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${severityConfig[check.severity].textClass} border-current`}
                        >
                          {severityConfig[check.severity].label}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{check.checkedAt}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Tips Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary-glow via-card to-card shadow-soft rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Clinical Tip</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Always verify interactions with multiple sources. Consider patient-specific factors when evaluating clinical significance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractionsPage;
