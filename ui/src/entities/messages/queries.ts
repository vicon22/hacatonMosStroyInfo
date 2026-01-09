import { root, getByRoomId } from "./service";

export const getMessagesByRoomIdQuery = (roomId: string) => ({
  queryKey: [root, roomId],
  queryFn: () => getByRoomId(roomId),
});
