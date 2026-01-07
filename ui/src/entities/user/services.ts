import { ApiClient } from "@/shared/api";
import { UserData } from "./types";

export const root = "/users";

export function getById(id: string) {
  return ApiClient.instance.get<UserData>(`${root}/${id}`);
}
