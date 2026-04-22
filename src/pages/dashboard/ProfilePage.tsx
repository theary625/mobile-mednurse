import { useState, useEffect, useRef } from 'react';
import { useClinicianProfile } from '@/hooks/useClinicianProfile';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Loader2, Mail, Lock, Shield, Eye, EyeOff, Camera, Upload, X, Trash2, AlertTriangle, Bell, BellRing, Pencil, Palette, Share2, Copy, Check } from 'lucide-react';
import ConnectedAccountsSection from '@/components/dashboard/ConnectedAccountsSection';
import { ImageCropper } from '@/components/ImageCropper';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import defaultAvatar from '@/assets/mednurse-heart-transparent.png';
import {
  ClinicalRole,
  ClinicalSpecialty,
  PracticeSetting,
  ShiftType,
  roleLabels,
  specialtyLabels,
  settingLabels,
  shiftLabels
} from '@/types/clinical';

// Default avatar presets with gradient backgrounds
const avatarPresets = [
  { id: 'blue', gradient: 'from-blue-500 to-cyan-400', icon: '👤' },
  { id: 'purple', gradient: 'from-purple-500 to-pink-400', icon: '🩺' },
  { id: 'green', gradient: 'from-green-500 to-emerald-400', icon: '💊' },
  { id: 'orange', gradient: 'from-orange-500 to-amber-400', icon: '❤️' },
  { id: 'red', gradient: 'from-red-500 to-rose-400', icon: '🏥' },
  { id: 'teal', gradient: 'from-teal-500 to-cyan-400', icon: '⚕️' },
  { id: 'indigo', gradient: 'from-indigo-500 to-violet-400', icon: '🔬' },
  { id: 'pink', gradient: 'from-pink-500 to-fuchsia-400', icon: '💉' },
];

