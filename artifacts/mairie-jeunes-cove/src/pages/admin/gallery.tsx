import { useListGallery, useCreateGalleryPhoto, useUpdateGalleryPhoto, useDeleteGalleryPhoto, getListGalleryQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1),
  category: z.string().optional(),
  sortOrder: z.number().int(),
});

export default function GalleryAdmin() {
  const queryClient = useQueryClient();
  const { data: items } = useListGallery();
  const createItem = useCreateGalleryPhoto();
  const updateItem = useUpdateGalleryPhoto();
  const deleteItem = useDeleteGalleryPhoto();
  
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { sortOrder: 0 }
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      form.reset(item);
    } else {
      setEditingItem(null);
      form.reset({ title: "", description: "", imageUrl: "", category: "", sortOrder: items ? items.length : 0 });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() }); toast.success("Enregistré"); setIsDialogOpen(false); }
      });
    } else {
      createItem.mutate({ data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() }); toast.success("Créé"); setIsDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Galerie</h1>
        <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Nouvelle Photo</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Modifier" : "Nouveau"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL *</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Titre</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="sortOrder" render={({ field }) => (
                <FormItem><FormLabel>Ordre</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
              )} />
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items?.sort((a,b) => a.sortOrder - b.sortOrder).map((item) => (
          <div key={item.id} className="relative group rounded-lg overflow-hidden bg-muted aspect-square">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="secondary" size="icon" onClick={() => handleOpenDialog(item)}><Edit className="w-4 h-4" /></Button>
              <Button variant="destructive" size="icon" onClick={() => {
                if (confirm("Supprimer ?")) deleteItem.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() }) });
              }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
