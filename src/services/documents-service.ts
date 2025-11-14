import { request } from "@/lib/api-client";
import { Document } from "@/types/document";

export interface UploadDocumentPayload {
  file: File;
  description?: string;
}

export const uploadApplicationDocument = (
  applicationId: string,
  payload: UploadDocumentPayload,
) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.description) {
    formData.append("description", payload.description);
  }

  return request<Document>({
    method: "POST",
    url: `/applications/${applicationId}/documents`,
    data: formData,
    // Não definir Content-Type manualmente - deixar o axios detectar automaticamente
    // Isso permite que o axios defina o boundary correto para multipart/form-data
  });
};

export const getApplicationDocuments = (applicationId: string) =>
  request<Document[]>({
    method: "GET",
    url: `/applications/${applicationId}/documents`,
  });

export const downloadDocument = async (documentId: string) => {
  const response = await request<{ downloadUrl: string }>({
    method: "GET",
    url: `/documents/${documentId}/download`,
  });
  return response.downloadUrl;
};

export const deleteDocument = (documentId: string) =>
  request<void>({
    method: "DELETE",
    url: `/documents/${documentId}`,
  });

