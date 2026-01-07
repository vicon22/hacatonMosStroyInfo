import { ApiClient } from "@/shared/api";

type Payload = {
  email: string;
  password: string;
};

export type LoginResult = {
  ok: boolean;
};

export function login(payload: Payload) {
  return ApiClient.instance.post<Payload, LoginResult>("/auth/login", payload);
}
