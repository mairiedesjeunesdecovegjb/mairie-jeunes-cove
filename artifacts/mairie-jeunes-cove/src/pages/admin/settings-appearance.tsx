import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  footerText: z.string().optional(),
});

export default function SettingsAppearance() {
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
        <h1 className="text-2xl font-bold">Apparence</h1>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Logos</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="logoUrl" render={({ field }) => (
                  <FormItem><FormLabel>Logo Principal (URL)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="faviconUrl" render={({ field }) => (
                  <FormItem><FormLabel>Favicon (URL)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Couleurs (Format Hex #RRGGBB ou HSL)</h2>
              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="primaryColor" render={({ field }) => (
                  <FormItem><FormLabel>Couleur Primaire</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="secondaryColor" render={({ field }) => (
                  <FormItem><FormLabel>Couleur Secondaire</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="accentColor" render={({ field }) => (
                  <FormItem><FormLabel>Couleur d'accent</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Réseaux Sociaux</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                  <FormItem><FormLabel>Facebook</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                  <FormItem><FormLabel>Twitter / X</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="instagramUrl" render={({ field }) => (
                  <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                  <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="youtubeUrl" render={({ field }) => (
                  <FormItem><FormLabel>YouTube</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="tiktokUrl" render={({ field }) => (
                  <FormItem><FormLabel>TikTok</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-bold mb-4 border-b pb-2">Pied de page</h2>
              <FormField control={form.control} name="footerText" render={({ field }) => (
                <FormItem><FormLabel>Texte copyright</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
            </div>

            <Button type="submit" size="lg">Sauvegarder</Button>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
