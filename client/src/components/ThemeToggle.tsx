import { MoonStar, SunMedium } from "lucide-react";
import { useI18n } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { cn } from "@/lib/utils";

/** Compact toggle for use in the public Navbar (light surface). */
export default function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();
  const { isFrench } = useI18n();
  const label = isDark
    ? (isFrench ? "Mode clair" : "Light mode")
    : (isFrench ? "Mode sombre" : "Dark mode");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-border bg-card p-2 text-muted-foreground",
        "hover:bg-muted hover:text-foreground transition-colors",
        className,
      )}
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </button>
  );
}
