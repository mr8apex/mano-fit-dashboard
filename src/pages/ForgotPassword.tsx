import { useState } from "react";
import { Link } from "react-router-dom";
import fitnessBg from "@/assets/fitness-bg.jpg";
import { Dumbbell, Loader2, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/api/auth.api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword({ email });
      if (res.token) {
        localStorage.setItem("reset_token", res.token);
        localStorage.setItem("reset_email", email);
      }
      setSent(true);
      // Navigate to verify reset OTP page
      setTimeout(() => navigate("/verify-reset-otp"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
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

          <h2 className="text-xl font-display font-semibold mb-2 text-center">Forgot Password</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter your email and we'll send you a reset code
          </p>

          {sent ? (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <p className="text-sm text-foreground">✅ Reset code sent! Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
