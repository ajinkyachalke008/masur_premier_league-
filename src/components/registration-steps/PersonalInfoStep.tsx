import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Calendar, ChevronRight } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface PersonalInfoStepProps {
  onNext: () => void;
}

const PersonalInfoStep = ({ onNext }: PersonalInfoStepProps) => {
  const { personalInfo, updatePersonalInfo } = useRegistration();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState(personalInfo);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  useEffect(() => {
    setFormData(personalInfo);
  }, [personalInfo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'profilePhotoUrl', url: string) => {
    setFormData(prev => ({ ...prev, [field]: url }));
  };

  const validateAndNext = () => {
    const nextErrors: Record<string,string> = {};
    if(formData.fullName.trim().length<2) nextErrors.fullName='Enter your full name.';
    if(!formData.jerseyName.trim()) nextErrors.jerseyName='Enter your jersey name.';
    if(!formData.dateOfBirth || isNaN(Date.parse(formData.dateOfBirth)) || Date.parse(formData.dateOfBirth)>=Date.now()) nextErrors.dateOfBirth='Enter a valid date of birth.';
    if(!/^(?:\+91)?[6-9]\d{9}$/.test(formData.mobileNumber.replace(/[\s-]/g,''))) nextErrors.mobileNumber='Enter a valid 10-digit Indian mobile number.';
    if(!formData.profilePhotoUrl) nextErrors.profilePhotoUrl='Upload your profile photo.';
    setErrors(nextErrors);
    if(Object.keys(nextErrors).length || uploading) return;

    // Save to context
    updatePersonalInfo(formData);
    
    toast({
      title: "Step 1 Complete",
      description: "Personal information saved successfully.",
    });
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Full Name *
          </Label>
          <Input 
            id="fullName" 
            placeholder="Enter your full name"
            className="bg-input border-border"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
        </div>

        {/* Jersey Name */}
        <div className="space-y-2">
          <Label htmlFor="jerseyName">
            Preferred Jersey Name *
          </Label>
          <Input 
            id="jerseyName" 
            placeholder="Name on jersey"
            className="bg-input border-border"
            value={formData.jerseyName}
            onChange={(e) => handleInputChange('jerseyName', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dob" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Date of Birth *
          </Label>
          <Input
            id="dob"
            type="date"
            className="bg-input border-border"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>

      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <Label htmlFor="mobile" className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          Mobile Number *
        </Label>
        <Input
          id="mobile"
          inputMode="tel"
          autoComplete="tel"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
          className="bg-input border-border"
          value={formData.mobileNumber}
          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
        />
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Profile Photo *
        </Label>
        <FileUpload
          folder="profile-photos"
          accept=".jpg,.jpeg,.png"
          maxSizeMB={5}
          label="Profile Photo"
          required
          value={formData.profilePhotoUrl}
          onUploadingChange={setUploading}
          onUploadComplete={(url) => handleFileUpload('profilePhotoUrl', url)}
        />
      </div>

      {Object.entries(errors).map(([field,message]) => <p key={field} role="alert" className="text-sm text-destructive">{message}</p>)}
      {/* Next Button */}
      <div className="flex justify-end pt-6 border-t border-border">
        <Button disabled={uploading} onClick={validateAndNext} className="btn-hero min-w-[120px]">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
