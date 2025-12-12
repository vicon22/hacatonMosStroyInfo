import { ApiClient } from '@/shared/api';

type Payload = {
    username: string;
    password: string;
};

export type LoginResult = {
    ok: boolean;
};

export function login(payload: {
    username: string;
    password: string;
}) {
    return ApiClient.instance
        .post<Payload, LoginResult>('/auth/login', payload);
}
