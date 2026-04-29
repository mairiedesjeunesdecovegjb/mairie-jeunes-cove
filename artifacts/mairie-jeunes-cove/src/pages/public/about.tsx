import { useSEO } from "@/hooks/use-seo";
import { useGetPage } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";

export default function About() {
  const { data: page, isLoading } = useGetPage("a-propos");

  useSEO({
    title: page?.seoTitle || page?.title || "À propos",
    description: page?.seoDescription
  });

  return (
    <PublicLayout>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">Chargement...</div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold font-serif mb-6">{page?.heading || page?.title}</h1>
          {page?.subheading && <p className="text-xl text-muted-foreground mb-8">{page.subheading}</p>}
          {page?.heroImageUrl && (
            <img src={page.heroImageUrl} alt={page.title} className="w-full h-auto rounded-xl mb-12 shadow-lg object-cover max-h-[500px]" />
          )}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page?.body || "" }} />
        </div>
      )}
    </PublicLayout>
  );
}
