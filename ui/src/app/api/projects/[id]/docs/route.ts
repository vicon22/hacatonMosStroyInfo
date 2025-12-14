import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type RouteContext = {
    params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');
    const { id } = await context.params;

    try {
        const formData = await request.formData();

        const response = await fetch(`${API_URL}/api/projects/${id}/docs`, {
            method: 'POST',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', response.status, errorText);
            return NextResponse.json({ error: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error uploading document:', error);
        return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
    }
}

export async function GET(_request: NextRequest, context: RouteContext) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');
    const { id } = await context.params;

    try {
        const response = await fetch(`${API_URL}/api/projects/${id}/docs`, {
            method: 'GET',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch documents' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching project documents:', error);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}
