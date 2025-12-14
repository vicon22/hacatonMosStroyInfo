import { CreateProjectPayload, Project, ProjectStatus } from '@/entities/projects/types';
import { NextRequest, NextResponse } from 'next/server';
import { data, getData } from './data';

export async function GET() {
    return NextResponse.json<Project[]>(getData());
}

export async function POST(request: NextRequest) { 
    const body: CreateProjectPayload = await request.json();
    const item: Project = {
        id: Math.floor(Math.random() * 100000),
        status: ProjectStatus.new,
        title: body.title,
        blueprint_id: Number(body.blueprintId),
        translations: [],
    }

    data.push(item);

    console.log({data})

    return NextResponse.json<Project>(item);
}
