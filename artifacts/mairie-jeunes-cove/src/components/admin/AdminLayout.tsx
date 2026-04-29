import { useGetCurrentAdmin, useAdminLogout } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Users, Briefcase, 
  Newspaper, Calendar, Camera, Target, Handshake, Mail, 
  Palette, Fingerprint, Search, Shield, LogOut, Menu, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: admin, isLoading, isError } = useGetCurrentAdmin({
    query: {
      retry: false
    }
  });

  const logoutMutation = useAdminLogout();

  useEffect(() => {
    if (!isLoading && (isError || !admin)) {
      setLocation("/secure-admin-cove-login");
    }
  }, [isLoading, isError, admin, setLocation]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/secure-admin-cove-login");
      }
    });
  };

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { label: "Tableau de bord", href: "/secure-admin-cove", icon: LayoutDashboard },
    { label: "Page d'accueil", href: "/secure-admin-cove/home-page", icon: FileText },
    { label: "Hero Slider", href: "/secure-admin-cove/hero-slides", icon: ImageIcon },
    { label: "Cabinet municipal", href: "/secure-admin-cove/team", icon: Users },
    { label: "Projets", href: "/secure-admin-cove/projects", icon: Briefcase },
    { label: "Actualités", href: "/secure-admin-cove/news", icon: Newspaper },
    { label: "Agenda", href: "/secure-admin-cove/events", icon: Calendar },
    { label: "Galerie", href: "/secure-admin-cove/gallery", icon: Camera },
    { label: "Opportunités", href: "/secure-admin-cove/opportunities", icon: Target },
    { label: "Partenaires", href: "/secure-admin-cove/partners", icon: Handshake },
    { label: "Pages & SEO", href: "/secure-admin-cove/pages", icon: FileText },
    { label: "Contacts & Messages", href: "/secure-admin-cove/contacts", icon: Mail },
    
    { type: "divider" },
    { label: "Apparence", href: "/secure-admin-cove/settings/appearance", icon: Palette },
    { label: "Identité & Statistiques", href: "/secure-admin-cove/settings/identity", icon: Fingerprint },
    { label: "SEO global", href: "/secure-admin-cove/settings/seo", icon: Search },
    { label: "Sécurité", href: "/secure-admin-cove/settings/security", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="font-bold font-serif">Mairie des Jeunes - Admin</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transform transition-transform duration-200 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-xl font-bold font-serif text-primary">Mairie des Jeunes</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Administration</p>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item, index) => {
              if (item.type === "divider") {
                return <div key={`div-${index}`} className="my-4 border-t border-sidebar-border/50 mx-2" />;
              }
              
              const Icon = item.icon!;
              const isActive = location === item.href || (item.href !== '/secure-admin-cove' && location.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href!}>
                  <div 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {admin.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm font-medium">{admin.username}</div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut size={16} className="mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
