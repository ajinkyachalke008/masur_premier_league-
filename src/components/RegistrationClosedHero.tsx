import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';
import goldShimmerGif from '@/assets/mpl-gold-shimmer.gif';
import closedPoster from '@/assets/mpl-2026-registration-closed.png';
import MplLogo from './MplLogo';
import GifText from '@/components/ui/gif-text';
import { BorderBeam } from '@/components/ui/border-beam';
import InstallPwaButton from './InstallPwaButton';
import { REGISTRATION_CLOSED_MESSAGE } from '@/config/registration';

const RegistrationClosedHero = () => (
  <section className="relative overflow-hidden flex flex-col justify-between min-h-[90vh]">
    {/* Stadium background atmosphere */}
    <img
      src={heroBanner}
      alt="Cricket stadium background"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="hero-shade absolute inset-0" />

    {/* Header Navigation */}
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
      <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
        <MplLogo className="h-10 w-7 sm:h-12 sm:w-9 transition-transform group-hover:scale-105" />
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
          className="h-9 sm:h-10 border-accent/40 bg-background/70 text-accent text-xs sm:text-sm px-3 sm:px-4 hover:bg-accent/15"
        >
          <Link to="/admin">
            <Lock className="h-3.5 w-3.5 mr-1.5" /> Admin Panel
          </Link>
        </Button>
      </div>
    </header>

    {/* Main Announcement Container */}
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 sm:px-6 pb-10 sm:pb-14 pt-2 sm:pt-4 text-center">
      {/* Developer Credits */}
      <div className="mb-3 sm:mb-4 flex items-center justify-center">
        <div className="relative overflow-hidden flex items-center bg-black/60 backdrop-blur-md border border-accent/40 rounded-full px-4 py-1.5 shadow-md">
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

      {/* Target anchor for legacy links/bookmarks */}
      <div id="registration" className="scroll-mt-6" />

      {/* Status Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-destructive/20 border border-destructive/50 text-foreground text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 sm:mb-5 shadow-lg backdrop-blur-md">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
        </span>
        <span className="text-white font-extrabold tracking-wide">
          Official Announcement · Registration Closed
        </span>
      </div>

      {/* Official Announcement Poster (Main Visual Element) */}
      <div className="relative mx-auto w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] md:max-w-[540px] rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 border border-accent/40 bg-gradient-to-b from-accent/25 via-black/80 to-black/95 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        <BorderBeam size={280} duration={10} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
        <img
          src={closedPoster}
          alt="Masur Premier League MPL 2026 Registration Closed Announcement Poster"
          className="w-full h-auto object-contain block rounded-xl sm:rounded-2xl select-none"
          width={480}
          height={512}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Accompanying Statement and Unobtrusive Admin Portal Access */}
      <div className="mt-5 sm:mt-6 text-center max-w-xl mx-auto px-2 space-y-2.5">
        <h1 className="sports-heading text-2xl xs:text-3xl sm:text-4xl text-foreground font-black tracking-wide uppercase leading-tight">
          Player Registration Is <span className="text-accent">Closed</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {REGISTRATION_CLOSED_MESSAGE}
        </p>

        {/* Unobtrusive Admin Portal Link */}
        <div className="pt-3 flex items-center justify-center">
          <Button
            asChild
            variant="outline"
            className="h-10 sm:h-11 px-5 border-accent/40 bg-card/85 hover:bg-accent/15 text-accent text-xs sm:text-sm font-semibold tracking-wide rounded-lg shadow-md transition-colors"
          >
            <Link to="/admin" className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Organizer &amp; Admin Panel</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default RegistrationClosedHero;
