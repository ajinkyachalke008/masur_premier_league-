import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';
import MplLogo from './MplLogo';
const Hero=()=> <section className="mpl-hero relative overflow-hidden">
 <img src={heroBanner} alt="Cricket stadium" className="absolute inset-0 h-full w-full object-cover" />
 <div className="hero-shade absolute inset-0" />
 <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><Link to="/" className="flex items-center gap-3"><MplLogo className="h-14 w-10"/><span className="font-bold text-sm">MPL <span className="text-accent">2026</span></span></Link><Button asChild variant="outline" className="border-accent/40 bg-background/70 text-accent"><Link to="/admin"><Lock/> Admin</Link></Button></header>
 <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pb-9 pt-3 text-center">
  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-accent"><span className="h-2 w-2 rounded-full bg-accent"/> Player registrations open</p>
  <MplLogo className="hero-logo mb-4" />
  <h1 className="sports-heading text-4xl leading-none sm:text-6xl md:text-7xl">MASUR PREMIER LEAGUE</h1>
  <p className="sports-heading mt-2 text-5xl text-accent sm:text-6xl">2026</p>
  <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-lg">Play Fearless. Play for Glory. Play MPL 2026.</p>
  <div className="mt-6 flex w-full max-w-sm flex-col gap-3"><Button className="btn-hero h-12 font-bold" onClick={()=>document.getElementById('registration')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}>PLAYER REGISTRATION <ArrowRight/></Button><Button asChild variant="outline" className="h-11 border-accent/40 bg-background/70 text-accent"><Link to="/admin"><Lock/> ADMIN LOGIN</Link></Button></div>
  <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">Registration closes 20 October 2026 <ArrowDown className="h-3 w-3"/></p>
 </div>
</section>;
export default Hero;
