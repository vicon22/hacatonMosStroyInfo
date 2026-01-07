import { root, getAll, getById } from "./service";
import { ProjectID } from "./types";

export const getAllProjectsQuery = () => ({
  queryKey: [root],
  queryFn: getAll,
});

export const getProjectByIdQuery = (id: ProjectID) => ({
  queryKey: [root, id],
  queryFn: () => getById(id),
});
