import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dumbbell, User, LogOut, Settings, UtensilsCrossed, FileBarChart, Play, Activity, Flame, UserCircle } from "lucide-react";
import DietPlanDialog from "@/components/DietPlanDialog";
import ReportsDialog from "@/components/ReportsDialog";
import TrainingDialog from "@/components/TrainingDialog";
import ActivitiesDialog from "@/components/ActivitiesDialog";

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Push yourself, because no one else is going to do it for you.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Strength doesn't come from what you can do. It comes from overcoming what you once couldn't.",
  "The pain you feel today will be the strength you feel tomorrow.",
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [dietOpen, setDietOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const features = [
    { icon: UtensilsCrossed, label: "Diet Plan", desc: "Track your nutrition", color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400", onClick: () => setDietOpen(true) },
    { icon: FileBarChart, label: "Reports", desc: "View your progress", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400", onClick: () => setReportsOpen(true) },
    { icon: Play, label: "Start Training", desc: "Begin your workout", color: "from-primary/20 to-glow/20", iconColor: "text-primary", onClick: () => setTrainingOpen(true) },
    { icon: Activity, label: "Activities", desc: "Daily activity log", color: "from-orange-500/20 to-amber-500/20", iconColor: "text-orange-400", onClick: () => setActivitiesOpen(true) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Dumbbell className="w-7 h-7 text-primary" />
            <span className="text-xl font-display font-bold text-primary glow-text">Mano Fit</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
            >
              <User className="w-5 h-5 text-primary" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 glass-strong rounded-xl overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-muted/50 transition-colors text-foreground"
                  >
                    <UserCircle className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/settings"); }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-muted/50 transition-colors text-foreground"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <button
                    onClick={() => { logout(); navigate("/login"); }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-destructive/10 transition-colors text-destructive"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">3 Day Streak 🔥</span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">
            {greeting()}, <span className="text-primary">{user.name.split(" ")[0]}</span>!
          </h2>
          <p className="text-muted-foreground italic">"{quote}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <button
              key={f.label}
              onClick={f.onClick}
              className="glass rounded-2xl p-6 text-left hover:glow-box transition-all duration-300 group animate-fade-in cursor-pointer"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{f.label}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </button>
          ))}
        </div>
      </main>

      <DietPlanDialog open={dietOpen} onOpenChange={setDietOpen} />
      <ReportsDialog open={reportsOpen} onOpenChange={setReportsOpen} />
      <TrainingDialog open={trainingOpen} onOpenChange={setTrainingOpen} />
      <ActivitiesDialog open={activitiesOpen} onOpenChange={setActivitiesOpen} />
    </div>
  );
};

export default Dashboard;
