import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MplLogo from './MplLogo';
import { Download, Printer, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BorderBeam } from './ui/border-beam';

export interface ReceiptData {
  registrationId: string;
  fullName: string;
  jerseyName: string;
  dateOfBirth: string;
  mobileNumber: string;
  profilePhotoUrl?: string;
  playingRole: string;
  battingStyle: string;
  bowlingStyle?: string | null;
  submittedAt: string;
}

interface Props {
  data: ReceiptData;
  onClose: () => void;
}

export default function RegistrationReceipt({ data, onClose }: Props) {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `🏏 MPL 2026 Registration Receipt\nName: ${data.fullName}\nReg ID: ${data.registrationId}\nRole: ${data.playingRole}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MPL 2026 Registration Receipt',
          text,
        });
      } catch {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Receipt copied to clipboard' });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Printable Receipt Container */}
      <div 
        ref={printRef} 
        id="mpl-receipt" 
        className="relative rounded-xl border border-accent/40 bg-card p-3.5 sm:p-6 text-foreground shadow-2xl overflow-hidden print:m-0 print:p-6 print:border-black print:text-black print:bg-white"
      >
        <BorderBeam className="print:hidden" size={360} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
        {/* Decorative Watermark */}
        <div className="absolute right-[-20px] top-[-20px] opacity-5 pointer-events-none print:opacity-10">
          <MplLogo className="w-56 h-56 sm:w-64 sm:h-64" />
        </div>

        {/* Receipt Header */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 sm:gap-3 border-b border-border pb-3 sm:pb-4 print:border-gray-400">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <MplLogo className="h-12 w-9 sm:h-16 sm:w-12 shrink-0" />
            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground print:text-black leading-tight">
                MASUR PREMIER LEAGUE
              </h2>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-accent font-bold print:text-gray-700">
                Official Registration Slip · 2026
              </p>
            </div>
          </div>
          <div className="self-start xs:self-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-green-400 border border-green-500/20 print:border-green-600 print:text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> SUBMITTED
            </span>
          </div>
        </div>

        {/* Registration ID Badge */}
        <div className="relative my-3 sm:my-4 rounded-lg bg-secondary/80 p-2.5 sm:p-3 text-center border border-accent/20 print:bg-gray-100 print:border-gray-300">
          <BorderBeam className="print:hidden" size={160} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider print:text-gray-600 font-semibold">
            Registration Number
          </p>
          <p className="text-xl sm:text-3xl font-black tracking-widest text-accent font-mono print:text-black break-all">
            {data.registrationId}
          </p>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 print:text-gray-500">
            Issued on {data.submittedAt}
          </p>
        </div>

        {/* Player Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-3 sm:my-4">
          {/* Photo */}
          <div className="relative flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/40 border border-border print:border-gray-300">
            <BorderBeam className="print:hidden" size={140} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
            {data.profilePhotoUrl ? (
              <img 
                src={data.profilePhotoUrl} 
                alt={data.fullName}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg object-cover border border-accent/30 shadow-md"
              />
            ) : (
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                No Photo
              </div>
            )}
            <span className="text-[10px] sm:text-[11px] font-semibold text-accent mt-1.5 print:text-black">Verified Photo</span>
          </div>

          {/* Core Info */}
          <div className="sm:col-span-2 grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <DetailItem label="Player Name" value={data.fullName} highlight />
            <DetailItem label="Jersey Name" value={data.jerseyName} />
            <DetailItem label="Date of Birth" value={data.dateOfBirth} />
            <DetailItem label="Mobile" value={data.mobileNumber} />
            <DetailItem label="Playing Role" value={data.playingRole} highlight />
            <DetailItem label="Batting Style" value={data.battingStyle} />
            <DetailItem label="Bowling Style" value={data.bowlingStyle || '—'} />
            <DetailItem label="Registration Fee" value="₹100 · Uploaded (Under Review)" highlight />
          </div>
        </div>

        {/* Footer Notes */}
        <div className="border-t border-border pt-3 text-[10px] sm:text-[11px] text-muted-foreground space-y-1 print:border-gray-300 print:text-gray-600">
          <p className="flex items-center gap-1.5 font-medium text-foreground print:text-black">
            <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
            Organizers will verify the ₹100 registration fee payment via your uploaded screenshot.
          </p>
          <p>
            Please preserve this receipt and your Registration ID ({data.registrationId}) for auction day verification.
          </p>
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 pt-2 print:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-10 text-xs sm:text-sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1.5" /> Print / Save PDF
          </Button>
          <Button variant="outline" size="sm" className="h-10 text-xs sm:text-sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1.5" /> Share
          </Button>
        </div>
        <Button className="btn-hero h-10 text-xs sm:text-sm font-bold min-w-[110px]" size="sm" onClick={onClose}>
          Done ✓
        </Button>
      </div>
    </div>
  );
}

function DetailItem({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider print:text-gray-600">
        {label}
      </p>
      <p className={`font-semibold break-words ${highlight ? 'text-accent print:text-black' : 'text-foreground print:text-black'}`}>
        {value || '—'}
      </p>
    </div>
  );
}
