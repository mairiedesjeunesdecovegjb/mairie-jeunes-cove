import { useListTeam, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember, getListTeamQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const memberSchema = z.object({
  fullName: z.string().min(1, "Le nom est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int(),
});

export default function Team() {
  const queryClient = useQueryClient();
  const { data: members, isLoading } = useListTeam();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
  
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: { fullName: "", role: "", bio: "", photoUrl: "", email: "", phone: "", facebookUrl: "", linkedinUrl: "", sortOrder: 0 },
  });

  const handleOpenDialog = (member?: any) => {
    if (member) {
      setEditingMember(member);
      form.reset({ ...member, email: member.email || "", facebookUrl: member.facebookUrl || "", linkedinUrl: member.linkedinUrl || "", bio: member.bio || "", photoUrl: member.photoUrl || "", phone: member.phone || "" });
    } else {
      setEditingMember(null);
      form.reset({ fullName: "", role: "", bio: "", photoUrl: "", email: "", phone: "", facebookUrl: "", linkedinUrl: "", sortOrder: members ? members.length : 0 });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof memberSchema>) => {
    const payload = { ...data, email: data.email || undefined, facebookUrl: data.facebookUrl || undefined, linkedinUrl: data.linkedinUrl || undefined };
    if (editingMember) {
      updateMember.mutate({ id: editingMember.id, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTeamQueryKey() }); toast.success("Membre mis à jour"); setIsDialogOpen(false); }
      });
    } else {
      createMember.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTeamQueryKey() }); toast.success("Membre ajouté"); setIsDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-serif">Cabinet Municipal</h1>
        </div>
        <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Nouveau Membre</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingMember ? "Modifier le membre" : "Nouveau membre"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem><FormLabel>Nom complet</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>Rôle / Fonction</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="photoUrl" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>URL de la photo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                  <FormItem><FormLabel>URL Facebook</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                  <FormItem><FormLabel>URL LinkedIn</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sortOrder" render={({ field }) => (
                  <FormItem><FormLabel>Ordre</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Biographie</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
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
            <TableRow>
              <TableHead>Membre</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.sort((a,b) => a.sortOrder - b.sortOrder).map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                    {member.photoUrl && <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  {member.fullName}
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(member)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm("Supprimer ?")) deleteMember.mutate({ id: member.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListTeamQueryKey() }) });
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
