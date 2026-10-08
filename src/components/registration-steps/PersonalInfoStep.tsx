import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Phone, Calendar, ChevronRight, Check } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useMemo } from "react";
import { BorderBeam } from "@/components/ui/border-beam";

interface PersonalInfoStepProps {
  onNext: () => void;
}

const MONTHS = [
  { value: "01", label: "Jan (01)" },
  { value: "02", label: "Feb (02)" },
  { value: "03", label: "Mar (03)" },
  { value: "04", label: "Apr (04)" },
  { value: "05", label: "May (05)" },
  { value: "06", label: "Jun (06)" },
  { value: "07", label: "Jul (07)" },
  { value: "08", label: "Aug (08)" },
  { value: "09", label: "Sep (09)" },
  { value: "10", label: "Oct (10)" },
  { value: "11", label: "Nov (11)" },
  { value: "12", label: "Dec (12)" },
];

const parseDobParts = (dobString: string) => {
  if (!dobString) return { day: '', month: '', year: '' };
  const parts = dobString.split('-');
  if (parts.length === 3) {
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: parts[2] || '',
    };
  }
  return { day: '', month: '', year: '' };
};

const PersonalInfoStep = ({ onNext }: PersonalInfoStepProps) => {
  const { personalInfo, updatePersonalInfo } = useRegistration();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState(personalInfo);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialParts = parseDobParts(personalInfo.dateOfBirth);
  const [dobDay, setDobDay] = useState(initialParts.day);
  const [dobMonth, setDobMonth] = useState(initialParts.month);
  const [dobYear, setDobYear] = useState(initialParts.year);

  useEffect(() => {
    setFormData(personalInfo);
    const parts = parseDobParts(personalInfo.dateOfBirth);
    if (parts.day) setDobDay(parts.day);
    if (parts.month) setDobMonth(parts.month);
    if (parts.year) setDobYear(parts.year);
  }, [personalInfo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleDobChange = (newDay: string, newMonth: string, newYear: string) => {
    setDobDay(newDay);
    setDobMonth(newMonth);
    setDobYear(newYear);

    if (newDay && newMonth && newYear) {
      const formatted = `${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`;
      handleInputChange('dateOfBirth', formatted);
    } else {
      handleInputChange('dateOfBirth', '');
    }
  };

  // Calculate age preview
  const calculatedAge = useMemo(() => {
    if (!dobDay || !dobMonth || !dobYear) return null;
    const birth = new Date(`${dobYear}-${dobMonth}-${dobDay}`);
    if (isNaN(birth.getTime())) return null;
    const diff = Date.now() - birth.getTime();
    const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    return age > 0 ? age : null;
  }, [dobDay, dobMonth, dobYear]);

  const handleFileUpload = (field: 'profilePhotoUrl', url: string, previewUrl?: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: url, 
      profilePhotoPreview: previewUrl || prev.profilePhotoPreview 
    }));
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const validateAndNext = () => {
    if (uploading) {
      toast({
        title: "Photo is uploading",
        description: "Please wait a few seconds for your profile photo to finish uploading.",
        variant: "destructive",
      });
      return;
    }

    const nextErrors: Record<string, string> = {};
    const fullNameTrim = formData.fullName.trim();

    if (fullNameTrim.length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    // Auto-fill jersey name if empty
    const jerseyNameFinal = formData.jerseyName.trim() || fullNameTrim;

    if (!dobDay || !dobMonth || !dobYear || !formData.dateOfBirth) {
      nextErrors.dateOfBirth = 'Please select your Day, Month, and Year of birth.';
    } else {
      const parsed = Date.parse(formData.dateOfBirth);
      if (isNaN(parsed) || parsed >= Date.now()) {
        nextErrors.dateOfBirth = 'Please select a valid date of birth in the past.';
      }
    }

    const cleanMobile = formData.mobileNumber.replace(/[\s-+()]/g, '').replace(/^(?:91|0)/, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      nextErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.profilePhotoUrl) {
      nextErrors.profilePhotoUrl = 'Please upload your profile photo.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstMessage = Object.values(nextErrors)[0];
      toast({
        title: "Required Information Missing",
        description: firstMessage,
        variant: "destructive",
      });
      
      // Smoothly scroll up so user sees the field
      const el = document.getElementById('registration');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Save validated data to context
    const cleanData = {
      ...formData,
      fullName: fullNameTrim,
      jerseyName: jerseyNameFinal,
      mobileNumber: cleanMobile.startsWith('+91') ? cleanMobile : `+91 ${cleanMobile}`,
    };
    updatePersonalInfo(cleanData);
    
    toast({
      title: "Step 1 Saved! 🏏",
      description: "Moving to Step 2: Cricket Profile & Payment.",
    });
    
    onNext();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <User className="h-4 w-4 text-primary" />
            Full Name *
          </Label>
          <Input 
            id="fullName" 
            placeholder="Enter your full name"
            className="bg-input border-border h-11"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>

        {/* Jersey Name */}
        <div className="space-y-2">
          <Label htmlFor="jerseyName" className="text-xs sm:text-sm font-semibold">
            Preferred Jersey Name *
          </Label>
          <Input 
            id="jerseyName" 
            placeholder="Name on jersey (defaults to full name)"
            className="bg-input border-border h-11"
            value={formData.jerseyName}
            onChange={(e) => handleInputChange('jerseyName', e.target.value)}
          />
          {errors.jerseyName && <p className="text-xs text-destructive">{errors.jerseyName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Simpler Date of Birth (Day, Month, Year Dropdowns) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <Calendar className="h-4 w-4 text-primary" />
            Date of Birth *
          </Label>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Day */}
            <div className="relative rounded-md">
              <select
                aria-label="Day"
                value={dobDay}
                onChange={(e) => handleDobChange(e.target.value, dobMonth, dobYear)}
                className="h-11 w-full rounded-md border border-border bg-input px-2 text-xs sm:text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="" disabled className="bg-card text-muted-foreground">Day</option>
                {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                  <option key={d} value={d} className="bg-card text-foreground">{d}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">▼</div>
              <BorderBeam duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
            </div>

            {/* Month */}
            <div className="relative rounded-md">
              <select
                aria-label="Month"
                value={dobMonth}
                onChange={(e) => handleDobChange(dobDay, e.target.value, dobYear)}
                className="h-11 w-full rounded-md border border-border bg-input px-2 text-xs sm:text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="" disabled className="bg-card text-muted-foreground">Month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value} className="bg-card text-foreground">{m.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">▼</div>
              <BorderBeam duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
            </div>

            {/* Year */}
            <div className="relative rounded-md">
              <select
                aria-label="Year"
                value={dobYear}
                onChange={(e) => handleDobChange(dobDay, dobMonth, e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-input px-2 text-xs sm:text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="" disabled className="bg-card text-muted-foreground">Year</option>
                {Array.from({ length: 45 }, (_, i) => String(2014 - i)).map((y) => (
                  <option key={y} value={y} className="bg-card text-foreground">{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">▼</div>
              <BorderBeam duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
            </div>
          </div>

          {dobDay && dobMonth && dobYear && calculatedAge && (
            <p className="text-[11px] text-accent font-semibold flex items-center gap-1.5 pt-0.5">
              <Check className="h-3 w-3" />
              <span>{dobDay}/{dobMonth}/{dobYear} · Age: {calculatedAge} years old</span>
            </p>
          )}

          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <Phone className="h-4 w-4 text-primary" />
            Mobile Number *
          </Label>
          <Input
            id="mobile"
            inputMode="tel"
            autoComplete="tel"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="bg-input border-border h-11"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
          />
          {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber}</p>}
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
          Profile Photo *
        </Label>
        <FileUpload
          folder="profile-photos"
          accept="image/*"
          maxSizeMB={5}
          label="Profile Photo"
          required
          value={formData.profilePhotoUrl}
          onUploadingChange={setUploading}
          onUploadComplete={(url, preview) => handleFileUpload('profilePhotoUrl', url, preview)}
        />
        {errors.profilePhotoUrl && <p className="text-xs text-destructive">{errors.profilePhotoUrl}</p>}
      </div>

      {Object.entries(errors).length > 0 && (
        <div className="space-y-1 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs sm:text-sm text-destructive">
          {Object.entries(errors).map(([field, message]) => (
            <p key={field} role="alert" className="flex items-center gap-1.5">
              <span>•</span> {message}
            </p>
          ))}
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end pt-5 sm:pt-6 border-t border-border">
        <Button
          disabled={uploading}
          onClick={validateAndNext}
          className="btn-hero w-full sm:w-auto min-w-[150px] h-12 text-sm sm:text-base font-bold tracking-wide"
        >
          {uploading ? "Uploading photo..." : "Next"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;

