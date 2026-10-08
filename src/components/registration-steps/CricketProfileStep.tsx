import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Award, ChevronLeft, Send, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import FileUpload from "@/components/ui/file-upload";
import paymentQrImage from "@/assets/payment-qr.png";
import { useRegistration } from "@/contexts/RegistrationContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import RegistrationReceipt, { ReceiptData } from "@/components/RegistrationReceipt";
import { BorderBeam } from "@/components/ui/border-beam";

interface CricketProfileStepProps {
  onBack: () => void;
  onComplete?: () => void;
}

const CricketProfileStep = ({ onBack, onComplete }: CricketProfileStepProps) => {
  const { personalInfo, cricketProfile, updateCricketProfile, resetForm } = useRegistration();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const handleDone = () => {
    setShowCelebration(false);
    resetForm();
    onComplete?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.location.href = '/';
    }, 350);
  };
  
  const [formData, setFormData] = useState(cricketProfile);

  useEffect(() => {
    setFormData(cricketProfile);
  }, [cricketProfile]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleFileUpload = (url: string) => {
    setFormData(prev => ({ ...prev, resumeUrl: url }));
  };

// Safe UUID generator compatible with both HTTPS and mobile local HTTP contexts
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback if blocked in insecure context
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

  const [requestKey] = useState(() => generateUUID());

  const handleSubmit = async () => {
    if (!personalInfo.fullName?.trim()) {
      toast({ title: "Name required", description: "Please enter your full name in Step 1.", variant: "destructive" });
      return;
    }
    if (!personalInfo.profilePhotoUrl) {
      toast({ title: "Profile photo required", description: "Please upload your profile photo in Step 1.", variant: "destructive" });
      return;
    }
    if (!formData.playingRole || !formData.battingStyle) {
      toast({
        title: "Missing Information",
        description: "Please select both Playing Role and Batting Style.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.resumeUrl) {
      toast({
        title: "Payment screenshot required",
        description: "Please pay using the UPI QR code and upload your payment screenshot.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      updateCricketProfile(formData);

      const bowlingStyleFull = formData.bowlingHand && formData.bowlingStyle && formData.bowlingStyle !== 'None'
        ? `${formData.bowlingHand} ${formData.bowlingStyle}`
        : (formData.bowlingStyle === 'None' ? null : formData.bowlingStyle || null);

      const cleanMobile = personalInfo.mobileNumber.replace(/[\s-]/g, '');

      const payload = {
        request_key: requestKey,
        full_name: personalInfo.fullName.trim(),
        jersey_name: (personalInfo.jerseyName || personalInfo.fullName).trim(),
        date_of_birth: personalInfo.dateOfBirth,
        mobile_number: cleanMobile.startsWith('+91') ? cleanMobile : (cleanMobile.length === 10 ? cleanMobile : `+91${cleanMobile}`),
        profile_photo_url: personalInfo.profilePhotoUrl,
        resume_url: formData.resumeUrl,
        playing_role: formData.playingRole,
        batting_style: formData.battingStyle,
        bowling_style: bowlingStyleFull,
      };

      const { data, error } = await supabase.functions.invoke('submit-registration', {
        body: payload,
      });

      if (error || (data as any)?.error) {
        const errorMsg = (data as any)?.error || error?.message || "Failed to submit registration. Please check your details and try again.";
        console.error('Submission error:', error || data);
        toast({
          title: "Submission Failed",
          description: errorMsg,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      setReceiptData({
        registrationId: data.registration_id,
        fullName: personalInfo.fullName.trim(),
        jerseyName: (personalInfo.jerseyName || personalInfo.fullName).trim(),
        dateOfBirth: personalInfo.dateOfBirth,
        mobileNumber: personalInfo.mobileNumber,
        profilePhotoUrl: personalInfo.profilePhotoPreview,
        playingRole: formData.playingRole,
        battingStyle: formData.battingStyle,
        bowlingStyle: bowlingStyleFull,
        submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      });
      setShowCelebration(true);
      resetForm();
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Playing Role */}
        <div className="space-y-2">
          <Label htmlFor="playingRole" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <Target className="h-4 w-4 text-primary" />
            Playing Role *
          </Label>
          <Select value={formData.playingRole} onValueChange={(value) => handleInputChange('playingRole', value)}>
            <SelectTrigger className="bg-input border-border h-11">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Batsman">Batsman</SelectItem>
              <SelectItem value="Bowler">Bowler</SelectItem>
              <SelectItem value="All-Rounder">All-Rounder</SelectItem>
              <SelectItem value="Wicket-Keeper">Wicket-Keeper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batting Style */}
        <div className="space-y-2">
          <Label htmlFor="battingStyle" className="text-xs sm:text-sm font-semibold">Batting Style *</Label>
          <Select value={formData.battingStyle} onValueChange={(value) => handleInputChange('battingStyle', value)}>
            <SelectTrigger className="bg-input border-border h-11">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Right-Hand">Right-Hand</SelectItem>
              <SelectItem value="Left-Hand">Left-Hand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Bowling Style */}
        <div className="space-y-2">
          <Label htmlFor="bowlingStyle" className="text-xs sm:text-sm font-semibold">Bowling Style</Label>
          <Select value={formData.bowlingStyle} onValueChange={(value) => handleInputChange('bowlingStyle', value)}>
            <SelectTrigger className="bg-input border-border h-11">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fast">Fast</SelectItem>
              <SelectItem value="Medium Pace">Medium Pace</SelectItem>
              <SelectItem value="Spin">Spin</SelectItem>
              <SelectItem value="None">Don't Bowl</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bowling Hand */}
        <div className="space-y-2">
          <Label htmlFor="bowlingHand" className="text-xs sm:text-sm font-semibold">Bowling Hand</Label>
          <Select value={formData.bowlingHand} onValueChange={(value) => handleInputChange('bowlingHand', value)}>
            <SelectTrigger className="bg-input border-border h-11">
              <SelectValue placeholder="Select hand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Right-Arm">Right-Arm</SelectItem>
              <SelectItem value="Left-Arm">Left-Arm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Awards & Achievements */}
      <div className="space-y-2">
        <Label htmlFor="awards" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
          <Award className="h-4 w-4 text-accent" />
          Awards & Achievements (Optional)
        </Label>
        <Textarea 
          id="awards" 
          placeholder="List your cricket awards, achievements, tournaments, or notable performances"
          className="bg-input border-border resize-none"
          rows={3}
          value={formData.awards}
          onChange={(e) => handleInputChange('awards', e.target.value)}
        />
      </div>

      {/* Payment */}
      <div className="space-y-4 pt-5 sm:pt-6 border-t border-border">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-bold text-foreground">Registration Payment *</h4>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-accent font-black text-xs sm:text-sm">
              ₹100 Fee
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Player Registration Fee is <strong className="text-accent font-bold">₹100</strong>. Pay via UPI using PhonePe, Google Pay, or Paytm, then upload your payment screenshot below.
          </p>
        </div>

        {/* Mobile UPI Direct App Payment Link */}
        <div className="flex flex-col items-center gap-2">
          <a
            href="upi://pay?pa=9158482736-3@ibl&pn=DIPAK%20MAHADEV%20SHIRTODE&am=100&cu=INR&tn=MPL%202026%20Registration"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-accent text-accent-foreground font-black text-xs sm:text-sm tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-transform min-h-[48px] text-center"
          >
            ⚡ Tap to Pay ₹100 via UPI (PhonePe / GPay / Paytm)
          </a>
          <p className="text-[11px] text-muted-foreground sm:hidden">or scan the PhonePe QR code below</p>
        </div>

        <div className="relative w-full max-w-[200px] sm:max-w-xs mx-auto rounded-lg">
          <img 
            src={paymentQrImage} 
            alt="PhonePe Payment QR code - DIPAK MAHADEV SHIRTODE" 
            className="w-full rounded-lg border border-border shadow-md" 
            loading="lazy" 
          />
          <BorderBeam size={180} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center px-1">
          <p className="text-xs text-muted-foreground">
            Payee: <span className="text-foreground font-bold">DIPAK MAHADEV SHIRTODE</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="upi://pay?pa=9158482736-3@ibl&pn=DIPAK%20MAHADEV%20SHIRTODE&am=100&cu=INR&tn=MPL%202026%20Registration"
              className="font-mono text-xs sm:text-sm text-accent bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded border border-accent/40 break-all max-w-full inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
              title="Click to directly open UPI Payment App"
            >
              <span>UPI ID: 9158482736-3@ibl</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 group-hover:scale-110 transition-transform" />
            </a>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="h-8 px-2.5 text-xs font-semibold"
              onClick={() => { 
                const upi = '9158482736-3@ibl';
                if (navigator?.clipboard?.writeText) {
                  navigator.clipboard.writeText(upi).catch(() => {});
                }
                toast({ title: 'UPI ID copied', description: '9158482736-3@ibl copied to clipboard' }); 
              }}
            >
              Copy
            </Button>
          </div>
        </div>

        <FileUpload 
          folder="payment-screenshots" 
          accept="image/*" 
          maxSizeMB={5} 
          label="Payment Screenshot" 
          required 
          onUploadComplete={handleFileUpload} 
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 sm:pt-6 border-t border-border sm:justify-between items-stretch sm:items-center">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[120px] h-12 text-sm sm:text-base font-semibold"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-hero w-full sm:w-auto min-w-[180px] h-12 text-sm sm:text-base font-bold tracking-wide"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Registration Receipt Popup */}
      <Dialog 
        open={showCelebration} 
        onOpenChange={(open) => {
          if (!open) {
            handleDone();
          } else {
            setShowCelebration(true);
          }
        }}
      >
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[92dvh] overflow-y-auto p-3 sm:p-6 border-accent/40 bg-background rounded-xl">
          {receiptData && (
            <RegistrationReceipt
              data={receiptData}
              onClose={handleDone}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CricketProfileStep;
