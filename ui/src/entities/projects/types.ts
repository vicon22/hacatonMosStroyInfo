export type ProjectID = string | number;


export type CreateProjectPayload = {
    title: string;
    blueprint_id: string;
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
    blueprint_id: string;
    stream_urls: string[];
    documents: string[];
}