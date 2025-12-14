'use client'

import { useProjectById } from '@/entities/projects/hooks';
import { memo} from 'react'
import { ProjectStatus } from '@/entities/projects/types';
import { Approval } from './components/Approval/Approval';
import { Construction } from './components/Construction/Construction';
import { Confirmation } from './components/Confirmation/Confirmation';

type SummaryProps = {
    id: string;
}

export const Summary = memo(function Summary({ id }: SummaryProps) {
    const project = useProjectById(id);

    if (project.data?.status === ProjectStatus.new || project.data?.status === ProjectStatus.approval) {
        return <Approval id={id}/>
    }

    if (project.data?.status === ProjectStatus.pending) {
        return <Construction id={id}/>
    }

    return <Confirmation id={id}/>
})
