import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, SmilePlus, ImagePlus, Mic, MicOff, X } from "lucide-react";
import { apiFetch } from "@/api/client";

interface MoodResult {
  mood: string;
  recommendation: string;
}

// TODO: connect to backend here — sends FormData with ONE of: image, audio, or description
const detectMood = (formData: FormData): Promise<MoodResult> =>
  apiFetch<MoodResult>("/mood/detect", {
    method: "POST",
    body: formData,
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MoodDialog = ({ open, onOpenChange }: Props) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const toggleRecording = async () => {
    if (recording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];
        recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setRecording(true);
      } catch {
        setError("Microphone access denied");
      }
    }
  };

  const hasInput = text || image || audioBlob;

  const handleSubmit = async () => {
    if (!hasInput) return;
    setLoading(true);
    setError(null);

    try {
      // TODO: connect to backend here — send text/image/audio for mood detection
      const data = await detectMood({ text: text || undefined });
      setResult(`🧠 Detected Mood: ${data.mood}\n\n💡 ${data.recommendation}`);
    } catch {
      // Fallback mock while backend is not connected
      setTimeout(() => {
        const inputs: string[] = [];
        if (text) inputs.push("text");
        if (image) inputs.push("facial expression");
        if (audioBlob) inputs.push("voice tone");

        setResult(
          `🧠 Detected Mood: Motivated & Energetic\n` +
          `📊 Analyzed from: ${inputs.join(", ")}\n\n` +
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
    setImage(null);
    setAudioBlob(null);
    setResult(null);
    setError(null);
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
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
              {/* Image upload */}
              {image ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={image} alt="Mood" className="w-full h-48 object-cover rounded-xl" />
                  <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-36 rounded-xl border-2 border-dashed border-glass-border/40 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">Upload a selfie or photo of your expression</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

              {/* Audio recording */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-glass-border/20">
                <Button
                  onClick={toggleRecording}
                  variant={recording ? "default" : "outline"}
                  size="icon"
                  className="rounded-full w-10 h-10 shrink-0"
                >
                  {recording ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <div className="flex-1 min-w-0">
                  {recording ? (
                    <p className="text-sm text-primary font-medium animate-pulse">Recording... tap to stop</p>
                  ) : audioBlob ? (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground">Voice recorded ✓</p>
                      <button onClick={() => setAudioBlob(null)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Remove</button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Record your voice to analyze tone</p>
                  )}
                </div>
              </div>

              {/* Text input */}
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe how you're feeling... e.g. 'I feel tired but want to push through'"
                className="bg-muted/30 border-glass-border/30 min-h-[80px]"
              />

              <Button onClick={handleSubmit} disabled={!hasInput || loading} className="w-full rounded-xl gap-2">
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
