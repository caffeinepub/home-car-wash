import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { AdminPage } from "@/pages/AdminPage";
import { AppointmentsPage } from "@/pages/AppointmentsPage";
import { BookWashPage } from "@/pages/BookWashPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";
import { VehiclesPage } from "@/pages/VehiclesPage";
import { useEffect, useState } from "react";

type Page =
  | "landing"
  | "dashboard"
  | "vehicles"
  | "book"
  | "appointments"
  | "admin";

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;

  const [currentPage, setCurrentPage] = useState<Page>("landing");

  // When auth state changes, redirect appropriately
  useEffect(() => {
    if (!isInitializing) {
      if (isAuthenticated && currentPage === "landing") {
        setCurrentPage("dashboard");
      } else if (!isAuthenticated && currentPage !== "landing") {
        setCurrentPage("landing");
      }
    }
  }, [isAuthenticated, isInitializing, currentPage]);

  const navigate = (page: string) => {
    // Guard admin page
    if (page === "admin" && !isAdmin) return;
    setCurrentPage(page as Page);
  };

  // Full-page loading state during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center" data-ocid="app.loading_state">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <svg
              className="w-7 h-7 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              role="img"
              aria-label="ShineDrop loading"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12a4 4 0 0 1 8 0" />
            </svg>
          </div>
          <div className="font-display text-lg font-semibold gradient-text">
            ShineDrop
          </div>
          <p className="text-muted-foreground text-sm mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={navigate} />

      {/* Page Content */}
      {!isAuthenticated ? (
        <LandingPage />
      ) : (
        <>
          {currentPage === "dashboard" && (
            <DashboardPage onNavigate={navigate} />
          )}
          {currentPage === "vehicles" && <VehiclesPage />}
          {currentPage === "book" && <BookWashPage onNavigate={navigate} />}
          {currentPage === "appointments" && (
            <AppointmentsPage onNavigate={navigate} />
          )}
          {currentPage === "admin" && isAdmin && <AdminPage />}
          {currentPage === "admin" && !isAdmin && (
            <DashboardPage onNavigate={navigate} />
          )}
        </>
      )}

      {/* Footer for authenticated pages */}
      {isAuthenticated && (
        <footer className="border-t border-border/30 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Built with ❤️ using caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      )}

      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-popover border-border/60 text-foreground",
            success: "!border-wash-success/30",
            error: "!border-destructive/30",
          },
        }}
        position="bottom-right"
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
