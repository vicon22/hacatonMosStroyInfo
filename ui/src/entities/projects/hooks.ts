import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { getAllProjectsQuery, getProjectByIdQuery } from "./queries";
import {
  ChangeProjectStatusPayload,
  CreateProjectPayload,
  Project,
  ProjectID,
  UploadProjectFilePayload,
} from "./types";
import {
  createProject,
  root,
  setProjectStatus,
  uploadFileForId,
} from "./service";
import { getQueryClient } from "@/configs/queryClient";
import { root as docsRoot } from "../documents/service";

export function useAllProjects(options?: UseQueryOptions<Project[]>) {
  return useQuery<Project[]>({
    ...getAllProjectsQuery(),
    ...options,
  });
}

export function useProjectById(
  id: ProjectID,
  options?: Partial<UseQueryOptions<Project>>,
) {
  return useQuery<Project>({
    ...getProjectByIdQuery(id),
    ...options,
  });
}

export function useCreateProjectMutation(
  options?: UseMutationOptions<Project, Error, CreateProjectPayload>,
) {
  return useMutation({
    mutationFn: createProject,
    ...options,
    onSuccess(project, ...rest) {
      options?.onSuccess?.apply(this, [project, ...rest]);

      getQueryClient().setQueryData([root, project.id], project);
      getQueryClient().setQueryData([root], (items: Project[]) => [
        ...items,
        project,
      ]);
    },
  });
}

export function useUploadProjectFileMutation(
  options?: UseMutationOptions<void[], Error, UploadProjectFilePayload>,
) {
  return useMutation({
    mutationFn: uploadFileForId,
    ...options,
    onSuccess(project, ...rest) {
      options?.onSuccess?.apply(this, [project, ...rest]);

      getQueryClient().refetchQueries({
        queryKey: [docsRoot],
      });
    },
  });
}

export function useChangeProjectStatusMutation(
  options?: UseMutationOptions<Project, Error, ChangeProjectStatusPayload>,
) {
  return useMutation({
    mutationFn: setProjectStatus,
    ...options,
    onSuccess(project, ...rest) {
      options?.onSuccess?.apply(this, [project, ...rest]);

      getQueryClient().setQueryData([root, project.id], project);
    },
  });
}
