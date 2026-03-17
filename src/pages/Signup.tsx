import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import fitnessBg from "@/assets/fitness-bg.jpg";
import { Eye, EyeOff, Dumbbell, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const STEPS = ["Personal", "Body & Health", "Contact", "Account"];

const Signup = () => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasDisease, setHasDisease] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfilePreview(null);
  };

  const validateStep = () => {
    setError("");
    switch (step) {
      case 0:
        if (!firstName.trim()) { setError("First name is required"); return false; }
        if (!/^[A-Za-z\s]+$/.test(firstName)) { setError("First name must contain only letters"); return false; }
        if (lastName && !/^[A-Za-z\s]+$/.test(lastName)) { setError("Last name must contain only letters"); return false; }
        if (!dateOfBirth) { setError("Date of birth is required"); return false; }
        if (!gender) { setError("Gender is required"); return false; }
        return true;
      case 1:
        if (!weight || Number(weight) <= 0) { setError("Valid weight is required"); return false; }
        if (!height || Number(height) <= 0) { setError("Valid height is required"); return false; }
        return true;
      case 2:
        if (!address.trim()) { setError("Address is required"); return false; }
        if (!phoneNumber.trim()) { setError("Phone number is required"); return false; }
        if (phoneNumber.length < 10 || phoneNumber.length > 15) { setError("Phone number must be 10-15 digits"); return false; }
        return true;
      case 3:
        if (!email.trim()) { setError("Email is required"); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Invalid email format"); return false; }
        if (password.length < 6) { setError("Password must be at least 6 characters"); return false; }
        return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setError("");
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (hasDisease && !diseaseName.trim()) {
      setError("Please specify the disease name");
      return;
    }
    const name = `${firstName} ${lastName}`.trim();
    if (signup(name, email, password)) {
      navigate("/dashboard");
    } else {
      setError("Signup failed. Please try again.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground";
  const labelClass = "text-sm text-muted-foreground mb-1.5 block";

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            {/* Profile Image */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                {profilePreview ? (
                  <div className="relative">
                    <img src={profilePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
                    <button type="button" onClick={removeImage} className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 rounded-full bg-muted/50 border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground">Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Name *</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="John" required />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Gender *</label>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map(g => (
                  <button key={g} type="button" onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${gender === g ? "border-primary bg-primary/15 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Weight (kg) *</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} placeholder="70" min="1" required />
              </div>
              <div>
                <label className={labelClass}>Height (cm) *</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} className={inputClass} placeholder="175" min="1" required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Do you have any medical condition?</label>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => { setHasDisease(false); setDiseaseName(""); }}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${!hasDisease ? "border-primary bg-primary/15 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"}`}>
                  No
                </button>
                <button type="button" onClick={() => setHasDisease(true)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${hasDisease ? "border-primary bg-primary/15 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"}`}>
                  Yes
                </button>
              </div>
            </div>

            {hasDisease && (
              <div className="animate-fade-in">
                <label className={labelClass}>Disease / Condition Name *</label>
                <input type="text" value={diseaseName} onChange={e => setDiseaseName(e.target.value)} className={inputClass} placeholder="e.g. Diabetes, Asthma..." required />
              </div>
            )}

            {weight && height && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center animate-fade-in">
                <span className="text-xs text-muted-foreground">Your BMI</span>
                <p className="text-xl font-display font-bold text-primary">
                  {(Number(weight) / ((Number(height) / 100) ** 2)).toFixed(1)}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Phone Number *</label>
              <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9+]/g, ""))} className={inputClass} placeholder="+91 9876543210" required />
            </div>
            <div>
              <label className={labelClass}>Address *</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} className={`${inputClass} resize-none`} placeholder="Your full address" rows={3} required />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" required />
            </div>
            <div>
              <label className={labelClass}>Password *</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-12`} placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img src={fitnessBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="glass-strong rounded-2xl p-8 glow-box">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Dumbbell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-display font-bold glow-text text-primary">Mano Fit</h1>
          </div>

          <h2 className="text-xl font-display font-semibold mb-2 text-center">Create Account</h2>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 transition-all ${i < step ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mb-4">{STEPS[step]}</p>

          <form onSubmit={handleSubmit}>
            <ScrollArea className="max-h-[55vh]">
              <div className="px-1">
                {renderStep()}
              </div>
            </ScrollArea>

            {error && <p className="text-destructive text-sm mt-3">{error}</p>}

            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button type="button" onClick={prevStep} className="flex-1 py-3 rounded-lg border border-border text-foreground font-display font-semibold hover:bg-muted/50 transition-colors flex items-center justify-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={nextStep} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
                  Create Account
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
