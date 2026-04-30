import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function parseImageList(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function ImageGallery({ images, title }: { images: string[]; title?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!images.length) return null;

  const close = () => setOpenIndex(null);
  const prev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));

  return (
    <div>
      {title && <h3 className="text-2xl font-bold font-serif mb-4">{title}</h3>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted group focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X size={28} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Précédent"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                type="button"
                aria-label="Suivant"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img
            src={images[openIndex]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-md shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
