import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  whatsappNumber: z.string().optional(),
  mayorName: z.string().optional(),
  mayorTitle: z.string().optional(),
  mayorMessage: z.string().optional(),
  mayorPhotoUrl: z.string().optional(),
  statYouthCount: z.number().optional(),
  statActivitiesCount: z.number().optional(),
  statProjectsCount: z.number().optional(),
  statPartnersCount: z.number().optional(),
  statYouthLabel: z.string().optional(),
  statActivitiesLabel: z.string().optional(),
  statProjectsLabel: z.string().optional(),
  statPartnersLabel: z.string().optional(),
  designerName: z.string().optional(),
  designerUrl: z.string().optional(),
  footerText: z.string().optional(),
});

export default function SettingsIdentity() {
  const queryClient = useQueryClient();
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateSettings.mutate({ data }, {
      onSuccess: () => { 
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }); 
        toast.success("Paramètres mis à jour"); 
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Identité & Statistiques</h1>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Général</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="siteName" render={({ field }) => (
                  <FormItem><FormLabel>Nom du site</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="tagline" render={({ field }) => (
                  <FormItem><FormLabel>Slogan</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="contactEmail" render={({ field }) => (
                  <FormItem><FormLabel>Email Contact</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="contactPhone" render={({ field }) => (
                  <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                  <FormItem><FormLabel>Numéro WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="contactAddress" render={({ field }) => (
                  <FormItem><FormLabel>Adresse</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Mot du Maire</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="mayorName" render={({ field }) => (
                  <FormItem><FormLabel>Nom du Maire</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="mayorTitle" render={({ field }) => (
                  <FormItem><FormLabel>Titre du Maire</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="mayorPhotoUrl" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Photo (URL)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="mayorMessage" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Message du Maire</FormLabel><FormControl><Textarea className="h-32" {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Statistiques de la page d'accueil</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField control={form.control} name="statYouthCount" render={({ field }) => (
                  <FormItem><FormLabel>Valeur 1</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="statYouthLabel" render={({ field }) => (
                  <FormItem><FormLabel>Label 1</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="statActivitiesCount" render={({ field }) => (
                  <FormItem><FormLabel>Valeur 2</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="statActivitiesLabel" render={({ field }) => (
                  <FormItem><FormLabel>Label 2</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="statProjectsCount" render={({ field }) => (
                  <FormItem><FormLabel>Valeur 3</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="statProjectsLabel" render={({ field }) => (
                  <FormItem><FormLabel>Label 3</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="statPartnersCount" render={({ field }) => (
                  <FormItem><FormLabel>Valeur 4</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="statPartnersLabel" render={({ field }) => (
                  <FormItem><FormLabel>Label 4</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Pied de page & Concepteur</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="designerName" render={({ field }) => (
                  <FormItem><FormLabel>Nom du concepteur</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="designerUrl" render={({ field }) => (
                  <FormItem><FormLabel>Site du concepteur (URL)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="footerText" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Texte du pied de page</FormLabel><FormControl><Textarea className="h-20" {...field} /></FormControl></FormItem>
                )} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Astuce : le nom du concepteur tel qu'il apparaît dans le texte du pied de page sera transformé en lien cliquable vers le site du concepteur.
              </p>
            </div>

            <Button type="submit" size="lg">Sauvegarder</Button>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
