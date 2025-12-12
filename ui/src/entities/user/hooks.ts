import {
  QueryObserverOptions,
  useQuery,
} from '@tanstack/react-query';
import { UserData } from './types';
import { getSelfUserQuery } from './queries';

export function useSelfUserData(
  options?: QueryObserverOptions<UserData>
) {
  return useQuery<UserData>({
    ...getSelfUserQuery(),
    ...options
  });
}

