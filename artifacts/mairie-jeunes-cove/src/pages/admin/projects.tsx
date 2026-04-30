import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  category: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
  imageUrl: z.string().optional(),
  extraImages: z.string().optional(),
  status: z.enum(["planned", "ongoing", "completed"]),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  location: z.string().optional(),
  budget: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  featured: z.boolean().optional(),
});

export default function ProjectsAdmin() {
  const queryClient = useQueryClient();
  const { data: projects } = useListProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: "planned", featured: false, progress: 0 },
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      form.reset({ ...item, body: item.body || "", description: item.description || "", startDate: item.startDate || "", endDate: item.endDate || "", progress: item.progress || 0, extraImages: item.extraImages || "" });
    } else {
      setEditingItem(null);
      form.reset({ title: "", category: "", description: "", body: "", imageUrl: "", extraImages: "", status: "planned", startDate: "", endDate: "", location: "", budget: "", progress: 0, featured: false });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof projectSchema>) => {
    const payload = { ...data, startDate: data.startDate || undefined, endDate: data.endDate || undefined };
    if (editingItem) {
      updateProject.mutate({ id: editingItem.id, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); toast.success("Projet mis à jour"); setIsDialogOpen(false); }
      });
    } else {
      createProject.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); toast.success("Projet créé"); setIsDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-serif">Projets</h1>
        <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Nouveau Projet</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingItem ? "Modifier" : "Nouveau"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Titre</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="planned">À venir</SelectItem>
                        <SelectItem value="ongoing">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Image principale (URL)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="extraImages" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Images supplémentaires (galerie)</FormLabel>
                    <FormControl><Textarea placeholder="Une URL d'image par ligne" className="h-24 font-mono text-xs" {...field} /></FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Collez plusieurs URLs d'images, une par ligne.</p>
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Résumé</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="progress" render={({ field }) => (
                  <FormItem><FormLabel>Progression (%)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Lieu</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem><FormLabel>Date de début</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="budget" render={({ field }) => (
                  <FormItem><FormLabel>Budget</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="body" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Contenu détaillé (HTML accepté)</FormLabel><FormControl><Textarea className="h-32" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
                    <FormLabel>Mettre en avant</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
              </div>
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Titre</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm("Supprimer ?")) deleteProject.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }) });
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
