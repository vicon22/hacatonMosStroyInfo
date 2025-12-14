import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type RouteContext = {
    params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
    const { id } = await ctx.params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');

    try {
        const response = await fetch(`${API_URL}/api/blueprints/${id}`, {
            method: 'GET',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
        });

        if (response.status === 404) {
            return notFound();
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch blueprint' }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[BLUEPRINT API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('fetch failed')) {
            return NextResponse.json(
                { error: 'Backend server is not available' }, 
                { status: 503 }
            );
        }
        
        return NextResponse.json(
            { error: errorMessage }, 
            { status: 500 }
        );
    }
}
