import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Pill, Shield, ChevronLeft, Activity, Scale, Droplets, Volume2, Sparkles, Loader2, Calculator, Camera, ImageIcon, X, Check } from 'lucide-react';
import { Medication } from '@/types/clinical';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import IVMethodSelector, { IVMethod } from './IVMethodSelector';
import { getAvailableIVMethods, isIVRoute, getIVMethodKey } from '@/lib/medicationGuideUtils';

// Mapping of medication generic names (lowercase) to their calculator paths
const medicationCalculatorMap: Record<string, { path: string; label: string }> = {
  // High-Alert IV Medications
  'heparin': { path: '/dashboard/calculate?calc=heparin', label: 'Heparin Calculator' },
  'vancomycin': { path: '/dashboard/calculate?calc=vancomycin', label: 'Vancomycin Calculator' },
  'dopamine': { path: '/dashboard/calculate?calc=dopamine', label: 'Dopamine Calculator' },
  'dobutamine': { path: '/dashboard/calculate?calc=dobutamine', label: 'Dobutamine Calculator' },
  'norepinephrine': { path: '/dashboard/calculate?calc=levophed', label: 'Norepinephrine Calculator' },
  'levophed': { path: '/dashboard/calculate?calc=levophed', label: 'Norepinephrine Calculator' },
  'epinephrine': { path: '/dashboard/calculate?calc=epinephrine', label: 'Epinephrine Calculator' },
  'vasopressin': { path: '/dashboard/calculate?calc=vasopressin', label: 'Vasopressin Calculator' },
  'alteplase': { path: '/dashboard/calculate?calc=tpa', label: 'tPA Calculator' },
  'tpa': { path: '/dashboard/calculate?calc=tpa', label: 'tPA Calculator' },
  'tenecteplase': { path: '/dashboard/calculate?calc=tnk', label: 'TNK Calculator' },
  'tnk': { path: '/dashboard/calculate?calc=tnk', label: 'TNK Calculator' },
  'naloxone': { path: '/dashboard/calculate?calc=naloxone', label: 'Naloxone Calculator' },
  'narcan': { path: '/dashboard/calculate?calc=naloxone', label: 'Naloxone Calculator' },
  
  // Insulin
  'insulin': { path: '/dashboard/calculate?calc=sliding-scale', label: 'Insulin Calculator' },
  'insulin regular': { path: '/dashboard/calculate?calc=sliding-scale', label: 'Insulin Calculator' },
  'insulin lispro': { path: '/dashboard/calculate?calc=bolus-insulin', label: 'Bolus Insulin Calculator' },
  'insulin aspart': { path: '/dashboard/calculate?calc=bolus-insulin', label: 'Bolus Insulin Calculator' },
  'insulin glargine': { path: '/dashboard/calculate?calc=basal-insulin', label: 'Basal Insulin Calculator' },
  'lantus': { path: '/dashboard/calculate?calc=basal-insulin', label: 'Basal Insulin Calculator' },
  
  // OB Medications
  'oxytocin': { path: '/dashboard/calculate?calc=oxytocin', label: 'Oxytocin Calculator' },
  'pitocin': { path: '/dashboard/calculate?calc=oxytocin', label: 'Oxytocin Calculator' },
  'magnesium sulfate': { path: '/dashboard/calculate?calc=magnesium-ob', label: 'Magnesium Sulfate (OB) Calculator' },
  
  // Electrolytes
  'potassium chloride': { path: '/dashboard/calculate?calc=potassium', label: 'Potassium Replacement Calculator' },
  'magnesium': { path: '/dashboard/calculate?calc=magnesium', label: 'Magnesium Replacement Calculator' },
  
  // Pain Medications
  'acetaminophen': { path: '/dashboard/calculate?calc=tylenol', label: 'Tylenol Calculator' },
  'tylenol': { path: '/dashboard/calculate?calc=tylenol', label: 'Tylenol Calculator' },
  'ibuprofen': { path: '/dashboard/calculate?calc=motrin', label: 'Motrin Calculator' },
  'motrin': { path: '/dashboard/calculate?calc=motrin', label: 'Motrin Calculator' },
  
  // Anticoagulants
  'warfarin': { path: '/dashboard/calculate?calc=warfarin', label: 'Warfarin Calculator' },
  'coumadin': { path: '/dashboard/calculate?calc=warfarin', label: 'Warfarin Calculator' },
  
  // Contraception
  'medroxyprogesterone': { path: '/dashboard/calculate?calc=depo', label: 'Depo-Provera Calculator' },
  'depo-provera': { path: '/dashboard/calculate?calc=depo', label: 'Depo-Provera Calculator' },
};

