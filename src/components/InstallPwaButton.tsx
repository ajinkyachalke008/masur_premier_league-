import { useState, useEffect } from 'react';
import { Download, Check, Share, Smartphone, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BorderBeam } from './ui/border-beam';
import MplLogo from './MplLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPwaButton({ className = '' }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setIsIosDevice(isIos);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      // Chrome / Edge / Android native install prompt
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIosDevice) {
      // Show iOS step-by-step instructions
      setShowIosGuide(true);
    } else {
      // Fallback instructions for other mobile / desktop browsers
      setShowIosGuide(true);
    }
  };

  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/80 border border-accent/30 text-accent text-xs font-semibold">
        <Check className="h-3.5 w-3.5" /> App Installed
      </span>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleInstallClick}
        className={`relative overflow-hidden h-9 sm:h-10 border-accent/60 bg-accent/15 hover:bg-accent/25 text-accent font-bold text-xs sm:text-sm px-3 sm:px-4 shadow-md transition-all active:scale-95 ${className}`}
        title="Download / Install MPL 2026 Mobile App"
      >
        <BorderBeam size={80} duration={6} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
        <Download className="h-3.5 w-3.5 mr-1.5 text-accent animate-bounce" />
        <span className="hidden xs:inline">Download</span> App
      </Button>

      {/* Guide Dialog for iOS and Desktop / Android browsers */}
      <Dialog open={showIosGuide} onOpenChange={setShowIosGuide}>
        <DialogContent className="w-[92vw] sm:max-w-md p-5 sm:p-6 bg-card border-accent/40 rounded-xl shadow-2xl">
          <BorderBeam size={220} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-3 flex items-center justify-center h-16 w-16 rounded-2xl bg-secondary/80 border border-accent/40 p-2 shadow-lg">
              <MplLogo className="h-full w-full object-contain" />
            </div>
            <DialogTitle className="sports-heading text-xl sm:text-2xl font-black text-foreground">
              Install MPL 2026 App
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Add MPL 2026 directly to your phone screen for instant 1-tap access and live offline updates!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {isIosDevice ? (
              <div className="space-y-2.5 rounded-lg bg-secondary/50 p-3.5 border border-border text-xs sm:text-sm">
                <p className="font-bold text-accent flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" /> On iPhone / Safari:
                </p>
                <div className="space-y-2 pl-1 text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-foreground bg-accent/20 rounded-full h-5 w-5 flex items-center justify-center shrink-0">1</span>
                    <span>Tap the <strong>Share button</strong> <Share className="inline h-3.5 w-3.5 mx-0.5 text-accent" /> at the bottom of Safari.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-foreground bg-accent/20 rounded-full h-5 w-5 flex items-center justify-center shrink-0">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong> (⊞).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-foreground bg-accent/20 rounded-full h-5 w-5 flex items-center justify-center shrink-0">3</span>
                    <span>Tap <strong>"Add"</strong> in the top right corner. Done!</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 rounded-lg bg-secondary/50 p-3.5 border border-border text-xs sm:text-sm">
                <p className="font-bold text-accent flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" /> On Chrome / Android:
                </p>
                <div className="space-y-2 pl-1 text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-foreground bg-accent/20 rounded-full h-5 w-5 flex items-center justify-center shrink-0">1</span>
                    <span>Tap the <strong>three dots menu (⋮)</strong> at the top right of Chrome.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-foreground bg-accent/20 rounded-full h-5 w-5 flex items-center justify-center shrink-0">2</span>
                    <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-foreground bg-accent/20 rounded-full h-5 w-5 flex items-center justify-center shrink-0">3</span>
                    <span>Tap <strong>"Install"</strong> — the official MPL icon will appear on your home screen!</span>
                  </p>
                </div>
              </div>
            )}

            <Button
              className="btn-hero w-full h-11 text-xs sm:text-sm font-bold mt-2"
              onClick={() => setShowIosGuide(false)}
            >
              Got It!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
