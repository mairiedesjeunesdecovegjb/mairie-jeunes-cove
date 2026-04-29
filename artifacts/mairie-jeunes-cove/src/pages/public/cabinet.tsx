import { useSEO } from "@/hooks/use-seo";
import { useListTeam } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Linkedin, Mail } from "lucide-react";

export default function Cabinet() {
  useSEO({ title: "Cabinet municipal jeune" });
  const { data: teamMembers, isLoading } = useListTeam();

  return (
    <PublicLayout>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Cabinet Municipal Jeune</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'équipe dirigeante de la Mairie des Jeunes de Covè.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers?.map((member) => (
              <Card key={member.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] relative bg-muted">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.fullName} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                      <span className="text-4xl font-bold">{member.fullName.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-serif mb-1">{member.fullName}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  {member.bio && <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{member.bio}</p>}
                  
                  <div className="flex gap-3">
                    {member.facebookUrl && (
                      <a href={member.facebookUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook size={18} />
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                        <Mail size={18} />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
