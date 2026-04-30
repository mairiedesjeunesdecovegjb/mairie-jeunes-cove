import { useSEO } from "@/hooks/use-seo";
import { useListOpportunities } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Building, ArrowRight } from "lucide-react";

export default function Opportunities() {
  useSEO({ title: "Opportunités jeunes" });
  const { data: opportunities, isLoading } = useListOpportunities();

  const publishedOpps = opportunities?.filter(o => o.published) || [];

  const parseDeadline = (s?: string | null): Date | null => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };

  return (
    <PublicLayout>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Opportunités Jeunes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Emplois, stages, formations et financements pour la jeunesse.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : publishedOpps.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-xl border border-dashed border-border text-muted-foreground">
            Aucune opportunité disponible pour le moment. Revenez plus tard!
          </div>
        ) : (
          <div className="space-y-6">
            {publishedOpps.map((opp) => {
              const deadlineDate = parseDeadline(opp.deadline);
              const deadlinePassed = !!deadlineDate && deadlineDate.getTime() < Date.now();
              
              return (
                <Card key={opp.id} className={`overflow-hidden hover:shadow-md transition-shadow ${deadlinePassed ? 'opacity-70' : ''}`}>
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                    {opp.imageUrl && (
                      <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img src={opp.imageUrl} alt={opp.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {opp.category && <Badge variant="secondary" className="text-xs">{opp.category}</Badge>}
                          {deadlinePassed && <Badge variant="destructive" className="text-xs">Expiré</Badge>}
                        </div>
                        <h3 className="text-2xl font-bold font-serif">{opp.title}</h3>
                        {opp.description && <p className="text-muted-foreground mt-2 line-clamp-2">{opp.description}</p>}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                        {opp.organization && (
                          <div className="flex items-center gap-2 text-foreground/80">
                            <Building size={16} className="text-primary" />
                            <span>{opp.organization}</span>
                          </div>
                        )}
                        {opp.location && (
                          <div className="flex items-center gap-2 text-foreground/80">
                            <MapPin size={16} className="text-primary" />
                            <span>{opp.location}</span>
                          </div>
                        )}
                        {opp.deadline && (
                          <div className="flex items-center gap-2 text-foreground/80">
                            <Calendar size={16} className={deadlinePassed ? "text-destructive" : "text-primary"} />
                            <span className={deadlinePassed ? "text-destructive" : ""}>
                              Date limite : {opp.deadline}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 mt-4 md:mt-0 flex flex-col justify-center">
                      <Button 
                        disabled={deadlinePassed || !opp.applyUrl} 
                        className="w-full md:w-auto"
                        onClick={() => opp.applyUrl && window.open(opp.applyUrl, '_blank')}
                      >
                        {deadlinePassed ? "Clôturé" : "Postuler"} <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
