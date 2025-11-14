"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { createApplication } from "@/services/applications-service";
import { listProperties } from "@/services/properties-service";
import { listUsers } from "@/services/users-service";
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
import { Upload, X, FileText } from "lucide-react";

type ApplicationFormValues = {
  propertyId: string;
  applicantId?: string;
  brokerId?: string;
  monthlyIncome: number;
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

  const form = useForm<ApplicationFormValues>({
    defaultValues: {
      propertyId: "",
      applicantId: isTenant ? authState.user?.id : "",
      brokerId: isBroker ? authState.user?.id : "",
      monthlyIncome: 0,
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

  const isPending = isCreating || isUploading;

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
            <div className="space-y-2">
              <Label>Inquilino</Label>
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
            <Label htmlFor="monthlyIncome">Renda mensal</Label>
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

