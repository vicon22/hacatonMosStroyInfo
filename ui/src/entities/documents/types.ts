export type DocumentID = string | number;

export enum DocumentStatus {
  new = "NEW",
  onReview = "ON_REVIEW",
  reviewed = "REVIEWED",
}

export type Document = {
  id: DocumentID;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  projectId: string;
  projectTitle: string;
  status: DocumentStatus;
  uploadedAt: string;
};

export type ReviewFilePayload = {
  id: DocumentID;
  status: DocumentStatus;
};
