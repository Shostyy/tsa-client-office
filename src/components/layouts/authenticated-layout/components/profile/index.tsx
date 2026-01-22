import React from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings,
  Moon,
  Sun,
  Monitor,
  Languages,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onLogout,
  isLoggingOut = false,
}) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language.startsWith("uk") ? "uk" : "en";

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="mr-2 h-4 w-4" />;
      case "light":
        return <Sun className="mr-2 h-4 w-4" />;
      default:
        return <Monitor className="mr-2 h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "dark":
        return t("Themes.Dark") || "Dark";
      case "light":
        return t("Themes.Light") || "Light";
      default:
        return t("Themes.System") || "System";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
          <Avatar className="w-8 h-8 ring-2 ring-[#c1585c]/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#c1585c] text-white">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Theme Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {getThemeIcon()}
            <span>{getThemeLabel()}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>{t("Themes.Light") || "Light"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>{t("Themes.Dark") || "Dark"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 h-4 w-4" />
              <span>{t("Themes.System") || "System"}</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Language Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="mr-2 h-4 w-4" />
            <span>{currentLang === "uk" ? "Українська" : "English"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleLanguageChange("uk")}>
              <span className="mr-2">🇺🇦</span>
              <span>Українська</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              <span className="mr-2">🇬🇧</span>
              <span>English</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-[#c1585c] dark:text-[#d46d71] focus:bg-[#c1585c]/10 focus:text-[#c1585c]"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
