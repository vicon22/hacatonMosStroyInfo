import { Project, ProjectStatus } from '@/entities/projects/types';

export const data: Project[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        blueprint_id: 101,
        title: 'Коттедж',
        status: ProjectStatus.new,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        blueprint_id: 201,
        title: 'Баня',
        status: ProjectStatus.approval,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        blueprint_id: 103,
        title: 'Гостевой дом',
        status: ProjectStatus.pending,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        blueprint_id: 302,
        title: 'Сарай',
        status: ProjectStatus.completed
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        blueprint_id: 402,
        title: 'Гараж',
        status: ProjectStatus.completed
    }
];