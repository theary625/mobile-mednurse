import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, Pill, Clock, TrendingUp, X, ChevronRight, Activity, Hand, Loader2, WifiOff, RefreshCw, Trash2 } from 'lucide-react';
import { Medication } from '@/types/clinical';
import { useErrorsPreventedFeedback } from '@/hooks/useErrorsPreventedFeedback';
import { ScrollArea } from '@/components/ui/scroll-area';
import MedicationDetailView from '@/components/medications/MedicationDetailView';
import { toast } from 'sonner';
import { isConnectivityError, clearStaleSession } from '@/lib/supabase-helpers';
import { useConnectivityOptional } from '@/contexts/ConnectivityContext';

const RECENT_SEARCHES_KEY = 'mednurse_recent_med_searches';
const MAX_RECENT_SEARCHES = 4;
const SEARCH_DEBOUNCE_MS = 300;

const MedicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [popularMeds, setPopularMeds] = useState<Medication[]>([]);
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [recentMeds, setRecentMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const { feedback, triggerFeedback, closeFeedback } = useErrorsPreventedFeedback();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const medParamProcessedRef = useRef<string | null>(null);
  const connectivity = useConnectivityOptional();

  // Type for medication with selected route
  interface MedicationRouteEntry {
    medication: Medication;
    route: string;
    uniqueKey: string;
  }

  useEffect(() => {
    fetchPopularMedications();
    loadRecentSearches();
  }, []);

  // Handle deep link to specific medication via URL param
  useEffect(() => {
    const medParam = searchParams.get('med');

    // If the param is not present, allow future deep-links (including the same medication)
    if (!medParam) {
      medParamProcessedRef.current = null;
      return;
    }
    
    // Skip if no med param or already processed this param
    if (medParamProcessedRef.current === medParam) {
      return;
    }
    
    // Mark as being processed
    medParamProcessedRef.current = medParam;
    
    // Search for the medication by name
    const searchAndSelectMedication = async () => {
      try {
        console.log('Searching for medication:', medParam);
        const { data, error } = await supabase
          .rpc('search_medications', { 
            search_query: medParam,
            max_results: 10 
          });

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Find exact match or first result
          const exactMatch = (data as unknown as Medication[]).find(
            m => m.generic_name.toLowerCase() === medParam.toLowerCase() ||
                 m.brand_names?.some(b => b.toLowerCase() === medParam.toLowerCase())
          );
          const medToSelect = exactMatch || (data[0] as unknown as Medication);
          console.log('Selected medication:', medToSelect.generic_name);
          setSelectedMed(medToSelect);
          
          // Save to recent searches inline to avoid dependency issues
          setRecentSearches(prev => {
            const filtered = prev.filter(name => name !== medToSelect.generic_name);
            const updated = [medToSelect.generic_name, ...filtered].slice(0, MAX_RECENT_SEARCHES);
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
            return updated;
          });
          
          // Clear the URL param after selection
          setSearchParams({}, { replace: true });
        } else {
          console.log('No medication found for:', medParam);
          toast.error(`Medication "${medParam}" not found`);
        }
      } catch (err) {
        console.error('Error finding medication from URL:', err);
        toast.error('Failed to load medication');
      }
    };
    
    searchAndSelectMedication();
  }, [searchParams, setSearchParams]);

  // Fetch recent medications when recentSearches changes
  useEffect(() => {
    if (recentSearches.length > 0) {
      fetchRecentMedications(recentSearches);
    }
  }, [recentSearches]);

  // Debounced server-side search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length < 1) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      searchMedications(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch only popular/high-alert medications for initial display
  const fetchPopularMedications = async () => {
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('high_alert', true)
        .order('generic_name')
        .limit(8);

      if (error) {
        if (isConnectivityError(error)) {
          setLoadError('Unable to connect to server. Please check your connection.');
        } else {
          throw error;
        }
        return;
      }
      setPopularMeds((data || []) as unknown as Medication[]);
    } catch (err) {
      console.error('Error fetching popular medications:', err);
      if (isConnectivityError(err)) {
        setLoadError('Unable to connect to server. Please check your connection.');
      } else {
        setLoadError('Failed to load medications. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch medications by name for recent searches
  const fetchRecentMedications = async (names: string[]) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .in('generic_name', names);

      if (error) throw error;
      
      // Sort by the order in recentSearches
      const sorted = names
        .map(name => (data || []).find(m => m.generic_name === name))
        .filter(Boolean) as unknown as Medication[];
      
      setRecentMeds(sorted);
    } catch (err) {
      console.error('Error fetching recent medications:', err);
    }
  };

  // Server-side search using the database function
  const searchMedications = async (query: string) => {
    try {
      // Use the database function for comprehensive search
      const { data, error } = await supabase
        .rpc('search_medications', { 
          search_query: query,
          max_results: 100 
        });

      if (error) throw error;
      setSearchResults((data || []) as unknown as Medication[]);
    } catch (err) {
      console.error('Error searching medications:', err);
      toast.error('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const loadRecentSearches = () => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  };

  const saveToRecentSearches = useCallback((medName: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(name => name !== medName);
      const updated = [medName, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setRecentMeds([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleSelectMed = (med: Medication, route?: string) => {
    setSelectedMed(med);
    setSelectedRoute(route || null);
    saveToRecentSearches(med.generic_name);
    setSearchQuery('');
    setShowAutocomplete(false);
    // Trigger feedback for all medication lookups (not just high-alert)
    // Use 'safety_alert' type for high-alert meds for higher prompt rate
    triggerFeedback(
      med.high_alert ? 'safety_alert' : 'medication_lookup', 
      { medicationId: med.id, isHighAlert: med.high_alert }
    );
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Expand medications with multiple routes into separate entries (top 8 entries max)
  const expandedAutocompleteSuggestions: MedicationRouteEntry[] = useMemo(() => {
    const entries: MedicationRouteEntry[] = [];
    
    for (const med of searchResults) {
      const routes = med.route || ['Oral'];
      
      if (routes.length > 1) {
        // Medication has multiple routes - create separate entry for each
        for (const route of routes) {
          entries.push({
            medication: med,
            route: route,
            uniqueKey: `${med.id}-${route}`
          });
        }
      } else {
        // Single route medication
        entries.push({
          medication: med,
          route: routes[0] || 'Oral',
          uniqueKey: `${med.id}-${routes[0] || 'Oral'}`
        });
      }
      
      // Limit to 8 entries for performance
      if (entries.length >= 8) break;
    }
    
    return entries.slice(0, 8);
  }, [searchResults]);

  // Get route icon/color based on route type
  const getRouteStyle = (route: string) => {
    const routeLower = route.toLowerCase();
    if (routeLower.includes('iv') || routeLower.includes('intravenous')) {
      return { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'IV' };
    }
    if (routeLower.includes('im') || routeLower.includes('intramuscular')) {
      return { bg: 'bg-purple-500/10', text: 'text-purple-600', label: 'IM' };
    }
    if (routeLower.includes('subq') || routeLower.includes('subcutaneous') || routeLower.includes('sc')) {
      return { bg: 'bg-orange-500/10', text: 'text-orange-600', label: 'SubQ' };
    }
    if (routeLower.includes('po') || routeLower.includes('oral')) {
      return { bg: 'bg-green-500/10', text: 'text-green-600', label: 'PO' };
    }
    if (routeLower.includes('topical')) {
      return { bg: 'bg-teal-500/10', text: 'text-teal-600', label: 'Topical' };
    }
    if (routeLower.includes('inhal') || routeLower.includes('nebul')) {
      return { bg: 'bg-sky-500/10', text: 'text-sky-600', label: 'Inhalation' };
    }
    if (routeLower.includes('rect') || routeLower.includes('pr')) {
      return { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'PR' };
    }
    if (routeLower.includes('nasal')) {
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-600', label: 'Nasal' };
    }
    if (routeLower.includes('ophthalmic') || routeLower.includes('eye')) {
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-600', label: 'Ophthalmic' };
    }
    if (routeLower.includes('otic') || routeLower.includes('ear')) {
      return { bg: 'bg-rose-500/10', text: 'text-rose-600', label: 'Otic' };
    }
    return { bg: 'bg-muted', text: 'text-muted-foreground', label: route };
  };

  const handleMedicationUpdate = (updatedMedication: Medication) => {
    setSelectedMed(updatedMedication);
    // Update in search results if present
    setSearchResults(prev => prev.map(m => 
      m.id === updatedMedication.id ? updatedMedication : m
    ));
    // Update in popular meds if present
    setPopularMeds(prev => prev.map(m => 
      m.id === updatedMedication.id ? updatedMedication : m
    ));
  };

  const showSearchResults = searchQuery.length >= 1;

  // Detail view for selected medication
  if (selectedMed) {
    return (
      <MedicationDetailView
        medication={selectedMed}
        selectedRoute={selectedRoute}
        allMedications={[...searchResults, ...popularMeds, ...recentMeds]}
        onBack={() => {
          setSelectedMed(null);
          setSelectedRoute(null);
        }}
        onSelectMedication={(med) => handleSelectMed(med)}
        onRouteChange={(route) => setSelectedRoute(route)}
        feedback={feedback}
        onTriggerFeedback={triggerFeedback}
        onCloseFeedback={closeFeedback}
        onMedicationUpdate={handleMedicationUpdate}
      />
    );
  }

  // Error state handler
  const handleRetry = () => {
    setLoading(true);
    setLoadError(null);
    fetchPopularMedications();
  };

  const handleClearAndReload = () => {
    clearStaleSession();
    window.location.reload();
  };

  // Error state UI
  if (loadError) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Medications</h1>
          <p className="text-muted-foreground text-sm">Search drug information & dosing guides</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mx-auto mb-4">
              <WifiOff className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Unable to Load Medications
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-6">
              {loadError}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleRetry}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAndReload}
                className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear & Reload
              </Button>
            </div>
            <p className="text-xs text-amber-500 dark:text-amber-500 mt-4">
              If this issue persists, try clearing your browser's site data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main search view
  return (
    <div className="min-h-full flex flex-col">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Medications</h1>
        <p className="text-muted-foreground text-sm">Search drug information & dosing guides</p>
      </div>

      {/* Search Bar with Autocomplete */}
      <div className="relative mb-6" ref={searchContainerRef}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          placeholder="Search by name, brand, or class..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowAutocomplete(true);
          }}
          onFocus={() => searchQuery.length >= 1 && setShowAutocomplete(true)}
          className="pl-12 pr-10 h-14 rounded-2xl border-border/50 bg-muted/30 text-base shadow-sm focus:bg-background focus:shadow-md transition-all"
          autoComplete="off"
        />
        {searching && (
          <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin z-10" />
        )}
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowAutocomplete(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Autocomplete Dropdown */}
        {showAutocomplete && searchQuery.length >= 1 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto">
            {searching ? (
              <div className="p-4 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            ) : expandedAutocompleteSuggestions.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground text-sm">No medications found</p>
              </div>
            ) : (
              <div className="py-2">
                {expandedAutocompleteSuggestions.map((entry, index) => {
                  const med = entry.medication;
                  const routeStyle = getRouteStyle(entry.route);
                  const hasMultipleRoutes = (med.route?.length || 0) > 1;
                  
                  return (
                    <button
                      key={entry.uniqueKey}
                      onClick={() => handleSelectMed(med, entry.route)}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left ${
                        index !== expandedAutocompleteSuggestions.length - 1 ? 'border-b border-border/30' : ''
                      }`}
                    >
                      {/* Medication Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        med.high_alert 
                          ? 'bg-destructive/10' 
                          : med.controlled_substance 
                            ? 'bg-amber-500/10' 
                            : 'bg-primary/10'
                      }`}>
                        {med.image_url ? (
                          <img src={med.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Pill className={`w-5 h-5 ${
                            med.high_alert 
                              ? 'text-destructive' 
                              : med.controlled_substance 
                                ? 'text-amber-600' 
                                : 'text-primary'
                          }`} />
                        )}
                      </div>
                      
                      {/* Medication Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground truncate">
                            {med.brand_names?.[0] || med.generic_name}
                          </span>
                          {med.high_alert && (
                            <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                              HIGH ALERT
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate italic">
                          {med.generic_name}
                        </p>
                      </div>
                      
                      {/* Route Badge - Prominent for multi-route meds */}
                      <div className={`px-2.5 py-1 rounded-lg ${routeStyle.bg} ${hasMultipleRoutes ? 'ring-2 ring-offset-1 ring-primary/20' : ''}`}>
                        <span className={`text-xs font-bold ${routeStyle.text}`}>
                          {routeStyle.label}
                        </span>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  );
                })}
                
                {/* View All Results */}
                {searchResults.length > 8 && (
                  <button
                    onClick={() => setShowAutocomplete(false)}
                    className="w-full px-4 py-3 text-center text-sm text-primary hover:bg-primary/5 transition-colors font-medium"
                  >
                    View all {searchResults.length} results
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Results - Card Grid */}
      {showSearchResults && (
        <div className="mb-6 flex-1">
          {searching ? (
            <div className="p-6 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground text-sm">No medications found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[calc(100vh-280px)] pb-4">
                {searchResults.map((med) => (
                  <MedicationCard 
                    key={med.id} 
                    medication={med} 
                    onClick={() => handleSelectMed(med)} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Recent Searches & Popular - Only show when not searching */}
      {!showSearchResults && (
        <div className="flex-1 space-y-8">
          {/* Recent Searches */}
          {recentMeds.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Recent Searches</span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recentMeds.map((med) => (
                  <MedicationCard 
                    key={med.id} 
                    medication={med} 
                    onClick={() => handleSelectMed(med)} 
                    compact 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular Medications - Card Grid */}
          <section>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Popular Medications</span>
            </div>
            {loading ? (
              <div className="p-6 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {popularMeds.map((med) => (
                  <MedicationCard 
                    key={med.id} 
                    medication={med} 
                    onClick={() => handleSelectMed(med)} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

// Medication Card Component
interface MedicationCardProps {
  medication: Medication;
  onClick: () => void;
  compact?: boolean;
}

const MedicationCard = ({ medication, onClick, compact = false }: MedicationCardProps) => {
  const brandName = medication.brand_names?.[0] || medication.generic_name;
  const routes = medication.route?.join(', ') || 'Oral';
  const strengths = (medication as any).strengths?.join(', ') || null;
  const dosageForm = (medication as any).dosage_form || null;
  const ndcCode = (medication as any).ndc_code || null;
  const manufacturer = (medication as any).manufacturer || null;
  
  // Determine header color based on medication type
  const getHeaderStyle = () => {
    if (medication.high_alert) {
      return 'bg-gradient-to-r from-destructive to-destructive/80';
    }
    if (medication.controlled_substance) {
      return 'bg-gradient-to-r from-amber-600 to-amber-500';
    }
    return 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)]';
  };

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left rounded-2xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]"
      >
        <div className={`px-4 py-3 ${getHeaderStyle()}`}>
          <div className="flex items-center gap-2">
            {/* Small medication image */}
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {medication.image_url ? (
                <img src={medication.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <Pill className="w-4 h-4 text-white/80" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white truncate">{brandName}</h3>
              <p className="text-white/80 text-xs italic truncate">{medication.generic_name}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 flex-shrink-0" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01]"
    >
      {/* Colored Header */}
      <div className={`px-4 py-4 ${getHeaderStyle()}`}>
        <div className="flex items-start gap-3">
          {/* Medication Image */}
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {medication.image_url ? (
              <img 
                src={medication.image_url} 
                alt={medication.generic_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Pill className="w-7 h-7 text-white/80" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg truncate">{brandName}</h3>
            <p className="text-white/80 text-sm italic truncate">{medication.generic_name}</p>
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            {medication.high_alert && (
              <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 hover:bg-white/30">
                HIGH ALERT
              </Badge>
            )}
            {medication.controlled_substance && (
              <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 hover:bg-white/30">
                Controlled
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 space-y-3">
        {/* Row 1: Drug Class & Route */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">Drug Class</p>
            <div className="bg-muted/60 rounded-lg px-3 py-2">
              <p className="text-xs font-medium truncate">{medication.drug_class || 'N/A'}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">Route</p>
            <div className="bg-primary/10 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-primary truncate">{routes}</p>
            </div>
          </div>
        </div>

        {/* Row 2: Dosage Form & Strengths */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Dosage Form</p>
            <div className="bg-muted/40 rounded-lg px-3 py-2">
              <p className="text-xs font-medium truncate">{dosageForm || 'N/A'}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Strengths</p>
            <div className="bg-muted/40 rounded-lg px-3 py-2">
              <p className="text-xs font-medium truncate">{strengths || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Row 3: NDC & Manufacturer */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">NDC Code</p>
            <div className="bg-muted/40 rounded-lg px-3 py-2">
              <p className="text-xs font-mono truncate">{ndcCode || 'N/A'}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Manufacturer</p>
            <div className="bg-muted/40 rounded-lg px-3 py-2">
              <p className="text-xs font-medium truncate">{manufacturer || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Safety Indicators */}
        {(medication.monitoring || medication.hold_parameters || medication.double_check_required) && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {medication.double_check_required && (
              <span className="text-[10px] px-2 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-full font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> 2x Check
              </span>
            )}
            {medication.monitoring && (
              <span className="text-[10px] px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full font-medium flex items-center gap-1">
                <Activity className="w-3 h-3" /> Monitor
              </span>
            )}
            {medication.hold_parameters && (
              <span className="text-[10px] px-2 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full font-medium flex items-center gap-1">
                <Hand className="w-3 h-3" /> Hold
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default MedicationsPage;
