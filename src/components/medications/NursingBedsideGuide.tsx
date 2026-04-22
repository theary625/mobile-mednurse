import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MedNurseQuickGuide from './MedNurseQuickGuide';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  ChevronDown,
  Hand,
  Syringe,
  Stethoscope,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Clock,
  Shield,
  Activity,
  Droplets,
  FileText
} from 'lucide-react';
import { Medication, NursingGuideRouteContent } from '@/types/clinical';
import { cn } from '@/lib/utils';
import { IVMethod } from './IVMethodSelector';
import { IVDripIcon, IVPushIcon, IVPiggybackIcon } from '@/components/icons/CustomIcons';
import { getIVMethodDisplayInfo, isIVRoute } from '@/lib/medicationGuideUtils';

interface NursingBedsideGuideProps {
  medication: Medication;
  selectedRoute?: string | null;
  selectedIVMethod?: IVMethod | null;
}

const NursingBedsideGuide = ({ medication, selectedRoute, selectedIVMethod }: NursingBedsideGuideProps) => {
  const [openSections, setOpenSections] = useState<string[]>(['appropriateness', 'administration']);
  
  // Map route to nursing_guide key format - try multiple key formats
  const getGuideKey = (route: string | null | undefined): string | null => {
    if (!route) return null;
    const normalized = route.toLowerCase().replace(/\s+/g, '_');
    return normalized;
  };
  
  // Find the matching key in nursing_guide
  const findGuideData = () => {
    if (!medication.nursing_guide || !selectedRoute) return undefined;
    
    const guide = medication.nursing_guide as Record<string, unknown>;
    const normalizedRoute = selectedRoute.toLowerCase().replace(/\s+/g, '_');
    
    // Try exact match first (case-insensitive)
    for (const key of Object.keys(guide)) {
      if (key.toLowerCase() === normalizedRoute) {
        return guide[key] as NursingGuideRouteContent;
      }
    }
    
    // Try matching with cleaned keys
    const cleanRoute = normalizedRoute.replace(/[^a-z0-9_]/g, '');
    for (const key of Object.keys(guide)) {
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (cleanKey === cleanRoute) {
        return guide[key] as NursingGuideRouteContent;
      }
    }
    
    // Try common variations
    const variations = [
      normalizedRoute,
      selectedRoute,
      selectedRoute.toUpperCase(),
      selectedRoute.toLowerCase(),
      ...(normalizedRoute === 'iv' ? ['iv_push', 'IV_Push'] : [])
    ];
    
    for (const variant of variations) {
      if (guide[variant]) {
        return guide[variant] as NursingGuideRouteContent;
      }
    }
    
    return undefined;
  };

  const guideKey = getGuideKey(selectedRoute);
  const routeGuide = findGuideData();

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Get the appropriate icon for the IV method
  const getIVMethodIcon = () => {
    if (!selectedIVMethod) return null;
    switch (selectedIVMethod) {
      case 'Push':
        return <IVPushIcon size={20} />;
      case 'Infusion':
        return <IVDripIcon size={20} />;
      case 'Piggyback':
        return <IVPiggybackIcon size={20} />;
      default:
        return null;
    }
  };

  // Get display label for the current route/method
  const getRouteDisplayLabel = () => {
    if (selectedIVMethod) {
      const methodInfo = getIVMethodDisplayInfo(selectedIVMethod);
      return methodInfo.label;
    }
    return selectedRoute || '';
  };

  // Check if top-level nursing_guide is in the new MedNurse format (not route-keyed)
  const topLevelGuide = medication.nursing_guide as Record<string, unknown> | undefined;
  const isTopLevelMedNurse = topLevelGuide && (
    topLevelGuide.before_you_give || topLevelGuide.what_to_monitor || 
    topLevelGuide.after_you_give || topLevelGuide.high_risk_alerts
  );

  if (!routeGuide && isTopLevelMedNurse) {
    return (
      <MedNurseQuickGuide
        guide={topLevelGuide as any}
        medicationName={medication.generic_name}
        highAlert={medication.high_alert || false}
      />
    );
  }

  // If no nursing guide data, show fallback message
  if (!routeGuide) {
    return (
      <Card className="border-2 border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Nursing Administration Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed nursing guide for this route is being developed. Please refer to facility protocols and drug references.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Detect format: new comprehensive vs legacy simple
  const rawGuide = routeGuide as any;

  // Check for MedNurse Quick Guide format (new standard)
  const isMedNurseFormat = rawGuide.before_you_give || rawGuide.what_to_monitor || rawGuide.after_you_give || rawGuide.high_risk_alerts;
  
  if (isMedNurseFormat) {
    return (
      <MedNurseQuickGuide
        guide={rawGuide}
        medicationName={medication.generic_name}
        highAlert={medication.high_alert || false}
      />
    );
  }
  
  // Check for new gold-standard structure (has indication_check, rate_info object, etc.)
  // Also check for FDA-aligned structure (has fda_indication, contraindications, etc.)
  const isGoldStandard = rawGuide.appropriateness?.indication_check || 
                         rawGuide.appropriateness?.guideline_citation ||
                         rawGuide.administration?.rate_info ||
                         rawGuide.special_prep?.concentration_options ||
                         rawGuide.weaning;
  
  // Check for FDA-aligned structure (4-Factor PCC style)
  const isFDAAligned = rawGuide.appropriateness?.fda_indication || 
                       rawGuide.appropriateness?.contraindications ||
                       rawGuide.dosing?.basis ||
                       rawGuide.thromboembolism_risk ||
                       rawGuide.nursing_pearls;
  
  // Check if this is simple string format (legacy)
  const isSimpleFormat = typeof rawGuide.appropriateness === 'string' || 
                         typeof rawGuide.prep === 'string' ||
                         typeof rawGuide.administration === 'string';

  // For simple format, extract the string values
  if (isSimpleFormat) {
    const simpleGuide = {
      appropriateness: rawGuide.appropriateness || '',
      prep: rawGuide.prep || rawGuide.special_prep || '',
      administration: rawGuide.administration || '',
      post_admin: rawGuide.post_admin || '',
      patient_teaching: rawGuide.patient_teaching || ''
    };

    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {selectedIVMethod ? getIVMethodIcon() : <Shield className="w-5 h-5 text-primary" />}
              {selectedIVMethod ? `${getRouteDisplayLabel()} Administration` : 'Nursing Administration Guide'}
            </CardTitle>
            {selectedRoute && !selectedIVMethod && (
              <Badge variant="outline" className="text-xs">
                {selectedRoute}
              </Badge>
            )}
            {selectedIVMethod && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  selectedIVMethod === 'Push' && "border-amber-500 text-amber-600",
                  selectedIVMethod === 'Infusion' && "border-blue-500 text-blue-600",
                  selectedIVMethod === 'Piggyback' && "border-emerald-500 text-emerald-600"
                )}
              >
                {getIVMethodDisplayInfo(selectedIVMethod).description}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {simpleGuide.appropriateness && (
            <div className="p-3 bg-destructive/10 rounded-lg">
              <p className="text-xs font-semibold text-destructive uppercase mb-1">Right Patient?</p>
              <p className="text-sm">{simpleGuide.appropriateness}</p>
            </div>
          )}
          {simpleGuide.prep && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Preparation</p>
              <p className="text-sm">{simpleGuide.prep}</p>
            </div>
          )}
          {simpleGuide.administration && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs font-semibold text-primary uppercase mb-1">Administration</p>
              <p className="text-sm">{simpleGuide.administration}</p>
            </div>
          )}
          {simpleGuide.post_admin && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-xs font-semibold text-blue-600 uppercase mb-1">After</p>
              <p className="text-sm">{simpleGuide.post_admin}</p>
            </div>
          )}
          {simpleGuide.patient_teaching && (
            <div className="p-3 bg-muted/50 rounded-lg mt-3">
              <p className="text-xs font-semibold uppercase mb-1">Tell Your Patient</p>
              <p className="text-sm italic">{simpleGuide.patient_teaching}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Gold-standard comprehensive format
  if (isGoldStandard) {
    const appropriateness = rawGuide.appropriateness || {};
    const special_prep = rawGuide.special_prep || {};
    const administration = rawGuide.administration || {};
    const post_admin = rawGuide.post_admin || {};
    const patient_teaching = rawGuide.patient_teaching || {};
    const weaning = rawGuide.weaning || {};

    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {selectedIVMethod ? getIVMethodIcon() : <Shield className="w-5 h-5 text-primary" />}
              {selectedIVMethod ? `${getRouteDisplayLabel()} Administration` : 'Nursing Administration Guide'}
            </CardTitle>
            {selectedRoute && !selectedIVMethod && (
              <Badge variant="outline" className="text-xs">
                {selectedRoute}
              </Badge>
            )}
            {selectedIVMethod && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  selectedIVMethod === 'Push' && "border-amber-500 text-amber-600",
                  selectedIVMethod === 'Infusion' && "border-blue-500 text-blue-600",
                  selectedIVMethod === 'Piggyback' && "border-emerald-500 text-emerald-600"
                )}
              >
                {getIVMethodDisplayInfo(selectedIVMethod).description}
              </Badge>
            )}
          </div>
          {appropriateness.guideline_citation && (
            <p className="text-xs text-muted-foreground mt-1">
              📚 {appropriateness.guideline_citation}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="pt-0 space-y-2">
          {/* Section 1: Right Patient? */}
          <Collapsible 
            open={openSections.includes('appropriateness')} 
            onOpenChange={() => toggleSection('appropriateness')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                "bg-destructive/10 hover:bg-destructive/15 border border-destructive/20"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-destructive">1</span>
                  </div>
                  <Hand className="w-4 h-4 text-destructive" />
                  <span className="font-medium text-sm">Right Patient?</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  openSections.includes('appropriateness') && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-destructive/5 rounded-b-lg border-x border-b border-destructive/20">
                {/* Indication Check */}
                {appropriateness.indication_check && (
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      INDICATION
                    </p>
                    <p className="text-sm">{appropriateness.indication_check}</p>
                  </div>
                )}
                
                {/* Hold Conditions */}
                {(appropriateness.hold_conditions?.length > 0 || appropriateness.hold_if?.length > 0) && (
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      HOLD IF
                    </p>
                    <ul className="space-y-1">
                      {(appropriateness.hold_conditions || appropriateness.hold_if || []).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-destructive mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Required Labs */}
                {appropriateness.required_labs?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <FlaskConical className="w-3 h-3" />
                      REQUIRED LABS
                    </p>
                    <ul className="space-y-1">
                      {appropriateness.required_labs.map((lab: string, idx: number) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span>{lab}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Allergy Alerts */}
                {appropriateness.allergy_alerts && (
                  <div>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      ALLERGY ALERT
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {typeof appropriateness.allergy_alerts === 'string' 
                        ? appropriateness.allergy_alerts 
                        : appropriateness.allergy_alerts.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section 2: Special Prep */}
          <Collapsible 
            open={openSections.includes('special_prep')} 
            onOpenChange={() => toggleSection('special_prep')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                "bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">2</span>
                  </div>
                  <Syringe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-medium text-sm">Special Prep?</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  openSections.includes('special_prep') && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-b-lg border-x border-b border-amber-200 dark:border-amber-800">
                {/* Concentration Options */}
                {special_prep.concentration_options?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      CONCENTRATION OPTIONS
                    </p>
                    <div className="space-y-2">
                      {special_prep.concentration_options.map((opt: any, idx: number) => (
                        <div key={idx} className="bg-background/50 rounded-lg p-2 border border-border/50">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{opt.name}</span>
                            <Badge variant="secondary" className="text-xs">{opt.final_concentration}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{opt.mix}</p>
                          {opt.use_case && (
                            <p className="text-xs text-primary mt-1">→ {opt.use_case}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Line Requirements */}
                {special_prep.line_requirements && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      📍 LINE REQUIREMENTS
                    </p>
                    <div className="space-y-1.5 text-sm">
                      {special_prep.line_requirements.preferred && (
                        <p><span className="font-medium text-green-600">Preferred:</span> {special_prep.line_requirements.preferred}</p>
                      )}
                      {special_prep.line_requirements.peripheral_acceptable && (
                        <p><span className="font-medium text-amber-600">Peripheral:</span> {special_prep.line_requirements.peripheral_acceptable}</p>
                      )}
                      {special_prep.line_requirements.rationale && (
                        <p className="text-xs text-muted-foreground italic mt-1">💡 {special_prep.line_requirements.rationale}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Compatibility Note */}
                {special_prep.compatibility_note && (
                  <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1">COMPATIBILITY</p>
                    <p className="text-sm">{special_prep.compatibility_note}</p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section 3: Giving It */}
          <Collapsible 
            open={openSections.includes('administration')} 
            onOpenChange={() => toggleSection('administration')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                "bg-primary/10 hover:bg-primary/15 border border-primary/20"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Giving It</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  openSections.includes('administration') && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-primary/5 rounded-b-lg border-x border-b border-primary/20">
                {/* Dosing Units */}
                {administration.dosing_units && (
                  <div className="bg-background/50 rounded-lg p-2 border border-primary/20">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1">DOSING UNITS</p>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      {administration.dosing_units.adults && (
                        <p><span className="font-medium">Adults:</span> {administration.dosing_units.adults}</p>
                      )}
                      {administration.dosing_units.pediatrics && (
                        <p><span className="font-medium">Peds:</span> {administration.dosing_units.pediatrics}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Rate Info */}
                {administration.rate_info && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      ⏱️ DOSING
                    </p>
                    <div className="space-y-1.5 text-sm">
                      {administration.rate_info.adult_initial && (
                        <p><span className="font-medium text-primary">Start:</span> {administration.rate_info.adult_initial}</p>
                      )}
                      {administration.rate_info.adult_titration && (
                        <p><span className="font-medium text-primary">Titrate:</span> {administration.rate_info.adult_titration}</p>
                      )}
                      {administration.rate_info.adult_usual_range && (
                        <p><span className="font-medium">Usual:</span> {administration.rate_info.adult_usual_range}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Titration Goal */}
                {administration.titration_goal && (
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2 border border-green-200 dark:border-green-800">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase">🎯 GOAL</p>
                    <p className="text-sm">{administration.titration_goal}</p>
                  </div>
                )}

                {/* Max Rate */}
                {administration.max_rate && (
                  <div className="bg-destructive/10 rounded-lg p-2 border border-destructive/20">
                    <p className="text-xs font-semibold text-destructive uppercase">⚠️ MAX RATE</p>
                    <p className="text-sm font-medium">{administration.max_rate.threshold || administration.max_rate}</p>
                    {administration.max_rate.guidance && (
                      <p className="text-xs text-muted-foreground mt-1">{administration.max_rate.guidance}</p>
                    )}
                  </div>
                )}

                {/* Pump Requirement */}
                {administration.pump_requirement && (
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                    ⚠️ {administration.pump_requirement}
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section 4: Weaning (if exists) */}
          {weaning && (weaning.criteria || weaning.method) && (
            <Collapsible 
              open={openSections.includes('weaning')} 
              onOpenChange={() => toggleSection('weaning')}
            >
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                  "bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 border border-green-200 dark:border-green-800"
                )}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700 dark:text-green-300">↓</span>
                    </div>
                    <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-sm">Weaning</span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    openSections.includes('weaning') && "rotate-180"
                  )} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-3 bg-green-50/50 dark:bg-green-950/20 rounded-b-lg border-x border-b border-green-200 dark:border-green-800">
                  {weaning.criteria?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5">READY TO WEAN WHEN:</p>
                      <ul className="space-y-1">
                        {weaning.criteria.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {weaning.method && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1">METHOD</p>
                      <p className="text-sm">{weaning.method}</p>
                    </div>
                  )}
                  {weaning.caution && (
                    <p className="text-sm text-amber-700 dark:text-amber-300">⚠️ {weaning.caution}</p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Section 5: After Administration */}
          <Collapsible 
            open={openSections.includes('post_admin')} 
            onOpenChange={() => toggleSection('post_admin')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">4</span>
                  </div>
                  <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-sm">After</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  openSections.includes('post_admin') && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-b-lg border-x border-b border-blue-200 dark:border-blue-800">
                {/* Reassess Timing */}
                {post_admin.reassess_at && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1.5">🔄 REASSESS</p>
                    {Array.isArray(post_admin.reassess_at) ? (
                      <ul className="space-y-1">
                        {post_admin.reassess_at.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">{post_admin.reassess_at}</p>
                    )}
                  </div>
                )}

                {/* Monitor For */}
                {post_admin.monitor_for?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1.5">👁️ MONITOR</p>
                    <ul className="space-y-1">
                      {post_admin.monitor_for.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extravasation Protocol */}
                {post_admin.extravasation_protocol && (
                  <div className="bg-destructive/10 rounded-lg p-2 border border-destructive/20">
                    <p className="text-xs font-semibold text-destructive uppercase mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      EXTRAVASATION PROTOCOL
                    </p>
                    <div className="space-y-1 text-sm">
                      {post_admin.extravasation_protocol.recognition && (
                        <p><span className="font-medium">Signs:</span> {post_admin.extravasation_protocol.recognition}</p>
                      )}
                      {post_admin.extravasation_protocol.immediate_action && (
                        <p><span className="font-medium text-destructive">Action:</span> {post_admin.extravasation_protocol.immediate_action}</p>
                      )}
                      {post_admin.extravasation_protocol.antidote && (
                        <p><span className="font-medium text-primary">Antidote:</span> {post_admin.extravasation_protocol.antidote}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Patient Teaching - Always visible */}
          {(patient_teaching.what_to_tell_patient || patient_teaching.tell_patient || patient_teaching.report_immediately) && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Tell Your Patient</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                {/* What to tell */}
                {(patient_teaching.what_to_tell_patient || patient_teaching.tell_patient) && (
                  <div>
                    {Array.isArray(patient_teaching.what_to_tell_patient) ? (
                      <ul className="space-y-1">
                        {patient_teaching.what_to_tell_patient.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm italic flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>"{item}"</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic">"{patient_teaching.tell_patient || patient_teaching.what_to_tell_patient}"</p>
                    )}
                  </div>
                )}
                
                {/* Report Immediately */}
                {patient_teaching.report_immediately?.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-destructive mb-1">⚠️ Report immediately:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                      {patient_teaching.report_immediately.map((item: string, idx: number) => (
                        <li key={idx} className="text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // FDA-aligned format (e.g., 4-Factor PCC / KCENTRA)
  if (isFDAAligned) {
    const appropriateness = rawGuide.appropriateness || {};
    const dosing = rawGuide.dosing || {};
    const administration = rawGuide.administration || {};
    const monitoring = rawGuide.monitoring || {};
    const thromboembolism = rawGuide.thromboembolism_risk || {};
    const comparison = rawGuide.comparison || {};
    const patient_teaching = rawGuide.patient_teaching || {};
    const doc_checklist = rawGuide.documentation_checklist || {};
    const nursing_pearls = rawGuide.nursing_pearls || [];
    const what_it_is = rawGuide.what_it_is || {};

    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {selectedIVMethod ? getIVMethodIcon() : <Shield className="w-5 h-5 text-primary" />}
              {selectedIVMethod ? `${getRouteDisplayLabel()} Administration` : 'Nursing Administration Guide'}
            </CardTitle>
            <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
              FDA-Aligned
            </Badge>
          </div>
          {what_it_is.description && (
            <p className="text-xs text-muted-foreground mt-1">{what_it_is.description}</p>
          )}
        </CardHeader>
        
        <CardContent className="pt-0 space-y-2">
          {/* FDA Indication & Appropriateness */}
          <Collapsible 
            open={openSections.includes('appropriateness')} 
            onOpenChange={() => toggleSection('appropriateness')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                "bg-destructive/10 hover:bg-destructive/15 border border-destructive/20"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-destructive">1</span>
                  </div>
                  <Hand className="w-4 h-4 text-destructive" />
                  <span className="font-medium text-sm">Right Patient?</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  openSections.includes('appropriateness') && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-destructive/5 rounded-b-lg border-x border-b border-destructive/20">
                {/* FDA Indication */}
                {appropriateness.fda_indication && (
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      FDA INDICATION
                    </p>
                    <p className="text-sm">{appropriateness.fda_indication}</p>
                  </div>
                )}
                
                {/* Not Indicated For */}
                {appropriateness.not_indicated_for && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase mb-1">⚠️ NOT INDICATED FOR</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">{appropriateness.not_indicated_for}</p>
                  </div>
                )}
                
                {/* Contraindications */}
                {appropriateness.contraindications?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      CONTRAINDICATIONS
                    </p>
                    <ul className="space-y-1">
                      {appropriateness.contraindications.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-destructive mt-1">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Required Labs */}
                {appropriateness.required_labs?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <FlaskConical className="w-3 h-3" />
                      REQUIRED LABS
                    </p>
                    <ul className="space-y-1">
                      {appropriateness.required_labs.map((lab: string, idx: number) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span>{lab}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Allergy Alerts */}
                {appropriateness.allergy_alerts?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      ALLERGY ALERT
                    </p>
                    <ul className="space-y-1">
                      {appropriateness.allergy_alerts.map((alert: string, idx: number) => (
                        <li key={idx} className="text-sm text-amber-700 dark:text-amber-300">{alert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Dosing Section */}
          {(dosing.basis || dosing.inr_2_to_less_than_4) && (
            <Collapsible 
              open={openSections.includes('dosing')} 
              onOpenChange={() => toggleSection('dosing')}
            >
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                  "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
                )}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">2</span>
                    </div>
                    <FlaskConical className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-sm">Dosing (FDA-Labeled)</span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    openSections.includes('dosing') && "rotate-180"
                  )} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-b-lg border-x border-b border-blue-200 dark:border-blue-800">
                  {dosing.basis && (
                    <p className="text-sm font-medium">{dosing.basis}</p>
                  )}
                  {dosing.weight_cap && (
                    <p className="text-sm text-amber-700 dark:text-amber-300">⚠️ {dosing.weight_cap}</p>
                  )}
                  
                  {/* INR-based dosing table */}
                  <div className="space-y-2">
                    {dosing.inr_2_to_less_than_4 && (
                      <div className="bg-background/50 rounded-lg p-2 border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">INR 2 to &lt;4</span>
                          <Badge variant="secondary" className="text-xs">{dosing.inr_2_to_less_than_4.dose}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Max: {dosing.inr_2_to_less_than_4.max}</p>
                      </div>
                    )}
                    {dosing.inr_4_to_6 && (
                      <div className="bg-background/50 rounded-lg p-2 border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">INR 4 to 6</span>
                          <Badge variant="secondary" className="text-xs">{dosing.inr_4_to_6.dose}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Max: {dosing.inr_4_to_6.max}</p>
                      </div>
                    )}
                    {dosing.inr_greater_than_6 && (
                      <div className="bg-background/50 rounded-lg p-2 border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">INR &gt;6</span>
                          <Badge variant="secondary" className="text-xs">{dosing.inr_greater_than_6.dose}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Max: {dosing.inr_greater_than_6.max}</p>
                      </div>
                    )}
                  </div>
                  
                  {dosing.repeat_dosing && (
                    <div className="bg-destructive/10 rounded-lg p-2 border border-destructive/20">
                      <p className="text-xs font-semibold text-destructive uppercase mb-1">⚠️ REPEAT DOSING</p>
                      <p className="text-sm">{dosing.repeat_dosing}</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Administration Section */}
          <Collapsible 
            open={openSections.includes('administration')} 
            onOpenChange={() => toggleSection('administration')}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                "bg-primary/10 hover:bg-primary/15 border border-primary/20"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Administration</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  openSections.includes('administration') && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-primary/5 rounded-b-lg border-x border-b border-primary/20">
                {/* FDA-Labeled Info */}
                <div className="space-y-2">
                  {administration.route && (
                    <p className="text-sm"><span className="font-medium">Route:</span> {administration.route}</p>
                  )}
                  {administration.rate && (
                    <p className="text-sm"><span className="font-medium">Rate:</span> {administration.rate}</p>
                  )}
                  {administration.max_rate && (
                    <div className="bg-destructive/10 rounded-lg p-2 border border-destructive/20">
                      <p className="text-xs font-semibold text-destructive uppercase">⚠️ MAX RATE</p>
                      <p className="text-sm font-medium">{administration.max_rate}</p>
                    </div>
                  )}
                  {administration.concurrent_therapy && (
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2 border border-green-200 dark:border-green-800">
                      <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase">✓ CONCURRENT THERAPY</p>
                      <p className="text-sm">{administration.concurrent_therapy}</p>
                    </div>
                  )}
                </div>
                
                {/* Facility Practice */}
                {administration.facility_practice && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      FACILITY PRACTICE (NOT FDA-LABELED)
                    </p>
                    <div className="bg-muted/30 rounded-lg p-2 space-y-1 text-sm">
                      {administration.facility_practice.line_type && (
                        <p>📍 {administration.facility_practice.line_type}</p>
                      )}
                      {administration.facility_practice.flush && (
                        <p>💧 {administration.facility_practice.flush}</p>
                      )}
                      {administration.facility_practice.blood_tubing && (
                        <p>🩸 {administration.facility_practice.blood_tubing}</p>
                      )}
                      {administration.facility_practice.reconstitution && (
                        <p>🧪 {administration.facility_practice.reconstitution}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Thromboembolism Risk - Critical Warning */}
          {thromboembolism.warning && (
            <div className="bg-black text-white rounded-lg p-4 border-2 border-black">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-white mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-black uppercase mb-2 tracking-wide">⚠️ {thromboembolism.warning}</p>
                  {thromboembolism.fda_statement && (
                    <p className="text-sm mb-2">{thromboembolism.fda_statement}</p>
                  )}
                  {thromboembolism.watch_for?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs uppercase font-bold mb-1">WATCH FOR:</p>
                      <ul className="grid grid-cols-2 gap-1">
                        {thromboembolism.watch_for.map((item: string, idx: number) => (
                          <li key={idx} className="text-xs flex items-start gap-1">
                            <span className="text-amber-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {thromboembolism.high_risk_patients?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs uppercase font-bold mb-1">HIGH RISK PATIENTS:</p>
                      <ul className="space-y-0.5">
                        {thromboembolism.high_risk_patients.map((item: string, idx: number) => (
                          <li key={idx} className="text-xs">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Monitoring Section */}
          {(monitoring.fda_guidance || monitoring.facility_practice) && (
            <Collapsible 
              open={openSections.includes('monitoring')} 
              onOpenChange={() => toggleSection('monitoring')}
            >
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                  "bg-muted/50 hover:bg-muted border border-border"
                )}>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Monitoring</span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    openSections.includes('monitoring') && "rotate-180"
                  )} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-3 bg-muted/30 rounded-b-lg border-x border-b border-border">
                  {/* FDA Guidance */}
                  {monitoring.fda_guidance && (
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">FDA GUIDANCE</p>
                      {monitoring.fda_guidance.inr_timing && (
                        <p className="text-sm">📋 {monitoring.fda_guidance.inr_timing}</p>
                      )}
                      {monitoring.fda_guidance.thromboembolic_monitoring && (
                        <p className="text-sm">👁️ {monitoring.fda_guidance.thromboembolic_monitoring}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Facility Practice */}
                  {monitoring.facility_practice && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">FACILITY PRACTICE</p>
                      {monitoring.facility_practice.before?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium mb-1">Before:</p>
                          <ul className="space-y-0.5">
                            {monitoring.facility_practice.before.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {monitoring.facility_practice.during?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium mb-1">During:</p>
                          <ul className="space-y-0.5">
                            {monitoring.facility_practice.during.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start gap-1">
                                <Activity className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {monitoring.facility_practice.after?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-1">After:</p>
                          <ul className="space-y-0.5">
                            {monitoring.facility_practice.after.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start gap-1">
                                <Stethoscope className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Comparison Section */}
          {(comparison.vs_ffp || comparison.vs_3factor_pcc) && (
            <Collapsible 
              open={openSections.includes('comparison')} 
              onOpenChange={() => toggleSection('comparison')}
            >
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                  "bg-muted/50 hover:bg-muted border border-border"
                )}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Why 4-Factor PCC?</span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    openSections.includes('comparison') && "rotate-180"
                  )} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-3 bg-muted/30 rounded-b-lg border-x border-b border-border">
                  {comparison.vs_ffp?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5">vs FFP</p>
                      <ul className="space-y-1">
                        {comparison.vs_ffp.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {comparison.vs_3factor_pcc?.length > 0 && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5">vs 3-Factor PCC</p>
                      <ul className="space-y-1">
                        {comparison.vs_3factor_pcc.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Patient Teaching */}
          {(patient_teaching.tell_patient || patient_teaching.report_immediately) && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Tell Your Patient</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                {patient_teaching.tell_patient && (
                  <p className="text-sm italic">"{patient_teaching.tell_patient}"</p>
                )}
                {patient_teaching.what_to_expect && (
                  <p className="text-sm text-muted-foreground">{patient_teaching.what_to_expect}</p>
                )}
                {patient_teaching.report_immediately?.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-destructive mb-1">⚠️ Report immediately:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                      {patient_teaching.report_immediately.map((item: string, idx: number) => (
                        <li key={idx} className="text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nursing Pearls */}
          {nursing_pearls.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Nursing Pearls</span>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <ul className="space-y-1.5">
                  {nursing_pearls.map((pearl: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">💡</span>
                      <span>{pearl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Documentation Checklist */}
          {doc_checklist.items?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Documentation Checklist</span>
                </div>
                {doc_checklist.note && (
                  <Badge variant="outline" className="text-xs">{doc_checklist.note}</Badge>
                )}
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {doc_checklist.items.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Legacy structured format (original component behavior)
  const appropriateness = rawGuide.appropriateness || {};
  const special_prep = rawGuide.special_prep || {};
  const administration = rawGuide.administration || {};
  const post_admin = rawGuide.post_admin || {};
  const patient_teaching = rawGuide.patient_teaching || {};

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Nursing Administration Guide
          </CardTitle>
          {selectedRoute && (
            <Badge variant="outline" className="text-xs">
              {selectedRoute}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Four-part clinical decision flow for safe administration
        </p>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-2">
        {/* Section 1: Is This Right for the Patient? */}
        <Collapsible 
          open={openSections.includes('appropriateness')} 
          onOpenChange={() => toggleSection('appropriateness')}
        >
          <CollapsibleTrigger className="w-full">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors",
              "bg-destructive/10 hover:bg-destructive/15 border border-destructive/20"
            )}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-destructive">1</span>
                </div>
                <Hand className="w-4 h-4 text-destructive" />
                <span className="font-medium text-sm">Right Patient?</span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                openSections.includes('appropriateness') && "rotate-180"
              )} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 space-y-3 bg-destructive/5 rounded-b-lg border-x border-b border-destructive/20">
              {appropriateness.hold_if?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    HOLD IF
                  </p>
                  <ul className="space-y-1">
                    {appropriateness.hold_if.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-destructive mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {appropriateness.required_labs?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <FlaskConical className="w-3 h-3" />
                    MUST KNOW
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {appropriateness.required_labs.map((lab: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {lab}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {appropriateness.allergy_alerts?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    ALLERGY ALERT
                  </p>
                  <ul className="space-y-1">
                    {appropriateness.allergy_alerts.map((alert: string, idx: number) => (
                      <li key={idx} className="text-sm text-amber-700 dark:text-amber-300">
                        {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 2: Any Special Prep? */}
        <Collapsible 
          open={openSections.includes('special_prep')} 
          onOpenChange={() => toggleSection('special_prep')}
        >
          <CollapsibleTrigger className="w-full">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors",
              special_prep.has_special_requirements 
                ? "bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800"
                : "bg-muted/50 hover:bg-muted border border-border"
            )}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  special_prep.has_special_requirements 
                    ? "bg-amber-200 dark:bg-amber-800"
                    : "bg-muted"
                )}>
                  <span className={cn(
                    "text-xs font-bold",
                    special_prep.has_special_requirements 
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-muted-foreground"
                  )}>2</span>
                </div>
                <Syringe className={cn(
                  "w-4 h-4",
                  special_prep.has_special_requirements 
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
                )} />
                <span className="font-medium text-sm">Special Prep?</span>
                {!special_prep.has_special_requirements && (
                  <Badge variant="outline" className="text-xs ml-2 text-green-600 border-green-300">
                    Standard
                  </Badge>
                )}
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                openSections.includes('special_prep') && "rotate-180"
              )} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className={cn(
              "p-3 rounded-b-lg border-x border-b",
              special_prep.has_special_requirements 
                ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                : "bg-muted/30 border-border"
            )}>
              {special_prep.notes && (
                <p className="text-sm">{special_prep.notes}</p>
              )}
              {special_prep.filter_needle && (
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                  ⚠️ Filter needle required
                </p>
              )}
              {special_prep.light_protection && (
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                  ⚠️ Protect from light
                </p>
              )}
              {special_prep.specific_syringe && (
                <p className="text-sm mt-2">
                  💉 Use: {special_prep.specific_syringe}
                </p>
              )}
              {!special_prep.notes && !special_prep.has_special_requirements && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Standard preparation - no special requirements
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 3: Giving It */}
        <Collapsible 
          open={openSections.includes('administration')} 
          onOpenChange={() => toggleSection('administration')}
        >
          <CollapsibleTrigger className="w-full">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors",
              "bg-primary/10 hover:bg-primary/15 border border-primary/20"
            )}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Giving It</span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                openSections.includes('administration') && "rotate-180"
              )} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 space-y-2 bg-primary/5 rounded-b-lg border-x border-b border-primary/20">
              {administration.rate && (
                <div className="flex items-start gap-2">
                  <span className="text-primary font-semibold text-sm">⏱️ Rate:</span>
                  <span className="text-sm">{administration.rate}</span>
                </div>
              )}
              {administration.max_rate && (
                <div className="flex items-start gap-2">
                  <span className="text-destructive font-semibold text-sm">Max:</span>
                  <span className="text-sm">{administration.max_rate}</span>
                </div>
              )}
              {administration.why_rate_matters && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-xs italic">💡 Why: {administration.why_rate_matters}</span>
                </div>
              )}
              {administration.line_type && (
                <div className="flex items-start gap-2">
                  <span className="text-sm">📍 {administration.line_type}</span>
                </div>
              )}
              {administration.flush && (
                <div className="flex items-start gap-2">
                  <span className="text-sm">💧 {administration.flush}</span>
                </div>
              )}
              {administration.timing && (
                <div className="flex items-start gap-2">
                  <span className="text-sm">⏰ {administration.timing}</span>
                </div>
              )}
              {administration.with_food && (
                <div className="flex items-start gap-2">
                  <span className="text-sm">🍽️ {administration.with_food}</span>
                </div>
              )}
              {administration.special_notes && (
                <div className="flex items-start gap-2 pt-1 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">{administration.special_notes}</span>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Section 4: After Administration */}
        <Collapsible 
          open={openSections.includes('post_admin')} 
          onOpenChange={() => toggleSection('post_admin')}
        >
          <CollapsibleTrigger className="w-full">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors",
              "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
            )}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">4</span>
                </div>
                <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-sm">After</span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                openSections.includes('post_admin') && "rotate-180"
              )} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 space-y-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-b-lg border-x border-b border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">🔄 Reassess:</span>
                <span className="text-sm">{post_admin.reassess_timing}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">✓ Expect:</span>
                <span className="text-sm">{post_admin.expected_response}</span>
              </div>
              {post_admin.watch_for?.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">👁️ Watch for:</span>
                  <ul className="mt-1 space-y-0.5">
                    {post_admin.watch_for.map((item: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-center gap-1">
                        <span className="text-muted-foreground">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {post_admin.document?.length > 0 && (
                <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Document:</span>
                  <p className="text-sm mt-0.5">{post_admin.document.join(' • ')}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Patient Teaching - Always visible as it's critical */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Tell Your Patient</span>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-sm italic">"{patient_teaching.tell_patient}"</p>
            
            {patient_teaching.what_to_expect && (
              <p className="text-xs text-muted-foreground">
                ℹ️ {patient_teaching.what_to_expect}
              </p>
            )}
            
            {patient_teaching.report_immediately?.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs font-medium text-destructive mb-1">Report immediately:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                  {patient_teaching.report_immediately.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NursingBedsideGuide;
