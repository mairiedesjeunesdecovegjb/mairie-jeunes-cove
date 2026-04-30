import { useListNews, useCreateNews, useUpdateNews, useDeleteNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  coverImageUrl: z.string().optional(),
  extraImages: z.string().optional(),
  category: z.string().optional(),
  published: z.boolean(),
});

export default function NewsAdmin() {
  const queryClient = useQueryClient();
  const { data: items } = useListNews();
  const createItem = useCreateNews();
  const updateItem = useUpdateNews();
  const deleteItem = useDeleteNews();
  
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { published: true },
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      form.reset({ ...item, body: item.body || "", excerpt: item.excerpt || "", extraImages: item.extraImages || "" });
    } else {
      setEditingItem(null);
      form.reset({ title: "", excerpt: "", body: "", coverImageUrl: "", extraImages: "", category: "", published: true });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() }); toast.success("Enregistré"); setIsDialogOpen(false); }
      });
    } else {
      createItem.mutate({ data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() }); toast.success("Créé"); setIsDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Actualités</h1>
        <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Nouveau</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingItem ? "Modifier" : "Nouveau"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Titre</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="coverImageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="extraImages" render={({ field }) => (
                <FormItem>
                  <FormLabel>Images supplémentaires (galerie)</FormLabel>
                  <FormControl><Textarea placeholder="Une URL d'image par ligne" className="h-24 font-mono text-xs" {...field} /></FormControl>
                  <p className="text-xs text-muted-foreground mt-1">Collez plusieurs URLs d'images, une par ligne.</p>
                </FormItem>
              )} />
              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem><FormLabel>Extrait</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="body" render={({ field }) => (
                <FormItem><FormLabel>Contenu (HTML)</FormLabel><FormControl><Textarea className="h-48" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <FormLabel>Publié</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Titre</TableHead><TableHead>Publié</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.published ? "Oui" : "Non"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm("Supprimer ?")) deleteItem.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() }) });
                  }}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
