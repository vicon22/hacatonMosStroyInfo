import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');

    try {
        const response = await fetch(`${API_URL}/api/projects`, {
            method: 'GET',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch projects' }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[PROJECTS API] Error:', error);
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

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');
    const body = await request.json();

    try {
        const response = await fetch(`${API_URL}/api/projects/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
            body: JSON.stringify({
                blueprintId: body.blueprintId,
                title: body.title,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[PROJECTS API] Error creating project:', error);
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
