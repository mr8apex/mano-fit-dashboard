import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, SmilePlus } from "lucide-react";
import { detectMood } from "@/services/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MoodDialog = ({ open, onOpenChange }: Props) => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text) return;
    setLoading(true);
    setError(null);

    try {
      // TODO: connect to backend here
      const data = await detectMood({ text });
      setResult(`🧠 Detected Mood: ${data.mood}\n\n💡 ${data.recommendation}`);
    } catch {
      // Fallback mock while backend is not connected
      setTimeout(() => {
        setResult(
          "🧠 Detected Mood: Motivated & Energetic\n\n" +
          "💡 Recommendation:\n\n" +
          "• Perfect time for a high-intensity workout!\n" +
          "• Try a HIIT session or heavy lifting\n" +
          "• Channel this energy into compound movements\n" +
          "• Stay hydrated and fuel up with complex carbs\n\n" +
          "🎯 Suggested Activity: Strength Training\n" +
          "⏱️ Optimal Duration: 45-60 min"
        );
        setLoading(false);
      }, 1500);
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
          <DialogTitle className="font-display text-xl">Detect Mood</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {!result ? (
            <>
              {/* Mood illustration */}
              <div className="relative rounded-xl overflow-hidden bg-muted/20 border border-glass-border/20">
                <div className="w-full h-48 flex flex-col items-center justify-center gap-3">
                  <SmilePlus className="w-12 h-12 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                </div>
              </div>

              {/* Text input */}
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe how you're feeling... e.g. 'I feel tired but want to push through' or 'I'm full of energy today!'"
                className="bg-muted/30 border-glass-border/30 min-h-[80px]"
              />

              <Button onClick={handleSubmit} disabled={!text || loading} className="w-full rounded-xl gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Analyzing Mood..." : "Detect My Mood"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <pre className="text-sm whitespace-pre-wrap text-foreground">{result}</pre>
              </div>
              <Button onClick={reset} variant="outline" className="w-full rounded-xl">Try Again</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodDialog;
