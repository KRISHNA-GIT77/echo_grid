import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Grid3X3, LogOut, User } from "lucide-react";
import type { Profile } from "../backend";

type Page = "home" | "dashboard" | "preparedness" | "profile";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  profile: Profile | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function Header({
  currentPage,
  onNavigate,
  isLoggedIn,
  profile,
  onLoginClick,
  onLogout,
}: HeaderProps) {
  const navLinks: { label: string; page: Page }[] = [
    { label: "Live Map", page: "dashboard" },
    { label: "Preparedness", page: "preparedness" },
  ];

  return (
    <header className="nav-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 group"
          data-ocid="header.link"
        >
          <div className="w-8 h-8 rounded-md bg-eg-purple/20 border border-eg-purple/40 flex items-center justify-center glow-purple">
            <Grid3X3 className="w-4 h-4 text-eg-purple" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Echo<span className="text-eg-orange">-Grid</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, page }) => (
            <button
              type="button"
              key={page}
              onClick={() => onNavigate(page)}
              data-ocid={`nav.${page}.link`}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currentPage === page
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-muted-foreground">
            Support
          </span>
          {isLoggedIn && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2"
                  data-ocid="header.profile.button"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-eg-purple/20 text-eg-purple text-xs font-bold">
                      {profile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {profile.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-popover border-border"
              >
                <DropdownMenuItem
                  onClick={() => onNavigate("profile")}
                  data-ocid="header.profile.link"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate("dashboard")}
                  data-ocid="header.dashboard.link"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-destructive"
                  data-ocid="header.logout.button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={onLoginClick}
              data-ocid="header.login.button"
              className="bg-eg-orange hover:bg-eg-orange/90 text-white font-semibold uppercase tracking-wider text-xs px-4 rounded-full glow"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
