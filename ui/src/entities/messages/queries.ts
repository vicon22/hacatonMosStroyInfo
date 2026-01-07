import { root, getAll } from "./service";

export const getAllMessagesQuery = () => ({
  queryKey: [root],
  queryFn: getAll,
});
