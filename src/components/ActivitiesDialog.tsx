import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footprints, Flame, Droplets, Moon, MapPin, Link2, Plus, Minus, PartyPopper, Smartphone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const staticActivities = [
  { icon: Footprints, label: "Steps", value: "8,432", target: "10,000", percent: 84, color: "text-primary", bg: "bg-primary/20" },
  { icon: Flame, label: "Calories Burned", value: "1,840", target: "2,200 kcal", percent: 83, color: "text-orange-400", bg: "bg-orange-500/20" },
  { icon: MapPin, label: "Distance", value: "5.2", target: "7 km", percent: 74, color: "text-blue-400", bg: "bg-blue-500/20" },
];

// Animated counter hook
const useAnimatedCount = (target: number, duration: number = 1200, active: boolean = true) => {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!active) { setCount(0); return; }
    setCount(0);
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      rafId.current = requestAnimationFrame(animate);
    }, 150);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
    };
  }, [target, duration, active]);

  return count;
};

// Confetti particle component
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;

  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const distance = 40 + Math.random() * 60;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = [
      "bg-primary", "bg-orange-400", "bg-emerald-400",
      "bg-blue-400", "bg-indigo-400", "bg-yellow-400",
    ];
    const color = colors[i % colors.length];
    const size = Math.random() > 0.5 ? "w-1.5 h-1.5" : "w-2 h-2";
    const shape = Math.random() > 0.5 ? "rounded-full" : "rounded-sm";
    const delay = Math.random() * 0.2;

    return (
      <span
        key={i}
        className={`absolute ${color} ${size} ${shape} opacity-0`}
        style={{
          left: "50%",
          top: "50%",
          animation: `confetti-burst 0.7s ${delay}s ease-out forwards`,
          "--cx": `${x}px`,
          "--cy": `${y}px`,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles}
    </div>
  );
};

// Animated activity card
const ActivityCard = ({
  activity,
  index,
  dialogOpen,
}: {
  activity: typeof staticActivities[0];
  index: number;
  dialogOpen: boolean;
}) => {
  const animatedPercent = useAnimatedCount(activity.percent, 1000 + index * 150, dialogOpen);
  const completed = animatedPercent >= 100;

  return (
    <div
      className={`relative p-4 rounded-xl bg-muted/20 border space-y-2 transition-all duration-300 animate-fade-in ${
        completed ? "border-primary/50 glow-box" : "border-glass-border/20"
      }`}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <Confetti active={completed} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${activity.bg} flex items-center justify-center ${completed ? "animate-scale-in" : ""}`}>
            {completed ? (
              <PartyPopper className="w-4 h-4 text-primary" />
            ) : (
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{activity.label}</p>
            <p className="text-xs text-muted-foreground">
              {completed ? "🎉 Goal reached!" : `${activity.value} / ${activity.target}`}
            </p>
          </div>
        </div>
        <span className={`text-sm font-bold tabular-nums transition-colors duration-300 ${completed ? "text-primary" : activity.color}`}>
          {animatedPercent}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-colors duration-500 ${completed ? "bg-primary/40" : activity.bg}`}
          style={{
            width: `${animatedPercent}%`,
            transition: "width 0.15s linear, background-color 0.5s",
          }}
        />
      </div>
    </div>
  );
};

// Format minutes to "Xh Ym"
const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Slider-based input card for Screen Time & Sleep Duration
const SliderActivityCard = ({
  icon: Icon,
  label,
  value,
  onChange,
  target,
  max,
  step,
  color,
  bg,
  index,
  dialogOpen,
}: {
  icon: React.ElementType;
  label: string;
  value: number; // in minutes
  onChange: (v: number) => void;
  target: number; // in minutes
  max: number;
  step: number;
  color: string;
  bg: string;
  index: number;
  dialogOpen: boolean;
}) => {
  const percent = Math.min(Math.round((value / target) * 100), 100);
  const animatedPercent = useAnimatedCount(percent, 800, dialogOpen);
  const completed = animatedPercent >= 100;

  return (
    <div
      className={`relative p-4 rounded-xl bg-muted/20 border space-y-3 transition-all duration-300 animate-fade-in ${
        completed ? "border-primary/50 glow-box" : "border-glass-border/20"
      }`}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <Confetti active={completed} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center ${completed ? "animate-scale-in" : ""}`}>
            {completed ? (
              <PartyPopper className="w-4 h-4 text-primary" />
            ) : (
              <Icon className={`w-4 h-4 ${color}`} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">
              {completed ? "🎉 Goal reached!" : `${formatTime(value)} / ${formatTime(target)}`}
            </p>
          </div>
        </div>
        <span className={`text-sm font-bold tabular-nums transition-colors duration-300 ${completed ? "text-primary" : color}`}>
          {animatedPercent}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-colors duration-500 ${completed ? "bg-primary/40" : bg}`}
          style={{
            width: `${animatedPercent}%`,
            transition: "width 0.15s linear, background-color 0.5s",
          }}
        />
      </div>
      <div className="flex items-center gap-3 pt-1">
        <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0" onClick={() => onChange(Math.max(0, value - step))}>
          <Minus className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={0}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
        <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0" onClick={() => onChange(Math.min(max, value + step))}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground font-medium">{formatTime(value)}</p>
    </div>
  );
};

