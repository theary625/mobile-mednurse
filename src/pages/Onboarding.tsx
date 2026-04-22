import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useClinicianProfile } from '@/hooks/useClinicianProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import defaultAvatar from '@/assets/mednurse-heart-transparent.png';
import { useToast } from '@/hooks/use-toast';
import { ClinicalRole, ClinicalSpecialty, PracticeSetting, ShiftType, roleLabels, specialtyLabels, specialtyGroups, settingLabels, settingGroups, shiftLabels } from '@/types/clinical';
import { ArrowLeft, ArrowRight, Stethoscope, CheckCircle2, GraduationCap, Building2, Settings2, MapPin, Camera, Bell, Upload, User, Mail, BellRing } from 'lucide-react';
import mednurseLogo from '@/assets/mednurse-logo-new.png';
import { compressImage } from '@/lib/imageUtils';
import { ImageCropper } from '@/components/ImageCropper';

const TOTAL_STEPS = 6;

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: profileLoading, createProfile } = useClinicianProfile();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [clinicalRole, setClinicalRole] = useState<ClinicalRole | ''>('');
  const [specialty, setSpecialty] = useState<ClinicalSpecialty | ''>('');
  const [practiceSetting, setPracticeSetting] = useState<PracticeSetting | ''>('');
  const [shiftType, setShiftType] = useState<ShiftType | ''>('');
  const [patientPopulation, setPatientPopulation] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);
  
  // State for profile photo and cropper
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  
  // New state for notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_safety_alerts: true,
    email_weekly_digest: true,
    email_product_updates: false,
    push_safety_alerts: true,
    push_calculation_reminders: false,
  });

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      }
    });
  }, [navigate]);

  useEffect(() => {
    // Redirect if already onboarded
    if (!profileLoading && profile?.onboarding_completed) {
      navigate('/dashboard');
    }
  }, [profile, profileLoading, navigate]);

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Open cropper with selected file
    setSelectedImageFile(file);
    setCropperOpen(true);
    
    // Reset file input so same file can be selected again
    event.target.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropperOpen(false);
    setSelectedImageFile(null);
    setUploadingAvatar(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const filePath = `${user.id}/avatar.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, { 
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Add cache buster to force reload
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      toast({ title: 'Photo uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Failed to upload photo',
        variant: 'destructive',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleNext = async () => {
    if (step === 1 && !clinicalRole) {
      toast({
        title: 'Please select your role',
        variant: 'destructive',
      });
      return;
    }
    // Nursing students skip specialty/setting steps
    if (step === 1 && clinicalRole === 'nursing_student') {
      setStep(4); // Skip to final preferences
      return;
    }
    setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    // Handle nursing student going back
    if (step === 4 && clinicalRole === 'nursing_student') {
      setStep(1);
      return;
    }
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!clinicalRole) {
      toast({
        title: 'Please select your role',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      // Create clinician profile
      const result = await createProfile({
        clinical_role: clinicalRole,
        specialty: specialty || undefined,
        practice_setting: practiceSetting || undefined,
        shift_type: shiftType || undefined,
        patient_population: patientPopulation || undefined,
        years_experience: yearsExperience ? parseInt(yearsExperience) : undefined,
        preferred_units: locationTrackingEnabled ? 'location_enabled' : 'location_disabled',
      });

      if (!result.success) {
        throw new Error('Failed to create profile');
      }

      // Save avatar URL to profiles table if uploaded
      const { data: { user } } = await supabase.auth.getUser();
      if (user && avatarUrl) {
        await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('user_id', user.id);
      }

      // Save notification preferences
      if (user) {
        await supabase
          .from('notification_preferences')
          .upsert({
            user_id: user.id,
            ...notificationPrefs,
          });
      }

      toast({ title: 'Profile created successfully!' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Failed to create profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-red-600" />
          </div>
        );
      case 2:
        return (
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-accent" />
          </div>
        );
      case 3:
        return (
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
        );
      case 4:
        return (
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <Settings2 className="w-8 h-8 text-accent" />
          </div>
        );
      case 5:
        return (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        );
      case 6:
        return (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Bell className="w-8 h-8 text-green-600" />
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'What is your clinical role?';
      case 2: return 'Tell us about your specialty';
      case 3: return 'Unit / Practice Setting';
      case 4: return 'Final preferences';
      case 5: return 'Add a profile photo';
      case 6: return 'Notification preferences';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'This helps us tailor the experience to your workflow';
      case 2: return "We'll prioritize tools relevant to your specialty";
      case 3: return 'Understanding your setting helps surface the right resources';
      case 4: return 'Almost done! Just a few more details';
      case 5: return 'Help your colleagues recognize you (optional)';
      case 6: return 'Choose how you want to stay informed';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <img src={mednurseLogo} alt="MedNurse" className="h-10 w-auto" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">MedNurse Platform</h1>
            <p className="text-xs text-muted-foreground">Clinical Profile Setup</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-lg border-border/50 overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div key={`icon-${step}`} className="mx-auto mb-4 animate-scale-in">
              {getStepIcon()}
            </div>
            <CardTitle key={`title-${step}`} className="text-xl animate-fade-in">
              {getStepTitle()}
            </CardTitle>
            <CardDescription key={`desc-${step}`} className="animate-fade-in" style={{ animationDelay: '50ms' }}>
              {getStepDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Clinical Role */}
            {step === 1 && (
              <div key="step-1" className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="role">Clinical Role *</Label>
                <Select value={clinicalRole} onValueChange={v => setClinicalRole(v as ClinicalRole)}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nursing_student">Nursing Student</SelectItem>
                    <SelectItem value="nurse">Registered Nurse (RN)</SelectItem>
                    <SelectItem value="nurse_practitioner">Nurse Practitioner (NP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 2: Specialty */}
            {step === 2 && (
              <div key="step-2" className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="specialty">Primary Specialty</Label>
                <Select value={specialty} onValueChange={v => setSpecialty(v as ClinicalSpecialty)}>
                  <SelectTrigger id="specialty" className="w-full">
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {Object.entries(specialtyGroups).map(([groupName, specialties]) => (
                      <div key={groupName}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                          {groupName}
                        </div>
                        {specialties.map(value => (
                          <SelectItem key={value} value={value}>
                            {specialtyLabels[value as ClinicalSpecialty]}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                <div className="pt-4">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g., 5"
                    value={yearsExperience}
                    onChange={e => setYearsExperience(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Practice Setting */}
            {step === 3 && (
              <div key="step-3" className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="setting">Practice Setting</Label>
                <Select value={practiceSetting} onValueChange={v => setPracticeSetting(v as PracticeSetting)}>
                  <SelectTrigger id="setting" className="w-full">
                    <SelectValue placeholder="Select your primary setting" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {Object.entries(settingGroups).map(([groupName, settings]) => (
                      <div key={groupName}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                          {groupName}
                        </div>
                        {settings.map(value => (
                          <SelectItem key={value} value={value}>
                            {settingLabels[value as PracticeSetting]}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                <div className="pt-4">
                  <Label htmlFor="shift">Typical Shift</Label>
                  <Select value={shiftType} onValueChange={v => setShiftType(v as ShiftType)}>
                    <SelectTrigger id="shift" className="w-full mt-2">
                      <SelectValue placeholder="Select your shift type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(shiftLabels) as [ShiftType, string][]).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Final Preferences */}
            {step === 4 && (
              <div key="step-4" className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div>
                  <Label htmlFor="population">Patient Population (optional)</Label>
                  <Input
                    id="population"
                    placeholder="e.g., Adult, Pediatric, Geriatric, Oncology"
                    value={patientPopulation}
                    onChange={e => setPatientPopulation(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <Label htmlFor="location-tracking" className="text-base font-medium cursor-pointer">
                          Allow Location Tracking
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          For mobile devices only
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="location-tracking"
                      checked={locationTrackingEnabled}
                      onCheckedChange={setLocationTrackingEnabled}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Profile Photo */}
            {step === 5 && (
              <div key="step-5" className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-border">
                      <AvatarImage src={avatarUrl || defaultAvatar} alt="Profile photo" />
                      <AvatarFallback className="bg-white">
                        <img src={defaultAvatar} alt="" className="w-full h-full object-contain p-2" />
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {uploadingAvatar ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </div>

                  {avatarUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAvatarUrl(null)}
                      className="text-muted-foreground"
                    >
                      Skip for now
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Notification Preferences */}
            {step === 6 && (
              <div key="step-6" className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                {/* Email Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    Email Notifications
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div>
                        <Label className="text-sm font-medium">Safety Alerts</Label>
                        <p className="text-xs text-muted-foreground">Critical medication and safety updates</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.email_safety_alerts}
                        onCheckedChange={(checked) =>
                          setNotificationPrefs(prev => ({ ...prev, email_safety_alerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div>
                        <Label className="text-sm font-medium">Weekly Digest</Label>
                        <p className="text-xs text-muted-foreground">Summary of your activity and updates</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.email_weekly_digest}
                        onCheckedChange={(checked) =>
                          setNotificationPrefs(prev => ({ ...prev, email_weekly_digest: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div>
                        <Label className="text-sm font-medium">Product Updates</Label>
                        <p className="text-xs text-muted-foreground">New features and improvements</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.email_product_updates}
                        onCheckedChange={(checked) =>
                          setNotificationPrefs(prev => ({ ...prev, email_product_updates: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <BellRing className="w-4 h-4" />
                    Push Notifications
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div>
                        <Label className="text-sm font-medium">Safety Alerts</Label>
                        <p className="text-xs text-muted-foreground">Immediate safety notifications</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.push_safety_alerts}
                        onCheckedChange={(checked) =>
                          setNotificationPrefs(prev => ({ ...prev, push_safety_alerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div>
                        <Label className="text-sm font-medium">Calculation Reminders</Label>
                        <p className="text-xs text-muted-foreground">Reminders for pending calculations</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.push_calculation_reminders}
                        onCheckedChange={(checked) =>
                          setNotificationPrefs(prev => ({ ...prev, push_calculation_reminders: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <h4 className="font-medium mb-2">Profile Summary</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Role: {clinicalRole ? roleLabels[clinicalRole] : 'Not selected'}</li>
                    {specialty && <li>Specialty: {specialtyLabels[specialty]}</li>}
                    {practiceSetting && <li>Setting: {settingLabels[practiceSetting]}</li>}
                    {shiftType && <li>Shift: {shiftLabels[shiftType]}</li>}
                    {avatarUrl && <li>✓ Profile photo uploaded</li>}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {step < TOTAL_STEPS ? (
                <Button onClick={handleNext} className="gap-2">
                  {step === 5 && !avatarUrl ? 'Skip' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2 bg-primary hover:bg-primary/90">
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <ImageCropper
        imageFile={selectedImageFile}
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          setSelectedImageFile(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default Onboarding;
