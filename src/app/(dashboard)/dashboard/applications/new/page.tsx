"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { createApplication } from "@/services/applications-service";
import { listProperties } from "@/services/properties-service";
import { listUsers, createInquilino, CreateInquilinoPayload } from "@/services/users-service";
import { uploadApplicationDocument } from "@/services/documents-service";
import { useAuthStore } from "@/store/auth-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { Upload, X, FileText, Plus } from "lucide-react";

type ApplicationFormValues = {
  propertyId: string;
  applicantId?: string;
  brokerId?: string;
  monthlyIncome: number;
  monthlyRentValue?: number;
  contractType?: "COMERCIAL" | "RESIDENCIAL";
  tenantType?: "PF" | "PJ";
  hasNegativeRecords: boolean;
  employmentStatus?: string;
  notes?: string;
};

interface DocumentFile {
  file: File;
  description?: string;
}

export default function NewApplicationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authState = useAuthStore();
  const isTenant = authState.user?.role === "INQUILINO";
  const isBroker = authState.user?.role === "CORRETOR";
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [documentDescriptions, setDocumentDescriptions] = useState<Record<number, string>>({});
  const [showNewTenantForm, setShowNewTenantForm] = useState(false);
  const [newTenantData, setNewTenantData] = useState<Partial<CreateInquilinoPayload>>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    cpf: "",
    monthlyIncome: 0,
    employmentStatus: "",
  });

  const form = useForm<ApplicationFormValues>({
    defaultValues: {
      propertyId: "",
      applicantId: isTenant ? authState.user?.id : "",
      brokerId: isBroker ? authState.user?.id : "",
      monthlyIncome: 0,
      monthlyRentValue: undefined,
      contractType: undefined,
      tenantType: undefined,
      hasNegativeRecords: false,
      employmentStatus: "",
      notes: "",
    },
  });

  const propertyId = useWatch({
    control: form.control,
    name: "propertyId",
  }) ?? "";
  const applicantId = useWatch({
    control: form.control,
    name: "applicantId",
  }) ?? "";
  const brokerId = useWatch({
    control: form.control,
    name: "brokerId",
  }) ?? "";
  const hasNegativeRecords =
    useWatch({
      control: form.control,
      name: "hasNegativeRecords",
    }) ?? false;

  const { data: properties, isLoading: loadingProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: listProperties,
  });

  const { data: tenants } = useQuery({
    queryKey: ["users", "tenants"],
    queryFn: () => listUsers("INQUILINO"),
    enabled: !isTenant,
  });

  const { data: brokers } = useQuery({
    queryKey: ["users", "brokers"],
    queryFn: () => listUsers("CORRETOR"),
    enabled: !isBroker,
  });

  const { mutateAsync: createApp, isPending: isCreating } = useMutation({
    mutationFn: createApplication,
    onError: () => {
      toast.error("Não foi possível criar a solicitação.");
    },
  });

  const { mutateAsync: uploadDoc, isPending: isUploading } = useMutation({
    mutationFn: ({ applicationId, payload }: { applicationId: string; payload: { file: File; description?: string } }) =>
      uploadApplicationDocument(applicationId, payload),
    onError: () => {
      toast.error("Erro ao enviar documento.");
    },
  });

  const { mutateAsync: createTenant, isPending: isCreatingTenant } = useMutation({
    mutationFn: createInquilino,
    onSuccess: (newTenant) => {
      toast.success("Inquilino cadastrado com sucesso!");
      form.setValue("applicantId", newTenant.id);
      setShowNewTenantForm(false);
      setNewTenantData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        cpf: "",
        monthlyIncome: 0,
        employmentStatus: "",
      });
      queryClient.invalidateQueries({ queryKey: ["users", "tenants"] });
    },
    onError: () => {
      toast.error("Erro ao cadastrar inquilino.");
    },
  });

  const isPending = isCreating || isUploading || isCreatingTenant;

  if (loadingProperties) {
    return <LoadingScreen />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map((file) => ({ file, description: "" }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
    const newDescriptions = { ...documentDescriptions };
    delete newDescriptions[index];
    setDocumentDescriptions(newDescriptions);
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    try {
      // Criar aplicação
      const application = await createApp({
        ...values,
        applicantId: isTenant ? authState.user?.id : values.applicantId,
        brokerId: isBroker ? authState.user?.id : values.brokerId,
        documents: undefined,
      });

      // Upload de documentos se houver
      if (documents.length > 0) {
        const uploadPromises = documents.map((doc, index) =>
          uploadDoc({
            applicationId: application.id,
            payload: {
              file: doc.file,
              description: documentDescriptions[index] || undefined,
            },
          }),
        );
        await Promise.all(uploadPromises);
      }

      toast.success("Solicitação criada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      router.push(`/dashboard/applications/${application.id}`);
    } catch (error) {
      // Erro já tratado no onError do mutation
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Nova solicitação de seguro fiança</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="space-y-2 md:col-span-2">
            <Label>Imóvel</Label>
            <Select
              value={propertyId}
              onChange={(event) => form.setValue("propertyId", event.target.value)}
              options={[
                { value: "", label: "Selecione um imóvel" },
                ...(properties ?? []).map((property) => ({
                  value: property.id,
                  label: `${property.title} · ${property.city}/${property.state}`,
                })),
              ]}
            />
          </div>

          {!isTenant ? (
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Inquilino</Label>
                {!showNewTenantForm && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewTenantForm(true)}
                    className="bg-[#FFD700] text-[#0F2240] hover:bg-[#FFD700]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar novo
                  </Button>
                )}
              </div>
              {showNewTenantForm ? (
                <Card className="border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-[#0F2240]">Novo Inquilino</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNewTenantForm(false);
                          setNewTenantData({
                            fullName: "",
                            email: "",
                            password: "",
                            phone: "",
                            cpf: "",
                            monthlyIncome: 0,
                            employmentStatus: "",
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Nome completo *</Label>
                        <Input
                          value={newTenantData.fullName}
                          onChange={(e) => setNewTenantData({ ...newTenantData, fullName: e.target.value })}
                          placeholder="Nome e sobrenome"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">E-mail *</Label>
                        <Input
                          type="email"
                          value={newTenantData.email}
                          onChange={(e) => setNewTenantData({ ...newTenantData, email: e.target.value })}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">CPF *</Label>
                        <Input
                          value={newTenantData.cpf}
                          onChange={(e) => setNewTenantData({ ...newTenantData, cpf: e.target.value.replace(/\D/g, "") })}
                          placeholder="00000000000"
                          maxLength={11}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Telefone</Label>
                        <Input
                          value={newTenantData.phone}
                          onChange={(e) => setNewTenantData({ ...newTenantData, phone: e.target.value })}
                          placeholder="(11) 00000-0000"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Renda mensal</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newTenantData.monthlyIncome || ""}
                          onChange={(e) => setNewTenantData({ ...newTenantData, monthlyIncome: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Senha provisória *</Label>
                        <Input
                          type="password"
                          value={newTenantData.password}
                          onChange={(e) => setNewTenantData({ ...newTenantData, password: e.target.value })}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowNewTenantForm(false);
                          setNewTenantData({
                            fullName: "",
                            email: "",
                            password: "",
                            phone: "",
                            cpf: "",
                            monthlyIncome: 0,
                            employmentStatus: "",
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={async () => {
                          if (!newTenantData.fullName || !newTenantData.email || !newTenantData.password || !newTenantData.cpf) {
                            toast.error("Preencha todos os campos obrigatórios.");
                            return;
                          }
                          if (newTenantData.cpf.length !== 11) {
                            toast.error("CPF deve conter 11 dígitos.");
                            return;
                          }
                          await createTenant(newTenantData as CreateInquilinoPayload);
                        }}
                        loading={isCreatingTenant}
                        className="bg-[#FFD700] text-[#0F2240] hover:bg-[#FFD700]/90"
                      >
                        Cadastrar
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Select
                  value={applicantId}
                  onChange={(event) =>
                    form.setValue("applicantId", event.target.value)
                  }
                  options={[
                    { value: "", label: "Selecione um inquilino" },
                    ...(tenants ?? []).map((tenant) => ({
                      value: tenant.id,
                      label: tenant.fullName ?? tenant.email,
                    })),
                  ]}
                />
              )}
            </div>
          ) : null}

          {!isBroker ? (
            <div className="space-y-2">
              <Label>Corretor (opcional)</Label>
              <Select
                value={brokerId}
                onChange={(event) =>
                  form.setValue(
                    "brokerId",
                    event.target.value === "" ? undefined : event.target.value,
                  )
                }
                options={[
                  { value: "", label: "Sem corretor" },
                  ...(brokers ?? []).map((broker) => ({
                    value: broker.id,
                    label: broker.fullName ?? broker.email,
                  })),
                ]}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Renda mensal *</Label>
            <Input
              id="monthlyIncome"
              type="number"
              step="0.01"
              {...form.register("monthlyIncome", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyRentValue">Valor do aluguel mensal *</Label>
            <Input
              id="monthlyRentValue"
              type="number"
              step="0.01"
              {...form.register("monthlyRentValue", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractType">Tipo de contrato *</Label>
            <Select
              value={form.watch("contractType") || ""}
              onChange={(event) =>
                form.setValue("contractType", event.target.value as "COMERCIAL" | "RESIDENCIAL" | undefined)
              }
              options={[
                { value: "", label: "Selecione o tipo" },
                { value: "RESIDENCIAL", label: "Residencial" },
                { value: "COMERCIAL", label: "Comercial" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenantType">Tipo de inquilino *</Label>
            <Select
              value={form.watch("tenantType") || ""}
              onChange={(event) =>
                form.setValue("tenantType", event.target.value as "PF" | "PJ" | undefined)
              }
              options={[
                { value: "", label: "Selecione o tipo" },
                { value: "PF", label: "Pessoa Física (PF)" },
                { value: "PJ", label: "Pessoa Jurídica (PJ)" },
              ]}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="employmentStatus">Situação profissional</Label>
            <Input
              id="employmentStatus"
              placeholder="CLT, PJ, empreendedor, etc."
              {...form.register("employmentStatus")}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <Checkbox
              id="hasNegativeRecords"
              checked={hasNegativeRecords}
              onChange={(event) =>
                form.setValue("hasNegativeRecords", event.currentTarget.checked)
              }
            />
            <Label htmlFor="hasNegativeRecords" className="text-sm font-normal">
              Possuo restrições em órgãos de crédito (SPC/Serasa)
            </Label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notas adicionais</Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="Adicione observações relevantes sobre o locatário ou o imóvel."
              {...form.register("notes")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Documentos do cliente (opcional)</Label>
            <p className="text-xs text-slate-500 mb-2">
              Envie o contrato de locação e outros documentos relevantes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  disabled={isPending}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;
                    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx";
                    input.onchange = (e) => handleFileChange(e as any);
                    input.click();
                  }}
                  disabled={isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded border border-slate-200 bg-white p-3"
                    >
                      <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">
                            {doc.file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                            disabled={isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500">
                          {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Input
                          type="text"
                          placeholder="Descrição do documento (opcional)"
                          value={documentDescriptions[index] || ""}
                          onChange={(e) =>
                            setDocumentDescriptions({
                              ...documentDescriptions,
                              [index]: e.target.value,
                            })
                          }
                          disabled={isPending}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-500">
                Formatos aceitos: PDF, imagens (JPG, PNG), documentos Office (DOC, DOCX, XLS, XLSX).
                Máximo: 10MB por arquivo.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" loading={isPending}>
              Enviar solicitação
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

