import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Calendar, Ruler, Weight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    dob: "1995-06-15",
    height: "175",
    weight: "72",
    gender: "Male",
    goal: "Build Muscle",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = () => {
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
  };

  const fields = [
    { icon: User, label: "Full Name", key: "name", type: "text" },
    { icon: Mail, label: "Email", key: "email", type: "email" },
    { icon: Phone, label: "Phone", key: "phone", type: "tel" },
    { icon: MapPin, label: "Location", key: "location", type: "text" },
    { icon: Calendar, label: "Date of Birth", key: "dob", type: "date" },
    { icon: Ruler, label: "Height (cm)", key: "height", type: "number" },
    { icon: Weight, label: "Weight (kg)", key: "weight", type: "number" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold">My Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Avatar */}
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative group">
            <Avatar className="w-28 h-28 border-2 border-primary/30">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="text-3xl font-display bg-primary/20 text-primary">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-primary" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-display font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
          <div className="flex gap-6 mt-2">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{profile.height} cm</p>
              <p className="text-xs text-muted-foreground">Height</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{profile.weight} kg</p>
              <p className="text-xs text-muted-foreground">Weight</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{profile.goal}</p>
              <p className="text-xs text-muted-foreground">Goal</p>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-display font-semibold text-lg mb-2">Personal Information</h3>
          {fields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <f.icon className="w-4 h-4" /> {f.label}
              </label>
              <Input
                type={f.type}
                value={profile[f.key as keyof typeof profile]}
                onChange={e => setProfile(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="bg-muted/30 border-glass-border/30"
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" /> Gender
            </label>
            <select
              value={profile.gender}
              onChange={e => setProfile(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full h-10 rounded-md border border-glass-border/30 bg-muted/30 px-3 text-sm text-foreground"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Ruler className="w-4 h-4" /> Fitness Goal
            </label>
            <select
              value={profile.goal}
              onChange={e => setProfile(prev => ({ ...prev, goal: e.target.value }))}
              className="w-full h-10 rounded-md border border-glass-border/30 bg-muted/30 px-3 text-sm text-foreground"
            >
              <option>Build Muscle</option>
              <option>Lose Weight</option>
              <option>Stay Fit</option>
              <option>Gain Endurance</option>
            </select>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-12 text-base font-semibold rounded-xl">
          Save Changes
        </Button>
      </main>
    </div>
  );
};

export default Profile;
