import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { getMessagesByRoomIdQuery } from "./queries";
import { createMessage, root } from "./service";
import { CreateMessagePayload, Message } from "./types";

export function useMessagesByRoomId(roomId: string, options?: UseQueryOptions<Message[]>) {
  return useQuery<Message[]>({
    ...getMessagesByRoomIdQuery(roomId),
    ...options,
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMessagePayload) => createMessage(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [root, data.roomId] });
    },
  });
}
