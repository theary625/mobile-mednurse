import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Clock,
  Building2,
  Check,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { compressImage, blobToFile } from "@/lib/imageUtils";
import edithMascot from "@/assets/edith-mascot-final.png";

type ClinicalRole = Database["public"]["Enums"]["clinical_role"];
type ClinicalSpecialty = Database["public"]["Enums"]["clinical_specialty"];
type PracticeSetting = Database["public"]["Enums"]["practice_setting"];
type ShiftType = Database["public"]["Enums"]["shift_type"];

const MobileProfileEdit = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use centralized profile context
  const { 
    avatarUrl: contextAvatarUrl, 
    firstName: contextFirstName, 
    lastName: contextLastName,
    refreshProfile 
  } = useUserProfile();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(contextAvatarUrl);
  const [profile, setProfile] = useState({
    first_name: contextFirstName || "",
    last_name: contextLastName || "",
    email: "",
    phone: "",
  });
  const [clinicianProfile, setClinicianProfile] = useState<{
    clinical_role: ClinicalRole | "";
    specialty: ClinicalSpecialty | "";
    years_experience: string;
    practice_setting: PracticeSetting | "";
    shift_type: ShiftType | "";
  }>({
    clinical_role: "",
    specialty: "",
    years_experience: "",
    practice_setting: "",
    shift_type: "",
  });

  useEffect(() => {
    // Sync with context when it updates
    if (contextAvatarUrl !== undefined) {
      setAvatarUrl(contextAvatarUrl);
    }
    if (contextFirstName) {
      setProfile(prev => ({ ...prev, first_name: contextFirstName }));
    }
    if (contextLastName) {
      setProfile(prev => ({ ...prev, last_name: contextLastName }));
    }
  }, [contextAvatarUrl, contextFirstName, contextLastName]);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch email and phone from profiles (avatar/name from context)
        const { data: profileData } = await supabase
          .from("profiles")
          .select("email, phone")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (profileData) {
          setProfile(prev => ({
            ...prev,
            email: profileData.email || "",
            phone: profileData.phone || "",
          }));
        }

        // Fetch clinician profile
        const { data: clinicianData } = await supabase
          .from("clinician_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (clinicianData) {
          setClinicianProfile({
            clinical_role: clinicianData.clinical_role || "",
            specialty: clinicianData.specialty || "",
            years_experience: clinicianData.years_experience?.toString() || "",
            practice_setting: clinicianData.practice_setting || "",
            shift_type: clinicianData.shift_type || "",
          });
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload avatar');
        return;
      }

      // Compress the image
      const compressedBlob = await compressImage(file, 400, 400, 0.85);
      const compressedFile = blobToFile(compressedBlob, `avatar-${user.id}.jpg`);

      // Delete old avatar if exists
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list(user.id);
      
      if (existingFiles && existingFiles.length > 0) {
        await supabase.storage
          .from('avatars')
          .remove(existingFiles.map(f => `${user.id}/${f.name}`));
      }

      // Upload new avatar
      const filePath = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL with cache busting
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      
      // Refresh global profile context to update all components
      await refreshProfile();
      
      toast.success('Profile photo updated');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to save changes");
        return;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          full_name: `${profile.first_name} ${profile.last_name}`.trim(),
          phone: profile.phone,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Update clinician profile
      const { error: clinicianError } = await supabase
        .from("clinician_profiles")
        .update({
          clinical_role: clinicianProfile.clinical_role || null,
          specialty: clinicianProfile.specialty || null,
          years_experience: clinicianProfile.years_experience ? parseInt(clinicianProfile.years_experience) : null,
          practice_setting: clinicianProfile.practice_setting || null,
          shift_type: clinicianProfile.shift_type || null,
        })
        .eq("user_id", user.id);

      if (clinicianError) throw clinicianError;

      // Refresh global profile context to update all components
      await refreshProfile();

      toast.success("Profile updated successfully");
      navigate("/mobile-home");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const clinicalRoles: { value: ClinicalRole; label: string }[] = [
    { value: "nurse", label: "Registered Nurse (RN)" },
    { value: "nursing_student", label: "Nursing Student" },
    { value: "advanced_nurse", label: "Advanced Practice Nurse" },
    { value: "medical_student", label: "Medical Student" },
    { value: "resident", label: "Resident Physician" },
    { value: "attending", label: "Attending Physician" },
  ];

  const specialties: { value: ClinicalSpecialty; label: string }[] = [
    { value: "icu", label: "Critical Care / ICU" },
    { value: "em", label: "Emergency" },
    { value: "medical_surgical", label: "Medical-Surgical" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "oncology", label: "Oncology" },
    { value: "cardiac", label: "Cardiac" },
    { value: "neuro", label: "Neurology" },
    { value: "ob", label: "Obstetrics" },
    { value: "psychiatric", label: "Psychiatric" },
    { value: "home_health", label: "Home Health" },
  ];

  const practiceSettings: { value: PracticeSetting; label: string }[] = [
    { value: "medical_surgical_unit", label: "Hospital - Med/Surg" },
    { value: "critical_care_icu", label: "Hospital - ICU" },
    { value: "emergency_department", label: "Emergency Department" },
    { value: "primary_care_clinic", label: "Primary Care Clinic" },
    { value: "specialty_clinic", label: "Specialty Clinic" },
    { value: "long_term_care_facility", label: "Long-Term Care" },
    { value: "home_health", label: "Home Health" },
    { value: "ambulatory_care_center", label: "Ambulatory Care" },
  ];

  const shiftTypes: { value: ShiftType; label: string }[] = [
    { value: "day", label: "Day Shift" },
    { value: "night", label: "Night Shift" },
    { value: "rotating", label: "Rotating" },
    { value: "prn", label: "PRN / As Needed" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-card border-b border-border">
        <Link to="/mobile-home" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-base font-semibold text-foreground">Edit Profile</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-5 bg-background">
        {/* Avatar Section */}
        <section className="flex flex-col items-center pt-6 pb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div className="relative" onClick={handleAvatarClick}>
            <div className="w-28 h-28 rounded-full overflow-hidden bg-card shadow-sm border-2 border-border cursor-pointer">
              {isUploadingAvatar ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <img 
                  src={avatarUrl || edithMascot} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-card"
              disabled={isUploadingAvatar}
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Tap to change photo
          </p>
        </section>

        {/* Personal Information */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3 px-1">
            Personal Information
          </h2>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  First Name
                </Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="bg-muted border-0 text-foreground"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="bg-muted border-0 text-foreground"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted/50 border-0 text-muted-foreground"
              />
              <p className="text-[10px] text-muted-foreground/70">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="bg-muted border-0 text-foreground"
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </section>

        {/* Clinical Background */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3 px-1">
            Clinical Background
          </h2>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Clinical Role
              </Label>
              <Select
                value={clinicianProfile.clinical_role}
                onValueChange={(value: ClinicalRole) => setClinicianProfile({ ...clinicianProfile, clinical_role: value })}
              >
                <SelectTrigger className="bg-muted border-0 text-foreground">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {clinicalRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Specialty
              </Label>
              <Select
                value={clinicianProfile.specialty}
                onValueChange={(value: ClinicalSpecialty) => setClinicianProfile({ ...clinicianProfile, specialty: value })}
              >
                <SelectTrigger className="bg-muted border-0 text-foreground">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Years of Experience
              </Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="50"
                value={clinicianProfile.years_experience}
                onChange={(e) => setClinicianProfile({ ...clinicianProfile, years_experience: e.target.value })}
                className="bg-muted border-0 text-foreground"
                placeholder="Enter years"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Practice Setting
              </Label>
              <Select
                value={clinicianProfile.practice_setting}
                onValueChange={(value: PracticeSetting) => setClinicianProfile({ ...clinicianProfile, practice_setting: value })}
              >
                <SelectTrigger className="bg-muted border-0 text-foreground">
                  <SelectValue placeholder="Select setting" />
                </SelectTrigger>
                <SelectContent>
                  {practiceSettings.map((setting) => (
                    <SelectItem key={setting.value} value={setting.value}>
                      {setting.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Shift Type
              </Label>
              <Select
                value={clinicianProfile.shift_type}
                onValueChange={(value: ShiftType) => setClinicianProfile({ ...clinicianProfile, shift_type: value })}
              >
                <SelectTrigger className="bg-muted border-0 text-foreground">
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  {shiftTypes.map((shift) => (
                    <SelectItem key={shift.value} value={shift.value}>
                      {shift.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border p-4 z-50">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-semibold gap-2"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileProfileEdit;