import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('fm_session');

    try {
        const response = await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Cookie': sessionCookie ? `fm_session=${sessionCookie.value}` : '',
            },
        });

        const nextResponse = NextResponse.json(null, { status: response.status });

        // Получаем все Set-Cookie заголовки из ответа бэкенда
        const setCookieHeaders = response.headers.getSetCookie();
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach(cookie => {
                nextResponse.headers.append('Set-Cookie', cookie);
            });
        } else {
            // Если бэкенд не вернул cookie, удаляем её вручную
            nextResponse.cookies.delete('fm_session');
        }

        return nextResponse;
    } catch (error) {
        console.error('[LOGOUT] Error:', error);
        // Даже если бэкенд недоступен, удаляем cookie на клиенте
        const nextResponse = NextResponse.json(null, { status: 200 });
        nextResponse.cookies.delete('fm_session');
        return nextResponse;
    }
}