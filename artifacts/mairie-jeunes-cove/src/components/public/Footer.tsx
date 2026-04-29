import { useGetSettings } from "@workspace/api-client-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const { data: settings } = useGetSettings();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif font-bold text-xl mb-4">
              {settings?.siteName || "Mairie des Jeunes de Covè"}
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-sm">
              {settings?.tagline || "Ensemble pour le développement de notre commune."}
            </p>
            <div className="flex gap-4">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><Link href="/" className="hover:text-accent transition-colors">Accueil</Link></li>
              <li><Link href="/a-propos" className="hover:text-accent transition-colors">À propos</Link></li>
              <li><Link href="/cabinet" className="hover:text-accent transition-colors">Cabinet Municipal</Link></li>
              <li><Link href="/projets" className="hover:text-accent transition-colors">Nos Projets</Link></li>
              <li><Link href="/actualites" className="hover:text-accent transition-colors">Actualités</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-4 text-primary-foreground/80">
              {settings?.contactAddress && (
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="shrink-0 mt-0.5" />
                  <span>{settings.contactAddress}</span>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone size={20} className="shrink-0" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-accent transition-colors">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail size={20} className="shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-accent transition-colors">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>
            {settings?.footerText || "© 2026 Mairie des Jeunes de Covè - Tous droits réservés, Conçu par Builvision Group"}
          </p>
        </div>
      </div>
    </footer>
  );
}
