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

export default function RegisterPage() {
  const { register } = useAuth();
  const { isFrench } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const copy = isFrench
    ? {
        title: "Creer votre compte",
        subtitle: "Commencez votre projet d'immigration aujourd'hui",
        firstName: "Prenom",
        lastName: "Nom",
        email: "Email",
        phone: "Telephone",
        optional: "optionnel",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        minPassword: "6 caracteres minimum",
        creating: "Creation du compte...",
        create: "Creer mon compte",
        alreadyHaveAccount: "Vous avez deja un compte ?",
        logIn: "Se connecter",
        passwordsMismatch: "Les mots de passe ne correspondent pas",
        passwordTooShort: "Le mot de passe doit contenir au moins 6 caracteres",
        accountCreated: "Compte cree !",
        registrationFailed: "L'inscription a echoue",
        heroBadge: "Ouverture de dossier",
        heroTitle: "Creez votre espace pour lancer et suivre vos demarches d'immigration.",
        heroText: "Votre compte servira de point d'ancrage pour les demandes de visa, d'etudes, de travail ou de reunification traitees par le bureau.",
        featureOne: "Informations reutilisables",
        featureOneText: "Votre identite et vos coordonnees restent disponibles pour chaque nouveau dossier.",
        featureTwo: "Suivi bureau",
        featureTwoText: "Vous retrouvez les statuts, les pieces partagees et les paiements au meme endroit.",
        featureThree: "Passage au traitement",
        featureThreeText: "Une fois la demande lancee, l'equipe peut reprendre le dossier sans casser votre suivi client.",
      }
    : {
        title: "Create Your Account",
        subtitle: "Start your immigration journey today",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        optional: "optional",
        password: "Password",
        confirmPassword: "Confirm Password",
        minPassword: "Min. 6 characters",
        creating: "Creating account...",
        create: "Create Account",
        alreadyHaveAccount: "Already have an account?",
        logIn: "Log in",
        passwordsMismatch: "Passwords do not match",
        passwordTooShort: "Password must be at least 6 characters",
        accountCreated: "Account created!",
        registrationFailed: "Registration failed",
        heroBadge: "Case opening",
        heroTitle: "Create your space to start and follow your immigration process.",
        heroText: "Your account becomes the anchor point for visa, study, work, or family reunification requests handled by the office.",
        featureOne: "Reusable details",
        featureOneText: "Your identity and contact information stay ready for every new application.",
        featureTwo: "Office follow-up",
        featureTwoText: "Statuses, shared documents, and payments stay visible in one place.",
        featureThree: "Case handoff",
        featureThreeText: "Once the request is started, the team can pick it up without breaking your client-side tracking.",
      };

  const features = [
    { icon: Sparkles, title: copy.featureOne, text: copy.featureOneText },
    { icon: CheckCircle2, title: copy.featureTwo, text: copy.featureTwoText },
    { icon: ShieldCheck, title: copy.featureThree, text: copy.featureThreeText },
  ];

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(copy.passwordsMismatch);
      return;
    }
    if (form.password.length < 6) {
      toast.error(copy.passwordTooShort);
      return;
    }
    setLoading(true);
    try {
      await register({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, phone: form.phone || undefined });
      toast.success(copy.accountCreated);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || copy.registrationFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.96fr,1.04fr] lg:items-stretch">
        <section className="relative overflow-hidden rounded-[2rem] border border-sidebar-border bg-gradient-to-br from-sidebar via-[#12264c] to-[#0b1833] p-8 text-sidebar-foreground shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="register-first-name">{copy.firstName}</Label>
                  <Input id="register-first-name" type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-last-name">{copy.lastName}</Label>
                  <Input id="register-last-name" type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required placeholder="Nkoulou" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">{copy.email}</Label>
                <Input id="register-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-phone">{copy.phone} <span className="text-muted-foreground">({copy.optional})</span></Label>
                <Input id="register-phone" type="text" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+237 6XX XXX XXX" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">{copy.password}</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    className="pr-12"
                    placeholder={copy.minPassword}
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

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">{copy.confirmPassword}</Label>
                <Input id="register-confirm-password" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required placeholder="••••••••" />
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? copy.creating : copy.create}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {copy.alreadyHaveAccount}{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">{copy.logIn}</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
