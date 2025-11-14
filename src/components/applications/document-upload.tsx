"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadApplicationDocument } from "@/services/documents-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface DocumentUploadProps {
  applicationId: string;
}

export function DocumentUpload({ applicationId }: DocumentUploadProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const { mutateAsync: upload, isPending } = useMutation({
    mutationFn: (payload: { file: File; description?: string }) =>
      uploadApplicationDocument(applicationId, payload),
    onSuccess: () => {
      toast.success("Documento enviado com sucesso!");
      setFile(null);
      setDescription("");
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId, "documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erro ao enviar documento",
      );
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo: 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione um arquivo");
      return;
    }
    await upload({ file, description: description || undefined });
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Enviar documento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                disabled={isPending}
              />
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-slate-600">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Ex: RG frente e verso, comprovante de renda, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
          <Button type="submit" disabled={!file || isPending} loading={isPending}>
            <Upload className="mr-2 h-4 w-4" />
            Enviar documento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

