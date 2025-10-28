import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar, ChevronRight } from "lucide-react";
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

  useEffect(() => {
    setFormData(personalInfo);
  }, [personalInfo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'profilePhotoUrl' | 'govIdUrl', url: string) => {
    setFormData(prev => ({ ...prev, [field]: url }));
  };

  const validateAndNext = () => {
    // Validate required fields
    if (!formData.fullName || !formData.jerseyName || !formData.dateOfBirth || 
        !formData.gender || !formData.nationality || !formData.state || 
        !formData.city || !formData.fullAddress || !formData.mobileNumber ||
        !formData.profilePhotoUrl || !formData.govIdUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and upload required documents.",
        variant: "destructive",
      });
      return;
    }

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nationality */}
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality *</Label>
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            State *
          </Label>
          <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
              <SelectItem value="Karnataka">Karnataka</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              <SelectItem value="Telangana">Telangana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input 
            id="city" 
            placeholder="Enter your city"
            className="bg-input border-border"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Full Address *</Label>
        <Textarea 
          id="address" 
          placeholder="Enter your complete address"
          className="bg-input border-border resize-none"
          rows={3}
          value={formData.fullAddress}
          onChange={(e) => handleInputChange('fullAddress', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Mobile Number *
          </Label>
          <Input 
            id="mobile" 
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="bg-input border-border"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Email Address (Optional)
          </Label>
          <Input 
            id="email" 
            type="email"
            placeholder="your.email@example.com"
            className="bg-input border-border"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
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
          onUploadComplete={(url) => handleFileUpload('profilePhotoUrl', url)}
        />
      </div>

      {/* Government ID Upload */}
      <div className="space-y-2">
        <Label>
          Government ID (Aadhaar/Passport/Driving License) *
        </Label>
        <FileUpload
          folder="government-ids"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={10}
          label="Government ID"
          onUploadComplete={(url) => handleFileUpload('govIdUrl', url)}
        />
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-6 border-t border-border">
        <Button onClick={validateAndNext} className="btn-hero min-w-[120px]">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
