import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BorderBeam } from './ui/border-beam';
import MplLogo from './MplLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in session
    if (sessionStorage.getItem('mpl_pwa_dismissed') === '1') {
      return;
    }

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also show for mobile browsers after a small delay
    const isMobile = /android|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setVisible(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Trigger header install button or dialog
      const btn = document.querySelector('button[title*="Download / Install"]') as HTMLButtonElement;
      if (btn) btn.click();
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem('mpl_pwa_dismissed', '1');
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative overflow-hidden rounded-xl border border-accent/40 bg-card/95 backdrop-blur-xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3">
        <BorderBeam size={180} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-secondary/80 border border-accent/40 p-1 flex items-center justify-center">
            <MplLogo className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-foreground truncate">
              Install MPL 2026 App
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              Fast 1-tap home screen access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            onClick={handleInstall}
            className="btn-hero h-8 px-3 text-xs font-bold"
          >
            <Download className="h-3 w-3 mr-1" /> Install
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
