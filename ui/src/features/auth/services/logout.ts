import { ApiClient } from "@/shared/api";

export function logout() {
  return ApiClient.instance.post<null, null>("/auth/logout", null);
}
