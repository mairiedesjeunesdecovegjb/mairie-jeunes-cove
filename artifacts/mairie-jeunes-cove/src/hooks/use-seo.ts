import { useEffect } from "react";
import { useGetSettings } from "@workspace/api-client-react";

interface UseSEOProps {
  title?: string;
  description?: string;
}

export function useSEO({ title, description }: UseSEOProps = {}) {
  const { data: settings } = useGetSettings();

  useEffect(() => {
    if (!settings) return;

    const baseTitle = settings.seoTitle || settings.siteName || "Mairie des Jeunes de Covè";
    const finalTitle = title ? `${title} — ${baseTitle}` : baseTitle;
    document.title = finalTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    const finalDescription = description || settings.seoDescription || "";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", finalDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = finalDescription;
      document.head.appendChild(meta);
    }
  }, [title, description, settings]);
}