// Demo profile for testing
const demoProfile = {
  id: 'demo-id',
  user_id: 'demo-user',
  clinical_role: 'nurse' as ClinicalRole,
  specialty: 'icu' as ClinicalSpecialty,
  practice_setting: 'critical_care_icu' as PracticeSetting,
  shift_type: 'day' as ShiftType,
  patient_population: 'Adult Critical Care',
  years_experience: 5,
  preferred_units: 'metric',
  education: 'BSN, RN',
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const ProfilePage = () => {
  const { profile: realProfile, loading, updateProfile } = useClinicianProfile();
  const { refreshProfile, avatarUrl: contextAvatarUrl, firstName: contextFirstName, lastName: contextLastName } = useUserProfile();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Avatar state - initialize from context
  const [avatarUrl, setAvatarUrl] = useState<string | null>(contextAvatarUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperFile, setCropperFile] = useState<File | null>(null);
  const [showFullAvatar, setShowFullAvatar] = useState(false);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Account settings state - initialize from context
  const [newEmail, setNewEmail] = useState('');
  const [firstName, setFirstName] = useState(contextFirstName || '');
  const [lastName, setLastName] = useState(contextLastName || '');
  const [updatingName, setUpdatingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const navigate = useNavigate();

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_safety_alerts: true,
    email_weekly_digest: true,
    email_product_updates: false,
    push_safety_alerts: true,
    push_calculation_reminders: false,
  });
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Use demo profile if no real profile exists (dev mode)
  const profile = realProfile || demoProfile;
  const isDemo = !realProfile;

  // Local form state
  const [specialty, setSpecialty] = useState<ClinicalSpecialty | ''>(profile?.specialty || '');
  const [practiceSetting, setPracticeSetting] = useState<PracticeSetting | ''>(profile?.practice_setting || '');
  const [shiftType, setShiftType] = useState<ShiftType | ''>(profile?.shift_type || '');
  const [patientPopulation, setPatientPopulation] = useState(profile?.patient_population || '');
  const [yearsExperience, setYearsExperience] = useState(profile?.years_experience?.toString() || '');
  const [preferredUnits, setPreferredUnits] = useState(profile?.preferred_units || 'metric');
  const [education, setEducation] = useState(profile?.education || '');

  // Sync with context when it updates
  useEffect(() => {
    if (contextAvatarUrl !== undefined) {
      setAvatarUrl(contextAvatarUrl);
    }
    if (contextFirstName) {
      setFirstName(contextFirstName);
    }
    if (contextLastName) {
      setLastName(contextLastName);
    }
  }, [contextAvatarUrl, contextFirstName, contextLastName]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        setUserId(user.id);
        
        // Fetch notification preferences only (avatar/name from context)
        const { data: notifData } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (notifData) {
          setNotificationPrefs({
            email_safety_alerts: notifData.email_safety_alerts,
            email_weekly_digest: notifData.email_weekly_digest,
            email_product_updates: notifData.email_product_updates,
            push_safety_alerts: notifData.push_safety_alerts,
            push_calculation_reminders: notifData.push_calculation_reminders,
          });
        }
        setLoadingNotifications(false);
      }
    };
    getUser();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Please upload a JPG, PNG, WebP, or GIF image.', variant: 'destructive' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image smaller than 5MB.', variant: 'destructive' });
      return;
    }

    // Open cropper with the file
    setCropperFile(file);
    setShowCropper(true);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditAvatar = () => {
    if (!avatarUrl) return;
    setCropperFile(null);
    setShowCropper(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);
    setUploadingAvatar(true);

    // No authenticated user - show local preview only
    if (!userId) {
      const localUrl = URL.createObjectURL(croppedBlob);
      setAvatarUrl(localUrl);
      setCropperFile(null);
      setUploadingAvatar(false);
      toast({ title: 'Avatar preview updated!', description: 'Sign in to save permanently.' });
      return;
    }

    try {
      const fileName = `${userId}/avatar.jpg`;

      // Upload cropped image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedBlob, { upsert: true, contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      // Get public URL with cache busting
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

      // Update profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: cacheBustedUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setAvatarUrl(cacheBustedUrl);
      setCropperFile(null);
      
      // Refresh global profile context to update all components
      await refreshProfile();
      
      toast({ title: 'Avatar updated successfully!' });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({ title: 'Failed to upload avatar', description: error.message, variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSelectPreset = async (presetId: string) => {
    setUploadingAvatar(true);
    setShowPresetPicker(false);

    // No authenticated user - local preview only
    if (!userId) {
      const presetUrl = `preset:${presetId}`;
      setAvatarUrl(presetUrl);
      setSelectedPreset(presetId);
      setUploadingAvatar(false);
      toast({ title: 'Avatar preview updated!', description: 'Sign in to save permanently.' });
      return;
    }

    try {
      // Store the preset ID as a special avatar URL format
      const presetUrl = `preset:${presetId}`;
      
      // Update profiles table with preset
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: presetUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setAvatarUrl(presetUrl);
      setSelectedPreset(presetId);
      toast({ title: 'Avatar updated successfully!' });
    } catch (error: any) {
      toast({ title: 'Failed to update avatar', description: error.message, variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    // No authenticated user - local removal only
    if (!userId) {
      setAvatarUrl(null);
      toast({ title: 'Avatar removed!', description: 'Sign in to save permanently.' });
      return;
    }

    setUploadingAvatar(true);

    try {
      // List and delete all files in user's folder
      const { data: files } = await supabase.storage
        .from('avatars')
        .list(userId);

      if (files && files.length > 0) {
        const filesToDelete = files.map(f => `${userId}/${f.name}`);
        await supabase.storage.from('avatars').remove(filesToDelete);
      }

      // Update profiles table
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', userId);

      setAvatarUrl(null);
      toast({ title: 'Avatar removed successfully!' });
    } catch (error: any) {
      toast({ title: 'Failed to remove avatar', description: error.message, variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toast({ title: 'Please sign in to save your profile.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    
    const result = await updateProfile({
      specialty: specialty || undefined,
      practice_setting: practiceSetting || undefined,
      shift_type: shiftType || undefined,
      patient_population: patientPopulation || undefined,
      years_experience: yearsExperience ? parseInt(yearsExperience) : undefined,
      preferred_units: preferredUnits,
      education: education || undefined
    });

    setSaving(false);

    if (result.success) {
      toast({ title: 'Profile updated successfully!' });
    } else {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    }
  };

  const handleUpdateName = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      toast({ title: 'Please enter at least a first or last name', variant: 'destructive' });
      return;
    }

    if (!userId) {
      toast({ title: 'Please sign in to save your name.', variant: 'destructive' });
      return;
    }

    setUpdatingName(true);

    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          full_name: fullName || null
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({ title: 'Name updated successfully!' });
    } catch (error: any) {
      toast({ title: 'Failed to update name', description: error.message, variant: 'destructive' });
    } finally {
      setUpdatingName(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (isDemo) {
      toast({ title: 'Demo mode', description: 'Sign in to update your email.' });
      return;
    }

    if (!newEmail.trim()) {
      toast({ title: 'Please enter a new email address', variant: 'destructive' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setUpdatingEmail(true);

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    setUpdatingEmail(false);

    if (error) {
      toast({ title: 'Failed to update email', description: error.message, variant: 'destructive' });
    } else {
      toast({ 
        title: 'Email update initiated', 
        description: 'Please check your new email address to confirm the change.' 
      });
      setNewEmail('');
    }
  };

  const handleUpdatePassword = async () => {
    if (isDemo) {
      toast({ title: 'Demo mode', description: 'Sign in to update your password.' });
      return;
    }

    if (!newPassword.trim()) {
      toast({ title: 'Please enter a new password', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setUpdatingPassword(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setUpdatingPassword(false);

    if (error) {
      toast({ title: 'Failed to update password', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    if (isDemo) {
      toast({ title: 'Demo mode', description: 'Sign in to delete your account.' });
      return;
    }

    if (deleteConfirmText !== 'DELETE') {
      toast({ title: 'Please type DELETE to confirm', variant: 'destructive' });
      return;
    }

    setDeletingAccount(true);

    try {
      // Sign out the user first
      await supabase.auth.signOut();
      
      toast({ 
        title: 'Account deletion requested', 
        description: 'Your account has been signed out. Please contact support to complete account deletion.' 
      });
      
      navigate('/');
    } catch (error: any) {
      toast({ title: 'Failed to process request', description: error.message, variant: 'destructive' });
    } finally {
      setDeletingAccount(false);
      setDeleteConfirmText('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-primary">Demo Profile</p>
            <p className="text-sm text-muted-foreground">Explore all features with sample data. Sign in to save your own profile.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-glow text-primary rounded-full text-sm font-medium mb-3">
          <User className="w-4 h-4" />
          <span>Settings</span>
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your clinical profile and account settings</p>
      </div>

      {/* Avatar Upload Card */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a photo to personalize your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div 
              className="relative group cursor-pointer"
              onClick={() => avatarUrl && !avatarUrl.startsWith('preset:') && setShowFullAvatar(true)}
            >
              {avatarUrl?.startsWith('preset:') ? (
                // Render preset avatar
                (() => {
                  const presetId = avatarUrl.replace('preset:', '');
                  const preset = avatarPresets.find(p => p.id === presetId);
                  return (
                    <div className={`w-28 h-28 rounded-full border-4 border-border bg-gradient-to-br ${preset?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center text-4xl transition-transform hover:scale-105`}>
                      {preset?.icon || '👤'}
                    </div>
                  );
                })()
              ) : (
                <Avatar className="w-28 h-28 border-4 border-border transition-transform hover:scale-105">
                  <AvatarImage src={avatarUrl || defaultAvatar} alt="Profile" className="object-contain" />
                  <AvatarFallback className="bg-white">
                    <img src={defaultAvatar} alt="" className="w-full h-full object-contain p-2" />
                  </AvatarFallback>
                </Avatar>
              )}
              {avatarUrl && !avatarUrl.startsWith('preset:') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3 flex-1">
              <p className="text-sm text-muted-foreground">
                Upload a photo, take a selfie, or choose a preset avatar.
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  capture="user"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Popover open={showPresetPicker} onOpenChange={setShowPresetPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={uploadingAvatar}
                      className="rounded-xl"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Presets
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4" align="start">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Choose a preset avatar</p>
                      <div className="grid grid-cols-4 gap-2">
                        {avatarPresets.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset.id)}
                            className={`w-14 h-14 rounded-full bg-gradient-to-br ${preset.gradient} flex items-center justify-center text-xl transition-all hover:scale-110 hover:ring-2 hover:ring-primary hover:ring-offset-2 ${
                              avatarUrl === `preset:${preset.id}` ? 'ring-2 ring-primary ring-offset-2' : ''
                            }`}
                          >
                            {preset.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="rounded-xl"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="rounded-xl"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                {avatarUrl && !avatarUrl.startsWith('preset:') && (
                  <Button
                    variant="outline"
                    onClick={handleEditAvatar}
                    disabled={uploadingAvatar}
                    className="rounded-xl"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {avatarUrl && (
                  <Button
                    variant="ghost"
                    onClick={handleRemoveAvatar}
                    disabled={uploadingAvatar}
                    className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Avatar View Dialog */}
      <Dialog open={showFullAvatar} onOpenChange={setShowFullAvatar}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black/95 border-none">
          <div className="flex items-center justify-center p-4">
            <img 
              src={avatarUrl || ''} 
              alt="Profile" 
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Cropper Modal */}
      <ImageCropper
        imageFile={cropperFile}
        imageUrl={!cropperFile ? avatarUrl : undefined}
        open={showCropper}
        onClose={() => {
          setShowCropper(false);
          setCropperFile(null);
        }}
        onCropComplete={handleCropComplete}
      />

      {/* Role Card (Read-only) */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-glow to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{roleLabels[profile.clinical_role]}</CardTitle>
              <CardDescription className="mt-1">Your primary clinical role</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-lg px-3 py-1">Role-Based View Active</Badge>
            <span className="text-xs text-muted-foreground">
              Contact support to change your role
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent" />
            <div>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your email and password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Name Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="w-4 h-4" />
              <span>Name</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
            </div>
            <Button 
              onClick={handleUpdateName} 
              disabled={updatingName || (!firstName.trim() && !lastName.trim())}
              variant="outline"
              className="rounded-xl"
            >
              {updatingName ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Name
                </>
              )}
            </Button>
          </div>

          <div className="border-t border-border/50" />

          {/* Email Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground">Current email</p>
              <p className="font-medium">{userEmail || 'Not available'}</p>
            </div>
            <div>
              <Label htmlFor="newEmail" className="text-sm font-medium">New Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-2 h-11 rounded-xl"
              />
            </div>
            <Button 
              onClick={handleUpdateEmail} 
              disabled={updatingEmail || !newEmail.trim()}
              variant="outline"
              className="rounded-xl"
            >
              {updatingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Update Email
                </>
              )}
            </Button>
          </div>

          <div className="border-t border-border/50" />

          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
              <div className="relative mt-2">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>
            <Button 
              onClick={handleUpdatePassword} 
              disabled={updatingPassword || !newPassword.trim() || newPassword !== confirmPassword}
              variant="outline"
              className="rounded-xl"
            >
              {updatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Editable Settings */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
          <CardTitle>Clinical Settings</CardTitle>
          <CardDescription>Update your specialty and practice information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="specialty" className="text-sm font-medium">Specialty</Label>
              <Select value={specialty} onValueChange={(v) => setSpecialty(v as ClinicalSpecialty)}>
                <SelectTrigger className="mt-2 h-11 rounded-xl">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(specialtyLabels) as [ClinicalSpecialty, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="setting" className="text-sm font-medium">Practice Setting</Label>
              <Select value={practiceSetting} onValueChange={(v) => setPracticeSetting(v as PracticeSetting)}>
                <SelectTrigger className="mt-2 h-11 rounded-xl">
                  <SelectValue placeholder="Select setting" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(settingLabels) as [PracticeSetting, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="shift" className="text-sm font-medium">Shift Type</Label>
              <Select value={shiftType} onValueChange={(v) => setShiftType(v as ShiftType)}>
                <SelectTrigger className="mt-2 h-11 rounded-xl">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(shiftLabels) as [ShiftType, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience" className="text-sm font-medium">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="mt-2 h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="population" className="text-sm font-medium">Patient Population</Label>
              <Input
                id="population"
                placeholder="e.g., Adult, Pediatric, Geriatric"
                value={patientPopulation}
                onChange={(e) => setPatientPopulation(e.target.value)}
                className="mt-2 h-11 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="education" className="text-sm font-medium">Credentials / Education</Label>
              <Input
                id="education"
                placeholder="e.g., BSN, RN, MSN, NP"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="mt-2 h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="units" className="text-sm font-medium">Preferred Units</Label>
            <Select value={preferredUnits} onValueChange={setPreferredUnits}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, mL)</SelectItem>
                <SelectItem value="imperial">Imperial (lb, oz)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full h-12 rounded-xl text-base">
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Clinical Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates and alerts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Mail className="w-4 h-4" />
              <span>Email Notifications</span>
            </div>
            
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Safety Alerts</p>
                  <p className="text-xs text-muted-foreground">Critical medication safety notifications</p>
                </div>
                <Switch
                  checked={notificationPrefs.email_safety_alerts}
                  onCheckedChange={(checked) => setNotificationPrefs(prev => ({ ...prev, email_safety_alerts: checked }))}
                  disabled={isDemo || loadingNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Weekly Digest</p>
                  <p className="text-xs text-muted-foreground">Summary of your activity and new features</p>
                </div>
                <Switch
                  checked={notificationPrefs.email_weekly_digest}
                  onCheckedChange={(checked) => setNotificationPrefs(prev => ({ ...prev, email_weekly_digest: checked }))}
                  disabled={isDemo || loadingNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Product Updates</p>
                  <p className="text-xs text-muted-foreground">New features and improvements</p>
                </div>
                <Switch
                  checked={notificationPrefs.email_product_updates}
                  onCheckedChange={(checked) => setNotificationPrefs(prev => ({ ...prev, email_product_updates: checked }))}
                  disabled={isDemo || loadingNotifications}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Push Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BellRing className="w-4 h-4" />
              <span>Push Notifications</span>
            </div>
            
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Safety Alerts</p>
                  <p className="text-xs text-muted-foreground">Immediate alerts for critical interactions</p>
                </div>
                <Switch
                  checked={notificationPrefs.push_safety_alerts}
                  onCheckedChange={(checked) => setNotificationPrefs(prev => ({ ...prev, push_safety_alerts: checked }))}
                  disabled={isDemo || loadingNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Calculation Reminders</p>
                  <p className="text-xs text-muted-foreground">Reminders for scheduled dose calculations</p>
                </div>
                <Switch
                  checked={notificationPrefs.push_calculation_reminders}
                  onCheckedChange={(checked) => setNotificationPrefs(prev => ({ ...prev, push_calculation_reminders: checked }))}
                  disabled={isDemo || loadingNotifications}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={async () => {
              if (isDemo || !userId) return;
              setSavingNotifications(true);
              
              const { error } = await supabase
                .from('notification_preferences')
                .upsert({
                  user_id: userId,
                  ...notificationPrefs,
                }, { onConflict: 'user_id' });
              
              setSavingNotifications(false);
              
              if (error) {
                toast({ title: 'Failed to save preferences', description: error.message, variant: 'destructive' });
              } else {
                toast({ title: 'Notification preferences saved!' });
              }
            }}
            disabled={savingNotifications || isDemo || loadingNotifications}
            variant="outline"
            className="w-full rounded-xl"
          >
            {savingNotifications ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Save Notification Preferences
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <ConnectedAccountsSection isDemo={isDemo} />

      {/* Share MedNurse */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Share MedNurse with a Friend</CardTitle>
              <CardDescription>Help fellow clinicians discover safer medication practices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Know someone who could benefit from MedNurse? Share it with them and help improve patient safety together.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {/* Copy Link */}
              <Button
                variant="outline"
                className="rounded-xl gap-2"
                onClick={async () => {
                  navigator.clipboard.writeText('https://mednurse.app');
                  setLinkCopied(true);
                  toast({ title: 'Link copied!', description: 'Share it with your colleagues.' });
                  setTimeout(() => setLinkCopied(false), 2000);
                  
                  // Track share event
                  if (userId) {
                    await supabase.from('share_events').insert({
                      user_id: userId,
                      share_method: 'copy_link'
                    });
                  }
                }}
              >
                {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {linkCopied ? 'Copied!' : 'Copy Link'}
              </Button>

              {/* Native Share (if supported) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  variant="outline"
                  className="rounded-xl gap-2"
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title: 'MedNurse - Clinical Safety Tools',
                        text: 'Check out MedNurse - a powerful app for medication safety and clinical decision support!',
                        url: 'https://mednurse.app',
                      });
                      
                      // Track share event (only if share completed)
                      if (userId) {
                        await supabase.from('share_events').insert({
                          user_id: userId,
                          share_method: 'native_share'
                        });
                      }
                    } catch (err) {
                      // User cancelled or error
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              )}

              {/* Email */}
              <Button
                variant="outline"
                className="rounded-xl gap-2"
                onClick={async () => {
                  const subject = encodeURIComponent('Check out MedNurse!');
                  const body = encodeURIComponent(
                    `Hey!\n\nI've been using MedNurse for medication safety and clinical decision support. It's a great tool for nurses and clinicians.\n\nCheck it out: https://mednurse.app\n\nStay safe!`
                  );
                  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                  
                  // Track share event
                  if (userId) {
                    await supabase.from('share_events').insert({
                      user_id: userId,
                      share_method: 'email'
                    });
                  }
                }}
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground text-center">
                🩺 Together, we can reduce medication errors and improve patient outcomes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Delete Account */}
      <Card className="border-destructive/30 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-destructive/10 to-transparent">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="rounded-xl shrink-0"
                  disabled={isDemo}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Delete Account
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>
                      Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.
                    </p>
                    <p>
                      All your data, including clinical profiles, calculation history, and preferences will be permanently removed.
                    </p>
                    <div className="pt-2">
                      <Label htmlFor="deleteConfirm" className="text-sm font-medium text-foreground">
                        Type <span className="font-bold text-destructive">DELETE</span> to confirm
                      </Label>
                      <Input
                        id="deleteConfirm"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="DELETE"
                        className="mt-2 h-11 rounded-xl"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl" onClick={() => setDeleteConfirmText('')}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || deletingAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                  >
                    {deletingAccount ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
