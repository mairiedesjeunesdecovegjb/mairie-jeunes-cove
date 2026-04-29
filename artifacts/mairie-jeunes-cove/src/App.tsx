import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Public Pages
import Home from "@/pages/public/home";
import About from "@/pages/public/about";
import Cabinet from "@/pages/public/cabinet";
import Projects from "@/pages/public/projects";
import ProjectDetail from "@/pages/public/project-detail";
import News from "@/pages/public/news";
import NewsDetail from "@/pages/public/news-detail";
import Events from "@/pages/public/events";
import Gallery from "@/pages/public/gallery";
import Opportunities from "@/pages/public/opportunities";
import Contact from "@/pages/public/contact";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import Dashboard from "@/pages/admin/dashboard";
import HeroSlides from "@/pages/admin/hero-slides";
import Team from "@/pages/admin/team";
import ProjectsAdmin from "@/pages/admin/projects";
import NewsAdmin from "@/pages/admin/news";
import EventsAdmin from "@/pages/admin/events";
import GalleryAdmin from "@/pages/admin/gallery";
import OpportunitiesAdmin from "@/pages/admin/opportunities";
import PartnersAdmin from "@/pages/admin/partners";
import PagesAdmin from "@/pages/admin/pages";
import ContactsAdmin from "@/pages/admin/contacts";
import SettingsAppearance from "@/pages/admin/settings-appearance";
import SettingsIdentity from "@/pages/admin/settings-identity";
import SettingsSEO from "@/pages/admin/settings-seo";
import SettingsSecurity from "@/pages/admin/settings-security";
import AdminHomePage from "@/pages/admin/home-page";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/a-propos" component={About} />
      <Route path="/cabinet" component={Cabinet} />
      <Route path="/projets" component={Projects} />
      <Route path="/projets/:id" component={ProjectDetail} />
      <Route path="/actualites" component={News} />
      <Route path="/actualites/:id" component={NewsDetail} />
      <Route path="/agenda" component={Events} />
      <Route path="/galerie" component={Gallery} />
      <Route path="/opportunites" component={Opportunities} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin Routes */}
      <Route path="/secure-admin-cove-login" component={AdminLogin} />
      <Route path="/secure-admin-cove" component={Dashboard} />
      <Route path="/secure-admin-cove/home-page" component={AdminHomePage} />
      <Route path="/secure-admin-cove/hero-slides" component={HeroSlides} />
      <Route path="/secure-admin-cove/team" component={Team} />
      <Route path="/secure-admin-cove/projects" component={ProjectsAdmin} />
      <Route path="/secure-admin-cove/news" component={NewsAdmin} />
      <Route path="/secure-admin-cove/events" component={EventsAdmin} />
      <Route path="/secure-admin-cove/gallery" component={GalleryAdmin} />
      <Route path="/secure-admin-cove/opportunities" component={OpportunitiesAdmin} />
      <Route path="/secure-admin-cove/partners" component={PartnersAdmin} />
      <Route path="/secure-admin-cove/pages" component={PagesAdmin} />
      <Route path="/secure-admin-cove/contacts" component={ContactsAdmin} />
      <Route path="/secure-admin-cove/settings/appearance" component={SettingsAppearance} />
      <Route path="/secure-admin-cove/settings/identity" component={SettingsIdentity} />
      <Route path="/secure-admin-cove/settings/seo" component={SettingsSEO} />
      <Route path="/secure-admin-cove/settings/security" component={SettingsSecurity} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
