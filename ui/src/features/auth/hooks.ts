import { MutationOptions, useMutation } from '@tanstack/react-query';

import { login, LoginResult } from './services/login';
import { logout } from './services/logout';

interface Error {
  httpCode: number | undefined;
}

export function useLoginMutation(
  options?: MutationOptions<LoginResult, Error, { username: string, password: string }>
) {
  return useMutation({
    mutationFn: login,
    ...options
  });
}

export function useLogoutMutation(
  options?: MutationOptions<null, Error>
) {
  return useMutation({
    mutationFn: logout,
    ...options
  });
}
