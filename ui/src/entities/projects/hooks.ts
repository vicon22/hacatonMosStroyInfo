import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
    getAllProjectsQuery,
    getProjectByIdQuery
} from './queries';
import { CreateProjectPayload, Project, ProjectID } from './types';
import { createProject, root } from './service';
import { getQueryClient } from '@/configs/queryClient';

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

export function useCreateProjectMutation(
    options?: UseMutationOptions<Project, Error, CreateProjectPayload>
) {
    return useMutation({
        mutationFn: createProject,
        ...options,
        onSuccess(project, ...rest) {
            options?.onSuccess?.apply(this, [project, ...rest]);

            getQueryClient().setQueryData([[root, project.id]], () => project);

            getQueryClient().setQueryData([root], (items: Project[]) => {
                return [
                    ...items,
                    project
                ]
            });
        },
    });
}