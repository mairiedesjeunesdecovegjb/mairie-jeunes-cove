import { useSEO } from "@/hooks/use-seo";
import { useListEvents } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { format, isFuture, isPast } from "date-fns";
import { fr } from "date-fns/locale";

export default function Events() {
  useSEO({ title: "Agenda" });
  const { data: events, isLoading } = useListEvents();

  const upcomingEvents = events?.filter(e => isFuture(new Date(e.startsAt))) || [];
  const pastEvents = events?.filter(e => isPast(new Date(e.startsAt))) || [];

  const EventCard = ({ event }: { event: any }) => (
    <Card className="overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
      <div className="md:w-1/3 aspect-video md:aspect-auto relative bg-muted shrink-0">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 text-primary/40">
            <CalendarIcon size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm w-14 h-14 overflow-hidden border border-border/50">
          <span className="text-xs font-bold uppercase bg-primary text-white w-full text-center py-0.5">{format(new Date(event.startsAt), 'MMM', { locale: fr })}</span>
          <span className="text-lg font-bold text-foreground leading-none mt-1">{format(new Date(event.startsAt), 'dd')}</span>
        </div>
      </div>
      <CardContent className="p-6 md:p-8 flex-1 flex flex-col justify-center">
        {event.category && (
          <div className="mb-3">
            <Badge variant="outline" className="text-primary border-primary/30">{event.category}</Badge>
          </div>
        )}
        <h3 className="text-2xl font-bold font-serif mb-3">{event.title}</h3>
        {event.description && (
          <p className="text-muted-foreground mb-6 line-clamp-2">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/80 font-medium">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span>
              {format(new Date(event.startsAt), 'HH:mm')} 
              {event.endsAt && ` - ${format(new Date(event.endsAt), 'HH:mm')}`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PublicLayout>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Agenda</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Participez à nos prochains événements et activités.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : (
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold font-serif mb-8 flex items-center gap-3">
                <span className="bg-primary w-2 h-8 rounded-full"></span>
                Événements à venir
              </h2>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-xl border border-dashed border-border text-muted-foreground">
                  Aucun événement programmé pour le moment.
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
              )}
            </section>

            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-serif mb-8 flex items-center gap-3 text-muted-foreground">
                  <span className="bg-muted-foreground w-2 h-8 rounded-full"></span>
                  Événements passés
                </h2>
                <div className="space-y-6 opacity-75">
                  {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
