import { useListContactMessages, useDeleteContactMessage, getListContactMessagesQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ContactsAdmin() {
  const queryClient = useQueryClient();
  const { data: items } = useListContactMessages();
  const deleteItem = useDeleteContactMessage();
  
  const [viewingItem, setViewingItem] = useState<any | null>(null);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Messages de contact</h1>
      </div>

      <Dialog open={!!viewingItem} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Message de {viewingItem?.fullName}</DialogTitle></DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Date:</span> {format(new Date(viewingItem.createdAt), 'dd MMMM yyyy HH:mm', { locale: fr })}</div>
                <div><span className="text-muted-foreground">Email:</span> {viewingItem.email}</div>
                <div><span className="text-muted-foreground">Tél:</span> {viewingItem.phone || "-"}</div>
              </div>
              <div className="border-t pt-4">
                <div className="font-bold mb-2">Sujet : {viewingItem.subject}</div>
                <p className="whitespace-pre-wrap text-sm">{viewingItem.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Date</TableHead><TableHead>Expéditeur</TableHead><TableHead>Sujet</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id} className={!item.read ? "bg-muted/30 font-medium" : ""}>
                <TableCell>{format(new Date(item.createdAt), 'dd/MM/yy HH:mm')}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setViewingItem(item)}><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm("Supprimer ?")) deleteItem.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListContactMessagesQueryKey() }) });
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
