import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Mic, MicOff, Send, Video, VideoOff, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrainingDialog = ({ open, onOpenChange }: Props) => {
  const [text, setText] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleCamera = async () => {
    if (cameraOn && stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setCameraOn(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
        setStream(s);
        setCameraOn(true);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        // Camera not available
      }
    }
  };

  const toggleMic = async () => {
    if (micOn && stream) {
      stream.getAudioTracks().forEach(t => t.stop());
      setMicOn(false);
    } else {
      try {
        if (stream) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getAudioTracks().forEach(t => stream.addTrack(t));
        } else {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          setStream(s);
        }
        setMicOn(true);
      } catch {
        // Mic not available
      }
    }
  };

  const handleSend = () => {
    if (!text && !cameraOn && !micOn) return;
    setLoading(true);
    setTimeout(() => {
      setResponse(
        "💪 Here's your personalized workout:\n\n" +
        "1. Warm-up — 5 min jump rope\n" +
        "2. Barbell Squats — 4×12\n" +
        "3. Bench Press — 4×10\n" +
        "4. Deadlifts — 3×8\n" +
        "5. Pull-ups — 3×max\n" +
        "6. Plank — 3×60s\n\n" +
        "⏱️ Est. Duration: 45 min\n🔥 Est. Calories: ~380 kcal"
      );
      setLoading(false);
    }, 2000);
  };

  const reset = () => {
    setText("");
    setResponse(null);
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setCameraOn(false);
    setMicOn(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="glass-strong border-glass-border/40 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Start Training</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!response ? (
            <>
              {/* Camera preview */}
              <div className="relative rounded-xl overflow-hidden bg-muted/20 border border-glass-border/20">
                {cameraOn ? (
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={toggleCamera}
                  variant={cameraOn ? "default" : "outline"}
                  size="icon"
                  className="rounded-full w-12 h-12"
                >
                  {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={toggleMic}
                  variant={micOn ? "default" : "outline"}
                  size="icon"
                  className="rounded-full w-12 h-12"
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
              </div>

              {/* Text input */}
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Tell us about your workout goals... e.g. 'I want a 30-min upper body session'"
                className="bg-muted/30 border-glass-border/30 min-h-[80px]"
              />

              <Button onClick={handleSend} disabled={(!text && !cameraOn && !micOn) || loading} className="w-full rounded-xl gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Generating Plan..." : "Get Workout Plan"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <pre className="text-sm whitespace-pre-wrap text-foreground">{response}</pre>
              </div>
              <Button onClick={reset} variant="outline" className="w-full rounded-xl">Start New Session</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingDialog;
