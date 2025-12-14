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

        const nextResponse = NextResponse.json({ ok: result.ok });

        // Получаем все Set-Cookie заголовки из ответа бэкенда
        const setCookieHeaders = response.headers.getSetCookie();
        console.log('[LOGIN] Set-Cookie headers:', setCookieHeaders);

        // Устанавливаем cookies в ответ Next.js
        if (setCookieHeaders && setCookieHeaders.length > 0 && result.ok) {
            setCookieHeaders.forEach(cookie => {
                nextResponse.headers.append('Set-Cookie', cookie);
            });
        }

        return nextResponse;
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Если бэкенд недоступен (ECONNREFUSED), возвращаем понятную ошибку
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('fetch failed')) {
            console.error('[LOGIN] Backend is not available. Make sure the API server is running on port 8080');
            return NextResponse.json(
                { ok: false, error: 'Backend server is not available' }, 
                { status: 503 }
            );
        }
        
        return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
    }
}