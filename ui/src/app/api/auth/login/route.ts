import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
    const data = await request.json();

    console.log('[LOGIN] Request data:', data);

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.username,
                password: data.password,
            }),
        });

        console.log('[LOGIN] Backend response status:', response.status);

        if (!response.ok) {
            return NextResponse.json({ ok: false }, { status: response.status });
        }

        const result = await response.json();
        console.log('[LOGIN] Backend result:', result);

        const setCookieHeader = response.headers.get('set-cookie');
        console.log('[LOGIN] Set-Cookie header:', setCookieHeader);

        const nextResponse = NextResponse.json({ ok: result.ok });

        if (setCookieHeader && result.ok) {
            nextResponse.headers.set('Set-Cookie', setCookieHeader);
        }

        return nextResponse;
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}