import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import mplLogo from "@/assets/mpl-logo-new.png";

const Hero = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center animate-fade-in">
          <img 
            src={mplLogo} 
            alt="MPL Logo" 
            className="w-80 h-80 object-contain animate-logo-glow"
          />
        </div>

        {/* Main Heading */}
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-glow-red tracking-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          MASUR PREMIER LEAGUE
        </h1>
        
        <div className="text-6xl md:text-8xl font-black mb-8 text-accent text-glow-gold">
          2025
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto font-medium tracking-wide">
          Play Fearless. Play for Glory. Play MPL 2025.
        </p>

        {/* CTA Button */}
        <Button 
          size="lg"
          onClick={scrollToRegistration}
          className="btn-hero text-lg px-10 py-7 rounded-xl font-bold group"
        >
          REGISTER NOW
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Registration Status */}
        <div className="mt-12 inline-flex items-center gap-2 px-6 py-3 bg-card/80 backdrop-blur-sm border border-accent/30 rounded-full">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-accent">Registration Open</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default Hero;
