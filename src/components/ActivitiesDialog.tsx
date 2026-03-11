import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footprints, Flame, Timer, Droplets, TrendingUp } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const activities = [
  { icon: Footprints, label: "Steps", value: "8,432", target: "10,000", percent: 84, color: "text-primary", bg: "bg-primary/20" },
  { icon: Flame, label: "Calories Burned", value: "1,840", target: "2,200", percent: 83, color: "text-orange-400", bg: "bg-orange-500/20" },
  { icon: Timer, label: "Active Minutes", value: "47", target: "60", percent: 78, color: "text-blue-400", bg: "bg-blue-500/20" },
  { icon: Droplets, label: "Water Intake", value: "6", target: "8 glasses", percent: 75, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  { icon: TrendingUp, label: "Floors Climbed", value: "12", target: "15", percent: 80, color: "text-emerald-400", bg: "bg-emerald-500/20" },
];

const ActivitiesDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Today's Activities</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {activities.map(a => (
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
                <div className={`h-full rounded-full transition-all duration-700`} style={{ width: `${a.percent}%`, background: `currentColor` }}>
                  <div className={`h-full rounded-full ${a.color}`} style={{ width: "100%", backgroundColor: "currentColor" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivitiesDialog;
