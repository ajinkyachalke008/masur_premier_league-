import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Award, ChevronLeft, Send } from "lucide-react";
import { useState, useEffect } from "react";
import FileUpload from "@/components/ui/file-upload";
import { useRegistration } from "@/contexts/RegistrationContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CricketProfileStepProps {
  onBack: () => void;
}

const CricketProfileStep = ({ onBack }: CricketProfileStepProps) => {
  const { personalInfo, cricketProfile, updateCricketProfile, resetForm } = useRegistration();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        batting_skill: formData.battingSkill,
        bowling_skill: formData.bowlingSkill,
        fielding_skill: formData.fieldingSkill,
        fitness_skill: formData.fitnessSkill,
        status: 'submitted',
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
            
            resume_url: playerRecord.resume_url,
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
      toast({
        title: "Registration Complete! 🎉",
        description: `Your registration ID is: ${playerRecord.registration_id}. We'll contact you soon!`,
      });

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

      {/* Skill Ratings */}
      <div className="space-y-6 pt-6 border-t border-border">
        <h4 className="text-lg font-bold text-foreground">Rate Your Skills (1-10)</h4>

        {/* Batting Skill */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Batting</Label>
            <span className="text-accent font-bold text-lg">{formData.battingSkill}/10</span>
          </div>
          <Slider
            value={[formData.battingSkill]}
            onValueChange={(value) => handleSliderChange('battingSkill', value)}
            max={10}
            min={1}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Bowling Skill */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Bowling</Label>
            <span className="text-accent font-bold text-lg">{formData.bowlingSkill}/10</span>
          </div>
          <Slider
            value={[formData.bowlingSkill]}
            onValueChange={(value) => handleSliderChange('bowlingSkill', value)}
            max={10}
            min={1}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Fielding Skill */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Fielding</Label>
            <span className="text-accent font-bold text-lg">{formData.fieldingSkill}/10</span>
          </div>
          <Slider
            value={[formData.fieldingSkill]}
            onValueChange={(value) => handleSliderChange('fieldingSkill', value)}
            max={10}
            min={1}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Fitness */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Fitness</Label>
            <span className="text-accent font-bold text-lg">{formData.fitnessSkill}/10</span>
          </div>
          <Slider
            value={[formData.fitnessSkill]}
            onValueChange={(value) => handleSliderChange('fitnessSkill', value)}
            max={10}
            min={1}
            step={1}
            className="cursor-pointer"
          />
        </div>
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
    </div>
  );
};

export default CricketProfileStep;
