import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';
import goldShimmerGif from '@/assets/mpl-gold-shimmer.gif';
import MplLogo from './MplLogo';
import GifText from '@/components/ui/gif-text';

import { BorderBeam } from '@/components/ui/border-beam';
import InstallPwaButton from './InstallPwaButton';

const Hero = () => (
  <section className="mpl-hero relative overflow-hidden flex flex-col justify-between">
    <img
      src={heroBanner}
      alt="Cricket stadium"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="hero-shade absolute inset-0" />
    
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
      <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
        <MplLogo className="h-11 w-8 sm:h-14 sm:w-10 transition-transform group-hover:scale-105" />
        <span className="font-bold text-xs sm:text-sm tracking-wide">
          MPL <span className="text-accent">2026</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <InstallPwaButton />
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 sm:h-10 border-accent/40 bg-background/70 text-accent text-xs sm:text-sm px-3 sm:px-4"
        >
          <Link to="/admin">
            <Lock className="h-3.5 w-3.5 mr-1" /> Admin
          </Link>
        </Button>
      </div>
    </header>

    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 sm:px-6 pb-8 sm:pb-12 pt-1 sm:pt-4 text-center">
      {/* Developer Credits */}
      <div className="mb-2.5 sm:mb-3.5 flex items-center justify-center">
        <div className="relative overflow-hidden flex items-center bg-black/50 backdrop-blur-md border border-accent/40 rounded-full px-4 py-1.5 shadow-md">
          <GifText
            as="span"
            text="DEVELOPED BY : AJINKYA CHALKE"
            gif={goldShimmerGif}
            containerClassName="inline-flex"
            className="sports-heading text-xs sm:text-sm font-black tracking-widest uppercase leading-tight"
          >
            DEVELOPED BY : AJINKYA CHALKE
          </GifText>
          <BorderBeam size={110} duration={6} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
        </div>
      </div>
      
      {/* Logo with Cinematic Glowing Stadium Aura Behind It */}
      <div className="relative mb-3 sm:mb-4 flex items-center justify-center">
        {/* Soft breathing radial stadium bloom */}
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 sm:-inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,200,61,0.45)_0%,rgba(255,106,0,0.25)_50%,transparent_75%)] blur-2xl sm:blur-3xl animate-pulse" 
        />
        {/* Slow rotating golden light halo */}
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute -inset-5 sm:-inset-8 rounded-full bg-gradient-to-tr from-accent/20 via-primary/30 to-accent/25 blur-3xl opacity-80 animate-[spin_14s_linear_infinite]" 
        />
        {/* Centered intense warm core */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-28 w-28 sm:h-44 sm:w-44 rounded-full bg-accent/30 blur-xl animate-pulse"
        />

        {/* Official MPL Logo on top */}
        <MplLogo className="hero-logo relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)]" />
      </div>
      
      <GifText
        as="h1"
        text="MASUR PREMIER LEAGUE"
        gif={goldShimmerGif}
        className="sports-heading text-3xl xs:text-4xl sm:text-6xl md:text-7xl leading-none"
      >
        <span className="block sm:inline">MASUR PREMIER </span>
        <span className="block sm:inline">LEAGUE</span>
      </GifText>
      
      <p className="sports-heading mt-1 sm:mt-2 text-4xl xs:text-5xl sm:text-6xl text-accent">
        2026
      </p>
      
      <p className="mt-2.5 sm:mt-3 max-w-lg text-xs xs:text-sm sm:text-lg text-muted-foreground px-2">
        Play Fearless. Play for Glory. Play MPL 2026.
      </p>
      
      <div className="mt-5 sm:mt-6 flex w-full max-w-xs sm:max-w-sm flex-col gap-2.5 sm:gap-3 px-2">
        <Button
          className="btn-hero h-12 text-sm sm:text-base font-bold tracking-wide"
          onClick={() =>
            document.getElementById('registration')?.scrollIntoView({
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            })
          }
        >
          PLAYER REGISTRATION <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 border-accent/40 bg-background/70 text-accent text-xs sm:text-sm font-semibold"
        >
          <Link to="/admin">
            <Lock className="h-3.5 w-3.5 mr-1.5" /> ADMIN LOGIN
          </Link>
        </Button>
      </div>
      
      <p className="mt-4 sm:mt-5 flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
        Registration closes 20 October 2026 <ArrowDown className="h-3 w-3" />
      </p>
    </div>
  </section>
);
export default Hero;
