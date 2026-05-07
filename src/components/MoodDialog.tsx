import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, ImagePlus, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiFetch } from "@/api/client";

interface CoachPlanResponse {
  message: string;
  data: {
    textAnalysis: unknown;
    imageAnalysis: unknown;
    plan: {
      structuredPlan: unknown;
      enhancedPlan: string;
    };
  };
}

// TODO: connect to backend here — sends FormData with image and/or description
const generateCoachPlan = (formData: FormData): Promise<CoachPlanResponse> =>
  apiFetch<CoachPlanResponse>("/coach/analyze", {
    method: "POST",
    body: formData,
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MoodDialog = ({ open, onOpenChange }: Props) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enhancedPlan, setEnhancedPlan] = useState<string | null>(null);
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

  const hasInput = !!(text || imageFile);

  const handleSubmit = async () => {
    if (!hasInput) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      if (text) formData.append("description", text);

      const res = await generateCoachPlan(formData);
      setEnhancedPlan(res.data.plan.enhancedPlan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText("");
    setImageFile(null);
    setImagePreview(null);
    setEnhancedPlan(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">AI Coach Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {!enhancedPlan ? (
            <>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Upload" className="w-full h-48 object-cover rounded-xl" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-36 rounded-xl border-2 border-dashed border-glass-border/40 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">Upload a photo (optional)</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe how you're feeling or what you want help with..."
                className="bg-muted/30 border-glass-border/30 min-h-[100px]"
              />

              <Button onClick={handleSubmit} disabled={!hasInput || loading} className="w-full rounded-xl gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Generating Your Plan..." : "Generate My Plan"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 prose prose-sm dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-table:text-sm prose-th:text-foreground prose-td:text-foreground/90 prose-li:text-foreground/90">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{enhancedPlan}</ReactMarkdown>
              </div>
              <Button onClick={reset} variant="outline" className="w-full rounded-xl">Generate Another Plan</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodDialog;
