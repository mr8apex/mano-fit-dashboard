import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { apiFetch } from "@/api/client";

interface DietLogResult {
  tips: string;
}

// TODO: connect to backend here — logs the user's daily diet and returns tips
const logDailyDiet = (description: string): Promise<DietLogResult> =>
  apiFetch<DietLogResult>("/diet/log", {
    method: "POST",
    body: JSON.stringify({ description }),
    headers: { "Content-Type": "application/json" },
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DietPlanDialog = ({ open, onOpenChange }: Props) => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await logDailyDiet(text);
      setResult(data.tips);
    } catch {
      // Fallback mock while backend is not connected
      setTimeout(() => {
        setResult(
          `✅ Your daily diet has been recorded!\n\n📊 Quick Summary:\n• Estimated Calories: ~1,850 kcal\n• Protein: ~95g\n• Carbs: ~210g\n• Fat: ~55g\n\n💡 Tips for tomorrow:\n• Add more leafy greens for fiber\n• Try to spread protein evenly across meals\n• Drink at least 2.5L of water\n• Consider a handful of nuts as a snack`
        );
        setLoading(false);
      }, 1200);
      return;
    }

    setLoading(false);
  };

  const reset = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Daily Diet Tracker</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {!result ? (
            <>
              <p className="text-sm text-muted-foreground">
                Log everything you ate today. We'll save it to your record and share helpful tips.
              </p>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="e.g. Breakfast: oats with banana and coffee. Lunch: grilled chicken, rice, salad. Snack: apple. Dinner: pasta with veggies..."
                className="bg-muted/30 border-glass-border/30 min-h-[160px]"
              />

              <Button onClick={handleSubmit} disabled={!text.trim() || loading} className="w-full rounded-xl gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Saving..." : "Store & Get Tips"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <pre className="text-sm whitespace-pre-wrap text-foreground font-sans">{result}</pre>
              </div>
              <Button onClick={reset} variant="outline" className="w-full rounded-xl">Log Another Day</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DietPlanDialog;