const ActivitiesDialog = ({ open, onOpenChange }: Props) => {
  const [waterMl, setWaterMl] = useState(1500);
  const [screenTime, setScreenTime] = useState(180); // minutes
  const [sleepDuration, setSleepDuration] = useState(390); // 6h 30m in minutes
  const [linked, setLinked] = useState(false);
  const [celebrated, setCelebrated] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const waterTarget = 2000;
  const waterPercent = Math.min(Math.round((waterMl / waterTarget) * 100), 100);
  const animatedWater = useAnimatedCount(waterPercent, 800, open);

  const handleLink = () => {
    setLinked(true);
    toast({ title: "Google Fit Linked", description: "Your activity data will sync automatically." });
  };

  // Celebrate goals
  useEffect(() => {
    const checks = [
      { key: "Water Intake", reached: waterPercent >= 100 },
      { key: "Screen Time", reached: screenTime <= 120 }, // under 2h is good
      { key: "Sleep Duration", reached: sleepDuration >= 480 }, // 8h target
    ];
    checks.forEach(({ key, reached }) => {
      if (reached && !celebrated.has(key)) {
        setCelebrated(prev => new Set(prev).add(key));
        toast({ title: "🎉 Goal Reached!", description: `You've hit your ${key.toLowerCase()} target!` });
      }
    });
  }, [waterPercent, screenTime, sleepDuration, celebrated, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-md max-h-[85vh] overflow-hidden p-0">
        <ScrollArea className="max-h-[85vh] px-6 pt-6 pb-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Today's Activities</DialogTitle>
        </DialogHeader>

        {/* Google Fit Link */}
        <div className="p-4 rounded-xl bg-muted/20 border border-glass-border/20 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive/20 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold">Google Fit / Watch</p>
              <p className="text-xs text-muted-foreground">{linked ? "Connected" : "Sync steps, sleep & more"}</p>
            </div>
          </div>
          <Button size="sm" variant={linked ? "secondary" : "default"} className="rounded-lg text-xs" onClick={handleLink} disabled={linked}>
            {linked ? "Linked ✓" : "Link"}
          </Button>
        </div>

        <div className="space-y-3">
          {staticActivities.map((a, i) => (
            <ActivityCard key={a.label} activity={a} index={i} dialogOpen={open} />
          ))}

          {/* Screen Time with slider */}
          <SliderActivityCard
            icon={Smartphone}
            label="Screen Time"
            value={screenTime}
            onChange={setScreenTime}
            target={120} // goal: under 2 hours
            max={720} // 12 hours max
            step={15}
            color="text-emerald-400"
            bg="bg-emerald-500/20"
            index={staticActivities.length}
            dialogOpen={open}
          />

          {/* Sleep Duration with slider */}
          <SliderActivityCard
            icon={Moon}
            label="Sleep Duration"
            value={sleepDuration}
            onChange={setSleepDuration}
            target={480} // 8 hours
            max={720} // 12 hours max
            step={15}
            color="text-indigo-400"
            bg="bg-indigo-500/20"
            index={staticActivities.length + 1}
            dialogOpen={open}
          />

          {/* Water Intake with +/- */}
          <div
            className={`relative p-4 rounded-xl bg-muted/20 border space-y-2 transition-all duration-300 animate-fade-in ${
              waterPercent >= 100
                ? "border-primary/50 glow-box"
                : "border-glass-border/20"
            }`}
            style={{ animationDelay: `${(staticActivities.length + 2) * 80}ms`, animationFillMode: "both" }}
          >
            <Confetti active={waterPercent >= 100} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center ${waterPercent >= 100 ? "animate-scale-in" : ""}`}>
                  {waterPercent >= 100 ? (
                    <PartyPopper className="w-4 h-4 text-primary" />
                  ) : (
                    <Droplets className="w-4 h-4 text-accent" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">Water Intake</p>
                  <p className="text-xs text-muted-foreground">
                    {waterPercent >= 100 ? "🎉 Goal reached!" : `${waterMl} ml / ${waterTarget} ml`}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-bold tabular-nums transition-colors duration-300 ${waterPercent >= 100 ? "text-primary" : "text-accent"}`}>
                {animatedWater}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
              <div
                className={`h-full rounded-full transition-colors duration-500 ${waterPercent >= 100 ? "bg-primary/40" : "bg-accent/20"}`}
                style={{
                  width: `${animatedWater}%`,
                  transition: "width 0.15s linear, background-color 0.5s",
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0" onClick={() => setWaterMl(m => Math.max(0, m - 250))}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-semibold min-w-[60px] text-center">250 ml</span>
              <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0" onClick={() => setWaterMl(m => m + 250)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ActivitiesDialog;
