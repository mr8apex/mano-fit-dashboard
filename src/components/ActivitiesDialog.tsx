import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footprints, Flame, Timer, Droplets, Moon, MapPin, Link2, Plus, Minus } from "lucide-react";
import { useState } from "react";
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

const ActivitiesDialog = ({ open, onOpenChange }: Props) => {
  const [waterMl, setWaterMl] = useState(1500);
  const [linked, setLinked] = useState(false);
  const { toast } = useToast();
  const waterTarget = 2000;
  const waterPercent = Math.min(Math.round((waterMl / waterTarget) * 100), 100);

  const handleLink = () => {
    setLinked(true);
    toast({ title: "Google Fit Linked", description: "Your activity data will sync automatically." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Today's Activities</DialogTitle>
        </DialogHeader>

        {/* Google Fit Link */}
        <div className="p-4 rounded-xl bg-muted/20 border border-glass-border/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-red-400" />
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
          {staticActivities.map(a => (
            <div key={a.label} className="p-4 rounded-xl bg-muted/20 border border-glass-border/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center`}>
                    <a.icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.value} / {a.target}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${a.color}`}>{a.percent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <div className={`h-full rounded-full ${a.bg}`} style={{ width: `${a.percent}%` }} />
              </div>
            </div>
          ))}

          {/* Water Intake with +/- */}
          <div className="p-4 rounded-xl bg-muted/20 border border-glass-border/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Water Intake</p>
                  <p className="text-xs text-muted-foreground">{waterMl} ml / {waterTarget} ml</p>
                </div>
              </div>
              <span className="text-sm font-bold text-cyan-400">{waterPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
              <div className="h-full rounded-full bg-cyan-500/20" style={{ width: `${waterPercent}%` }} />
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
      </DialogContent>
    </Dialog>
  );
};

export default ActivitiesDialog;
