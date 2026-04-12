import { useEffect, useState } from "react";
import { KeyRound, Phone, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/LanguageContext";
import api from "@/lib/api";

interface AccountSettingsPanelProps {
  variant?: "customer" | "admin";
}

export default function AccountSettingsPanel({ variant = "customer" }: AccountSettingsPanelProps) {
  const { user, updateCurrentUser } = useAuth();
  const { isFrench } = useI18n();
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
    });
  }, [user?.firstName, user?.lastName, user?.phone]);

  const copy = isFrench
    ? {
        profileTitle: variant === "admin" ? "Profil administrateur" : "Informations du compte",
        profileSubtitle:
          variant === "admin"
            ? "Mettez a jour le nom, le telephone et les informations de contact utilisees par l'equipe."
            : "Mettez a jour les informations qui seront reutilisees dans vos parcours et vos validations futures.",
        firstName: "Prenom",
        lastName: "Nom",
        phone: "Telephone",
        phoneHint: "Ce numero servira plus tard au suivi operationnel et a la MFA.",
        saveProfile: "Enregistrer le profil",
        savingProfile: "Enregistrement...",
        profileSaved: "Profil mis a jour",
        profileError: "Impossible de mettre a jour le profil",
        securityTitle: "Securite",
        securitySubtitle: "Changez votre mot de passe et preparez votre compte pour des controles renforces.",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        confirmPassword: "Confirmer le nouveau mot de passe",
        securityHint: "Gardez un mot de passe simple a retenir mais assez fort pour un usage multi-employe ou multi-appareil.",
        updatePassword: "Mettre a jour le mot de passe",
        updatingPassword: "Mise a jour...",
        passwordUpdated: "Mot de passe mis a jour",
        passwordError: "Impossible de mettre a jour le mot de passe",
        passwordMismatch: "Les nouveaux mots de passe ne correspondent pas",
        passwordShort: "Le nouveau mot de passe doit contenir au moins 6 caracteres",
      }
    : {
        profileTitle: variant === "admin" ? "Admin Profile" : "Account Information",
        profileSubtitle:
          variant === "admin"
            ? "Update the name, phone, and contact details used by the office team."
            : "Update the information that will be reused across journeys and future verification steps.",
        firstName: "First Name",
        lastName: "Last Name",
        phone: "Phone",
        phoneHint: "This number will later support operational follow-up and MFA.",
        saveProfile: "Save profile",
        savingProfile: "Saving...",
        profileSaved: "Profile updated",
        profileError: "Unable to update the profile",
        securityTitle: "Security",
        securitySubtitle: "Change your password and prepare the account for stronger access controls.",
        currentPassword: "Current password",
        newPassword: "New password",
        confirmPassword: "Confirm new password",
        securityHint: "Keep the password memorable but strong enough for multi-device or multi-employee usage.",
        updatePassword: "Update password",
        updatingPassword: "Updating...",
        passwordUpdated: "Password updated",
        passwordError: "Unable to update the password",
        passwordMismatch: "The new passwords do not match",
        passwordShort: "The new password must be at least 6 characters",
      };

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      const { data } = await api.patch("/auth/me", {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone || null,
      });
      updateCurrentUser(data);
      toast.success(copy.profileSaved);
    } catch (error: any) {
      toast.error(error.response?.data?.error || copy.profileError);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(copy.passwordMismatch);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error(copy.passwordShort);
      return;
    }

    try {
      setSavingPassword(true);
      await api.patch("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success(copy.passwordUpdated);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || copy.passwordError);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.08fr,0.92fr]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{copy.profileTitle}</CardTitle>
              <CardDescription className="mt-1 max-w-xl">{copy.profileSubtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${variant}-first-name`}>{copy.firstName}</Label>
              <Input
                id={`${variant}-first-name`}
                type="text"
                value={profileForm.firstName}
                onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${variant}-last-name`}>{copy.lastName}</Label>
              <Input
                id={`${variant}-last-name`}
                type="text"
                value={profileForm.lastName}
                onChange={(event) => setProfileForm((current) => ({ ...current, lastName: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${variant}-phone`}>{copy.phone}</Label>
            <Input
              id={`${variant}-phone`}
              type="text"
              value={profileForm.phone}
              onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
            />
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {copy.phoneHint}
            </div>
          </div>

          <Button type="button" onClick={handleProfileSave} disabled={savingProfile} className="w-full sm:w-auto">
            {savingProfile ? copy.savingProfile : copy.saveProfile}
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{copy.securityTitle}</CardTitle>
              <CardDescription className="mt-1">{copy.securitySubtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor={`${variant}-current-password`}>{copy.currentPassword}</Label>
            <Input
              id={`${variant}-current-password`}
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${variant}-new-password`}>{copy.newPassword}</Label>
            <Input
              id={`${variant}-new-password`}
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${variant}-confirm-password`}>{copy.confirmPassword}</Label>
            <Input
              id={`${variant}-confirm-password`}
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            />
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">{copy.securityHint}</p>

          <Button type="button" onClick={handlePasswordSave} disabled={savingPassword} className="w-full sm:w-auto">
            {savingPassword ? copy.updatingPassword : copy.updatePassword}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}