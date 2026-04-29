import { useSEO } from "@/hooks/use-seo";
import { useListNews } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function News() {
  useSEO({ title: "Actualités" });
  const { data: newsArticles, isLoading } = useListNews();

  const publishedNews = newsArticles?.filter(n => n.published) || [];

  return (
    <PublicLayout>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Actualités</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Restez informés des dernières activités et décisions de la Mairie des Jeunes.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : publishedNews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Aucune actualité trouvée.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedNews.map((news) => (
              <Card key={news.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow border-none shadow-md">
                <div className="aspect-[16/10] relative bg-muted group">
                  {news.coverImageUrl ? (
                    <img src={news.coverImageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <span className="font-medium">Sans image</span>
                    </div>
                  )}
                  {news.category && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white border-none shadow-sm">{news.category}</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {news.publishedAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{format(new Date(news.publishedAt), 'd MMM yyyy', { locale: fr })}</span>
                      </div>
                    )}
                    {news.author && (
                      <div className="flex items-center gap-1.5">
                        <User size={14} />
                        <span>{news.author}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold font-serif mb-3 line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/actualites/${news.id}`}>{news.title}</Link>
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">{news.excerpt}</p>
                  
                  <Link href={`/actualites/${news.id}`} className="mt-auto inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors group w-fit">
                    Lire la suite <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
