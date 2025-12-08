export type ProjectID = string | number;

export enum ProjectStatus {
    new = 'new',
    approval = 'approval',
    pending = 'pending',
    completed = 'completed'
}

export type Project = {
    id: ProjectID;
    title: string;
    status: ProjectStatus,
    blueprint_id: number;
}