import { ApiClient } from "@/shared/api";
import { CreateMessagePayload, Message } from "./types";

export const root = "/messages";

export function getByRoomId(roomId: string) {
  return ApiClient.instance.get<Message[]>(`${root}?roomId=${encodeURIComponent(roomId)}`);
}

export function createMessage(payload: CreateMessagePayload) {
  return ApiClient.instance.post<CreateMessagePayload, Message>(root, payload);
}
