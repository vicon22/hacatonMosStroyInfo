import { Blueprint } from '@/entities/blueprints/types';
import { NextRequest, NextResponse } from 'next/server';
import { data } from '../data';
import { notFound } from 'next/navigation';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/blueprints/[id]'>) {
    const { id } = await ctx.params;
    const item = data.find(item => item.id === +id);

    if (!item) {
        return notFound()
    }

    return NextResponse.json<Blueprint>(item);
}
