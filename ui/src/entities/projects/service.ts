import { ApiClient } from "@/shared/api";
import {
  ChangeProjectStatusPayload,
  CreateProjectPayload,
  Project,
  ProjectID,
  UploadProjectFilePayload,
} from "@/entities/projects/types";

export const root = "/projects";

export function getAll() {
  return ApiClient.instance.get<Project[]>(root);
}

export function getById(id: ProjectID) {
  return ApiClient.instance.get<Project>(`${root}/${id}`);
}

export function createProject(payload: CreateProjectPayload) {
  return ApiClient.instance.post<CreateProjectPayload, Project>(
    `${root}/create`,
    payload,
  );
}

export function setProjectStatus(payload: ChangeProjectStatusPayload) {
  return ApiClient.instance.patch<ChangeProjectStatusPayload, Project>(
    `${root}/${payload.id}/status`,
    payload,
  );
}

export function uploadFileForId(payload: UploadProjectFilePayload) {
  return Promise.all(
    payload.files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);

      return ApiClient.instance.post<FormData, void>(
        `${root}/${payload.id}/docs`,
        formData,
      );
    }),
  );
}
