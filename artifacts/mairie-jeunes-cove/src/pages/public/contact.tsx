import { useSEO } from "@/hooks/use-seo";
import { useGetSettings, useSubmitContact } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const contactSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Le sujet est requis"),
  message: z.string().min(10, "Le message est trop court"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  useSEO({ title: "Contact" });
  const { data: settings } = useGetSettings();
  const submitContact = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate({ data }, {
      onSuccess: () => {
        toast.success("Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.");
        form.reset();
      },
      onError: () => {
        toast.error("Une erreur est survenue lors de l'envoi du message.");
      }
    });
  };

  const whatsappDigits = settings?.whatsappNumber?.replace(/[^0-9]/g, "") || "";

  const socials = [
    { url: settings?.facebookUrl, label: "Facebook", Icon: Facebook },
    { url: settings?.twitterUrl, label: "Twitter / X", Icon: Twitter },
    { url: settings?.instagramUrl, label: "Instagram", Icon: Instagram },
    { url: settings?.linkedinUrl, label: "LinkedIn", Icon: Linkedin },
    { url: settings?.youtubeUrl, label: "YouTube", Icon: Youtube },
  ].filter((s) => !!s.url);

  return (
    <PublicLayout>
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Contactez-nous</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nous sommes à votre écoute pour toute question, suggestion ou partenariat.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-serif mb-6">Nos coordonnées</h2>
              <div className="space-y-5">
                {settings?.contactAddress && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Adresse</h3>
                      <p className="text-muted-foreground">{settings.contactAddress}</p>
                    </div>
                  </div>
                )}

                {settings?.contactPhone && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <Phone size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                      <a
                        href={`tel:${settings.contactPhone}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {settings.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {whatsappDigits && (
                  <div className="flex items-start gap-4">
                    <div className="bg-[#25D366]/10 p-3 rounded-full text-[#25D366] shrink-0">
                      <MessageCircle size={22} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground mb-3">{settings?.whatsappNumber}</p>
                      <Button
                        asChild
                        className="bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full"
                      >
                        <a
                          href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                            `Bonjour, je vous contacte depuis le site de la ${settings?.siteName || "Mairie des Jeunes de Covè"}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" /> Discuter sur WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {settings?.contactEmail && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="text-muted-foreground hover:text-primary transition-colors break-all"
                      >
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Horaires d'ouverture</h3>
                    <p className="text-muted-foreground">Lundi – Vendredi : 8h00 – 17h00</p>
                    <p className="text-muted-foreground">Samedi : 8h00 – 12h00</p>
                  </div>
                </div>

                {socials.length > 0 && (
                  <div className="pt-2">
                    <h3 className="font-bold text-lg mb-3">Suivez-nous</h3>
                    <div className="flex flex-wrap gap-3">
                      {socials.map(({ url, label, Icon }) => (
                        <a
                          key={label}
                          href={url!}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-3 rounded-full transition-colors"
                        >
                          <Icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted rounded-xl overflow-hidden h-64 relative border border-border/50">
              <div className="absolute inset-0 bg-blue-50">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '30px 30px' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <MapPin size={48} className="text-primary drop-shadow-md" />
                  <div className="bg-white px-4 py-2 rounded-md shadow-md mt-2 font-medium text-sm">
                    {settings?.siteName || "Mairie des Jeunes"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold font-serif mb-6">Envoyez-nous un message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Nom complet *</Label>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Email *</Label>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Téléphone</Label>
                          <FormControl>
                            <Input placeholder="Votre numéro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Sujet *</Label>
                        <FormControl>
                          <Input placeholder="Sujet de votre message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Message *</Label>
                        <FormControl>
                          <Textarea placeholder="Comment pouvons-nous vous aider ?" className="min-h-[150px] resize-y" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full" disabled={submitContact.isPending}>
                    {submitContact.isPending ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
