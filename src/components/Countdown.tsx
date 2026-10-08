import { useEffect, useState } from 'react';
import { BorderBeam } from './ui/border-beam';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const deadline = new Date('2026-10-25T23:59:59+05:30').getTime();
const remaining = () => Math.max(0, deadline - Date.now());

export default function Countdown() {
  const [time, setTime] = useState(remaining);

  useEffect(() => {
    const timer = setInterval(() => setTime(remaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  const values = [
    Math.floor(time / 86400000),
    Math.floor(time / 3600000) % 24,
    Math.floor(time / 60000) % 60,
    Math.floor(time / 1000) % 60,
  ];
  const labels = ['Days', 'Hours', 'Minutes', 'Seconds'];
  const shortLabels = ['Days', 'Hours', 'Mins', 'Secs'];

  return (
    <section className="border-y border-accent/20 bg-secondary/80 backdrop-blur px-3 sm:px-6 py-5 sm:py-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* Urgent Live Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
          <span>{time ? 'Live Countdown' : 'Registration Closed'}</span>
        </div>

        <h2 className="sports-heading text-lg xs:text-xl sm:text-2xl font-black tracking-wide text-foreground uppercase">
          {time ? (
            <>
              Registration Closes On <span className="text-accent">25 Oct 2026</span>
            </>
          ) : (
            'Registration Deadline Reached'
          )}
        </h2>

        {/* 4 Scoreboard Blocks */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-md mx-auto mt-3 sm:mt-4">
          {values.map((v, i) => (
            <div
              key={i}
              className={cn(
                "relative overflow-hidden rounded-xl border bg-card/85 p-2 xs:p-2.5 sm:p-3.5 shadow-lg flex flex-col items-center justify-center text-center",
                i === 3 ? "border-accent/50 bg-card/95" : "border-border/70"
              )}
            >
              <BorderBeam
                duration={8}
                borderWidth={1.5}
                colorFrom="#ff6a00"
                colorTo="#ffc83d"
              />
              <p className="sports-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tabular-nums text-foreground leading-none tracking-tight">
                {String(v).padStart(2, '0')}
              </p>
              <p className="mt-1 xs:mt-1.5 text-[10px] sm:text-xs uppercase tracking-wider font-bold text-accent leading-none">
                <span className="xs:hidden">{shortLabels[i]}</span>
                <span className="hidden xs:inline">{labels[i]}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
