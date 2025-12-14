
import { ApiClient } from '@/shared/api';
import { CreateProjectPayload, Project, ProjectID } from '@/entities/projects/types';

export const root = '/projects';

export function getAll() {
    return ApiClient.instance
        .get<Project[]>(root);
}

export function getById(id: ProjectID) {
    return ApiClient.instance
        .get<Project>(`${root}/${id}`);
}

export function createProject(payload: CreateProjectPayload) {
    return ApiClient.instance
        .post<CreateProjectPayload, Project>(root, payload);
}
