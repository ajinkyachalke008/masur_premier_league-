import { createContext, useContext, useState, ReactNode } from 'react';

export interface PersonalInfoData {
  fullName: string;
  jerseyName: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  fullAddress: string;
  mobileNumber: string;
  profilePhotoUrl: string;
  profilePhotoPreview?: string;
  govIdUrl: string;
}

export interface CricketProfileData {
  playingRole: string;
  battingStyle: string;
  bowlingStyle: string;
  bowlingHand: string;
  preferredBattingOrder: string;
  experienceLevel: string;
  currentClub: string;
  highestLevel: string;
  awards: string;
  
  resumeUrl: string;
  battingSkill: number;
  bowlingSkill: number;
  fieldingSkill: number;
  fitnessSkill: number;
}

interface RegistrationContextType {
  personalInfo: PersonalInfoData;
  cricketProfile: CricketProfileData;
  updatePersonalInfo: (data: Partial<PersonalInfoData>) => void;
  updateCricketProfile: (data: Partial<CricketProfileData>) => void;
  resetForm: () => void;
}

const initialPersonalInfo: PersonalInfoData = {
  fullName: '',
  jerseyName: '',
  dateOfBirth: '',
  gender: '',
  city: '',
  fullAddress: '',
  mobileNumber: '',
  profilePhotoUrl: '',
  govIdUrl: '',
};

const initialCricketProfile: CricketProfileData = {
  playingRole: '',
  battingStyle: '',
  bowlingStyle: '',
  bowlingHand: '',
  preferredBattingOrder: '',
  experienceLevel: '',
  currentClub: '',
  highestLevel: '',
  awards: '',
  
  resumeUrl: '',
  battingSkill: 5,
  bowlingSkill: 5,
  fieldingSkill: 5,
  fitnessSkill: 5,
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>(initialPersonalInfo);
  const [cricketProfile, setCricketProfile] = useState<CricketProfileData>(initialCricketProfile);

  const updatePersonalInfo = (data: Partial<PersonalInfoData>) => {
    setPersonalInfo(prev => ({ ...prev, ...data }));
  };

  const updateCricketProfile = (data: Partial<CricketProfileData>) => {
    setCricketProfile(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setPersonalInfo(initialPersonalInfo);
    setCricketProfile(initialCricketProfile);
  };

  return (
    <RegistrationContext.Provider
      value={{
        personalInfo,
        cricketProfile,
        updatePersonalInfo,
        updateCricketProfile,
        resetForm,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return context;
};
