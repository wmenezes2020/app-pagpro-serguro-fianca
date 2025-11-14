"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProperty,
  listProperties,
  removeProperty,
} from "@/services/properties-service";
import { useAuthStore } from "@/store/auth-store";
import { PropertyStatus } from "@/types";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import { LoadingScreen } from "@/components/layout/loading-screen";

const statusOptions: { label: string; value: PropertyStatus }[] = [
  { label: "Disponível", value: "AVAILABLE" },
  { label: "Reservado", value: "RESERVED" },
  { label: "Alugado", value: "RENTED" },
];

type PropertyFormValues = {
  title: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  rentValue: number;
  status: PropertyStatus;
  description?: string;
};

export default function PropertiesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const form = useForm<PropertyFormValues>({
    defaultValues: {
      title: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      rentValue: 0,
      status: "AVAILABLE",
      description: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: listProperties,
  });

  const statusValue =
    useWatch({ control: form.control, name: "status" }) ?? "AVAILABLE";

  const { mutateAsync: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      toast.success("Imóvel cadastrado com sucesso.");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: () => {
      toast.error("Não foi possível cadastrar o imóvel.");
    },
  });

  const { mutateAsync: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: removeProperty,
    onSuccess: () => {
      toast.success("Imóvel removido.");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: () => {
      toast.error("Não foi possível remover o imóvel.");
    },
  });

  if (user?.role !== "IMOBILIARIA" && user?.role !== "ADMIN") {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-10 text-center text-sm text-slate-600">
          Apenas perfis de imobiliária ou administradores podem gerenciar
          imóveis.
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  const onSubmit = async (values: PropertyFormValues) => {
    await mutateCreate({
      ...values,
      amenities: {},
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Cadastrar novo imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...form.register("title", { required: true })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                {...form.register("address", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...form.register("city", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" {...form.register("state", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP</Label>
              <Input
                id="postalCode"
                {...form.register("postalCode", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rentValue">Aluguel mensal</Label>
              <Input
                id="rentValue"
                type="number"
                step="0.01"
                {...form.register("rentValue", {
                  valueAsNumber: true,
                  required: true,
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onChange={(event) =>
                  form.setValue("status", event.target.value as PropertyStatus)
                }
                options={statusOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Características, pontos fortes, diferenciais"
                {...form.register("description")}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" loading={isCreating}>
                Cadastrar imóvel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Imóveis cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Aluguel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <span className="font-semibold text-slate-900">
                      {property.title}
                    </span>
                    <p className="text-xs text-slate-500">{property.address}</p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {property.city} · {property.state}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-slate-900">
                    {formatCurrency(property.rentValue)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {
                        statusOptions.find(
                          (opt) => opt.value === property.status,
                        )?.label ?? property.status
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      loading={isDeleting}
                      onClick={() => mutateDelete(property.id)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Nenhum imóvel cadastrado até o momento.
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

