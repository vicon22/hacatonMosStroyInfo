
import { ApiClient } from '@/shared/api';
import { Project, ProjectID } from '@/entities/projects/types';

export const root = '/projects';

export function getAll() {
  return ApiClient.instance
    .get<Project[]>(root);
}

export function getById(id: ProjectID) {
  return ApiClient.instance
    .get<Project>(`${root}/${id}`);
}