import { NextRequest, NextResponse } from 'next/server';
import { getData } from '../data';
import { notFound } from 'next/navigation';
import { Project } from '@/entities/projects/types';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/projects/[id]'>) {
    const { id } = await ctx.params;

    console.log({
        id,
        data: getData()
    })

    const item = getData().find(item => item.id === +id);

    if (!item) {
        return notFound()
    }

    return NextResponse.json<Project>(item);
}
