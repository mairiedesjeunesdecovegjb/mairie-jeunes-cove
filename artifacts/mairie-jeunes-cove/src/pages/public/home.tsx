import { useSEO } from "@/hooks/use-seo";
import { 
  useGetSettings, 
  useListHeroSlides, 
  useListProjects, 
  useListNews, 
  useListUpcomingEvents, 
  useListGallery, 
  useListPartners 
} from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin, Building } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function AnimatedCounter({ value, duration = 2000 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMilSecDur = duration;
    let incrementTime = (totalMilSecDur / end) * 3;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function Home() {
  useSEO({ title: "Accueil" });
  const { data: settings } = useGetSettings();
  const { data: slides } = useListHeroSlides();
  const { data: projects } = useListProjects();
  const { data: news } = useListNews();
  const { data: events } = useListUpcomingEvents();
  const { data: gallery } = useListGallery();
  const { data: partners } = useListPartners();

  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);
  const activeSlides = slides?.filter(s => s.active).sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || projects?.slice(0, 3) || [];
  const latestNews = news?.filter(n => n.published).slice(0, 3) || [];
  const topEvents = events?.slice(0, 3) || [];
  const previewGallery = gallery?.slice(0, 6) || [];
  const sortedPartners = partners?.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <PublicLayout>
      {/* Hero Slider */}
      <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {activeSlides.length > 0 ? (
            activeSlides.map((slide) => (
              <div key={slide.id} className="relative flex-[0_0_100%] h-full">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <motion.img 
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-2xl text-white"
                    >
                      <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight mb-4">
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.ctaLabel && slide.ctaUrl && (
                        <Link href={slide.ctaUrl}>
                          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-none rounded-full px-8">
                            {slide.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-[0_0_100%] h-full bg-primary/10 flex items-center justify-center">
              <h1 className="text-4xl font-bold font-serif text-primary">Mairie des Jeunes de Covè</h1>
            </div>
          )}
        </div>
      </section>

      {/* Mot du Maire */}
      {settings?.mayorName && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3 relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                  {settings.mayorPhotoUrl ? (
                    <img src={settings.mayorPhotoUrl} alt={settings.mayorName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-6xl font-bold text-muted-foreground/30">{settings.mayorName.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent rounded-full -z-0 opacity-20 blur-2xl"></div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Mot du Maire</h2>
                <h3 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-foreground">{settings.mayorName}</h3>
                {settings.mayorTitle && <p className="text-xl text-muted-foreground mb-6 font-medium">{settings.mayorTitle}</p>}
                
                <div className="prose prose-lg max-w-none text-muted-foreground relative">
                  <span className="absolute -top-4 -left-4 text-6xl text-primary/10 font-serif leading-none">"</span>
                  <p className="italic relative z-10">{settings.mayorMessage}</p>
                </div>
                
                <div className="mt-8">
                  <Link href="/cabinet">
                    <Button variant="outline" className="rounded-full">
                      Découvrir l'équipe
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2">
                <AnimatedCounter value={settings?.statYouthCount || 0} />+
              </div>
              <div className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">{settings?.statYouthLabel || "Jeunes Impactés"}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2">
                <AnimatedCounter value={settings?.statActivitiesCount || 0} />
              </div>
              <div className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">{settings?.statActivitiesLabel || "Activités Réalisées"}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2">
                <AnimatedCounter value={settings?.statProjectsCount || 0} />
              </div>
              <div className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">{settings?.statProjectsLabel || "Projets en Cours"}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2">
                <AnimatedCounter value={settings?.statPartnersCount || 0} />
              </div>
              <div className="text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">{settings?.statPartnersLabel || "Partenaires"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Nos Actions</h2>
                <h3 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Projets Phares</h3>
              </div>
              <Link href="/projets" className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors">
                Tous les projets <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map(project => (
                <Card key={project.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-primary/10" />
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge variant={project.status === 'completed' ? 'secondary' : 'default'} className="bg-white text-foreground border-none">
                        {project.status === 'completed' ? 'Terminé' : project.status === 'ongoing' ? 'En cours' : 'À venir'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    {project.category && <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{project.category}</div>}
                    <h4 className="text-xl font-bold font-serif mb-3 line-clamp-2"><Link href={`/projets/${project.id}`} className="hover:text-primary">{project.title}</Link></h4>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{project.description}</p>
                    <Link href={`/projets/${project.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                      Voir les détails <ArrowRight size={14} />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/projets">
                <Button variant="outline" className="w-full">Tous les projets</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Actualités & Agenda */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* News */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-3xl font-bold font-serif">Dernières Actualités</h3>
                <Link href="/actualites" className="text-sm font-medium text-primary hover:text-accent flex items-center gap-1">
                  Voir tout <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="space-y-6">
                {latestNews.map(article => (
                  <div key={article.id} className="flex flex-col sm:flex-row gap-6 group">
                    <div className="sm:w-48 aspect-video sm:aspect-square rounded-xl overflow-hidden shrink-0">
                      {article.coverImageUrl ? (
                        <img src={article.coverImageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        {article.category && <Badge variant="outline" className="font-normal">{article.category}</Badge>}
                        {article.publishedAt && <span>{format(new Date(article.publishedAt), 'd MMM yyyy', { locale: fr })}</span>}
                      </div>
                      <h4 className="text-xl font-bold font-serif mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/actualites/${article.id}`}>{article.title}</Link>
                      </h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-3xl font-bold font-serif">Agenda</h3>
                <Link href="/agenda" className="text-sm font-medium text-primary hover:text-accent flex items-center gap-1">
                  Voir tout <ArrowRight size={14} />
                </Link>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
                {topEvents.length > 0 ? (
                  <div className="space-y-6">
                    {topEvents.map(event => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm w-14 h-14 shrink-0 border border-border/50">
                          <span className="text-[10px] font-bold uppercase text-primary leading-none mb-1">{format(new Date(event.startsAt), 'MMM', { locale: fr })}</span>
                          <span className="text-lg font-bold text-foreground leading-none">{format(new Date(event.startsAt), 'dd')}</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-foreground line-clamp-1">{event.title}</h5>
                          <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin size={12} /> <span className="line-clamp-1">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucun événement à venir</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {previewGallery.length > 0 && (
        <section className="py-20 bg-foreground text-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">En Images</h2>
            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-12">La Commune en Action</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {previewGallery.map((photo, i) => (
                <div key={photo.id} className={`relative group overflow-hidden rounded-xl bg-muted/20 ${i === 0 ? 'md:row-span-2 md:col-span-2 aspect-video md:aspect-auto' : 'aspect-square'}`}>
                  <img src={photo.imageUrl} alt={photo.title || 'Galerie'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    {photo.title && <h4 className="text-white font-bold font-serif text-lg">{photo.title}</h4>}
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/galerie">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-foreground rounded-full px-8">
                Voir toute la galerie
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Partners */}
      {sortedPartners.length > 0 && (
        <section className="py-12 bg-white border-b border-border/50 overflow-hidden">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">Ils nous font confiance</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {sortedPartners.map(partner => (
                <div key={partner.id} className="w-32 md:w-40 h-16 flex items-center justify-center">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="font-bold text-xl font-serif text-center leading-tight">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-accent rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6 max-w-3xl mx-auto leading-tight">
            Envie de contribuer au développement de notre commune ?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Rejoignez-nous, proposez vos idées ou devenez partenaire de la Mairie des Jeunes de Covè.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 w-full sm:w-auto">
                Nous contacter
              </Button>
            </Link>
            <Link href="/opportunites">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 w-full sm:w-auto">
                Voir les opportunités
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
