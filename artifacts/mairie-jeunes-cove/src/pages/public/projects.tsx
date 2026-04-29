import { useSEO } from "@/hooks/use-seo";
import { useListProjects } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Projects() {
  useSEO({ title: "Nos projets" });
  const { data: projects, isLoading } = useListProjects();
  const [filter, setFilter] = useState<string | null>(null);

  const filteredProjects = projects?.filter(p => !filter || p.status === filter) || [];

  return (
    <PublicLayout>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Nos Projets</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos initiatives pour le développement de la jeunesse et de la commune.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Badge 
            variant={filter === null ? "default" : "outline"} 
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => setFilter(null)}
          >
            Tous les projets
          </Badge>
          <Badge 
            variant={filter === "planned" ? "default" : "outline"} 
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => setFilter("planned")}
          >
            À venir
          </Badge>
          <Badge 
            variant={filter === "ongoing" ? "default" : "outline"} 
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => setFilter("ongoing")}
          >
            En cours
          </Badge>
          <Badge 
            variant={filter === "completed" ? "default" : "outline"} 
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => setFilter("completed")}
          >
            Terminé
          </Badge>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Aucun projet trouvé.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-muted">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <span className="font-medium">Image non disponible</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant={project.status === 'completed' ? 'secondary' : project.status === 'ongoing' ? 'default' : 'outline'} className="bg-white/90 text-foreground border-none shadow-sm backdrop-blur-sm">
                      {project.status === 'completed' ? 'Terminé' : project.status === 'ongoing' ? 'En cours' : 'À venir'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  {project.category && (
                    <div className="text-sm font-medium text-primary mb-2">{project.category}</div>
                  )}
                  <h3 className="text-xl font-bold font-serif mb-3 line-clamp-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">{project.description}</p>
                  
                  {project.progress !== undefined && project.progress !== null && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span>Progression</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                    {project.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="truncate">{project.location}</span>
                      </div>
                    )}
                    {project.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Démarrage: {format(new Date(project.startDate), 'MMM yyyy', { locale: fr })}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link href={`/projets/${project.id}`} className="mt-auto inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors group">
                    Voir les détails <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
