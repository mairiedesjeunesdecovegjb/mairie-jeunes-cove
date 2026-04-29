import { useListHeroSlides, useCreateHeroSlide, useUpdateHeroSlide, useDeleteHeroSlide, getListHeroSlidesQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const slideSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  imageUrl: z.string().min(1, "L'URL de l'image est requise"),
  sortOrder: z.number().int(),
  active: z.boolean(),
});

type SlideFormValues = z.infer<typeof slideSchema>;

export default function HeroSlides() {
  const queryClient = useQueryClient();
  const { data: slides, isLoading } = useListHeroSlides();
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();
  
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SlideFormValues>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      ctaLabel: "",
      ctaUrl: "",
      imageUrl: "",
      sortOrder: 0,
      active: true,
    },
  });

  const handleOpenDialog = (slide?: any) => {
    if (slide) {
      setEditingSlide(slide);
      form.reset({
        title: slide.title,
        subtitle: slide.subtitle || "",
        ctaLabel: slide.ctaLabel || "",
        ctaUrl: slide.ctaUrl || "",
        imageUrl: slide.imageUrl,
        sortOrder: slide.sortOrder,
        active: slide.active,
      });
    } else {
      setEditingSlide(null);
      form.reset({
        title: "",
        subtitle: "",
        ctaLabel: "",
        ctaUrl: "",
        imageUrl: "",
        sortOrder: slides ? slides.length : 0,
        active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: SlideFormValues) => {
    if (editingSlide) {
      updateSlide.mutate(
        { id: editingSlide.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListHeroSlidesQueryKey() });
            toast.success("Slide mis à jour avec succès");
            setIsDialogOpen(false);
          },
          onError: () => toast.error("Erreur lors de la mise à jour"),
        }
      );
    } else {
      createSlide.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListHeroSlidesQueryKey() });
            toast.success("Slide créé avec succès");
            setIsDialogOpen(false);
          },
          onError: () => toast.error("Erreur lors de la création"),
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce slide ?")) {
      deleteSlide.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListHeroSlidesQueryKey() });
            toast.success("Slide supprimé avec succès");
          },
          onError: () => toast.error("Erreur lors de la suppression"),
        }
      );
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-serif">Hero Slider</h1>
          <p className="text-muted-foreground">Gérez les images et textes du diaporama d'accueil.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Nouveau Slide</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlide ? "Modifier le slide" : "Nouveau slide"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>Titre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="subtitle" render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>Sous-titre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>URL de l'image</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ctaLabel" render={({ field }) => (
                    <FormItem><FormLabel>Texte du bouton</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ctaUrl" render={({ field }) => (
                    <FormItem><FormLabel>Lien du bouton</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="sortOrder" render={({ field }) => (
                    <FormItem><FormLabel>Ordre</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="active" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5"><FormLabel className="text-base">Actif</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createSlide.isPending || updateSlide.isPending}>
                    {createSlide.isPending || updateSlide.isPending ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
            ) : slides?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun slide trouvé</TableCell></TableRow>
            ) : (
              slides?.sort((a,b) => a.sortOrder - b.sortOrder).map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                      <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{slide.title}</TableCell>
                  <TableCell>{slide.sortOrder}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${slide.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {slide.active ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(slide)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(slide.id)}><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
