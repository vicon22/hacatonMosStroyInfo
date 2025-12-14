import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type RouteContext = {
    params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, ctx: RouteContext) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');
    const { id } = await ctx.params;

    try {
        const body = await request.json();

        const response = await fetch(`${API_URL}/api/docs/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to update status' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating document status:', error);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}
