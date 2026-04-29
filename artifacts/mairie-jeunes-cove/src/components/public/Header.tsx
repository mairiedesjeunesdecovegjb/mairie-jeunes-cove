import { Link, useLocation } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useThemeColors } from "@/hooks/use-theme-colors";

export function Header() {
  const { data: settings } = useGetSettings();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useThemeColors();

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "Cabinet", href: "/cabinet" },
    { label: "Projets", href: "/projets" },
    { label: "Actualités", href: "/actualites" },
    { label: "Agenda", href: "/agenda" },
    { label: "Galerie", href: "/galerie" },
    { label: "Opportunités", href: "/opportunites" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
            )}
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-lg text-primary leading-tight">
                {settings?.siteName || "Mairie des Jeunes"}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                {settings?.tagline || "De Covè"}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary border-b-2 border-primary" : "text-foreground/70"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <Link href="/contact">
              <Button>S'engager</Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button 
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium py-2 ${location === link.href ? "text-primary" : "text-foreground/80"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full mt-2">S'engager</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