interface MedicationHeaderProps {
  medication: Medication;
  selectedRoute?: string | null;
  selectedIVMethod?: IVMethod | null;
  onBack: () => void;
  onRouteSelect?: (route: string) => void;
  onIVMethodChange?: (method: IVMethod | null) => void;
  onMedicationUpdate?: (updatedMedication: Medication) => void;
}

const MedicationHeader = ({ 
  medication, 
  selectedRoute, 
  selectedIVMethod,
  onBack, 
  onRouteSelect, 
  onIVMethodChange,
  onMedicationUpdate 
}: MedicationHeaderProps) => {
  const navigate = useNavigate();
  const safetyBadges = medication.safety_badges;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [generatingPronunciation, setGeneratingPronunciation] = useState(false);
  const [imagePopoverOpen, setImagePopoverOpen] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Detect available IV methods
  const availableIVMethods = getAvailableIVMethods(medication);
  const showIVMethodSelector = isIVRoute(selectedRoute) && availableIVMethods.length > 1;
  
  // Handle route selection - reset IV method when route changes
  const handleRouteSelect = (route: string) => {
    onRouteSelect?.(route);
    // Reset IV method if switching away from IV or to a fresh IV selection
    if (!isIVRoute(route)) {
      onIVMethodChange?.(null);
    } else if (availableIVMethods.length > 0 && !selectedIVMethod) {
      // Auto-select first method when IV is clicked
      onIVMethodChange?.(availableIVMethods[0]);
    }
  };

  // Get route-specific image from nursing_guide or fall back to main image
  const getRouteImage = (route: string | null | undefined): string | null => {
    if (!route) return medication.image_url || null;
    
    const guide = medication.nursing_guide as Record<string, unknown> | undefined;
    if (guide) {
      const normalizedRoute = route.toLowerCase().replace(/\s+/g, '_');
      for (const key of Object.keys(guide)) {
        if (key.toLowerCase() === normalizedRoute || key.toLowerCase().replace(/\s+/g, '_') === normalizedRoute) {
          const routeData = guide[key] as Record<string, unknown> | undefined;
          if (routeData?.image_url) {
            return routeData.image_url as string;
          }
        }
      }
    }
    return medication.image_url || null;
  };

  const currentImage = getRouteImage(selectedRoute);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    }
  };

  const generatePronunciation = async () => {
    setGeneratingPronunciation(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pronunciation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ medicationName: medication.generic_name }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate pronunciation');
      }

      // Save to database
      const { error: updateError } = await supabase
        .from('medications')
        .update({ pronunciation_text: data.pronunciation })
        .eq('id', medication.id);

      if (updateError) throw updateError;

      toast({
        title: "Pronunciation generated",
        description: `Generated: ${data.pronunciation}`,
      });

      // Notify parent to refresh
      if (onMedicationUpdate) {
        onMedicationUpdate({ ...medication, pronunciation_text: data.pronunciation });
      }
    } catch (error) {
      console.error('Error generating pronunciation:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate pronunciation",
        variant: "destructive",
      });
    } finally {
      setGeneratingPronunciation(false);
    }
  };

  const playPronunciation = () => {
    setIsPlaying(true);
    
    // If there's an uploaded audio file, use that
    if (medication.pronunciation_audio_url) {
      const audio = new Audio(medication.pronunciation_audio_url);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => speakWithWebSpeech();
      audio.play().catch(() => speakWithWebSpeech());
    } else {
      speakWithWebSpeech();
    }
  };

  const speakWithWebSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(medication.generic_name);
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  // Check if medication has a calculator
  const getCalculatorInfo = () => {
    const genericName = medication.generic_name.toLowerCase();
    
    // Direct match
    if (medicationCalculatorMap[genericName]) {
      return medicationCalculatorMap[genericName];
    }
    
    // Check brand names
    if (medication.brand_names) {
      for (const brandName of medication.brand_names) {
        const lowerBrand = brandName.toLowerCase();
        if (medicationCalculatorMap[lowerBrand]) {
          return medicationCalculatorMap[lowerBrand];
        }
      }
    }
    
    // Partial match for generic name
    for (const [key, value] of Object.entries(medicationCalculatorMap)) {
      if (genericName.includes(key) || key.includes(genericName)) {
        return value;
      }
    }
    
    return null;
  };

  const calculatorInfo = getCalculatorInfo();

  const handleImageUpload = async (file: File, route: string) => {
    setUploadingImage(true);
    try {
      // Get auth session for the edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: "Not authenticated",
          description: "Please log in to upload images.",
          variant: "destructive",
        });
        setUploadingImage(false);
        return;
      }

      // Use edge function for reliable upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('medicationId', medication.id);
      formData.append('medicationName', medication.generic_name);
      formData.append('route', route); // Include route for route-specific image

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-upload-medication-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      toast({
        title: "Image uploaded",
        description: `Image saved for ${route} route`,
      });

      // Notify parent to refresh with updated nursing_guide
      if (onMedicationUpdate) {
        const normalizedRoute = route.toLowerCase().replace(/\s+/g, '_');
        const currentGuide = (medication.nursing_guide as Record<string, unknown>) || {};
        
        let targetKey = normalizedRoute;
        for (const key of Object.keys(currentGuide)) {
          if (key.toLowerCase() === normalizedRoute || key.toLowerCase().replace(/\s+/g, '_') === normalizedRoute) {
            targetKey = key;
            break;
          }
        }

        const updatedGuide = {
          ...currentGuide,
          [targetKey]: {
            ...(currentGuide[targetKey] as Record<string, unknown> || {}),
            image_url: result.publicUrl
          }
        };

        onMedicationUpdate({ 
          ...medication, 
          nursing_guide: updatedGuide as unknown as Medication['nursing_guide']
        });
      }

      setImagePopoverOpen(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Try using a URL instead.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const saveRouteImage = async (route: string, url: string) => {
    try {
      const normalizedRoute = route.toLowerCase().replace(/\s+/g, '_');
      const currentGuide = (medication.nursing_guide as Record<string, unknown>) || {};
      
      // Find the matching key in the guide
      let targetKey = normalizedRoute;
      for (const key of Object.keys(currentGuide)) {
        if (key.toLowerCase() === normalizedRoute || key.toLowerCase().replace(/\s+/g, '_') === normalizedRoute) {
          targetKey = key;
          break;
        }
      }

      // Update or create the route entry with the image
      const updatedGuide = {
        ...currentGuide,
        [targetKey]: {
          ...(currentGuide[targetKey] as Record<string, unknown> || {}),
          image_url: url
        }
      };

      const { error } = await supabase
        .from('medications')
        .update({ nursing_guide: JSON.parse(JSON.stringify(updatedGuide)) })
        .eq('id', medication.id);

      if (error) throw error;

      toast({
        title: "Image updated",
        description: `Image saved for ${route} route`,
      });

      // Notify parent to refresh
      if (onMedicationUpdate) {
        onMedicationUpdate({ 
          ...medication, 
          nursing_guide: updatedGuide as unknown as Medication['nursing_guide']
        });
      }

      setImagePopoverOpen(null);
      setImageUrl('');
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Save failed",
        description: "Failed to save image URL",
        variant: "destructive",
      });
    }
  };

  const handleUrlSubmit = async (route: string) => {
    if (!imageUrl.trim()) return;
    setUploadingImage(true);
    await saveRouteImage(route, imageUrl.trim());
    setUploadingImage(false);
  };
  
  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to search
      </button>
      
      <div className="flex items-start gap-4">
        {/* Medication Image or Icon */}
        {currentImage ? (
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border bg-muted relative group">
            <img 
              src={currentImage} 
              alt={medication.generic_name}
              className="w-full h-full object-cover"
            />
            {selectedRoute && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            medication.high_alert ? 'bg-destructive/10' : 'bg-primary/10'
          }`}>
            {medication.high_alert ? (
              <AlertTriangle className="w-7 h-7 text-destructive" />
            ) : (
              <Pill className="w-7 h-7 text-primary" />
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-semibold">{medication.generic_name}</h1>
            {/* Pronunciation Button - always available via Web Speech API fallback */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={playPronunciation}
              disabled={isPlaying}
              title="Play pronunciation"
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            </Button>
            {/* Calculator Button - only show if medication has a calculator */}
            {calculatorInfo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={() => navigate(calculatorInfo.path)}
                      title={calculatorInfo.label}
                    >
                      <Calculator className="w-4 h-4 text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{calculatorInfo.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {/* Phonetic pronunciation */}
          <div className="flex items-center gap-2 mb-1">
            {medication.pronunciation_text ? (
              <p className="text-sm text-muted-foreground italic">
                ({medication.pronunciation_text})
              </p>
            ) : isAdmin ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={generatePronunciation}
                disabled={generatingPronunciation}
                className="h-6 text-xs text-muted-foreground hover:text-foreground"
              >
                {generatingPronunciation ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Generate pronunciation
                  </>
                )}
              </Button>
            ) : null}
            {/* Show generate button even if pronunciation exists (for admins to regenerate) */}
            {medication.pronunciation_text && isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={generatePronunciation}
                disabled={generatingPronunciation}
                className="h-6 w-6"
                title="Regenerate pronunciation"
              >
                {generatingPronunciation ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            {medication.brand_names?.join(', ')} • {medication.drug_class}
          </p>
          
          {/* Route badges - clickable to show route-specific info */}
          {medication.route && medication.route.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {medication.route.map((r) => {
                const isSelected = selectedRoute?.toUpperCase() === r.toUpperCase();
                const routeHasImage = !!getRouteImage(r) && getRouteImage(r) !== medication.image_url;
                
                return (
                  <Popover 
                    key={r} 
                    open={imagePopoverOpen === r} 
                    onOpenChange={(open) => {
                      if (!open) {
                        setImagePopoverOpen(null);
                        setImageUrl('');
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Badge 
                        variant={isSelected ? "default" : "outline"} 
                        className={`rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' 
                            : 'hover:bg-muted'
                        } ${routeHasImage ? 'pr-1' : ''}`}
                        onClick={(e) => {
                          if (isAdmin && isSelected) {
                            e.stopPropagation();
                            setImagePopoverOpen(r);
                          } else {
                            handleRouteSelect(r);
                          }
                        }}
                      >
                        {r}
                        {routeHasImage && (
                          <ImageIcon className="w-3 h-3 ml-1 opacity-60" />
                        )}
                      </Badge>
                    </PopoverTrigger>
                    {isAdmin && (
                      <PopoverContent className="w-72" align="start">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Route Image: {r}</h4>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => setImagePopoverOpen(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {getRouteImage(r) && (
                            <div className="relative">
                              <img 
                                src={getRouteImage(r)!} 
                                alt={`${r} route`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label htmlFor="image-url" className="text-xs">Image URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="image-url"
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="text-xs h-8"
                              />
                              <Button 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={() => handleUrlSubmit(r)}
                                disabled={uploadingImage || !imageUrl.trim()}
                              >
                                {uploadingImage ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-popover px-2 text-muted-foreground">or</span>
                            </div>
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, r);
                            }}
                          />
                          <Button 
                            variant="outline" 
                            className="w-full h-8 text-xs"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            <Camera className="h-3 w-3 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                      </PopoverContent>
                    )}
                  </Popover>
                );
              })}
            </div>
          )}
          
          {/* IV Method Selector - shows when IV route is selected and multiple methods available */}
          {showIVMethodSelector && (
            <IVMethodSelector
              availableMethods={availableIVMethods}
              selectedMethod={selectedIVMethod || null}
              onMethodChange={(method) => onIVMethodChange?.(method)}
            />
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            {medication.high_alert && (
              <Badge variant="destructive" className="rounded-lg text-xs gap-1">
                <AlertTriangle className="w-3 h-3" />
                HIGH ALERT
              </Badge>
            )}
            {medication.double_check_required && (
              <Badge className="rounded-lg text-xs gap-1 bg-orange-500 hover:bg-orange-600">
                <Shield className="w-3 h-3" />
                Double Check
              </Badge>
            )}
            {medication.controlled_substance && (
              <Badge variant="secondary" className="rounded-lg text-xs">
                Controlled
              </Badge>
            )}
            {safetyBadges?.weight_based && (
              <Badge variant="outline" className="rounded-lg text-xs gap-1 border-blue-500 text-blue-600">
                <Scale className="w-3 h-3" />
                Weight-Based
              </Badge>
            )}
            {safetyBadges?.renal_dosing && (
              <Badge variant="outline" className="rounded-lg text-xs gap-1 border-purple-500 text-purple-600">
                <Droplets className="w-3 h-3" />
                Renal Dosing
              </Badge>
            )}
            {safetyBadges?.titration && (
              <Badge variant="outline" className="rounded-lg text-xs gap-1 border-amber-500 text-amber-600">
                <Activity className="w-3 h-3" />
                Titration
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationHeader;
