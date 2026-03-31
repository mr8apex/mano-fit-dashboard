import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Calendar, Ruler, Weight, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getProfileData, editProfile } from "@/api/user.api";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    age: 0,
    height: 0,
    weight: 0,
    gender: "",
    mealType: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const data = await getProfileData();
        if (!cancelled) {
          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            age: data.age || 0,
            height: data.height || 0,
            weight: data.weight || 0,
            gender: data.gender || "",
            mealType: data.mealType || "",
          });
          setAvatarUrl(data.profileImageUrl || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  if (!user) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("address", profile.address);
      formData.append("height", String(profile.height));
      formData.append("weight", String(profile.weight));
      formData.append("mealType", profile.mealType);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await editProfile(formData as unknown as Record<string, string>);
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
      setProfileImage(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { icon: User, label: "First Name", key: "firstName", type: "text" },
    { icon: User, label: "Last Name", key: "lastName", type: "text" },
    { icon: Mail, label: "Email", key: "email", type: "email" },
    { icon: Phone, label: "Phone", key: "phoneNumber", type: "tel" },
    { icon: MapPin, label: "Address", key: "address", type: "text" },
    { icon: Calendar, label: "Age", key: "age", type: "number", disabled: true },
    { icon: Ruler, label: "Height (cm)", key: "height", type: "number" },
    { icon: Weight, label: "Weight (kg)", key: "weight", type: "number" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {/* Avatar */}
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative group">
            <Avatar className="w-28 h-28 border-2 border-primary/30">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="text-3xl font-display bg-primary/20 text-primary">
                {(profile.firstName?.[0] || "U")}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-primary" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-display font-bold">{`${profile.firstName} ${profile.lastName}`.trim()}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
          <div className="flex gap-6 mt-2">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{profile.height}</p>
              <p className="text-xs text-muted-foreground">cm Height</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{profile.weight}</p>
              <p className="text-xs text-muted-foreground">kg Weight</p>
            </div>
            {profile.gender && (
              <>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{profile.gender}</p>
                  <p className="text-xs text-muted-foreground">Gender</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-display font-semibold text-lg mb-2">Personal Information</h3>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <f.icon className="w-4 h-4" /> {f.label}
                </label>
                <Input
                  type={f.type}
                  value={profile[f.key as keyof typeof profile]}
                  onChange={e => setProfile(prev => ({ ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                  className="bg-muted/30 border-glass-border/30"
                  disabled={f.disabled || saving}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" /> Meal Type
            </label>
            <select
              value={profile.mealType}
              onChange={e => setProfile(prev => ({ ...prev, mealType: e.target.value }))}
              className="w-full h-10 rounded-md border border-glass-border/30 bg-muted/30 px-3 text-sm text-foreground disabled:opacity-50"
              disabled={saving}
            >
              <option value="">Select meal type...</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Any">Any</option>
            </select>
          </div>
        </div>

        {/* Save / Cancel Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="flex-1"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 h-12 text-base font-semibold rounded-xl">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
