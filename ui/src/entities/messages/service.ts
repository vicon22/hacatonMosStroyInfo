
import { ApiClient } from '@/shared/api';
import { Message } from './types';

export const root = '/messages';

export function getAll() {
  return ApiClient.instance
    .get<Message[]>(root);
}
