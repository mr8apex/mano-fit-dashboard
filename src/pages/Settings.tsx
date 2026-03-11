import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Mail, Shield, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [newEmail, setNewEmail] = useState(user?.email || "");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const handlePasswordChange = () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      toast({ title: "Error", description: "Please fill all password fields.", variant: "destructive" });
      return;
    }
    if (passwords.new.length < 6) {
      toast({ title: "Error", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "New passwords don't match.", variant: "destructive" });
      return;
    }
    toast({ title: "Password Updated", description: "Your password has been changed successfully." });
    setPasswords({ old: "", new: "", confirm: "" });
  };

  const handleEmailChange = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({ title: "Error", description: "Enter a valid email address.", variant: "destructive" });
      return;
    }
    toast({ title: "Email Updated", description: `Email changed to ${newEmail}.` });
  };

  const toggle2FA = (checked: boolean) => {
    setTwoFA(checked);
    toast({
      title: checked ? "2FA Enabled" : "2FA Disabled",
      description: checked ? "Two-factor authentication is now active." : "Two-factor authentication has been turned off.",
    });
  };

  const PasswordInput = ({ value, onChange, placeholder, show, onToggle }: {
    value: string; onChange: (v: string) => void; placeholder: string; show: boolean; onToggle: () => void;
  }) => (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-muted/30 border-glass-border/30 pr-10"
      />
      <button onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-bold">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Change Password */}
        <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg">Change Password</h3>
          </div>
          <PasswordInput value={passwords.old} onChange={v => setPasswords(p => ({ ...p, old: v }))} placeholder="Current password" show={showOld} onToggle={() => setShowOld(!showOld)} />
          <PasswordInput value={passwords.new} onChange={v => setPasswords(p => ({ ...p, new: v }))} placeholder="New password" show={showNew} onToggle={() => setShowNew(!showNew)} />
          <PasswordInput value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} placeholder="Confirm new password" show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          <Button onClick={handlePasswordChange} className="w-full rounded-xl">Update Password</Button>
        </div>

        {/* 2FA */}
        <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <Switch checked={twoFA} onCheckedChange={toggle2FA} />
          </div>
          {twoFA && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-400">✓ 2FA is active. You'll receive a verification code on login.</p>
            </div>
          )}
        </div>

        {/* Change Email */}
        <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-display font-semibold text-lg">Change Email</h3>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Current: {user.email}</label>
            <Input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="New email address"
              className="bg-muted/30 border-glass-border/30"
            />
          </div>
          <Button onClick={handleEmailChange} className="w-full rounded-xl">Update Email</Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
