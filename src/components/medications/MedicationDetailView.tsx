import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Syringe, FileText, Stethoscope } from 'lucide-react';
import { Medication } from '@/types/clinical';
import MedicationHeader from './MedicationHeader';
import NursingQuickGuide from './NursingQuickGuide';
import NursingBedsideGuide from './NursingBedsideGuide';
import FullDetailsView from './FullDetailsView';
import AlternativeRoutesCard from './AlternativeRoutesCard';
import FiveRightsSafetyCheck from './FiveRightsSafetyCheck';
import ErrorsPreventedPrompt from '@/components/dashboard/ErrorsPreventedPrompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IVDripIcon, IVPushIcon, IVPiggybackIcon } from '@/components/icons/CustomIcons';
import { IVMethod } from './IVMethodSelector';
import { getEffectiveRouteKey, isIVRoute, getAvailableIVMethods } from '@/lib/medicationGuideUtils';

interface MedicationDetailViewProps {
  medication: Medication;
  selectedRoute?: string | null;
  allMedications?: Medication[];
  onBack: () => void;
  onSelectMedication?: (medication: Medication) => void;
  onRouteChange?: (route: string) => void;
  feedback: { interactionType: string; medicationId?: string; toolId?: string } | null;
  onTriggerFeedback: (type: string, context?: Record<string, string>) => void;
  onCloseFeedback: () => void;
  onMedicationUpdate?: (updatedMedication: Medication) => void;
}

