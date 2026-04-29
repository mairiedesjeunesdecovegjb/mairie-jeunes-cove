import { useListPartners, useCreatePartner, useUpdatePartner, useDeletePartner, getListPartnersQueryKey } from "@workspace/api-client-react";
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
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number().int(),
});

export default function PartnersAdmin() {
  const queryClient = useQueryClient();
  const { data: items } = useListPartners();
  const createItem = useCreatePartner();
  const updateItem = useUpdatePartner();
  const deleteItem = useDeletePartner();
  
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
      form.reset({ name: "", logoUrl: "", websiteUrl: "", description: "", sortOrder: items ? items.length : 0 });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPartnersQueryKey() }); toast.success("Enregistré"); setIsDialogOpen(false); }
      });
    } else {
      createItem.mutate({ data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPartnersQueryKey() }); toast.success("Créé"); setIsDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Partenaires</h1>
        <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Nouveau</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Modifier" : "Nouveau"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nom *</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="logoUrl" render={({ field }) => (
                <FormItem><FormLabel>Logo URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                <FormItem><FormLabel>Site Web</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="sortOrder" render={({ field }) => (
                <FormItem><FormLabel>Ordre</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
              )} />
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nom</TableHead><TableHead>Site Web</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {items?.sort((a,b) => a.sortOrder - b.sortOrder).map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                    {item.logoUrl && <img src={item.logoUrl} alt="" className="max-w-full max-h-full object-contain" />}
                  </div>
                  {item.name}
                </TableCell>
                <TableCell>{item.websiteUrl}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm("Supprimer ?")) deleteItem.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPartnersQueryKey() }) });
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
