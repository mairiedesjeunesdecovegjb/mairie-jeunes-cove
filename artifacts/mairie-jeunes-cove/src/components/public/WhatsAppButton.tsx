import { useGetSettings } from "@workspace/api-client-react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const { data: settings } = useGetSettings();
  const number = settings?.whatsappNumber?.replace(/[^0-9]/g, "");
  if (!number) return null;

  const message = encodeURIComponent(
    `Bonjour, je vous contacte depuis le site de la ${settings?.siteName || "Mairie des Jeunes de Covè"}.`
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-2xl transition-all duration-300 px-4 py-3 md:px-5 md:py-4"
    >
      <MessageCircle size={22} className="shrink-0" />
      <span className="hidden md:inline font-semibold text-sm whitespace-nowrap max-w-0 group-hover:max-w-xs overflow-hidden transition-[max-width] duration-500">
        Discuter sur WhatsApp
      </span>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
}
