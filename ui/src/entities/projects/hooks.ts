import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
    getAllProjectsQuery,
    getProjectByIdQuery
} from './queries';
import { Project, ProjectID } from './types';

export function useAllProjects(
    options?: UseQueryOptions<Project[]>
) {

    return useQuery<Project[]>({
        ...getAllProjectsQuery(),
        ...options
    });
}

export function useProjectById(
    id: ProjectID,
    options?: Partial<UseQueryOptions<Project>>
) {
    return useQuery<Project>({
        ...getProjectByIdQuery(id),
        ...options
    });
}