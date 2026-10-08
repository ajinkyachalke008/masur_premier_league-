import mplOfficialLogo from '@/assets/mpl-official.webp';
import { cn } from '@/lib/utils';

export default function MplLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src={mplOfficialLogo}
      alt="Masur Premier League official logo"
      className={cn('object-contain', className)}
      width={600}
      height={900}
    />
  );
}
