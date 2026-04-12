import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { Globe, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

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
        subtitle: "Connectez-vous a votre compte ImmigrationCM",
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
      }
    : {
        title: "Welcome Back",
        subtitle: "Log in to your ImmigrationCM account",
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
      };

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cameroon-green to-cameroon-yellow flex items-center justify-center mx-auto mb-4">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">{copy.title}</h1>
          <p className="text-gray-500 mt-1">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.password}</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pr-12" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? copy.signingIn : copy.signIn}
          </button>

          <p className="text-center text-sm text-gray-500">
            {copy.noAccount}{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">{copy.signUp}</Link>
          </p>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
          <strong>{copy.demoAccounts}</strong><br />
          {copy.admin}: admin@immigration-cm.com / admin123<br />
          {copy.customer}: jean@example.com / customer123
        </div>
      </div>
    </div>
  );
}
