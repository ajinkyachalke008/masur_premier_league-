import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const Countdown = () => {
  const targetDate = new Date('2026-10-20T23:59:59').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <Card className="card-mpl flex flex-col items-center justify-center p-6 min-w-[100px] hover:border-primary transition-all duration-300">
      <div 
        className="text-4xl md:text-5xl font-black text-accent text-glow-gold mb-2"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
        {label}
      </div>
    </Card>
  );

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            REGISTRATION CLOSES IN
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't miss your chance to be part of MPL 2026
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Minutes" />
          <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </section>
  );
};

export default Countdown;
