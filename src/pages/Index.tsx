import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import FAQ from "@/components/FAQ";
import RegistrationForm from "@/components/RegistrationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Countdown />
      <RegistrationForm />
      <FAQ />
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Masur Premier League. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Play Fearless. Play for Glory. Play MPL 2025.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
