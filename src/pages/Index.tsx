import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import RegistrationForm from "@/components/RegistrationForm";
import InstallPwaBanner from "@/components/InstallPwaBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Countdown />
      <RegistrationForm />
      <InstallPwaBanner />
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            © 2026 Masur Premier League. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Play Fearless. Play for Glory. Play MPL 2026.
          </p>
          <p className="text-xs text-muted-foreground pt-1 flex items-center justify-center gap-1.5 font-medium">
            <span>DEVELOPED BY :</span>
            <span className="text-accent font-bold tracking-wider">AJINKYA CHALKE</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
