import { useListPages, useUpdatePage, getListPagesQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
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

export default function PagesAdmin() {
  const queryClient = useQueryClient();
  const { data: items } = useListPages();
  const updateItem = useUpdatePage();
  
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleOpenDialog = (item: any) => {
    setEditingItem(item);
    form.reset({ 
      title: item.title || "", 
      heading: item.heading || "", 
      subheading: item.subheading || "", 
      body: item.body || "", 
      heroImageUrl: item.heroImageUrl || "", 
      seoTitle: item.seoTitle || "", 
      seoDescription: item.seoDescription || "" 
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (editingItem) {
      updateItem.mutate({ slug: editingItem.slug, data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPagesQueryKey() }); toast.success("Enregistré"); setIsDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Pages & SEO</h1>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Modifier: {editingItem?.slug}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Titre (Interne)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
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
                <FormItem><FormLabel>Contenu (HTML)</FormLabel><FormControl><Textarea className="h-64" {...field} /></FormControl></FormItem>
              )} />
              <div className="pt-4 border-t mt-4">
                <h3 className="font-bold mb-4">SEO</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="seoTitle" render={({ field }) => (
                    <FormItem><FormLabel>Balise Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="seoDescription" render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>Meta Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </div>
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Slug</TableHead><TableHead>Titre</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.slug}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}><Edit className="w-4 h-4 mr-2" /> Éditer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
