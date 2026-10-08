import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MplLogo from "./MplLogo";
import PersonalInfoStep from "./registration-steps/PersonalInfoStep";
import CricketProfileStep from "./registration-steps/CricketProfileStep";
import { RegistrationProvider } from "@/contexts/RegistrationContext";
import { BorderBeam } from "@/components/ui/border-beam";

const TOTAL_STEPS = 2;

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const stepTitles = [
    "Personal Information",
    "Cricket Profile & Submit"
  ];

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        const el = document.getElementById("registration");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 60);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        const el = document.getElementById("registration");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 60);
    }
  };

  const resetToStepOne = () => {
    setCurrentStep(1);
    const el = document.getElementById("registration");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep onNext={nextStep} />;
      case 2:
        return <CricketProfileStep onBack={prevStep} onComplete={resetToStepOne} />;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  return (
    <RegistrationProvider>
      <section id="registration" className="py-8 sm:py-16 md:py-20 px-2 sm:px-6">
        <div className="container mx-auto max-w-4xl px-2 sm:px-4">
          <div className="text-center mb-5 sm:mb-8">
            <MplLogo className="mx-auto mb-2.5 sm:mb-4 h-16 w-12 sm:h-24 sm:w-16" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-1.5 sm:mb-4 text-foreground">
              PLAYER REGISTRATION
            </h2>
            <p className="text-muted-foreground text-xs sm:text-base mb-4 sm:mb-8">
              Complete registration in 2 simple steps for MPL 2026
            </p>
          </div>

        <Card className="relative border-t border-accent/30 py-5 sm:py-6 px-3.5 sm:px-8 rounded-xl shadow-xl">
          <BorderBeam size={360} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2.5 sm:mb-4">
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-accent">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Title */}
          <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
            <h3 className="text-lg sm:text-2xl font-bold text-foreground flex items-center gap-2.5 sm:gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-primary text-primary-foreground font-black text-sm sm:text-lg">
                {currentStep}
              </span>
              {stepTitles[currentStep - 1]}
            </h3>
          </div>

          {/* Step Content */}
          <div className="mb-6 sm:mb-8">
            {renderStep()}
          </div>

          {/* Step Indicators */}
          {currentStep === 1 && (
            <div className="flex justify-center items-center pt-5 sm:pt-6 border-t border-border">
              <div className="flex gap-2">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i + 1 === currentStep
                        ? 'bg-primary w-8'
                        : i + 1 < currentStep
                        ? 'bg-accent w-2'
                        : 'bg-muted w-2'
                    }`}
                    aria-label={`Step ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
    </RegistrationProvider>
  );
};

export default RegistrationForm;
