import { Project, ProjectStatus } from '@/entities/projects/types';

export const data: Project[] = [
    {
        id: 187346782,
        blueprint_id: 101,
        title: 'Коттедж',
        status: ProjectStatus.new,
    },
    {
        id: 723674672,
        blueprint_id: 201,
        title: 'Баня',
        status: ProjectStatus.approval,
    },
    {
        id: 8726534889,
        blueprint_id: 103,
        title: 'Гостевой дом',
        status: ProjectStatus.pending,
    },
    {
        id: 1623746844,
        blueprint_id: 302,
        title: 'Сарай',
        status: ProjectStatus.completed
    },
    {
        id: 872241777,
        blueprint_id: 402,
        title: 'Гараж',
        status: ProjectStatus.completed
    }
];