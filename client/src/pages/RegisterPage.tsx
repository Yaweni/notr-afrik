import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { Globe, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

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
      };

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cameroon-green to-cameroon-yellow flex items-center justify-center mx-auto mb-4">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">{copy.title}</h1>
          <p className="text-gray-500 mt-1">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.firstName}</label>
              <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required className="input-field" placeholder="Jean" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.lastName}</label>
              <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required className="input-field" placeholder="Nkoulou" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.email}</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="input-field" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.phone} <span className="text-gray-400">({copy.optional})</span></label>
            <input type="text" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input-field" placeholder="+237 6XX XXX XXX" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.password}</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} required className="input-field pr-12" placeholder={copy.minPassword} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.confirmPassword}</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="input-field" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? copy.creating : copy.create}
          </button>

          <p className="text-center text-sm text-gray-500">
            {copy.alreadyHaveAccount}{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">{copy.logIn}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
