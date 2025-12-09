'use client'

import { useAllProjects } from "@/entities/projects/hooks";
import { Table as UITable} from "@gravity-ui/uikit";
import { memo } from "react";

export const Table = memo(function Table() {
    const projects = useAllProjects();
    return (
        <UITable
            columns={[
                {id: 'id'},
                {id: 'title'},
                {id: 'status'},
                {id: 'blueprint_id'}
            ]}
            data={projects.data || []}
        />
    )
})