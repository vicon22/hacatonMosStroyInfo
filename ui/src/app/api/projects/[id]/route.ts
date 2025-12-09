import { NextRequest, NextResponse } from 'next/server';
import { data } from '../data';
import { notFound } from 'next/navigation';
import { Project } from '@/entities/projects/types';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/projects/[id]'>) {
    const { id } = await ctx.params;
    const item = data.find(item => item.id === +id);

    if (!item) {
        return notFound()
    }

    return NextResponse.json<Project>(item);
}
