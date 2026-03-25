import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { LoginModal } from "./components/LoginModal";
import { PreparednessGuide } from "./components/PreparednessGuide";
import { UserProfile } from "./components/UserProfile";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerProfile } from "./hooks/useQueries";

type Page = "home" | "dashboard" | "preparedness" | "profile";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [loginOpen, setLoginOpen] = useState(false);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  const { identity, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: profile, isLoading: profileLoading } = useGetCallerProfile();

  useEffect(() => {
    if (isLoggedIn && !profileLoading && profile === null) {
      setNeedsProfileSetup(true);
      setPage("profile");
    } else if (isLoggedIn && profile) {
      setNeedsProfileSetup(false);
    }
  }, [isLoggedIn, profile, profileLoading]);

  const handleLoginSuccess = () => {
    setLoginOpen(false);
  };

  const handleLogout = () => {
    clear();
    setPage("home");
    setNeedsProfileSetup(false);
  };

  const handleNavigate = (p: Page) => {
    setPage(p);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentPage={page}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        profile={profile ?? null}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1">
        {page === "home" && (
          <LandingPage
            onLoginClick={() => setLoginOpen(true)}
            onNavigateDashboard={() => setPage("dashboard")}
            onNavigatePreparedness={() => setPage("preparedness")}
          />
        )}
        {page === "dashboard" && (
          <Dashboard
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setLoginOpen(true)}
          />
        )}
        {page === "preparedness" && <PreparednessGuide />}
        {page === "profile" && (
          <UserProfile
            profile={profile ?? null}
            identity={identity}
            isSetup={needsProfileSetup}
            onProfileSaved={() => {
              setNeedsProfileSetup(false);
              setPage("dashboard");
            }}
          />
        )}
      </div>

      <Footer />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}
