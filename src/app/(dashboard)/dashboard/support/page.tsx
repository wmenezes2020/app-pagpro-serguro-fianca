"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateSupportTicketPayload,
  UpdateSupportTicketPayload,
  createTicket,
  listTickets,
  updateTicket,
} from "@/services/support-service";
import { useAuthStore } from "@/store/auth-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ticketStatusLabels, statusVariant } from "@/utils/status";
import { TicketStatus } from "@/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { formatDate } from "@/lib/utils";

type TicketFormValues = {
  subject: string;
  message: string;
};

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "OPEN", label: ticketStatusLabels.OPEN },
  { value: "IN_PROGRESS", label: ticketStatusLabels.IN_PROGRESS },
  { value: "RESOLVED", label: ticketStatusLabels.RESOLVED },
  { value: "CLOSED", label: ticketStatusLabels.CLOSED },
];

export default function SupportPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const form = useForm<TicketFormValues>({
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["support", "tickets"],
    queryFn: listTickets,
  });

  const { mutateAsync: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (payload: CreateSupportTicketPayload) => createTicket(payload),
    onSuccess: () => {
      toast.success("Chamado aberto com sucesso. Nossa equipe retornará em breve.");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
    },
    onError: () => {
      toast.error("Não foi possível abrir o chamado.");
    },
  });

  const { mutateAsync: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
    } & UpdateSupportTicketPayload) => updateTicket(id, payload),
    onSuccess: () => {
      toast.success("Chamado atualizado.");
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
    },
    onError: () => {
      toast.error("Não foi possível atualizar o chamado.");
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  const onSubmit = async (values: TicketFormValues) => {
    await mutateCreate(values);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Abrir chamado de suporte</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Ex: Atualização de status de apólice"
                {...form.register("subject", { required: true })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Descreva sua solicitação ou dúvida com detalhes."
                {...form.register("message", { required: true })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" loading={isCreating}>
                Enviar chamado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Chamados recentes</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chamado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aberto em</TableHead>
                <TableHead>Responsável</TableHead>
                {user?.role === "ADMIN" ? (
                  <TableHead className="text-right">Gerenciar</TableHead>
                ) : (
                  <TableHead className="text-right">Atualização</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {ticket.subject}
                    </span>
                    <p className="mt-1 text-xs text-slate-500">
                      {ticket.message.split("\n").slice(0, 2).join(" ")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(ticket.status)}>
                      {ticketStatusLabels[ticket.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(ticket.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {ticket.assignedTo?.fullName ?? "Equipe PagPro"}
                  </TableCell>
                  <TableCell className="text-right">
                    {user?.role === "ADMIN" ? (
                      <Select
                        value={ticket.status}
                        onChange={(event) =>
                          mutateUpdate({
                            id: ticket.id,
                            status: event.target.value as TicketStatus,
                          })
                        }
                        options={statusOptions}
                        className="w-40"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">
                        Acompanhe o retorno por e-mail.
                      </span>
                    )}
                    {isUpdating ? (
                      <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Nenhum chamado aberto. Utilize o formulário acima para falar
                    com nosso time.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

