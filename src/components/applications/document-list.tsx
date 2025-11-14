"use client";

import { useQuery } from "@tanstack/react-query";
import { getApplicationDocuments, downloadDocument, deleteDocument } from "@/services/documents-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Download, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DocumentListProps {
  applicationId: string;
}

export function DocumentList({ applicationId }: DocumentListProps) {
  const queryClient = useQueryClient();
  const { data: documents, isLoading } = useQuery({
    queryKey: ["applications", applicationId, "documents"],
    queryFn: () => getApplicationDocuments(applicationId),
  });

  const { mutateAsync: deleteDoc } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success("Documento excluído com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId, "documents"],
      });
    },
    onError: () => {
      toast.error("Erro ao excluir documento");
    },
  });

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const url = await downloadDocument(documentId);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Erro ao baixar documento");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-8 text-center text-sm text-slate-500">
          Carregando documentos...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Documentos anexados</CardTitle>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-900">
                      {doc.originalFileName}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {doc.description || "--"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatFileSize(doc.size)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(doc.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc.id, doc.originalFileName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDoc(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            Nenhum documento anexado ainda.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

