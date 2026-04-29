import { useChangeAdminPassword } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const schema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "8 caractères minimum"),
  confirmPassword: z.string().min(1, "Veuillez confirmer"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export default function SettingsSecurity() {
  const changePassword = useChangeAdminPassword();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    changePassword.mutate({ data: { currentPassword: data.currentPassword, newPassword: data.newPassword } }, {
      onSuccess: () => { 
        toast.success("Mot de passe mis à jour"); 
        form.reset();
      },
      onError: () => {
        toast.error("Erreur, vérifiez votre mot de passe actuel");
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Sécurité</h1>
      </div>

      <div className="bg-white rounded-xl border p-6 max-w-md">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Changer le mot de passe</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="currentPassword" render={({ field }) => (
              <FormItem><FormLabel>Mot de passe actuel</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage/></FormItem>
            )} />
            <FormField control={form.control} name="newPassword" render={({ field }) => (
              <FormItem><FormLabel>Nouveau mot de passe</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage/></FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem><FormLabel>Confirmer le nouveau mot de passe</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage/></FormItem>
            )} />

            <Button type="submit" className="w-full" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
