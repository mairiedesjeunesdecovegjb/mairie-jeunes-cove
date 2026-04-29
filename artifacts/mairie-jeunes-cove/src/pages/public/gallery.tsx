import { useSEO } from "@/hooks/use-seo";
import { useListGallery } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Gallery() {
  useSEO({ title: "Galerie" });
  const { data: photos, isLoading } = useListGallery();
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(photos?.map(p => p.category).filter(Boolean) as string[]));
  const filteredPhotos = photos?.filter(p => !filter || p.category === filter) || [];

  return (
    <PublicLayout>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Galerie Photo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revivez en images les moments forts de notre commune.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Badge 
              variant={filter === null ? "default" : "outline"} 
              className="cursor-pointer px-4 py-2 text-sm"
              onClick={() => setFilter(null)}
            >
              Tout
            </Badge>
            {categories.map(cat => (
              <Badge 
                key={cat}
                variant={filter === cat ? "default" : "outline"} 
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Aucune photo trouvée.</div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl bg-muted"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title || "Galerie"} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  {photo.title && <h3 className="font-bold font-serif text-lg">{photo.title}</h3>}
                  {photo.category && <span className="text-sm text-white/80">{photo.category}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/95 border-none">
          {selectedPhoto && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <img 
                src={selectedPhoto.imageUrl} 
                alt={selectedPhoto.title || "Photo"} 
                className="max-w-full max-h-[80vh] object-contain"
              />
              {(selectedPhoto.title || selectedPhoto.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pt-12">
                  {selectedPhoto.title && <h3 className="text-2xl font-bold font-serif mb-2">{selectedPhoto.title}</h3>}
                  {selectedPhoto.description && <p className="text-white/80">{selectedPhoto.description}</p>}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
