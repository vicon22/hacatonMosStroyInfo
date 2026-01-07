import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { getAllDocumentsQuery, getDocumentByIdQuery } from "./queries";
import { Document, DocumentID, ReviewFilePayload } from "./types";
import { getQueryClient } from "@/configs/queryClient";
import { root, deleteById, patchStatusById } from "./service";

export function useAllDocuments(options?: UseQueryOptions<Document[]>) {
  return useQuery<Document[]>({
    ...getAllDocumentsQuery(),
    ...options,
  });
}

export function useDocumentById(
  id: DocumentID,
  options?: Partial<UseQueryOptions<Document>>,
) {
  return useQuery<Document>({
    ...getDocumentByIdQuery(id),
    ...options,
  });
}

export function useReviewDocumentMutation(
  options?: UseMutationOptions<Document, Error, ReviewFilePayload>,
) {
  return useMutation({
    mutationFn: patchStatusById,
    ...options,
    onSuccess() {
      getQueryClient().refetchQueries({
        queryKey: [root],
      });
    },
  });
}

export function useDeleteDocumentMutation(
  options?: UseMutationOptions<void, Error, DocumentID>,
) {
  return useMutation({
    mutationFn: deleteById,
    ...options,
    onMutate(id) {
      getQueryClient().setQueryData([root], (items: Document[]) => {
        return items.filter((item) => item.id !== id);
      });
    },
  });
}
