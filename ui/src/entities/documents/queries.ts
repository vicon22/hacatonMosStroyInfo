import { root, getAll, getById } from "./service";
import { DocumentID } from "./types";

export const getAllDocumentsQuery = () => ({
  queryKey: [root],
  queryFn: getAll,
});

export const getDocumentByIdQuery = (id: DocumentID) => ({
  queryKey: [root, id],
  queryFn: async () => {
    return await getById(id);
  },
});
