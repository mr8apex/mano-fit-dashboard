import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import fitnessBg from "@/assets/fitness-bg.jpg";
import { Eye, EyeOff, Dumbbell } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Try demo@example.com / demo123");
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

          <h2 className="text-xl font-display font-semibold mb-6 text-center">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="demo@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground pr-12"
                  placeholder="demo123"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
