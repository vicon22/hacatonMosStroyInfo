import { MutationOptions, useMutation } from '@tanstack/react-query';

import { login, LoginResult } from './services/login';
import { logout } from './services/logout';
import { getQueryClient } from '@/configs/queryClient';
import { selfUserQueryKey } from '@/entities/user/queries';

interface Error {
    httpCode: number | undefined;
}

export function useLoginMutation(
    options?: MutationOptions<LoginResult, Error, { email: string, password: string }>
) {
    return useMutation({
        mutationFn: login,
        ...options,
        onSuccess(...args) {
            options?.onSuccess?.apply(this, args);
            getQueryClient().invalidateQueries({
                queryKey: [selfUserQueryKey]
            })
        },
    });
}

export function useLogoutMutation(
    options?: MutationOptions<null, Error>
) {
    return useMutation({
        mutationFn: logout,
        ...options,
        onSuccess(...args) {
            options?.onSuccess?.apply(this, args);
            getQueryClient().invalidateQueries({
                queryKey: [selfUserQueryKey]
            })
        },
    });
}
