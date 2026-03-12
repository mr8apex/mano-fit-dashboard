import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footprints, Flame, Timer, Droplets, Moon, MapPin, Link2, Plus, Minus, PartyPopper } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const staticActivities = [
  { icon: Footprints, label: "Steps", value: "8,432", target: "10,000", percent: 84, color: "text-primary", bg: "bg-primary/20" },
  { icon: Flame, label: "Calories Burned", value: "1,840", target: "2,200 kcal", percent: 83, color: "text-orange-400", bg: "bg-orange-500/20" },
  { icon: MapPin, label: "Distance", value: "5.2", target: "7 km", percent: 74, color: "text-blue-400", bg: "bg-blue-500/20" },
  { icon: Timer, label: "Active Minutes", value: "47", target: "60 min", percent: 78, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  { icon: Moon, label: "Sleep Duration", value: "6.5", target: "8 hrs", percent: 81, color: "text-indigo-400", bg: "bg-indigo-500/20" },
];

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

const ActivitiesDialog = ({ open, onOpenChange }: Props) => {
  const [waterMl, setWaterMl] = useState(1500);
  const [linked, setLinked] = useState(false);
  const [celebrated, setCelebrated] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const waterTarget = 2000;
  const waterPercent = Math.min(Math.round((waterMl / waterTarget) * 100), 100);

  const handleLink = () => {
    setLinked(true);
    toast({ title: "Google Fit Linked", description: "Your activity data will sync automatically." });
  };

  // Check water 100% celebration
  useEffect(() => {
    if (waterPercent >= 100 && !celebrated.has("Water Intake")) {
      setCelebrated(prev => new Set(prev).add("Water Intake"));
      toast({ title: "🎉 Goal Reached!", description: "You've hit your water intake target!" });
    }
  }, [waterPercent, celebrated, toast]);

  const isCompleted = (label: string, percent: number) => {
    return percent >= 100;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-md max-h-[85vh] overflow-hidden p-0">
        <ScrollArea className="max-h-[85vh] px-6 pt-6 pb-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Today's Activities</DialogTitle>
        </DialogHeader>

        {/* Google Fit Link */}
        <div className="p-4 rounded-xl bg-muted/20 border border-glass-border/20 flex items-center justify-between">
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
          {staticActivities.map(a => {
            const completed = isCompleted(a.label, a.percent);
            return (
              <div
                key={a.label}
                className={`relative p-4 rounded-xl bg-muted/20 border space-y-2 transition-all duration-300 ${
                  completed
                    ? "border-primary/50 glow-box"
                    : "border-glass-border/20"
                }`}
              >
                <Confetti active={completed} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center ${completed ? "animate-scale-in" : ""}`}>
                      {completed ? (
                        <PartyPopper className="w-4 h-4 text-primary" />
                      ) : (
                        <a.icon className={`w-4 h-4 ${a.color}`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{a.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {completed ? "🎉 Goal reached!" : `${a.value} / ${a.target}`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${completed ? "text-primary" : a.color}`}>
                    {a.percent}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${completed ? "bg-primary/40" : a.bg}`}
                    style={{ width: `${a.percent}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Water Intake with +/- */}
          <div
            className={`relative p-4 rounded-xl bg-muted/20 border space-y-2 transition-all duration-300 ${
              waterPercent >= 100
                ? "border-primary/50 glow-box"
                : "border-glass-border/20"
            }`}
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
              <span className={`text-sm font-bold ${waterPercent >= 100 ? "text-primary" : "text-accent"}`}>
                {waterPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${waterPercent >= 100 ? "bg-primary/40" : "bg-accent/20"}`}
                style={{ width: `${waterPercent}%` }}
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
