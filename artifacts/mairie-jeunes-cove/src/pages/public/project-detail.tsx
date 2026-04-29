import { useSEO } from "@/hooks/use-seo";
import { useGetProject } from "@workspace/api-client-react";
import { getGetProjectQueryKey } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Calendar, Wallet } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useGetProject(Number(id), { 
    query: { enabled: !!id, queryKey: getGetProjectQueryKey(Number(id)) } 
  });

  useSEO({ 
    title: project?.title || "Projet",
    description: project?.description 
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center">Chargement...</div>
      </PublicLayout>
    );
  }

  if (!project) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center">Projet introuvable</div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative w-full h-[40vh] min-h-[300px] bg-muted">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-4 text-white">
            <Link href="/projets" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Retour aux projets
            </Link>
            {project.category && (
              <Badge className="mb-4 bg-primary text-white border-none">{project.category}</Badge>
            )}
            <h1 className="text-3xl md:text-5xl font-bold font-serif mb-4 leading-tight max-w-4xl">{project.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {project.description && (
              <p className="text-xl text-muted-foreground font-medium mb-8 leading-relaxed">
                {project.description}
              </p>
            )}
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-primary" dangerouslySetInnerHTML={{ __html: project.body || "" }} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-muted/50 rounded-xl p-6 border border-border/50">
              <h3 className="font-bold font-serif text-xl mb-6">Détails du projet</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Statut</div>
                  <Badge variant={project.status === 'completed' ? 'secondary' : project.status === 'ongoing' ? 'default' : 'outline'} className="text-sm px-3 py-1">
                    {project.status === 'completed' ? 'Terminé' : project.status === 'ongoing' ? 'En cours' : 'À venir'}
                  </Badge>
                </div>

                {project.progress !== undefined && project.progress !== null && (
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span>Progression</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2.5" />
                  </div>
                )}

                <div className="pt-4 border-t border-border/50 space-y-4">
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground font-medium">Lieu</div>
                        <div className="text-foreground">{project.location}</div>
                      </div>
                    </div>
                  )}
                  
                  {project.startDate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground font-medium">Calendrier</div>
                        <div className="text-foreground">
                          Début: {format(new Date(project.startDate), 'd MMMM yyyy', { locale: fr })}
                          {project.endDate && <><br />Fin: {format(new Date(project.endDate), 'd MMMM yyyy', { locale: fr })}</>}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.budget && (
                    <div className="flex items-start gap-3">
                      <Wallet size={20} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground font-medium">Budget</div>
                        <div className="text-foreground font-medium">{project.budget}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