const MedicationDetailView = ({ 
  medication, 
  selectedRoute,
  allMedications = [],
  onBack, 
  onSelectMedication,
  onRouteChange,
  feedback, 
  onTriggerFeedback, 
  onCloseFeedback,
  onMedicationUpdate
}: MedicationDetailViewProps) => {
  const [activeView, setActiveView] = useState<'nursing' | 'details'>('details');
  const [internalRoute, setInternalRoute] = useState<string | null>(selectedRoute || null);
  const [selectedIVMethod, setSelectedIVMethod] = useState<IVMethod | null>(null);
  
  const currentRoute = internalRoute || selectedRoute;
  
  // Compute the effective route key for nursing guide lookup
  const effectiveRouteKey = getEffectiveRouteKey(currentRoute, selectedIVMethod);
  
  // Auto-select first IV method when IV route is selected
  const handleRouteSelect = (route: string) => {
    setInternalRoute(route);
    onRouteChange?.(route);
    
    if (isIVRoute(route)) {
      const availableMethods = getAvailableIVMethods(medication);
      if (availableMethods.length > 0) {
        setSelectedIVMethod(availableMethods[0]);
      }
    } else {
      setSelectedIVMethod(null);
    }
  };

  const handleIVMethodChange = (method: IVMethod | null) => {
    setSelectedIVMethod(method);
  };

  // Get route-specific administration info from new organized structure
  const routeAdminInfo = useMemo(() => {
    const adminInfo = medication.administration_info as Record<string, unknown> | undefined;
    if (!adminInfo) return null;
    
    // New structure: { "IV": {...}, "PO": {...}, "general": {...} }
    // Check if admin info has route-specific keys (new format)
    const hasRouteKeys = Object.keys(adminInfo).some(key => 
      ['IV', 'PO', 'IM', 'SubQ', 'ODT', 'SL', 'PR', 'TOP', 'INH', 'general'].includes(key.toUpperCase()) ||
      ['IV', 'PO', 'IM', 'SubQ', 'ODT', 'SL', 'PR', 'TOP', 'INH', 'general'].includes(key)
    );
    
    if (hasRouteKeys && currentRoute) {
      // Find matching route key (case-insensitive)
      const routeKey = Object.keys(adminInfo).find(
        key => key.toUpperCase() === currentRoute.toUpperCase()
      );
      
      if (routeKey && adminInfo[routeKey]) {
        const routeData = adminInfo[routeKey] as Record<string, unknown>;
        const generalData = adminInfo.general as Record<string, unknown> | undefined;
        
        // Combine route-specific with general info
        return {
          ...routeData,
          ...(generalData ? { general: generalData } : {})
        };
      }
    }
    
    // Fallback for old format - return all admin info
    if (!hasRouteKeys) {
      return adminInfo;
    }
    
    return null;
  }, [medication.administration_info, currentRoute]);

  return (
    <div className="min-h-full">
      <MedicationHeader 
        medication={medication} 
        selectedRoute={currentRoute}
        selectedIVMethod={selectedIVMethod}
        onBack={onBack} 
        onRouteSelect={handleRouteSelect}
        onIVMethodChange={handleIVMethodChange}
        onMedicationUpdate={onMedicationUpdate} 
      />
      
      {/* View Toggle Tabs */}
      <div className="mb-4">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'nursing' | 'details')}>
          <TabsList className="w-full grid grid-cols-2 bg-brand/10 dark:bg-brand-dark/30 p-1 rounded-xl h-auto">
            <TabsTrigger 
              value="nursing" 
              className="rounded-lg py-3 data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:shadow-sm flex items-center gap-2 text-foreground dark:text-foreground"
            >
              <Stethoscope className="w-4 h-4" />
              <span className="font-medium">Nursing Guide</span>
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="rounded-lg py-3 data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:shadow-sm flex items-center gap-2 text-foreground dark:text-foreground"
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">Full Details</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Route-specific Administration Card - shows when a route is selected */}
      {currentRoute && routeAdminInfo && activeView === 'nursing' && (
        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Syringe className="w-4 h-4 text-primary" />
              {currentRoute} Administration
            </CardTitle>
            {/* IV Method Legend - show when IV route with methods */}
            {currentRoute.toUpperCase() === 'IV' && routeAdminInfo.methods && (
              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border/30">
                <span className="text-xs text-muted-foreground">Methods:</span>
                <div className="flex items-center gap-1.5">
                  <IVDripIcon size={18} />
                  <span className="text-xs text-muted-foreground">Drip</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IVPushIcon size={18} />
                  <span className="text-xs text-muted-foreground">Push</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IVPiggybackIcon size={18} />
                  <span className="text-xs text-muted-foreground">Piggyback</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {Object.entries(routeAdminInfo).map(([key, value]) => {
                // Special handling for IV methods (Drip, Push, Piggyback)
                if (key === 'methods' && typeof value === 'object' && value !== null) {
                const getMethodStyle = (method: string) => {
                    const methodLower = method.toLowerCase();
                    if (methodLower.includes('drip')) {
                      return {
                        icon: IVDripIcon,
                        bgColor: 'bg-blue-500/10',
                        borderColor: 'border-blue-500/30',
                        titleColor: 'text-blue-600',
                        isCustomIcon: true
                      };
                    }
                    if (methodLower.includes('push')) {
                      return {
                        icon: IVPushIcon,
                        bgColor: 'bg-amber-500/10',
                        borderColor: 'border-amber-500/30',
                        titleColor: 'text-amber-600',
                        isCustomIcon: true
                      };
                    }
                    if (methodLower.includes('piggyback')) {
                      return {
                        icon: IVPiggybackIcon,
                        bgColor: 'bg-emerald-500/10',
                        borderColor: 'border-emerald-500/30',
                        titleColor: 'text-emerald-600',
                        isCustomIcon: true
                      };
                    }
                    return {
                      icon: Syringe,
                      bgColor: 'bg-muted/50',
                      borderColor: 'border-border/50',
                      titleColor: 'text-foreground',
                      isCustomIcon: false
                    };
                  };

                  return (
                    <div key={key} className="space-y-3">
                      {Object.entries(value as Record<string, Record<string, string>>).map(([methodKey, methodValue]) => {
                        const style = getMethodStyle(methodKey);
                        const IconComponent = style.icon;
                        
                        return (
                          <div 
                            key={methodKey} 
                            className={`p-3 rounded-lg border ${style.bgColor} ${style.borderColor}`}
                          >
                            <h4 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${style.titleColor}`}>
                              {style.isCustomIcon ? (
                                <IconComponent size={20} />
                              ) : (
                                <IconComponent className="w-4 h-4 text-muted-foreground" />
                              )}
                              {methodKey.replace(/_/g, ' ')}
                            </h4>
                            <div className="space-y-1">
                              {Object.entries(methodValue).map(([k, v]) => (
                                <div key={k} className="text-sm">
                                  <span className="font-medium capitalize text-foreground">{k.replace(/_/g, ' ')}:</span>{' '}
                                  <span className="text-muted-foreground">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                
                // Special handling for nested 'general' object
                if (key === 'general' && typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} className="pt-2 border-t border-border/30">
                      <h4 className="font-medium text-xs text-muted-foreground mb-2 uppercase tracking-wide">General Notes</h4>
                      <div className="space-y-1">
                        {Object.entries(value as Record<string, string>).map(([k, v]) => (
                          <div key={k} className="text-sm">
                            <span className="font-medium capitalize text-foreground">{k.replace(/_/g, ' ')}:</span>{' '}
                            <span className="text-muted-foreground">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={key} className="text-sm">
                    {typeof value === 'object' && value !== null ? (
                      <div className="space-y-1">
                        {Object.entries(value as Record<string, string>).map(([k, v]) => (
                          <div key={k}>
                            <span className="font-medium capitalize text-foreground">{k.replace(/_/g, ' ')}:</span>{' '}
                            <span className="text-muted-foreground">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium capitalize text-foreground">{key.replace(/_/g, ' ')}:</span>{' '}
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Alternative Routes Card */}
      {allMedications.length > 0 && onSelectMedication && activeView === 'nursing' && (
        <AlternativeRoutesCard 
          currentMedication={medication}
          allMedications={allMedications}
          onSelectMedication={onSelectMedication}
        />
      )}
      
      {/* Content based on active view */}
      {activeView === 'nursing' ? (
        <div className="space-y-4">
          {/* 5 Rights Safety Check - mirrors bedside cognition */}
          <FiveRightsSafetyCheck 
            medication={medication} 
            selectedRoute={effectiveRouteKey}
          />
          
          {/* New Four-Part Nursing Bedside Guide - use effective route key for IV methods */}
          <NursingBedsideGuide 
            medication={medication} 
            selectedRoute={effectiveRouteKey}
            selectedIVMethod={selectedIVMethod}
          />
          
          {/* Legacy Quick Guide - shown if no nursing_guide data exists */}
          {!medication.nursing_guide && (
            <NursingQuickGuide 
              medication={medication} 
              selectedRoute={effectiveRouteKey}
            />
          )}
          
          {/* Clinical Pearls in nursing view */}
          {medication.clinical_pearls && medication.clinical_pearls.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Clinical Pearls
              </h3>
              <div className="space-y-2">
                {medication.clinical_pearls.map((pearl, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-sm leading-relaxed">{pearl}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <FullDetailsView medication={medication} />
      )}

      {feedback && (
        <ErrorsPreventedPrompt
          interactionType={feedback.interactionType as "clinical_tool" | "dose_calculation" | "medication_lookup" | "safety_alert"}
          medicationId={feedback.medicationId}
          toolId={feedback.toolId}
          onClose={onCloseFeedback}
        />
      )}
    </div>
  );
};

export default MedicationDetailView;
