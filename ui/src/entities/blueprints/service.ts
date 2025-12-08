
import { ApiClient } from '@/shared/api';
import { Blueprint, BlueprintID } from './types';

export const root = '/blueprints';

export function getAll() {
  return ApiClient.instance
    .get<Blueprint[]>(root);
}

export function getById(id: BlueprintID) {
  return ApiClient.instance
    .get<Blueprint>(`${root}/${id}`);
}