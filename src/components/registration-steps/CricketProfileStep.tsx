import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Award, ChevronLeft, Send } from "lucide-react";
import { useState, useEffect } from "react";
import FileUpload from "@/components/ui/file-upload";
import qrAsset from "@/assets/payment-qr.png.asset.json";
import { useRegistration } from "@/contexts/RegistrationContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PartyPopper } from "lucide-react";

interface CricketProfileStepProps {
  onBack: () => void;
}

const CricketProfileStep = ({ onBack }: CricketProfileStepProps) => {
  const { personalInfo, cricketProfile, updateCricketProfile, resetForm } = useRegistration();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confirmedRegId, setConfirmedRegId] = useState("");
  
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

  const handleSubmit = async () => {
    // Validate required fields
    if (formData.playingRole && formData.battingStyle && !formData.resumeUrl) {
      toast({ title: "Payment screenshot required", description: "Please pay using the QR and upload the payment screenshot.", variant: "destructive" });
      return;
    }
    if (!formData.playingRole || !formData.battingStyle) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields (Playing Role, Batting Style).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save cricket profile to context
      updateCricketProfile(formData);

      // Combine bowling style and hand
      const bowlingStyleFull = formData.bowlingHand && formData.bowlingStyle
        ? `${formData.bowlingHand} ${formData.bowlingStyle}`
        : formData.bowlingStyle || null;

      const registrationId = 'MPL-' + crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
      const createdAt = new Date().toISOString();

      // Insert into players table (anonymous submission allowed)
      const insertData: any = {
        registration_id: registrationId,
        full_name: personalInfo.fullName,
        jersey_name: personalInfo.jerseyName || null,
        date_of_birth: personalInfo.dateOfBirth || null,
        city: personalInfo.city || null,
        mobile_number: personalInfo.mobileNumber || null,
        profile_photo_url: personalInfo.profilePhotoUrl || null,
        playing_role: formData.playingRole,
        batting_style: formData.battingStyle,
        bowling_style: bowlingStyleFull,
        awards_achievements: formData.awards?.trim() || null,
        resume_url: formData.resumeUrl || null, // payment screenshot
        status: 'payment_pending_verification',
      };

      // Insert without reading back (visitors can't read rows)
      const { error: insertError } = await supabase.from('players').insert(insertData);

      if (insertError) {
        console.error('Insert error:', insertError);
        toast({
          title: "Submission Failed",
          description: insertError.message || "Failed to submit registration. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const playerData = { ...insertData, created_at: createdAt };

      // Send Telegram notification
      try {
        const playerRecord = playerData as any;
        const { error: notificationError } = await supabase.functions.invoke('notify-registration', {
          body: {
            registration_id: playerRecord.registration_id,
            full_name: playerRecord.full_name,
            jersey_name: playerRecord.jersey_name,
            date_of_birth: playerRecord.date_of_birth,
            gender: playerRecord.gender,
            city: playerRecord.city,
            full_address: playerRecord.full_address,
            mobile_number: playerRecord.mobile_number,
            profile_photo_url: playerRecord.profile_photo_url,
            gov_id_url: playerRecord.gov_id_url,
            playing_role: playerRecord.playing_role,
            batting_style: playerRecord.batting_style,
            bowling_style: playerRecord.bowling_style,
            preferred_batting_order: playerRecord.preferred_batting_order,
            experience_level: playerRecord.experience_level,
            current_club: playerRecord.current_club,
            highest_level_played: playerRecord.highest_level_played,
            awards_achievements: playerRecord.awards_achievements,
            
            payment_screenshot_url: playerRecord.resume_url,
            batting_skill: playerRecord.batting_skill,
            bowling_skill: playerRecord.bowling_skill,
            fielding_skill: playerRecord.fielding_skill,
            fitness_skill: playerRecord.fitness_skill,
            created_at: playerRecord.created_at,
          },
        });

        if (notificationError) {
          console.error('Notification error:', notificationError);
          // Don't fail the whole submission if notification fails
        }
      } catch (notifError) {
        console.error('Telegram notification error:', notifError);
        // Continue even if notification fails
      }

      const playerRecord = playerData as any;
      setConfirmedRegId(playerRecord.registration_id);
      setShowCelebration(true);

      // Reset form
      resetForm();
      
      setIsSubmitting(false);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Playing Role */}
        <div className="space-y-2">
          <Label htmlFor="playingRole" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Playing Role *
          </Label>
          <Select value={formData.playingRole} onValueChange={(value) => handleInputChange('playingRole', value)}>
            <SelectTrigger className="bg-input border-border">
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
          <Label htmlFor="battingStyle">Batting Style *</Label>
          <Select value={formData.battingStyle} onValueChange={(value) => handleInputChange('battingStyle', value)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Right-Hand">Right-Hand</SelectItem>
              <SelectItem value="Left-Hand">Left-Hand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bowling Style */}
        <div className="space-y-2">
          <Label htmlFor="bowlingStyle">Bowling Style</Label>
          <Select value={formData.bowlingStyle} onValueChange={(value) => handleInputChange('bowlingStyle', value)}>
            <SelectTrigger className="bg-input border-border">
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
          <Label htmlFor="bowlingHand">Bowling Hand</Label>
          <Select value={formData.bowlingHand} onValueChange={(value) => handleInputChange('bowlingHand', value)}>
            <SelectTrigger className="bg-input border-border">
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
        <Label htmlFor="awards" className="flex items-center gap-2">
          <Award className="h-4 w-4 text-accent" />
          Awards & Achievements
        </Label>
        <Textarea 
          id="awards" 
          placeholder="List your cricket awards, achievements, or notable performances"
          className="bg-input border-border resize-none"
          rows={3}
          value={formData.awards}
          onChange={(e) => handleInputChange('awards', e.target.value)}
        />
      </div>

      {/* Payment */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-lg font-bold text-foreground">Registration Payment *</h4>
        <p className="text-sm text-muted-foreground">Scan the QR with Google Pay, PhonePe, Paytm or BHIM and pay the registration fee. Then upload a screenshot of the payment.</p>
        <img src={qrAsset.url} alt="Payment QR code" className="w-full max-w-xs mx-auto rounded-lg" loading="lazy" />
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-sm text-foreground">UPI ID: ajinkyachalke008@oksbi</span>
          <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText('ajinkyachalke008@oksbi'); toast({ title: 'UPI ID copied' }); }}>Copy</Button>
        </div>
        <FileUpload folder="payment-screenshots" accept="image/*" maxSizeMB={5} label="Payment Screenshot" required onUploadComplete={handleFileUpload} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-hero min-w-[150px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Celebration Popup */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="text-center sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center animate-bounce">
                <PartyPopper className="h-10 w-10 text-accent" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-black text-center">
              🎉 Registration Complete! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Congratulations! Your registration for MPL 2026 has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 p-4 rounded-lg bg-card border border-accent/30">
            <p className="text-sm text-muted-foreground mb-1">Your Registration ID</p>
            <p className="text-2xl font-black text-accent tracking-wider">{confirmedRegId}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Save this ID. We'll verify your payment and contact you soon!
          </p>
          <Button className="btn-hero w-full mt-4" onClick={() => setShowCelebration(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CricketProfileStep;
