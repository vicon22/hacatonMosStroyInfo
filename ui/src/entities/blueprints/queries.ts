import { skip } from "node:test";
import { root, getAll, getById } from "./service";
import { BlueprintID } from "./types";

export const getAllBlueprintsQuery = () => ({
  queryKey: [root],
  queryFn: getAll,
});

export const getBlueprintByIdQuery = (id: BlueprintID) => ({
  queryKey: [root, id],
  queryFn: async () => {
    return await getById(id);
  },
});
