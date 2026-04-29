import { useGetDashboardSummary, useListContactMessages } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Briefcase, Newspaper, Calendar, 
  Camera, Target, Handshake, Mail, ImageIcon 
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: messages, isLoading: isMessagesLoading } = useListContactMessages();

  const recentMessages = messages?.slice(0, 5) || [];

  const StatCard = ({ title, value, icon: Icon, href, colorClass }: any) => (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value !== undefined ? value : "-"}</h3>
          </div>
          <div className={`p-4 rounded-xl ${colorClass}`}>
            <Icon size={24} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Bienvenue dans l'espace d'administration de la Mairie des Jeunes.</p>
      </div>

      {isSummaryLoading ? (
        <div className="py-12 text-center text-muted-foreground">Chargement des statistiques...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <StatCard title="Projets" value={summary?.projectsCount} icon={Briefcase} href="/secure-admin-cove/projects" colorClass="bg-blue-100 text-blue-600" />
          <StatCard title="Actualités" value={summary?.newsCount} icon={Newspaper} href="/secure-admin-cove/news" colorClass="bg-green-100 text-green-600" />
          <StatCard title="Événements à venir" value={summary?.upcomingEventsCount} icon={Calendar} href="/secure-admin-cove/events" colorClass="bg-orange-100 text-orange-600" />
          <StatCard title="Messages non lus" value={summary?.unreadMessagesCount} icon={Mail} href="/secure-admin-cove/contacts" colorClass="bg-red-100 text-red-600" />
          
          <StatCard title="Membres du Cabinet" value={summary?.teamCount} icon={Users} href="/secure-admin-cove/team" colorClass="bg-purple-100 text-purple-600" />
          <StatCard title="Opportunités" value={summary?.opportunitiesCount} icon={Target} href="/secure-admin-cove/opportunities" colorClass="bg-yellow-100 text-yellow-600" />
          <StatCard title="Photos Galerie" value={summary?.galleryCount} icon={Camera} href="/secure-admin-cove/gallery" colorClass="bg-pink-100 text-pink-600" />
          <StatCard title="Partenaires" value={summary?.partnersCount} icon={Handshake} href="/secure-admin-cove/partners" colorClass="bg-teal-100 text-teal-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Derniers Messages Reçus</CardTitle>
            <Link href="/secure-admin-cove/contacts" className="text-sm text-primary hover:underline">Voir tout</Link>
          </CardHeader>
          <CardContent>
            {isMessagesLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Chargement...</div>
            ) : recentMessages.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Aucun message récent</div>
            ) : (
              <div className="space-y-4 mt-4">
                {recentMessages.map(msg => (
                  <div key={msg.id} className="flex flex-col border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium flex items-center gap-2">
                        {!msg.read && <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>}
                        {msg.fullName}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(msg.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{msg.subject}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Raccourcis Rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/secure-admin-cove/news">
              <Button variant="outline" className="w-full justify-start h-auto py-4 flex flex-col items-center gap-2">
                <Newspaper className="h-6 w-6 text-primary" />
                <span>Rédiger actualité</span>
              </Button>
            </Link>
            <Link href="/secure-admin-cove/events">
              <Button variant="outline" className="w-full justify-start h-auto py-4 flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span>Créer événement</span>
              </Button>
            </Link>
            <Link href="/secure-admin-cove/projects">
              <Button variant="outline" className="w-full justify-start h-auto py-4 flex flex-col items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span>Nouveau projet</span>
              </Button>
            </Link>
            <Link href="/secure-admin-cove/hero-slides">
              <Button variant="outline" className="w-full justify-start h-auto py-4 flex flex-col items-center gap-2">
                <ImageIcon className="h-6 w-6 text-primary" />
                <span>Gérer le slider</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
