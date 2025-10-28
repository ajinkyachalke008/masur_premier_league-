import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PersonalInfoStep from "./registration-steps/PersonalInfoStep";
import CricketProfileStep from "./registration-steps/CricketProfileStep";
import { RegistrationProvider } from "@/contexts/RegistrationContext";

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
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep onNext={nextStep} />;
      case 2:
        return <CricketProfileStep onBack={prevStep} />;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  return (
    <RegistrationProvider>
      <section id="registration" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
              PLAYER REGISTRATION
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Complete registration in 2 simple steps for MPL 2025
            </p>
          </div>

        <Card className="card-mpl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="text-sm font-semibold text-accent">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Title */}
          <div className="mb-8 pb-6 border-b border-border">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-black text-lg">
                {currentStep}
              </span>
              {stepTitles[currentStep - 1]}
            </h3>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Step Indicators */}
          {currentStep === 1 && (
            <div className="flex justify-center items-center pt-6 border-t border-border">
              <div className="flex gap-2">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i + 1 === currentStep
                        ? 'bg-primary w-8'
                        : i + 1 < currentStep
                        ? 'bg-accent'
                        : 'bg-muted'
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
