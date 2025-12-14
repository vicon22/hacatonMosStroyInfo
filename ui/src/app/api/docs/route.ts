import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');

    console.log('[DOCS API] Session cookie:', sessionCookie);
    console.log('[DOCS API] Cookie value:', sessionCookie?.value);

    try {
        const response = await fetch(`${API_URL}/api/docs`, {
            method: 'GET',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
        });

        console.log('[DOCS API] Response status:', response.status);

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch documents' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}
