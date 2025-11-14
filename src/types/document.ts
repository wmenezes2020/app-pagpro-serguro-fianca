export interface Document {
  id: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  blobUrl: string;
  blobContainer: string;
  blobName: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  description?: string;
  uploadedBy: {
    id: string;
    email: string;
    fullName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

