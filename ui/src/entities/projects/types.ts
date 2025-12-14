export type ProjectID = string | number;


export type CreateProjectPayload = {
    title: string;
    address: string;
    blueprintId: string;
}

export enum ProjectStatus {
    new = 'new',
    approval = 'approval',
    pending = 'pending',
    completed = 'completed'
}

export type ProjectVideo = {
    title: string;
    url: string;
}

export type Project = {
    id: ProjectID;
    title: string;
    status: ProjectStatus,
    blueprint_id: number;
    translations: ProjectVideo[];
}