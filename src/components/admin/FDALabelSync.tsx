import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Layers,
  ClipboardCheck,
  XCircle,
  Eye,
  Sparkles,
  Zap
} from 'lucide-react';
import { fdaLabelsApi, DailyMedSearchResult, FDALabelData } from '@/lib/api/fda-labels';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import FDABatchImport from './FDABatchImport';
import FDABatchExtract from './FDABatchExtract';
import OpenFDALabelSync from './OpenFDALabelSync';
import { supabase } from '@/integrations/supabase/client';

interface FDAReviewMedication {
  id: string;
  generic_name: string;
  brand_names: string[] | null;
  fda_label_data: FDALabelData | null;
  fda_label_url: string | null;
  fda_set_id: string | null;
  last_synced_at: string | null;
  content_status: string;
}

interface FDALabelSyncProps {
  medicationId?: string;
  medicationName?: string;
  onLabelSynced?: () => void;
}

const FDALabelSync = ({ medicationId, medicationName, onLabelSynced }: FDALabelSyncProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(medicationName || '');
  const [searchResults, setSearchResults] = useState<DailyMedSearchResult[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<DailyMedSearchResult | null>(null);
  const [scrapedData, setScrapedData] = useState<FDALabelData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['dosage', 'warnings']));
  
  // Review tab state
  const [reviewMedications, setReviewMedications] = useState<FDAReviewMedication[]>([]);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [selectedReviewMed, setSelectedReviewMed] = useState<FDAReviewMedication | null>(null);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<{ data: any; fields: string[] } | null>(null);

  const fetchReviewMedications = async () => {
    setIsLoadingReview(true);
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('id, generic_name, brand_names, fda_label_data, fda_label_url, fda_set_id, last_synced_at, content_status')
        .not('fda_label_data', 'is', null)
        .order('last_synced_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setReviewMedications((data || []) as unknown as FDAReviewMedication[]);
    } catch (error) {
      console.error('Error fetching review medications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load medications for review',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingReview(false);
    }
  };

  const approveFDALabel = async (med: FDAReviewMedication) => {
    setIsApproving(med.id);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('medications')
        .update({
          content_status: 'approved',
          reviewed_by: session.session?.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', med.id);

      if (error) throw error;

      toast({
        title: 'FDA Label Approved',
        description: `${med.generic_name} has been approved`,
      });

      fetchReviewMedications();
      setSelectedReviewMed(null);
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: 'Approval Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(null);
    }
  };

  const clearFDALabel = async (med: FDAReviewMedication) => {
    try {
      const { error } = await supabase
        .from('medications')
        .update({
          fda_label_data: null,
          fda_label_url: null,
          fda_set_id: null,
          fda_label_revision_date: null,
        })
        .eq('id', med.id);

      if (error) throw error;

      toast({
        title: 'FDA Label Cleared',
        description: `FDA data removed from ${med.generic_name}`,
      });

      fetchReviewMedications();
      setSelectedReviewMed(null);
    } catch (error) {
      console.error('Clear error:', error);
      toast({
        title: 'Clear Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleExtractFromLabel = async () => {
    if (!medicationId) return;
    setIsExtracting(true);
    setExtractionResult(null);

    try {
      const response = await fdaLabelsApi.extractFromFDALabel(medicationId);
      
      if (response.success && response.data) {
        setExtractionResult({ data: response.data, fields: response.fields_populated || [] });
        toast({
          title: 'Extraction Complete',
          description: `Populated ${(response.fields_populated || []).length} fields from FDA label`,
        });
        onLabelSynced?.();
      } else {
        toast({
          title: 'Extraction Failed',
          description: response.error || 'Failed to extract data from FDA label',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Extraction error:', error);
      toast({
        title: 'Extraction Error',
        description: 'An unexpected error occurred during extraction',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    // Pre-fetch review medications when component mounts
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    setSelectedLabel(null);
    setScrapedData(null);

    try {
      const response = await fdaLabelsApi.searchLabels(searchTerm);
      
      if (response.success && response.results) {
        setSearchResults(response.results);
        if (response.results.length === 0) {
          toast({
            title: 'No Results',
            description: `No FDA labels found for "${searchTerm}"`,
          });
        }
      } else {
        toast({
          title: 'Search Failed',
          description: response.error || 'Failed to search DailyMed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleScrapeLabel = async (result: DailyMedSearchResult) => {
    setSelectedLabel(result);
    setIsScraping(true);
    setScrapedData(null);

    try {
      const response = await fdaLabelsApi.scrapeLabel(result.label_url, result.set_id);
      
      if (response.success && response.data) {
        setScrapedData(response.data);
        toast({
          title: 'Label Scraped',
          description: `Successfully extracted data from FDA label`,
        });
      } else {
        toast({
          title: 'Scraping Failed',
          description: response.error || 'Failed to scrape FDA label',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Scrape error:', error);
      toast({
        title: 'Scrape Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsScraping(false);
    }
  };

  const handleSyncToMedication = async () => {
    if (!medicationId || !scrapedData) return;
    
    setIsSyncing(true);

    try {
      const response = await fdaLabelsApi.syncLabelToMedication(medicationId, scrapedData);
      
      if (response.success) {
        toast({
          title: 'Sync Complete',
          description: 'FDA label data has been saved to the medication record',
        });
        onLabelSynced?.();
      } else {
        toast({
          title: 'Sync Failed',
          description: response.error || 'Failed to save label data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <Tabs defaultValue="search" className="space-y-4" onValueChange={(v) => {
      if (v === 'review') fetchReviewMedications();
    }}>
      <TabsList>
        <TabsTrigger value="search">
          <Search className="w-4 h-4 mr-1" />
          Search & Sync
        </TabsTrigger>
        <TabsTrigger value="review">
          <ClipboardCheck className="w-4 h-4 mr-1" />
          Review
        </TabsTrigger>
        <TabsTrigger value="openfda">
          <Zap className="w-4 h-4 mr-1" />
          OpenFDA Direct
        </TabsTrigger>
        <TabsTrigger value="batch">
          <Layers className="w-4 h-4 mr-1" />
          Batch Import
        </TabsTrigger>
        <TabsTrigger value="batch-extract">
          <Sparkles className="w-4 h-4 mr-1" />
          Batch Extract
        </TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="space-y-4">
        {/* AI Extract from FDA Label URL */}
        {medicationId && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Extract from FDA Label
              </CardTitle>
              <CardDescription>
                Uses AI to extract and populate all structured medication fields from the FDA label URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleExtractFromLabel} 
                disabled={isExtracting}
                className="w-full"
              >
                {isExtracting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isExtracting ? 'Extracting — this may take 30-60s...' : 'Extract from FDA Label'}
              </Button>

              {extractionResult && (
                <div className="p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium text-sm">Extraction Successful</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {extractionResult.fields.map((field) => (
                      <Badge key={field} variant="secondary" className="text-xs">
                        {field.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              FDA Label Search
            </CardTitle>
            <CardDescription>
              Search DailyMed for official FDA prescribing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter drug name (e.g., norepinephrine)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.set_id}-${index}`}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedLabel?.set_id === result.set_id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleScrapeLabel(result)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{result.drug_name}</p>
                        <p className="text-xs text-muted-foreground">{result.manufacturer}</p>
                        {result.last_updated && (
                          <p className="text-xs text-muted-foreground">Updated: {result.last_updated}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isScraping && selectedLabel?.set_id === result.set_id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <Download className="w-4 h-4 text-muted-foreground" />
                        )}
                        <a
                          href={result.label_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {scrapedData && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Extracted Label Data
                </CardTitle>
                <CardDescription>
                  {scrapedData.drug_name} • {scrapedData.manufacturer}
                </CardDescription>
              </div>
              {medicationId && (
                <Button onClick={handleSyncToMedication} disabled={isSyncing}>
                  {isSyncing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Save to Medication
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {/* Boxed Warning */}
                {scrapedData.warnings_and_precautions.boxed_warning && (
                  <div className="p-3 border-2 border-destructive rounded-lg bg-destructive/5">
                    <div className="flex items-center gap-2 mb-2 text-destructive">
                      <AlertOctagon className="w-5 h-5" />
                      <span className="font-bold">BOXED WARNING</span>
                    </div>
                    <p className="text-sm">{scrapedData.warnings_and_precautions.boxed_warning}</p>
                  </div>
                )}

                {/* Dosage & Administration */}
                <LabelSection
                  title="Dosage & Administration"
                  isExpanded={expandedSections.has('dosage')}
                  onToggle={() => toggleSection('dosage')}
                >
                  <div className="space-y-2 text-sm">
                    {scrapedData.dosage_and_administration.recommended_dosage && (
                      <div>
                        <span className="font-medium">Recommended Dosage:</span>
                        <p className="text-muted-foreground">{scrapedData.dosage_and_administration.recommended_dosage}</p>
                      </div>
                    )}
                    {scrapedData.dosage_and_administration.administration_instructions && (
                      <div>
                        <span className="font-medium">Administration:</span>
                        <p className="text-muted-foreground">{scrapedData.dosage_and_administration.administration_instructions}</p>
                      </div>
                    )}
                    {scrapedData.dosage_and_administration.preparation_instructions && (
                      <div>
                        <span className="font-medium">Preparation:</span>
                        <p className="text-muted-foreground">{scrapedData.dosage_and_administration.preparation_instructions}</p>
                      </div>
                    )}
                  </div>
                </LabelSection>

                {/* Warnings & Precautions */}
                <LabelSection
                  title="Warnings & Precautions"
                  isExpanded={expandedSections.has('warnings')}
                  onToggle={() => toggleSection('warnings')}
                  badge={scrapedData.warnings_and_precautions.warnings.length}
                >
                  <div className="space-y-2 text-sm">
                    {scrapedData.warnings_and_precautions.contraindications.length > 0 && (
                      <div>
                        <span className="font-medium text-destructive">Contraindications:</span>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {scrapedData.warnings_and_precautions.contraindications.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {scrapedData.warnings_and_precautions.warnings.length > 0 && (
                      <div>
                        <span className="font-medium text-amber-600">Warnings:</span>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {scrapedData.warnings_and_precautions.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </LabelSection>

                {/* Pharmacokinetics */}
                <LabelSection
                  title="Pharmacokinetics"
                  isExpanded={expandedSections.has('pk')}
                  onToggle={() => toggleSection('pk')}
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {scrapedData.pharmacokinetics.half_life && (
                      <div>
                        <span className="font-medium">Half-life:</span>
                        <p className="text-muted-foreground">{scrapedData.pharmacokinetics.half_life}</p>
                      </div>
                    )}
                    {scrapedData.pharmacokinetics.metabolism && (
                      <div>
                        <span className="font-medium">Metabolism:</span>
                        <p className="text-muted-foreground">{scrapedData.pharmacokinetics.metabolism}</p>
                      </div>
                    )}
                    {scrapedData.pharmacokinetics.excretion && (
                      <div>
                        <span className="font-medium">Excretion:</span>
                        <p className="text-muted-foreground">{scrapedData.pharmacokinetics.excretion}</p>
                      </div>
                    )}
                  </div>
                </LabelSection>

                {/* Adverse Reactions */}
                <LabelSection
                  title="Adverse Reactions"
                  isExpanded={expandedSections.has('adverse')}
                  onToggle={() => toggleSection('adverse')}
                  badge={scrapedData.adverse_reactions.most_common.length + scrapedData.adverse_reactions.serious.length}
                >
                  <div className="space-y-2 text-sm">
                    {scrapedData.adverse_reactions.serious.length > 0 && (
                      <div>
                        <span className="font-medium text-destructive">Serious:</span>
                        <p className="text-muted-foreground">{scrapedData.adverse_reactions.serious.join(', ')}</p>
                      </div>
                    )}
                    {scrapedData.adverse_reactions.most_common.length > 0 && (
                      <div>
                        <span className="font-medium">Most Common:</span>
                        <p className="text-muted-foreground">{scrapedData.adverse_reactions.most_common.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </LabelSection>

                {/* Drug Interactions */}
                {scrapedData.drug_interactions.length > 0 && (
                  <LabelSection
                    title="Drug Interactions"
                    isExpanded={expandedSections.has('interactions')}
                    onToggle={() => toggleSection('interactions')}
                    badge={scrapedData.drug_interactions.length}
                  >
                    <div className="space-y-2 text-sm">
                      {scrapedData.drug_interactions.map((interaction, i) => (
                        <div key={i} className="p-2 bg-muted rounded">
                          <span className="font-medium">{interaction.drug}:</span>
                          <p className="text-muted-foreground">{interaction.effect}</p>
                          {interaction.recommendation && (
                            <p className="text-xs text-primary mt-1">{interaction.recommendation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </LabelSection>
                )}

                {/* Special Populations */}
                <LabelSection
                  title="Special Populations"
                  isExpanded={expandedSections.has('populations')}
                  onToggle={() => toggleSection('populations')}
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {scrapedData.special_populations.renal_impairment && (
                      <div>
                        <span className="font-medium">Renal Impairment:</span>
                        <p className="text-muted-foreground">{scrapedData.special_populations.renal_impairment}</p>
                      </div>
                    )}
                    {scrapedData.special_populations.hepatic_impairment && (
                      <div>
                        <span className="font-medium">Hepatic Impairment:</span>
                        <p className="text-muted-foreground">{scrapedData.special_populations.hepatic_impairment}</p>
                      </div>
                    )}
                    {scrapedData.special_populations.geriatric && (
                      <div>
                        <span className="font-medium">Geriatric:</span>
                        <p className="text-muted-foreground">{scrapedData.special_populations.geriatric}</p>
                      </div>
                    )}
                    {scrapedData.special_populations.pediatric && (
                      <div>
                        <span className="font-medium">Pediatric:</span>
                        <p className="text-muted-foreground">{scrapedData.special_populations.pediatric}</p>
                      </div>
                    )}
                  </div>
                </LabelSection>

                {/* Storage */}
                {scrapedData.storage_handling && (
                  <LabelSection
                    title="Storage & Handling"
                    isExpanded={expandedSections.has('storage')}
                    onToggle={() => toggleSection('storage')}
                  >
                    <p className="text-sm text-muted-foreground">{scrapedData.storage_handling}</p>
                  </LabelSection>
                )}

                <Separator />

                {/* Source Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Set ID: {scrapedData.set_id}</p>
                  {scrapedData.nda_number && <p>Application: {scrapedData.nda_number}</p>}
                  {scrapedData.revision_date && <p>Revised: {scrapedData.revision_date}</p>}
                  <a
                    href={scrapedData.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View on DailyMed <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      </TabsContent>

      <TabsContent value="review" className="space-y-4">
        {isLoadingReview ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : reviewMedications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No medications with FDA label data</p>
            <Button variant="link" onClick={fetchReviewMedications} className="mt-2">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Medications List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Medications with FDA Data ({reviewMedications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {reviewMedications.map((med) => (
                      <div
                        key={med.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedReviewMed?.id === med.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedReviewMed(med)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{med.generic_name}</p>
                            {med.brand_names && med.brand_names.length > 0 && (
                              <p className="text-xs text-muted-foreground truncate">
                                {med.brand_names.join(', ')}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {med.last_synced_at
                                ? `Synced: ${new Date(med.last_synced_at).toLocaleDateString()}`
                                : 'Never synced'}
                            </p>
                          </div>
                          <Badge 
                            variant={med.content_status === 'approved' ? 'default' : 'secondary'}
                            className="text-xs shrink-0"
                          >
                            {med.content_status || 'draft'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Selected Medication Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  FDA Label Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedReviewMed ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{selectedReviewMed.generic_name}</h4>
                        {selectedReviewMed.fda_label_url && (
                          <a
                            href={selectedReviewMed.fda_label_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View on DailyMed <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => clearFDALabel(selectedReviewMed)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => approveFDALabel(selectedReviewMed)}
                          disabled={isApproving === selectedReviewMed.id || selectedReviewMed.content_status === 'approved'}
                        >
                          {isApproving === selectedReviewMed.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="h-[300px] border rounded-lg p-3">
                      {selectedReviewMed.fda_label_data ? (
                        <div className="space-y-3 text-sm">
                          {/* Boxed Warning */}
                          {selectedReviewMed.fda_label_data.warnings_and_precautions?.boxed_warning && (
                            <div className="p-2 border-2 border-destructive rounded bg-destructive/5">
                              <div className="flex items-center gap-2 mb-1 text-destructive">
                                <AlertOctagon className="w-4 h-4" />
                                <span className="font-bold text-xs">BOXED WARNING</span>
                              </div>
                              <p className="text-xs">{selectedReviewMed.fda_label_data.warnings_and_precautions.boxed_warning}</p>
                            </div>
                          )}

                          {/* Dosage */}
                          {selectedReviewMed.fda_label_data.dosage_and_administration?.recommended_dosage && (
                            <div>
                              <span className="font-medium">Dosage:</span>
                              <p className="text-muted-foreground text-xs">
                                {selectedReviewMed.fda_label_data.dosage_and_administration.recommended_dosage}
                              </p>
                            </div>
                          )}

                          {/* Pharmacokinetics */}
                          {selectedReviewMed.fda_label_data.pharmacokinetics?.half_life && (
                            <div>
                              <span className="font-medium">Half-life:</span>
                              <p className="text-muted-foreground text-xs">
                                {selectedReviewMed.fda_label_data.pharmacokinetics.half_life}
                              </p>
                            </div>
                          )}

                          {/* Adverse Reactions */}
                          {selectedReviewMed.fda_label_data.adverse_reactions?.serious?.length > 0 && (
                            <div>
                              <span className="font-medium text-destructive">Serious Reactions:</span>
                              <p className="text-muted-foreground text-xs">
                                {selectedReviewMed.fda_label_data.adverse_reactions.serious.join(', ')}
                              </p>
                            </div>
                          )}

                          {/* Drug Interactions Count */}
                          {selectedReviewMed.fda_label_data.drug_interactions?.length > 0 && (
                            <div>
                              <span className="font-medium">Drug Interactions:</span>
                              <p className="text-muted-foreground text-xs">
                                {selectedReviewMed.fda_label_data.drug_interactions.length} interactions documented
                              </p>
                            </div>
                          )}

                          <Separator />

                          <div className="text-xs text-muted-foreground">
                            <p>Set ID: {selectedReviewMed.fda_set_id}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No FDA label data available</p>
                      )}
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select a medication to preview FDA data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>

      <TabsContent value="openfda">
        <OpenFDALabelSync />
      </TabsContent>

      <TabsContent value="batch">
        <FDABatchImport />
      </TabsContent>

      <TabsContent value="batch-extract">
        <FDABatchExtract />
      </TabsContent>
    </Tabs>
  );
};

interface LabelSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  badge?: number;
  children: React.ReactNode;
}

const LabelSection = ({ title, isExpanded, onToggle, badge, children }: LabelSectionProps) => (
  <Collapsible open={isExpanded} onOpenChange={onToggle}>
    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{title}</span>
        {badge !== undefined && badge > 0 && (
          <Badge variant="secondary" className="text-xs">{badge}</Badge>
        )}
      </div>
      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </CollapsibleTrigger>
    <CollapsibleContent className="p-2 pt-0">
      {children}
    </CollapsibleContent>
  </Collapsible>
);

export default FDALabelSync;
