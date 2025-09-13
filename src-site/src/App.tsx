// src/App.tsx – Iron Bank Demo Application
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AccountSummary from "./components/AccountSummary";
import TransactionsPage from "./components/TransactionsPage";
import ProfilePage from "./components/ProfilePage";
import AuthModal from "./components/AuthModal";
import TwoFactorModal from "./components/TwoFactorModal";
import AgeVerificationModal from "./components/AgeVerificationModal";

const useRouteComponent = (path: string) =>
  useMemo(() => {
    switch (path) {
      case "/transactions":
        return TransactionsPage;
      case "/profile":
        return ProfilePage;
      case "/dashboard":
        return AccountSummary;
      default:
        return AccountSummary;
    }
  }, [path]);

interface AuthState {
  isAuthenticated: boolean;
  needsTwoFactor: boolean;
  username: string | null;
}

const App: React.FC = () => {
  const [path, setPath] = useState(() => window.location.pathname);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    needsTwoFactor: false,
    username: null,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showAgeVerificationModal, setShowAgeVerificationModal] =
    useState(false);
  const [isAgeVerificationFlow, setIsAgeVerificationFlow] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const storedAuth = localStorage.getItem("iron-bank-auth");
        const storedUsername = localStorage.getItem("iron-bank-username");

        if (storedAuth === "authenticated" && storedUsername) {
          setAuthState({
            isAuthenticated: true,
            needsTwoFactor: false,
            username: storedUsername,
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  // Handle navigation
  useEffect(() => {
    const onPopstate = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("popstate", onPopstate);
    return () => window.removeEventListener("popstate", onPopstate);
  }, []);

  // Handle login button click
  const handleLoginClick = () => {
    setIsAgeVerificationFlow(false);
    setShowAuthModal(true);
  };

  // Handle age verification button click from landing page (full auth flow)
  const handleAgeVerificationClick = () => {
    setIsAgeVerificationFlow(true);
    setShowAuthModal(true);
  };

  // Handle age verification button click from navbar (direct modal)
  const handleDirectAgeVerificationClick = () => {
    setShowAgeVerificationModal(true);
  };

  // Handle successful login
  const handleLoginSuccess = (username: string) => {
    setAuthState({
      isAuthenticated: false,
      needsTwoFactor: true,
      username,
    });
    setShowAuthModal(false);
    setShowTwoFactorModal(true);
  };

  // Handle successful 2FA
  const handleTwoFactorSuccess = () => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      needsTwoFactor: false,
    }));
    setShowTwoFactorModal(false);

    // Store authentication state
    localStorage.setItem("iron-bank-auth", "authenticated");
    localStorage.setItem("iron-bank-username", authState.username || "");

    if (isAgeVerificationFlow) {
      // Show age verification modal instead of going to dashboard
      setShowAgeVerificationModal(true);
    } else {
      // Normal login flow - redirect to dashboard
      window.history.pushState({}, "", "/dashboard");
      setPath("/dashboard");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      needsTwoFactor: false,
      username: null,
    });
    setIsAgeVerificationFlow(false);
    localStorage.removeItem("iron-bank-auth");
    localStorage.removeItem("iron-bank-username");

    // Redirect to landing page
    window.history.pushState({}, "", "/");
    setPath("/");
  };

  const CurrentPage = useRouteComponent(path);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="iron-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 text-iron-gold iron-logo">
            IRON BANK
          </div>
          <div className="text-xl text-iron-silver">
            Verifying credentials...
          </div>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="iron-gradient min-h-screen">
        <LandingPage
          onLoginClick={handleLoginClick}
          onAgeVerificationClick={handleAgeVerificationClick}
        />

        {showAuthModal && (
          <AuthModal
            onLoginSuccess={handleLoginSuccess}
            onClose={() => {
              setShowAuthModal(false);
              setIsAgeVerificationFlow(false);
            }}
          />
        )}

        {showTwoFactorModal && (
          <TwoFactorModal
            username={authState.username || ""}
            onSuccess={handleTwoFactorSuccess}
            onClose={() => {
              setShowTwoFactorModal(false);
              setAuthState((prev) => ({ ...prev, needsTwoFactor: false }));
              setIsAgeVerificationFlow(false);
            }}
          />
        )}

        {showAgeVerificationModal && (
          <AgeVerificationModal
            onClose={() => {
              setShowAgeVerificationModal(false);
              if (isAgeVerificationFlow) {
                // If this was part of the login flow, go to dashboard
                window.history.pushState({}, "", "/dashboard");
                setPath("/dashboard");
              }
              setIsAgeVerificationFlow(false);
            }}
          />
        )}
      </div>
    );
  }

  // Show authenticated app
  return (
    <div className="iron-gradient min-h-screen">
      <Navbar
        username={authState.username || ""}
        onLogout={handleLogout}
        onAgeVerificationClick={handleDirectAgeVerificationClick}
      />
      <CurrentPage />

      {/* Age verification modal can appear from authenticated state */}
      {showAgeVerificationModal && (
        <AgeVerificationModal
          onClose={() => {
            setShowAgeVerificationModal(false);
            // When called from navbar, just close the modal and stay on current page
          }}
        />
      )}
    </div>
  );
};

export default App;
