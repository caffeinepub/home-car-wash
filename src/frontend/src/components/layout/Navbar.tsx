import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { Car, Droplets, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vehicles", label: "My Vehicles" },
  { id: "book", label: "Book a Wash" },
  { id: "appointments", label: "Appointments" },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!identity;

  const allNavItems = isAdmin
    ? [...navItems, { id: "admin", label: "Admin Panel" }]
    : navItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5 group"
            onClick={() =>
              onNavigate(isAuthenticated ? "dashboard" : "landing")
            }
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-cyan-sm group-hover:bg-primary/30 transition-all">
              <Droplets className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Shine<span className="text-primary">Drop</span>
            </span>
          </button>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {allNavItems.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  data-ocid={`nav.${item.id}.link`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Auth Button */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                  <Car className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">
                    {identity?.getPrincipal().toString().slice(0, 10)}...
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.logout.button"
                  className="border-border/60 hover:border-destructive/50 hover:text-destructive hover:bg-destructive/10 text-muted-foreground transition-all"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                data-ocid="nav.login.button"
                className="bg-primary text-primary-foreground hover:opacity-90 glow-cyan-sm transition-all"
                size="sm"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-3.5 h-3.5 mr-1.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin inline-block" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Sign In
                  </>
                )}
              </Button>
            )}

            {/* Mobile menu toggle */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
                data-ocid="nav.menu.toggle"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {allNavItems.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileOpen(false);
                  }}
                  data-ocid={`nav.mobile.${item.id}.link`}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
