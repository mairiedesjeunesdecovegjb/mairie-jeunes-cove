import { useSEO } from "@/hooks/use-seo";
import { useGetNews } from "@workspace/api-client-react";
import { getGetNewsQueryKey } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: news, isLoading } = useGetNews(Number(id), { 
    query: { enabled: !!id, queryKey: getGetNewsQueryKey(Number(id)) } 
  });

  useSEO({ 
    title: news?.title || "Actualité",
    description: news?.excerpt 
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center">Chargement...</div>
      </PublicLayout>
    );
  }

  if (!news) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 text-center">Actualité introuvable</div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/actualites" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Retour aux actualités
        </Link>

        {news.category && (
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
            {news.category}
          </Badge>
        )}

        <h1 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-tight text-foreground">{news.title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-10 pb-8 border-b border-border/50">
          {news.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Publié le {format(new Date(news.publishedAt), 'd MMMM yyyy', { locale: fr })}</span>
            </div>
          )}
          {news.author && (
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Par {news.author}</span>
            </div>
          )}
        </div>

        {news.coverImageUrl && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg bg-muted aspect-video">
            <img src={news.coverImageUrl} alt={news.title} className="w-full h-full object-cover" />
          </div>
        )}

        {news.excerpt && (
          <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed border-l-4 border-primary pl-6">
            {news.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-primary" dangerouslySetInnerHTML={{ __html: news.body || "" }} />
      </div>
    </PublicLayout>
  );
}
