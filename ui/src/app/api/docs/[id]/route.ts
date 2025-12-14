import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type RouteContext<T extends string> = {
    params: Promise<Record<T extends `${string}[${infer Param}]${infer Rest}` ? Param | Rest extends `[${infer NextParam}]${infer NextRest}` ? NextParam : never : never, string>>
}

export async function GET(request: NextRequest, ctx: RouteContext<'/api/docs/[id]'>) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');
    const { id } = await ctx.params;

    try {
        const response = await fetch(`${API_URL}/api/docs/${id}`, {
            method: 'GET',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Document not found' }, { status: response.status });
        }

        const blob = await response.blob();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const contentDisposition = response.headers.get('content-disposition');

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        if (contentDisposition) {
            headers.set('Content-Disposition', contentDisposition);
        }

        return new NextResponse(blob, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error downloading document:', error);
        return NextResponse.json({ error: 'Failed to download document' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, ctx: RouteContext<'/api/docs/[id]'>) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');
    const { id } = await ctx.params;

    try {
        const response = await fetch(`${API_URL}/api/docs/${id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to delete document' }, { status: response.status });
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error('Error deleting document:', error);
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}
