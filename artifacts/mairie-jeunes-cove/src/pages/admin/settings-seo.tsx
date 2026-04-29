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
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

export default function SettingsSEO() {
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
        <h1 className="text-2xl font-bold">SEO Global</h1>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="seoTitle" render={({ field }) => (
              <FormItem><FormLabel>Titre SEO (Title tag global)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="seoDescription" render={({ field }) => (
              <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="seoKeywords" render={({ field }) => (
              <FormItem><FormLabel>Mots clés (séparés par des virgules)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="ogImageUrl" render={({ field }) => (
              <FormItem><FormLabel>Image par défaut pour le partage social (OG Image)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />

            <Button type="submit" size="lg">Sauvegarder</Button>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
