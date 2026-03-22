import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import fitnessBg from "@/assets/fitness-bg.jpg";
import { Dumbbell, Loader2, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyOtp, resendOtp } from "@/api/auth.api";
import { useToast } from "@/hooks/use-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem("verify_token");
  const email = localStorage.getItem("verify_email");

  useEffect(() => {
    if (!token) {
      navigate("/signup");
    }
  }, [token, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await verifyOtp({ token, otp });
      if (res.success) {
        localStorage.removeItem("verify_token");
        localStorage.removeItem("verify_email");
        toast({ title: "Email Verified!", description: "Your account is now active. Please log in." });
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError("");

    try {
      const res = await resendOtp(email);
      if (res.token) {
        localStorage.setItem("verify_token", res.token);
      }
      toast({ title: "OTP Resent", description: "Check your email for the new code." });
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img src={fitnessBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="glass-strong rounded-2xl p-8 glow-box">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Dumbbell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-display font-bold glow-text text-primary">Mano Fit</h1>
          </div>

          <h2 className="text-xl font-display font-semibold mb-2 text-center">Verify Your Email</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter the 6-digit code sent to{" "}
            <span className="text-foreground font-medium">{email || "your email"}</span>
          </p>

          <div className="flex justify-center mb-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && <p className="text-destructive text-sm text-center mb-4">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="flex items-center justify-center gap-1 mt-4">
            <span className="text-sm text-muted-foreground">Didn't receive code?</span>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
              Resend
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
