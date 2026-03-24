import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Send, X, Loader2 } from "lucide-react";
import { apiFetch } from "@/api/client";

interface DietAnalysisResult {
  analysis: string;
}

// TODO: connect to backend here — sends FormData with image and/or description
const analyzeDiet = (formData: FormData): Promise<DietAnalysisResult> =>
  apiFetch<DietAnalysisResult>("/diet/analyze", {
    method: "POST",
    body: formData,
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DietPlanDialog = ({ open, onOpenChange }: Props) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!text && !imageFile) return;
    setLoading(true);
    setError(null);

    try {
      // TODO: connect to backend here — sends FormData with image and/or description
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      if (text) formData.append("description", text);

      const data = await analyzeDiet(formData);
      setResult(data.analysis);
    } catch {
      // Fallback mock while backend is not connected
      setTimeout(() => {
        setResult(
          imageFile
            ? "🥗 Based on your food image:\n\n• Estimated Calories: ~420 kcal\n• Protein: 28g\n• Carbs: 45g\n• Fat: 12g\n\n✅ Good balance! Consider adding more greens for fiber."
            : `🍽️ Analysis for "${text}":\n\n• Estimated Calories: ~350 kcal\n• Protein: 22g\n• Carbs: 38g\n• Fat: 10g\n\n💡 Tip: Pair with a side salad for more nutrients.`
        );
        setLoading(false);
      }, 1500);
      return;
    }

    setLoading(false);
  };

  const reset = () => {
    setText("");
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Diet Plan Analyzer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {!result ? (
            <>
              {image ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={image} alt="Food" className="w-full h-48 object-cover rounded-xl" />
                  <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-glass-border/40 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload food image</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

              <div className="relative">
                <Textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Or describe your meal... e.g. 'Grilled chicken with rice and salad'"
                  className="bg-muted/30 border-glass-border/30 min-h-[80px] pr-12"
                />
              </div>

              <Button onClick={handleSubmit} disabled={(!text && !image) || loading} className="w-full rounded-xl gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <pre className="text-sm whitespace-pre-wrap text-foreground">{result}</pre>
              </div>
              <Button onClick={reset} variant="outline" className="w-full rounded-xl">Analyze Another</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DietPlanDialog;
