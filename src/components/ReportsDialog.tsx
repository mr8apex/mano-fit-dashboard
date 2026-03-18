import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { getReports } from "@/services/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Fallback mock data used when backend is unavailable
const fallbackPieData = [
  { name: "Protein", value: 35, color: "hsl(174, 72%, 50%)" },
  { name: "Carbs", value: 40, color: "hsl(210, 70%, 55%)" },
  { name: "Fat", value: 15, color: "hsl(35, 90%, 55%)" },
  { name: "Fiber", value: 10, color: "hsl(140, 60%, 45%)" },
];

const fallbackLineData = [
  { week: "W1", weight: 78, calories: 2200, workouts: 3 },
  { week: "W2", weight: 77.2, calories: 2100, workouts: 4 },
  { week: "W3", weight: 76.5, calories: 2000, workouts: 5 },
  { week: "W4", weight: 75.8, calories: 1950, workouts: 4 },
  { week: "W5", weight: 75, calories: 2050, workouts: 5 },
  { week: "W6", weight: 74.2, calories: 1900, workouts: 6 },
];

const ReportsDialog = ({ open, onOpenChange }: Props) => {
  const [pieData, setPieData] = useState(fallbackPieData);
  const [lineData, setLineData] = useState(fallbackLineData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: connect to backend here — fetch reports data when dialog opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchReports = async () => {
      try {
        const data = await getReports();
        if (!cancelled) {
          setPieData(data.macros);
          setLineData(data.weekly);
        }
      } catch {
        // Silently use fallback mock data
        if (!cancelled) {
          setPieData(fallbackPieData);
          setLineData(fallbackLineData);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReports();
    return () => { cancelled = true; };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-2xl max-h-[85vh] overflow-hidden p-0">
        <ScrollArea className="max-h-[85vh] px-6 pt-6 pb-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Progress Reports</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center mt-4">
            {error}
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Pie Chart */}
            <div className="p-4 rounded-xl bg-muted/20 border border-glass-border/20">
              <h4 className="font-display font-semibold mb-4">Macro Breakdown</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 25%)", borderRadius: "0.75rem", color: "hsl(180, 20%, 95%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - Weight */}
            <div className="p-4 rounded-xl bg-muted/20 border border-glass-border/20">
              <h4 className="font-display font-semibold mb-4">Weight Progress (kg)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis dataKey="week" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 25%)", borderRadius: "0.75rem", color: "hsl(180, 20%, 95%)" }} />
                  <Line type="monotone" dataKey="weight" stroke="hsl(174, 72%, 50%)" strokeWidth={2} dot={{ fill: "hsl(174, 72%, 50%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - Workouts */}
            <div className="p-4 rounded-xl bg-muted/20 border border-glass-border/20">
              <h4 className="font-display font-semibold mb-4">Weekly Workouts</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis dataKey="week" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 25%)", borderRadius: "0.75rem", color: "hsl(180, 20%, 95%)" }} />
                  <Line type="monotone" dataKey="workouts" stroke="hsl(35, 90%, 55%)" strokeWidth={2} dot={{ fill: "hsl(35, 90%, 55%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsDialog;
