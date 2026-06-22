import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/LanguageContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { isFrench } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const copy = isFrench
    ? {
        title: "Bon retour",
        subtitle: "Connectez-vous a votre compte NOTR-AFRIK",
        email: "Email",
        password: "Mot de passe",
        signingIn: "Connexion...",
        signIn: "Se connecter",
        noAccount: "Vous n'avez pas encore de compte ?",
        signUp: "Creer un compte",
        welcomeBack: "Heureux de vous revoir !",
        loginFailed: "La connexion a echoue",
        demoAccounts: "Comptes de demonstration :",
        admin: "Admin",
        customer: "Client",
        heroBadge: "Portail de suivi immigration",
        heroTitle: "Retrouvez votre dossier, vos paiements et les prochaines etapes du bureau.",
        heroText: "Connectez-vous pour suivre une demande de visa, d'etudes, de travail ou de reunification familiale sans perdre le fil du traitement.",
        officeReady: "Vue dossier",
        officeReadyText: "Statut, pieces partagees et actions en attente restent lisibles a chaque reprise.",
        secureAccess: "Coordination bureau-client",
        secureAccessText: "Le meme acces relie le portail client et l'espace administratif pour garder un suivi coherent.",
      }
    : {
        title: "Welcome Back",
        subtitle: "Log in to your NOTR-AFRIK account",
        email: "Email",
        password: "Password",
        signingIn: "Signing in...",
        signIn: "Sign In",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        welcomeBack: "Welcome back!",
        loginFailed: "Login failed",
        demoAccounts: "Demo accounts:",
        admin: "Admin",
        customer: "Customer",
        heroBadge: "Immigration case portal",
        heroTitle: "Get back to your case, payments, and the office actions that come next.",
        heroText: "Sign in to follow a visa, study, work, or family reunification file without losing track of where the process stands.",
        officeReady: "Case visibility",
        officeReadyText: "Status, shared documents, and pending actions stay readable every time you return.",
        secureAccess: "Office-client coordination",
        secureAccessText: "The same access flow connects the client portal and the admin workspace so case follow-up stays consistent.",
      };

  const features = [
    { icon: Sparkles, title: copy.officeReady, text: copy.officeReadyText },
    { icon: ShieldCheck, title: copy.secureAccess, text: copy.secureAccessText },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(copy.welcomeBack);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || copy.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr] lg:items-stretch">
        <section className="relative overflow-hidden rounded-[2rem] border border-sidebar-border bg-gradient-to-br from-sidebar via-[#12264c] to-[#0b1833] p-8 text-sidebar-foreground shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
          <div className="relative flex h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/80">
              <Globe2 className="h-4 w-4 text-primary" />
              {copy.heroBadge}
            </div>

            <div className="mt-8">
              <h1 className="font-heading text-4xl font-bold leading-tight text-white">{copy.heroTitle}</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-sidebar-foreground/75">{copy.heroText}</p>
            </div>

            <div className="mt-10 grid gap-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">{title}</h2>
                      <p className="mt-1 text-sm text-sidebar-foreground/70">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {copy.demoAccounts}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">{copy.admin}</div>
                    <div className="mt-2 text-sm font-medium text-white">admin@immigration-cm.com</div>
                    <div className="text-sm text-sidebar-foreground/70">admin123</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">{copy.customer}</div>
                    <div className="mt-2 text-sm font-medium text-white">jean@example.com</div>
                    <div className="text-sm text-sidebar-foreground/70">customer123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Card className="overflow-hidden border-primary/10 bg-[linear-gradient(180deg,rgba(255,251,241,0.98),rgba(255,255,255,0.96))] shadow-xl backdrop-blur-sm dark:bg-card">
          <CardHeader className="border-b border-primary/10 bg-primary/5 p-8 dark:border-border dark:bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                <Globe2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">{copy.title}</CardTitle>
                <CardDescription className="mt-1">{copy.subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email">{copy.email}</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">{copy.password}</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-12"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPw((current) => !current)}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? copy.signingIn : copy.signIn}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {copy.noAccount}{" "}
                <Link to="/register" className="font-semibold text-primary hover:underline">{copy.signUp}</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
