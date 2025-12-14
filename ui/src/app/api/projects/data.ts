import { Project, ProjectStatus } from '@/entities/projects/types';

export const data: Project[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        blueprint_id: 101,
        title: 'Коттедж',
        status: ProjectStatus.pending,
        translations: [
            {
                title: 'С каски прораба',
                url: 'https://dash.akamaized.net/akamai/gpac/motion/motion-20120802-manifest.mpd'
            },
            {
                title: 'С башни крана',
                url: 'https://dash.akamaized.net/akamai/nba/running_timecode_1509kbps_dash.mpd'
            },
            {
                title: 'С ворот участка',
                url: 'https://dash.akamaized.net/akamai/rlabonte/ED_master33.mpd'
            },
            {
                title: 'С высоты птичьего полета',
                url: 'https://dash.akamaized.net/akamai/redbull/kluge/Red_Bull_Kluge.mpd'
            }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        blueprint_id: 201,
        title: 'Баня',
        status: ProjectStatus.approval,
        translations: [
            {
                title: 'С каски прораба',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С башни крана',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С ворот участка',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С высоты птичьего полета',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        blueprint_id: 103,
        title: 'Гостевой дом',
        status: ProjectStatus.new,
        translations: [
            {
                title: 'С каски прораба',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С башни крана',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С ворот участка',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С высоты птичьего полета',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        blueprint_id: 302,
        title: 'Сарай',
        status: ProjectStatus.completed,
        translations: [
            {
                title: 'С каски прораба',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С башни крана',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С ворот участка',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С высоты птичьего полета',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        blueprint_id: 402,
        title: 'Гараж',
        status: ProjectStatus.completed,
        translations: [
            {
                title: 'С каски прораба',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С башни крана',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С ворот участка',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
                title: 'С высоты птичьего полета',
                url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            }
        ]
    }
];

export function getData() {
    return data;
}