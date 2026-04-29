import { useListOpportunities, useCreateOpportunity, useUpdateOpportunity, useDeleteOpportunity, getListOpportunitiesQueryKey } from "@workspace/api-client-react";
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
  category: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
  imageUrl: z.string().optional(),
  deadline: z.string().optional().or(z.literal("")),
  applyUrl: z.string().optional(),
  location: z.string().optional(),
  organization: z.string().optional(),
  published: z.boolean(),
});

export default function OpportunitiesAdmin() {
  const queryClient = useQueryClient();
  const { data: items } = useListOpportunities();
  const createItem = useCreateOpportunity();
  const updateItem = useUpdateOpportunity();
  const deleteItem = useDeleteOpportunity();
  
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { published: true }
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      form.reset({ ...item, deadline: item.deadline || "" });
    } else {
      setEditingItem(null);
      form.reset({ title: "", published: true, deadline: "" });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    const payload = { ...data, deadline: data.deadline || undefined };
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListOpportunitiesQueryKey() }); toast.success("Enregistré"); setIsDialogOpen(false); }
      });
    } else {
      createItem.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListOpportunitiesQueryKey() }); toast.success("Créé"); setIsDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Opportunités</h1>
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
                <FormField control={form.control} name="organization" render={({ field }) => (
                  <FormItem><FormLabel>Organisation</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="deadline" render={({ field }) => (
                  <FormItem><FormLabel>Date limite</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="applyUrl" render={({ field }) => (
                  <FormItem><FormLabel>Lien pour postuler</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description courte</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
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
            <TableRow><TableHead>Titre</TableHead><TableHead>Organisation</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.organization}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm("Supprimer ?")) deleteItem.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListOpportunitiesQueryKey() }) });
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
