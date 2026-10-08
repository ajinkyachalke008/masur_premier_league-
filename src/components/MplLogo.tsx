import asset from '@/assets/mpl-official.webp.asset.json';
import { cn } from '@/lib/utils';
export default function MplLogo({className=''}:{className?:string}) {return <img src={asset.url} alt="Masur Premier League official logo" className={cn('object-contain',className)} width={600} height={900} />;}
