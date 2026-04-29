import { useGetPage, useUpdatePage, getGetPageQueryKey } from "@workspace/api-client-react";
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
  title: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  body: z.string().optional(),
  heroImageUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export default function AdminHomePage() {
  const queryClient = useQueryClient();
  const slug = "accueil";
  const { data: page, isLoading } = useGetPage(slug, {
    query: { enabled: true, queryKey: getGetPageQueryKey(slug) }
  });
  const updatePage = useUpdatePage();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (page) {
      form.reset({
        title: page.title || "",
        heading: page.heading || "",
        subheading: page.subheading || "",
        body: page.body || "",
        heroImageUrl: page.heroImageUrl || "",
        seoTitle: page.seoTitle || "",
        seoDescription: page.seoDescription || "",
      });
    }
  }, [page, form]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    updatePage.mutate({ slug, data }, {
      onSuccess: () => { 
        queryClient.invalidateQueries({ queryKey: getGetPageQueryKey(slug) }); 
        toast.success("Page d'accueil mise à jour"); 
      }
    });
  };

  if (isLoading) {
    return <AdminLayout><div className="py-12 text-center">Chargement...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Édition de la page d'accueil</h1>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Titre interne</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="heading" render={({ field }) => (
                <FormItem><FormLabel>Titre principal (H1)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="subheading" render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Sous-titre</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="heroImageUrl" render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Image Hero (URL)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
            </div>
            
            <FormField control={form.control} name="body" render={({ field }) => (
              <FormItem><FormLabel>Contenu supplémentaire (HTML)</FormLabel><FormControl><Textarea className="h-48" {...field} /></FormControl></FormItem>
            )} />
            
            <div className="pt-4 border-t">
              <h3 className="font-bold mb-4">SEO de la page d'accueil</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="seoTitle" render={({ field }) => (
                  <FormItem><FormLabel>Titre SEO (balise Title)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="seoDescription" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Meta Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>

            <Button type="submit" size="lg" disabled={updatePage.isPending}>
              {updatePage.isPending ? "Sauvegarde..." : "Sauvegarder les modifications"}
            </Button>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
