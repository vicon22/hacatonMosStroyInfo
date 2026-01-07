import { ApiClient } from "@/shared/api";
import { Document, DocumentID, ReviewFilePayload } from "./types";

export const root = "/docs";

export async function getAll() {
  return ApiClient.instance.get<Document[]>(root);
}

export function getById(id: DocumentID) {
  return ApiClient.instance.get<Document>(`${root}/${id}`);
}

export function deleteById(id: DocumentID) {
  return ApiClient.instance.delete<void>(`${root}/${id}`);
}

export function patchStatusById(payload: ReviewFilePayload) {
  return ApiClient.instance.patch<Pick<Document, "status">, Document>(
    `${root}/${payload.id}/status`,
    { status: payload.status },
  );
}
